import apiResponse from "@/app/lib/api-response";
import BlogPost from "@/app/models/blog";
import getAdmin from "@/app/utils/get-admin";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const admin = await getAdmin(req);

    if (!admin) throw new Error("Still setting up. Please try again later");

    const latestBlogs = await BlogPost.find({ admin })
      .sort({ createdAt: -1 })
      .limit(3)
      .select("title shortDescription cover.url createdAt");

    return apiResponse("Blogs Fetched", { latestBlogs }, 201);
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}