"use client";
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import DesignCard from "@/components/DesignCard";
import { Search } from "lucide-react";

export default function ExplorePage() {
  const { designs } = useApp();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"trending" | "newest" | "popular">("trending");

  const filtered = designs
    .filter(d => d.isPublic && (
      !query || d.title.toLowerCase().includes(query.toLowerCase()) ||
      d.creator.toLowerCase().includes(query.toLowerCase())
    ))
    .sort((a, b) => {
      if (sort === "trending") return b.sales - a.sales;
      if (sort === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return b.sales - a.sales;
    });

  return (
    <main className="pt-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Explore</h1>
          <p className="text-gray-400">Discover designs from creators worldwide</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search designs or creators..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-50"
            />
          </div>
          <div className="flex gap-2">
            {(["trending", "newest", "popular"] as const).map(s => (
              <button
                key={s}
                onClick={() => setSort(s)}
                className={`px-4 py-2.5 rounded-full text-sm font-medium capitalize transition-colors ${
                  sort === s ? "bg-black text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-gray-400 mb-6">{filtered.length} designs</p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map(d => <DesignCard key={d.id} design={d} />)}
        </div>
      </div>
    </main>
  );
}
