import { getPost } from "@/actions/post.action";
import { getDbUserId } from "@/actions/user.action";
import CreatePost from "@/components/CreatePost";
import PostCard from "@/components/PostCard";
import UnauthCard from "@/components/UnauthCard";
import WhoToFollow from "@/components/WhoToFollow";
import { auth, currentUser } from "@clerk/nextjs/server";
import React from "react";

const Home = async () => {
  const user = await currentUser();
  const { userId } = await auth();
  // console.log(userId);
  // if (!userId) return <UnauthCard />;

  const post = await getPost();
  const dbUserId = await getDbUserId();
  if (!dbUserId) return null;
  if (!post) return null;
  // console.log("This is the post logs", post);
  // console.log("This is the DbUserId", dbUserId);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
      <div className="lg:col-span-6">
        {user ? <CreatePost /> : null}
        {user ? (
          <div className="space-y-4 mt-4">
            {post.map((post) => (
              <PostCard key={post.id} post={post} dbUserId={dbUserId} />
            ))}
          </div>
        ) : (
          <div className="space-y-4 mt-4">
            {post.map((post) => (
              <PostCard key={post.id} post={post} dbUserId={dbUserId} />
            ))}
          </div>
        )}
      </div>
      <div className="hidden lg:block lg:col-span-4 sticky top-20">
        <WhoToFollow />
      </div>
    </div>
  );
};

export default Home;
