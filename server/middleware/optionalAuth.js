import jwt from 'jsonwebtoken'

/**
 * Like auth.js, but never rejects: anonymous visitors are allowed through with
 * request.userId left null. Used by the chat route so the assistant can answer
 * catalog questions without a login, while personal collections stay locked.
 */
const optionalAuth = async (request, response, next) => {
    try {
        const token = request.cookies?.accessToken || request?.headers?.authorization?.split(" ")[1]

        if (token) {
            const decode = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN)
            if (decode?.id) {
                request.userId = decode.id
            }
        }
    } catch {
        // expired or tampered token — treat as a guest
        request.userId = null
    }

    next()
}

export default optionalAuth
