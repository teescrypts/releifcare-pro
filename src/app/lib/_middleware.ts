import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDB } from "./mongoosejs";
import User, { IUser } from "../models/user";

export async function authMiddleware(
  req: NextRequest
): Promise<IUser | NextResponse> {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      _id: string;
    };

    await connectToDB();
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
      role: "admin",
    });

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return user;
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "An unknown error occurred" },
      { status: 401 }
    );
  }
}
