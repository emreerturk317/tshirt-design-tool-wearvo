"use client";
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { X, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  open: boolean;
  onSuccess: () => void;
  onClose: () => void;
}

export default function LoginModal({ open, onSuccess, onClose }: Props) {
  const { login } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login();
    onSuccess();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative bg-white rounded-3xl p-8 w-full max-w-sm mx-4 shadow-2xl"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6 text-center">
              <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Zap className="w-5 h-5 text-indigo-500" />
              </div>
              <h2 className="text-xl font-bold">Sign in to generate</h2>
              <p className="text-sm text-gray-400 mt-1">Your prompt will be kept</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-50"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-50"
              />
              <button
                type="submit"
                className="w-full bg-indigo-500 text-white py-3 rounded-xl font-semibold hover:bg-indigo-600 transition-colors"
              >
                Sign in & Generate
              </button>
            </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100" />
              </div>
              <div className="relative flex justify-center text-xs text-gray-400 bg-white px-2">or</div>
            </div>

            <button
              onClick={() => { login(); onSuccess(); }}
              className="w-full border border-gray-200 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Continue with Google
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
