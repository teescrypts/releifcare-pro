import { authMiddleware } from "@/app/lib/_middleware";
import apiResponse from "@/app/lib/api-response";
import SOAPNote from "@/app/models/SOAPNote";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
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
    const _id = (await params).id;

    const updatedSOAPNote = await SOAPNote.findByIdAndUpdate(_id, body);

    if (!updatedSOAPNote)
      return apiResponse("Unable to update note. Please retry", null, 400);

    return apiResponse("Note Updated successfully", null, 201);
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}
