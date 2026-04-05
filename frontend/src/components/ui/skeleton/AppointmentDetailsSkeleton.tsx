"use client";


/* ================= BASE SKELETON ================= */
const Skeleton = ({ className }: { className?: string }) => (
  <div
    className={`relative overflow-hidden bg-gray-200 rounded-md ${className}`}
  >
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-linear-to-r from-transparent via-white/60 to-transparent" />
  </div>
);

/* ================= INFO BLOCK ================= */
const InfoBlock = ({ withSub = false }: { withSub?: boolean }) => (
  <div className="flex flex-col gap-1">
    <Skeleton className="h-4 w-20" />
    <div className="flex flex-col gap-1">
      <Skeleton className="h-4 w-48" />
      {withSub && <Skeleton className="h-3 w-32" />}
    </div>
  </div>
);

/* ================= PAGE ================= */
export default function AppointmentDetailsSkeleton() {
  return (
    <div className="w-full flex flex-col gap-5">
      {/* BACK */}
      <div className="flex items-center gap-2">
        <Skeleton className="w-3 h-3 rounded-sm" />
        <Skeleton className="h-3 w-40" />
      </div>

      {/* NAME */}
      <Skeleton className="h-6 md:h-8 w-52" />

      {/* TIME */}
      <InfoBlock withSub />

      {/* MODE */}
      <InfoBlock />

      {/* MEETING LINK */}
      <InfoBlock />

      {/* DURATION + ACTIONS */}
      <div className="flex flex-col gap-1">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-44" />

        <div className="flex items-center gap-5 mt-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>

      {/* RATING */}
      <div className="w-fit flex items-center gap-4 bg-gray-200 p-5 rounded-lg">
        <Skeleton className="h-4 w-12" />

        <div className="flex items-center gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="w-5 h-5 rounded-sm" />
          ))}
        </div>
      </div>

      {/* NOTES */}
      <div className="max-w-full border border-gray-200 rounded-lg overflow-hidden">
        {/* header */}
        <div className="bg-gray-200 p-5">
          <Skeleton className="h-4 w-40" />
        </div>

        {/* textarea */}
        <div className="relative px-3 py-3">
          <Skeleton className="w-full h-52 rounded-md" />

          {/* button */}
          <Skeleton className="absolute right-4 bottom-4 h-10 w-20 rounded-md" />
        </div>
      </div>
    </div>
  );
}
