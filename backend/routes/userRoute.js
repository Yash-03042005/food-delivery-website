import express from "express"
import { loginUser, registerUser, logoutUser,getUser } from "../controllers/userController.js";
import authMiddleware from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/register",registerUser)
userRouter.post("/login",loginUser)
userRouter.post("/logout", logoutUser)
userRouter.get('/me',authMiddleware,getUser);



export default userRouter;






