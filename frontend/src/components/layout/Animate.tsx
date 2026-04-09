import { AnimatePresence, motion } from "framer-motion";
import React from "react";

const Animate = ({ children }: { children: React.ReactNode }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.25,
          ease: [0.4, 0, 0.2, 1], // smooth, professional easing
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default Animate;
