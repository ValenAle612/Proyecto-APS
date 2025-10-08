// models/Race.ts
import mongoose, { Document, Schema, Model } from 'mongoose';

// Interfaz para TypeScript que representa el documento de una carrera
export interface IRace extends Document {
  name: string;
  location: string;
  date: Date;
  round: number;
}

// Esquema de Mongoose para las carreras
const RaceSchema: Schema<IRace> = new Schema({
  name: {
    type: String,
    required: [true, 'El nombre de la carrera es obligatorio.'],
    trim: true,
  },
  location: {
    type: String,
    required: [true, 'La ubicación es obligatoria.'],
    trim: true,
  },
  date: {
    type: Date,
    required: [true, 'La fecha es obligatoria.'],
  },
  round: {
    type: Number,
    required: [true, 'El número de ronda es obligatorio.'],
  },
});

// Para evitar que el modelo se recompile en Next.js durante el hot-reloading
const Race: Model<IRace> = mongoose.models.Race || mongoose.model<IRace>('Race', RaceSchema);

export default Race;