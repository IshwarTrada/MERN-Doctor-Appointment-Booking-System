import validator from "validator";
import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { Doctor } from "../models/doctor.model.js";

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
    const user = await User.findOne({
      email,
      role: "DOCTOR",
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
    generateTokenAndSetCookie(user.email, user.role, "dToken",res);

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
    const doctors = await Doctor.find({}).select(["-password","-email"]);
    return res.status(200).json({
      success: true,
      data: doctors,
      message: "All Doctors fetched successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
}

export { doctorLogin, changeAvailability, doctorList };
