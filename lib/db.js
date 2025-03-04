import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in environment variables.");
}

async function dbConnect() {
  if (mongoose.connection.readyState >= 1) {
    return; 
  }
  
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
}

export default dbConnect;
