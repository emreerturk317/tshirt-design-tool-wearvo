"use client";
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check } from "lucide-react";

export default function RegisterPage() {
  const { login } = useApp();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login();
    router.push("/design");
  };

  const perks = [
    "3 free AI designs per day",
    "$2 credit for every sale",
    "Free printing & worldwide shipping",
    "Cinematic sale notifications",
  ];

  return (
    <main className="pt-16 min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-gray-400 text-sm mt-1">Start designing for free</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-2">
          {perks.map(p => (
            <div key={p} className="flex items-center gap-2">
              <div className="w-4 h-4 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-2.5 h-2.5 text-indigo-500" />
              </div>
              <span className="text-xs text-gray-600">{p}</span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-50"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-50"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-50"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-3 rounded-xl font-medium hover:bg-indigo-600 transition-colors"
          >
            Create Free Account
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-black font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </main>
  );
}
