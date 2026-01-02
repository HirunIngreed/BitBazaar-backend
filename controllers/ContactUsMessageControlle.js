import Message from "../models/ContactUsMessages.js";
import User from "../models/User.js";
import { isAdmin } from "./UserControllers.js";

export async function saveMessage(req,res){
    try{
    const isEmailValid = await User.findOne({email : req.body.email})
    if (!isEmailValid) {
        res.status(404).json(
            {
                message : "Your email is not valid"
            }
        )
        return
    }
    const message = new Message (
        {
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            email : req.body.email,
            message : req.body.message
        }
    )
    await message.save()
    res.json(
        {
            message : "Message sent successfully"
        }
    )
}catch(err){
    res.status(500).json(
        {
            message : "Message is not sent",
            error : err
        }
    )
}
}

export async function getMessages(req,res){
    try {
        if (!isAdmin(req)) {
            res.status(403).json(
                {
                    message : "Only admins can get messages"
                }
            )
            return
        }

        const messages = await Message.find()
        if (messages==null) {
            res.status(404).json(
                {
                    message : "Messages not found"
                }
            )
            
        }else{
            res.json(
                {
                    messages : messages
                }
            )
        }

    } catch (error) {
        res.status(500).json(
            {
                message : "Loading failed"
            }
        )
    }
}
