"use client";

import SearchServiceModal from "@/components/layout/SearchServiceModal";
import { Search } from "lucide-react";
import { useState } from "react";

const services = [
  "Service 1",
  "Service 2",
  "Service 3",
  "Service 4",
  "Service 5",
];

const Page = () => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl md:text-3xl font-medium">Service</h1>
          <p className="text-sm md:text-base">
            Choose or search services to create appointments
          </p>
        </div>

        <div className="w-fit flex flex-col gap-5">
          <div className="flex items-center bg-gray-100 rounded-lg pl-3 text-sm">
            <Search size={16} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search services & staffs"
              className="bg-transparent border-none focus:outline-none p-3 placeholder:text-gray-400"
            />
          </div>

          <div className="flex flex-col gap-5 text-sm">
            {services.map((service, i) => (
              <div key={i}>{service}</div>
            ))}

            <div
              onClick={() => setOpen(true)}
              className="text-[#2D36E0] cursor-pointer"
            >
              See all
            </div>
          </div>
        </div>
      </div>

      <SearchServiceModal open={open} onOpenChange={setOpen} />
    </>
  );
};

export default Page;
