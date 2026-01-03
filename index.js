import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/UserRoutes.js';
import productRouter from './routes/ProductRouter.js';
import cors from 'cors';
import orderRouter from './routes/OrderRoutes.js';
import contactUsMessageRouter from './routes/ContactUsMessageRoutes.js';
import reviewRouter from './routes/ReviewRoutes.js';
dotenv.config()

const app = express()

app.use(cors({
  origin: "https://bit-bazaar-frontend-8qak-b49v9gon6-hirun-ingreeds-projects.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));


app.use(bodyParser.json())

app.use(
    (req,res,next)=>{
        const tokenString = req.header("Authorization")
        if (!tokenString) {
            next()
            return
        }else{
            const token = tokenString.replace("Bearer ","")
            jwt.verify(token,process.env.JWT_KEY,
                (err,decoded)=>{
                    if (decoded) {
                        req.user = decoded
                        next()
                    }else{
                        res.status(404).json(
                            {
                                message : "Invalid token",
                                error : err
                            }
                        )
                    }
                }

            )
        }
    }
)



app.use("/api/users",userRouter)
app.use("/api/products",productRouter)
app.use("/api/orders",orderRouter)
app.use("/api/message",contactUsMessageRouter)
app.use("/api/reviews",reviewRouter)

mongoose.connect(process.env.MONGODB_URL)
.then(()=>{
    console.log("DB is connected")
}).catch(()=>{
    console.log("DB is not connected")
})

app.listen(5000,()=>{
    console.log("App is running on port 5000")
})

