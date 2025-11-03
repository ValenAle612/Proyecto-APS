import mongoose from "mongoose";

async function dbConnect() {
  const MONGODB_URI = process.env.MONGODB_URI?.trim(); // 👈 agrega trim para evitar espacios

  console.log("📂 MONGODB_URI dentro de mongodb.ts:", MONGODB_URI);

  if (!MONGODB_URI || MONGODB_URI.length === 0) {
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
