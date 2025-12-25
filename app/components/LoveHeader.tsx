'use client';

import { motion } from "motion/react";

export default function LoveHeader() {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, type: "spring" }}
      className="text-center mb-12 mt-8"
    >
      <div className="inline-block relative">
        <motion.h1 
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-5xl md:text-7xl font-bold mb-2 text-white drop-shadow-lg"
        >
          Our Love Story
        </motion.h1>
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-6 -right-6 text-4xl"
        >
          ❤️
        </motion.div>
      </div>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="text-2xl md:text-3xl mt-4 font-light tracking-wide"
      >
        Thu Hà & Phú Thức
      </motion.p>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="mt-2 text-pink-100 text-lg"
      >
        Since July 1, 2025
      </motion.div>
    </motion.header>
  );
}
