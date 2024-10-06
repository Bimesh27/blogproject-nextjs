import connectDB from "@/database";
import Blog from "@/models/blog";
import Joi from "joi";
import { NextResponse } from "next/server";

//validate the incoming data
const AddNewBlog = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
});

// fucntion to add a new blog with a POST request
export async function POST(req: Request) {
  try {
    //connectDB
    await connectDB();
    console.log('Start trigger post request');
    
    //getting the data from the request body
    const extractBlogData = await req.json();
    console.log("extractBlogData", extractBlogData);
    
    const { title, description } = extractBlogData;

    //validate the data passed by the user
    const { error } = AddNewBlog.validate({ title, description });

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: error.details[0].message,
        },
        { status: 400 }
      );
    }

    //create a new blog item
    const newlyCreatedBlogItem = await Blog.create(extractBlogData);
    //return a response to the user
    if (newlyCreatedBlogItem) {
      return NextResponse.json(
        {
          success: true,
          message: "Blog created successfully",
        },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to create blog",
        },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
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
        message: "An unknown error occurred",
      },
      { status: 500 }
    );
  }
}
