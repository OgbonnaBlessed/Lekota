"use client";

import Animate from "@/components/layout/Animate";
import { Skeleton } from "./skeleton";

const NotificationsSkeleton = () => {
  return (
    <Animate>
      <div className="w-full flex flex-col gap-5">
        {/* ================= HEADER ================= */}
        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 md:h-8 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>

        {/* ================= TABS ================= */}
        <div className="flex gap-2 bg-gray-100 py-3 px-2 rounded-full w-fit">
          <Skeleton className="h-10 w-20 rounded-full" />
          <Skeleton className="h-10 w-28 rounded-full" />
          <Skeleton className="h-10 w-20 rounded-full" />
        </div>

        {/* ================= NOTIFICATIONS LIST ================= */}
        <div className="flex flex-col gap-5 mt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-full flex items-start gap-4">
              {/* ICON */}
              <Skeleton className="w-12 h-12 rounded-full" />

              {/* CONTENT */}
              <div className="flex-1 space-y-2">
                {/* TITLE */}
                <Skeleton className="h-4 w-3/4" />

                {/* MESSAGE */}
                <div className="space-y-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>

                {/* DATE */}
                <Skeleton className="h-3 w-32 mt-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Animate>
  );
};

export default NotificationsSkeleton;
