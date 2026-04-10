/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetNotificationsQuery } from "@/redux/api/notification.api";
import { useGetTenantServicesQuery } from "@/redux/api/staff.api";
import { useAppSelector } from "@/redux/hooks";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, ChevronDown, LogOut, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Avatar from "../ui/avatar";
import Modal from "../ui/modal";
import SearchServiceModal from "./SearchServiceModal";

const Header = () => {
  const user = useAppSelector((state) => state.auth.user);
  const role = user?.role;
  console.log("user:", user);

  const { data } = useGetNotificationsQuery({});
  const unreadCount = data?.unreadCount || 0;

  const { data: servicesData } = useGetTenantServicesQuery({});
  const services = servicesData?.services || [];

  const [show, setShow] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [search, setSearch] = useState<string>("");

  const filtered = services.filter((s: any) =>
    s.name.toLowerCase().includes(search.toLowerCase()),
  );

  const [reveal, setReveal] = useState<boolean>(false);
  const [openSearchModal, setOpenSearchModal] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);
  const ref_2 = useRef<HTMLDivElement>(null);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
      if (ref_2.current && !ref_2.current.contains(event.target as Node)) {
        setReveal(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    if (reveal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, reveal]);

  return (
    <>
      <div className="flex items-center gap-8">
        {role !== "staff" && (
          <div ref={ref_2} className="relative">
            <div className="flex items-center bg-gray-100 rounded-lg pl-3 text-sm">
              <Search size={16} className="text-gray-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search services"
                onFocus={() => setReveal(true)}
                className="bg-transparent border-none focus:outline-none p-3 placeholder:text-gray-400"
              />
            </div>
            <AnimatePresence>
              {reveal && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute top-full left-1/2 -translate-x-1/2 min-w-64 bg-white shadow rounded-lg text-sm p-2 mt-2 z-10"
                >
                  {filtered.length > 0 ? (
                    <>
                      {filtered.map((service: any) => (
                        <div
                          key={service._id}
                          onClick={() => {
                            setSelectedService(service);
                            setOpenSearchModal(true);
                          }}
                          className="text-sm py-2 px-3 rounded-md cursor-pointer hover:bg-gray-100 transition-all duration-300 ease-in-out"
                        >
                          {service.name}
                        </div>
                      ))}
                    </>
                  ) : (
                    <p className="text-xs text-gray-500 py-5 text-center">
                      Service does not exist{" "}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
        <div className="flex items-center justify-between gap-5">
          <Link
            href={
              role === "staff"
                ? "/dashboard/staff/notifications"
                : "/dashboard/client/notifications"
            }
            className="relative"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-1 bg-red-500 text-white text-[10px] px-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </Link>

          <div ref={ref} className="relative hidden md:block">
            <div
              onClick={() => setOpen((prev) => !prev)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Avatar image={user?.profile?.image || user?.image} name={user?.name} />
              <ChevronDown size={14} />
            </div>

            {/* Drop down */}
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute top-full right-0 mt-2 flex flex-col gap-3 bg-white shadow p-5 rounded-lg z-10"
                >
                  <div className="flex items-center gap-3">
                    <Avatar image={user?.image} name={user?.name} />

                    <div className="text-xs leading-tight group-data-[collapsible=icon]:hidden">
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-muted-foreground text-[10px]">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <hr className="my-2 border-t" />
                  <div
                    onClick={() => setShow(true)}
                    className="flex items-center gap-3 text-sm rounded-lg transition cursor-pointer"
                  >
                    <LogOut size={14} />
                    <span>Logout</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <SearchServiceModal
        open={openSearchModal}
        onOpenChange={setOpenSearchModal}
        service={selectedService}
      />
      <Modal
        header="Are you sure you want to log out"
        body={
          <div className="flex items-center gap-8 text-white text-sm">
            <p
              onClick={() => setShow(false)}
              className="bg-[#2D36E0] p-3 rounded-lg cursor-pointer"
            >
              No, Stay in Lekota
            </p>
            <p
              onClick={() => setShow(false)}
              className="bg-[#ED301F] p-3 rounded-lg cursor-pointer"
            >
              Yes, Log out
            </p>
          </div>
        }
        visible={show}
        onClose={() => setShow(false)}
      />
    </>
  );
};

export default Header;
