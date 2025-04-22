import { authMiddleware } from "@/app/lib/_middleware";
import apiResponse from "@/app/lib/api-response";
import OpeningHour, { IOpeningHour } from "@/app/models/opening-hour";
import { NextRequest, NextResponse } from "next/server";

type DayKeys = keyof Pick<
  IOpeningHour,
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday"
>;

export async function POST(req: NextRequest) {
  const authResponse = await authMiddleware(req);
  if (authResponse instanceof NextResponse) return authResponse;

  const user = authResponse;
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { day, from, to } = await req.json();

    if (!to || !from) {
      return apiResponse(
        "Please include both 'from' and 'to' times",
        null,
        400
      );
    }

    const validDays: DayKeys[] = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];

    if (!validDays.includes(day as DayKeys)) {
      return apiResponse("Invalid day specified", null, 400);
    }

    // Validate time order
    if (from >= to) {
      return apiResponse("'To' time must be later than 'From' time", null, 400);
    }

    // Get or create opening hours document
    let extOpeningHour = await OpeningHour.findOne({ admin: user._id });
    if (!extOpeningHour) {
      extOpeningHour = new OpeningHour({ admin: user._id });
    }

    const dayKey = day as DayKeys;
    const existingSlots = extOpeningHour[dayKey] || [];

    // Check for overlapping
    const isOverlapping = existingSlots.some((slot) => {
      return (
        from < slot.to && to > slot.from // overlap logic
      );
    });

    if (isOverlapping) {
      return apiResponse(
        "This time slot overlaps with an existing one",
        null,
        400
      );
    }

    // Add the new time slot
    extOpeningHour[dayKey].push({ from, to });
    await extOpeningHour.save();

    return apiResponse("Opening hour updated successfully", null, 200);
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      400
    );
  }
}

export async function PATCH(req: NextRequest) {
  const authResponse = await authMiddleware(req);
  if (authResponse instanceof NextResponse) return authResponse;

  const user = authResponse; // Retrieve user ID
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { availability } = await req.json();
    await OpeningHour.findOneAndUpdate({ admin: user._id }, { availability });

    return apiResponse(`Availability set to ${availability}`, null, 201);
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      400
    );
  }
}

type WeekDay =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

interface DeleteRequestBody {
  day: WeekDay;
  timeSlot: { from: string; to: string };
}

export async function DELETE(req: NextRequest) {
  const authResponse = await authMiddleware(req);
  if (authResponse instanceof NextResponse) return authResponse;

  const user = authResponse; // Retrieve user ID
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { day, timeSlot }: DeleteRequestBody = await req.json();
    const { from, to } = timeSlot;

    const openingHour = await OpeningHour.findOne({ admin: user._id });

    if (!openingHour) {
      return apiResponse("Invalid Operation", null, 400);
    }

    const daySlots = openingHour[day];

    if (!daySlots) {
      return apiResponse("Invalid day", null, 400);
    }

    const updatedTimeSlots = daySlots.filter(
      (slot) => !(slot.from === from && slot.to === to)
    );

    if (updatedTimeSlots.length === daySlots.length) {
      return apiResponse("Time slot not found", null, 404);
    }

    openingHour[day] = updatedTimeSlots;
    await openingHour.save();

    return apiResponse("Time slot deleted successfully", null, 200);
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}

export async function GET(req: NextRequest) {
  const authResponse = await authMiddleware(req);
  if (authResponse instanceof NextResponse) return authResponse;

  const user = authResponse; // Retrieve user ID
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    let openingHour = await OpeningHour.findOne({ admin: user._id });

    if (!openingHour) {
      openingHour = new OpeningHour({ admin: user._id });
      const newOpeningHour = await openingHour.save();
      return apiResponse("success", { openingHour: newOpeningHour }, 200);
    } else {
      return apiResponse("success", { openingHour }, 200);
    }
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}
