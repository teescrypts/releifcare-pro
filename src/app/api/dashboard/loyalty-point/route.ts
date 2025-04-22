import Coupon from "@/app/models/coupon";
import apiResponse from "@/app/lib/api-response";
import { authMiddlewareCustomer } from "@/app/lib/customer-middleware";
import LoyaltyPoint from "@/app/models/loyalty-points";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const authResponse = await authMiddlewareCustomer(req);
    if (authResponse instanceof NextResponse) return authResponse;

    const client = authResponse;
    if (!client) return apiResponse("Unauthorized", null, 401);

    const loyaltyPointDoc = await LoyaltyPoint.findOne({ client: client._id });
    if (!loyaltyPointDoc) throw new Error("Invalid Operation.");

    // Convert to plain object and include virtuals
    const loyaltyPoint = loyaltyPointDoc.toObject({ virtuals: true });
    const coupon = await Coupon.findOne({ client: client._id, used: false });

    return apiResponse("success", { loyaltyPoint, coupon }, 200);
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}
