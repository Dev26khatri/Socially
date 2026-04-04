import {
  getProfileByUsername,
  getUserLikesPosts,
  getUserPost,
  isFollowing,
} from "@/actions/profile.action";
import { notFound } from "next/navigation";
import ProfilePageClient from "./ProfilePageClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const user = await getProfileByUsername(username);
  if (!user) return;

  return {
    title: `${user.name ?? user.username}`,
    description: user.bio || `Check out ${user.username}'s profile`,
  };
}
// // gen
const Profile = async ({
  params,
}: {
  params: Promise<{ username: string }>;
}) => {
  const { username } = await params;
  const user = await getProfileByUsername(username);
  if (!user) notFound();
  const [posts, likedPost, isCurrentUserFollowing] = await Promise.all([
    getUserPost(user.id),
    getUserLikesPosts(user.id),
    isFollowing(user.id),
  ]);
  if (!posts || !likedPost) return;

  return (
    <ProfilePageClient
      user={user}
      posts={posts}
      likedPosts={likedPost}
      isFollowing={isCurrentUserFollowing}
    />
  );
};

export default Profile;
