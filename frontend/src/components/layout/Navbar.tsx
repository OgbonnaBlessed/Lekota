"use client";

import { useAppSelector } from "@/redux/hooks";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const Navbar = () => {
  const user = useAppSelector((state) => state.auth.user);
  const role = user?.role;

  const [open, setOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="fixed left-1/2 -translate-x-1/2 w-full flex items-center justify-center p-5 z-10">
      <div
        ref={menuRef}
        className="relative w-2xl max-w-full flex items-center justify-between rounded-full shadow-xl bg-white px-8 py-4"
      >
        {/* Logo */}
        <Link href="/">
          <p className="text-lg text-[#121212]">Lekota</p>
        </Link>

        {/* Desktop */}
        <div className="max-sm:hidden flex items-center gap-4">
          <Link href="/#features" className="text-sm cursor-pointer">
            Features
          </Link>
          <Link href="/#pricing" className="text-sm cursor-pointer">
            Pricing
          </Link>
          <Link href="/legal" className="text-sm">
            Legal
          </Link>
          <Link href="/#statement" className="text-sm cursor-pointer">
            Statement
          </Link>
          <Link
            href={
              role && role === "admin"
                ? "/dashboard/admin/overview"
                : role === "tenant_admin"
                  ? "/dashboard/tenant/overview"
                  : role === "staff"
                    ? "/dashboard/staff/profile"
                    : role === "client"
                      ? "/dashboard/client/profile"
                      : "/signin"
            }
          >
            <p className="text-sm text-white bg-[#2D36E0] rounded-full p-4">
              {user === null ? "Get started" : "Dashboard"}
            </p>
          </Link>
        </div>

        {/* Mobile Menu Icon */}
        <div
          className="w-5 flex flex-col items-end gap-1.25 sm:hidden cursor-pointer"
          onClick={() => setOpen((prev) => !prev)}
        >
          {["1", "2", "3"].map((_bar, i) => (
            <div
              key={i}
              className={`${i !== 1 ? "w-full" : "w-[80%]"} h-0.5 bg-black rounded-full`}
            />
          ))}
        </div>

        <AnimatePresence>
          {open && (
            <>
              {/* OVERLAY */}
              <motion.div
                className="fixed min-h-screen inset-0 bg-black/40 z-40"
                initial={{ x: "-100%" }}
                animate={{ x: 0, transition: { duration: 0.5 } }}
                exit={{
                  x: "-100%",
                  transition: { delay: 0.4, duration: 0.5 },
                }}
                onClick={() => setOpen(false)}
              />

              {/* SIDEBAR */}
              <motion.div
                ref={menuRef}
                className="fixed top-0 left-0 min-h-screen w-[75%] max-w-xs bg-white z-50 shadow-2xl flex flex-col p-6"
                initial={{ x: "-100%" }}
                animate={{
                  x: 0,
                  transition: {
                    delay: 0.4,
                    duration: 0.5,
                  },
                }}
                exit={{
                  x: "-100%",
                  transition: {
                    duration: 0.5,
                  },
                }}
              >
                {/* HEADER */}
                <div className="self-end mb-8">
                  <button
                    onClick={() => setOpen(false)}
                    className="rounded-full p-2"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* LINKS */}
                <div className="flex flex-col items-center gap-6 text-sm">
                  <Link href="/#features" onClick={() => setOpen(false)}>
                    Features
                  </Link>
                  <Link href="/#pricing" onClick={() => setOpen(false)}>
                    Pricing
                  </Link>
                  <Link href="/legal" onClick={() => setOpen(false)}>
                    Legal
                  </Link>
                  <Link href="/#statement" onClick={() => setOpen(false)}>
                    Statement
                  </Link>
                </div>

                {/* CTA */}
                <div className="mx-auto mt-20">
                  <Link
                    href={
                      role === "admin"
                        ? "/dashboard/admin/overview"
                        : role === "tenant_admin"
                          ? "/dashboard/tenant/overview"
                          : role === "staff"
                            ? "/dashboard/staff/profile"
                            : "/dashboard/client/profile"
                    }
                    onClick={() => setOpen(false)}
                  >
                    <div className="w-fit text-sm text-center text-white bg-[#2D36E0] rounded-full p-4">
                      {role ? "Go to Dashboard" : "Get Started"}
                    </div>
                  </Link>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Navbar;
