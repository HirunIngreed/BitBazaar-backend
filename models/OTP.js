import mongoose from "mongoose";

const otpSchema = mongoose.Schema(
    {
        email : {
            type :String,
            required : true,
            unique : true
        },
        otp : {
            type :String,
            required:true
        }

    }
)
const OTP = mongoose.model('otp',otpSchema)

export default OTP;