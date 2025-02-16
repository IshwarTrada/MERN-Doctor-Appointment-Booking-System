import { Router } from "express";
import {
  bookAppointment,
  cancelAppointment,
  getUserAppointments,
  getUserProfile,
  loginUser,
  logout,
  registerUser,
  updateUserProfile,
} from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const userRouter = Router();

userRouter.post("/signup", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logout);

// Protected route
userRouter.get("/user/profile", verifyJwt, getUserProfile);
userRouter.patch(
  "/update-profile",
  verifyJwt,
  upload.single("image"),
  updateUserProfile
);
userRouter.post("/user/book-appointment", verifyJwt, bookAppointment);
userRouter.get("/user/appointments", verifyJwt, getUserAppointments);
userRouter.patch("/user/cancel-appointment", verifyJwt, cancelAppointment);

export default userRouter;
