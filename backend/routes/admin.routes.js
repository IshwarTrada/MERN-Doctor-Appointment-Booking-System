import express, { Router } from "express";
import { addDoctor, loginAdmin } from "../controllers/admin.controller.js";
import upload from "../middlewares/multer.middleware.js";
import authAdmin from "../middlewares/authAdmin.middleware.js";

const adminRouter = Router();

adminRouter.post("/add-doctor", authAdmin, upload.single("image"), addDoctor);
adminRouter.post("/login", loginAdmin);

export default adminRouter;
