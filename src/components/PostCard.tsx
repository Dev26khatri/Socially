"use client";

import {
  createComment,
  deletePost,
  getPost,
  toggleLike,
} from "@/actions/post.action";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import toast from "react-hot-toast";

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

  return <div>PostCard</div>;
};

export default PostCard;
