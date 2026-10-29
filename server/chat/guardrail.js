import mongoose from "mongoose"

/**
 * The guardrail turns a model-authored query into a query we are willing to run,
 * or rejects it. Nothing here calls an LLM: the model proposes, this file disposes.
 *
 * Rules enforced:
 *   1. collection allowlist          4. userId forced on personal collections
 *   2. field allowlist per collection 5. hard limit + result cap
 *   3. operator allowlist            6. $regex downgraded to a literal substring
 */

const OBJECT_ID_FIELDS = new Set(["_id", "userId", "productId", "category", "subCategory", "delivery_address"])

/** Collections the assistant may read, and the fields it may touch on each. */
const COLLECTIONS = {
    products: {
        model: "product",
        scopeToUser: false,
        fields: new Set([
            "_id", "name", "description", "unit", "stock", "price", "discount",
            "publish", "category", "subCategory", "createdAt", "_effectivePrice",
        ]),
        // returned to the caller (and, trimmed, to the model)
        projection: {
            name: 1, description: 1, unit: 1, stock: 1, price: 1, discount: 1,
            image: 1, category: 1, subCategory: 1, _effectivePrice: 1,
        },
    },
    categories: {
        model: "category",
        scopeToUser: false,
        fields: new Set(["_id", "name", "createdAt"]),
        projection: { name: 1, image: 1 },
    },
    subCategories: {
        model: "subCategory",
        scopeToUser: false,
        fields: new Set(["_id", "name", "category", "createdAt"]),
        projection: { name: 1, image: 1, category: 1 },
    },
    orders: {
        model: "order",
        scopeToUser: true,
        fields: new Set([
            "_id", "userId", "orderId", "productId", "payment_status",
            "totalAmt", "subTotalAmt", "createdAt",
        ]),
        projection: {
            orderId: 1, product_details: 1, payment_status: 1,
            totalAmt: 1, subTotalAmt: 1, createdAt: 1,
        },
    },
    addresses: {
        model: "address",
        scopeToUser: true,
        fields: new Set([
            "_id", "userId", "city", "state", "pincode", "country", "status", "createdAt",
        ]),
        projection: {
            address_line: 1, city: 1, state: 1, pincode: 1, country: 1, mobile: 1, status: 1,
        },
    },
    cartItems: {
        model: "cartProduct",
        scopeToUser: true,
        fields: new Set(["_id", "userId", "productId", "quantity", "createdAt"]),
        projection: { productId: 1, quantity: 1 },
    },
}

/** Operators the model may use. Everything else is rejected. */
const ALLOWED_OPERATORS = new Set([
    "$eq", "$ne", "$gt", "$gte", "$lt", "$lte",
    "$in", "$nin", "$and", "$or", "$nor", "$not",
    "$exists", "$regex", "$options", "$size", "$all", "$elemMatch",
])

/**
 * Explicitly named so the rejection message is useful. $where and $function
 * execute JavaScript inside MongoDB; $out/$merge write; $lookup crosses
 * collections and would escape the per-collection field allowlist.
 */
const FORBIDDEN_OPERATORS = new Set([
    "$where", "$function", "$accumulator", "$expr", "$jsonSchema",
    "$out", "$merge", "$lookup", "$graphLookup", "$unionWith", "$facet",
])

const MAX_LIMIT = 20
const DEFAULT_LIMIT = 10
const MAX_DEPTH = 6
const MAX_KEYS = 40
const MAX_STRING_LENGTH = 120

const fail = (error) => ({ ok: false, error })

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

const isPlainObject = (value) =>
    typeof value === "object" && value !== null && !Array.isArray(value)

const castValue = (field, value) => {
    if (OBJECT_ID_FIELDS.has(field) && typeof value === "string" && mongoose.isValidObjectId(value)) {
        return new mongoose.Types.ObjectId(value)
    }
    return value
}

/** Leaf values may only be primitives, or arrays of primitives. */
const checkLeaf = (value) => {
    if (value === null) return null
    const type = typeof value
    if (type === "string") {
        if (value.length > MAX_STRING_LENGTH) return `string longer than ${MAX_STRING_LENGTH} characters`
        // e.g. "$gt:0" — an operator written as a string. Harmless, but it silently
        // matches nothing, so reject it and let the model correct itself.
        if (value.trim().startsWith("$")) {
            return `operator written as a string ("${value}") — write it as an object, e.g. {"$gt": 0}`
        }
        return null
    }
    if (type === "number" || type === "boolean") return null
    if (Array.isArray(value)) {
        if (value.length > 50) return "array with more than 50 items"
        for (const item of value) {
            const problem = checkLeaf(item)
            if (problem) return problem
        }
        return null
    }
    return `unsupported value type "${type}"`
}

/**
 * Walks the filter, validating field names, operators and values, and returns a
 * sanitised copy. `field` carries the field name currently in scope so values
 * can be cast to ObjectId where the schema expects one.
 */
