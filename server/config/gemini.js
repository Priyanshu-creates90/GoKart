/**
 * Gemini configuration for the GoKart store assistant.
 *
 * The key comes from the environment only — never hardcode it here. Locally it
 * lives in server/.env (gitignored); on Vercel it must be set as a project
 * environment variable named GEMINI_API_KEY.
 *
 * This module is SERVER ONLY. Never import it from the React client.
 */
import dotenv from "dotenv"
dotenv.config()

export const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ""

export const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash"

/** The chat route checks this so a missing key disables chat instead of the whole store. */
export const isGeminiConfigured = () => Boolean(GEMINI_API_KEY)

if (!GEMINI_API_KEY) {
    console.log("GEMINI_API_KEY is not set — the store assistant will be disabled.")
}

const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`

const REQUEST_TIMEOUT_MS = 20000
const MAX_ATTEMPTS = 3
const RETRY_STATUS = new Set([429, 500, 502, 503, 504])

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * One HTTP attempt. Transient failures are surfaced with `retryable: true`
 * so the caller can back off — Gemini returns 503 "high demand" under load.
 */
const attempt = async (body) => {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

    try {
        const response = await fetch(ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": GEMINI_API_KEY,
            },
            body: JSON.stringify(body),
            signal: controller.signal,
        })

        const payload = await response.json().catch(() => null)

        if (!response.ok) {
            const detail = payload?.error?.message || `HTTP ${response.status}`
            const error = new Error(`Gemini request failed: ${detail}`)
            // A 429 from the free tier is a per-minute quota, not a blip — retrying
            // inside a few hundred ms just burns another request against the quota.
            error.quotaExceeded = response.status === 429
            error.invalidArgument = response.status === 400
            error.retryable = RETRY_STATUS.has(response.status) && !error.quotaExceeded
            throw error
        }

        const candidate = payload?.candidates?.[0]
        const parts = candidate?.content?.parts || []

        return {
            parts,
            finishReason: candidate?.finishReason,
            text: parts.filter(p => typeof p.text === "string").map(p => p.text).join("").trim(),
            functionCall: parts.find(p => p.functionCall)?.functionCall || null,
            // The whole part, not just .functionCall — newer models attach a
            // thoughtSignature here and reject history that drops it.
            functionCallPart: parts.find(p => p.functionCall) || null,
            usage: payload?.usageMetadata || null,
        }
    } catch (error) {
        if (error.name === "AbortError") {
            const timeout = new Error("Gemini request timed out")
            timeout.retryable = true
            throw timeout
        }
        if (error.retryable === undefined) error.retryable = true // network blips
        throw error
    } finally {
        clearTimeout(timer)
    }
}

/**
 * Calls Gemini, retrying transient failures with a short backoff.
 * Throws an Error with a readable message once attempts are exhausted.
 */
export const callGemini = async (body) => {
    let lastError

    for (let i = 0; i < MAX_ATTEMPTS; i++) {
        try {
            return await attempt(body)
        } catch (error) {
            lastError = error

            // Newer Gemini models reject thinkingConfig.thinkingBudget outright.
            // Drop it and try once more so swapping GEMINI_MODEL doesn't break chat.
            if (error.invalidArgument && body?.generationConfig?.thinkingConfig) {
                const { thinkingConfig, ...generationConfig } = body.generationConfig
                body = { ...body, generationConfig }
                continue
            }

            if (!error.retryable || i === MAX_ATTEMPTS - 1) break
            await wait(400 * (i + 1))
        }
    }

    throw lastError
}

/** Shared generation settings. thinkingBudget 0 keeps replies fast and cheap. */
export const GENERATION_CONFIG = {
    temperature: 0.2,
    maxOutputTokens: 900,
    thinkingConfig: { thinkingBudget: 0 },
}
