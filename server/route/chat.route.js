import { Router } from 'express'
import optionalAuth from '../middleware/optionalAuth.js'
import { chatController } from '../controllers/chat.controller.js'

const chatRouter = Router()

chatRouter.post('/', optionalAuth, chatController)

export default chatRouter
