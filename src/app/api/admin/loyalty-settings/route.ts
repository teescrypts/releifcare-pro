import { authMiddleware } from "@/app/lib/_middleware";
import apiResponse from "@/app/lib/api-response";
import LoyaltySettings from "@/app/models/loyalty-settings";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const authResponse = await authMiddleware(req);
  if (authResponse instanceof NextResponse) return authResponse;

  const user = authResponse; // Retrieve user ID
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    let settings = await LoyaltySettings.findOne({ admin: user._id });

    if (!settings) {
      settings = new LoyaltySettings({
        admin: user._id,
      });

      await settings.save();
    }

    return apiResponse("Loyalty settings retrieved", { settings }, 200);
  } catch (error) {
    return apiResponse(
      error instanceof Error ? error.message : "An error occurred",
      null,
      400
    );
  }
}

export async function PUT(req: NextRequest) {
  const authResponse = await authMiddleware(req);
  if (authResponse instanceof NextResponse) return authResponse;

  const user = authResponse; // Retrieve admin ID
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { bookingsForPoint, referralsForPoint, pointValue, isActive } =
      await req.json();

    if (
      bookingsForPoint === undefined ||
      referralsForPoint === undefined ||
      pointValue === undefined ||
      isActive === undefined
    ) {
      return apiResponse("All fields are required", null, 400);
    }

    await LoyaltySettings.findOneAndUpdate(
      { admin: user._id },
      { bookingsForPoint, referralsForPoint, pointValue, isActive },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return apiResponse("Settings updated successfully", null, 200);
  } catch (error) {
    return apiResponse(
      error instanceof Error ? error.message : "An error occurred",
      null,
      500
    );
  }
}
