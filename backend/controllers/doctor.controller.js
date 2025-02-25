import validator from "validator";
import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { Doctor } from "../models/doctor.model.js";
import { Appointment } from "../models/appointment.model.js";

const doctorLogin = async (req, res) => {
  try {
    // Step 1: Get data of user from form
    const { email, password } = req.body;

    // Step 2: Validate data
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter your Email." });
    }
    if (!password) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter the Password." });
    }

    if (!validator.isEmail(email)) {
      // validate email using validator package
      return res
        .status(400)
        .json({ success: false, message: "Enter a valid email" });
    }

    // Step 3: Check if user exists
    const user = await Doctor.findOne({
      email,
      isDeleted: false,
    });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Doctor does not exist" });
    }

    // Step 4: Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid doctor credentials" });
    }

    // Step 5: Generate token and set cookie
    generateTokenAndSetCookie(user.email, "DOCTOR", "dToken", res);

    return res.status(200).json({
      success: true,
      data: user,
      message: "Doctor logged in successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;
    const doctor = await Doctor.findById(docId);

    await Doctor.findByIdAndUpdate(docId, {
      availability: !doctor.availability,
    });

    return res.status(200).json({
      success: true,
      message: "Doctor Availability Changed",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const doctorList = async (req, res) => {
  try {
    const doctors = await Doctor.find({}).select(["-password", "-email"]);
    return res.status(200).json({
      success: true,
      data: doctors,
      message: "All Doctors fetched successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// get particular doctor appointments for doctor panel
const getDoctorAppointments = async (req, res) => {
  try {
    const { email } = req.user;
    const doctor = await Doctor.findOne({ email });
    console.log("hi");

    const appointments = await Appointment.find({ docId: doctor._id });
    console.log("hi");
    console.log(appointments);

    return res.status(200).json({
      success: true,
      data: appointments,
      message: "Doctor Appointments fetched successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Api: mark appointment completed for doctor panel
const appointmentComplete = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;
    const { email } = req.user;
    const doctor = await Doctor.findOne({ email });

    const appointmentData = await Appointment.findById(appointmentId);
    if (appointmentData && docId === doctor._id.toString()) {
      await Appointment.findByIdAndUpdate(appointmentId, { isCompleted: true });
      return res.status(200).json({
        success: true,
        message: "Appointment approved by doctor.",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Mark failed due to invalid request",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Api: mark appointment cancelled for doctor panel
const appointmentCancel = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;
    const { email } = req.user;
    const doctor = await Doctor.findOne({ email });

    const appointmentData = await Appointment.findById(appointmentId);
    if (appointmentData && docId === doctor._id.toString()) {
      await Appointment.findByIdAndUpdate(appointmentId, { cancelled: true });
      return res.status(200).json({
        success: true,
        message: "Appointment cancelled by doctor.",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Mark failed due to invalid request",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  doctorLogin,
  changeAvailability,
  doctorList,
  getDoctorAppointments,
  appointmentComplete,
  appointmentCancel,
};
