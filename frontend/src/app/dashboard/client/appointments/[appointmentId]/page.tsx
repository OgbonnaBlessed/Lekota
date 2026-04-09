"use client";

import Animate from "@/components/layout/Animate";
import { Button } from "@/components/ui/button";
import AppointmentDetailsSkeleton from "@/components/ui/skeleton/AppointmentDetailsSkeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  useAddSessionNoteMutation,
  useCancelAppointmentMutation,
  useGetSingleAppointmentQuery,
  useRateAppointmentMutation,
} from "@/redux/api/appointment.api";
import { formatFullDate } from "@/utils/format-date";
import { ArrowLeft, StarIcon } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Page = () => {
  const params = useSearchParams();
  const appointmentId = params.get("appointmentId");

  const { data, isLoading } = useGetSingleAppointmentQuery(appointmentId);
  const appointment = data?.appointment || [];
  console.log("Appointment data:", appointment);
  const router = useRouter();

  const [cancelAppointment] = useCancelAppointmentMutation();
  const [rateAppointment] = useRateAppointmentMutation();
  const [addSessionNote] = useAddSessionNoteMutation();

  const [showSkeleton, setShowSkeleton] = useState<boolean>(true);
  const [rating, setRating] = useState<number>(0);
  const [showCancelBox, setShowCancelBox] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [note, setNote] = useState<string>("");
  const [remarks, setRemarks] = useState<string>("");

  const cancel = async () => {
    if (!cancelReason) return toast.error("Please enter a cancel reason");

    try {
      await cancelAppointment({
        id: appointment._id,
        reason: cancelReason,
      }).unwrap();

      router.push("/dashboard/client/appointments");
    } catch {}
  };

  const rate = async () => {
    if (!rating) return toast.error("Please select a rating");

    try {
      await rateAppointment({
        id: appointment._id,
        rating,
        remarks,
      }).unwrap();

      toast.success("Rating submitted");

      router.replace("/dashboard/client/appointments");
    } catch {}
  };

  const addNote = async () => {
    if (!note) return toast.error("Enter a note");

    await addSessionNote({
      id: appointment._id,
      note,
    }).unwrap();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading || showSkeleton) return <AppointmentDetailsSkeleton />;

  return (
    <Animate>
      <div className="w-full flex flex-col gap-5">
        <Link href="../appointments">
          <div className="flex items-center gap-1 text-xs text-[#2D36E0]">
            <ArrowLeft size={12} />
            <p>Back to appointments</p>
          </div>
        </Link>

        <h1 className="text-xl md:text-3xl font-medium">
          {appointment?.staff?.name}
        </h1>

        <div className="flex flex-col gap-1">
          <h3>Time</h3>
          <div className="flex flex-col text-sm">
            <p>{formatFullDate(appointment?.date)}</p>
            <p className="text-xs text-gray-500">
              {appointment?.startTime} - {appointment?.endTime} (UTC +00:00)
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <h3>Meeting Link</h3>
          <p className="text-sm text-[#2D36E0] cursor-pointer">
            {appointment?.meetingLink || "N/A"}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <h3>Mode</h3>
          <p className="text-sm capitalize">{appointment?.type}</p>
        </div>

        <div className="flex flex-col gap-1">
          <h3>Duration</h3>
          <p className="text-sm">
            {appointment?.duration} mins, {appointment?.buffer} mins buffer
          </p>
        </div>

        {appointment?.status !== "completed" ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-5 text-sm">
              {/* Reschedule appointment */}
              <Link
                href={{
                  pathname: "../services/reschedule-appointment",
                  query: {
                    appointmentId: appointment?._id,
                    serviceId: appointment?.serviceId,
                    staffId: appointment?.staff?._id,
                  },
                }}
              >
                <p className="text-[#2D36E0]">Reschedule</p>
              </Link>

              {/* Cancel appointment */}
              <p
                onClick={() => setShowCancelBox(true)}
                className="text-red-500 cursor-pointer"
              >
                Cancel
              </p>
            </div>

            {showCancelBox && (
              <div className="max-w-full border border-gray-200 rounded-lg overflow-hidden mt-4">
                <div className="text-gray-500 bg-gray-200 p-4 text-sm">
                  Cancel Reason
                </div>

                <div className="relative p-3 flex flex-col gap-2">
                  <Textarea
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="Enter reason..."
                    className="min-h-32 border-none resize-none outline-none focus:ring-0 focus-visible:ring-0"
                  />

                  <Button
                    onClick={cancel}
                    className="absolute right-4 bottom-4 w-fit self-end text-xs! rounded-sm bg-[#2D36E0] p-4"
                  >
                    Save
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Rate appointment */}
            <div className="w-fit flex items-center gap-4 bg-gray-200 text-gray-500 p-5 rounded-lg">
              <p className="text-sm">Rate</p>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    onClick={() => setRating(star)}
                    className={`cursor-pointer ${
                      star <= rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <div className="relative flex flex-col justify-between px-2.5 py-2">
                <Textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Add remark..."
                  className="min-h-20 border-none resize-none outline-none focus:ring-0 focus-visible:ring-0"
                />
                <Button
                  onClick={rate}
                  className="absolute right-4 bottom-4 w-fit self-end text-xs! rounded-sm bg-[#2D36E0] p-4"
                >
                  Save
                </Button>
              </div>
            </div>

            {/* Add session notes */}
            <div className="max-w-full border border-gray-200 rounded-lg overflow-hidden">
              <div className="text-sm text-gray-500 bg-gray-200 p-4">
                Session remark (optional)
              </div>
              <div className="relative flex flex-col justify-between px-2.5 py-2">
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add Session notes..."
                  className="min-h-52 border-none resize-none outline-none focus:ring-0 focus-visible:ring-0"
                />
                <Button
                  onClick={addNote}
                  className="absolute right-4 bottom-4 w-fit self-end text-xs! rounded-sm bg-[#2D36E0] p-4"
                >
                  Save
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </Animate>
  );
};

export default Page;
