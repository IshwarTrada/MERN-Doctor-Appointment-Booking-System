import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connctDb from "./db/connectDb.js";
import connectCloudinary from "./config/cloudinary.config.js";
import adminRouter from "./routes/admin.routes.js";
import userRouter from "./routes/user.routes.js";

dotenv.config();

// app config
const app = express();
const port = process.env.PORT || 4000;

connctDb(); // connect to the database
connectCloudinary(); // connect to the cloudinary

// middleware
app.use(cookieParser());
app.use(express.json()); // this is to parse the json data
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Replace with your frontend URL
    credentials: true, // Allow credentials (cookies) to be sent
  })
); // this is to allow the cross origin requests

// api endpoints
app.use("/api/v1", userRouter);
app.use("/api/v1/admin", adminRouter);

app.get("/", (req, res) => {
  res.status(200).send("Hello Worlhhd");
});

// listen
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
