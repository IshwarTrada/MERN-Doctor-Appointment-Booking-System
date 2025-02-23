import { Router } from "express";
import {
  doctorList,
  doctorLogin,
  getDoctorAppointments,
} from "../controllers/doctor.controller.js";
import { verifyJwtDoc } from "../middlewares/auth.doctor.middleware.js";

const doctorRouter = Router();

doctorRouter.post("/login", doctorLogin);
doctorRouter.get("/list", doctorList);

doctorRouter.get("/appointments", verifyJwtDoc, getDoctorAppointments);

export default doctorRouter;
