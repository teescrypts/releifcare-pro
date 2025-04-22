import apiResponse from "@/app/lib/api-response";
import { connectToDB } from "@/app/lib/mongoosejs";
import User from "@/app/models/user";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  await connectToDB();
  const body = await req.json();

  const { email, password } = body;

  try {
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();

    return apiResponse("Success", { token, role: user.role }, 201);
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}
