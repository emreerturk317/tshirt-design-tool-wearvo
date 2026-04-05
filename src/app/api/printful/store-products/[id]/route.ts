import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const res = await fetch(`https://api.printful.com/store/products/${id}`, {
    headers: {
      Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}`,
      "X-PF-Store-Id": process.env.PRINTFUL_STORE_ID ?? "",
    },
    next: { revalidate: 3600 },
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json({ error: "Product not found" }, { status: res.status });
  }

  const { sync_product, sync_variants } = data.result;

  const COLOR_HEX: Record<string, string> = {
    "Black": "#1a1a1a", "White": "#ffffff", "Navy": "#1f2d5a",
    "Pink": "#f4a7b9", "Red": "#cc0000", "Blue": "#1a4fa0",
    "Green": "#2d6a2d", "Gray": "#808080", "Grey": "#808080",
    "Athletic Heather": "#c8c8c8", "Dark Grey Heather": "#555555",
    "Heather Red": "#c0504d", "Heather Mauve": "#b07080",
    "Heather Blue Lagoon": "#4a90a4", "Heather Stone": "#b0a898",
    "Leaf": "#5a7a4a", "Purple": "#6a0dad", "Yellow": "#f5c518",
    "Orange": "#f97316", "Brown": "#7c4a03",
  };

  // Extract unique colors (with hex) and sizes
  const colorMap = new Map<string, { name: string; hex: string }>();
  const sizeSet = new Set<string>();

  // Collect all unique preview URLs from all variants' files
  const allPreviews = new Set<string>();

  // Per-color: first preview URL found for that color
  const colorPreviewMap = new Map<string, string>();

  for (const v of sync_variants) {
    if (v.color && !colorMap.has(v.color)) {
      const hex = v.color_code ?? COLOR_HEX[v.color] ?? "#888888";
      colorMap.set(v.color, { name: v.color, hex });
    }
    if (v.size) sizeSet.add(v.size);

    // Collect preview files
    if (Array.isArray(v.files)) {
      for (const f of v.files) {
        if (f.type === "preview" && f.preview_url) {
          allPreviews.add(f.preview_url);
          if (v.color && !colorPreviewMap.has(v.color)) {
            colorPreviewMap.set(v.color, f.preview_url);
          }
        }
      }
    }
  }

  const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "One Size"];
  const sizes = [...sizeSet].sort(
    (a, b) => SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b)
  );

  // Full gallery: thumbnail first, then all unique previews
  const gallery = [
    sync_product.thumbnail_url,
    ...[...allPreviews],
  ].filter((url, i, arr): url is string => !!url && arr.indexOf(url) === i);

  return NextResponse.json({
    id: sync_product.id,
    name: sync_product.name,
    thumbnail: sync_product.thumbnail_url,
    gallery,
    colors: [...colorMap.values()].map(c => ({
      ...c,
      image: colorPreviewMap.get(c.name) ?? null,
    })),
    sizes,
    variants: sync_variants.map((v: {
      id: number;
      variant_id: number;
      color: string;
      size: string;
      retail_price: string;
      files?: { type: string; preview_url?: string }[];
    }) => ({
      id: v.id,
      variantId: v.variant_id,
      color: v.color,
      size: v.size,
      price: v.retail_price,
      image: v.files?.find(f => f.type === "preview")?.preview_url ?? null,
    })),
  });
}
