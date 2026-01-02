import Order from "../models/Order.js"
import Product from "../models/Product.js"
import { isAdmin } from "./UserControllers.js"

export async function createOrder(req,res){
    if (!req.user) {
        res.status(404).json(
            {
                message : "You must be logged in to create an order. Please log in and try again."
            }
        )
        return
    }
try{
    let orderId = "ORD-000001"

    const lastOrder = await Order.find().sort({date : -1}).limit(1)

    if (lastOrder.length>0) {
        const lastOrderId = lastOrder[0].orderId
        const lastOrderIdToNumber = lastOrderId.split('-')
        const newOrderNumber = parseInt(lastOrderIdToNumber[1]) + 1
        orderId = lastOrderIdToNumber[0] + "-" + String(newOrderNumber).padStart(6,"0")
    }

    let name = req.body.name
    if (req.body.name == null) {
        name = req.user.firstName +" "+ req.user.lastName
    }

    let email = req.body.email
    if (req.body.email == null) {
        email = req.user.email
    }

    const items = []

    let total = 0

    for(let i = 0; req.body.items.length>i; i++){
        const product = await Product.findOne({productId : req.body.items[i].productId})
        if (product == null) {
            res.status(404).json(
                {
                    message : "Product with "+req.body.items[i].productId+"not found"
                }
            )
            return
        
        }else{
            items.push(
                {
                    productId : product.productId,
                    name : product.name,
                    price : product.price,
                    quantity : req.body.items[i].quantity,
                    image : product.images[0]
                }
            )
        }
        total = total + (product.price * req.body.items[i].quantity)
    }

    const order = new Order(
        {
           orderId : orderId,
           email : email,
           userEmail : req.user.email,
           name : name,
           phone : req.body.phone,
           address : req.body.address,
           status : req.body.status,
           notes : req.body.notes,
           items : items,
           total : total
        }
    )
    const orderSaving = order.save()
    res.json(
        {
            message : "Order saved successfully"
        }
    )
}catch(err){
    res.status(500).json(
        {
            message : "Order is not saved"
        }
    )
}
}

export async function getOrders(req,res){
    try {
        if (!isAdmin(req)) {
            req.status(404).json(
                {
                    message : "Access denied: Administrator-level actions are not permitted. Please log in with an administrator account or contact your system administrator."

                }
            )
            return
        }

        const orders = await Order.find()
        res.json(
            {
                orders : orders
            }
        )

    } catch (error) {
        
    }
}

export async function updateOrderStatus(req,res){
    try {

        if (!isAdmin(req)) {
            return res.status(403).json(
                {
                    message : "Only admins can update orders"
                }
            )
        }

        await Order.updateOne({orderId : req.params.orderId},req.body)
        res.json(
            {
                message : "Update successfully"
            }
        )
    } catch (error) {
        res.status(500).json(
            {
                message : "Update failed"
            }
        )
    }
}

export async function getOrderByUser(req,res){
    try {
        const orders = await Order.find({userEmail : req.user.email})

        if (!orders) {
            res.status(404).json(
                {
                    message : "Orders not found"
                }
            )
            return
        }

        res.json(
            {
                orders : orders
            }
        )
    } catch (error) {
        res.status(500).status(
            {
                message : "Error loading orders"
            }
        )
    }
}