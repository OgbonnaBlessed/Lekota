/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMemo, useState, useEffect, useRef } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CreateTenantModal from "@/components/layout/CreateTenantModal";
import TenantDetailsSheet from "@/components/layout/TenantDetailsSheet";
import { MoreHorizontal, Plus } from "lucide-react";
import { useGetTenantsQuery } from "@/redux/api/admin.api";
import TenantSkeleton from "@/components/ui/skeleton/TenantSkeleton";
import { toast } from "sonner";

type Tenant = {
  id: string;
  name: string;
  organization: string;
  createdAt: string;
  status: string;
  subscription: string;
};

const ITEMS_PER_PAGE = 10;

const Page = () => {
  const { data, isLoading } = useGetTenantsQuery();
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showSkeleton, setShowSkeleton] = useState<boolean>(true);
  const hasShownFetchToast = useRef(false);

  const tenants =
    data?.tenants?.map((t: any) => ({
      id: t._id,
      name: t.name,
      organization: t.organization,
      createdAt: new Date(t.createdAt).toLocaleDateString(),
      status: t.status,
      subscription: t.subscription?.status,
    })) || [];

  const totalPages = Math.max(1, Math.ceil(tenants.length / ITEMS_PER_PAGE));

  const paginatedTenants = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return tenants.slice(start, start + ITEMS_PER_PAGE);
  }, [currentPage, tenants]);

  const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, tenants.length);

  useEffect(() => {
    setCurrentPage(1);
  }, [tenants.length]);

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
    return <TenantSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-end w-full">
        <div
          onClick={() => setShow((prev) => !prev)}
          className="flex items-center gap-2 bg-[#2D36E0] text-sm text-white p-3 rounded-none cursor-pointer"
        >
          <Plus size={18} />
          <span>Create new tenant</span>
        </div>
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      {tenants.length > 0 ? (
        <>
          <div className="hidden md:block border rounded-xl bg-white overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-100">
                <TableRow>
                  <TableHead className="p-5">Tenant</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Date Created</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Subscription</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedTenants.map((tenant: Tenant) => (
                  <TableRow key={tenant.id}>
                    <TableCell className="font-medium p-5">
                      {tenant.name}
                    </TableCell>
                    <TableCell>{tenant.organization}</TableCell>
                    <TableCell>{tenant.createdAt}</TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            tenant.status === "active"
                              ? "bg-green-500"
                              : tenant.status === "suspended"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                        />
                        <p className="capitalize">{tenant.status}</p>
                      </div>
                    </TableCell>

                    <TableCell>{tenant.subscription}</TableCell>

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
                              setSelectedTenant(tenant);
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
            {paginatedTenants.map((tenant: Tenant) => (
              <div
                key={tenant.id}
                className="border rounded-xl p-4 bg-white space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{tenant.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {tenant.organization}
                    </p>
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
                          setSelectedTenant(tenant);
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
                    {tenant.createdAt}
                  </p>

                  <p className="flex items-center gap-2">
                    <span className="font-medium">Status:</span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        tenant.status === "active"
                          ? "bg-green-500"
                          : tenant.status === "suspended"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                    />
                    <span className="capitalize">{tenant.status}</span>
                  </p>

                  <p>
                    <span className="font-medium">Subscription:</span>{" "}
                    {tenant.subscription}
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
      {tenants.length > ITEMS_PER_PAGE && (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Showing {startItem} - {endItem} of {tenants.length}
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
      <TenantDetailsSheet
        tenant={selectedTenant}
        open={open}
        onOpenChange={setOpen}
      />

      <CreateTenantModal open={show} onOpenChange={setShow} />
    </div>
  );
};

export default Page;
