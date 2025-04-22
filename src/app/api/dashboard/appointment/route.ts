import apiResponse from "@/app/lib/api-response";
import { authMiddlewareCustomer } from "@/app/lib/customer-middleware";
import { NextRequest, NextResponse } from "next/server";
import Appointment from "@/app/models/appointment";

export async function GET(req: NextRequest) {
  try {
    const authResponse = await authMiddlewareCustomer(req);
    if (authResponse instanceof NextResponse) return authResponse;

    const client = authResponse;
    if (!client) return apiResponse("Unauthorized", null, 401);

    const searchParams = req.nextUrl.searchParams;
    const appointmentType = searchParams.get("status");

    let statusFilter: string[] = [];

    if (appointmentType === "upcoming") {
      statusFilter = ["pending"];
    } else if (appointmentType === "past") {
      statusFilter = ["completed", "cancelled"];
    } else {
      return apiResponse("Invalid status type", null, 400);
    }

    const appointments = await Appointment.find({
      client: client._id,
      status: { $in: statusFilter },
    }).sort({ date: -1, "bookedTime.from": -1 });

    return apiResponse(
      "Appointments fetched successfully",
      { appointments },
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
