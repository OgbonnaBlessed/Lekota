/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useMemo, useState } from "react";

import { useGetAppointmentsQuery } from "@/redux/api/appointment.api";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import AppointmentsSkeleton from "@/components/ui/skeleton/AppointmentsSkeleton";

type User = {
  image: string;
  name: string;
  service: string;
};

type Scheduled_Time = {
  start_time: string;
  end_time: string;
};

type Appointment = {
  id: string;
  user: User;
  date: string;
  selected_time: Scheduled_Time;
  status: string;
};

const ITEMS_PER_PAGE = 10;

const Page = () => {
  const { data, isLoading } = useGetAppointmentsQuery({});
  const appointments = data?.appoinments || [];

  const [currentPage, setCurrentPage] = useState(1);
  const [showSkeleton, setShowSkeleton] = useState<boolean>(true);

  const totalPages = Math.max(
    1,
    Math.ceil(appointments.length / ITEMS_PER_PAGE),
  );

  const paginatedAppointments = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return appointments.slice(start, start + ITEMS_PER_PAGE);
  }, [appointments, currentPage]);

  const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, appointments.length);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading || showSkeleton) return <AppointmentsSkeleton />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-end w-full">
        <Link href="./services">
          <div className="flex items-center gap-2 bg-[#2D36E0] text-sm text-white p-3 rounded-none cursor-pointer">
            <Plus size={18} />
            <span>Create appointment</span>
          </div>
        </Link>
      </div>

      {appointments.length > 0 ? (
        <>
          {/* ================= DESKTOP TABLE ================= */}
          <div className="hidden md:block border rounded-xl bg-white overflow-x-auto">
            <Table>
              <TableHeader className="w-full bg-gray-100">
                <TableRow>
                  <TableHead className="p-5">Appointment(s)</TableHead>
                  <TableHead></TableHead>
                  <TableHead></TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedAppointments.map((appointment: any) => (
                  <TableRow key={appointment.id}>
                    <TableCell className="font-medium p-5">
                      <div className="flex items-center gap-2">
                        <div className="relative w-8 aspect-square rounded-full overflow-hidden">
                          <Image
                            src={appointment?.user.image}
                            alt={appointment?.user.name}
                            fill
                            className="object-cover"
                            priority
                          />
                        </div>
                        <div>
                          <p>{appointment?.user.name}</p>
                          <p className="text-gray-500">
                            {appointment?.user.service}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{appointment.date}</p>
                        <p className="text-xs text-gray-500">
                          {appointment.selected_time.start_time} —{" "}
                          {appointment.selected_time.end_time}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            appointment.status === "completed"
                              ? "bg-green-500"
                              : "bg-gray-400"
                          }`}
                        />
                        <p className="capitalize">{appointment.status}</p>
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      <Link href={`./appointments/${appointment.id}`}>
                        <p className="text-[#2D36E0]">View appointment</p>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* ================= MOBILE CARDS ================= */}
          <div className="md:hidden space-y-4">
            {paginatedAppointments.map((appointment: any) => (
              <div
                key={appointment.id}
                className="border rounded-xl p-4 bg-white space-y-3"
              >
                <div className="flex items-center gap-2">
                  <div className="relative w-8 aspect-square rounded-full overflow-hidden">
                    <Image
                      src={appointment?.user.image}
                      alt={appointment?.user.name}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                  <div>
                    <p>{appointment?.user.name}</p>
                    <p className="text-gray-500">{appointment?.user.service}</p>
                  </div>
                </div>

                <div className="text-sm space-y-1">
                  <div>
                    <span className="font-medium">Date:</span>
                    <div>
                      <p className="font-medium">{appointment.date}</p>
                      <p className="text-xs text-gray-500">
                        {appointment.selected_time.start_time} —{" "}
                        {appointment.selected_time.end_time}
                      </p>
                    </div>
                  </div>

                  <p className="flex items-center gap-2">
                    <span className="font-medium">Status:</span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        appointment.status === "completed"
                          ? "bg-green-500"
                          : "bg-gray-400"
                      }`}
                    />
                    <span className="capitalize">{appointment.status}</span>
                  </p>

                  <Link href={`./appointments/${appointment.id}`}>
                    <p className="text-[#2D36E0]">View appointment</p>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="w-full min-h-52 flex items-center justify-center text-sm text-gray-500">
          <p>You currently have no appointment</p>
        </div>
      )}

      {/* Pagination */}
      {appointments.length > ITEMS_PER_PAGE && (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Showing {startItem} - {endItem} of {appointments.length}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 text-sm rounded-md border cursor-pointer ${
                    currentPage === page
                      ? "bg-[#2D36E0] text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
