import React from 'react';
import { motion } from 'framer-motion';
import { Store } from 'lucide-react';

export default function ReloadSplash() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="fixed inset-0 z-[70] grid place-items-center bg-gradient-to-br from-black via-neutral-900 to-black"
      aria-hidden="true"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 16 }}
        className="flex items-center gap-3"
      >
        <div className="p-3 rounded-xl bg-gradient-to-br from-fuchsia-500 to-cyan-400 text-black shadow-xl">
          <Store className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xl font-extrabold tracking-wide">SHOES CABIN</p>
          <p className="text-xs text-white/70">Loading experience...</p>
        </div>
      </motion.div>
    </motion.div>
  );
}