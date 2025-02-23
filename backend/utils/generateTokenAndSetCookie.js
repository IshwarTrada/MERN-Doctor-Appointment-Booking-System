import jwt from "jsonwebtoken";

export const options = {
  httpOnly: false, // client-side JavaScript cannot access the cookie (XSS protection)
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict", // cookie will only be sent in a first-party context
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const generateTokenAndSetCookie = (email, role, tname, res) => {
  const token = jwt.sign({ email, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });

  res.cookie(tname, token, options);

  return token;
};