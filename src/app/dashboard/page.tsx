"use client";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Zap, Package, Image as ImageIcon, TrendingUp, Award, Flame } from "lucide-react";
import { BADGES } from "@/lib/data";

export default function DashboardPage() {
  const { isLoggedIn, user, credits, myDesigns, triggerSaleNotification } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) router.push("/login");
  }, [isLoggedIn, router]);

  if (!isLoggedIn) return null;

  const stats = [
    { label: "Credits", value: `$${credits.toFixed(2)}`, icon: <Zap className="w-4 h-4 text-indigo-500" />, href: "/dashboard/credits" },
    { label: "Designs", value: myDesigns.length.toString(), icon: <ImageIcon className="w-4 h-4 text-indigo-500" />, href: "/dashboard/designs" },
    { label: "Orders", value: "3", icon: <Package className="w-4 h-4 text-indigo-500" />, href: "/dashboard/orders" },
    { label: "Total Sales", value: "12", icon: <TrendingUp className="w-4 h-4 text-indigo-500" />, href: "#" },
  ];

  const userBadges = BADGES.filter(b => user?.badges.includes(b.id));

  return (
    <main className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Hey, {user?.name} 👋</h1>
            <p className="text-gray-400 text-sm mt-1">Welcome to your creator dashboard</p>
          </div>
          <Link href="/design" className="bg-indigo-500 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-indigo-600 transition-colors flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" /> New Design
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map(s => (
            <Link key={s.label} href={s.href} className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-indigo-100 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                {s.icon}
                <span className="text-xs text-gray-500">{s.label}</span>
              </div>
              <p className="text-2xl font-bold">{s.value}</p>
            </Link>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Streak */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <Flame className="w-4 h-4 text-orange-400" />
              <h2 className="text-sm font-semibold">Daily Streak</h2>
            </div>
            <div className="flex gap-2 mb-3">
              {Array.from({ length: 7 }, (_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-8 rounded-lg ${i < (user?.streak || 3) ? "bg-orange-400" : "bg-gray-100"}`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-500">{user?.streak} day streak — keep going for bonus credits!</p>
          </div>

          {/* Badges */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-semibold">Your Badges</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {userBadges.map(b => (
                <div key={b.id} className="flex flex-col items-center gap-1">
                  <span className="text-2xl">{b.id}</span>
                  <span className="text-xs text-gray-500">{b.name}</span>
                </div>
              ))}
              {BADGES.filter(b => !user?.badges.includes(b.id)).slice(0, 3).map(b => (
                <div key={b.id} className="flex flex-col items-center gap-1 opacity-30">
                  <span className="text-2xl">{b.id}</span>
                  <span className="text-xs text-gray-500">{b.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick demo: trigger sale notification */}
          <div className="bg-black text-white rounded-2xl p-6 md:col-span-2">
            <h2 className="text-sm font-semibold mb-2">Simulate a Sale 🎉</h2>
            <p className="text-xs text-gray-400 mb-4">See what happens when someone buys your design</p>
            <button
              onClick={triggerSaleNotification}
              className="bg-white text-black px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              Trigger Sale Notification
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
