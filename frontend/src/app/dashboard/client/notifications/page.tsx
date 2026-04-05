"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell } from "lucide-react";

type Notification = {
  id: number;
  title: string;
  message: string;
  date: string;
};

const notifications_data: {
  today: Notification[];
  week: Notification[];
  past: Notification[];
} = {
  today: [
    {
      id: 1,
      title: "Cory Jane cancelled your appointment",
      message:
        "Your appointment with Cory Jane for 4:00 PM - 4:40 PM (UTC) has been cancelled.",
      date: "March 31st, 2026",
    },
    {
      id: 2,
      title: "New booking request received",
      message:
        "A new client has requested an appointment for 6:00 PM today. Please review and confirm.",
      date: "March 31st, 2026",
    },
  ],

  week: [
    {
      id: 3,
      title: "Schedule updated successfully",
      message:
        "Your availability for this week has been updated. Clients can now book new time slots.",
      date: "March 29th, 2026",
    },
    {
      id: 4,
      title: "Payment received",
      message:
        "You received a payment of ₦25,000 for a completed session on March 28th.",
      date: "March 28th, 2026",
    },
  ],

  past: [
    {
      id: 5,
      title: "Account verified",
      message:
        "Your account was successfully verified. You now have full access to all features.",
      date: "March 20th, 2026",
    },
    {
      id: 6,
      title: "Password changed",
      message:
        "Your password was updated successfully. If this wasn't you, please contact support immediately.",
      date: "March 18th, 2026",
    },
  ],
};

const Page = () => {
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
            {notifications_data.today.map((item) => (
              <div key={item.id} className="w-full flex items-start gap-4">
                <div className="bg-[#2D36E0] text-white rounded-full p-4">
                  <Bell size={24} />
                </div>
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-3">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="week" className="mt-5">
          <div className="flex flex-col gap-4">
            {notifications_data.week.map((item) => (
              <div key={item.id} className="w-full flex items-start gap-4">
                <div className="bg-[#2D36E0] text-white rounded-full p-4">
                  <Bell size={24} />
                </div>
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-3">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="past" className="mt-5">
          <div className="flex flex-col gap-4">
            {notifications_data.past.map((item) => (
              <div key={item.id} className="w-full flex items-start gap-4">
                <div className="bg-[#2D36E0] text-white rounded-full p-4">
                  <Bell size={24} />
                </div>
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-3">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Page;
