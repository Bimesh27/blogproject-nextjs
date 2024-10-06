import connectDB from "@/database";
import Blog from "@/models/blog";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const blogs = await Blog.find({});

    if (blogs) {
      return NextResponse.json({
        success: true,
        data: blogs,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to fetch the blog data",
        },
        { status: 500 }
      );
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
    throw new Error("Something went wrong while fetching the blog data");
  }
}
