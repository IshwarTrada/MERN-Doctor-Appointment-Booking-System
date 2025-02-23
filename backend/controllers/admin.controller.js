import validator from "validator";
import bcrypt from "bcrypt";
import { Doctor } from "../models/doctor.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { Appointment } from "../models/appointment.model.js";

// API for adding doctor
const addDoctor = async (req, res) => {
  try {
    // Step 1: Get data of doctor from form
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;
    const image = req.file;

    // Step 2: Validate data
    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing Details" });
    }

    if (!validator.isEmail(email)) {
      // validate email using validator package
      return res
        .status(400)
        .json({ success: false, message: "Enter a valid email" });
    }

    if (password.length < 8) {
      // validate password
      return res
        .status(400)
        .json({ success: false, message: "Please enter a strong password" });
    }

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Image is required for registration",
      });
    }

    let parsedAddress;
    try {
      // Step 3: Clean and parse the address string
      let cleanedAddress = address.replace(/'/g, '"'); // Replace single quotes with double quotes
      // Ensure the format is valid JSON and add braces if needed
      if (!cleanedAddress.startsWith("{")) {
        cleanedAddress = `{${cleanedAddress}}`;
      }

      parsedAddress = JSON.parse(cleanedAddress); // Parse the cleaned address
    } catch (err) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid address format" });
    }

    // Step 3: hashing doctor password
    const saltRounds = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Step 4: image upload on cloudinary

    const imageUpload = await uploadOnCloudinary(image.path);

    if (!imageUpload || !imageUpload.secure_url) {
      return res.status(500).json({
        success: false,
        message: "Failed to upload photo on cloud storage.",
      });
    }

    const imageUrl = imageUpload.secure_url;

    // Step 5: Create doctor object
    const newDoctor = await Doctor.create({
      name,
      email,
      image: imageUrl,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: parsedAddress,
      date: Date.now(),
    });

    return res
      .status(200)
      .json({ success: true, message: "Doctor Added Successfully." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `Error while adding doctor: ${error.message}`,
    });
  }
};

const adminLogin = async (req, res) => {
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
    const user = await User.findOne({ email, role: "ADMIN", isDeleted: false });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Admin does not exist" });
    }

    // Step 4: Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid admin credentials" });
    }

    // Step 5: Generate token and set cookie
    generateTokenAndSetCookie(user.email, user.role, "aToken",res);

    return res.status(200).json({
      success: true,
      data: user,
      message: "Admin logged in successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin Panel : get all doctors list
const allDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({}).select("-password");
    return res.status(200).json({
      success: true,
      data: doctors,
      message: "All doctors fetched successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `Error while fetching all doctors: ${error.message}`,
    });
  }
};

// api to get all appointments list
const appointmentsAdmin = async (req, res) => {
  try {
    const appointments = await Appointment.find({});
    return res.status(200).json({
      success: true,
      data: appointments,
      message: "All appointments fetched successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `Error while fetching all appointments for admin: ${error.message}`,
    });
  }
};

// Api for appointment cancellation by admin
const cancelAppointmentByAdmin = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }

    await Appointment.findByIdAndUpdate(appointmentId, { cancelled: true });

    // Update doctor's slots_booked
    const { docId, slotDate, slotTime } = appointment;

    const docData = await Doctor.findById(docId).select("-password");

    let slots_booked = docData.slots_booked;

    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (e) => e !== slotTime
    );

    await Doctor.findByIdAndUpdate(docId, { slots_booked });

    return res.status(200).json({
      success: true,
      message: "Appointment Cancelled",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// API to get dashboard data for admin
const adminDashboard = async (req, res) => {
  try {
    const totalDoctors = await Doctor.countDocuments();
    const totalAppointments = await Appointment.countDocuments();
    const totalUsers = await User.countDocuments();

    // const doctors = await Doctor.find({});
    const appointments = await Appointment.find({});
    // const users = await User.find({});

    const dashData={
      doctors: totalDoctors,
      appointments: totalAppointments,
      patients: totalUsers,
      latestAppointments: appointments.reverse().slice(0, 5),
    }

    return res.status(200).json({
      success: true,
      data: dashData,
      message: "Dashboard data fetched successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `Error while fetching dashboard data: ${error.message}`,
    });
  }
};

export {
  addDoctor,
  adminLogin,
  allDoctors,
  appointmentsAdmin,
  cancelAppointmentByAdmin,
  adminDashboard
};
