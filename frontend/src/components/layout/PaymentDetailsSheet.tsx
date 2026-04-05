"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ArrowDownToLineIcon, Banknote, Link } from "lucide-react";

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

type Props = {
  payment: Payment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const PaymentDetailsSheet = ({ payment, open, onOpenChange }: Props) => {
  if (payment === null) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-100 sm:w-125 outline-0">
        <SheetHeader>
          <SheetTitle className="text-xl!">Payment Details</SheetTitle>
          <p className="text-muted-foreground text-xs md:text-sm">
            Access all your payment and download details
          </p>
        </SheetHeader>

        <div className="flex flex-col gap-8 p-5 mt-6 text-sm">
          <div className="w-full flex gap-5">
            <div className="flex flex-col gap-5 shadow shadow-[#ABABAB] rounded-lg p-2 md:p-5 w-1/2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link size={18} />
                <p>Invoice</p>
              </div>
              <p className="text-lg">{payment.reference}</p>
            </div>
            <div className="flex flex-col gap-5 shadow shadow-[#ABABAB] rounded-lg p-2 md:p-5 w-1/2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Banknote size={18} />
                <p>Amount</p>
              </div>
              <p className="text-lg">N{payment.amount}</p>
            </div>
          </div>

          <div className="flex flex-col gap-5 shadow shadow-[#ABABAB] rounded-lg p-5">
            <h2 className="text-lg">Invoice Details</h2>

            <tbody className="w-full text-sm">
              <tr className="w-full flex max-md:flex-col items-start gap-1 py-2">
                <td className="md:w-2/5 text-muted-foreground font-medium">
                  Billed to:
                </td>
                <td className="md:w-3/5">{payment.billedTo}</td>
              </tr>
              <tr className="w-full flex max-md:flex-col items-start gap-1 py-2">
                <td className="md:w-2/5 text-muted-foreground font-medium text-nowrap">
                  Billed Details:
                </td>
                <td className="md:w-3/5">{payment.billedDetails}</td>
              </tr>
              <tr className="w-full flex max-md:flex-col items-start gap-1 py-2">
                <td className="md:w-2/5 text-muted-foreground font-medium">Currency:</td>
                <td className="md:w-3/5">{payment.currency}</td>
              </tr>
              <tr className="w-full flex max-md:flex-col items-start gap-1 py-2">
                <td className="md:w-2/5 text-muted-foreground font-medium">Date:</td>
                <td className="md:w-3/5">{payment.paidAt}</td>
              </tr>
            </tbody>
          </div>

          <div className="flex items-center gap-2 text-xs -mt-4 cursor-pointer text-[#2D36E0]">
            <ArrowDownToLineIcon size={14} />
            <p>Download Payment Details</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default PaymentDetailsSheet;
