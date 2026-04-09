/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Animate from "@/components/layout/Animate";
import { Button } from "@/components/ui/button";
import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  useGetSingleAppointmentQuery,
  useRescheduleAppointmentMutation,
} from "@/redux/api/appointment.api";
import { useGetStaffAvailabilityQuery } from "@/redux/api/client.api";
import { useGetTenantServicesQuery } from "@/redux/api/staff.api";
import addMinutes from "@/utils/add-minutes";
import { TimePicker } from "antd";
import dayjs from "dayjs";
import { AlarmClock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
const { RangePicker } = TimePicker;

type Schedule = {
  start_time: string;
  end_time: string;
};

const Page = () => {
  const params = useSearchParams();
  const appointmentId = params.get("appointmentId");
  const serviceId = params.get("serviceId");
  const staffId = params.get("staffId");

  const { data: appointmentData } = useGetSingleAppointmentQuery(appointmentId);
  const existing = appointmentData?.appointment;

  const { data: servicesData } = useGetTenantServicesQuery({});
  const service = servicesData?.services?.find((s: any) => s._id === serviceId);

  const { data: availabilityData } = useGetStaffAvailabilityQuery(staffId);
  const availability = availabilityData || [];

  const router = useRouter();

  const [rescheduleAppointment] = useRescheduleAppointmentMutation();
  const [timeRange, setTimeRange] = useState<Schedule | null>(
    existing
      ? {
          start_time: existing.startTime,
          end_time: existing.endTime,
        }
      : null,
  );
  const [reason, setReason] = useState(existing?.reason || "");
  const [type, setType] = useState(existing?.type || "onsite");
  const [appointments, setAppointments] = useState<
    Record<string, [string, string][]>
  >({});
  const [date, setDate] = useState<Date | undefined>(
    existing?.date ? new Date(existing.date) : new Date(),
  );
  const availableDays = availability.map((a: any) => a.day);

  const selectedDay = date?.toLocaleDateString("en-US", {
    weekday: "short",
  });

  const dayAvailability = availability.find((a: any) => a.day === selectedDay);

  const duration = service?.schedules?.[0]?.duration;
  const buffer = service?.schedules?.[0]?.buffer;

  const handleSave = () => {
    if (!date) {
      toast.error("Please select a date");
      return;
    }

    if (!timeRange) {
      toast.error("Please select a time");
      return;
    }

    const key = date.toDateString();

    if (
      timeRange.start_time < dayAvailability.startTime ||
      timeRange.start_time > dayAvailability.endTime
    ) {
      toast.error("Outside staff availability");
      return;
    }

    // prevent multiple bookings same day
    if (appointments[key]?.length) {
      toast.error("You can only book one appointment per day");
      return;
    }

    setAppointments({
      [key]: [[timeRange.start_time, timeRange.end_time]],
    });
  };

  const handleFinalSubmit = async () => {
    if (!date) return toast.error("Please select a date");
    if (!timeRange) return toast.error("Please select a time");
    if (!reason) return toast.error("Kindly enter a reason");

    await rescheduleAppointment({
      id: appointmentId,
      newDate: date,
      newStartTime: timeRange.start_time,
      serviceId,
    }).unwrap();

    router.replace("/dashboard/client/appointments");
  };

  return (
    <Animate>
      <div className="flex flex-col gap-5">
        <Link href="../services" className="w-fit">
          <div className="flex items-center gap-1 text-xs text-[#2D36E0]">
            <ArrowLeft size={12} />
            <p>Back to services</p>
          </div>
        </Link>

        <div className="flex flex-col gap-1">
          <h1 className="text-xl md:text-3xl font-medium">
            Pick appointment date
          </h1>
          <p className="text-sm md:text-base">
            Set an appointment date with {existing?.staff?.name}
          </p>
        </div>
        <div className="flex flex-col lg:flex-row items-start gap-5">
          <Card className="w-fit p-0">
            <CardContent className="p-0">
              <Calendar
                mode="single"
                defaultMonth={date}
                selected={date}
                onSelect={(selectedDate) => setDate(selectedDate)}
                disabled={(date) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);

                  const current = new Date(date);
                  current.setHours(0, 0, 0, 0);

                  const day = date.toLocaleDateString("en-US", {
                    weekday: "short",
                  });

                  return current < today || !availableDays.includes(day);
                }}
                numberOfMonths={1}
                className="[--cell-size:--spacing(10)] md:[--cell-size:--spacing(20)]"
                components={{
                  DayButton: ({ children, modifiers, day, ...props }) => {
                    const key = day.date.toDateString();
                    const dayAppointments = appointments[key] || [];

                    return (
                      <CalendarDayButton
                        day={day}
                        modifiers={modifiers}
                        {...props}
                      >
                        {children}

                        <div className="flex flex-col gap-1 mt-1">
                          {dayAppointments.map((range, i) => (
                            <span
                              key={i}
                              className="text-[10px] text-gray-600 rounded px-1"
                            >
                              {range[0]} - {range[1]}
                            </span>
                          ))}
                        </div>
                      </CalendarDayButton>
                    );
                  },
                }}
              />
            </CardContent>
          </Card>

          <div className="flex flex-col gap-5">
            {/* Appointment box */}
            <Card className="w-[18rem] max-w-full h-fit p-0">
              <CardContent className="p-0">
                <div className="w-full flex flex-col gap-5 p-5">
                  <div>
                    <h1>{existing?.staff?.name}&apos;s availability</h1>
                    <p className="text-xs text-[#2D36E0]">
                      {dayAvailability
                        ? `${dayAvailability.startTime} - ${dayAvailability.endTime}`
                        : "Unavailable"}
                    </p>
                  </div>

                  <hr />

                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex items-center gap-1 text-gray-500">
                      <AlarmClock size={14} /> <p>Time</p>
                    </div>

                    <RangePicker
                      format="HH:mm"
                      value={
                        timeRange
                          ? [
                              dayjs(timeRange.start_time, "HH:mm"),
                              dayjs(timeRange.end_time, "HH:mm"),
                            ]
                          : undefined
                      }
                      allowClear={false}
                      variant="borderless"
                      className="custom-range-picker"
                      onCalendarChange={(values) => {
                        if (values && values[0]) {
                          const start = values[0].format("HH:mm");
                          const end = addMinutes(start, duration + buffer);

                          setTimeRange({
                            start_time: start,
                            end_time: end,
                          });
                        }
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs mt-2">
                    <div
                      onClick={() => setType("onsite")}
                      className={`flex items-center gap-1 py-2 px-3 rounded-sm cursor-pointer transition-all duration-300 ease-in-out ${type === "onsite" && "bg-blue-50"}`}
                    >
                      <span className="w-2 h-2 bg-[#2D36E0] rounded-full" />
                      <p>On site</p>
                    </div>

                    <div
                      onClick={() => setType("virtual")}
                      className={`flex items-center gap-1 py-2 px-3 rounded-sm cursor-pointer transition-all duration-300 ease-in-out ${type === "virtual" && "bg-red-50"}`}
                    >
                      <span className="w-2 h-2 bg-red-500 rounded-full" />
                      <p>Virtual</p>
                    </div>
                  </div>

                  <div className="w-full flex items-center justify-between text-xs mt-2">
                    <Link href="../appointments">
                      <p className="text-red-500">Cancel</p>
                    </Link>

                    <Button
                      onClick={handleSave}
                      className="w-fit self-end bg-[#2D36E0] rounded-sm p-4 text-xs!"
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Textarea container */}
            <div className="max-w-full border border-gray-200 rounded-lg overflow-hidden">
              <div className="text-gray-500 bg-gray-200 p-5 text-sm">
                Reason
              </div>
              <div className="relative flex flex-col justify-between px-2.5 py-2">
                <Textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Add reason..."
                  className="min-h-52 border-none resize-none outline-none focus:ring-0 focus-visible:ring-0 text-sm"
                />
                <Button
                  onClick={handleFinalSubmit}
                  className="w-fit self-end bg-[#2D36E0] rounded-sm  p-4 text-xs!"
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Animate>
  );
};

export default Page;
