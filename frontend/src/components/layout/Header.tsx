import { Bell, ChevronDown, LogOut, Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Modal from "../ui/modal";
import { AnimatePresence, motion } from "framer-motion";
import { useAppSelector } from "@/redux/hooks";
import { useGetNotificationsQuery } from "@/redux/api/notification.api";

const searches = ["Search 1", "Search 2", "Search 3", "Search 4", "Search 5"];

const Header = () => {
  const user = useAppSelector((state) => state.auth.user);
  const role = user?.role;

  const { data } = useGetNotificationsQuery({});
  const unreadCount = data?.unreadCount || 0;

  const [reveal, setReveal] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(searches);
  const ref = useRef<HTMLDivElement>(null);
  const ref_2 = useRef<HTMLDivElement>(null);

  const removeRecentSearch = (value: string) => {
    setRecentSearches((prev) => prev.filter((s) => s !== value));
  };

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
                placeholder="Search services & staffs"
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
                  className="absolute top-full left-1/2 -translate-x-1/2 min-w-64 bg-white shadow rounded-lg text-sm p-5 mt-2 z-10"
                >
                  {recentSearches.map((search, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between mb-3 last:mb-0"
                    >
                      <p>{search}</p>
                      <button
                        onClick={() => removeRecentSearch(search)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
        <div className="flex items-center justify-between gap-5">
          <Link
            href={
              role === "staff"
                ? "../notifications"
                : "../notifications"
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
              <div className="relative w-5 aspect-square rounded-full overflow-hidden">
                <Image
                  src="/banner.png"
                  alt="Banner"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

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
                    <div className="relative w-7 min-w-5 aspect-square rounded-full overflow-hidden">
                      <Image
                        src="/banner.png"
                        alt="Background"
                        width={28}
                        height={28}
                        preload
                      />
                    </div>

                    <div className="text-xs leading-tight group-data-[collapsible=icon]:hidden">
                      <p className="font-medium">Lekota Incorporated</p>
                      <p className="text-muted-foreground text-[10px]">
                        davidcharles@gmail.com
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
