import { authMiddleware } from "@/app/lib/_middleware";
import apiResponse from "@/app/lib/api-response";
import Service from "@/app/models/service";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResponse = await authMiddleware(req);
  if (authResponse instanceof Response) return authResponse;

  const user = authResponse;
  if (!user) return apiResponse("Unauthorized", null, 401);

  try {
    const id = (await params).id;

    if (!id) return apiResponse("Service ID is required", null, 400);

    const service = await Service.findById(id);

    if (!service) return apiResponse("Service not found", null, 404);

    return apiResponse("Service fetched successfully", { service }, 200);
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResponse = await authMiddleware(req);
  if (authResponse instanceof Response) return authResponse;

  const user = authResponse;
  if (!user) return apiResponse("Unauthorized", null, 401);

  try {
    const { status } = await req.json();
    const serviceId = (await params).id;

    if (!serviceId || !["active", "on hold"].includes(status)) {
      return apiResponse("Invalid request data", null, 400);
    }

    const service = await Service.findOneAndUpdate(
      { _id: serviceId, admin: user._id },
      { status },
      { new: true }
    );

    if (!service) {
      return apiResponse("Service not found or unauthorized", null, 404);
    }

    return apiResponse("Service status updated", null, 200);
  } catch (error) {
    return apiResponse(
      error instanceof Error ? error.message : "An unknown error occurred",
      null,
      500
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResponse = await authMiddleware(req);
  if (authResponse instanceof Response) return authResponse;

  const user = authResponse;
  if (!user) return apiResponse("Unauthorized", null, 401);

  try {
    const id = (await params).id;
    const { name, description, price, duration, status, addons } =
      await req.json();

    if (!id) return apiResponse("Service ID is required", null, 400);
    if (!name || !price)
      return apiResponse("Name and price are required", null, 400);

    // Find service
    const service = await Service.findById(id);
    if (!service) return apiResponse("Service not found", null, 404);

    // Update fields
    service.name = name;
    service.description = description;
    service.price = price;
    service.duration = duration;
    service.status = status;
    service.addons = Array.isArray(addons) ? addons : service.addons;

    const standaloneServicesData = [];

    if (Array.isArray(addons)) {
      for (const { isStandalone, ...addonData } of addons) {
        if (isStandalone) {
          standaloneServicesData.push({
            admin: user._id,
            ...addonData, // Create separate service for standalone addons
            addons: [],
          });
        }
      }
    }

    // Save the updated service
    await service.save();

    if (standaloneServicesData.length > 0) {
      await Service.insertMany(standaloneServicesData);
    }

    return apiResponse("Service updated successfully", service, 200);
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      400
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResponse = await authMiddleware(req);
  if (authResponse instanceof Response) return authResponse;

  const user = authResponse;
  if (!user) return apiResponse("Unauthorized", null, 401);

  try {
    const _id = (await params).id;
    const service = await Service.findOneAndDelete({
      _id,
      admin: user._id, // Ensures only the owner can delete
    });

    return service
      ? apiResponse("Service deleted successfully", null, 200)
      : apiResponse("Service not found or unauthorized", null, 404);
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      400
    );
  }
}
