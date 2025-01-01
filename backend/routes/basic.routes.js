import express, { Router } from "express";

import verifyTokenAndRole from "../middlewares/authAdmin.middleware.js";

const basicRouter = Router();

basicRouter.get("/check-role", (req, res) => {
  const token = req.cookies.token; // Extract the token from the cookie

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    // Return the role of the user to the frontend
    res.json({ role: decoded.role });
  });
});

export default basicRouter;
