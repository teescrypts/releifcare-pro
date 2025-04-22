import { authMiddleware } from "@/app/lib/_middleware";
import apiResponse from "@/app/lib/api-response";
import Appointment, { IBookedAppointment } from "@/app/models/appointment";
import { ObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

type AppointmentEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  service: string;
  client: ObjectId;
  note?: string;
  status: "pending" | "completed" | "cancelled";
};

export async function GET(req: NextRequest) {
  const authResponse = await authMiddleware(req);
  if (authResponse instanceof NextResponse) return authResponse;

  const admin = authResponse; // Retrieve user ID
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const start = searchParams.get("start");
    const end = searchParams.get("end");

    const filter: Record<string, unknown> = {
      admin: admin._id,
    };

    if (start && end) {
      filter.datetime = {
        $gte: new Date(start),
        $lte: new Date(end),
      };
    }

    const appointments = await Appointment.find(filter).populate({
      path: "client",
      select: "fname lname",
    });

    interface IBookedAppointmentwithId extends IBookedAppointment {
      _id: string;
    }

    const mapped: AppointmentEvent[] = appointments.map(
      (apt: IBookedAppointmentwithId) => {
        const startDateTime = new Date(apt.datetime!); // guaranteed by pre-save hook
        const durationMins = apt.service?.duration ?? 60;

        const endDateTime = new Date(
          startDateTime.getTime() + durationMins * 60 * 1000
        );

        return {
          id: apt._id.toString(),
          title: apt.service?.name,
          start: startDateTime.toISOString(),
          end: endDateTime.toISOString(),
          service: apt.service?.name,
          client: (apt.client as ObjectId) ?? "Unknown",
          note: apt.note,
          status: apt.status,
        };
      }
    );

    return apiResponse("success", { appointments: mapped }, 200);
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}
