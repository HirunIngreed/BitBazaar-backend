import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
    {
        firstName : {
            type : String,
            required : true,
        },
        lastName : {
            type : String,
            required : true,
        },
        email : {
            type : String,
            required : true,
        },
        message : {
            type : String,
            required : true,
        },
        date : {
            type : Date,
            required : true,
            default : Date.now
        }
    }
    
)
const Message = mongoose.model('message',messageSchema)

export default Message