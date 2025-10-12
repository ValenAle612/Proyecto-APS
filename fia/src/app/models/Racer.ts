// src/app/models/Racer.ts
import mongoose, { Document, Schema, Model } from 'mongoose';

// Interfaz para TypeScript que representa el documento de un piloto
export interface IRacer extends Document {
  name: string;
  team: string;
  number: number;
  nationality: string;
  category: string;
  role: string;
}

// Esquema de Mongoose para los pilotos
const RacerSchema: Schema<IRacer> = new Schema({
  name: {
    type: String,
    required: [true, 'El nombre del piloto es obligatorio.'],
    trim: true,
  },
  team: {
    type: String,
    required: [true, 'El equipo es obligatorio.'],
    trim: true,
  },
  number: {
    type: Number,
    required: [true, 'El número es obligatorio.'],
    unique: true, // Asegura que no haya dos pilotos con el mismo número
  },
  nationality: {
    type: String,
    required: [true, 'La nacionalidad es obligatoria.'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'La categoría es obligatoria.'],
    trim: true,
  },
  role: {
    type: String,
    required: [true, 'El rol es obligatorio.'],
    enum: ['Titular', 'Suplente', 'Reserva'],
    default: 'Titular',
  },
}, {
  timestamps: true,
});

// Evitar recompilar el modelo en Next.js
const Racer: Model<IRacer> = mongoose.models.Racer || mongoose.model<IRacer>('Racer', RacerSchema);

export default Racer;