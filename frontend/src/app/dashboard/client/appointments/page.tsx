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

import AppointmentsSkeleton from "@/components/ui/skeleton/AppointmentsSkeleton";
import {
  useDeleteAppointmentMutation,
  useGetAppointmentsQuery,
} from "@/redux/api/appointment.api";
import { formatFullDate } from "@/utils/format-date";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Modal from "@/components/ui/modal";
import Animate from "@/components/layout/Animate";

const ITEMS_PER_PAGE = 10;

const Page = () => {
  const { data, isLoading } = useGetAppointmentsQuery({});
  const appointments = data?.appointments || [];

  const [deleteAppointment] = useDeleteAppointmentMutation();

  const [currentPage, setCurrentPage] = useState(1);
  const [showSkeleton, setShowSkeleton] = useState<boolean>(true);
  const [show, setShow] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>("");

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

  const removeAppointment = async (id: string) => {
    try {
      await deleteAppointment(id).unwrap();
    } catch {}
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading || showSkeleton) return <AppointmentsSkeleton />;

  return (
    <>
      <Animate>
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
                      <TableRow key={appointment._id}>
                        <TableCell className="font-medium p-5">
                          <div className="flex items-start gap-2">
                            <div className="relative w-10 aspect-square rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                              {appointment?.staff?.image ? (
                                <Image
                                  src={appointment?.staff?.image}
                                  alt={appointment?.staff?.name}
                                  fill
                                  className="object-cover"
                                  priority
                                />
                              ) : (
                                <span className="text-sm font-semibold text-gray-600">
                                  {appointment?.staff?.name
                                    ?.charAt(0)
                                    ?.toUpperCase()}
                                </span>
                              )}
                            </div>
                            <div>
                              <p>{appointment?.staff?.name}</p>
                              <p className="text-gray-500">
                                {appointment?.service} •{" "}
                                {appointment?.subService}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {formatFullDate(appointment.date)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {appointment?.startTime} — {appointment?.endTime}
                            </p>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                appointment.status === "completed"
                                  ? "bg-green-500"
                                  : appointment.status === "pending"
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                              }`}
                            />
                            <p className="capitalize">{appointment.status}</p>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center justify-center">
                            {appointment?.status === "cancelled" ||
                            appointment?.status === "absent" ? (
                              <div
                                onClick={() => {
                                  setShow(true);
                                  setSelectedId(appointment?._id);
                                }}
                                className="text-red-500 cursor-pointer"
                              >
                                Delete
                              </div>
                            ) : (
                              <Link
                                href={{
                                  pathname: `./appointments/${appointment._id}`,
                                  query: { appointmentId: appointment._id },
                                }}
                              >
                                <p className="text-[#2D36E0]">
                                  View appointment
                                </p>
                              </Link>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* ================= MOBILE CARDS ================= */}
              <div className="md:hidden space-y-4 text-sm">
                {paginatedAppointments.map((appointment: any) => (
                  <div
                    key={appointment._id}
                    className="flex flex-col gap-3 shadow shadow-gray-300 rounded-xl p-4 bg-white"
                  >
                    <div className="flex items-start gap-2">
                      <div className="relative w-10 aspect-square rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                        {appointment?.staff?.image ? (
                          <Image
                            src={appointment?.staff?.image}
                            alt={appointment?.staff?.name}
                            fill
                            className="object-cover"
                            priority
                          />
                        ) : (
                          <span className="text-sm font-semibold text-gray-600">
                            {appointment?.staff?.name?.charAt(0)?.toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="text-sm">
                        <p>{appointment?.staff?.name}</p>
                        <p className="text-gray-500 -mt-1">
                          {appointment?.service} • {appointment?.subService}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="font-medium">Date:</span>
                      <div>
                        <p className="font-medium">
                          {formatFullDate(appointment.date)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {appointment?.startTime} — {appointment?.endTime}
                        </p>
                      </div>
                    </div>
                    <p className="flex items-center gap-2">
                      <span className="font-medium">Status:</span>
                      <span
                        className={`w-2 h-2 rounded-full ${
                          appointment.status === "completed"
                            ? "bg-green-500"
                            : appointment.status === "pending"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                      />
                      <span className="capitalize">{appointment?.status}</span>
                    </p>
                    <Link
                      href={{
                        pathname: `./appointments/${appointment._id}`,
                        query: { appointmentId: appointment._id },
                      }}
                    >
                      <p className="text-[#2D36E0]">View appointment</p>
                    </Link>
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
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </Animate>

      <Modal
        header="Are you sure you want to delete the appointment?"
        body={
          <div className="flex items-center justify-between gap-8 text-white text-sm">
            <p
              onClick={() => setShow(false)}
              className="bg-[#2D36E0] p-3 rounded-lg cursor-pointer"
            >
              No, leave
            </p>
            <p
              onClick={() => {
                setShow(false);
                removeAppointment(selectedId);
              }}
              className={`bg-[#ED301F] p-3 rounded-lg cursor-pointer`}
            >
              Yes delete
            </p>
          </div>
        }
        visible={show}
        onClose={() => setShow(false)}
      />
    </>
  );
};

export default Page;
