"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const Navbar = () => {
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
          <Link href="/signup">
            <p className="text-sm text-white bg-[#2D36E0] rounded-full p-4">
              Get started
            </p>
          </Link>
        </div>

        {/* Mobile Menu Icon */}
        <div
          className="block sm:hidden cursor-pointer"
          onClick={() => setOpen((prev) => !prev)}
        >
          <Menu />
        </div>

        {/* Dropdown */}
        <AnimatePresence mode="popLayout">
          {open && (
            <motion.div
              className="flex flex-col items-center gap-4 bg-white shadow-xl rounded-xl p-4 absolute top-16 right-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-sm">Features</p>
              <p className="text-sm">Pricing</p>
              <Link href="/legal" className="text-sm">
                Legal
              </Link>
              <p className="text-sm">Statement</p>
              <Link href="/signup">
                <p className="text-xs text-white bg-[#2D36E0] rounded-full p-4">
                  Get started
                </p>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Navbar;
