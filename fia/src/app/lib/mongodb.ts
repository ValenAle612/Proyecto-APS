// lib/mongodb.ts
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Por favor define la variable MONGODB_URI en .env.local');
}

async function dbConnect() {
  if (mongoose.connection.readyState >= 1) {
    console.log("✅ Ya está conectado a MongoDB");
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI as string);
    console.log("✅ Conectado a MongoDB Atlas");
  } catch (error) {
    console.error("❌ Error conectando a MongoDB:", error);
    throw error;
  }
}

export default dbConnect;