/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import {
  useGetTenantOverviewQuery,
  useGetTenantThroughputQuery,
} from "@/redux/api/tenant.api";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
} from "recharts";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import DashboardOverviewSkeleton from "@/components/ui/skeleton/DashboardOverviewSkeleton";

const Page = () => {
  const [range, setRange] = useState("weekly");
  const [showSkeleton, setShowSkeleton] = useState<boolean>(true);

  const { data: overview, isLoading } = useGetTenantOverviewQuery({});
  const { data: throughput } = useGetTenantThroughputQuery(range);

  const throughputData =
    throughput?.map((item: any) => ({
      time: item._id,
      value: item.count,
    })) || [];

  const analyticsData = [
    { label: "Total Users", value: overview?.totalUsers || 0 },
    { label: "Active Users", value: overview?.activeUsers || 0 },
    { label: "Suspended Users", value: overview?.suspendedUsers || 0 },
    { label: "Deleted Users", value: overview?.deletedUsers || 0 },
    { label: "Trial Days Left", value: overview?.trialDaysLeft || 0 },
  ];

  const totalThroughput = throughputData.reduce(
    (acc: number, curr: any) => acc + curr.value,
    0,
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading || showSkeleton) {
    return <DashboardOverviewSkeleton />;
  }

  return (
    <div className="p-6 space-y-10">
      {/* ANALYTICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {analyticsData.map((item) => (
          <div key={item.label} className="shadow rounded-xl p-5 bg-white">
            <p className="text-sm text-gray-500">{item.label}</p>
            <h3 className="text-2xl font-bold mt-2">{item.value}</h3>
          </div>
        ))}
      </div>

      {/* PERFORMANCE */}
      <Card className="shadow border-none">
        <CardHeader className="flex flex-row justify-between">
          <div>
            <CardTitle>Performance</CardTitle>
            <CardDescription>Throughput &gt; {totalThroughput}</CardDescription>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="text-xs">
                {range}
                <ChevronDown size={14} />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              {["daily", "weekly", "monthly", "yearly"].map((r) => (
                <DropdownMenuItem
                  key={r}
                  onClick={() => setRange(r)}
                  className="capitalize"
                >
                  {r}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>

        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={throughputData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />

              <Area type="monotone" dataKey="value" opacity={0.2} />
              <Line type="monotone" dataKey="value" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
