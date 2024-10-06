import BlogOverview from "@/components/blog-overview/blogoverview";
import React from "react";

async function fetchListOfBlog() {
  try {
    const response = await fetch("http://localhost:3000/api/get-blog", {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch: ${response.status} - ${response.statusText}`
      );
    }

    const result = await response.json();
    return result?.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching blog data", error.message);
      throw error;
    }
    throw new Error("Something went wrong while fetching the blog data");
  }
}

const Blogs = async () => {
  const blogList = await fetchListOfBlog();
  console.log("blogList", blogList);

  return <BlogOverview blogList={blogList}/>;
};

export default Blogs;
