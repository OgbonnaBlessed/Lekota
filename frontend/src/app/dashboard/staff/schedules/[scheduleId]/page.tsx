"use client";

import { useParams } from "next/navigation";
import { useGetSingleScheduleQuery } from "@/redux/api/staff.api";
import ScheduleDetailsSkeleton from "@/components/ui/skeleton/ViewScheduleSkeleton";

const Page = () => {
  const { scheduleId } = useParams();
  const { data, isLoading } = useGetSingleScheduleQuery(scheduleId);

  if (isLoading) return <ScheduleDetailsSkeleton />;

  const s = data;

  return (
    <div>
      <h1>{s?.client?.name}</h1>

      <p>{new Date(s?.date).toDateString()}</p>
      <p>
        {s?.startTime} - {s?.endTime}
      </p>

      <p>Status: {s?.status}</p>
      <p>Reason: {s?.reason}</p>
      <p>Notes: {s?.sessionNotes || "None"}</p>
    </div>
  );
};

export default Page;
