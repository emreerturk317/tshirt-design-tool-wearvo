import { NextRequest, NextResponse } from "next/server";

const PRINTFUL_API = "https://api.printful.com";

// Unisex Staple T-Shirt (Bella + Canvas 3001) — fallback catalog variant IDs per size
const FALLBACK_SIZE_TO_VARIANT: Record<string, number> = {
  XS: 4011,
  S: 4012,
  M: 4013,
  L: 4014,
  XL: 4015,
  "2XL": 4016,
  "3XL": 4017,
};

async function getVariantId(productId: string, colorName: string, size: string): Promise<number> {
  const res = await fetch(`https://api.printful.com/store/products/${productId}`, {
    headers: { Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}` },
  });
  const data = await res.json();
  const variants: { id: number; variant_id: number; color: string; size: string }[] =
    data.result?.sync_variants ?? [];

  const match =
    variants.find(v => v.size === size && v.color.toLowerCase() === colorName.toLowerCase()) ??
    variants.find(v => v.size === size) ??
    variants[0];

  return match?.variant_id ?? FALLBACK_SIZE_TO_VARIANT[size] ?? 4013;
}

export async function POST(req: NextRequest) {
  const { designUrl, size, color, colorName, productId, recipient } = await req.json();

  if (!designUrl || !size || !recipient) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const host = req.headers.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  const proxyImageUrl = `${protocol}://${host}/api/image-proxy?url=${encodeURIComponent(designUrl)}`;

  let variantId: number;
  if (productId) {
    variantId = await getVariantId(productId, colorName ?? color, size);
  } else {
    variantId = FALLBACK_SIZE_TO_VARIANT[size] ?? 4013;
  }

  const body = {
    recipient,
    items: [
      {
        variant_id: variantId,
        quantity: 1,
        files: [
          {
            type: "front",
            url: proxyImageUrl,
          },
        ],
      },
    ],
  };

  const res = await fetch(`${PRINTFUL_API}/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json({ error: data.error?.message ?? "Printful error" }, { status: res.status });
  }

  return NextResponse.json({ orderId: data.result.id, status: data.result.status });
}
