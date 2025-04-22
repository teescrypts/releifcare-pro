import apiResponse from "@/app/lib/api-response";
import { connectToDB } from "@/app/lib/mongoosejs";
import User from "@/app/models/user";

export async function POST(request: Request) {
  try {
    await connectToDB();
    const body = await request.json();

    const user = new User({
      fname: "Jane",
      lname: "Doe",
      email: body.email,
      password: "therapist-version-one",
      role: "admin",
    });

    await user.save();
    const token = await user.generateAuthToken();

    return apiResponse("Sign up successfull", { token }, 201);
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}
