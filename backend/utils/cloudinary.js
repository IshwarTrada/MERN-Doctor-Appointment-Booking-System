import { v2 as cloudinary } from "cloudinary";
import fs from "fs"; // file system
import connectCloudinary from "../config/cloudinary.config.js";

// Configuration
connectCloudinary();

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    // upload file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "image",
    });
    fs.unlinkSync(localFilePath); // remove locally saved temporary file
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove locally saved temporary file as the upload operation failed
  }
};

const deleteFromCloudinary = async (existedFile) => {
  try {
    // check if file exists
    if (!existedFile) return null;
    // delete file from cloudinary
    const response = await cloudinary.uploader.destroy(existedFile);
    return response;
  } catch (error) {
    console.log("Error deleting file from cloudinary ", error.message);
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
