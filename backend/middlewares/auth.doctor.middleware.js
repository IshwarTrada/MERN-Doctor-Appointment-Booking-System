import jwt from "jsonwebtoken";
import { Doctor } from "../models/doctor.model.js";

// authentication middleware
const verifyJwtDoc = async (req, res, next) => {
  try {
    // Get the token from the request to the Cookie or Authorization header
    const token = req.cookies?.dToken; // Step 1 - Get the token from the headers

    // Step 2 - Check if the token exists
    if (!token) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Unauthorized request, Please Log In.",
        });
    }

    // Step 3 - Verify the token
    const token_decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!token_decoded) {
      return res.status(401).json({
        success: false,
        message:
          error?.message || "Unauthorized request, invalid or expired token",
      });
    }

    // Step 4 - Find the user by the decoded token
    const user = await Doctor.findOne({
      email: token_decoded?.email,
      isDeleted: false,
    }).select("-password");
    // Check if the user exists
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized request, user not found.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error during token verification", error);
    return res.status(401).json({
      success: false,
      message: error?.message || "Server error during token verification",
    });
  }
};

export { verifyJwtDoc };
