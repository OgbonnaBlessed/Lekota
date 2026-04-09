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
import { useEffect, useMemo, useRef, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Animate from "@/components/layout/Animate";
import CreateUserModal from "@/components/layout/CreateUserModal";
import UserDetailsheet from "@/components/layout/UserDetailsSheet";
import UsersSkeleton from "@/components/ui/skeleton/UsersSkeleton";
import { useGetUsersQuery } from "@/redux/api/tenant.api";
import formatDate from "@/utils/format-date";
import { MoreHorizontal, Plus } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

type User = {
  id: string;
  image: string;
  name: string;
  role: string;
  createdAt: string;
  status: string;
};

const ITEMS_PER_PAGE = 10;

const Page = () => {
  const { data, isLoading } = useGetUsersQuery({});
  const users = useMemo(() => {
    return (data?.users || []).filter(
      (user: any) => user.role !== "tenant_admin",
    );
  }, [data]);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showSkeleton, setShowSkeleton] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const hasShownFetchToast = useRef(false);

  const totalPages = Math.max(1, Math.ceil(users.length / ITEMS_PER_PAGE));

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return users.slice(start, start + ITEMS_PER_PAGE);
  }, [currentPage, users]);

  const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, users.length);

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
    return <UsersSkeleton />;
  }

  return (
    <Animate>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-end w-full">
          <div
            onClick={() => setShow((prev) => !prev)}
            className="flex items-center gap-2 bg-[#2D36E0] text-sm text-white p-3 rounded-none cursor-pointer"
          >
            <Plus size={18} />
            <span>Create new user</span>
          </div>
        </div>

        {users.length > 0 ? (
          <>
            {/* ================= DESKTOP TABLE ================= */}
            <div className="hidden md:block border rounded-xl bg-white overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-100">
                  <TableRow>
                    <TableHead className="p-5">User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Date Created</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {paginatedUsers.map((user: any) => (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium p-5">
                        <div className="flex items-center gap-2">
                          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                            {user.profile?.image ? (
                              <Image
                                src={user.profile.image}
                                alt={user.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <span className="text-sm font-semibold text-gray-600">
                                {user.name?.charAt(0)?.toUpperCase()}
                              </span>
                            )}
                          </div>
                          <p>{user.name}</p>
                        </div>
                      </TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              user.status === "active"
                                ? "bg-green-500"
                                : user.status === "suspended"
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }`}
                          />
                          <p className="capitalize">{user.status}</p>
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
                                setSelectedUser(user);
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
              {paginatedUsers.map((user: any) => (
                <div
                  key={user._id}
                  className="shadow shadow-gray-300 rounded-xl p-4 bg-white space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2 font-semibold">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                        {user.profile?.image ? (
                          <Image
                            src={user.profile.image}
                            alt={user.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <span className="text-sm font-semibold text-gray-600">
                            {user.name?.charAt(0)?.toUpperCase()}
                          </span>
                        )}
                      </div>
                      <p>{user.name}</p>
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
                            setSelectedUser(user);
                            setOpen(true);
                          }}
                          className="cursor-pointer"
                        >
                          View Details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="text-sm space-y-1">
                    <div>
                      <span className="font-medium">Role:</span> {user.role}
                    </div>
                    <p>
                      <span className="font-medium">Date:</span>{" "}
                      {formatDate(user.createdAt)}
                    </p>

                    <p className="flex items-center gap-2">
                      <span className="font-medium">Status:</span>
                      <span
                        className={`w-2 h-2 rounded-full ${
                          user.status === "active"
                            ? "bg-green-500"
                            : user.status === "suspended"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                      />
                      <span className="capitalize">{user.status}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="w-full min-h-52 flex items-center justify-center text-sm text-gray-500">
            <p>You currently have no user</p>
          </div>
        )}

        {/* Pagination */}
        {users.length > ITEMS_PER_PAGE && (
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              Showing {startItem} - {endItem} of {users.length}
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

        {/* Overlay */}
        <UserDetailsheet
          user={selectedUser}
          open={open}
          onOpenChange={setOpen}
        />

        <CreateUserModal open={show} onOpenChange={setShow} />
      </div>
    </Animate>
  );
};

export default Page;
