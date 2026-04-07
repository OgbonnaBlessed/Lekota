/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import SearchServiceModal from "@/components/layout/SearchServiceModal";
import { Search } from "lucide-react";
import { useState } from "react";
import { useGetTenantServicesQuery } from "@/redux/api/staff.api";

const Page = () => {
  const { data } = useGetTenantServicesQuery({});
  const services = data?.services || [];
  console.log("Services:", services);

  const [open, setOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [search, setSearch] = useState("");

  const filtered = services.filter((s: any) =>
    s.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="text-xl md:text-3xl font-medium">Service</h1>
          <p className="text-sm">
            Choose or search services to create appointments
          </p>
        </div>

        {/* SEARCH */}
        <div className="w-fit flex items-center bg-gray-100 rounded-lg pl-3 text-sm">
          <Search size={16} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services"
            className="bg-transparent p-3 outline-none"
          />
        </div>

        {/* SERVICES */}
        <div className="w-fit flex flex-col gap-4">
          {filtered.map((service: any) => (
            <div
              key={service._id}
              onClick={() => {
                setSelectedService(service);
                setOpen(true);
              }}
              className="py-3 px-4 rounded-lg cursor-pointer hover:bg-gray-100 transition-all duration-300 ease-in-out"
            >
              {service.name}
            </div>
          ))}
        </div>
      </div>

      <SearchServiceModal
        open={open}
        onOpenChange={setOpen}
        service={selectedService}
      />
    </>
  );
};

export default Page;