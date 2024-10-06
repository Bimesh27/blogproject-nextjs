import connectDB from "@/database";
import Blog from "@/models/blog";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const getCurrentBlogId = searchParams.get("id");

    if (!getCurrentBlogId) {
      return NextResponse.json(
        {
          success: false,
          message: "Blog id is required",
        },
        { status: 400 }
      );
    }

    const deleteCurrentBlogById = await Blog.findByIdAndDelete(
      getCurrentBlogId
    );
    if (deleteCurrentBlogById) {
      return NextResponse.json(
        {
          success: true,
          message: "Blog deleted successfully",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json({
        success: false,
        message: "Blog not found",
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 500 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while deleting the blog",
      },
      { status: 500 }
    );
  }
}
