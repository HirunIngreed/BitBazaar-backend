import mongoose from "mongoose";


const reviewSchema = mongoose.Schema(
    {
        email : {
            type : String,
            required : true
        },
        firstName : {
            type : String,
            required : true 
        },
        lastName : {
            type : String,
            required : true 
        },
        reviewString : {
            type : String,
            required : true
        },
        date : {
            type : Date,
            default : Date.now
        },
        image : {
            type : String,
            required : true
        }
    }

)

const Review = mongoose.model('review',reviewSchema)

export default Review;