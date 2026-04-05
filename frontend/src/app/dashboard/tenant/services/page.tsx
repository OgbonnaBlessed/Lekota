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
import { useEffect, useMemo, useRef, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import CreateServiceModal from "@/components/layout/CreateServiceModal";
import ServiceDetailsSheet from "@/components/layout/ServiceDetailsSheet";
import ServicesSkeleton from "@/components/ui/skeleton/ServicesSkeleton";
import formatDate from "@/lib/format-date";
import { useGetServicesQuery } from "@/redux/api/tenant.api";
import { MoreHorizontal, Plus } from "lucide-react";
import { toast } from "sonner";

type Service = {
  id: string;
  name: string;
  subService: string[];
  createdAt: string;
  status: string;
};

const ITEMS_PER_PAGE = 10;

const Page = () => {
  const { data, isLoading } = useGetServicesQuery({});
  const services = data?.services || [];

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showSkeleton, setShowSkeleton] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const hasShownFetchToast = useRef(false);

  const totalPages = Math.max(1, Math.ceil(services.length / ITEMS_PER_PAGE));

  const paginatedServices = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return services.slice(start, start + ITEMS_PER_PAGE);
  }, [currentPage, services]);

  const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, services.length);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (data?.message && !isLoading && !hasShownFetchToast.current) {
      toast.success(data.message);
      hasShownFetchToast.current = true;
    }
  }, [data, isLoading]);

  if (isLoading || showSkeleton) {
    return <ServicesSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-end w-full">
        <div
          onClick={() => setShow((prev) => !prev)}
          className="flex items-center gap-2 bg-[#2D36E0] text-sm text-white p-3 cursor-pointer"
        >
          <Plus size={18} />
          <span>Create new service</span>
        </div>
      </div>

      {services.length > 0 ? (
        <>
          {/* ================= DESKTOP TABLE ================= */}
          <div className="hidden md:block border rounded-xl bg-white overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-100">
                <TableRow>
                  <TableHead className="p-5">Service</TableHead>
                  <TableHead>Date Created</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedServices.map((service: any) => (
                  <TableRow key={service._id}>
                    <TableCell className="font-medium p-5">
                      {service.name}
                    </TableCell>
                    <TableCell>{formatDate(service.createdAt)}</TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            service.status === "active"
                              ? "bg-green-500"
                              : service.status === "suspended"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                        />

                        <span className="capitalize">{service.status}</span>
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-2 hover:bg-gray-100 rounded-md">
                            <MoreHorizontal size={16} />
                          </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedService(service);
                              setOpen(true);
                            }}
                          >
                            View Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* ================= MOBILE CARDS ================= */}
          <div className="md:hidden space-y-4">
            {paginatedServices.map((service: any) => (
              <div
                key={service._id}
                className="shadow shadow-gray-300 rounded-xl p-4 bg-white space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{service.name}</p>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2 hover:bg-gray-100 rounded-md">
                        <MoreHorizontal size={16} />
                      </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedService(service);
                          setOpen(true);
                        }}
                      >
                        View Details
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="text-sm space-y-1">
                  <p>
                    <span className="font-medium">Date:</span>{" "}
                    {formatDate(service.createdAt)}
                  </p>

                  <p className="flex items-center gap-2">
                    <span className="font-medium">Status:</span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        service.status === "active"
                          ? "bg-green-500"
                          : service.status === "suspended"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                    />
                    <span className="capitalize">{service.status}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="w-full min-h-52 flex items-center justify-center text-sm text-gray-500">
          <p>You currently have no tenant</p>
        </div>
      )}

      {/* Pagination */}
      {services.length > ITEMS_PER_PAGE && (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Showing {startItem} - {endItem} of {services.length}
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

      {/* Overlay */}
      <ServiceDetailsSheet
        service={selectedService}
        open={open}
        onOpenChange={setOpen}
      />

      <CreateServiceModal open={show} onOpenChange={setShow} />
    </div>
  );
};

export default Page;
