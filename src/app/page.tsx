"use client";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import DesignCard from "@/components/DesignCard";
import { ArrowRight, Zap, ShoppingBag, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

export default function HomePage() {
  const { designs } = useApp();
  const trending = [...designs].sort((a, b) => b.sales - a.sales).slice(0, 4);

  return (
    <main className="pt-16">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-24 md:py-36 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            <Zap className="w-3 h-3" />
            AI-Powered Design Studio
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-black leading-tight mb-6">
            Designed by you.<br />
            <span className="text-gray-400">Worn by the world.</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto mb-10">
            Create stunning t-shirt designs with AI in seconds. Publish them. Earn $2 every time someone buys your art.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/design"
              className="bg-indigo-500 text-white px-8 py-3.5 rounded-full font-medium hover:bg-indigo-600 transition-colors flex items-center gap-2 justify-center"
            >
              Start Designing <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/explore"
              className="bg-gray-100 text-black px-8 py-3.5 rounded-full font-medium hover:bg-gray-200 transition-colors"
            >
              Explore Gallery
            </Link>
          </div>
        </motion.div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-12">How it works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Zap className="w-5 h-5" />, title: "Design with AI", desc: "Type your idea, AI creates a unique design on a t-shirt mockup instantly." },
              { icon: <ShoppingBag className="w-5 h-5" />, title: "Publish & Sell", desc: "Make your design public. We handle printing, shipping, everything." },
              { icon: <DollarSign className="w-5 h-5" />, title: "Earn Credits", desc: "Get $2 credit every time someone buys your design. No cap, no limit." },
            ].map((step, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500 mb-4">
                  {step.icon}
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl font-bold">Trending this week</h2>
            <p className="text-sm text-gray-400 mt-1">Top designs by the community</p>
          </div>
          <Link href="/explore" className="text-sm text-indigo-500 hover:text-indigo-600 flex items-center gap-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {trending.map(d => <DesignCard key={d.id} design={d} />)}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black text-white py-24 text-center">
        <h2 className="text-4xl font-bold mb-4">Your next design is one prompt away.</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">Join thousands of creators who are turning ideas into passive income.</p>
        <Link href="/register" className="bg-indigo-500 text-white px-8 py-3.5 rounded-full font-medium hover:bg-indigo-600 transition-colors inline-flex items-center gap-2">
          Create Free Account <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </main>
  );
}
