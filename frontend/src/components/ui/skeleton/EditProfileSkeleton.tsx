"use client";

import Animate from "@/components/layout/Animate";
import { Skeleton } from "./skeleton";

const EditProfileSkeleton = () => {
  return (
    <Animate>
      <div className="flex flex-col gap-8 animate-in fade-in duration-300">
        {/* ================= PROFILE HEADER ================= */}
        <div className="flex items-start gap-4">
          {/* Upload circle */}
          <Skeleton className="w-24 h-24 rounded-full border border-[#2D36E0]/30" />

          {/* Name + email + upload */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-40" />
            </div>

            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-3 rounded-sm" />
              <Skeleton className="h-3 w-36" />
            </div>
          </div>
        </div>

        {/* ================= FORM ================= */}
        <div className="flex flex-col gap-8">
          {/* INPUT BLOCK */}
          {["name", "email", "row", "location", "bio"].map((item, i) => {
            // Row with 2 inputs
            if (item === "row") {
              return (
                <div
                  key={i}
                  className="flex flex-col md:flex-row gap-8"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {[1, 2].map((_, j) => (
                    <div key={j} className="flex flex-col gap-2 w-full">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                  ))}
                </div>
              );
            }

            return (
              <div
                key={i}
                className="flex flex-col gap-2"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {/* Label */}
                <Skeleton className="h-3 w-28" />

                {/* Input */}
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            );
          })}
        </div>

        {/* ================= BUTTON ================= */}
        <div className="mt-5">
          <Skeleton className="h-12 w-40 rounded-md" />
        </div>
      </div>
    </Animate>
  );
};

export default EditProfileSkeleton;
