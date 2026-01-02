import express from 'express'
import { createOrder, getOrderByUser, getOrders, updateOrderStatus } from '../controllers/OrderController.js'

const orderRouter = express.Router()

orderRouter.post('/',createOrder)
orderRouter.get('/',getOrders)
orderRouter.post('/:orderId',updateOrderStatus)
orderRouter.get('/orderByUser',getOrderByUser)

export default orderRouter