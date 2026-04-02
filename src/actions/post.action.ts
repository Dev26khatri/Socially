"use server";
import { prisma } from "@/lib/prisma";
import { getDbUserId } from "./user.action";
import { revalidatePath } from "next/cache";

export async function createUser(content: string, imageUrl: string) {
  try {
    const userId = await getDbUserId();
    if (!userId) return null;
    const post = await prisma.post.create({
      data: {
        authorId: userId,
        content: content,
        image: imageUrl,
      },
    });
    revalidatePath("/"); //purge the cache for the home page
    return { success: true, post };
  } catch (error) {
    console.log("Something Wrong To create post ", error);
    return { success: false, error: "Fialed to create Post" };
  }
}
export async function getPost() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            name: true,
            image: true,
            username: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                name: true,
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
    });
    return posts;
  } catch (error) {
    console.log("Something went wrong with fetching post", error);
  }
}
export async function toggleLike(postId: string) {
  try {
    const userId = await getDbUserId();
    if (!userId) return;

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        authorId: true,
      },
    });
    if (!post) throw new Error("Post Not Found");
    if (existingLike) {
      //unlike
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
    } else {
      //Liking and creating notification (only if liking someone else's post)
      await prisma.$transaction([
        prisma.like.create({
          data: {
            userId,
            postId,
          },
        }),
        ...(post.authorId === userId
          ? [
              prisma.notification.create({
                data: {
                  type: "LIKE",
                  userId: post.authorId, //recipent Id (post author)
                  creatorId: userId, //person who liked
                  postId,
                },
              }),
            ]
          : []),
      ]);
    }
  } catch (error) {}
}
