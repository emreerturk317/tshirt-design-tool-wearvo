"use client";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Package, Truck, Check } from "lucide-react";

const MOCK_ORDERS = [
  {
    id: "WV-1001",
    design: "Cosmic Waves",
    size: "M",
    color: "Black",
    status: "delivered",
    date: "2026-03-10",
    tracking: "PP123456789",
  },
  {
    id: "WV-1002",
    design: "Desert Bloom",
    size: "L",
    color: "Sand",
    status: "shipped",
    date: "2026-03-22",
    tracking: "PP987654321",
  },
  {
    id: "WV-1003",
    design: "My Design #1",
    size: "XL",
    color: "Navy",
    status: "printing",
    date: "2026-03-26",
    tracking: null,
  },
];

const STATUS_CONFIG = {
  printing: { label: "Printing", icon: <Package className="w-4 h-4" />, color: "text-amber-500 bg-amber-50" },
  shipped: { label: "Shipped", icon: <Truck className="w-4 h-4" />, color: "text-blue-500 bg-blue-50" },
  delivered: { label: "Delivered", icon: <Check className="w-4 h-4" />, color: "text-green-500 bg-green-50" },
};

export default function OrdersPage() {
  const { isLoggedIn } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) router.push("/login");
  }, [isLoggedIn, router]);

  return (
    <main className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold mb-2">My Orders</h1>
        <p className="text-gray-400 text-sm mb-8">Track your t-shirt orders</p>

        <div className="space-y-4">
          {MOCK_ORDERS.map(order => {
            const status = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG];
            return (
              <div key={order.id} className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">{order.design}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {order.size} · {order.color} · {order.date}
                    </p>
                  </div>
                  <span className={`text-xs font-medium flex items-center gap-1 px-2.5 py-1 rounded-full ${status.color}`}>
                    {status.icon}
                    {status.label}
                  </span>
                </div>

                <div className="flex gap-0 relative">
                  {["printing", "shipped", "delivered"].map((s, i) => {
                    const steps = ["printing", "shipped", "delivered"];
                    const currentIdx = steps.indexOf(order.status);
                    const isComplete = i <= currentIdx;
                    return (
                      <div key={s} className="flex-1 flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full z-10 ${isComplete ? "bg-black" : "bg-gray-200"}`} />
                        <p className={`text-xs mt-1.5 capitalize ${isComplete ? "text-black" : "text-gray-400"}`}>{s}</p>
                        {i < 2 && (
                          <div className={`absolute top-1.5 h-0.5 ${isComplete && i < currentIdx ? "bg-black" : "bg-gray-200"}`}
                            style={{ left: `${(i + 1) * 33.3}%`, width: "33.3%", transform: "translateY(-50%)" }} />
                        )}
                      </div>
                    );
                  })}
                </div>

                {order.tracking && (
                  <p className="text-xs text-gray-400 mt-4">
                    Tracking: <span className="font-mono text-black">{order.tracking}</span>
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
