// src/app/models/RaceResult.ts
import mongoose, { Schema, Model } from 'mongoose';

export interface IRaceResult {
  _id?: string;
  race_id: mongoose.Types.ObjectId;
  racer_id: mongoose.Types.ObjectId;
  position: number;
  points: number;
  fastest_lap: boolean;
  dnf: boolean;
  dnf_reason?: string;
  qualifying_position?: number;
  laps_completed?: number;
  race_time?: string;
  created_at: Date;
}

const RaceResultSchema = new Schema<IRaceResult>(
  {
    race_id: {
      type: Schema.Types.ObjectId,
      ref: 'Race',
      required: true,
    },
    racer_id: {
      type: Schema.Types.ObjectId,
      ref: 'Racer',
      required: true,
    },
    position: {
      type: Number,
      required: true,
      min: 1,
    },
    points: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    fastest_lap: {
      type: Boolean,
      default: false,
    },
    dnf: {
      type: Boolean,
      default: false,
    },
    dnf_reason: {
      type: String,
      default: null,
    },
    qualifying_position: {
      type: Number,
      min: 1,
    },
    laps_completed: {
      type: Number,
      min: 0,
    },
    race_time: {
      type: String,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Índices para mejorar rendimiento
RaceResultSchema.index({ race_id: 1, racer_id: 1 }, { unique: true }); // Un piloto = un resultado por carrera
RaceResultSchema.index({ race_id: 1, position: 1 }, { unique: true }); // Una posición por carrera
RaceResultSchema.index({ racer_id: 1 }); // Para buscar por piloto

const RaceResult: Model<IRaceResult> =
  mongoose.models.RaceResult || mongoose.model<IRaceResult>('RaceResult', RaceResultSchema);

export default RaceResult;