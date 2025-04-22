import apiResponse from "@/app/lib/api-response";
import ClientIntakeData from "@/app/models/client-intake-form";
import LoyaltyPoint from "@/app/models/loyalty-points";
import User from "@/app/models/user";
import getAdmin from "@/app/utils/get-admin";
import { NextRequest } from "next/server";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdmin(req);
    if (!admin)
      return apiResponse("Still setting up. Please try again later", null, 503);

    const { userData, clientIntakeForm } = await req.json();

    if (!userData || !clientIntakeForm)
      return apiResponse("Missing user data or intake form", null, 400);

    const referredBy = req.nextUrl.searchParams.get("referredBy");

    // Sanitize and validate referral
    let referral: {
      referred: boolean;
      referredBy?: string;
      used: boolean;
    } = { referred: false, used: false };
    let referralAdmin = admin;

    if (referredBy && mongoose.Types.ObjectId.isValid(referredBy)) {
      const referredUser = await User.findOne({
        _id: referredBy,
        role: "customer",
      }).select("_id admin");

      if (!referredUser) {
        return apiResponse("Invalid referral link", null, 400);
      }

      referral = { referred: true, referredBy, used: false };
      referralAdmin = referredUser.admin!;
    }

    // Create user
    const newUser = await new User({
      admin: referralAdmin,
      ...userData,
      referral,
    }).save();

    if (!newUser)
      return apiResponse("Unable to create user. Please try again", null, 500);

    // Save intake form (in parallel with loyalty setup)
    const intakeFormPromise = new ClientIntakeData({
      admin,
      clientId: newUser._id,
      ...clientIntakeForm,
    }).save();

    // Setup loyalty point
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? process.env.BASE_URL
        : "http://localhost:3000";

    const loyaltyPointPromise = new LoyaltyPoint({
      admin,
      client: newUser._id,
      referralLink: `${baseUrl}/demo/form?reflink=${newUser._id}`,
    }).save();

    // Run both in parallel
    await Promise.all([intakeFormPromise, loyaltyPointPromise]);

    // Generate token
    const token = await newUser.generateAuthToken();

    return apiResponse("success", { token }, 201);
  } catch (error) {
    console.error("POST /api/create-user error:", error);
    return apiResponse(
      error instanceof Error ? error.message : "An unknown error occurred",
      null,
      500
    );
  }
}
