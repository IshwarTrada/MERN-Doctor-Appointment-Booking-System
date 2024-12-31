import jwt from "jsonwebtoken";

// admin authentication middleware
const authAdmin = (req, res, next) => {
  try {
    // get token from headers
    const atoken = req.cookies?.atoken;

    if (!atoken) {
      return res
        .status(400)
        .json({ success: false, message: "Access denied. Login Again" });
    }

    // token decoding
    const { email, role } = jwt.verify(atoken, process.env.JWT_SECRET);

    // check if token is valid
    if (email !== process.env.ADMIN_EMAIL && role !== "admin") {
      return res
        .status(400)
        .json({ success: false, message: "Access denied. Login Again" });
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export default authAdmin;
