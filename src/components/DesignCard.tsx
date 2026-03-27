"use client";
import { Design } from "@/lib/data";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Globe, Lock } from "lucide-react";

export default function DesignCard({ design }: { design: Design }) {
  return (
    <Link href={`/product/${design.id}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl bg-gray-50 aspect-square">
        <div
          className="absolute inset-0 opacity-30"
          style={{ backgroundColor: design.color }}
        />
        <Image
          src={design.imageUrl}
          alt={design.title}
          fill
          className="object-cover mix-blend-overlay group-hover:scale-105 transition-transform duration-500"
          unoptimized
        />
        <div className="absolute top-3 right-3">
          {design.isPublic
            ? <Globe className="w-3.5 h-3.5 text-white/70" />
            : <Lock className="w-3.5 h-3.5 text-white/70" />
          }
        </div>
      </div>
      <div className="mt-3 px-1">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-semibold text-black leading-tight">{design.title}</h3>
            <p className="text-xs text-gray-400 mt-0.5">by {design.creator}</p>
          </div>
          <span className="text-sm font-bold text-black">${design.price}</span>
        </div>
        <div className="flex items-center gap-1 mt-1.5">
          <ShoppingBag className="w-3 h-3 text-gray-400" />
          <span className="text-xs text-gray-400">{design.sales} sold</span>
        </div>
      </div>
    </Link>
  );
}
