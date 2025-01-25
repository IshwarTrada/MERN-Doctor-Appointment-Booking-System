import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import validator from "validator";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";

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

export { registerUser, loginUser, logout };
