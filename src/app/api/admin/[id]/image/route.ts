import { authMiddleware } from "@/app/lib/_middleware";
import apiResponse from "@/app/lib/api-response";
import cloudinary from "@/app/lib/cloudinary";
import BlogPost from "@/app/models/blog";
import Image from "@/app/models/images";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResponse = await authMiddleware(req);
  if (authResponse instanceof NextResponse) return authResponse;

  const admin = authResponse; // Retrieve user ID
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const _id = (await params).id;
  const searchParams = req.nextUrl.searchParams;
  const blogId = searchParams.get("blog");

  try {
    if (blogId) {
      const deletedImg = await Image.findByIdAndDelete(_id);

      if (deletedImg?.public_id) {
        await cloudinary.uploader.destroy(deletedImg.public_id);
      }

      const blog = await BlogPost.findById(blogId).select("cover status");
      blog.status = "Draft";
      blog.cover = null;

      await blog.save();

      return apiResponse("Image removed", null, 201);
    } else {
      const deletedImg = await Image.findByIdAndDelete({ _id });
      if (deletedImg?.public_id) {
        await cloudinary.uploader.destroy(deletedImg.public_id);
      }

      return apiResponse("draft Image removed", null, 201);
    }
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}
