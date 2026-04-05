import mongoose from "mongoose";

// Connect the application to MongoDB
export const connectMongoDB = async () => {
  try {
    // Read MongoDB connection string from environment variables
    const uri = process.env.MONGODB_URI;

    // Ensure the URI is defined before attempting connection
    if (!uri) {
      throw new Error("MONGODB_URI is not defined");
    }

    // Establish connection to MongoDB
    await mongoose.connect(uri, {
      // Enable auto index creation only in development
      autoIndex: process.env.NODE_ENV === "development",
    });

    console.log("MongoDB connected successfully");
  } catch (error) {
    // Log connection errors and stop the app
    console.error("MongoDB connection failed", error);
    process.exit(1);
  }
};
