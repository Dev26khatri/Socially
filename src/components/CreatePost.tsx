"use client";
import { useUser } from "@clerk/nextjs";
import React, { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Bot, Ghost, ImageIcon, Loader2Icon, SendIcon } from "lucide-react";
import { createUser } from "@/actions/post.action";
import toast from "react-hot-toast";
import ImageUpload from "./ImageUpload";

const CreatePost = () => {
  const { user } = useUser();
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [isGenrate, setIsGenrate] = useState(false);

  const improveContent = async () => {
    setIsGenrate(true);
    try {
      const res = await fetch(`/api/groq`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (!data) {
        return null;
      } else {
        setContent(data.text);
      }
    } catch (error) {
      console.log("From the client", error);
    } finally {
      setIsGenrate(false);
    }
  };
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
              placeholder="What's your mind ?. Write and Click on Genrate"
              className="min-h-28 resize-none border-none bg-transparent   focus-visible:ring-0 p-4 text-base "
              name="content"
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
            <Button
              type="button"
              variant={"link"}
              size={"xs"}
              onClick={improveContent}
              disabled={isGenrate}
            >
              <span className="relative inline-flex items-center justify-center inline-block p-4 px-5 py-3 overflow-hidden font-medium text-indigo-600 rounded-lg shadow-2xl group">
                <span className="absolute top-0 left-0 w-40 h-40 -mt-10 -ml-3 transition-all duration-700 bg-red-500 rounded-full blur-md ease"></span>
                <span className="absolute inset-0 w-full h-full transition duration-700 group-hover:rotate-180 ease">
                  <span className="absolute bottom-0 left-0 w-24 h-24 -ml-10 bg-purple-500 rounded-full blur-md"></span>
                  <span className="absolute bottom-0 right-0 w-24 h-24 -mr-10 bg-pink-500 rounded-full blur-md"></span>
                </span>
                <span className="relative flex gap-2 items-center font-bold text-white">
                  {isGenrate ? (
                    <>
                      Generating..
                      <Loader2Icon className="animate-spin" />
                    </>
                  ) : (
                    <>
                      Generate With <Bot />
                    </>
                  )}
                </span>
              </span>
            </Button>

            <div className="flex gap-2 items-center">
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
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatePost;
