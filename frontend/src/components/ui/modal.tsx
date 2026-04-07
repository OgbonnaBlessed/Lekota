"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

type ModalProps = {
  header?: string;
  body?: string | React.ReactNode;
  href?: string;
  link?: string;
  visible: boolean;
  onClose?: () => void;
  onClick?: () => void;
};

const Modal = ({
  header,
  body,
  href,
  link,
  visible,
  onClose,
  onClick,
}: ModalProps) => {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs px-4"
          // Backdrop animation
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Click outside to close */}
          <div className="absolute inset-0" onClick={onClose} />

          <motion.div
            className="relative w-full max-w-md rounded-2xl bg-white shadow-xl overflow-hidden"
            // Modal animation (shadcn-like: subtle scale + fade)
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {/* Banner */}
            <div className="w-full h-28 relative">
              <Image
                src="/banner.png"
                alt="Banner"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Content */}
            <div className="flex flex-col items-center text-center gap-6 p-6">
              <h2 className="text-xl font-semibold">{header}</h2>

              {body && <div className="w-2xs max-w-full text-sm">{body}</div>}

              {href && !onClick && (
                <Link href={href} onClick={onClose}>
                  <button className="w-full bg-[#2D36E0] hover:opacity-90 transition text-white text-sm rounded-lg py-3 px-12">
                    {link}
                  </button>
                </Link>
              )}

              {!href && onClick && (
                <button
                  onClick={onClick}
                  className="w-full bg-[#2D36E0] hover:opacity-90 transition text-white text-sm rounded-lg py-3 px-12"
                >
                  {link}
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
