import { Router } from "express";
import { loginUser, logout, registerUser } from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.post("/signup", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", verifyJwt, logout);

export default userRouter;
