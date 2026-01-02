import express from 'express';
import { createUser, deleteUser, findUser, getUsers, googleLogin, loginUser, sendOTP, updateUserStatus, validateOtp } from '../controllers/UserControllers.js';


const userRouter = express.Router()

userRouter.post('/',createUser)
userRouter.post('/login',loginUser)
userRouter.get('/',getUsers)
userRouter.delete('/:_id',deleteUser)
userRouter.get('/find',findUser)
userRouter.post('/googleLogin',googleLogin)
userRouter.get("/sendOTP/:email",sendOTP)
userRouter.post("/changePassword",validateOtp)
userRouter.put('/status/:email',updateUserStatus)

export default userRouter;
