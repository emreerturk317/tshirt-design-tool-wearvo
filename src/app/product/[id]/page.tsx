"use client";
import { useApp } from "@/context/AppContext";
import { MOCK_DESIGNS } from "@/lib/data";
import { useRouter } from "next/navigation";
import TShirtMockup from "@/components/TShirtMockup";
import { ShoppingBag, Globe, ArrowLeft, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];

export default function ProductPage({ params }: { params: { id: string } }) {
  const { designs, isLoggedIn, addCredits, triggerSaleNotification } = useApp();
  const design = designs.find(d => d.id === params.id) || MOCK_DESIGNS.find(d => d.id === params.id);
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState("M");
  const [bought, setBought] = useState(false);

  if (!design) {
    return (
      <main className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-4">🔍</p>
          <h2 className="text-lg font-semibold mb-2">Design not found</h2>
          <Link href="/explore" className="text-indigo-500 hover:text-indigo-600 text-sm">
            Back to Explore
          </Link>
        </div>
      </main>
    );
  }

  const handleBuy = () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    setBought(true);
    triggerSaleNotification();
    addCredits(2);
  };

  return (
    <main className="pt-16 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Link href="/explore" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-black mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Explore
        </Link>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left — Mockup */}
          <div className="bg-gray-50 rounded-3xl p-8 aspect-square flex items-center justify-center">
            <TShirtMockup color={design.color} designUrl={design.imageUrl} className="w-full max-w-xs" />
          </div>

          {/* Right — Info */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-1">{design.title}</h1>
                <p className="text-gray-400 text-sm">by @{design.creator}</p>
              </div>
              <Globe className="w-4 h-4 text-gray-400 mt-1" />
            </div>

            <p className="text-sm text-gray-500 italic mb-6">&quot;{design.prompt}&quot;</p>

            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
              <div className="flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">{design.sales} sold</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                <span className="text-sm text-gray-500">4.9</span>
              </div>
            </div>

            {/* Size */}
            <div className="mb-6">
              <p className="text-sm font-medium mb-3">Size</p>
              <div className="flex gap-2 flex-wrap">
                {SIZES.map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`w-12 h-10 rounded-lg text-sm font-medium border transition-all ${
                      selectedSize === s
                        ? "bg-black text-white border-black"
                        : "border-gray-200 text-gray-600 hover:border-gray-400"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Price + CTA */}
            <div className="flex items-center gap-4 mb-3">
              <span className="text-3xl font-bold">${design.price}</span>
              <span className="text-xs text-gray-400">Free shipping worldwide</span>
            </div>

            {bought ? (
              <div className="bg-green-50 text-green-700 rounded-2xl px-6 py-4 text-center">
                <p className="font-semibold">Order placed! 🎉</p>
                <p className="text-sm mt-0.5">Your t-shirt is being printed and will arrive in 5–7 days.</p>
              </div>
            ) : (
              <button
                onClick={handleBuy}
                className="w-full bg-indigo-500 text-white py-4 rounded-2xl font-semibold text-base hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                Buy Now — ${design.price}
              </button>
            )}

            <p className="text-xs text-center text-gray-400 mt-3">
              Printed & shipped by Printify · 30-day returns
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
