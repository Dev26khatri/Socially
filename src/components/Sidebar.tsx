import { currentUser } from "@clerk/nextjs/server";
import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { getUserByClearkId } from "@/actions/user.action";
import Link from "next/link";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { LinkIcon, MapPinIcon } from "lucide-react";

const Sidebar = async () => {
  const authUser = await currentUser();
  if (!authUser) return <UnauthSidebar />;

  const user = await getUserByClearkId(authUser.id);
  if (!user) return null;
  //   console.log(user);
  return (
    <div className="sticky top-20">
      <Card className="p-4">
        <CardContent>
          <div className="flex flex-col items-center text-center">
            <Link
              href={`/profile/${authUser.username ?? authUser.emailAddresses[0].emailAddress.split("@")[0]}`}
              className="flex flex-col items-center justify-center"
            >
              <Avatar className="w-20 h-20 border-2">
                <AvatarImage src={user.image || "/avatar.png"} />
              </Avatar>

              <div className="mt-2 space-y-2">
                <h3 className="font-semibold">{user.name}</h3>
                <p className="text-sm text-muted-foreground">{user.username}</p>
              </div>
            </Link>
            {user.bio && (
              <p className="mt-3 text-sm text-muted-foreground">{user.bio}</p>
            )}
            <div className="w-full">
              <Separator className="my-4" />
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">{user._count.following}</p>
                  <p className="text-sm text-muted-foreground">Following</p>
                </div>
                <Separator orientation="vertical" className="my-2" />
                <div>
                  <p className="font-medium">{user._count.followers}</p>
                  <p className="text-sm text-muted-foreground">Followers</p>
                </div>
              </div>
              <Separator className="my-4" />
            </div>
            <div className="w-full space-y-2 text-muted-foreground">
              <div className="flex gap-3 items-center">
                <MapPinIcon className="size-4 " />
                {user.location || "No location"}
              </div>
              <div className="flex gap-3 items-center">
                <LinkIcon className="size-4 " />
                {user.website ? (
                  <a href={user.website}>{user.website}</a>
                ) : (
                  "No Website"
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sidebar;

const UnauthSidebar = () => {
  return (
    <Card className="p-6 sticky top-20 ">
      <CardHeader className="flex justify-center flex-col items-center">
        <CardTitle className="text-2xl font-bold">Welcom Back!</CardTitle>
        <CardDescription className="text-center text-muted-foreground mb-4">
          Loggin to access your porfile and connect with others
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 ">
        <SignInButton mode="modal">
          <Button className="text-lg " variant={"outline"}>
            Login
          </Button>
        </SignInButton>
        <SignUpButton mode="modal">
          <Button className="text-lg" variant={"default"}>
            Sign Up
          </Button>
        </SignUpButton>
      </CardContent>
    </Card>
  );
};
