"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Wand2, Package } from "lucide-react";

interface StoreProduct {
  id: number;
  name: string;
  thumbnail_url: string;
  variants: number;
  synced: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/printful/store-products")
      .then(r => r.json())
      .then(data => { setProducts(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <main className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-gray-400 mt-2">Choose a product and make it yours with AI design</p>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100">
                <div className="aspect-square skeleton" />
                <div className="p-5 space-y-2">
                  <div className="h-4 w-2/3 skeleton rounded" />
                  <div className="h-3 w-1/3 skeleton rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <Package className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-700 mb-2">No products yet</h2>
            <p className="text-gray-400 text-sm">Add products to your Printful store to see them here.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all"
              >
                <div className="aspect-square overflow-hidden bg-gray-50">
                  {product.thumbnail_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.thumbnail_url}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-12 h-12 text-gray-200" />
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-sm leading-tight">{product.name}</h3>
                  <p className="text-xs text-gray-400 mt-1">{product.synced} variants available</p>
                  <div className="mt-4 flex items-center gap-1.5 text-indigo-500 text-sm font-medium group-hover:gap-2.5 transition-all">
                    <Wand2 className="w-3.5 h-3.5" />
                    Design this
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
