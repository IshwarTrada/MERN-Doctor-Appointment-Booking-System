import { Router } from "express";
import {
  appointmentCancel,
  appointmentComplete,
  doctorDashboard,
  doctorList,
  doctorLogin,
  doctorProfile,
  getDoctorAppointments,
  updateDoctorProfile,
} from "../controllers/doctor.controller.js";
import { verifyJwtDoc } from "../middlewares/auth.doctor.middleware.js";

const doctorRouter = Router();

doctorRouter.post("/login", doctorLogin);
doctorRouter.get("/list", doctorList);

doctorRouter.get("/appointments", verifyJwtDoc, getDoctorAppointments);
doctorRouter.put("/complete-appointment", verifyJwtDoc, appointmentComplete);
doctorRouter.put("/cancel-appointment", verifyJwtDoc, appointmentCancel);
doctorRouter.get("/dashboard", verifyJwtDoc, doctorDashboard);
doctorRouter.get("/profile", verifyJwtDoc, doctorProfile);
doctorRouter.put("/update-profile", verifyJwtDoc, updateDoctorProfile);

export default doctorRouter;
