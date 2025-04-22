import { authMiddleware } from "@/app/lib/_middleware";
import apiResponse from "@/app/lib/api-response";
import SOAPNote from "@/app/models/SOAPNote";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResponse = await authMiddleware(req);
  if (authResponse instanceof NextResponse) return authResponse;

  const admin = authResponse;
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  try {
    const clientId = (await params).id;
    const { searchParams } = new URL(req.url);
    const appointmentId = searchParams.get("appointmentId");

    const SOAPRecord = await SOAPNote.findOne({
      admin: admin._id,
      client: clientId,
      appointment: appointmentId,
    });

    if (!SOAPRecord)
      return apiResponse("No Existing SOAP note found", null, 404);

    return apiResponse("Success", { SOAPRecord }, 200);
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResponse = await authMiddleware(req);
  if (authResponse instanceof NextResponse) return authResponse;

  const admin = authResponse;
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  try {
    const body = await req.json();
    const clientId = (await params).id;

    const newSOAP = new SOAPNote({
      admin: admin._id,
      client: clientId,
      ...body,
    });

    await newSOAP.save();

    return apiResponse("Note Added succesfully", null, 201);
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}
