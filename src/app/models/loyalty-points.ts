import { Schema, model, models, Document } from "mongoose";

export interface ILoyaltyPoint extends Document {
  admin: Schema.Types.ObjectId;
  client: Schema.Types.ObjectId;
  referralLink: string;
  totalEarned: number;
  totalRedeemed: number;
  transactions: {
    type: "earn" | "redeem";
    source: "referral" | "booking";
    points: number;
    date: Date;
    details?: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const LoyaltyPointSchema = new Schema<ILoyaltyPoint>(
  {
    admin: { type: Schema.Types.ObjectId, ref: "User", required: true },
    client: { type: Schema.Types.ObjectId, ref: "User", required: true },
    referralLink: { type: String, required: true },
    totalEarned: { type: Number, default: 0 },
    totalRedeemed: { type: Number, default: 0 },
    transactions: [
      {
        type: {
          type: String,
          enum: ["earn", "redeem"],
          required: true,
        },
        source: {
          type: String,
          enum: ["referral", "booking"],
        },
        points: { type: Number, required: true },
        date: { type: Date, default: Date.now },
        details: { type: String },
      },
    ],
  },
  { timestamps: true }
);

// Optional virtual: currentBalance = totalEarned - totalRedeemed
LoyaltyPointSchema.virtual("currentBalance").get(function (
  this: ILoyaltyPoint
) {
  return this.totalEarned - this.totalRedeemed;
});

LoyaltyPointSchema.set("toJSON", { virtuals: true });
LoyaltyPointSchema.set("toObject", { virtuals: true });

const LoyaltyPoint =
  models.LoyaltyPoint ||
  model<ILoyaltyPoint>("LoyaltyPoint", LoyaltyPointSchema);

export default LoyaltyPoint;
