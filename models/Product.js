import mongoose from "mongoose";

const productSchema = mongoose.Schema(
    {
        name : {
            type : String,
            required : true
        },
        altNames : [
            {
                type : String,
            }
        ],
        productId : {
            type : String,
            
        },
        price : {
            type : Number,
            required : true
        },
        labeledPrice : {
            type : Number,
            required : true
        },
        category : {
            type : String,
            required : true
        },
        description : {
            type : String,
            required : true
        },
        isAvailable : {
            type : Boolean,
            required : true
        },
        stock : {
            type : Number,
            required : true
        },
        brand : {
            type : String,
            required : true
        },
        notes : {
            type : String,
            default : ""
        },
        model : {
            type : String,
            required : true
        },
        images : [
            {
                type : String,
                required : true
            }
        ],
        date : {
            type : Date,
            required : true,
            default : Date.now
        }
    }
)

const Product = mongoose.model('product',productSchema)

export default Product;