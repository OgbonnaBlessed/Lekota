"use client";

import { Button } from "@/components/ui/button";
import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { TimePicker } from "antd";
import { AlarmClock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
const { RangePicker } = TimePicker;

type Schedule = {
  start_time: string;
  end_time: string;
};

const Page = () => {
  const [showAppointmentBox, setShowAppointmentBox] = useState(false);
  const [showReasonBox, setShowReasonBox] = useState(false);
  const [timeRange, setTimeRange] = useState<Schedule | null>(null);
  const [appointments, setAppointments] = useState<
    Record<string, [string, string][]>
  >({});
  const [date, setDate] = useState<Date | undefined>(
    () =>
      new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDay() - 2,
      ),
  );

  const handleSave = () => {
    if (!date || !timeRange) return;

    const key = date.toDateString();

    setAppointments((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), [timeRange.start_time, timeRange.end_time]],
    }));

    setShowAppointmentBox(false);
  };

  const handleCancel = () => {
    setShowReasonBox(true);
  };

  return (
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
          Set an appointment date with Jay Baxter
        </p>
      </div>
      <div className="flex flex-col lg:flex-row items-start gap-5">
        <Card className="w-fit p-0">
          <CardContent className="p-0">
            <Calendar
              mode="single"
              defaultMonth={date}
              selected={date}
              onSelect={(selectedDate) => {
                setDate(selectedDate);
                if (selectedDate) {
                  setShowAppointmentBox(true);
                  setShowReasonBox(false);
                }
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

        {showAppointmentBox && (
          <div className="flex flex-col gap-5">
            {/* Appointment box */}
            <Card className="w-[18rem] max-w-full h-fit p-0">
              <CardContent className="p-0">
                <div className="w-full flex flex-col gap-5 p-5">
                  <div className="flex flex-col gap-1">
                    <h2>Jay&apos;s availability</h2>
                    <p className="text-xs text-[#2D36E0]">
                      9:00 - 18:00 (UTC +00:00)
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex items-center gap-1 text-gray-500">
                      <AlarmClock size={14} /> <p>Time</p>
                    </div>

                    <RangePicker
                      format="HH:mm"
                      placeholder={["9:00", "9:40"]}
                      suffixIcon={null}
                      allowClear={false}
                      variant="borderless"
                      className="custom-range-picker"
                      onChange={(values) => {
                        if (values && values[0] && values[1]) {
                          setTimeRange({
                            start_time: values[0].format("HH:mm"),
                            end_time: values[1].format("HH:mm"),
                          });
                        }
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-[#2D36E0] rounded-full" />
                      <p>On site</p>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-red-500 rounded-full" />
                      <p>Virtual</p>
                    </div>
                  </div>

                  <div className="w-full flex items-center justify-between">
                    <div
                      className="text-red-500 cursor-pointer"
                      onClick={handleCancel}
                    >
                      Cancel
                    </div>

                    <Button
                      onClick={handleSave}
                      className="w-fit self-end bg-[#2D36E0] rounded-none p-4"
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Textarea container */}
            {showReasonBox && (
              <div className="max-w-full border border-gray-200 rounded-lg overflow-hidden">
                <div className="text-gray-500 bg-gray-200 p-5">Reason</div>
                <div className="relative flex flex-col justify-between px-2.5 py-2">
                  <Textarea
                    placeholder="Add reason..."
                    className="min-h-52 border-none resize-none outline-none focus:ring-0 focus-visible:ring-0"
                  />
                  <Button className="w-fit self-end bg-[#2D36E0] rounded-none p-4">
                    Send
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