const sanitiseFilter = (node, allowedFields, depth, state, field = null) => {
    if (depth > MAX_DEPTH) return fail("filter is nested too deeply")
    if (!isPlainObject(node)) return fail("filter must be an object")

    const output = {}

    for (const [key, value] of Object.entries(node)) {
        if (++state.keys > MAX_KEYS) return fail("filter has too many conditions")

        // ---- operator key ------------------------------------------------
        if (key.startsWith("$")) {
            if (FORBIDDEN_OPERATORS.has(key)) return fail(`operator "${key}" is not allowed`)
            if (!ALLOWED_OPERATORS.has(key)) return fail(`unknown operator "${key}"`)

            if (key === "$and" || key === "$or" || key === "$nor") {
                if (!Array.isArray(value)) return fail(`"${key}" expects an array`)
                if (value.length > 10) return fail(`"${key}" has too many branches`)
                const branches = []
                for (const branch of value) {
                    const result = sanitiseFilter(branch, allowedFields, depth + 1, state)
                    if (!result.ok) return result
                    branches.push(result.filter)
                }
                output[key] = branches
                continue
            }

            if (key === "$not" || key === "$elemMatch") {
                const result = sanitiseFilter(value, allowedFields, depth + 1, state, field)
                if (!result.ok) return result
                output[key] = result.filter
                continue
            }

            // $regex is downgraded to a literal, case-insensitive substring match.
            // Model-authored regexes are a denial-of-service risk (catastrophic
            // backtracking), and every real query here is "name contains X".
            if (key === "$regex") {
                if (typeof value !== "string") return fail("$regex expects a string")
                if (value.length > 64) return fail("$regex pattern is too long")
                output.$regex = escapeRegex(value)
                output.$options = "i"
                continue
            }
            if (key === "$options") continue // set by us, above

            const problem = checkLeaf(value)
            if (problem) return fail(`value for "${key}": ${problem}`)
            output[key] = Array.isArray(value)
                ? value.map(item => castValue(field, item))
                : castValue(field, value)
            continue
        }

        // ---- field key ---------------------------------------------------
        if (key.includes("$") || key.includes(".")) {
            return fail(`field "${key}" is not queryable`)
        }
        if (!allowedFields.has(key)) {
            return fail(`field "${key}" is not queryable — allowed: ${[...allowedFields].join(", ")}`)
        }

        if (isPlainObject(value)) {
            const result = sanitiseFilter(value, allowedFields, depth + 1, state, key)
            if (!result.ok) return result
            output[key] = result.filter
            continue
        }

        const problem = checkLeaf(value)
        if (problem) return fail(`value for "${key}": ${problem}`)
        output[key] = Array.isArray(value)
            ? value.map(item => castValue(key, item))
            : castValue(key, value)
    }

    return { ok: true, filter: output }
}

const sanitiseSort = (sort, allowedFields) => {
    if (sort === undefined || sort === null || sort === "") return { ok: true, sort: { createdAt: -1 } }
    if (!isPlainObject(sort)) return fail("sort must be an object")

    const keys = Object.keys(sort)
    if (keys.length > 2) return fail("sort accepts at most 2 fields")

    const output = {}
    for (const key of keys) {
        if (!allowedFields.has(key)) return fail(`cannot sort by "${key}"`)
        const direction = Number(sort[key])
        if (direction !== 1 && direction !== -1) return fail(`sort direction for "${key}" must be 1 or -1`)
        output[key] = direction
    }
    return { ok: true, sort: output }
}

/**
 * @param {object} request  { collection, filter, sort, limit } as proposed by the model
 * @param {object} context  { userId } — from the JWT, never from the model
 */
export const validatePlan = (request, context = {}) => {
    const { collection, filter, sort, limit } = request || {}

    const spec = COLLECTIONS[collection]
    if (!spec) {
        return fail(`collection "${collection}" is not available — choose one of: ${Object.keys(COLLECTIONS).join(", ")}`)
    }

    if (spec.scopeToUser && !context.userId) {
        return fail(`"${collection}" holds personal data and the shopper is not logged in — ask them to log in instead`)
    }

    let parsedFilter = filter
    if (typeof filter === "string") {
        if (filter.trim() === "") {
            parsedFilter = {}
        } else {
            try {
                parsedFilter = JSON.parse(filter)
            } catch {
                return fail("filter is not valid JSON")
            }
        }
    }
    if (parsedFilter === undefined || parsedFilter === null) parsedFilter = {}

    const result = sanitiseFilter(parsedFilter, spec.fields, 0, { keys: 0 })
    if (!result.ok) return result

    let parsedSort = sort
    if (typeof sort === "string") {
        if (sort.trim() === "") {
            parsedSort = null
        } else {
            try {
                parsedSort = JSON.parse(sort)
            } catch {
                return fail("sort is not valid JSON")
            }
        }
    }
    const sortResult = sanitiseSort(parsedSort, spec.fields)
    if (!sortResult.ok) return sortResult

    const safeFilter = result.filter

    // Personal collections are pinned to the signed-in user, overriding anything
    // the model supplied. This is the line that keeps one shopper out of another's data.
    if (spec.scopeToUser) {
        safeFilter.userId = new mongoose.Types.ObjectId(context.userId)
    }

    const requestedLimit = Number(limit)
    const safeLimit = Number.isFinite(requestedLimit) && requestedLimit > 0
        ? Math.min(Math.floor(requestedLimit), MAX_LIMIT)
        : DEFAULT_LIMIT

    return {
        ok: true,
        plan: {
            collection,
            modelName: spec.model,
            filter: safeFilter,
            sort: sortResult.sort,
            limit: safeLimit,
            projection: spec.projection,
            needsEffectivePrice: collection === "products",
        },
    }
}

export const AVAILABLE_COLLECTIONS = Object.keys(COLLECTIONS)
export const __testing = { COLLECTIONS, MAX_LIMIT, DEFAULT_LIMIT }
