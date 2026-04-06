import { Skeleton } from "./skeleton";

const TenantSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex justify-end">
        <Skeleton className="h-10 w-40" />
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block border rounded-xl bg-white overflow-hidden">
        <div className="p-4 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="grid grid-cols-6 gap-4 items-center">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-8 rounded-md ml-auto" />
            </div>
          ))}
        </div>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="md:hidden space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="border rounded-xl p-4 bg-white space-y-3">
            <div className="flex justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-40" />
              </div>
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TenantSkeleton;