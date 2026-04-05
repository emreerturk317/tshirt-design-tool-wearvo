"use client";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { User, Zap } from "lucide-react";

export default function Navbar() {
  const { isLoggedIn, credits, user } = useApp();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight text-black">
          pandacasso
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/explore" className="text-sm text-gray-600 hover:text-black transition-colors">
            Explore
          </Link>
          <Link href="/products" className="text-sm text-gray-600 hover:text-black transition-colors">
            Products
          </Link>
          {isLoggedIn && (
            <Link href="/design" className="text-sm text-gray-600 hover:text-black transition-colors">
              Design
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <div className="flex items-center gap-1.5 bg-gray-50 rounded-full px-3 py-1.5">
                <Zap className="w-3.5 h-3.5 text-indigo-500" />
                <span className="text-sm font-medium">${credits.toFixed(2)}</span>
              </div>
              <Link href="/dashboard" className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-black">
                <User className="w-4 h-4" />
                <span className="hidden md:inline">{user?.name}</span>
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-gray-600 hover:text-black transition-colors">
                Login
              </Link>
              <Link href="/register" className="bg-black text-white text-sm px-4 py-2 rounded-full hover:bg-gray-800 transition-colors">
                Get Started
              </Link>
            </>
          )}
          <Link href="/design" className="bg-indigo-500 text-white text-sm px-4 py-2 rounded-full hover:bg-indigo-600 transition-colors flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            Design
          </Link>
        </div>
      </div>
    </nav>
  );
}
