import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import { Doctor } from "../models/doctor.model.js";
import jwt from "jsonwebtoken";

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
      res.json({ success: false, message: "Missing Details" });
    }

    if (!validator.isEmail(email)) {
      // validate email using validator package
      res.json({ success: false, message: "Enter a valid email" });
    }

    if (password.length < 8) {
      // validate password
      res.json({ success: false, message: "Please enter a strong password" });
    }

    // Step 3: hashing doctor password
    const saltRounds = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Step 4: image upload on cloudinary
    const imageUpload = await cloudinary.uploader.upload(image.path, {
      resource_type: "image",
    });

    const imageUrl = imageUpload.secure_url;

    // Step 5: Create doctor object
    const doctorData = {
      name,
      email,
      image: imageUrl,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: JSON.parse(address),
      date: Date.now(),
    };

    const newDoctor = await Doctor.create(doctorData);

    res.json({ success: true, message: "Doctor Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for admin login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { addDoctor, loginAdmin };
