/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Animate from "@/components/layout/Animate";
import {
  CardSkeleton,
  PaginationSkeleton,
  TableSkeleton,
} from "@/components/ui/skeleton/ScheduleSkeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetSchedulesQuery } from "@/redux/api/staff.api";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type User = {
  image: string;
  name: string;
};

type Scheduled = {
  start_time: string;
  end_time: string;
};

type Schedule = {
  id: number;
  user: User;
  date: string;
  scheduled_time: Scheduled;
  status: string;
};

type Pagination = {
  page: number;
  setPage: (value: number) => void;
  totalPages: number;
  startItem: number;
  endItem: number;
  total: number;
};

const ITEMS_PER_PAGE = 10;

/* ================= REUSABLE PAGINATION HOOK ================= */
const usePagination = (data: Schedule[], page: number) => {
  const totalPages = Math.max(1, Math.ceil(data.length / ITEMS_PER_PAGE));

  const safePage = Math.min(Math.max(page, 1), totalPages);

  const start = (safePage - 1) * ITEMS_PER_PAGE;
  const end = Math.min(start + ITEMS_PER_PAGE, data.length);

  const paginatedData = data.slice(start, end);

  const startItem = data.length === 0 ? 0 : start + 1;
  const endItem = end;

  return { totalPages, paginatedData, startItem, endItem };
};

/* ================= STATUS BADGE ================= */
const Status = ({ status }: { status: string }) => (
  <div className="flex items-center gap-2">
    <span
      className={`w-2 h-2 rounded-full ${
        status === "completed" ? "bg-green-500" : "bg-gray-400"
      }`}
    />
    <p className="capitalize">{status}</p>
  </div>
);

/* ================= TABLE ================= */
const ScheduleTable = ({ data }: { data: Schedule[] }) => (
  <div className="hidden md:block border rounded-xl bg-white overflow-x-auto">
    <Table>
      <TableHeader className="bg-gray-100">
        <TableRow>
          <TableHead className="p-5">Client</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="p-5">
              <div className="flex items-center gap-2">
                <div className="relative w-8 h-8 rounded-full overflow-hidden">
                  <Image
                    src={item.user.image}
                    alt={item.user.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <p>{item.user.name}</p>
              </div>
            </TableCell>

            <TableCell>
              <div>
                <p className="font-medium">{item.date}</p>
                <p className="text-xs text-gray-500">
                  {item.scheduled_time.start_time} —{" "}
                  {item.scheduled_time.end_time}
                </p>
              </div>
            </TableCell>

            <TableCell>
              <Status status={item.status} />
            </TableCell>

            <TableCell className="text-center">
              <Link href={`./schedules/${item.id}`}>
                <p className="text-[#2D36E0]">View schedule</p>
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

/* ================= MOBILE CARDS ================= */
const ScheduleCards = ({ data }: { data: Schedule[] }) => (
  <div className="md:hidden space-y-4">
    {data.map((item) => (
      <div
        key={item.id}
        className="shadow shadow-gray-300 rounded-xl p-4 bg-white space-y-3"
      >
        <div className="flex items-center gap-2 font-semibold">
          <div className="relative w-8 h-8 rounded-full overflow-hidden">
            <Image
              src={item.user.image}
              alt={item.user.name}
              fill
              className="object-cover"
            />
          </div>
          <p>{item.user.name}</p>
        </div>

        <div className="text-sm space-y-1">
          <p className="font-medium">{item.date}</p>
          <p className="text-xs text-gray-500">
            {item.scheduled_time.start_time} — {item.scheduled_time.end_time}
          </p>

          <Status status={item.status} />
        </div>

        <Link href={`./schedules/${item.id}`}>
          <p className="text-[#2D36E0]">View schedule</p>
        </Link>
      </div>
    ))}
  </div>
);

/* ================= PAGINATION ================= */
const Pagination = ({
  page,
  setPage,
  totalPages,
  startItem,
  endItem,
  total,
}: Pagination) => (
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
    <p className="text-sm text-muted-foreground">
      Showing {startItem} - {endItem} of {total}
    </p>

    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={() => setPage(Math.max(page - 1, 1))}
        disabled={page === 1}
        className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
      >
        Prev
      </button>

      {Array.from({ length: totalPages }).map((_, i) => {
        const p = i + 1;
        return (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`px-3 py-1 text-sm rounded-md border ${
              page === p ? "bg-[#2D36E0] text-white" : ""
            }`}
          >
            {p}
          </button>
        );
      })}

      <button
        onClick={() => setPage(Math.min(page + 1, totalPages))}
        disabled={page === totalPages}
        className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>
);

/* ================= SECTION WRAPPER ================= */
const Section = ({
  type,
  page,
  setPage,
}: {
  type: "upcoming" | "week" | "past";
  page: number;
  setPage: (n: number) => void;
}) => {
  const { data, isLoading } = useGetSchedulesQuery(type);

  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (!isLoading) {
      timer = setTimeout(() => {
        setShowSkeleton(false);
      }, 5000); // 5 seconds
    } else {
      setShowSkeleton(true);
    }

    return () => clearTimeout(timer);
  }, [isLoading]);

  const schedules = data?.schedules || [];

  const mapped = schedules.map((item: any) => ({
    id: item._id,
    user: {
      image: item.client?.profile?.image || "/avatar.png",
      name: item.client?.name,
    },
    date: new Date(item.date).toDateString(),
    scheduled_time: {
      start_time: item.startTime,
      end_time: item.endTime,
    },
    status: item.status,
  }));

  const { totalPages, paginatedData, startItem, endItem } = usePagination(
    mapped,
    page,
  );

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(mapped.length / ITEMS_PER_PAGE));

    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [mapped.length, page, setPage]);

  const isEmpty = !isLoading && mapped.length === 0;

  return (
    <div className="flex flex-col gap-5">
      {showSkeleton ? (
        <>
          <TableSkeleton />
          <CardSkeleton />
          <PaginationSkeleton />
        </>
      ) : isEmpty ? (
        <div className="w-full min-h-52 flex items-center justify-center text-sm text-gray-500">
          <p>You currently have no schedule</p>
        </div>
      ) : (
        <>
          <ScheduleTable data={paginatedData} />
          <ScheduleCards data={paginatedData} />

          {mapped.length > ITEMS_PER_PAGE && (
            <Pagination
              page={page}
              setPage={setPage}
              totalPages={totalPages}
              startItem={startItem}
              endItem={endItem}
              total={mapped.length}
            />
          )}
        </>
      )}
    </div>
  );
};

