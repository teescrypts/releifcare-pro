import { authMiddleware } from "@/app/lib/_middleware";
import apiResponse from "@/app/lib/api-response";
import Appointment, { IBookedAppointment } from "@/app/models/appointment";
import { DateTime } from "luxon";
import { ObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

const timeZone = "America/Chicago";

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

  const admin = authResponse;
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
        const { datetime, service, status, _id, note, client } = apt;

        const duration = service?.duration ?? 60;

        // Convert to Luxon DateTime object in the specified timezone
        const startDT = DateTime.fromJSDate(datetime!).setZone(timeZone);
        const endDT = startDT.plus({ minutes: duration });

        return {
          id: _id.toString(),
          title: service?.name,
          start: startDT.toISO()!,
          end: endDT.toISO()!,
          service: service?.name,
          client: client as ObjectId,
          note,
          status,
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
