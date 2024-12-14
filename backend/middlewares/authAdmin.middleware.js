import jwt from "jsonwebtoken";

// admin authentication middleware
const authAdmin = (req, res, next) => {
  try {
    // get token from headers
    const { atoken } = req.headers;
    if (!atoken) {
      return res
        .status(400)
        .json({ success: false, message: "Access denied. Login Again" });
    }

    // token decoding
    const token_decoded = jwt.verify(atoken, process.env.JWT_SECRET);

    // check if token is valid
    if (
      token_decoded !==
      process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD
    ) {
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