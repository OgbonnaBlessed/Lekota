"use client";

/* ================= SHIMMER WRAPPER ================= */
const Skeleton = ({ className }: { className?: string }) => (
  <div
    className={`relative overflow-hidden bg-gray-200 rounded-md ${className}`}
  >
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-white/60 to-transparent" />
  </div>
);

/* ================= TABLE SKELETON ================= */
const TableSkeleton = () => (
  <div className="hidden md:block border rounded-xl bg-white overflow-hidden">
    {/* header */}
    <div className="grid grid-cols-4 bg-gray-100 p-5">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-4 w-20 mx-auto" />
    </div>

    {/* rows */}
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="grid grid-cols-4 items-center px-5 py-4 border-t">
        {/* client */}
        <div className="flex items-center gap-2">
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>

        {/* date */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>

        {/* status */}
        <div className="flex items-center gap-2">
          <Skeleton className="w-2 h-2 rounded-full" />
          <Skeleton className="h-4 w-16" />
        </div>

        {/* action */}
        <Skeleton className="h-4 w-20 mx-auto" />
      </div>
    ))}
  </div>
);

/* ================= MOBILE CARD SKELETON ================= */
const CardSkeleton = () => (
  <div className="md:hidden space-y-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <div
        key={i}
        className="shadow shadow-gray-200 rounded-xl p-4 bg-white space-y-3"
      >
        <div className="flex items-center gap-2">
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-28" />
          <div className="flex items-center gap-2">
            <Skeleton className="w-2 h-2 rounded-full" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>

        <Skeleton className="h-4 w-24" />
      </div>
    ))}
  </div>
);

/* ================= PAGINATION SKELETON ================= */
const PaginationSkeleton = () => (
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
    <Skeleton className="h-4 w-40" />

    <div className="flex items-center gap-2">
      <Skeleton className="h-8 w-12 rounded-md" />
      <Skeleton className="h-8 w-8 rounded-md" />
      <Skeleton className="h-8 w-8 rounded-md" />
      <Skeleton className="h-8 w-8 rounded-md" />
      <Skeleton className="h-8 w-12 rounded-md" />
    </div>
  </div>
);

/* ================= MAIN PAGE SKELETON ================= */
const PageSkeleton = () => {
  return (
    <div className="w-full flex flex-col gap-5">
      {/* HEADER */}
      <div className="space-y-2">
        <Skeleton className="h-6 md:h-8 w-40" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* TABS */}
      <div className="flex gap-2 bg-gray-100 p-2 rounded-full w-fit">
        <Skeleton className="h-10 w-28 rounded-full" />
        <Skeleton className="h-10 w-28 rounded-full" />
        <Skeleton className="h-10 w-28 rounded-full" />
      </div>

      {/* CONTENT */}
      <div className="flex flex-col gap-5">
        <TableSkeleton />
        <CardSkeleton />
        <PaginationSkeleton />
      </div>
    </div>
  );
};

export { TableSkeleton, CardSkeleton, PaginationSkeleton, PageSkeleton };
