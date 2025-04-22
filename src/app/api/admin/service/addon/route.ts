import { authMiddleware } from "@/app/lib/_middleware";
import apiResponse from "@/app/lib/api-response";
import Service from "@/app/models/service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Authenticate user
  const authResponse = await authMiddleware(req);
  if (authResponse instanceof NextResponse) return authResponse;

  const user = authResponse;
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const services = await Service.find({ admin: user._id }).select("-addons");
    return apiResponse("Success", { services }, 200);
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      400
    );
  }
}
