import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connctDb from "./db/connectDb.js";
import connectCloudinary from "./config/cloudinary.config.js";
import adminRouter from "./routes/admin.routes.js";

dotenv.config();

// app config
const app = express();
const port = process.env.PORT || 4000;

connctDb(); // connect to the database
connectCloudinary(); // connect to the cloudinary

// middleware
app.use(express.json()); // this is to parse the json data
app.use(cors()); // this is to allow the cross origin requests

// api endpoints
app.use('/api/v1/admin',adminRouter)


app.get("/", (req, res) => {
  res.status(200).send("Hello Worlhhd");
});

// listen
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
