import apiResponse from "@/app/lib/api-response";
import { authMiddlewareCustomer } from "@/app/lib/customer-middleware";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const authResponse = await authMiddlewareCustomer(req);
    if (authResponse instanceof NextResponse) return authResponse;

    const customer = authResponse; // Retrieve user ID
    if (!customer)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    return apiResponse("Authentication successful", { user: customer }, 201);
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}
