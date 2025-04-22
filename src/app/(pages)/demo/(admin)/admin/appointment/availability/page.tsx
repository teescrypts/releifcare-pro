import React from "react";
import Availability from "../../../components/availability";
import { cookies } from "next/headers";
import apiRequest from "@/app/lib/api-request";

export interface TimeSlot {
  from: string;
  to: string;
}

export interface OpeningHoursType {
  id: string;
  owner: string;
  monday: TimeSlot[];
  tuesday: TimeSlot[];
  wednesday: TimeSlot[];
  thursday: TimeSlot[];
  friday: TimeSlot[];
  saturday: TimeSlot[];
  sunday: TimeSlot[];
  availability: "available" | "unavailable";
}

async function Page() {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  const response = await apiRequest<{
    message: string;
    data: { openingHour: OpeningHoursType };
  }>("admin/opening-hour", {
    token,
    tag: "fetchAdminOpenings",
    cache: "force-cache",
  });

  const openingHours = response.data.openingHour;

  return (
    <div>
      <Availability openingHours={openingHours} />
    </div>
  );
}

export default Page;
