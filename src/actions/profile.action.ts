"use server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { getDbUserId } from "./user.action";
import { revalidatePath } from "next/cache";

export async function getProfileByUsername(userName: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { username: userName },
      select: {
        id: true,
        name: true,
        username: true,
        bio: true,
        image: true,
        location: true,
        website: true,
        createdAt: true,
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true,
          },
        },
      },
    });
    return user;
  } catch (error) {
    console.log("Something went wrong with profile!", error);
  }
}
export async function getUserPost(userId: string) {
  try {
    const posts = await prisma.post.findMany({
      where: { authorId: userId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return posts;
  } catch (error) {
    console.log("Something went wrong User post ", error);
  }
}
export async function getUserLikesPosts(userId: string) {
  try {
    const likedPost = await prisma.post.findMany({
      where: {
        likes: {
          some: {
            userId,
          },
        },
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return likedPost;
  } catch (error) {
    console.log("Something went wrong with user likes post!", error);
  }
}
export async function updateProfile(formdata: FormData) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) throw new Error("Unauthorized");

    const name = formdata.get("name") as string;
    const bio = formdata.get("bio") as string;
    const location = formdata.get("location") as string;
    const website = formdata.get("website") as string;

    const updateUser = await prisma.user.update({
      where: { clerkId },
      data: {
        name,
        bio,
        location,
        website,
      },
    });
    revalidatePath("/profile");
    return { success: true, updateProfile };
  } catch (error) {
    console.log("Something Went wrong with updateprofiel", error);
    return { success: false, error };
  }
}
export async function isFollowing(userId: string) {
  try {
    const currentUserId = await getDbUserId();
    if (!currentUserId) return false;

    const follow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: userId,
        },
      },
    });
    return !!follow;
  } catch (error) {
    console.log("Error cheaking to follow status", error);
    return false;
  }
}
