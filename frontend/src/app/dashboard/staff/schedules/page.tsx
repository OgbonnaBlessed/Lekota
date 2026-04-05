"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

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

const schedules_data: Record<"upcoming" | "week" | "past", Schedule[]> = {
  upcoming: [
    {
      id: 1,
      user: { image: "/banner.png", name: "David Clinton" },
      date: "Mon, 22nd June, 2026",
      scheduled_time: { start_time: "9:00 am", end_time: "9:40 am" },
      status: "pending",
    },
    {
      id: 2,
      user: { image: "/banner.png", name: "Sarah Johnson" },
      date: "Mon, 22nd June, 2026",
      scheduled_time: { start_time: "10:00 am", end_time: "10:40 am" },
      status: "completed",
    },
    {
      id: 3,
      user: { image: "/banner.png", name: "Michael Brown" },
      date: "Tue, 23rd June, 2026",
      scheduled_time: { start_time: "11:00 am", end_time: "11:40 am" },
      status: "pending",
    },
    {
      id: 4,
      user: { image: "/banner.png", name: "Emily Davis" },
      date: "Tue, 23rd June, 2026",
      scheduled_time: { start_time: "12:00 pm", end_time: "12:40 pm" },
      status: "cancelled",
    },
    {
      id: 5,
      user: { image: "/banner.png", name: "Daniel Wilson" },
      date: "Wed, 24th June, 2026",
      scheduled_time: { start_time: "1:00 pm", end_time: "1:40 pm" },
      status: "pending",
    },
    {
      id: 6,
      user: { image: "/banner.png", name: "Sophia Martinez" },
      date: "Wed, 24th June, 2026",
      scheduled_time: { start_time: "2:00 pm", end_time: "2:40 pm" },
      status: "completed",
    },
    {
      id: 7,
      user: { image: "/banner.png", name: "James Anderson" },
      date: "Thu, 25th June, 2026",
      scheduled_time: { start_time: "9:00 am", end_time: "9:40 am" },
      status: "pending",
    },
    {
      id: 8,
      user: { image: "/banner.png", name: "Olivia Thomas" },
      date: "Thu, 25th June, 2026",
      scheduled_time: { start_time: "10:00 am", end_time: "10:40 am" },
      status: "completed",
    },
    {
      id: 9,
      user: { image: "/banner.png", name: "William Taylor" },
      date: "Fri, 26th June, 2026",
      scheduled_time: { start_time: "11:00 am", end_time: "11:40 am" },
      status: "pending",
    },
    {
      id: 10,
      user: { image: "/banner.png", name: "Ava Moore" },
      date: "Fri, 26th June, 2026",
      scheduled_time: { start_time: "12:00 pm", end_time: "12:40 pm" },
      status: "cancelled",
    },
    {
      id: 11,
      user: { image: "/banner.png", name: "Ethan Jackson" },
      date: "Sat, 27th June, 2026",
      scheduled_time: { start_time: "1:00 pm", end_time: "1:40 pm" },
      status: "pending",
    },
    {
      id: 12,
      user: { image: "/banner.png", name: "Isabella White" },
      date: "Sat, 27th June, 2026",
      scheduled_time: { start_time: "2:00 pm", end_time: "2:40 pm" },
      status: "completed",
    },
    {
      id: 13,
      user: { image: "/banner.png", name: "Liam Harris" },
      date: "Sun, 28th June, 2026",
      scheduled_time: { start_time: "9:00 am", end_time: "9:40 am" },
      status: "pending",
    },
    {
      id: 14,
      user: { image: "/banner.png", name: "Mia Clark" },
      date: "Sun, 28th June, 2026",
      scheduled_time: { start_time: "10:00 am", end_time: "10:40 am" },
      status: "completed",
    },
    {
      id: 15,
      user: { image: "/banner.png", name: "Noah Lewis" },
      date: "Sun, 28th June, 2026",
      scheduled_time: { start_time: "11:00 am", end_time: "11:40 am" },
      status: "pending",
    },
  ],

  week: [
    {
      id: 16,
      user: { image: "/banner.png", name: "Emma Walker" },
      date: "Mon, 15th June, 2026",
      scheduled_time: { start_time: "9:00 am", end_time: "9:40 am" },
      status: "completed",
    },
    {
      id: 17,
      user: { image: "/banner.png", name: "Lucas Hall" },
      date: "Mon, 15th June, 2026",
      scheduled_time: { start_time: "10:00 am", end_time: "10:40 am" },
      status: "pending",
    },
    {
      id: 18,
      user: { image: "/banner.png", name: "Charlotte Allen" },
      date: "Tue, 16th June, 2026",
      scheduled_time: { start_time: "11:00 am", end_time: "11:40 am" },
      status: "completed",
    },
    {
      id: 19,
      user: { image: "/banner.png", name: "Henry Young" },
      date: "Tue, 16th June, 2026",
      scheduled_time: { start_time: "12:00 pm", end_time: "12:40 pm" },
      status: "cancelled",
    },
    {
      id: 20,
      user: { image: "/banner.png", name: "Amelia King" },
      date: "Wed, 17th June, 2026",
      scheduled_time: { start_time: "1:00 pm", end_time: "1:40 pm" },
      status: "pending",
    },
    {
      id: 21,
      user: { image: "/banner.png", name: "Benjamin Wright" },
      date: "Wed, 17th June, 2026",
      scheduled_time: { start_time: "2:00 pm", end_time: "2:40 pm" },
      status: "completed",
    },
    {
      id: 22,
      user: { image: "/banner.png", name: "Harper Scott" },
      date: "Thu, 18th June, 2026",
      scheduled_time: { start_time: "9:00 am", end_time: "9:40 am" },
      status: "pending",
    },
    {
      id: 23,
      user: { image: "/banner.png", name: "Elijah Green" },
      date: "Thu, 18th June, 2026",
      scheduled_time: { start_time: "10:00 am", end_time: "10:40 am" },
      status: "completed",
    },
    {
      id: 24,
      user: { image: "/banner.png", name: "Abigail Adams" },
      date: "Fri, 19th June, 2026",
      scheduled_time: { start_time: "11:00 am", end_time: "11:40 am" },
      status: "pending",
    },
    {
      id: 25,
      user: { image: "/banner.png", name: "Logan Baker" },
      date: "Fri, 19th June, 2026",
      scheduled_time: { start_time: "12:00 pm", end_time: "12:40 pm" },
      status: "cancelled",
    },
    {
      id: 26,
      user: { image: "/banner.png", name: "Ella Nelson" },
      date: "Sat, 20th June, 2026",
      scheduled_time: { start_time: "1:00 pm", end_time: "1:40 pm" },
      status: "completed",
    },
    {
      id: 27,
      user: { image: "/banner.png", name: "Jacob Carter" },
      date: "Sat, 20th June, 2026",
      scheduled_time: { start_time: "2:00 pm", end_time: "2:40 pm" },
      status: "pending",
    },
    {
      id: 28,
      user: { image: "/banner.png", name: "Scarlett Mitchell" },
      date: "Sun, 21st June, 2026",
      scheduled_time: { start_time: "9:00 am", end_time: "9:40 am" },
      status: "completed",
    },
    {
      id: 29,
      user: { image: "/banner.png", name: "Jack Perez" },
      date: "Sun, 21st June, 2026",
      scheduled_time: { start_time: "10:00 am", end_time: "10:40 am" },
      status: "pending",
    },
    {
      id: 30,
      user: { image: "/banner.png", name: "Grace Roberts" },
      date: "Sun, 21st June, 2026",
      scheduled_time: { start_time: "11:00 am", end_time: "11:40 am" },
      status: "completed",
    },
  ],

  past: [
    {
      id: 31,
      user: { image: "/banner.png", name: "Samuel Turner" },
      date: "Mon, 1st June, 2026",
      scheduled_time: { start_time: "9:00 am", end_time: "9:40 am" },
      status: "completed",
    },
    {
      id: 32,
      user: { image: "/banner.png", name: "Chloe Phillips" },
      date: "Mon, 1st June, 2026",
      scheduled_time: { start_time: "10:00 am", end_time: "10:40 am" },
      status: "completed",
    },
    {
      id: 33,
      user: { image: "/banner.png", name: "Alexander Campbell" },
      date: "Tue, 2nd June, 2026",
      scheduled_time: { start_time: "11:00 am", end_time: "11:40 am" },
      status: "completed",
    },
    {
      id: 34,
      user: { image: "/banner.png", name: "Lily Parker" },
      date: "Tue, 2nd June, 2026",
      scheduled_time: { start_time: "12:00 pm", end_time: "12:40 pm" },
      status: "cancelled",
    },
    {
      id: 35,
      user: { image: "/banner.png", name: "Matthew Evans" },
      date: "Wed, 3rd June, 2026",
      scheduled_time: { start_time: "1:00 pm", end_time: "1:40 pm" },
      status: "completed",
    },
    {
      id: 36,
      user: { image: "/banner.png", name: "Zoe Edwards" },
      date: "Wed, 3rd June, 2026",
      scheduled_time: { start_time: "2:00 pm", end_time: "2:40 pm" },
      status: "completed",
    },
    {
      id: 37,
      user: { image: "/banner.png", name: "Sebastian Collins" },
      date: "Thu, 4th June, 2026",
      scheduled_time: { start_time: "9:00 am", end_time: "9:40 am" },
      status: "completed",
    },
    {
      id: 38,
      user: { image: "/banner.png", name: "Hannah Stewart" },
      date: "Thu, 4th June, 2026",
      scheduled_time: { start_time: "10:00 am", end_time: "10:40 am" },
      status: "completed",
    },
    {
      id: 39,
      user: { image: "/banner.png", name: "David Sanchez" },
      date: "Fri, 5th June, 2026",
      scheduled_time: { start_time: "11:00 am", end_time: "11:40 am" },
      status: "completed",
    },
    {
      id: 40,
      user: { image: "/banner.png", name: "Natalie Morris" },
      date: "Fri, 5th June, 2026",
      scheduled_time: { start_time: "12:00 pm", end_time: "12:40 pm" },
      status: "cancelled",
    },
    {
      id: 41,
      user: { image: "/banner.png", name: "Christopher Rogers" },
      date: "Sat, 6th June, 2026",
      scheduled_time: { start_time: "1:00 pm", end_time: "1:40 pm" },
      status: "completed",
    },
    {
      id: 42,
      user: { image: "/banner.png", name: "Victoria Reed" },
      date: "Sat, 6th June, 2026",
      scheduled_time: { start_time: "2:00 pm", end_time: "2:40 pm" },
      status: "completed",
    },
    {
      id: 43,
      user: { image: "/banner.png", name: "Andrew Cook" },
      date: "Sun, 7th June, 2026",
      scheduled_time: { start_time: "9:00 am", end_time: "9:40 am" },
      status: "completed",
    },
    {
      id: 44,
      user: { image: "/banner.png", name: "Samantha Morgan" },
      date: "Sun, 7th June, 2026",
      scheduled_time: { start_time: "10:00 am", end_time: "10:40 am" },
      status: "completed",
    },
    {
      id: 45,
      user: { image: "/banner.png", name: "Joseph Bell" },
      date: "Sun, 7th June, 2026",
      scheduled_time: { start_time: "11:00 am", end_time: "11:40 am" },
      status: "completed",
    },
  ],
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
              <Link href="./schedules/view-schedule">
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
      <div key={item.id} className="shadow shadow-gray-300 rounded-xl p-4 bg-white space-y-3">
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

        <Link href="./schedules/view-schedule">
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
  const data = schedules_data[type];
  const { totalPages, paginatedData, startItem, endItem } = usePagination(
    data,
    page,
  );

  return (
    <div className="flex flex-col gap-5">
      <ScheduleTable data={paginatedData} />
      <ScheduleCards data={paginatedData} />

      {data.length > ITEMS_PER_PAGE && (
        <Pagination
          page={page}
          setPage={setPage}
          totalPages={totalPages}
          startItem={startItem}
          endItem={endItem}
          total={data.length}
        />
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
  );
}
