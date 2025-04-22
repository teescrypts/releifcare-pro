import apiResponse from "@/app/lib/api-response";
import Service from "@/app/models/service";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const _id = (await params).id;

    const service = await Service.findById(_id);

    if (!service) return apiResponse("Invalid operation", null, 400);

    return apiResponse("success", { service }, 201);
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}
