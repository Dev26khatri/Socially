"use client";

import {
  getNotification,
  markNotificationsAsRead,
} from "@/actions/notificatioin.action";
import NotificationSkelton from "@/components/NotificationSkelton";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { HeartIcon, MessageCircleIcon, UserPlusIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Notifications = Awaited<ReturnType<typeof getNotification>>;
type Notificatioin = NonNullable<Notifications>[number];

const Notifications = () => {
  const [notification, setNotification] = useState<Notificatioin[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotification = async () => {
      setLoading(true);
      try {
        const data = await getNotification();
        if (!data) return null;
        setNotification(data);

        // console.log("Data is", data);
        const unreadIds = data.filter((n) => !n.read).map((n) => n.id);
        // console.log("unreadeIDs", unreadIds);
        if (unreadIds.length > 0) await markNotificationsAsRead(unreadIds);
      } catch (error) {
        toast.error("Failed to fetch Notification");
      } finally {
        setLoading(false);
      }
    };
    fetchNotification();
  }, []);

  if (isLoading) return <NotificationSkelton />;

  const getNotificaionIcon = (type: string) => {
    switch (type) {
      case "LIKE":
        return <HeartIcon className="size-4 text-red-500" />;
      case "COMMENT":
        return <MessageCircleIcon className="size-4 text-blue-500" />;
      case "FOLLOW":
        return <UserPlusIcon className="size-4 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="">
      <div>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle>Notificaiton</CardTitle>
            <span className="text-sm text-muted-foreground">
              {notification.filter((n) => !n.read).length} unread
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-12rem)]">
            {notification.length === 0 ? (
              <div className="text-center p-4 text-2xl text-muted-foreground">
                No Notificaiton Yet
              </div>
            ) : (
              notification.map((notificaions) => (
                <div
                  key={notificaions.id}
                  className={`flex items-start gap-4 p-4 border-4 hover:bg-muted/25 transition-all ${!notificaions.read ? "bg-muted/50" : ""}`}
                >
                  <Link href={`/profile/${notificaions.creator.username}`}>
                    <Avatar className="mt-2">
                      <AvatarImage
                        src={notificaions.creator.image || "/avatar.png"}
                      />
                    </Avatar>
                  </Link>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      {getNotificaionIcon(notificaions.type)}
                      <span>
                        <span className="font-medium">
                          {notificaions.creator.name ??
                            notificaions.creator.username}
                        </span>
                        {""}
                        {notificaions.type === "FOLLOW"
                          ? " started following you"
                          : notificaions.type === "LIKE"
                            ? " liked your post"
                            : " commented on your post"}
                      </span>
                    </div>
                    {notificaions.post &&
                      (notificaions.type === "LIKE" ||
                        notificaions.type === "COMMENT") && (
                        <div className="pl-6 space-y-2">
                          <div className="text-sm text-muted-foreground rounded-md p-2 bg-muted/30 mt-2">
                            <p>{notificaions.post.content}</p>
                            {notificaions.post.image && (
                              <img
                                src={
                                  notificaions.post.image ||
                                  "Something went wrong"
                                }
                                alt="Post content"
                                className="mt-2 rounded-md w-full max-w-48 h-auto object-cover"
                              />
                            )}
                          </div>
                          {notificaions.type === "COMMENT" &&
                            notificaions.comment && (
                              <div className="text-sm p-2 bg-accent/50 rounded-md">
                                ~{notificaions.comment.content}
                              </div>
                            )}
                        </div>
                      )}
                    <p className="text-xs text-end text-muted-foreground ">
                      {formatDistanceToNow(new Date(notificaions.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </ScrollArea>
        </CardContent>
      </div>
    </div>
  );
};

export default Notifications;
