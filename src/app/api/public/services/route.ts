import apiResponse from "@/app/lib/api-response";
import Service from "@/app/models/service";
import getAdmin from "@/app/utils/get-admin";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const admin = await getAdmin(req);

    if (!admin) throw new Error("Still setting up. Please try again later");

    const services = await Service.find({ admin, status: "active" }).select(
      "name description price duration"
    );

    return apiResponse("success", { services }, 201);
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}
