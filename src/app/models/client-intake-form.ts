import mongoose, { Schema, Document, Model, models, model } from "mongoose";

interface IClientIntakeData extends Document {
  clientId: mongoose.Types.ObjectId;
  admin: mongoose.Types.ObjectId;
  fname: string;
  lname: string;
  email: string;
  phone: string;
  dob: Date;
  gender: "Male" | "Female" | "Other";
  emergencyContact: string;
  medicalConditions?: string;
  medications?: string;
  injuries?: string;
  massagePressure?: "Light" | "Medium" | "Deep Tissue";
  focusAreas?: string;
  allergies?: string;
  consent: boolean;
}

const ClientIntakeDataSchema = new Schema<IClientIntakeData>(
  {
    clientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    admin: { type: Schema.Types.ObjectId, ref: "User", required: true },
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    emergencyContact: { type: String, required: true },
    medicalConditions: { type: String, default: "" },
    medications: { type: String, default: "" },
    injuries: { type: String, default: "" },
    massagePressure: {
      type: String,
      enum: ["Light", "Medium", "Deep Tissue"],
      default: "Medium",
    },
    focusAreas: { type: String, default: "" },
    allergies: { type: String, default: "" },
    consent: { type: Boolean, required: true },
  },
  { timestamps: true }
);

// Prevent OverwriteModelError
const ClientIntakeData: Model<IClientIntakeData> =
  models.ClientIntakeData || model<IClientIntakeData>("ClientIntakeData", ClientIntakeDataSchema);

export default ClientIntakeData;
