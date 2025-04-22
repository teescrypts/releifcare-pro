import React from "react";
import AppointmentsPage from "../../components/appointment";
import { cookies } from "next/headers";
import apiRequest from "@/app/lib/api-request";
import { CustomerAptType } from "@/types";

async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("client-token");
  const token = tokenObj?.value;

  const status = (await searchParams).status as string | undefined;

  const url = status
    ? `dashboard/appointment?status=${status.toLocaleLowerCase()}`
    : `dashboard/appointment?status=${"upcoming"}`;

  const response = await apiRequest<{
    message: string;
    data: { appointments: CustomerAptType[] };
  }>(url, {
    token,
    // cache: "force-cache",
    tag: "fetchCustomerApt",
  });

  const appointments = response.data.appointments;

  return (
    <div>
      <AppointmentsPage appointments={appointments} />
    </div>
  );
}

export default Page;
