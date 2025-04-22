import { authMiddleware } from "@/app/lib/_middleware";
import apiResponse from "@/app/lib/api-response";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const authResponse = await authMiddleware(req);
  if (authResponse instanceof NextResponse) return authResponse;

  const admin = authResponse; // Retrieve user ID
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    // const unreadNotifictaionsCount = await Notification.countDocuments({
    //   admin: admin._id,
    //   isRead: false,
    // });

    const unreadNotifictaionsCount = 0;

    return apiResponse(
      "Authentication successful",
      {
        user: admin,
        unreadNotifictaionsCount,
      },
      201
    );
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}
