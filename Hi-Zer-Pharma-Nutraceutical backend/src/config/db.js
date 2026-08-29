import mongoose from "mongoose";

<<<<<<< HEAD
export async function connectDB() {
  const uri = process.env.MONGO_URI;

 

=======
let cached = globalThis._mongooseConn;
if (!cached) cached = globalThis._mongooseConn = { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;

  const uri = process.env.MONGO_URI;
>>>>>>> 44ea1d68271f7ef405d789f92d0c1b7eaceeb8b7
  if (!uri) {
    throw new Error("MONGO_URI is not set in the environment");
  }

<<<<<<< HEAD
  const conn = await mongoose.connect(uri);
  console.log(`MongoDB connected`);
  return conn;
=======
  if (!cached.promise) {
    cached.promise = mongoose.connect(uri).then((conn) => {
      console.log("MongoDB connected");
      return conn;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
>>>>>>> 44ea1d68271f7ef405d789f92d0c1b7eaceeb8b7
}