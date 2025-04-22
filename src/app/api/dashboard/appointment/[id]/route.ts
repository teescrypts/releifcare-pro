import apiResponse from "@/app/lib/api-response";
import { authMiddlewareCustomer } from "@/app/lib/customer-middleware";
import Appointment from "@/app/models/appointment";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const _id = (await params).id;
    const authResponse = await authMiddlewareCustomer(req);
    if (authResponse instanceof NextResponse) return authResponse;

    const client = authResponse;
    if (!client) return apiResponse("Unauthorized", null, 401);

    const updatedApt = await Appointment.findByIdAndUpdate(_id, {
      status: "cancelled",
    });

    if (!updatedApt)
      throw new Error("Unable to cancel appointment. Please try again later");

    return apiResponse("Appointment Cancelled", null, 200);
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}
