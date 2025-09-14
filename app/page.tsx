"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-black to-orange-900 text-center">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-5xl font-bold text-orange-400 drop-shadow-lg"
      >
        SkateHubba Pro
      </motion.h1>
      <p className="mt-4 text-gray-300">Play SKATE, rep spots, own your tricks.</p>
      <Link
        href="/map"
        className="mt-6 px-6 py-3 rounded-2xl bg-orange-600 hover:bg-orange-500 text-lg font-semibold shadow-md"
      >
        Open Map
      </Link>
    </main>
  );
}
