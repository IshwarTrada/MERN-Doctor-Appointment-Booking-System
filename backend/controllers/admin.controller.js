import validator from "validator";
import bcrypt from "bcrypt";
import { Doctor } from "../models/doctor.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

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
      parsedAddress = JSON.parse(address); // Ensure the address field is correctly parsed
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

export { addDoctor };
