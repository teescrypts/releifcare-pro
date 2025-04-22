import mongoose, { Schema, Document, models, model } from "mongoose";

export interface ILoyaltySettings extends Document {
  admin: mongoose.Types.ObjectId;
  bookingsForPoint: number;
  referralsForPoint: number;
  pointValue: number;
  isActive: boolean;
}

const LoyaltySettingsSchema = new Schema<ILoyaltySettings>(
  {
    admin: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    bookingsForPoint: { type: Number, required: true, default: 10 },
    referralsForPoint: { type: Number, required: true, default: 5 },
    pointValue: { type: Number, required: true, default: 1.0 },
    isActive: { type: Boolean, default: true }, 
  },
  { timestamps: true }
);

const LoyaltySettings =
  models.LoyaltySettings ||
  model<ILoyaltySettings>("LoyaltySettings", LoyaltySettingsSchema);

export default LoyaltySettings;
