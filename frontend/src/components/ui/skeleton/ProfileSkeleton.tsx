"use client";

import { Skeleton } from "./skeleton";

const ProfileSkeleton = () => {
  return (
    <div className="w-full flex flex-col border rounded-xl overflow-hidden">
      {/* ================= HEADER ================= */}
      <div className="w-full flex items-center justify-between bg-gray-100 p-5">
        <Skeleton className="h-6 w-24" />

        <Skeleton className="h-6 w-6 rounded-sm" />
      </div>

      {/* ================= CONTENT ================= */}
      <div className="flex items-center justify-between gap-8 flex-wrap p-5">
        {/* ITEM 1 */}
        <div className="flex flex-col gap-2 min-w-30">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>

        {/* ITEM 2 */}
        <div className="flex flex-col gap-2 min-w-30">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-4 w-24" />
        </div>

        {/* ITEM 3 */}
        <div className="flex flex-col gap-2 min-w-30">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>

        {/* ITEM 4 */}
        <div className="flex flex-col gap-2 min-w-30">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
