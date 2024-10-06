"use client";

import AddNewBlog from "../add-new-blog/addnewblog";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Label } from "../ui/label";

const initialBlogFormData = {
  title: "",
  description: "",
};

export interface BlogFormData {
  title: string;
  description: string;
}

interface BlogOverviewProps {
  _id: string;
  title: string;
  description: string;
}

interface BlogProps {
  blogList: BlogOverviewProps[];
}

const BlogOverview = ({ blogList }: BlogProps) => {
  const [openBlogDialog, setOpenBlogDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [blogFormData, setBlogFormData] =
    useState<BlogFormData>(initialBlogFormData);
  const [currentEditedBlogId, setCurrentEditedBlogId] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    router.refresh();
  }, []);

  //sending request to save the blog data to the database
  async function handleSavedBlogData() {
    try {
      setLoading(true);
      const response =
        currentEditedBlogId !== ""
          ? await fetch(`/api/update-blog?id=${currentEditedBlogId}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(blogFormData),
            })
          : await fetch("/api/add-blog", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(blogFormData),
            });

      const result = await response.json();
      if (result?.success) {
        setBlogFormData(initialBlogFormData);
        setOpenBlogDialog(false);
        setLoading(false);
        setCurrentEditedBlogId("");
        router.refresh();
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        setLoading(false);
        setBlogFormData(initialBlogFormData);
      }
      console.error("Something went wrong while saving the blog data"); // Avoid throwing new error
    }
  }

  async function handleDeleteBlogById(getCurrentID: string) {
    try {
      setLoading(true);
      const response = await fetch(`/api/delete-blog?id=${getCurrentID}`, {
        method: "DELETE",
      });

      const result = await response.json();
      if (result?.success) {
        setLoading(false);
        router.refresh();
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
      console.error("Something went wrong while deleting the blog data");
    }
  }

  function handleEdit(getCurrentBlog: BlogOverviewProps) {
    setCurrentEditedBlogId(getCurrentBlog?._id);
    setBlogFormData({
      title: getCurrentBlog?.title,
      description: getCurrentBlog?.description,
    });
    setOpenBlogDialog(true);
  }

  return (
    <div className="min-h-screen flex flex-col gap-10 bg-gradient-to-r from-purple-500 to-blue-600 p-6">
      <AddNewBlog
        openBlogDialog={openBlogDialog}
        setOpenBlogDialog={setOpenBlogDialog}
        loading={loading}
        blogFormData={blogFormData}
        setBlogFormData={setBlogFormData}
        handleSaveBlogData={handleSavedBlogData}
        currentEditedBlogId={currentEditedBlogId}
        setCurrentEditedBlogId={setCurrentEditedBlogId}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
        {blogList &&
          blogList.map((blogItem) => (
            <Card key={blogItem._id} className="p-5">
              <CardContent>
                <CardTitle className="mb-5">{blogItem.title}</CardTitle>
                <CardDescription>{blogItem.description}</CardDescription>
                <div className="mt-5 flex gap-5 items-center">
                  <Button onClick={() => handleEdit(blogItem)}>Edit</Button>
                  <Button onClick={() => handleDeleteBlogById(blogItem._id)}>
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        {blogList.length === 0 && (
          <Label className="text-3xl font-extrabold">
            No blogs found! Try adding some
          </Label>
        )}
      </div>
    </div>
  );
};

export default BlogOverview;
