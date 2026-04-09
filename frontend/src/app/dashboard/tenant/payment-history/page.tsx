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

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Animate from "@/components/layout/Animate";
import CreateUserModal from "@/components/layout/CreateUserModal";
import PaymentDetailsSheet from "@/components/layout/PaymentDetailsSheet";
import PaymentsSkeleton from "@/components/ui/skeleton/PaymentsSkeleton";
import { useGetPaymentsQuery } from "@/redux/api/tenant.api";
import formatDate from "@/utils/format-date";
import { MoreHorizontal } from "lucide-react";

type Payment = {
  _id: string;
  reference: string;
  amount: number;
  currency: string;
  billedTo: string;
  billedDetails: string;
  status: string;
  paidAt: string;
};

const ITEMS_PER_PAGE = 10;

const Page = () => {
  const { data, isLoading } = useGetPaymentsQuery("Payments");

  const payments = data?.payments || [];

  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showSkeleton, setShowSkeleton] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(payments.length / ITEMS_PER_PAGE));

  const paginatedPayments = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return payments.slice(start, start + ITEMS_PER_PAGE);
  }, [currentPage, payments]);

  const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, payments.length);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading || showSkeleton) {
    return <PaymentsSkeleton />;
  }

  return (
    <Animate>
      <div className="space-y-6">
        {payments.length > 0 ? (
          <>
            {/* ================= DESKTOP TABLE ================= */}
            <div className="hidden md:block border rounded-xl bg-white overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-100">
                  <TableRow>
                    <TableHead className="p-5">Reference</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment Date</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {paginatedPayments.map((payment: Payment) => (
                    <TableRow key={payment._id}>
                      <TableCell className="font-medium p-5">
                        {payment.reference}
                      </TableCell>
                      <TableCell>₦{payment.amount}</TableCell>
                      <TableCell>{formatDate(payment.paidAt)}</TableCell>

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
                                setSelectedPayment(payment);
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
              {paginatedPayments.map((payment: Payment) => (
                <div
                  key={payment._id}
                  className="text-sm shadow shadow-gray-300 rounded-xl p-4 bg-white space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div className="font-semibold">{payment.reference}</div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-2 hover:bg-gray-100 rounded-md">
                          <MoreHorizontal size={16} />
                        </button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedPayment(payment);
                            setOpen(true);
                          }}
                        >
                          View Details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="text-sm space-y-1">
                    <div>
                      <span className="font-medium">Amount:</span> ₦
                      {payment.amount}
                    </div>
                    <p>
                      <span className="font-medium">Date:</span>{" "}
                      {formatDate(payment.paidAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="w-full min-h-52 flex items-center justify-center text-sm text-gray-500">
            <p>You&apos;re yet to make any payment</p>
          </div>
        )}

        {/* Pagination */}
        {payments.length > ITEMS_PER_PAGE && (
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              Showing {startItem} - {endItem} of {payments.length}
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
        <PaymentDetailsSheet
          payment={selectedPayment}
          open={open}
          onOpenChange={setOpen}
        />

        <CreateUserModal open={show} onOpenChange={setShow} />
      </div>
    </Animate>
  );
};

export default Page;
