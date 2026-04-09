"use client";

import Animate from "@/components/layout/Animate";

/* ================= BASE SKELETON ================= */
const Skeleton = ({ className }: { className?: string }) => (
  <div
    className={`relative overflow-hidden bg-gray-200 rounded-md ${className}`}
  >
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-linear-to-r from-transparent via-white/60 to-transparent" />
  </div>
);

/* ================= HEADER ================= */
const HeaderSkeleton = () => (
  <div className="flex justify-end w-full">
    <Skeleton className="h-10 w-44 rounded-md" />
  </div>
);

/* ================= TABLE ================= */
const TableSkeleton = () => (
  <div className="hidden md:block border rounded-xl bg-white overflow-hidden">
    {/* Header row */}
    <div className="grid grid-cols-4 bg-gray-100 p-5">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-4 w-24 mx-auto" />
    </div>

    {/* Rows */}
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="grid grid-cols-4 items-center px-5 py-4 border-t">
        {/* user */}
        <div className="flex items-center gap-2">
          <Skeleton className="w-8 h-8 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>

        {/* date */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-3 w-24" />
        </div>

        {/* status */}
        <div className="flex items-center gap-2">
          <Skeleton className="w-2 h-2 rounded-full" />
          <Skeleton className="h-4 w-16" />
        </div>

        {/* action */}
        <Skeleton className="h-4 w-28 mx-auto" />
      </div>
    ))}
  </div>
);

/* ================= MOBILE ================= */
const CardSkeleton = () => (
  <div className="md:hidden space-y-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="border rounded-xl p-4 bg-white space-y-3">
        {/* user */}
        <div className="flex items-center gap-2">
          <Skeleton className="w-8 h-8 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>

        {/* content */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-28" />

          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="w-2 h-2 rounded-full" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>

        <Skeleton className="h-4 w-32" />
      </div>
    ))}
  </div>
);

/* ================= MAIN ================= */
export default function AppointmentsSkeleton() {
  return (
    <Animate>
      <div className="space-y-6">
        <HeaderSkeleton />
        <TableSkeleton />
        <CardSkeleton />
      </div>
    </Animate>
  );
}
