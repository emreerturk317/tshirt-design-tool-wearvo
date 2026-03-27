"use client";
import { useApp } from "@/context/AppContext";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const countries = ["Tokyo 🇯🇵", "Paris 🇫🇷", "New York 🇺🇸", "Berlin 🇩🇪", "Sydney 🇦🇺", "London 🇬🇧"];
const confettiColors = ["#6366f1", "#f59e0b", "#10b981", "#ef4444", "#3b82f6", "#ec4899"];

export default function SaleNotification() {
  const { showSaleNotification } = useApp();
  const [country] = useState(() => countries[Math.floor(Math.random() * countries.length)]);
  const [confetti, setConfetti] = useState<{ id: number; x: number; color: string; delay: number; size: number }[]>([]);

  useEffect(() => {
    if (showSaleNotification) {
      const pieces = Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        delay: Math.random() * 0.5,
        size: Math.random() * 8 + 4,
      }));
      setConfetti(pieces);
    } else {
      setConfetti([]);
    }
  }, [showSaleNotification]);

  return (
    <>
      {confetti.map(p => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.x}%`,
            backgroundColor: p.color,
            width: p.size,
            height: p.size,
            animationDuration: `${1.5 + Math.random()}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
      <AnimatePresence>
        {showSaleNotification && (
          <motion.div
            initial={{ opacity: 0, y: 80, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 80, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-black text-white rounded-2xl px-8 py-5 shadow-2xl text-center min-w-[320px]"
          >
            <div className="text-2xl mb-1">🎉</div>
            <p className="text-base font-semibold">Your art is on its way to {country}</p>
            <p className="text-sm text-gray-400 mt-1">+$2.00 credit added to your wallet</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
