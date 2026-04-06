/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ChevronDown, Plus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useGetAvailabilityQuery,
  useSetAvailabilityMutation,
} from "@/redux/api/staff.api";
import { TimePicker } from "antd";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton/skeleton";
import AvailabilitySkeleton from "@/components/ui/skeleton/AvailabitySkeleton";

const { RangePicker } = TimePicker;

const time_zones = [
  "UTC -01:00",
  "UTC +00:00",
  "UTC +01:00",
  "UTC +02:00",
  "UTC +03:00",
];

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type DaySchedule = {
  enabled: boolean;
  start_time: string;
  end_time: string;
};

const Page = () => {
  const [setAvailability] = useSetAvailabilityMutation();
  const {
    data: availabilityData,
    isLoading,
  } = useGetAvailabilityQuery({});

  const [timeZone, setTimeZone] = useState<string>("UTC +00:00");
  const [show, setShow] = useState<boolean>(false);
  const [showSkeleton, setShowSkeleton] = useState<boolean>(true);

  const createDefaultSchedule = () =>
    Object.fromEntries(
      days.map((day) => [
        day,
        { enabled: false, start_time: "09:00", end_time: "18:00" },
      ]),
    );

  const [schedule, setSchedule] = useState<Record<string, DaySchedule>>(
    createDefaultSchedule(),
  );

  const ref = useRef<HTMLDivElement>(null);

  const select_time_zone = (zone: string) => {
    setTimeZone(zone);
    setShow(false);
  };

  // Outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setShow(false);
      }
    };

    if (show) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [show]);

  const toggleDay = (day: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled: !prev[day].enabled,
        start_time: prev[day].start_time || "09:00",
        end_time: prev[day].end_time || "18:00",
      },
    }));
  };

  useEffect(() => {
    if (!availabilityData) return;

    setSchedule((prev) => {
      const updated = { ...createDefaultSchedule() };

      availabilityData.forEach((item: any) => {
        if (!item?.day) return;

        updated[item.day] = {
          enabled: true,
          start_time: item.startTime || "09:00",
          end_time: item.endTime || "18:00",
        };
      });

      return updated;
    });
  }, [availabilityData]);

  const handleSave = async () => {
    const payload = Object.entries(schedule).map(([day, val]) => ({
      day,
      enabled: val.enabled,
      start_time: val.start_time,
      end_time: val.end_time,
    }));

    await setAvailability({
      schedules: payload,
      timeZone, // optional but good
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading || showSkeleton) {
    return <AvailabilitySkeleton />;
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl md:text-3xl font-medium">
          Set your active working days and hours
        </h1>
        <p className="text-sm md:text-base">
          Adjust hours for each specific day
        </p>
      </div>

      {/* Timezone */}
      <div ref={ref} className="relative w-fit">
        <div
          onClick={() => setShow((prev) => !prev)}
          className="flex items-center gap-4 border border-gray-300 p-3 rounded-lg text-xs cursor-pointer"
        >
          <p>{timeZone}</p>
          <ChevronDown size={12} />
        </div>

        <AnimatePresence>
          {show && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 min-w-52 bg-white shadow shadow-gray-300 rounded-lg p-4 mt-2 z-10"
            >
              {time_zones.map((zone) => (
                <div
                  key={zone}
                  onClick={() => select_time_zone(zone)}
                  className="text-sm py-1 mb-3 last:mb-0 cursor-pointer"
                >
                  {zone}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Days */}
      <div className="flex flex-col gap-5">
        {days.map((day) => {
          const data = schedule[day];

          return (
            <div key={day} className="flex items-center gap-5 text-sm">
              <div className="w-10 aspect-square flex items-center justify-center bg-[#2D36E0] text-white rounded-full">
                {day[0]}
              </div>

              <div className="w-full flex flex-col gap-2 text-gray-500">
                <AnimatePresence mode="wait">
                  {data.enabled ? (
                    <motion.div
                      key="active"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="w-fit flex items-center gap-3"
                    >
                      <RangePicker
                        format="HH:mm"
                        value={[
                          dayjs(data.start_time, "HH:mm"),
                          dayjs(data.end_time, "HH:mm"),
                        ]}
                        placeholder={["9:00", "9:40"]}
                        suffixIcon={null}
                        allowClear={false}
                        variant="borderless"
                        className="custom-range-picker"
                        onChange={(values) => {
                          if (values && values[0] && values[1]) {
                            setSchedule((prev) => ({
                              ...prev,
                              [day]: {
                                ...prev[day],
                                start_time: values[0]!.format("HH:mm"),
                                end_time: values[1]!.format("HH:mm"),
                              },
                            }));
                          }
                        }}
                      />

                      <button
                        onClick={() => toggleDay(day)}
                        className="text-[#2D36E0] border border-[#2D36E0] rounded-full p-1 ml-2"
                      >
                        <X size={12} />
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="inactive"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="flex items-center gap-3"
                    >
                      <p>Unavailable</p>

                      <button
                        onClick={() => toggleDay(day)}
                        className="border border-gray-400 rounded-full p-1 ml-2"
                      >
                        <Plus size={12} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>

      <Button
        onClick={handleSave}
        className="w-fit bg-[#2D36E0] text-white px-6 py-5 rounded-lg"
      >
        Save Availability
      </Button>
    </div>
  );
};

export default Page;
