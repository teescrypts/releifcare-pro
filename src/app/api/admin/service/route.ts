import { authMiddleware } from "@/app/lib/_middleware";
import apiResponse from "@/app/lib/api-response";
import Service from "@/app/models/service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const authResponse = await authMiddleware(req);
  if (authResponse instanceof NextResponse) return authResponse;

  const user = authResponse;
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { name, description, price, duration, status, addons } =
      await req.json();

    if (!name || !price) {
      return NextResponse.json(
        { error: "Name and price are required" },
        { status: 400 }
      );
    }

    const serviceAddons = [];
    const standaloneServicesData = [];

    if (Array.isArray(addons)) {
      for (const { isStandalone, ...addonData } of addons) {
        serviceAddons.push(addonData); // Add addon to main service

        if (isStandalone) {
          standaloneServicesData.push({
            admin: user._id,
            ...addonData, // Create separate service for standalone addons
            addons: [],
          });
        }
      }
    }

    // Create main service
    const newService = new Service({
      admin: user._id,
      name,
      description,
      price,
      duration,
      status: status || "active",
      addons: serviceAddons,
    });

    await newService.save();

    // Bulk insert standalone services if any
    if (standaloneServicesData.length > 0) {
      await Service.insertMany(standaloneServicesData);
    }

    return apiResponse("Service added", null, 201);
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      400
    );
  }
}

export async function GET(req: NextRequest) {
  // Authenticate user
  const authResponse = await authMiddleware(req);
  if (authResponse instanceof NextResponse) return authResponse;

  const user = authResponse;
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    // Pagination setup
    const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
    const limit = parseInt(req.nextUrl.searchParams.get("limit") || "5", 10);
    const skip = (page - 1) * limit;

    // Fetch services for the logged-in admin
    const services = await Service.find({ admin: user._id })
      .skip(skip)
      .limit(limit)
      .lean(); // Convert documents to plain objects for better performance

    // Get total count for pagination
    const total = await Service.countDocuments({ admin: user._id });

    return apiResponse(
      "Success",
      {
        services,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
        },
      },
      200
    );
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      400
    );
  }
}
