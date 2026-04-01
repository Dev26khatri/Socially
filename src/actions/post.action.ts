"use server";
import { prisma } from "@/lib/prisma";
import { getDbUserId } from "./user.action";
import { revalidatePath } from "next/cache";

export async function createUser(content: string, imageUrl: string) {
  try {
    const userId = await getDbUserId();
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
