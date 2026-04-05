import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const res = await fetch(`https://api.printful.com/store/products/${id}`, {
    headers: { Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}` },
    next: { revalidate: 3600 },
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json({ error: "Product not found" }, { status: res.status });
  }

  const { sync_product, sync_variants } = data.result;

  // Extract unique colors and sizes from variants
  const colorMap = new Map<string, { name: string; hex: string }>();
  const sizeSet = new Set<string>();

  for (const v of sync_variants) {
    if (v.color && v.color_code && !colorMap.has(v.color)) {
      colorMap.set(v.color, { name: v.color, hex: v.color_code });
    }
    if (v.size) sizeSet.add(v.size);
  }

  const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "One Size"];
  const sizes = [...sizeSet].sort(
    (a, b) => SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b)
  );

  return NextResponse.json({
    id: sync_product.id,
    name: sync_product.name,
    thumbnail: sync_product.thumbnail_url,
    colors: [...colorMap.values()],
    sizes,
    variants: sync_variants.map((v: {
      id: number;
      variant_id: number;
      color: string;
      size: string;
      retail_price: string;
      product?: { image?: string };
    }) => ({
      id: v.id,
      variantId: v.variant_id,
      color: v.color,
      size: v.size,
      price: v.retail_price,
      image: v.product?.image ?? null,
    })),
  });
}
