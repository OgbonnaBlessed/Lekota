/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Animate from "@/components/layout/Animate";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AppointmentDetailsSkeleton from "@/components/ui/skeleton/AppointmentDetailsSkeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  useGetSingleScheduleQuery,
  useUpdateScheduleStatusMutation,
} from "@/redux/api/staff.api";
import { formatFullDate } from "@/utils/format-date";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Page = () => {
  const params = useParams();
  const scheduleId = params?.scheduleId as string;

  const { data, isLoading } = useGetSingleScheduleQuery(scheduleId, {
    skip: !scheduleId,
  });
  const schedule = data?.schedule;
  const router = useRouter();

  const [updateScheduleStatus] = useUpdateScheduleStatusMutation();

  const [showSkeleton, setShowSkeleton] = useState<boolean>(true);
  const [note, setNote] = useState<string>("");
  const [scheduleStatus, setScheduleStatus] = useState<string>(
    schedule?.status,
  );

  const handleSubmit = async () => {
    if (!note) return toast.error("Enter a note");
    if (!scheduleStatus) return toast.error("Select a status for the schedule");

    await updateScheduleStatus({
      id: schedule._id,
      status: scheduleStatus,
      sessionNotes: note,
    }).unwrap();
    router.replace("/dashboard/staff/schedules");
  };

  useEffect(() => {
    if (schedule?.status || schedule?.myNote) {
      setScheduleStatus(schedule?.status);
      setNote(schedule?.myNote);
    }
  }, [schedule?.status, schedule?.myNote]);

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
        <Link href="./">
          <div className="flex items-center gap-1 text-xs text-[#2D36E0]">
            <ArrowLeft size={12} />
            <p>Back to schedules</p>
          </div>
        </Link>

        <h1 className="text-xl md:text-3xl font-medium">
          {schedule?.staff?.name}
        </h1>

        <div className="flex flex-col gap-1">
          <h3>Time</h3>
          <div className="flex flex-col text-sm">
            <p>{formatFullDate(schedule?.date)}</p>
            <p className="text-xs text-gray-500">
              {schedule?.startTime} - {schedule?.endTime} (UTC +00:00)
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <h3>Meeting Link</h3>
          <p className="text-sm text-[#2D36E0] cursor-pointer">
            {schedule?.meetingLink || "N/A"}
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <h3>Mode</h3>
          <p className="text-sm capitalize">
            {schedule?.type === "onsite" ? "Physical meeting" : "Virtual"}
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <h3>Duration</h3>
          <p className="text-sm">
            {schedule?.duration} mins, {schedule?.buffer} mins buffer
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <h3>Status</h3>

          <div className="flex items-center gap-2">
            <span
              className={`w-2 aspect-square rounded-full ${scheduleStatus === "completed" ? "bg-green-500" : scheduleStatus === "pending" ? "bg-yellow-500" : "bg-red-500"}`}
            />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="capitalize cursor-pointer">
                  {scheduleStatus}
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => {
                    setScheduleStatus("pending");
                  }}
                >
                  Pending
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setScheduleStatus("absent")}>
                  Absent
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setScheduleStatus("completed")}
                >
                  Completed
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="w-full md:w-md flex flex-col gap-1">
          <h3>Reason</h3>
          <p className="text-sm bg-gray-100 rounded-lg p-5">
            {schedule.reason}
          </p>
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
              onClick={handleSubmit}
              className="absolute right-4 bottom-4 w-fit self-end text-xs! rounded-sm bg-[#2D36E0] p-4"
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </Animate>
  );
};

export default Page;
