import jwt from "jsonwebtoken";

// Middleware to verify token and role
const verifyTokenAndRole = (requiredRole) => {
  return (req, res, next) => {
    const token = req.cookies?.token; // Extract the token from the cookie

    if (!token) {
      return res.status(401).json({ message: "Token is missing or invalid" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res
          .status(403)
          .json({ success: false, message: "Invalid or expired token" });
      }

      // Check if the role in the token matches the required role for this route
      if (decoded.role !== requiredRole) {
        return res
          .status(403)
          .json({
            success: false,
            message: "Forbidden: You do not have access to this resource",
          });
      }

      req.user = decoded; // Attach the user data to the request
      next(); // Proceed to the next middleware/route handler
    });
  };
};

export default verifyTokenAndRole;

// --------------------------------------------------
// --------------------------------------------------
// --------------------------------------------------
// --------------------------------------------------
// admin authentication middleware
// const authAdmin = (req, res, next) => {
//   try {
//     // get token from headers
//     const atoken = req.cookies?.atoken;

//     if (!atoken) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Access denied. Login Again" });
//     }

//     // token decoding
//     const { email, role } = jwt.verify(atoken, process.env.JWT_SECRET);

//     // check if token is valid
//     if (email !== process.env.ADMIN_EMAIL && role !== "admin") {
//       return res
//         .status(400)
//         .json({ success: false, message: "Access denied. Login Again" });
//     }

//     req.atoken = { email, role };
//     next();
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// export default authAdmin;
