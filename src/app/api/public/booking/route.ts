import Coupon from "@/app/models/coupon";
import { NextRequest, NextResponse } from "next/server";
import apiResponse from "@/app/lib/api-response";
import getAdmin from "@/app/utils/get-admin";
import Appointment from "@/app/models/appointment";
import Service from "@/app/models/service";
import { authMiddlewareCustomer } from "@/app/lib/customer-middleware";

type Addons = {
  bookedAddon: string;
  name: string;
  description?: string;
  price: number;
  duration?: number;
};

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdmin(req);
    if (!admin) return apiResponse("Admin Required", null, 401);

    const body = await req.json();
    const authResponse = await authMiddlewareCustomer(req);
    if (authResponse instanceof NextResponse) return authResponse;

    const client = authResponse;
    if (!client) return apiResponse("Unauthorized", null, 401);

    const {
      date,
      bookedTime,
      service: serviceId,
      selectedAddons,
      note,
      couponCode,
    } = body;

    const timeSlotTaken = await Appointment.findOne({
      admin,
      date,
      "bookedTime.from": bookedTime.from,
      "bookedTime.to": bookedTime.to,
    });
    
    if (timeSlotTaken) {
      return apiResponse(
        "Sorry, selected Time slot is no longer available",
        null,
        409
      );
    }

    const selectedService = await Service.findById(serviceId);
    if (!selectedService) {
      return apiResponse("Selected Service is no longer available", null, 404);
    }

    const service = {
      bookedService: selectedService._id,
      name: selectedService.name,
      description: selectedService.description,
      price: selectedService.price,
      duration: selectedService.duration,
    };

    let addons: Addons[] = [];

    if (selectedAddons?.length && selectedService.addons?.length) {
      addons = selectedService.addons
        .filter((addon) => selectedAddons.includes(addon._id.toString()))
        .map((addon) => ({
          bookedAddon: addon._id.toString(),
          name: addon.name,
          description: addon.description,
          price: addon.price,
          duration: addon.duration,
        }));
    }

    let discount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode });
      coupon.used = true;
      await coupon.save();

      discount = coupon.value;
    }

    const totalPrice =
      service.price +
      addons.reduce((sum, addon) => sum + addon.price, 0) -
      discount;

    const appointment = new Appointment({
      admin,
      client: client._id,
      service,
      addons,
      date,
      bookedTime,
      price: totalPrice,
      discount,
      ...(note && { note }),
    });

    await appointment.save();

    return apiResponse("Appointment booked successfully", null, 201);
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}

// const notification = new Notification({
//   admin,
//   recipientType: "admin",
//   type: "new_appointment",
//   message: `${body.customer.firstName} ${
//     body.customer.lastName
//   } just booked a ${
//     body.type === "call" ? "call" : "house touring"
//   } appointment.`,
// });

// await notification.save();
