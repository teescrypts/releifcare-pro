import { Schema, Document, Types, model, models } from "mongoose";

export interface ICouponCode extends Document {
  code: string;
  admin: Types.ObjectId;
  client: Types.ObjectId;
  pointsUsed: number;
  value: number; // monetary value of the coupon (e.g., $10)
  used: boolean;
}

const CouponCodeSchema = new Schema<ICouponCode>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    client: {
      type: Schema.Types.ObjectId,
      ref: "User", // Assuming "User" is your client model
      required: true,
    },
    pointsUsed: {
      type: Number,
      required: true,
    },
    value: {
      type: Number,
      required: true, // e.g. $10
    },
    used: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Prevent OverwriteModelError in development
const Coupon = models.Coupon || model<ICouponCode>("Coupon", CouponCodeSchema);

export default Coupon;
