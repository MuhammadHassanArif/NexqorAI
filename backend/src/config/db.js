import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDatabase() {
  mongoose.connection.on("error", (error) => {
    console.error("MongoDB error:", error.message);
  });

  await mongoose.connect(env.mongodbUri);
  console.log("MongoDB connected");
}