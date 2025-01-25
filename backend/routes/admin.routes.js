import express, { Router } from "express";
import { addDoctor, loginAdmin } from "../controllers/admin.controller.js";
import upload from "../middlewares/multer.middleware.js";
import { verifyJwt, isAdmin } from "../middlewares/auth.middleware.js";

const adminRouter = Router();

adminRouter.post(
  "/add-doctor",
  verifyJwt,
  isAdmin,
  upload.single("image"),
  addDoctor
);

export default adminRouter;
