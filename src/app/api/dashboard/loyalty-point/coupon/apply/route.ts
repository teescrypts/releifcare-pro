import apiResponse from "@/app/lib/api-response";
import Coupon from "@/app/models/coupon";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();

    const coupon = await Coupon.findOne({ code });

    if (!coupon) return apiResponse("Invalid coupon code", null, 400);

    return apiResponse("success", { coupon }, 200);
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}
