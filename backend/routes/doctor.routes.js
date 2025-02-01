import { Router } from "express";
import { verifyJwt, isAdmin } from "../middlewares/auth.middleware.js";
import { doctorLogin } from "../controllers/doctor.controller.js";

const doctorRouter = Router();

doctorRouter.post("/login", doctorLogin);

export default doctorRouter;
