"use client";

import { useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageLightboxProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function ImageLightbox({ images, currentIndex, onClose, onPrev, onNext }: ImageLightboxProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onPrev, onNext]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
        onClick={onClose}
      >
        {/* Imagen */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.92, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="relative w-full h-full max-w-4xl max-h-[90vh] mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            src={images[currentIndex]}
            alt={`Imagen ${currentIndex + 1}`}
            fill
            className="object-contain"
            sizes="100vw"
          />
        </motion.div>

        {/* Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Anterior */}
        {images.length > 1 && currentIndex > 0 && (
          <button
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Siguiente */}
        {images.length > 1 && currentIndex < images.length - 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Contador */}
        {images.length > 1 && (
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            {currentIndex + 1} / {images.length}
          </p>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
