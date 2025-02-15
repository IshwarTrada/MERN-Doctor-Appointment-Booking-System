import { Router } from "express";
import { verifyJwt, isAdmin } from "../middlewares/auth.middleware.js";
import { doctorList, doctorLogin } from "../controllers/doctor.controller.js";

const doctorRouter = Router();

doctorRouter.post("/login", doctorLogin);
doctorRouter.get("/list", doctorList);

export default doctorRouter;
