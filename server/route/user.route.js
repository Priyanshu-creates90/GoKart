import { Router } from "express"
import { registerUserController } from "../controllers/user.controller.js"  //named export
import { verifyEmailController } from "../controllers/user.controller.js"
import { loginController } from "../controllers/user.controller.js"
import { logoutController } from "../controllers/user.controller.js"
import auth from "../middleware/auth.js"
import multer from "../middleware/multer.js"
import { uploadAvatar } from "../controllers/user.controller.js"
import { updateUserDetails } from "../controllers/user.controller.js"
import { forgotPasswordController } from "../controllers/user.controller.js"
import { verifyForgotPasswordOtp } from "../controllers/user.controller.js"
import { resetpassword } from "../controllers/user.controller.js"
import { refreshToken } from "../controllers/user.controller.js"
import { getLoginUserDetails } from "../controllers/user.controller.js"

const userRouter = Router()

userRouter.post('/register', registerUserController)
userRouter.post('/verify-email', verifyEmailController)
userRouter.post('/login', loginController)
userRouter.get('/logout',auth, logoutController)
userRouter.put('/upload-avatar',auth, multer.single('avatar'), uploadAvatar)     // put for update
//multer.single('avatar') is a middleware that processes a single file upload coming from the form field named "avatar".
//It extracts the uploaded file from the incoming multipart/form-data request and makes it available in req.file.
userRouter.put('/update-details',auth, updateUserDetails)
userRouter.put('/forgot-password', forgotPasswordController)
userRouter.put('/verify-forgot-password-otp', verifyForgotPasswordOtp)
userRouter.put('/reset-password', resetpassword)
userRouter.post('/refresh', refreshToken)
userRouter.get('/user-details', auth, getLoginUserDetails)

export default userRouter