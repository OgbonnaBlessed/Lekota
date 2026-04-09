"use client";

import Animate from "@/components/layout/Animate";
import { Skeleton } from "./skeleton";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const AvailabilitySkeleton = () => {
  return (
    <Animate>
      <div className="flex flex-col gap-8 animate-pulse">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <Skeleton className="h-7 w-80" />
          <Skeleton className="h-4 w-60" />
        </div>

        {/* Timezone Selector */}
        <div className="w-fit">
          <Skeleton className="h-10 w-44 rounded-lg" />
        </div>

        {/* Days */}
        <div className="flex flex-col gap-5">
          {days.map((day, index) => {
            const isActiveMock = index % 2 === 0; // alternate UI for realism

            return (
              <div key={day} className="flex items-center gap-5 text-sm">
                {/* Day circle */}
                <Skeleton className="w-10 h-10 rounded-full" />

                {/* Content */}
                <div className="w-full flex flex-col gap-2">
                  {isActiveMock ? (
                    <div className="flex items-center gap-3">
                      {/* Time range */}
                      <Skeleton className="h-9 w-44 rounded-md" />

                      {/* X button */}
                      <Skeleton className="h-6 w-6 rounded-full" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      {/* Unavailable text */}
                      <Skeleton className="h-4 w-24" />

                      {/* Plus button */}
                      <Skeleton className="h-6 w-6 rounded-full" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Save Button */}
        <Skeleton className="h-12 w-48 rounded-lg" />
      </div>
    </Animate>
  );
};

export default AvailabilitySkeleton;
