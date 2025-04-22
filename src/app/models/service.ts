import mongoose, { Schema, Document, Model, models, model } from "mongoose";

export interface IAddon {
  _id: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  price: number;
  duration?: number;
  status?: "active" | "on hold";
}

export interface IService extends Document {
  admin: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  price: number;
  duration?: number;
  status?: "active" | "on hold";
  addons: IAddon[];
}

const addonSchema = new Schema<IAddon>({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  price: { type: Number, required: true },
  duration: { type: Number },
  status: { type: String, enum: ["active", "on hold"], default: "active" },
});

const serviceSchema = new Schema<IService>(
  {
    admin: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true },
    duration: { type: Number },
    status: { type: String, enum: ["active", "on hold"], default: "active" },
    addons: { type: [addonSchema], default: [] },
  },
  { timestamps: true }
);

const Service: Model<IService> =
  models.Service || model<IService>("Service", serviceSchema);

export default Service;
