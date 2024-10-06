import connectDB from "@/database";
import Blog from "@/models/blog";
import Joi from "joi";
import { NextResponse } from "next/server";
import mongoose from "mongoose"; // Import mongoose to validate ObjectId

// Define the schema for validating blog data
const EditBlog = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
});

export async function PUT(req: Request) {
  try {
    // Connect to the database
    await connectDB();

    // Parse the URL to get the blog id
    const { searchParams } = new URL(req.url);
    const getCurrentBlogId = searchParams.get("id");

    // Check if blog id is provided
    if (!getCurrentBlogId) {
      return NextResponse.json(
        {
          success: false,
          message: "Blog id is required",
        },
        { status: 400 }
      );
    }

    // Validate the blog id format (e.g., ObjectId)
    if (!mongoose.Types.ObjectId.isValid(getCurrentBlogId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid blog id",
        },
        { status: 400 }
      );
    }

    // Extract and validate the blog data
    const { title, description } = await req.json();
    const { error } = EditBlog.validate({ title, description });

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 400 }
      );
    }

    // Update the blog in the database
    const updateBlogById = await Blog.findByIdAndUpdate(
      getCurrentBlogId, // Blog id
      { title, description }, // New data
      { new: true } // Return the updated document
    );

    // Check if the blog was found and updated
    if (updateBlogById) {
      return NextResponse.json(
        {
          success: true,
          message: "Blog updated successfully",
          data: updateBlogById, // Optionally include updated data
        },
        { status: 200 }
      ); // Success response
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Blog not found",
        },
        { status: 404 }
      ); // Blog not found
    }
  } catch (error: unknown) {
    // Handle errors
    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 500 }
      );
    }

    // Generic error message if the error type is unknown
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while updating the blog",
      },
      { status: 500 }
    );
  }
}
