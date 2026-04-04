"use server";

import { prisma } from "@/lib/prisma";
import { getDbUserId } from "./user.action";

export async function getNotification() {
  try {
    const userId = await getDbUserId();
    if (!userId) return [];

    const notifications = await prisma.notification.findMany({
      where: {
        userId,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        post: {
          select: {
            id: true,
            image: true,
            content: true,
          },
        },
        comment: {
          select: {
            id: true,
            content: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return notifications;
  } catch (error) {
    console.log("Something went wrong with Get Notificaiton");
  }
}
export async function markNotificationsAsRead(notificationId: string[]) {
  try {
    await prisma.notification.updateMany({
      where: {
        id: {
          in: notificationId,
        },
      },
      data: {
        read: true,
      },
    });

    return { success: true };
  } catch (error) {
    console.log("Something Went Wrong With Read !", error);
    return { success: false };
  }
}
