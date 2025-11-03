import mongoose from "mongoose";

async function dbConnect() {
  const MONGODB_URI = process.env.MONGODB_URI;

  console.log("!MONGODB_URI || MONGODB_URI.length === 0:", !MONGODB_URI || MONGODB_URI.length === 0);

  if (!MONGODB_URI || MONGODB_URI.length === 0) {
    console.log("❌ Por favor define la variable MONGODB_URI en .env");
    throw new Error("Por favor define la variable MONGODB_URI en .env");
  }

  if (mongoose.connection.readyState >= 1) {
    console.log("✅ Ya está conectado a MongoDB");
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Conectado a MongoDB Atlas");
  } catch (error) {
    console.error("❌ Error conectando a MongoDB:", error);
    throw error;
  }
}

export default dbConnect;
