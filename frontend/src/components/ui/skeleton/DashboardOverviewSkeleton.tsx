/* eslint-disable react-hooks/purity */
"use client";

import { Skeleton } from "./skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const PageSkeleton = () => {
  return (
    <div className="p-6 space-y-10 animate-pulse">
      {/* ===================== */}
      {/* 🔹 ANALYTICS SKELETON */}
      {/* ===================== */}
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="shadow shadow-[#ABABAB] rounded-xl p-5 bg-white space-y-3"
            >
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-8 w-20" />
            </div>
          ))}
        </div>
      </div>

      {/* ===================== */}
      {/* 🔹 PERFORMANCE SKELETON */}
      {/* ===================== */}
      <div>
        <Card className="shadow shadow-[#ABABAB]">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-56" />
            </div>

            <div className="text-right space-y-2">
              <Skeleton className="h-3 w-24 ml-auto" />
              <Skeleton className="h-6 w-16 ml-auto" />
            </div>
          </CardHeader>

          <CardContent className="h-80">
            {/* Fake chart */}
            <div className="w-full h-full flex items-end gap-2">
              {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="flex-1 rounded-md"
                  style={{
                    height: `${Math.random() * 70 + 30}%`,
                  }}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ===================== */}
      {/* 🔹 SYSTEM HEALTH SKELETON */}
      {/* ===================== */}
      <div>
        <Skeleton className="h-6 w-40 mb-4" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="border rounded-xl p-5 bg-white shadow-sm flex items-center justify-between"
            >
              <Skeleton className="h-4 w-32" />
              <Skeleton className="w-3 h-3 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PageSkeleton;