/* ================= MAIN PAGE ================= */
export default function Page() {
  const [pages, setPages] = useState({
    upcoming: 1,
    week: 1,
    past: 1,
  });

  const setPage = (section: keyof typeof pages, value: number) => {
    setPages((prev) => ({ ...prev, [section]: value }));
  };

  return (
    <Animate>
      <div className="w-full flex flex-col gap-5">
        <div>
          <h1 className="text-xl md:text-3xl font-medium">Schedules</h1>
          <p className="text-sm md:text-base">
            Access your schedules both past and now
          </p>
        </div>

        <Tabs defaultValue="upcoming">
          <TabsList className="justify-start gap-2 bg-gray-100 py-6 px-2 rounded-full">
            <TabsTrigger
              value="upcoming"
              className="data-[state=active]:bg-[#2D36E0] data-[state=active]:text-white text-black data-[state=active]:p-4 p-4 rounded-full transition-all duration-300"
            >
              Upcoming
            </TabsTrigger>
            <TabsTrigger
              value="week"
              className="data-[state=active]:bg-[#2D36E0] data-[state=active]:text-white text-black data-[state=active]:p-4 p-4 rounded-full"
            >
              This week
            </TabsTrigger>
            <TabsTrigger
              value="past"
              className="data-[state=active]:bg-[#2D36E0] data-[state=active]:text-white text-black data-[state=active]:p-4 p-4 rounded-full"
            >
              Past
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-5">
            <Section
              type="upcoming"
              page={pages.upcoming}
              setPage={(n) => setPage("upcoming", n)}
            />
          </TabsContent>

          <TabsContent value="week" className="mt-5">
            <Section
              type="week"
              page={pages.week}
              setPage={(n) => setPage("week", n)}
            />
          </TabsContent>

          <TabsContent value="past" className="mt-5">
            <Section
              type="past"
              page={pages.past}
              setPage={(n) => setPage("past", n)}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Animate>
  );
}
