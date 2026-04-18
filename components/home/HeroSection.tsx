"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative bg-[#111111] text-white overflow-hidden">
      {/* Decorative gold gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#C9A84C]/20 via-transparent to-transparent pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#C9A84C]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-28 flex flex-col items-center text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-[#C9A84C] text-sm font-semibold tracking-widest uppercase mb-4"
        >
          Teléfonos de segunda mano
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold leading-tight text-balance"
        >
          Tu próximo teléfono
          <br />
          <span className="text-[#C9A84C]">te está esperando</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-4 text-gray-400 text-base md:text-lg max-w-xl"
        >
          La mejor selección de smartphones usados con calidad garantizada. Precios honestos, sin sorpresas.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-8 flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
        >
          <Link
            href="/catalogo"
            className="inline-flex items-center justify-center gap-2 bg-[#C9A84C] hover:bg-[#A6862A] text-white font-semibold px-8 py-3.5 rounded-xl transition-colors"
          >
            Ver catálogo <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/catalogo?condition=Como+nuevo"
            className="inline-flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 text-white font-medium px-8 py-3.5 rounded-xl transition-colors"
          >
            Como nuevos
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="mt-12 flex gap-8 md:gap-16 text-center"
        >
          {[
            { value: "100+", label: "Teléfonos disponibles" },
            { value: "Garantía", label: "De calidad" },
            { value: "WhatsApp", label: "Atención directa" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-xl font-bold text-[#C9A84C]">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
