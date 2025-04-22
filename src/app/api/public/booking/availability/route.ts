import apiResponse from "@/app/lib/api-response";
import Appointment from "@/app/models/appointment";
import OpeningHour, { IOpeningHour } from "@/app/models/opening-hour";
import getAdmin from "@/app/utils/get-admin";
import { DateTime, Interval } from "luxon";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const admin = await getAdmin(req);

    if (!admin)
      return apiResponse(
        "We are still setting up. Please try again later",
        null,
        400
      );

    const openingHours = await OpeningHour.findOne({ admin });

    if (!openingHours)
      return apiResponse(
        "We're still getting things ready—please check back later",
        null,
        200
      );

    const leadTimeHours = 24;
    const bookingWindowDays = 30;
    const timeZone = "America/Chicago";

    const now = DateTime.now().setZone(timeZone).plus({ hours: leadTimeHours });
    const bookingWindowEnd = now.plus({ days: bookingWindowDays });

    // fetch existing appointment
    const appointments = await Appointment.find({
      admin,
      status: "pending",
    }).select("date bookedTime");

    const searchParams = req.nextUrl.searchParams;
    const durationInMinutesRaw = searchParams.get("durationInMinutes");

    if (!durationInMinutesRaw)
      return apiResponse(
        "Invalid Operation. duration in minutes is required",
        null,
        400
      );

    const durationInMinutes = Number(durationInMinutesRaw);
    const availability = [];

    for (
      let day = now.startOf("day");
      day < bookingWindowEnd;
      day = day.plus({ days: 1 })
    ) {
      const dayName = day.toFormat("cccc").toLowerCase();
      const timeSlots = openingHours[dayName as keyof IOpeningHour];

      if (!timeSlots || timeSlots.length === 0) {
        availability.push({ date: day.toISODate(), slots: [] });
        continue;
      }

      const dailyAvailability = [];

      for (const slot of timeSlots) {
        const slotStart = DateTime.fromISO(`${day.toISODate()}T${slot.from}`, {
          zone: timeZone,
        });
        const slotEnd = DateTime.fromISO(`${day.toISODate()}T${slot.to}`, {
          zone: timeZone,
        });

        let currentStart = slotStart;

        // Iterate through time slots and check for conflicts
        while (currentStart.plus({ minutes: durationInMinutes }) <= slotEnd) {
          const proposedInterval = Interval.fromDateTimes(
            currentStart,
            currentStart.plus({ minutes: durationInMinutes })
          );

          const isConflict = appointments.some((appointment) => {
            const appointmentStart = DateTime.fromISO(
              `${appointment.date}T${appointment.bookedTime.from}`,
              { zone: timeZone }
            );
            const appointmentEnd = DateTime.fromISO(
              `${appointment.date}T${appointment.bookedTime.to}`,
              { zone: timeZone }
            );

            const appointmentInterval = Interval.fromDateTimes(
              appointmentStart,
              appointmentEnd
            );

            return proposedInterval.overlaps(appointmentInterval);
          });

          if (!isConflict) {
            dailyAvailability.push(currentStart.toFormat("HH:mm"));
          }

          currentStart = currentStart.plus({ minutes: 15 }); // Increment by a minimum buffer (e.g., 15 minutes)
        }
      }

      if (dailyAvailability.length > 0) {
        availability.push({
          date: day.toISODate(),
          slots: dailyAvailability,
        });
      }
    }

    return apiResponse("Success", { availability, timeZone }, 201);
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}
