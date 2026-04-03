"use client";

import {
  createComment,
  deletePost,
  getPost,
  toggleLike,
} from "@/actions/post.action";
import { SignInButton, useUser } from "@clerk/nextjs";
import { useState } from "react";
import toast from "react-hot-toast";
import { Card, CardContent } from "./ui/card";
import Link from "next/link";
import { Avatar, AvatarImage } from "./ui/avatar";
import {
  Dot,
  HeartIcon,
  LogInIcon,
  MessageCircleIcon,
  SendIcon,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { DeleteAlertDialog } from "./DeleteAlertDialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

type Posts = Awaited<ReturnType<typeof getPost>>;
type Post = NonNullable<Posts>[number]; //NonNullable becuase this will be undifined or Null

const PostCard = ({ post, dbUserId }: { post: Post; dbUserId: string }) => {
  if (!post) return null;
  const { user } = useUser();
  const [newComment, setNewComment] = useState("");
  const [isCommiting, setIsCommiting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasLiked, setHasLiked] = useState(
    post.likes.some((like) => like.userId === dbUserId),
  );
  const [optimisticLikes, setOptimisticLikes] = useState(post._count.likes);
  const [showComments, setShowComments] = useState(false);

  const handleLike = async () => {
    if (isLiking) return;
    try {
      setIsLiking(true);
      setHasLiked((prev) => !prev);
      setOptimisticLikes((prev) => prev + (hasLiked ? -1 : 1));
      await toggleLike(post.id);
    } catch (error) {
      setOptimisticLikes(post._count.likes);
      setHasLiked(post.likes.some((like) => like.userId === dbUserId));
    } finally {
      setIsLiking(false);
    }
  };
  const handleAddComment = async () => {
    if (!newComment.trim() || isCommiting) return;
    try {
      setIsCommiting(true);
      const result = await createComment(post.id, newComment);
      if (result?.success) {
        toast.success("Comment post successfully!");
        setNewComment("");
      }
    } catch (error) {
      toast.error("Failed To Add Comment!");
    } finally {
      setIsCommiting(false);
    }
  };
  const handleDelete = async () => {
    if (isDeleting) return;
    try {
      setIsDeleting(true);
      const result = await deletePost(post.id);
      if (result.success) {
        toast.success("Post Was Deleted Successfully!");
      }
    } catch (error) {
      toast.error("Failed to delete post!");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-3 sm:p-5">
        <div className="space-y-4">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Link href={`/profile/${post.author.username}`}>
              <Avatar className="size-8 sm:size-10">
                <AvatarImage src={post.author.image || `/avatar.png`} />
              </Avatar>
            </Link>
            {/* Post Header Area  */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 truncate">
                  <Link
                    href={`/profile/${post.author.username}`}
                    className="text-sm font-semibold"
                  >
                    {post.author.name}
                  </Link>
                  <div className="flex text-xs items-center  opacity-50">
                    <Link href={`/profile/${post.author.username}`}>
                      @{post.author.username}
                    </Link>
                    <span>
                      <Dot />
                    </span>
                    <span>
                      {formatDistanceToNow(new Date(post.createdAt))} ago
                    </span>
                  </div>
                </div>
                {/* Cheack If Current User is the post auther */}
                {dbUserId === post.author.id && (
                  <DeleteAlertDialog
                    isDeleting={isDeleting}
                    onDelete={handleDelete}
                  />
                )}
              </div>
              <p className="px-2  mt-2 text-sm text-foreground break-word">
                {post.content}
              </p>
            </div>
          </div>

          {/* Image  */}
          {post.image && (
            <div className="rounded-lg overflow-hidden">
              <img
                src={post.image}
                alt="post Image "
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          {/* Like & Comment Buttons */}
          <div className="flex items-center pt-2 space-x-4">
            {user ? (
              <Button
                variant={"ghost"}
                className={`text-muted-foreground gap-2 ${hasLiked ? `text-red-500 hover:text-red-600` : `hover:text-red-500`}`}
                onClick={handleLike}
              >
                {hasLiked ? (
                  <HeartIcon className="size-5 fill-current" />
                ) : (
                  <HeartIcon className="size-5" />
                )}
                <span>{optimisticLikes}</span>
              </Button>
            ) : (
              <SignInButton mode="modal">
                <Button
                  variant={"ghost"}
                  size={"sm"}
                  className="text-muted-foreground gap-2"
                >
                  <HeartIcon className="size-5" />
                </Button>
              </SignInButton>
            )}
            <Button
              variant={"ghost"}
              className={`text-muted-foreground gap-2 ${showComments ? "text-blue-500 hover:text-blue-600" : "hover:text-blue-500"} `}
              onClick={() => setShowComments((prev) => !prev)}
            >
              {showComments ? (
                <MessageCircleIcon className="size-5 fill-current" />
              ) : (
                <MessageCircleIcon className="size-5 " />
              )}
              <span>{post._count.comments}</span>
            </Button>
          </div>

          {/* Comment Sectioi */}
          {showComments && (
            <div className="space-y-4  pt-4 border-t">
              <div className="space-y-4">
                {post.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="flex items-center  space-x-3 "
                  >
                    <Avatar className="size-8 shrink-0">
                      <AvatarImage
                        src={comment.author.image ?? "/avatar.png"}
                      />
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center  space-x-2 text-xs  ">
                        <span className="text-sm font-medium ">
                          {comment.author.name}
                        </span>
                        <span className="text-muted-foreground">
                          @{comment.author.username}
                        </span>
                        <span className="text-muted-foreground">
                          <Dot />
                        </span>
                        <span className="text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.createdAt))} ago
                        </span>

                        {/* <span className=" ms-10 text-xs text-muted-foreground">
                          {" "}
                          {comment.authorId === comment.author.id
                            ? "~Author"
                            : ""}
                        </span> */}
                      </div>
                      <p className="text-sm wrap-break-word px-2">
                        ~ {comment.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {user ? (
            <div className="flex space-x-3">
              <Avatar className="size-8">
                <AvatarImage src={user?.imageUrl || "/avatar.png"} />
              </Avatar>
              <div className="flex-1 space-y-2  ">
                <Textarea
                  placeholder="Write Comment For this post..."
                  className="min-h-20 resize-none"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <div className="flex justify-end">
                  <Button
                    size={"sm"}
                    className="flex items-center gap-2"
                    onClick={handleAddComment}
                    disabled={!newComment.trim() || isCommiting}
                  >
                    {isCommiting ? (
                      "Posting..."
                    ) : (
                      <>
                        <SendIcon />
                        Comment
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <SignInButton mode="modal">
              <Button variant={"outline"} className="gap-2">
                <LogInIcon className="size-4" />
                Sign In To Comment
              </Button>
            </SignInButton>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;
