import { Router } from "express";
import { addDoctor, adminLogin } from "../controllers/admin.controller.js";
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

adminRouter.post("/login", adminLogin);

export default adminRouter;
