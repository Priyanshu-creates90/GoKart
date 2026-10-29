import CategoryModel from "../models/category.model.js"
import SubCategoryModel from "../models/subCategory.model.js"

/**
 * The model can only map "eatables" onto real ids if it can see the store's
 * actual category names. Cached for an hour — the catalog taxonomy changes rarely,
 * and this text sits in every prompt.
 */

const TTL_MS = 60 * 60 * 1000
const MAX_CATEGORIES = 40
const MAX_SUBCATEGORIES = 80

let cache = { text: null, expiresAt: 0 }

export const getVocabulary = async () => {
    if (cache.text && Date.now() < cache.expiresAt) {
        return cache.text
    }

    try {
        const [categories, subCategories] = await Promise.all([
            CategoryModel.find().select("name").limit(MAX_CATEGORIES).lean(),
            SubCategoryModel.find().select("name category").limit(MAX_SUBCATEGORIES).lean(),
        ])

        const categoryLines = categories.map(c => `  ${c.name} = ${c._id}`).join("\n")
        const subCategoryLines = subCategories.map(s => `  ${s.name} = ${s._id}`).join("\n")

        const text = [
            "CATEGORIES (name = id):",
            categoryLines || "  (none yet)",
            "",
            "SUB CATEGORIES (name = id):",
            subCategoryLines || "  (none yet)",
        ].join("\n")

        cache = { text, expiresAt: Date.now() + TTL_MS }
        return text
    } catch (error) {
        // A vocabulary lookup failure must not take the whole chat down — the
        // assistant can still answer by name search, just less precisely.
        console.log("chat vocabulary load failed:", error.message)
        return "CATEGORIES: (unavailable — match products by name instead)"
    }
}

export const clearVocabularyCache = () => {
    cache = { text: null, expiresAt: 0 }
}
