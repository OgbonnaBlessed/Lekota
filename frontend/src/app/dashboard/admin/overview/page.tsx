/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

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
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  useGetOverviewAnalyticsQuery,
  useGetThroughputQuery,
} from "@/redux/api/admin.api";
import DashboardOverviewSkeleton from "@/components/ui/skeleton/DashboardOverviewSkeleton";

const systemHealth = [
  { name: "API Server", status: "healthy" },
  { name: "Database", status: "healthy" },
  { name: "Auth Service", status: "degraded" },
  { name: "Queue सिस्टम", status: "healthy" },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "healthy":
      return "bg-green-500";
    case "degraded":
      return "bg-yellow-500";
    case "down":
      return "bg-red-500";
    default:
      return "bg-gray-400";
  }
};

const Page = () => {
  const [range, setRange] = useState("weekly");
  const { data: overview, isLoading } = useGetOverviewAnalyticsQuery({});
  const { data: throughput } = useGetThroughputQuery(range);
  const [showSkeleton, setShowSkeleton] = useState<boolean>(true);

  const throughputData =
    throughput?.map((item: any) => ({
      time: item._id,
      value: item.count,
    })) || [];

  const analyticsData = [
    { label: "Total Tenants", value: overview?.totalTenants || 0 },
    { label: "Active Tenants", value: overview?.activeTenants || 0 },
    { label: "Suspended Tenants", value: overview?.suspendedTenants || 0 },
    { label: "Deleted Tenants", value: overview?.deletedTenants || 0 },
    { label: "Subscribed Tenants", value: overview?.subscribedTenants || 0 },
  ];

  const totalThroughput = throughputData.reduce(
    (acc: any, curr: { value: any }) => acc + curr.value,
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
      {/* ===================== */}
      {/* 🔹 ANALYTICS SECTION */}
      {/* ===================== */}
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {analyticsData.map((item) => (
            <div
              key={item.label}
              className="shadow shadow-[#ABABAB] rounded-xl p-5 bg-white"
            >
              <p className="text-sm text-gray-500">{item.label}</p>
              <h3 className="text-2xl font-bold mt-2">{item.value}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* ===================== */}
      {/* 🔹 PERFORMANCE */}
      {/* ===================== */}
      <div>
        <Card className="shadow shadow-[#ABABAB] border-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Performance</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <p className="text-sm text-muted-foreground">
                  Through put &gt;
                </p>
                <p className="text-sm font-semibold">{totalThroughput}</p>
              </CardDescription>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 text-xs"
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                  <ChevronDown size={14} />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                {["daily", "weekly", "monthly", "yearly"].map((r) => (
                  <DropdownMenuItem
                    key={r}
                    onClick={() => setRange(r)}
                    className={`cursor-pointer capitalize ${
                      range === r ? "bg-gray-100 font-medium" : ""
                    }`}
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
                {/* Gradient */}
                <defs>
                  <linearGradient id="colorFlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopOpacity={0.3} />
                    <stop offset="95%" stopOpacity={0} />
                  </linearGradient>
                </defs>

                {/* Grid */}
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  opacity={0.2}
                />

                {/* Axes */}
                <XAxis
                  dataKey="time"
                  tickLine={false}
                  axisLine={false}
                  className="text-xs"
                />
                <YAxis tickLine={false} axisLine={false} className="text-xs" />

                {/* Tooltip */}
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    fontSize: "12px",
                  }}
                  cursor={{ strokeDasharray: "3 3" }}
                />

                {/* Area (for depth) */}
                <Area
                  type="monotone"
                  dataKey="value"
                  fill="url(#colorFlow)"
                  stroke="none"
                />

                {/* Line (main focus) */}
                <Line
                  type="monotone"
                  dataKey="value"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* ===================== */}
      {/* 🔹 SYSTEM HEALTH */}
      {/* ===================== */}
      <div>
        <h2 className="text-xl font-semibold mb-4">System Health</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {systemHealth.map((service) => (
            <div
              key={service.name}
              className="border rounded-xl p-5 bg-white shadow-sm flex items-center justify-between"
            >
              <span className="text-sm font-medium">{service.name}</span>

              <span
                className={`w-3 h-3 rounded-full ${getStatusColor(
                  service.status,
                )}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
