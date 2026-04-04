"use client";
import {
  getProfileByUsername,
  getUserPost,
  updateProfile,
} from "@/actions/profile.action";
import { toggleFollow } from "@/actions/user.action";
import PostCard from "@/components/PostCard";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignUpButton, useUser } from "@clerk/nextjs";
import { format } from "date-fns";
import {
  CalendarIcon,
  EditIcon,
  FileTextIcon,
  HeartIcon,
  LinkIcon,
  Loader2,
  MapPinIcon,
} from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";

type User = Awaited<ReturnType<typeof getProfileByUsername>>;
type Post = Awaited<ReturnType<typeof getUserPost>>;

interface ProfilePageClientProps {
  user: User;
  posts: NonNullable<Post>;
  likedPosts: NonNullable<Post>;
  isFollowing: Boolean;
}

const ProfilePageClient = ({
  user,
  posts,
  likedPosts,
  isFollowing: initialIsFollowing,
}: ProfilePageClientProps) => {
  const { user: currentUser } = useUser();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isFollowing, setIsFollwing] = useState(initialIsFollowing);
  const [isUpdatingFollow, setIsUpdatingFollow] = useState(false);
  const [isEditForm, setIsEditForm] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    location: user?.location || "",
    website: user?.website || "",
  });
  if (!user) return;
  const handleEditSubmit = async () => {
    setIsEditForm(true);
    const formData = new FormData();
    Object.entries(editForm).forEach(([key, value]) => {
      formData.append(key, value);
    });
    const result = await updateProfile(formData);
    setIsEditForm(false);
    if (result.success) {
      setShowEditDialog(false);
      toast.success("Profile was updated!");
    }
  };
  const handleFollow = async () => {
    try {
      setIsUpdatingFollow(true);
      await toggleFollow(user?.id);
      setIsFollwing(!isFollowing);
    } catch (error) {
      toast.error("Failed to update follow status");
    } finally {
      setIsUpdatingFollow(false);
    }
  };
  const isOwnProfile =
    currentUser?.username === user.username ||
    currentUser?.emailAddresses[0].emailAddress.split("@")[0] == user.username;

  const formateDate = format(new Date(user.createdAt), "MMMM yyyy");
  return (
    <div className="max-w-3xl mx-auto">
      <div className="grid grid-cols-1 gap-6">
        <div className="w-full max-w-lg mx-auto">
          <Card className="bg-card">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="size-24">
                  <AvatarImage src={user.image || "/avatar.png"} />
                </Avatar>
                <h1 className="mt-4 text-2xl font-bold">
                  {user.name ?? user.username}
                </h1>
                <p className="text-muted-foreground">@{user.username}</p>
                <p className="mt-2 text-sm">{user.bio}</p>

                {/* PROFILE STATS */}
                <div className="w-full mt-6">
                  <div className="flex justify-between mb-4">
                    <div>
                      <div className="font-semibold">
                        {user._count.following.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Following
                      </div>
                    </div>
                    <Separator orientation="vertical" />
                    <div>
                      <div className="font-semibold">
                        {user._count.followers.toLocaleString()}
                      </div>
                      <div className="text-muted-foreground">Followers</div>
                    </div>
                    <Separator orientation="vertical" />
                    <div>
                      <div className="font-semibold">
                        {user._count.posts.toLocaleString()}
                      </div>
                      <div className="text-muted-foreground">Posts</div>
                    </div>
                  </div>
                </div>
                {/* FOLLOW & EDIT PROFILE BUTTONS */}
                {!currentUser ? (
                  <SignUpButton mode="modal">
                    <Button className="w-full mt-4">Follow</Button>
                  </SignUpButton>
                ) : isOwnProfile ? (
                  <Button
                    className="w-full mt-4"
                    onClick={() => setShowEditDialog(true)}
                  >
                    <EditIcon className="size-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <Button
                    className="w-full mt-4 "
                    onClick={handleFollow}
                    disabled={isUpdatingFollow}
                    variant={isFollowing ? "outline" : "default"}
                  >
                    {isFollowing ? "Unfollow" : "Follow"}
                  </Button>
                )}
              </div>
              {/* Location & Website */}
              <div className="w-full mt-6 space-y-2 text-sm">
                {user.location && (
                  <div className="flex items-center text-muted-foreground">
                    <MapPinIcon className="size-4 mr-2" />
                    {user.location}
                  </div>
                )}
                {user.website && (
                  <div className="flex items-center text-muted-foreground">
                    <LinkIcon className="size-4 mr-2" />
                    <a
                      href={
                        user.website.startsWith("http")
                          ? user.website
                          : `https://${user.website}`
                      }
                      className=" hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {user.website}
                    </a>
                  </div>
                )}
                <div className="flex items-center justify-end text-muted-foreground">
                  <CalendarIcon className="size-4 mr-2" />
                  Joined {formateDate}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Tabs defaultValue="posts" className="w-full mt-4">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
            <TabsTrigger
              value="posts"
              className="flex items-center gap-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 font-semibold"
            >
              <FileTextIcon className="size-4" />
              Posts
            </TabsTrigger>
            <TabsTrigger
              value="likes"
              className="flex items-center gap-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 font-semibold"
            >
              <HeartIcon className="size-4" />
              Likes
            </TabsTrigger>
          </TabsList>
          <TabsContent value="posts" className="mt-6">
            <div className="space-y-6">
              {posts?.length > 0 ? (
                posts?.map((post) => (
                  <PostCard key={post.id} post={post} dbUserId={user.id} />
                ))
              ) : (
                <div className="text-center text-muted-foreground">
                  No Posts Yet
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="likes" className="mt-6">
            <div className="space-y-6">
              {likedPosts?.length > 0 ? (
                likedPosts?.map((post) => (
                  <PostCard key={post.id} post={post} dbUserId={user.id} />
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No Liked Yet
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent>
            <DialogHeader className="sm:max-w-lg">
              <DialogTitle>Edit Profile</DialogTitle>
            </DialogHeader>
            <div className="space-y-2 py-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  name="name"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label>Bio</Label>
                <Input
                  name="bio"
                  value={editForm.bio}
                  onChange={(e) =>
                    setEditForm({ ...editForm, bio: e.target.value })
                  }
                  placeholder="Tell us about yourself"
                />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  name="Location"
                  value={editForm.location}
                  onChange={(e) =>
                    setEditForm({ ...editForm, location: e.target.value })
                  }
                  placeholder="Wehere you located?"
                />
              </div>
              <div className="space-y-2">
                <Label>Website</Label>
                <Input
                  name="website"
                  value={editForm.website}
                  onChange={(e) =>
                    setEditForm({ ...editForm, website: e.target.value })
                  }
                  placeholder="Your website"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <DialogClose asChild>
                <Button variant={"outline"}>Cancel</Button>
              </DialogClose>
              <Button onClick={handleEditSubmit}>
                {isEditForm ? (
                  <>
                    Saving Changes..
                    <Loader2 className="animate-spin " />
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ProfilePageClient;
