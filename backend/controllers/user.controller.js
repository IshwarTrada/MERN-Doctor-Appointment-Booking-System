import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import validator from "validator";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Doctor } from "../models/doctor.model.js";
import { Appointment } from "../models/appointment.model.js";
import razorpay from "razorpay";

const registerUser = async (req, res) => {
  try {
    // Step 1: Get data of user from form
    const { name, email, password } = req.body;

    // Step 2: Validate data
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter your Full Name." });
    }

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

    if (password.length < 8) {
      // validate password
      return res.status(400).json({
        success: false,
        message: "Please enter a strong password of atleat 8 characters.",
      });
    }

    // Step 3: Check if user already exists
    const userExists = await User.findOne({ email, isDeleted: false });
    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // Step 4: Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Step 4: Create user
    const user = await User.create({ name, email, password: hashedPassword });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not created successfully." });
    }

    // Step 5: Generate token and set cookie
    generateTokenAndSetCookie(user.email, user.role, res);

    return res.status(201).json({
      success: true,
      data: user,
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const loginUser = async (req, res) => {
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
    const user = await User.findOne({ email, isDeleted: false });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User does not exist" });
    }

    // Step 4: Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Step 5: Generate token and set cookie
    generateTokenAndSetCookie(user.email, user.role, res);

    return res.status(200).json({
      success: true,
      data: user,
      message: "User logged in successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

const getUserProfile = async (req, res) => {
  try {
    const { email } = req.user;

    const user = await User.findOne({ email, isDeleted: false }).select(
      "-password"
    );

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User does not exist" });
    }

    return res.status(200).json({
      success: true,
      data: user,
      message: "User profile fetched successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { email } = req.user;
    const { name, address, gender, dob, phone } = req.body;
    const image = req.file;

    const user = await User.findOne({ email, isDeleted: false });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User does not exist" });
    }

    if (!name || !phone || !dob || !gender) {
      return res
        .status(400)
        .json({ success: false, message: "Fill all the details." });
    }

    await User.findByIdAndUpdate(user._id, {
      name,
      phone,
      dob,
      gender,
      address: JSON.parse(address),
    });

    if (image) {
      const imageUpload = await uploadOnCloudinary(image.path);

      if (!imageUpload) {
        return res
          .status(500)
          .json({ success: false, message: "Error uploading image" });
      }

      await User.findByIdAndUpdate(user._id, { image: imageUpload.secure_url });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Book appointment
const bookAppointment = async (req, res) => {
  try {
    const { docId, slotDate, slotTime } = req.body;
    console.log(req.body);

    const { email } = req.user;

    // Check if doctor exists
    const docData = await Doctor.findById(docId).select("-password");

    if (!docData) {
      return res
        .status(400)
        .json({ success: false, message: "Doctor not found" });
    }

    // Check if doctor is available
    if (!docData.availability) {
      return res
        .status(400)
        .json({ success: false, message: "Doctor is not available" });
    }

    let slots_booked = docData.slots_booked;

    // check for slot availability
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res
          .status(404)
          .json({ success: false, message: "Slot not available" });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [];
      slots_booked[slotDate].push(slotTime);
    }

    const userData = await User.findOne({ email, isDeleted: false }).select(
      "-password"
    );

    delete docData.slots_booked;

    const appointment = await Appointment.create({
      userId: userData._id,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotDate,
      slotTime,
    });

    if (!appointment) {
      return res
        .status(400)
        .json({ success: false, message: "Appointment not created" });
    }

    // Update doctor's slots_booked
    await Doctor.findByIdAndUpdate(docId, { slots_booked });

    return res.status(201).json({
      success: true,
      data: appointment,
      message: "Appointment booked.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// get user appointments for forntend my-appoinments page
const getUserAppointments = async (req, res) => {
  try {
    const { email } = req.user;

    const user = await User.findOne({ email, isDeleted: false });

    const appointments = await Appointment.find({
      userId: user._id,
      isDeleted: false,
    }).sort({ createdAt: -1 });

    if (!appointments) {
      return res
        .status(404)
        .json({ success: false, message: "Appointments not found" });
    }

    return res.status(200).json({
      success: true,
      data: appointments,
      message: "Appointments fetched successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// cancel appointment
const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const { email } = req.user;

    const user = await User.findOne({ email, isDeleted: false });

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }

    if (appointment.userId !== user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized to cancel this appointment",
      });
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

// Razorpay Instance Step 1
const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  // key_secret: process.env.RAZORPAY_KEY_SECRET,
  key_id: "rzp_test_uq2Ix2p0cEHKQA",
  key_secret: "AWwYJH1ePT1ReLP9MVQneVcl",
});

// API : make payment of appointment using razorpay
const paymentRazorpay = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment || appointment.cancelled) {
      return res.status(404).json({
        success: false,
        message: "Appointment cancelled or not found",
      });
    }

    // creating options for razorpay payment
    const options = {
      amount: appointment.amount * 100, // amount in smallest currency unit
      currency: process.env.CURRENCY,
      receipt: `receipt_order_${appointmentId}`,
    };

    // Creating order
    const order = await razorpayInstance.orders.create(options);

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// API to verify payment success
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;

    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

    if (orderInfo.status === "paid") {
      const appointmentId = orderInfo.receipt.split("_").pop();

      await Appointment.findByIdAndUpdate(appointmentId, { payment: true });

      return res.status(200).json({
        success: true,
        message: "Payment successful",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Payment failed",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export {
  registerUser,
  loginUser,
  logout,
  getUserProfile,
  updateUserProfile,
  bookAppointment,
  getUserAppointments,
  cancelAppointment,
  paymentRazorpay,
  verifyPayment,
};
