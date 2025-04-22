import mongoose, { Schema, Document, model, models } from "mongoose";

export interface ISOAPNote extends Document {
  appointment: mongoose.Types.ObjectId;
  client: mongoose.Types.ObjectId;
  admin: mongoose.Types.ObjectId;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  createdAt: Date;
  updatedAt: Date;
}

const SOAPNoteSchema = new Schema<ISOAPNote>(
  {
    appointment: {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },
    client: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subjective: { type: String, required: true },
    objective: { type: String, required: true },
    assessment: { type: String, required: true },
    plan: { type: String, required: true },
  },
  { timestamps: true }
);

const SOAPNote =
  models.SOAPNote || model<ISOAPNote>("SOAPNote", SOAPNoteSchema);

export default SOAPNote;
