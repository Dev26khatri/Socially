"use server";

import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function syncUser() {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    if (!userId || !user) return;

    //Checking Existing User
    const existingUser = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });
    if (existingUser) return existingUser;

    const dbUser = await prisma.user.create({
      data: {
        clerkId: userId,
        username:
          user.username || user.emailAddresses[0].emailAddress.split("@")[0],
        name: `${user.firstName || ""} ${user.lastName || ""}`,
        email: user.emailAddresses[0].emailAddress,
        image: user.imageUrl,
      },
    });
    console.log(dbUser);
    return dbUser;
  } catch (error) {
    console.log("Something Went Wrong at SyncUser", error);
  }
}

export async function getUserByClearkId(clerkId: string) {
  return prisma.user.findUnique({
    where: {
      clerkId,
    },
    include: {
      _count: {
        select: {
          followers: true,
          following: true,
          posts: true,
        },
      },
    },
  });
}
export async function getDbUserId() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;
  const user = await getUserByClearkId(clerkId);
  if (!user) throw new Error("User not founded");
  return user.id;
}
export async function getRandomUsers() {
  try {
    const userId = await getDbUserId();
    if (!userId) return [];
    const randomUser = await prisma.user.findMany({
      where: {
        AND: [
          { NOT: { id: userId } },
          {
            NOT: {
              followers: {
                some: { followerId: userId },
              },
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        _count: {
          select: {
            followers: true,
          },
        },
      },
    });
    return randomUser;
  } catch (error) {
    console.log("Something Went Wrong for RandomUser", error);
    return [];
  }
}
export async function toggleFollow(targetId: string) {
  try {
    const userId = await getDbUserId();
    if (!userId) return;
    if (userId === targetId) throw new Error("You cannot follow yourself");

    const existingFollow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: targetId,
        },
      },
    });
    if (existingFollow) {
      await prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: targetId,
          },
        },
      });
    } else {
      await prisma.$transaction([
        prisma.follows.create({
          data: {
            followerId: userId,
            followingId: targetId,
          },
        }),
        prisma.notification.create({
          data: {
            type: "FOLLOW",
            userId: targetId,
            creatorId: userId,
          },
        }),
      ]);
    }
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.log("Error to toggling Follow", error);
    return { success: false, error: "Error Toggling Follow" };
  }
}
