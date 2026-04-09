"use client";

import Animate from "@/components/layout/Animate";
import { Skeleton } from "./skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const UsersSkeleton = () => {
  return (
    <Animate>
      <div className="space-y-6">
        {/* ================= HEADER ================= */}
        <div className="flex justify-end">
          <Skeleton className="h-10 w-40" />
        </div>

        {/* ================= DESKTOP TABLE ================= */}
        <div className="hidden md:block border rounded-xl bg-white overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead className="p-5">
                  <Skeleton className="h-4 w-24" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-16" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-28" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-20" />
                </TableHead>
                <TableHead className="text-center">
                  <Skeleton className="h-4 w-16 mx-auto" />
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {/* USER (avatar + name) */}
                  <TableCell className="p-5">
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-8 h-8 rounded-full" />
                      <Skeleton className="h-4 w-28" />
                    </div>
                  </TableCell>

                  {/* ROLE */}
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>

                  {/* DATE */}
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>

                  {/* STATUS */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-2 h-2 rounded-full" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </TableCell>

                  {/* ACTIONS */}
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* ================= MOBILE CARDS ================= */}
        <div className="md:hidden space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="border rounded-xl p-4 bg-white space-y-3">
              {/* TOP ROW */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="h-4 w-28" />
                </div>

                <Skeleton className="h-8 w-8 rounded-md" />
              </div>

              {/* DETAILS */}
              <div className="text-sm space-y-2">
                <Skeleton className="h-4 w-24" />

                <Skeleton className="h-4 w-32" />

                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="w-2 h-2 rounded-full" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Animate>
  );
};

export default UsersSkeleton;
