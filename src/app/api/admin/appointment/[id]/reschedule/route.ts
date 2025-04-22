import { authMiddleware } from "@/app/lib/_middleware";
import apiResponse from "@/app/lib/api-response";
import Appointment from "@/app/models/appointment";
import { NextRequest, NextResponse } from "next/server";

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
    const _id = (await params).id;
    const body = await req.json();
    const { newDate, newTime } = body;

    const appointment = await Appointment.findOne({ _id, admin: admin._id });

    if (!appointment) {
      return apiResponse("Invalid Operation", null, 404);
    }

    // Save current schedule to reschedule history
    const previousEntry = {
      date: appointment.date,
      bookedTime: appointment.bookedTime,
    };

    appointment.reschedule.previousDates.push(previousEntry);
    appointment.reschedule.isRescheduled = true;

    // Update with new date and time
    appointment.date = newDate;
    appointment.bookedTime = newTime;

    await appointment.save();

    return apiResponse("Appointment rescheduled successfully", null, 200);
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}
