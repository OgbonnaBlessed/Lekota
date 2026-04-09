/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  useGetTenantOverviewQuery,
  useGetTenantThroughputQuery,
} from "@/redux/api/tenant.api";
import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Area,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Animate from "@/components/layout/Animate";
import { Button } from "@/components/ui/button";
import DashboardOverviewSkeleton from "@/components/ui/skeleton/DashboardOverviewSkeleton";
import { ChevronDown } from "lucide-react";

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
    <Animate>
      <div className="space-y-10">
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
              <CardDescription>
                Throughput &gt; {totalThroughput}
              </CardDescription>
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
    </Animate>
  );
};

export default Page;
