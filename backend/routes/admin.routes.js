import { Router } from "express";
import {
  addDoctor,
  adminLogin,
  allDoctors,
} from "../controllers/admin.controller.js";
import upload from "../middlewares/multer.middleware.js";
import { verifyJwt, isAdmin } from "../middlewares/auth.middleware.js";
import { changeAvailability } from "../controllers/doctor.controller.js";

const adminRouter = Router();

adminRouter.post(
  "/add-doctor",
  verifyJwt,
  isAdmin,
  upload.single("image"),
  addDoctor
);

adminRouter.post("/login", adminLogin);
adminRouter.get("/all-doctors", verifyJwt, isAdmin, allDoctors);
adminRouter.patch("/change-availability", verifyJwt, isAdmin, changeAvailability);

export default adminRouter;
