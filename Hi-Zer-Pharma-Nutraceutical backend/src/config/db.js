import mongoose from "mongoose";

let cached = globalThis._mongooseConn;
if (!cached) cached = globalThis._mongooseConn = { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;

  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI is not set in the environment");
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri).then((conn) => {
      console.log("MongoDB connected");
      return conn;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}