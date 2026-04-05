"use client";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Wand2, ChevronLeft, ChevronRight } from "lucide-react";

interface ProductVariant {
  id: number;
  variantId: number;
  color: string;
  size: string;
  price: string;
  image: string | null;
}

interface ProductDetail {
  id: number;
  name: string;
  thumbnail: string;
  colors: { name: string; hex: string }[];
  sizes: string[];
  variants: ProductVariant[];
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string } | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    fetch(`/api/printful/store-products/${id}`)
      .then(r => r.json())
      .then(data => {
        setProduct(data);
        if (data.colors?.length) setSelectedColor(data.colors[0]);
        if (data.sizes?.length) setSelectedSize(data.sizes[0]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <main className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-500 rounded-full animate-spin" />
      </main>
    );
  }

  if (!product) {
    return (
      <main className="pt-16 min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Product not found.</p>
      </main>
    );
  }

  // Collect unique photos from variants
  const photos = [
    product.thumbnail,
    ...product.variants
      .map(v => v.image)
      .filter((img): img is string => !!img),
  ].filter((url, i, arr) => url && arr.indexOf(url) === i).slice(0, 8);

  const handleStartDesigning = () => {
    if (!selectedColor || !selectedSize) return;
    const params = new URLSearchParams({
      productId: String(product.id),
      colorName: selectedColor.name,
      colorHex: selectedColor.hex,
      size: selectedSize,
    });
    router.push(`/design?${params.toString()}`);
  };

  return (
    <main className="pt-16 min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <button
          onClick={() => router.push("/products")}
          className="text-sm text-gray-400 hover:text-black flex items-center gap-1 mb-8 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Products
        </button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Photo Gallery */}
          <div className="space-y-3">
            <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 relative">
              {photos.length > 0 ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photos[photoIndex]}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-200">
                  No image
                </div>
              )}
              {photos.length > 1 && (
                <>
                  <button
                    onClick={() => setPhotoIndex(i => Math.max(0, i - 1))}
                    disabled={photoIndex === 0}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow disabled:opacity-30 hover:bg-white transition"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPhotoIndex(i => Math.min(photos.length - 1, i + 1))}
                    disabled={photoIndex === photos.length - 1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow disabled:opacity-30 hover:bg-white transition"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
            {/* Thumbnails */}
            {photos.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {photos.map((photo, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={photo}
                    alt=""
                    onClick={() => setPhotoIndex(i)}
                    className={`w-16 h-16 rounded-lg object-contain bg-gray-50 cursor-pointer flex-shrink-0 transition-all ${
                      photoIndex === i ? "ring-2 ring-indigo-500" : "opacity-60 hover:opacity-100"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold">{product.name}</h1>
              <p className="text-2xl font-semibold text-gray-900 mt-2">
                ${product.variants[0]?.price ?? "24.99"}
              </p>
            </div>

            <p className="text-sm text-gray-500 leading-relaxed">
              Create your own unique design using AI or upload your own artwork. Your design will be professionally printed and shipped directly to you.
            </p>

            {/* Color Selection */}
            {product.colors.length > 0 && (
              <div>
                <p className="text-sm font-semibold mb-3">
                  Color — <span className="font-normal text-gray-500">{selectedColor?.name}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map(c => (
                    <button
                      key={c.name}
                      title={c.name}
                      onClick={() => setSelectedColor(c)}
                      className={`w-8 h-8 rounded-full transition-all ${
                        selectedColor?.name === c.name
                          ? "ring-2 ring-indigo-500 ring-offset-2 scale-110"
                          : "hover:scale-105"
                      }`}
                      style={{
                        backgroundColor: c.hex,
                        border: c.hex === "#ffffff" || c.hex === "#fff" ? "1.5px solid #e5e7eb" : "none",
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes.length > 0 && (
              <div>
                <p className="text-sm font-semibold mb-3">Size</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                        selectedSize === size
                          ? "bg-black text-white border-black"
                          : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleStartDesigning}
              disabled={!selectedColor || !selectedSize}
              className="w-full flex items-center justify-center gap-2 bg-indigo-500 text-white py-4 rounded-2xl font-semibold hover:bg-indigo-600 transition-colors disabled:opacity-40"
            >
              <Wand2 className="w-5 h-5" />
              Start Designing
            </button>

            <div className="border-t border-gray-100 pt-4 space-y-2 text-xs text-gray-400">
              <p>✓ Printed on demand — no inventory</p>
              <p>✓ Shipped worldwide via Printful</p>
              <p>✓ Your design, your style</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
