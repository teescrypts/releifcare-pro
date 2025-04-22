import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { authMiddleware } from "@/app/lib/_middleware";
import apiResponse from "@/app/lib/api-response";
import SOAPNote from "@/app/models/SOAPNote";

export async function GET(req: NextRequest) {
  const authResponse = await authMiddleware(req);
  if (authResponse instanceof NextResponse) return authResponse;

  const admin = authResponse;
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const clientId = searchParams.get("clientId");
  const cursor = searchParams.get("cursor"); // last fetched note's _id
  const limit = parseInt(searchParams.get("limit") || "5", 10);

  if (!clientId) {
    return apiResponse("Missing clientId parameter", null, 400);
  }

  try {
    const query: Record<string, unknown> = {
      client: clientId,
      admin: admin._id,
    };

    if (cursor && mongoose.Types.ObjectId.isValid(cursor)) {
      query._id = { $lt: cursor };
    }

    const notes = await SOAPNote.find(query)
      .sort({ _id: -1 }) // most recent first
      .limit(limit)
      .lean();

    const hasMore = notes.length === limit;
    const nextCursor = hasMore ? notes[notes.length - 1]._id : null;

    return apiResponse(
      "SOAP notes fetched",
      {
        notes,
        nextCursor,
        hasMore,
      },
      200
    );
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}
