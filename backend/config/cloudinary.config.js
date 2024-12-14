import { v2 as cloudinary } from "cloudinary";

const connectCloudinary = async () => {
    // Configuration
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_SECRET_KEY, // Click 'View API Keys' above to copy your API secret
      });
};

export default connectCloudinary;
