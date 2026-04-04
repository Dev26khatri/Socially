import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Skeleton } from "./ui/skeleton";

const NotificationSkelton = () => {
  const skeltonItems = Array.from({ length: 5 }, (_, i) => i);
  return (
    <div>
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle>Notificaiton</CardTitle>
            <Skeleton className="h-4 w-20" />
          </div>
        </CardHeader>
        <CardContent className="p-0 rounded-lg">
          <ScrollArea className="min-h-screen overflow-hidden">
            {skeltonItems.map((index) => (
              <div
                key={index}
                className="flex items-start p-4 border-b space-y-1 gap-3"
              >
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-4 h-4" />
                    <Skeleton className="w-40 h-4" />
                  </div>
                  <div className="pl-2 space-y-2">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSkelton;
