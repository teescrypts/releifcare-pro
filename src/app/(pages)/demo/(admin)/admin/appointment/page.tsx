import React from "react";
import Calendar, { AppointmentEvent } from "../../components/calendar";
import { DateTime } from "luxon";
import { getDateRange } from "@/app/utils/get-date-range";
import apiRequest from "@/app/lib/api-request";
import { cookies } from "next/headers";

async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  const timeZone = "America/New_York";
  const today = DateTime.now().setZone(timeZone).startOf("day").toJSDate();
  const { start, end } = getDateRange("timeGridWeek", today);

  const queryStart = (await searchParams)?.start as string | undefined;
  const queryEnd = (await searchParams)?.end as string | undefined;

  const url = `admin/appointment?start=${encodeURIComponent(
    queryStart || start
  )}&end=${encodeURIComponent(queryEnd || end)}`;

  const response = await apiRequest<{
    data: { appointments: AppointmentEvent[] };
  }>(url, {
    token,
    tag: "fetchAdminApt",
    // cache: "force-cache",
  });

  const appointments = response.data.appointments;

  console.log(appointments)

  return (
    <div>
      <Calendar events={appointments} />
    </div>
  );
}

export default Page;
