import React, { Fragment, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import { BlogFormData } from "../blog-overview/blogoverview";

// interface BlogFormData {
//   title: string;
//   description: string;
// }

interface AddnewBlogProps {
  openBlogDialog: boolean;
  setOpenBlogDialog: (value: boolean) => void;
  setBlogFormData: React.Dispatch<React.SetStateAction<BlogFormData>>;
  blogFormData: BlogFormData;
  loading: boolean;
  handleSaveBlogData: () => void;
  currentEditedBlogId: string;
  setCurrentEditedBlogId: (value: string) => void;
}

const AddNewBlog: React.FC<AddnewBlogProps> = ({
  openBlogDialog,
  setOpenBlogDialog,
  setBlogFormData,
  blogFormData,
  handleSaveBlogData,
  loading,
  currentEditedBlogId,
  setCurrentEditedBlogId,
}) => {
  return (
    <Fragment>
      <div>
        <Button onClick={() => setOpenBlogDialog(true)}>Add New Blog</Button>
      </div>
      <Dialog
        open={openBlogDialog}
        onOpenChange={() => {
          setOpenBlogDialog(false);
          setBlogFormData({
            title: "",
            description: "",
          });
          setCurrentEditedBlogId("");
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {currentEditedBlogId ? "Edit Blog" : "Add New Blog"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter blog title"
                value={blogFormData.title}
                onChange={(event) =>
                  setBlogFormData({
                    ...blogFormData,
                    title: event.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                name="description"
                value={blogFormData.description}
                onChange={(event) =>
                  setBlogFormData({
                    ...blogFormData,
                    description: event.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={handleSaveBlogData}>
              {loading ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

export default AddNewBlog;
