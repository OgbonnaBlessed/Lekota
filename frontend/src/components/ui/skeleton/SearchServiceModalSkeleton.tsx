import Animate from "@/components/layout/Animate";
import { Skeleton } from "./skeleton";

const SearchServiceModalSkeleton = () => {
  return (
    <Animate>
      <div className="flex flex-col gap-3 mt-5">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-3 border rounded-lg"
          >
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex flex-col gap-2 w-full">
              <Skeleton className="h-3 w-[40%]" />
              <Skeleton className="h-3 w-[60%]" />
            </div>
          </div>
        ))}
      </div>
    </Animate>
  );
};

export default SearchServiceModalSkeleton;
