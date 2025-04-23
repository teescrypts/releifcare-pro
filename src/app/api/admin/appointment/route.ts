import { authMiddleware } from "@/app/lib/_middleware";
import apiResponse from "@/app/lib/api-response";
import Appointment, { IBookedAppointment } from "@/app/models/appointment";
import { ObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

type AppointmentEvent = {
  id: string;
  title: string;
  start: number;
  end: number;
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
        const {  service, status, _id, note, client } = apt;

        const dateTimeStrStart = `${apt.date}T${apt.bookedTime.from}:00`;
        const dateTimeStart = new Date(dateTimeStrStart);
        const start = dateTimeStart.getTime();

        const dateTimeStrEnd = `${apt.date}T${apt.bookedTime.to}:00`;
        const dateTimeEnd = new Date(dateTimeStrEnd);
        const end = dateTimeEnd.getTime();

        return {
          id: _id.toString(),
          title: service?.name,
          start: start,
          end: end,
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
