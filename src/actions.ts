"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import apiRequest from "./app/lib/api-request";
import {
  ActionStateType,
  BlogType,
  ClientDataType,
  ClientDetails,
  CouponType,
  ServiceAddonType,
  SOAPDataType,
  UserData,
} from "./types";
import { experimental_taintUniqueValue } from "react";
import { revalidateTag } from "next/cache";
import { format, parse } from "date-fns";
import { AddOn } from "./app/(pages)/demo/(admin)/components/add-service-page";
import { ClientIntakeFormData } from "./app/(pages)/demo/(pages)/components/client-intake-form";

const ONE_WEEK_IN_SECONDS = 60 * 60 * 24 * 7;

export async function signup(
  clientData: ClientIntakeFormData,
  adminId?: string,
  referredBy?: string
) {
  const fname = clientData.fname;
  const lname = clientData.lname;
  const email = clientData.email;
  const phone = clientData.phone;
  const password = clientData.password;
  const cPassword = clientData.cPassword;

  if (cPassword !== password) return { error: "Password does not match" };

  const userData: UserData = {
    fname,
    lname,
    email,
    phone,
    password,
    role: "customer",
  };

  const clientDetails = {
    fname,
    lname,
    email,
    phone,
    dob: clientData.dob,
    gender: clientData.gender,
    emergencyContact: clientData.emergencyContact,
    // medicalConditions: clientData.medicalConditions,
    // medications: clientData.medications,
    // injuries: clientData.injuries,
    massagePressure: clientData.massagePressure,
    focusAreas: clientData.focusAreas,
    allergies: clientData.allergies,
    consent: clientData.consent as boolean,
  };

  const data = {
    userData,
    clientIntakeForm: clientDetails,
  };

  const url = referredBy
    ? adminId
      ? `dashboard/sign-up?referredBy=${referredBy}&adminId=${adminId}`
      : `dashboard/sign-up?referredBy=${referredBy}`
    : adminId
    ? `dashboard/sign-up?adminId=${adminId}`
    : "dashboard/sign-up";

  try {
    const response = await apiRequest<
      { message: string; data: { token: string } },
      { userData: UserData; clientIntakeForm: ClientDetails }
    >(url, {
      method: "POST",
      data,
    });

    experimental_taintUniqueValue(
      "Do not pass the user's token to the client",
      response.data,
      response.data.token
    );

    const cookieStore = cookies();
    (await cookieStore).set({
      name: "client-token",
      value: response.data.token,
      path: "/demo",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: ONE_WEEK_IN_SECONDS,
    });
    return { message: response.message };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function signIn(prevState: ActionStateType, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const response = await apiRequest<
      { message: string; data: { token: string; role: "customer" | "admin" } },
      { email: string; password: string }
    >("dashboard/login", {
      method: "POST",
      data: { email, password },
    });

    experimental_taintUniqueValue(
      "Do not pass the user's token to the client",
      response.data,
      response.data.token
    );

    const cookieStore = cookies();
    (await cookieStore).set({
      name: response.data.role === "admin" ? "session-token" : "client-token",
      value: response.data.token,
      path: response.data.role === "admin" ? "/demo/admin" : "/demo",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: ONE_WEEK_IN_SECONDS,
    });

    return {
      message:
        response.data.role === "admin" ? "admin login" : "customer login",
    };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function demoLogin(
  prevState: ActionStateType,
  formData: FormData
) {
  const email = formData.get("email") as string;

  try {
    const response = await apiRequest<
      {
        message: string;
        data: { token: string };
      },
      { email: string }
    >("admin/sign-up", {
      method: "POST",
      data: { email },
    });

    console.log(response);

    experimental_taintUniqueValue(
      "Do not pass the user's token to the client",
      response.data,
      response.data.token
    );

    const cookieStore = cookies();
    (await cookieStore).set({
      name: "session-token",
      value: response.data.token,
      path: "/demo/admin",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: ONE_WEEK_IN_SECONDS,
    });
  } catch (e) {
    console.log(e);
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }

  redirect("/demo/admin/appointment");
  return { message: "Success" };
}

export async function authenticate() {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  if (token) {
    try {
      const response = await apiRequest<{
        message: string;
        data: {
          user: { _id: string; fname: string; lname: string; email: string };
          unreadNotifictaionsCount: number;
        } | null;
      }>("admin/authenticate", { token });

      if (response.data)
        return {
          ok: true,
          user: response.data.user,
          unreadNotifictaionsCount: response.data.unreadNotifictaionsCount,
        };
    } catch (e) {
      if (e instanceof Error) {
        return { error: e.message };
      } else {
        return { error: "An unknown error occurred" };
      }
    }
  }
}

export async function authenticateCustomer() {
  try {
    const cookieStore = await cookies();
    const tokenObj = cookieStore.get("client-token");
    const token = tokenObj?.value;

    const response = await apiRequest<{
      message: string;
      data: {
        user: {
          _id: string;
          fname: string;
          lname: string;
          email: string;
          admin: string;
        };
      } | null;
    }>("dashboard/authenticate", { token });

    if (response.data)
      return {
        ok: true,
        user: response.data.user,
      };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function updateAvailability(
  availability: "available" | "unavailable"
) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  const data = { availability };

  try {
    const response = await apiRequest<
      { message: string },
      { availability: string }
    >("admin/opening-hour", {
      method: "PATCH",
      data,
      token,
    });

    revalidateTag("fetchAdminOpenings");
    return { ok: true, message: response.message };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function deleteTimeSlot(
  day: string,
  timeSlot: {
    from: string;
    to: string;
  }
) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  const data = {
    day,
    timeSlot,
  };

  try {
    const response = await apiRequest<
      { message: string },
      { day: string; timeSlot: { from: string; to: string } }
    >("admin/opening-hour", {
      method: "DELETE",
      data,
      token,
    });

    revalidateTag("fetchAdminOpenings");
    return { ok: true, message: response.message };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function addHour(prev: ActionStateType, formData: FormData) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  const to = formData.get("to") as string;
  const from = formData.get("from") as string;

  if (!to || !from) return { error: "Ensure start and end time are selected" };

  const parsedFrom = parse(from, "hh:mm a", new Date());
  const parsedTo = parse(to, "hh:mm a", new Date());

  const data = {
    day: formData.get("day") as string,
    from: format(parsedFrom, "HH:mm"),
    to: format(parsedTo, "HH:mm"),
  };

  try {
    const response = await apiRequest<
      { message: string },
      { day: string; to: string; from: string }
    >("admin/opening-hour", {
      method: "POST",
      data,
      token,
    });

    revalidateTag("fetchAdminOpenings");
    return { ok: true, message: response.message };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function fetchExistingServices() {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  try {
    const response = await apiRequest<{
      data: { services: ServiceAddonType[] };
    }>("admin/service/addon", {
      tag: "fetchAdminAddonServices",
      token,
      cache: "force-cache",
    });

    return { services: response.data.services };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function addService(
  addons: AddOn[],
  prev: ActionStateType,
  formData: FormData
) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  const data = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    price: Number(formData.get("price")) as number,
    duration: Number(formData.get("duration")) as number,
    status: formData.get("status") as string,
    addons,
  };

  try {
    const response = await apiRequest<
      { message: string },
      {
        name: string;
        description: string;
        price: number;
        duration: number;
        status: string;
        addons: AddOn[];
      }
    >("admin/service", {
      method: "POST",
      token,
      data,
    });

    revalidateTag("fetchAdminAddonServices");
    revalidateTag("fetchAdminServices");
    revalidateTag("FetchCustomerServices");
    return { message: response.message };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function updateSeerviceStatus(
  status: "active" | "on hold",
  id: string
) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  try {
    const response = await apiRequest<{ message: string }, { status: string }>(
      `admin/service/${id}`,
      {
        method: "PATCH",
        token,
        data: { status },
      }
    );

    revalidateTag("fetchAdminServices");
    revalidateTag("FetchCustomerServices");
    return { messaage: response.message };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function deleteService(id: string) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  try {
    const response = await apiRequest<{ message: string }>(
      `admin/service/${id}`,
      {
        method: "DELETE",
        token,
      }
    );

    revalidateTag("fetchAdminServices");
    revalidateTag("FetchCustomerServices");
    return { message: response.message };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function editService(
  addons: AddOn[],
  service: {
    name: string;
    description: string;
    price: number;
    duration: number;
    status: string;
  },
  id: string
) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  const data = {
    ...service,
    addons,
  };

  try {
    const response = await apiRequest<
      { message: string },
      {
        name: string;
        description: string;
        price: number;
        duration: number;
        status: string;
        addons: AddOn[];
      }
    >(`admin/service/${id}`, {
      method: "PUT",
      token,
      data,
    });

    revalidateTag("fetchAdminAddonServices");
    revalidateTag("fetchAdminServices");
    revalidateTag("FetchCustomerServices");
    return { message: response.message };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function editLoyaltyPointSettings(data: {
  bookingsForPoint: number;
  referralsForPoint: number;
  pointValue: number;
  isActive: boolean;
}) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  try {
    const response = await apiRequest<
      { message: string },
      {
        bookingsForPoint: number;
        referralsForPoint: number;
        pointValue: number;
        isActive: boolean;
      }
    >("admin/loyalty-settings", {
      method: "PUT",
      token,
      data,
    });

    revalidateTag("fetchAdminLoyaltySettings");
    return { message: response.message };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function uploadImage(formData: FormData) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  try {
    const response = await apiRequest<
      { message: string },
      { formData: FormData }
    >("admin/image", {
      method: "POST",
      token,
      contentType: "multipart/form-data",
      data: formData,
    });

    revalidateTag("fetchBlogDraftImg");
    revalidateTag("fetchistingDraftImgs");
    return { message: response.message };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function deleteImage(id: string, propertyId?: string) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  const url = propertyId
    ? `admin/${id}/image?property=${propertyId}`
    : `admin/${id}/image`;

  try {
    const response = await apiRequest<{ message: string }>(url, {
      method: "DELETE",
      token,
    });

    revalidateTag("fetchistingDraftImgs");
    revalidateTag("fetchAdminProperty");
    return { message: response.message };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function uploadBlog(
  cover: { url: string; imageId: string; fileName: string } | null,
  status: "Draft" | "Published",
  prevState: ActionStateType,
  formData: FormData
) {
  if (!cover) {
    return { error: "Please add a blog image" };
  }

  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  const data = {
    title: formData.get("title") as string,
    shortDescription: formData.get("shortDescription") as string,
    author: formData.get("author") as string,
    content: formData.get("content") as string,
    estReadTime: Number(formData.get("estReadTime")) as number,
    cover,
    status,
  };

  try {
    const response = await apiRequest<{ message: string }, BlogType>(
      "admin/blog",
      {
        method: "POST",
        token,
        data,
      }
    );

    revalidateTag("fetchAdminBlogs");
    return { message: response.message };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function deleteBlogImage(id: string, blogId?: string) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  const url = blogId ? `admin/${id}/image?blog=${blogId}` : `admin/${id}/image`;

  try {
    const response = await apiRequest<{ message: string }>(url, {
      method: "DELETE",
      token,
    });

    revalidateTag("fetchBlogDraftImg");
    revalidateTag("fetchAdminBlogs");
    revalidateTag("fetchAdminBlog");
    return { message: response.message };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function deleteBlog(id: string) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  try {
    const response = await apiRequest<{ message: string }>(`admin/blog/${id}`, {
      method: "DELETE",
      token,
    });

    revalidateTag("fetchAdminBlogs");
    return { message: response.message };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function updateBlog(data: BlogType, id: string) {
  if (!data?.cover) {
    return { error: "Please add a blog image" };
  }

  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  try {
    const response = await apiRequest<{ message: string }, BlogType>(
      `admin/blog/${id}`,
      {
        method: "PATCH",
        token,
        data,
      }
    );

    revalidateTag("fetchBlogDraftImg");
    revalidateTag("fetchAdminBlogs");
    revalidateTag("fetchAdminBlog");
    return { message: response.message };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function getAvailability(
  durationInMinutes: number,
  admin: string | undefined
) {
  const url = admin
    ? `public/booking/availability?durationInMinutes=${durationInMinutes}&adminId=${admin}`
    : `public/booking/availability?durationInMinutes=${durationInMinutes}`;

  console.log(url);

  try {
    const response = await apiRequest<{
      data: {
        availability: {
          date: string;
          slots: string[];
        }[];
        timeZone: string;
      };
    }>(url, {
      tag: "fetchCustomerAvailability",
    });

    return {
      availability: response.data.availability,
      timeZone: response.data.timeZone,
    };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function confirmBooking(
  data: {
    service: string;
    selectedAddons: string[];
    date: string;
    bookedTime: { from: string; to: string };
    note?: string;
  },
  admin: string | undefined,
  couponCode: string | undefined
) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("client-token");
  const token = tokenObj?.value;

  const url = admin ? `public/booking?adminId=${admin}` : "public/booking";

  try {
    const response = await apiRequest<
      { message: string },
      {
        service: string;
        selectedAddons: string[];
        date: string;
        bookedTime: { from: string; to: string };
        note?: string;
        couponCode: string | undefined;
      }
    >(url, {
      method: "POST",
      token,
      data: { ...data, couponCode },
    });

    revalidateTag("fetchAdminApt");
    revalidateTag("fetchCustomerApt");
    revalidateTag("fetchCustomerPoint");
    return { message: response.message };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function cancelApt(id: string) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("client-token");
  const token = tokenObj?.value;

  try {
    const response = await apiRequest<{ message: string }>(
      `dashboard/appointment/${id}`,
      {
        method: "PATCH",
        token,
      }
    );

    revalidateTag("fetchAdminApt");
    revalidateTag("fetchCustomerApt");
    return { message: response.message };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function getDasboardAvailability(durationInMinutes: number) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("client-token");
  const token = tokenObj?.value;

  try {
    const response = await apiRequest<{
      data: {
        availability: {
          date: string;
          slots: string[];
        }[];
        timeZone: string;
      };
    }>(
      `dashboard/appointment/availability?durationInMinutes=${durationInMinutes}`,
      {
        token,
        tag: "fetchCustomerAvailabilityForRes",
      }
    );

    return {
      availability: response.data.availability || [],
      timeZone: response.data.timeZone,
    };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function getAdminAvailability(durationInMinutes: number) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  try {
    const response = await apiRequest<{
      data: {
        availability: {
          date: string;
          slots: string[];
        }[];
        timeZone: string;
      };
    }>(
      `admin/appointment/availability?durationInMinutes=${durationInMinutes}`,
      {
        token,
        tag: "fetchAdminAvailabilityForRes",
      }
    );

    return {
      availability: response.data.availability || [],
      timeZone: response.data.timeZone,
    };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function rescheduleAptClient(
  id: string,
  data: {
    newDate: string;
    newTime: { from: string; to: string };
  }
) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("client-token");
  const token = tokenObj?.value;

  try {
    const response = await apiRequest<
      { message: string },
      { newDate: string; newTime: { from: string; to: string } }
    >(`dashboard/appointment/${id}/reschedule`, {
      method: "PATCH",
      token,
      data,
    });

    revalidateTag("fetchAdminApt");
    revalidateTag("fetchCustomerApt");
    return { message: response.message };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function rescheduleAptAdmin(
  id: string,
  data: {
    newDate: string;
    newTime: { from: string; to: string };
  }
) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  try {
    const response = await apiRequest<
      { message: string },
      { newDate: string; newTime: { from: string; to: string } }
    >(`admin/appointment/${id}/reschedule`, {
      method: "PATCH",
      token,
      data,
    });

    revalidateTag("fetchAdminApt");
    revalidateTag("fetchCustomerApt");
    revalidateTag("fetchAdminAptSingle");
    return { message: response.message };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function fetchClientData(clientId: string) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  try {
    const response = await apiRequest<{ data: { clientData: ClientDataType } }>(
      `admin/client/${clientId}`,
      {
        token,
        cache: "force-cache",
      }
    );

    return { clientData: response.data.clientData };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function fetchSOAPNoteForApt(
  clientId: string,
  appointmentId: string
) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  try {
    const response = await apiRequest<{
      data: { SOAPRecord: SOAPDataType | string };
    }>(`admin/client/${clientId}/soap?appointmentId=${appointmentId}`, {
      token,
      cache: "force-cache",
      tag: "fetchAdminSOAPNoteSingle",
    });

    return { message: response.data.SOAPRecord };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function addNote(prev: ActionStateType, formData: FormData) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  const data = {
    appointment: formData.get("appointment") as string,
    subjective: formData.get("subjective") as string,
    objective: formData.get("objective") as string,
    assessment: formData.get("assessment") as string,
    plan: formData.get("plan") as string,
  };

  const url = `admin/client/${formData.get("client")}/soap`;

  try {
    const response = await apiRequest<
      { message: string },
      {
        appointment: string;
        subjective: string;
        objective: string;
        assessment: string;
        plan: string;
      }
    >(url, { method: "POST", token, data });

    revalidateTag("fetchAdminSOAPNoteSingle");
    revalidateTag("fetchPreviousNotes");
    return { message: response.message };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function editNote(prev: ActionStateType, formData: FormData) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  const data = {
    appointment: formData.get("appointment") as string,
    subjective: formData.get("subjective") as string,
    objective: formData.get("objective") as string,
    assessment: formData.get("assessment") as string,
    plan: formData.get("plan") as string,
  };

  const url = `admin/soap/${formData.get("note")}`;

  try {
    const response = await apiRequest<
      { message: string },
      {
        appointment: string;
        subjective: string;
        objective: string;
        assessment: string;
        plan: string;
      }
    >(url, { method: "PUT", token, data });

    revalidateTag("fetchAdminSOAPNoteSingle");
    revalidateTag("fetchPreviousNotes");
    return { message: response.message };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function fetchPrevNote(
  clientId: string,
  lastNoteId: string | null
) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  const url = `admin/soap?clientId=${clientId}&limit=5&cursor=${lastNoteId}`;

  try {
    const response = await apiRequest<{
      data: {
        notes: SOAPDataType[];
        nextCursor: string | null;
        hasMore: boolean;
      };
    }>(url, {
      token,
      cache: "force-cache",
      tag: "fetchPreviousNotes",
    });

    return { message: response.data };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function updateAppointment(aptId: string, status: string) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  try {
    const response = await apiRequest<{ message: string }, { status: string }>(
      `admin/appointment/${aptId}`,
      {
        method: "PATCH",
        token,
        data: { status },
      }
    );

    revalidateTag("fetchAdminApt");
    revalidateTag("fetchCustomerApt");
    revalidateTag("fetchAdminAptSingle");
    revalidateTag("fetchCustomerPoint");
    return { message: response.message };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function redeemPoint() {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("client-token");
  const token = tokenObj?.value;

  try {
    const response = await apiRequest<{ message: string }>(
      "dashboard/loyalty-point/coupon",
      {
        method: "POST",
        token,
      }
    );

    revalidateTag("fetchCustomerPoint");
    return { message: response.message };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function applyCode(code: string) {
  try {
    const response = await apiRequest<
      { data: { coupon: CouponType } },
      { code: string }
    >("dashboard/loyalty-point/coupon/apply", {
      method: "POST",
      data: { code },
    });

    return { coupon: response.data.coupon };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}
