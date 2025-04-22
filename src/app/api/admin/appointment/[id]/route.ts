import { authMiddleware } from "@/app/lib/_middleware";
import apiResponse from "@/app/lib/api-response";
import Appointment from "@/app/models/appointment";
import LoyaltyPoint from "@/app/models/loyalty-points";
import LoyaltySettings from "@/app/models/loyalty-settings";
import User from "@/app/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResponse = await authMiddleware(req);
  if (authResponse instanceof NextResponse) return authResponse;

  const admin = authResponse; // Retrieve user ID
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  try {
    const _id = (await params).id;
    const apt = await Appointment.findOne({ _id, admin: admin._id }).populate({
      path: "client",
      select: "fname lname",
    });
    if (!apt) return apiResponse("Invalid Operation", null, 401);

    return apiResponse("Success", { apt }, 200);
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResponse = await authMiddleware(req);
  if (authResponse instanceof NextResponse) return authResponse;

  const admin = authResponse; // Retrieve user ID
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  try {
    const appointmentId = (await params).id;
    const { status } = await req.json();

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return apiResponse("Appointment not found", null, 404);
    }

    // Only allow admins to mark as complete
    if (admin.role !== "admin" || !appointment.admin.equals(admin._id)) {
      return apiResponse(
        "Unauthorized to complete this appointment",
        null,
        403
      );
    }

    // Update status
    appointment.status = status;
    await appointment.save();

    if (status === "cancelled") {
      return apiResponse(
        "Appointment cancelled",
        null,
        200
      );
    }

    // Fetch loyalty settings
    const loyaltySettings = await LoyaltySettings.findOne({
      admin: admin._id,
      isActive: true,
    });

    if (!loyaltySettings) {
      return apiResponse(
        "Appointment marked as completed. Loyalty program inactive.",
        null,
        200
      );
    }

    const client = await User.findById(appointment.client);
    if (!client) {
      return apiResponse("Client not found", null, 404);
    }

    // Find or create LoyaltyPoint document
    const loyaltyPoint = await LoyaltyPoint.findOne({
      admin: admin._id,
      client: client._id,
    });

    // Count completed appointments
    const bookingCount = await Appointment.countDocuments({
      admin: admin._id,
      client: client._id,
      status: "completed",
    });

    // Count how many booking points already earned
    const earnedBookingPoints = loyaltyPoint.transactions.filter(
      (tx: { source: string }) => tx.source === "booking"
    ).length;

    const expectedPoints = Math.floor(
      bookingCount / loyaltySettings.bookingsForPoint
    );

    if (expectedPoints > earnedBookingPoints) {
      // Add a point
      loyaltyPoint.totalEarned += 1;
      loyaltyPoint.transactions.push({
        type: "earn",
        source: "booking",
        points: 1,
        date: new Date(),
        details: `Earned for ${bookingCount} completed bookings.`,
      });
      await loyaltyPoint.save();
    }

    // 🔁 Handle referral bonus
    if (
      client.referral?.referred &&
      !client.referral.used &&
      client.referral.referredBy
    ) {
      // Mark this referral as used
      client.referral.used = true;
      await client.save();

      const referrer = await User.findById(client.referral.referredBy);
      if (referrer) {
        const referrerLoyalty = await LoyaltyPoint.findOne({
          admin: admin._id,
          client: referrer._id,
        });

        // Count referral points already earned
        const referralCount = await User.countDocuments({
          admin: admin._id,
          "referral.referredBy": referrer._id,
          "referral.used": true,
        });

        const referrerEarnedReferralPoints =
          referrerLoyalty.transactions.filter(
            (tx: { source: string }) => tx.source === "referral"
          ).length;

        const expectedReferralPoints = Math.floor(
          referralCount / loyaltySettings.referralsForPoint
        );

        if (expectedReferralPoints > referrerEarnedReferralPoints) {
          referrerLoyalty.totalEarned += 1;
          referrerLoyalty.transactions.push({
            type: "earn",
            source: "referral",
            points: 1,
            date: new Date(),
            details: `Earned for ${referralCount} referrals.`,
          });
          await referrerLoyalty.save();
        }
      }
    }

    return apiResponse(
      "Appointment completed and loyalty points updated.",
      null,
      200
    );
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}
