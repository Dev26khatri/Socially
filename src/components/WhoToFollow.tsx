import { getRandomUsers } from "@/actions/user.action";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Link from "next/link";
import { Avatar } from "./ui/avatar";
import { AvatarImage } from "./ui/avatar";
import FollowButton from "./FollowButton";

const WhoToFollow = async () => {
  const randomUser = await getRandomUsers();
  if (randomUser.length == 0) null;
  return (
    <>
      {randomUser.length != 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Who To Follow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="spcae-y-4">
              {randomUser.map((user) => (
                <div
                  key={user.id}
                  className="flex justify-between items-center gap-2 "
                >
                  <div className="flex gap-3 items-center ">
                    <Link href={`/profile/${user.username ?? "/avatar.png"}`}>
                      <Avatar className="size-10">
                        <AvatarImage src={`${user.image} ` || `/avatar.png`} />
                      </Avatar>
                    </Link>
                    <div className="text-xs ">
                      <Link href={`/profile/${user.username}`}>
                        {user.name}
                      </Link>
                      <p className="text-muted-foreground">@{user.username}</p>
                      <p className="text-muted-foreground ">
                        {user._count.followers} Followers
                      </p>
                    </div>
                  </div>

                  <div>
                    <FollowButton userId={user.id} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default WhoToFollow;
