import bcrypt from 'bcrypt';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();
import nodemailer from "nodemailer";
import OTP from '../models/OTP.js';

const transpoter = nodemailer.createTransport({
    service : "gmail",
    host : "smtp.gmail.com",
    port : 587,
    secure : false,
    auth : {
        user : "hingreed738@gmail.com",
        pass : process.env.GMAIL_APP_PASSWORD
    }
})

export async function createUser(req,res){

    if (req.body.role == "admin") {
        if (!isAdmin(req)) {
            res.status(404).json(
                {
                    message : "You can't create admin accounts"
                }
            )
            return
        }
    }
    try {
        const duplicateUser = await User.findOne({email : req.body.email})
        if (duplicateUser) {
            res.status(409).json(
                {
                    message : "This email is already used"
                }
            )
            return
        }

        const hashedPassword =  bcrypt.hashSync(req.body.password,10)

        const user = new User (
            {
                firstName : req.body.firstName,
                lastName : req.body.lastName,
                email : req.body.email,
                password : hashedPassword,
                address : req.body.address,
                phone : req.body.phone
                
            }
        )

        const savedUser = await user.save()
        res.json(
            {
                message : "User saved successfully",
                user : savedUser
            }
        )
    } catch (error) {
        res.status(500).json(
            {
                message : "User is not saved",
                error : error
            }
        )
    }
}

export async function loginUser(req,res){

try{
    const user = await User.findOne({email : req.body.email})
    if (user==null) {
        res.status(404).json(
            {
                message : "User is not found"
            }
        )
        return
    }

    if (user.isBlocked) {
		res.status(403).json({
			message: "User is blocked.",
		});
		return;
	}

    const isPasswordOk = bcrypt.compareSync(req.body.password, user.password)
    if (isPasswordOk) {
        const token = jwt.sign(
            {
                firstName : user.firstName,
                lastName : user.lastName,
                email : user.email,
                phone : user.phone,
                password : user.password,
                role : user.role,
                address : user.address,
                image : user.image[0]
            },process.env.JWT_KEY
            
        )
        res.json(
        {
            message : "Login successfull",
            token : token,
            role : user.role
        }
    )
    }else{
        res.status(404).json(
            {
                message : "Incorrect password. Please try again."
            }
        )
    }

    
}catch(error){
        res.status(500).json(
            {
                message : "Login failed",
                error : error
            }
        )
    }
}

export function isAdmin(req,res){
    if(req.user == null){
        return false
    }
    if(req.user.role != "admin"){
        return false
    }
    return true
}

export async function getUsers(req,res){
    if (!isAdmin(req)) {
        res.status(403).json(
            {
                message : "Only admins can get users"
            }
        )
    }else{
        try{
        const users = await User.find()
        res.json(
            {
                users : users
            }
        )
    }catch(err){
        res.status(500).json(
            {
                message : "Error loading"
            }
        )
    }
    }

    
}

export async function deleteUser(req,res){
    try {
        if (!isAdmin(req)) {
            res.status(403).json(
                {
                    message : "Only admins can delete users."
                }
            )
            return
        }
        await User.deleteOne({_id : req.params._id})
        res.json(
            {
                message : "User deleted successfully"
            }
        )
    } catch (error) {
        res.status(500).json(
            {
                message : "User deleted failed"
            }
        )
    }
}

export function findUser(req,res){
    if (req.user==null) {
        res.status(403).json(
            {
                message : "Unathorized"
            }
        )
        return
    }
    res.json(
        req.user
    )
}

export async function googleLogin(req,res){
	console.log(req.body.token);
	try {

		const response = await axios.get(
			"https://www.googleapis.com/oauth2/v3/userinfo",
			{
				headers: {
					Authorization: `Bearer ${req.body.token}`,
				},
			}
		);
        console.log(response.data)
    
    const user = await User.findOne({email : response.data.email})
    if (!user) {
        const newUser = new User (
            {
                email: response.data.email,
				firstName: response.data.given_name,
				lastName: response.data.family_name,
				password: "4321",
				image: response.data.picture,
				isEmailVerified: true,

            }
        )
        await newUser.save()

        const token = jwt.sign(
            {
                email : newUser.email,
                firstName : newUser.firstName,
                lastName : newUser.lastName,
                password : newUser.password,
                image : newUser.image,
                isEmailVerified: true,
				image: newUser.image
            },process.env.JWT_KEY
        )
        res.json(
            {
            message : "Login successfull",
            token : token,
            role : user.role  
            }
        )

        
    }else{
        const token = jwt.sign(
            {
                firstName : user.firstName,
                lastName : user.lastName,
                email : user.email,
                phone : user.phone,
                password : user.password,
                role : user.role,
                address : user.address,
                image : user.image[0]
            },process.env.JWT_KEY
            
        )
        res.json(
        {
            message : "Login successfull",
            token : token,
            role : user.role
        }
    )
    }}catch (error) {
		res.status(500).json({
			message: "Google login failed",
			error: error.message,
		});
    }

} 

export async function sendOTP(req,res){
    const email = req.params.email
try{
    const user = await User.findOne({email : email})
    if (!user) {
        res.status(403).json(
            {
                message : "User not found"
            }
        )
        return
    }

    await OTP.deleteMany({email : email})

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString()

    const otp = new OTP (
        {
            email : email,
            otp : otpCode
        }
    )
    await otp.save()

    const message = {
        from : "hingreed738@gmail.com",
        to : email,
        subject : "OTP code ",
        text : `your OTP code is ${otpCode}`
    }
    transpoter.sendMail(message,(err,info)=>{
        if(err){
            res.status(500).json(
            {
                message : "Failed to send OTP",
                error : err.message
            }
        )
        }else{
            res.json(
                {
                    message : "OTP sent successfully"
                }
            )
        }
    })
}catch(err){
    res.status(500).json(
        {
            message : "OTP not sent"
        }
    )
}
}

export async function validateOtp(req,res){
    const otp = req.body.otp
    const newPassword =  req.body.newPassword
    const email = req.body.email

    const otpRecord = await OTP.findOne({otp : otp,email:email})
    if (!otpRecord) {
        res.status(404).json(
            {
                message : "Invalid OTP code"
            }
        )
        return
    }

    OTP.deleteMany({email : email})

    const hashedPassword  = bcrypt.hashSync(newPassword,10)

    await User.updateOne({email : email}),{
        $set : {password : hashedPassword, isEmailVerified:true}
    }
    res.json(
        {
            message : "Password updated successfully"
        }
    )
}

export async function updateUserStatus(req,res){
    if (!isAdmin(req)) {
        res.status(403).json(
            {
                message : "Only admins can update user status"
            }
        )
        return
    }

    const user = await User.findOne({email : req.body.email})
    if (!user) {
        res.status(404).json(
            {
                message : "User not found"
            }
        )
        return
    }

    if (user.email==req.user.email) {
        res.status(400).json(
            {
                message : "Admin cannot change their own status"
            }
        )
        return
    }

    try {
		await User.updateOne(
			{ email: req.params.email },
			{ $set: { isBlocked: req.body.isBlock } }
		);
		res.json({
			message: "User status updated successfully",
		});
	}
	catch (error) {
		res.status(500).json({
			message: "Error updating user status",
			error: error.message,
		});
	}
}