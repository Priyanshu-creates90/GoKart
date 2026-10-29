import jwt from 'jsonwebtoken'

const auth = async(request,response,next)=>{
    try {                                              //if request == null request?.header = undefined  & request.header = error
        const token = request.cookies.accessToken || request?.headers?.authorization?.split(" ")[1]
        // bearer <token> 
        //The Authorization header is a part of an HTTP request where a client (like a web browser or an app) sends proof of its identity or access rights to the server. It's often used to pass tokens, like a JWT (JSON Web Token), that the server uses to verify the user's identity.

        if(!token){
            return response.status(401).json({
                message : "Provide token"       // shows in case of logout
            })
        }

        const decode = await jwt.verify(token,process.env.SECRET_KEY_ACCESS_TOKEN) 
        //returns decoded data stored in token or error

        if(!decode){
            return response.status(401).json({
                message : "unauthorized access",   //if token has been tempered
                error : true,
                success : false
            })
        }

        //console.log("decode: ", decode)

        request.userId = decode.id

        next()

    } catch (error) {
        return response.status(500).json({
            message : "You have not login",///error.message || error,        //in case token has expired
            error : true,
            success : false
        })
    }
}

export default auth