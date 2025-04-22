import apiResponse from "@/app/lib/api-response";
import { authMiddlewareCustomer } from "@/app/lib/customer-middleware";
import LoyaltyPoint from "@/app/models/loyalty-points";
import LoyaltySettings from "@/app/models/loyalty-settings";
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import Coupon from "@/app/models/coupon";

export async function POST(req: NextRequest) {
  const authResponse = await authMiddlewareCustomer(req);
  if (authResponse instanceof NextResponse) return authResponse;

  const client = authResponse;
  if (!client) return apiResponse("Unauthorized", null, 401);

  try {
    const settings = await LoyaltySettings.findOne({
      admin: client.admin,
      isActive: true,
    });

    if (!settings) {
      return apiResponse(
        "Loyalty point feature is currently inactive",
        null,
        400
      );
    }

    const loyalty = await LoyaltyPoint.findOne({ client: client._id });
    if (!loyalty || loyalty.currentBalance <= 0) {
      return apiResponse("Insufficient points.", null, 400);
    }

    const activeCoupon = await Coupon.findOne({
      client: client._id,
      used: false,
    });

    if (activeCoupon) {
      return apiResponse("There is an active coupon.", null, 400);
    }

    const couponValue = loyalty.currentBalance * settings.pointValue;
    const code = `LOYAL-${nanoid(8).toUpperCase()}`;

    const coupon = new Coupon({
      admin: client.admin,
      client: client._id,
      code,
      value: couponValue,
      pointsUsed: loyalty.currentBalance,
    });

    await coupon.save();

    // Update loyalty points
    loyalty.totalRedeemed += loyalty.currentBalance;
    loyalty.transactions.push({
      type: "redeem",
      points: loyalty.currentBalance,
      date: new Date(),
      details: `Redeemed ${loyalty.currentBalance} points for $${couponValue} coupon`,
    });

    await loyalty.save();

    return apiResponse("Coupon created successfully.", null, 200);
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}
