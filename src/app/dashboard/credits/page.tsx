"use client";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Zap, ArrowDownLeft, ShoppingBag } from "lucide-react";

const MOCK_TRANSACTIONS = [
  { id: 1, type: "earned", desc: "Tokyo Nights sold — @mia_designs design", amount: 2.00, date: "2026-03-25" },
  { id: 2, type: "spent", desc: "Purchased Cosmic Waves (M, Black)", amount: -24.99, date: "2026-03-20" },
  { id: 3, type: "earned", desc: "Mountain Spirit sold — your design", amount: 2.00, date: "2026-03-18" },
  { id: 4, type: "earned", desc: "Mountain Spirit sold — your design", amount: 2.00, date: "2026-03-15" },
  { id: 5, type: "spent", desc: "Purchased Desert Bloom (L, Sand)", amount: -24.99, date: "2026-03-10" },
];

export default function CreditsPage() {
  const { isLoggedIn, credits } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) router.push("/login");
  }, [isLoggedIn, router]);

  return (
    <main className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold mb-2">Credits</h1>
        <p className="text-gray-400 text-sm mb-8">Earn $2 every time someone buys your design</p>

        <div className="bg-black text-white rounded-3xl p-8 text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-indigo-400" />
            <span className="text-sm text-gray-400">Available Credits</span>
          </div>
          <p className="text-5xl font-bold">${credits.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-2">Spend on any design in the store</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold">Transaction History</h2>
          </div>
          {MOCK_TRANSACTIONS.map(t => (
            <div key={t.id} className="flex items-center justify-between px-6 py-4 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  t.type === "earned" ? "bg-green-50" : "bg-gray-100"
                }`}>
                  {t.type === "earned"
                    ? <ArrowDownLeft className="w-4 h-4 text-green-500" />
                    : <ShoppingBag className="w-4 h-4 text-gray-500" />
                  }
                </div>
                <div>
                  <p className="text-sm font-medium">{t.desc}</p>
                  <p className="text-xs text-gray-400">{t.date}</p>
                </div>
              </div>
              <span className={`text-sm font-semibold ${t.amount > 0 ? "text-green-500" : "text-black"}`}>
                {t.amount > 0 ? "+" : ""}${Math.abs(t.amount).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
