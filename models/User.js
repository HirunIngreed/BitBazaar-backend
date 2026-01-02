import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {
        firstName : {
            type : String,
            required : true
        },
        lastName : {
            type : String,
            required : true
        },
        email : {
            type : String,
            required : true,
        },
        password : {
            type : String,
            required : true
        },
        address : {
            type : String,
            
        },
        phone : {
            type : String
        },
        role : {
            type : String,
            default : "customer"
        },
        image : {
            type : String,
            default : "/default.jpg"
        },
        isBlocked : {
            type : Boolean,
            default : false
        }
    }
)

const User = mongoose.model('user',userSchema);

export default User;