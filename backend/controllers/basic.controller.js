import jwt from "jsonwebtoken";

const checkRole = async (req, res) => {
  const token = req.cookies?.token; // Extract the token from the cookie

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({success: false, message: "Invalid or expired token" });
    }

    // Return the role of the user to the frontend
    return res.status(200).json({success: true, role: decoded.role });
  });
};

const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};
export { checkRole, logout };
