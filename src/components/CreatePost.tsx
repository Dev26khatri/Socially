"use client";
import { useUser } from "@clerk/nextjs";
import React, { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Ghost, ImageIcon, Loader2Icon, SendIcon } from "lucide-react";
import { createUser } from "@/actions/post.action";
import toast from "react-hot-toast";
import ImageUpload from "./ImageUpload";

const CreatePost = () => {
  const { user } = useUser();
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim() && !imageUrl) return;
    setIsPosting(true);
    try {
      const result = await createUser(content, imageUrl);
      if (result?.success) {
        //Reset the updator
        setContent("");
        setImageUrl("");
        setShowImageUpload(false);
        toast.success("Post Created Successfully!", { duration: 2500 });
      }
    } catch (error) {
      console.log("Something went wrong with post", error);
      toast.error("Something went wrong with post!!");
    } finally {
      setIsPosting(false);
    }
  };
  return (
    <Card>
      <CardContent>
        <div>
          <div className="flex space-x-2 ">
            <Avatar className="size-15">
              <AvatarImage src={user?.imageUrl || "./avatar.png"} />
            </Avatar>
            <Textarea
              placeholder="What's your mind ?. Write here"
              className="min-h-28 resize-none border-none bg-transparent   focus-visible:ring-0 p-4 text-base "
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isPosting}
            />
          </div>

          {(showImageUpload || imageUrl) && (
            <div className="border rounded-lg p-4">
              <ImageUpload
                endpoint="postImage"
                value={imageUrl}
                onChange={(url) => {
                  setImageUrl(url);
                  if (!url) setShowImageUpload(false);
                }}
              />
            </div>
          )}

          <div className="flex justify-between items-center border-t pt-4">
            <div>
              <Button
                type="button"
                variant={"ghost"}
                size={"sm"}
                className="text-muted-foreground hover:text-primary"
                onClick={() => setShowImageUpload(!showImageUpload)}
              >
                <ImageIcon className="size-4 mr-2" />
                Photo
              </Button>
            </div>
            <Button
              className="flex items-center "
              onClick={handleSubmit}
              disabled={(!content.trim() && !imageUrl) || isPosting}
            >
              {isPosting ? (
                <>
                  <Loader2Icon className=" animate-spin mr-2" />
                  ....Posting
                </>
              ) : (
                <>
                  <SendIcon className="size-3" />
                  Post
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatePost;
