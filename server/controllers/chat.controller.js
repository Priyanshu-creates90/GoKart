import { callGemini, GENERATION_CONFIG, isGeminiConfigured } from "../config/gemini.js"
import { QUERY_TOOL, buildSystemPrompt } from "../chat/schema.js"
import { getVocabulary } from "../chat/vocabulary.js"
import { validatePlan } from "../chat/guardrail.js"
import { executeQuery, rowsForModel } from "../chat/executeQuery.js"

const MAX_MESSAGE_LENGTH = 500
const MAX_HISTORY_TURNS = 6
const MAX_TOOL_CALLS = 2
const MAX_PRODUCT_CARDS = 8

/* ------------------------------------------------------------------ *
 * Rate limiting — in-memory, per user or IP.
 * On serverless this is per-instance, so treat it as a speed bump
 * rather than a hard quota.
 * ------------------------------------------------------------------ */
const WINDOW_MS = 5 * 60 * 1000
const MAX_REQUESTS_PER_WINDOW = 25
const buckets = new Map()

const rateLimited = (key) => {
    const now = Date.now()
    const bucket = buckets.get(key)

    if (!bucket || now > bucket.resetAt) {
        buckets.set(key, { count: 1, resetAt: now + WINDOW_MS })
        return false
    }

    bucket.count += 1
    if (buckets.size > 5000) buckets.clear() // crude ceiling on memory growth
    return bucket.count > MAX_REQUESTS_PER_WINDOW
}

/** Client-supplied history is untrusted: clamp roles, length and count. */
const normaliseHistory = (history) => {
    if (!Array.isArray(history)) return []

    return history
        .slice(-MAX_HISTORY_TURNS)
        .filter(turn => turn && typeof turn.text === "string" && turn.text.trim())
        .map(turn => ({
            role: turn.role === "model" ? "model" : "user",
            parts: [{ text: String(turn.text).slice(0, MAX_MESSAGE_LENGTH) }],
        }))
}

export const chatController = async (request, response) => {
    try {
        // No key configured (e.g. the env var is missing on the host): disable chat
        // politely rather than 500-ing on every message.
        if (!isGeminiConfigured()) {
            return response.status(503).json({
                message: "The store assistant is switched off right now. Browse or search the store instead.",
                error: true,
                success: false,
            })
        }

        const userId = request.userId || null
        const message = typeof request.body?.message === "string" ? request.body.message.trim() : ""

        if (!message) {
            return response.status(400).json({
                message: "Type a question first.",
                error: true,
                success: false,
            })
        }

        if (message.length > MAX_MESSAGE_LENGTH) {
            return response.status(400).json({
                message: `Please keep it under ${MAX_MESSAGE_LENGTH} characters.`,
                error: true,
                success: false,
            })
        }

        const rateKey = userId || request.ip || "anonymous"
        if (rateLimited(rateKey)) {
            return response.status(429).json({
                message: "That's a lot of questions! Give me a minute and try again.",
                error: true,
                success: false,
            })
        }

        const systemInstruction = {
            parts: [{ text: buildSystemPrompt(await getVocabulary(), { isLoggedIn: Boolean(userId) }) }],
        }

        const contents = [
            ...normaliseHistory(request.body?.history),
            { role: "user", parts: [{ text: message }] },
        ]

        let products = []
        let toolCalls = 0
        let answer = ""

        while (true) {
            const result = await callGemini({
                systemInstruction,
                contents,
                tools: [QUERY_TOOL],
                toolConfig: { functionCallingConfig: { mode: "AUTO" } },
                generationConfig: GENERATION_CONFIG,
            })

            const call = result.functionCall

            if (!call || toolCalls >= MAX_TOOL_CALLS) {
                answer = result.text
                break
            }

            toolCalls += 1
            // Replay the model's part verbatim so its thoughtSignature survives.
            contents.push({ role: "model", parts: [result.functionCallPart || { functionCall: call }] })

            let functionResponse

            if (call.name !== "queryStore") {
                functionResponse = { error: `Unknown tool "${call.name}".` }
            } else {
                const validation = validatePlan(call.args, { userId })

                if (!validation.ok) {
                    // Hand the reason back so the model can correct itself once.
                    functionResponse = { error: validation.error }
                    console.log("chat: query rejected —", validation.error)
                } else {
                    try {
                        const { rows, count } = await executeQuery(validation.plan)

                        // The debugging record for this whole feature: question in,
                        // query generated, rows out. Keep it.
                        console.log(
                            `chat: "${message}" -> ${validation.plan.collection} ` +
                            `${JSON.stringify(validation.plan.filter)} -> ${count} rows`
                        )

                        if (validation.plan.collection === "products") {
                            products = rows.slice(0, MAX_PRODUCT_CARDS)
                        }

                        functionResponse = {
                            count,
                            rows: rowsForModel(validation.plan.collection, rows),
                        }
                    } catch (error) {
                        console.log("chat: query failed —", error.message)
                        functionResponse = { error: "The query could not be run. Try a simpler one." }
                    }
                }
            }

            contents.push({
                role: "user",
                parts: [{ functionResponse: { name: "queryStore", response: functionResponse } }],
            })
        }

        if (!answer) {
            answer = products.length
                ? "Here's what I found."
                : "Sorry, I couldn't work that one out. Try asking about a product, a price or your orders."
        }

        return response.json({
            message: answer,
            data: { reply: answer, products },
            error: false,
            success: true,
        })

    } catch (error) {
        console.log("chat controller error:", error.message)

        if (error.quotaExceeded) {
            return response.status(429).json({
                message: "I'm handling a lot of questions right now — try again in a few seconds.",
                error: true,
                success: false,
            })
        }

        return response.status(500).json({
            message: "The assistant is unavailable right now. Please try again in a moment.",
            error: true,
            success: false,
        })
    }
}

export default chatController
