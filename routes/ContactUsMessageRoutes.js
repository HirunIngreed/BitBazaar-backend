import express from 'express'
import { getMessages, saveMessage } from '../controllers/ContactUsMessageControlle.js'

const contactUsMessageRouter = express.Router()

contactUsMessageRouter.post('/',saveMessage)
contactUsMessageRouter.get('/',getMessages)

export default contactUsMessageRouter