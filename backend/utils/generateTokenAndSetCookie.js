import jwt from "jsonwebtoken";

const options = {
    httpOnly: true, // client-side JavaScript cannot access the cookie (XSS protection)
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // cookie will only be sent in a first-party context
    maxAge: 7 * 24 * 60 * 60 * 1000,
  }

export const generateTokenAndSetCookie = (res, payload, tname = "token") => {
  const token = jwt.sign( payload , process.env.JWT_SECRET, {
    expiresIn: "7d"
  });

  res.cookie(tname, token, options);

  return token;
};
