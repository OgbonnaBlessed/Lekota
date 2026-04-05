"use client";


/* ================= SHIMMER ================= */
const Skeleton = ({ className }: { className?: string }) => (
  <div
    className={`relative overflow-hidden bg-gray-200 rounded-md ${className}`}
  >
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-linear-to-r from-transparent via-white/60 to-transparent" />
  </div>
);

/* ================= SECTION BLOCK ================= */
const InfoBlock = () => (
  <div className="flex flex-col gap-1">
    <Skeleton className="h-4 w-16" /> {/* label */}
    <div className="flex flex-col gap-1">
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-3 w-32" />
    </div>
  </div>
);

/* ================= PAGE SKELETON ================= */
export default function ScheduleDetailsSkeleton() {
  return (
    <div className="w-full flex flex-col gap-5">
      {/* BACK */}
      <div className="flex items-center gap-2">
        <Skeleton className="w-3 h-3 rounded-sm" />
        <Skeleton className="h-3 w-32" />
      </div>

      {/* NAME */}
      <Skeleton className="h-6 md:h-8 w-48" />

      {/* TIME */}
      <InfoBlock />

      {/* DURATION */}
      <div className="flex flex-col gap-1">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-40" />
      </div>

      {/* MODE */}
      <div className="flex flex-col gap-1">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-36" />
      </div>

      {/* MEETING LINK */}
      <div className="flex flex-col gap-1">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-44" />
      </div>

      {/* STATUS */}
      <div className="flex flex-col gap-1">
        <Skeleton className="h-4 w-16" />
        <div className="flex items-center gap-2">
          <Skeleton className="w-2 h-2 rounded-full" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>

      {/* NOTE BOX */}
      <div className="max-w-full border border-gray-200 rounded-lg overflow-hidden">
        {/* header */}
        <div className="bg-gray-200 p-5">
          <Skeleton className="h-4 w-16" />
        </div>

        {/* textarea area */}
        <div className="relative px-3 py-3">
          <Skeleton className="w-full h-52 rounded-md" />

          {/* button */}
          <Skeleton className="absolute right-4 bottom-4 h-10 w-20 rounded-md" />
        </div>
      </div>
    </div>
  );
}
