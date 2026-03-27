"use client";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import DesignCard from "@/components/DesignCard";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function MyDesignsPage() {
  const { isLoggedIn, myDesigns } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) router.push("/login");
  }, [isLoggedIn, router]);

  return (
    <main className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">My Designs</h1>
            <p className="text-gray-400 text-sm mt-1">{myDesigns.length} designs created</p>
          </div>
          <Link href="/design" className="bg-black text-white px-4 py-2.5 rounded-full text-sm font-medium flex items-center gap-1.5 hover:bg-gray-800 transition-colors">
            <Plus className="w-4 h-4" /> New Design
          </Link>
        </div>

        {myDesigns.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-4xl mb-4">🎨</p>
            <h2 className="text-lg font-semibold mb-2">No designs yet</h2>
            <p className="text-gray-400 text-sm mb-6">Create your first AI-powered t-shirt design</p>
            <Link href="/design" className="bg-indigo-500 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-indigo-600 transition-colors">
              Start Designing
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {myDesigns.map(d => <DesignCard key={d.id} design={d} />)}
          </div>
        )}
      </div>
    </main>
  );
}
