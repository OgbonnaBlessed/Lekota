/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell } from "lucide-react";
import {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
} from "@/redux/api/notification.api";
import { formatFullDate } from "@/utils/format-date";
import NotificationsSkeleton from "@/components/ui/skeleton/NotificationsSkeleton";
import { useEffect, useState } from "react";

const Page = () => {
  const { data, isLoading } = useGetNotificationsQuery({});
  const [markAsRead] = useMarkAsReadMutation();

  const [showSkeleton, setShowSkeleton] = useState<boolean>(true);

  const notifications = data?.notifications || [];
  console.log("notifications:", notifications);

  const today: any[] = [];
  const week: any[] = [];
  const past: any[] = [];

  notifications.forEach((n: any) => {
    const created = new Date(n.createdAt);
    const now = new Date();

    const diff = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);

    if (diff < 1) today.push(n);
    else if (diff < 7) week.push(n);
    else past.push(n);
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading || showSkeleton) return <NotificationsSkeleton />;

  return (
    <div className="w-full flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl md:text-3xl font-medium">Notifications</h1>
        <p className="text-sm md:text-base">Access your notifications here</p>
      </div>

      <Tabs defaultValue="today" className="w-fit">
        <TabsList className="justify-start gap-2 bg-gray-100 py-6 px-2 rounded-full">
          <TabsTrigger
            value="today"
            className="data-[state=active]:bg-[#2D36E0] data-[state=active]:text-white text-black data-[state=active]:p-4 p-4 rounded-full transition-all duration-300"
          >
            Today
          </TabsTrigger>
          <TabsTrigger
            value="week"
            className="data-[state=active]:bg-[#2D36E0] data-[state=active]:text-white text-black data-[state=active]:p-4 p-4 rounded-full"
          >
            This week
          </TabsTrigger>
          <TabsTrigger
            value="past"
            className="data-[state=active]:bg-[#2D36E0] data-[state=active]:text-white text-black data-[state=active]:p-4 p-4 rounded-full"
          >
            Past
          </TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="mt-5">
          <div className="flex flex-col gap-5">
            {today.length > 0 ? (
              <>
                {today.map((item) => (
                  <div key={item._id} className="w-full flex items-start gap-4">
                    <div className="bg-[#2D36E0] text-white rounded-full p-4">
                      <Bell size={24} />
                    </div>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.body}
                      </p>
                      <p className="text-xs text-gray-400 mt-3">
                        {formatFullDate(item.createdAt)}
                      </p>

                      {!item.isRead && (
                        <button
                          onClick={() => markAsRead(item._id)}
                          className="text-xs text-blue-500"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="w-full min-h-32 flex items-center justify-center text-sm text-gray-500">
                <p>You have no notification</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="week" className="mt-5">
          <div className="flex flex-col gap-4">
            {week.length > 0 ? (
              <>
                {week.map((item) => (
                  <div key={item._id} className="w-full flex items-start gap-4">
                    <div className="bg-[#2D36E0] text-white rounded-full p-4">
                      <Bell size={24} />
                    </div>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.body}
                      </p>
                      <p className="text-xs text-gray-400 mt-3">
                        {formatFullDate(item.createdAt)}
                      </p>

                      {!item.isRead && (
                        <button
                          onClick={() => markAsRead(item._id)}
                          className="text-xs text-blue-500"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="w-full min-h-32 flex items-center justify-center text-sm text-gray-500">
                <p>You have no notification</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="past" className="mt-5">
          <div className="flex flex-col gap-4">
            {past.length > 0 ? (
              <>
                {past.map((item) => (
                  <div key={item._id} className="w-full flex items-start gap-4">
                    <div className="bg-[#2D36E0] text-white rounded-full p-4">
                      <Bell size={24} />
                    </div>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.body}
                      </p>
                      <p className="text-xs text-gray-400 mt-3">
                        {formatFullDate(item.createdAt)}
                      </p>

                      {!item.isRead && (
                        <button
                          onClick={() => markAsRead(item._id)}
                          className="text-xs text-blue-500"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="w-full min-h-32 flex items-center justify-center text-sm text-gray-500">
                <p>You have no notification</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Page;
