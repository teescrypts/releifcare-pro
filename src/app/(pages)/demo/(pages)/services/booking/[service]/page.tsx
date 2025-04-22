import React from "react";
import BookingPage from "../../../components/booking";
import apiRequest from "@/app/lib/api-request";
import { CustomerServiceType } from "@/types";

type Props = {
  params: Promise<{ service: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function Page({ params, searchParams }: Props) {
  const serviceId = (await params).service;
  const adminId = (await searchParams).admin as string | undefined;

  if (!serviceId) throw new Error("Invalid Operation");

  const response = await apiRequest<{
    message: string;
    data: { service: CustomerServiceType };
  }>(`public/services/${serviceId}`, {
    tag: "FetchCustomerSingleService",
    cache: "force-cache",
  });

  const service = response.data.service;

  return <BookingPage admin={adminId} service={service} />;
}

export default Page;
