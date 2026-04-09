/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/lib/toast";
import { useLazyVerifyPaymentQuery } from "@/redux/api/tenant.api";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type Status = "loading" | "success" | "error";

export default function PaymentSuccess() {
  const params = useSearchParams();
  const router = useRouter();
  const [verifyPayment] = useLazyVerifyPaymentQuery();

  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState<string>("Verifying payment...");

  useEffect(() => {
    const reference = params.get("reference");

    if (!reference) {
      setStatus("error");
      setMessage("Missing payment reference");
      return;
    }

    const verify = async () => {
      try {
        const res = await verifyPayment(reference).unwrap();

        setStatus("success");
        setMessage(res.message);

        setTimeout(() => {
          router.replace("/dashboard/tenant/payment-history");
        }, 2500);
      } catch (err: any) {
        const message = err?.data?.message || "Verification failed";

        setStatus("error");
        setMessage(message);

        toast.error(message);
      }
    };

    verify();
  }, [params, router, verifyPayment]);

  const handleRetry = () => {
    router.refresh();
  };

  return (
    <div className="flex items-center justify-center min-h-full px-4">
      <div className="bg-gray-100 w-full max-w-md p-8 rounded-2xl shadow-sm text-center space-y-6">
        {/* ICON */}
        <div className="flex justify-center">
          {status === "loading" && (
            <Loader2 className="animate-spin text-[#2D36E0]" size={40} />
          )}

          {status === "success" && (
            <CheckCircle className="text-green-500" size={48} />
          )}

          {status === "error" && <XCircle className="text-red-500" size={48} />}
        </div>

        {/* TITLE */}
        <h2 className="text-xl font-semibold">
          {status === "loading" && "Processing Payment"}
          {status === "success" && "Payment Successful 🎉"}
          {status === "error" && "Payment Failed"}
        </h2>

        {/* MESSAGE */}
        <p className="text-sm text-gray-500">{message}</p>

        {/* ACTION */}
        {status === "success" && (
          <p className="text-xs text-gray-400">Redirecting to dashboard...</p>
        )}

        {status === "error" && (
          <Button
            onClick={handleRetry}
            className="w-full text-sm bg-[#2D36E0] text-white py-6 rounded-lg hover:opacity-90 transition"
          >
            Retry Verification
          </Button>
        )}
      </div>
    </div>
  );
}
