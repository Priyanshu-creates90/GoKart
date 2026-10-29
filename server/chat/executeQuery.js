import ProductModel from "../models/product.model.js"
import CategoryModel from "../models/category.model.js"
import SubCategoryModel from "../models/subCategory.model.js"
import OrderModel from "../models/order.model.js"
import AddressModel from "../models/address.model.js"
import CartProductModel from "../models/cartproduct.model.js"

const MODELS = {
    product: ProductModel,
    category: CategoryModel,
    subCategory: SubCategoryModel,
    order: OrderModel,
    address: AddressModel,
    cartProduct: CartProductModel,
}

const MAX_TIME_MS = 2500

/**
 * The price a shopper actually sees, mirroring pricewithDiscount() on the client:
 *   effective = price - ceil(price * discount / 100)
 * Added as a real field so the model can filter and sort on it directly.
 */
const EFFECTIVE_PRICE_STAGE = {
    $addFields: {
        _effectivePrice: {
            $subtract: [
                { $ifNull: ["$price", 0] },
                {
                    $ceil: {
                        $divide: [
                            { $multiply: [{ $ifNull: ["$price", 0] }, { $ifNull: ["$discount", 0] }] },
                            100,
                        ],
                    },
                },
            ],
        },
    },
}

/** Runs an already-validated plan. Never call this with anything the guardrail hasn't cleared. */
export const executeQuery = async (plan) => {
    const Model = MODELS[plan.modelName]
    if (!Model) throw new Error(`No model registered for "${plan.modelName}"`)

    if (plan.needsEffectivePrice) {
        const rows = await Model.aggregate([
            EFFECTIVE_PRICE_STAGE,
            { $match: plan.filter },
            { $sort: plan.sort },
            { $limit: plan.limit },
            { $project: plan.projection },
        ]).option({ maxTimeMS: MAX_TIME_MS })

        return { rows, count: rows.length }
    }

    const rows = await Model.find(plan.filter)
        .sort(plan.sort)
        .limit(plan.limit)
        .select(plan.projection)
        .maxTimeMS(MAX_TIME_MS)
        .lean()

    return { rows, count: rows.length }
}

/**
 * Rows sent back to the model — trimmed to keep the prompt small and to avoid
 * handing it image URLs and ids it has no use for.
 */
export const rowsForModel = (collection, rows) => {
    if (collection === "products") {
        return rows.map(row => ({
            name: row.name,
            unit: row.unit,
            price: row.price,
            discount: row.discount || 0,
            priceAfterDiscount: row._effectivePrice,
            inStock: Number(row.stock) > 0,
        }))
    }

    if (collection === "orders") {
        return rows.map(row => ({
            orderId: row.orderId,
            item: row.product_details?.name,
            total: row.totalAmt,
            status: row.payment_status,
            placedOn: row.createdAt ? new Date(row.createdAt).toISOString().slice(0, 10) : null,
        }))
    }

    if (collection === "addresses") {
        return rows.map(row => ({
            address: row.address_line,
            city: row.city,
            state: row.state,
            pincode: row.pincode,
            active: row.status,
        }))
    }

    return rows.map(row => ({ ...row, _id: undefined }))
}
