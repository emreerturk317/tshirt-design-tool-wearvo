import { NextRequest, NextResponse } from "next/server";

const PRINTFUL_API = "https://api.printful.com";

export async function POST(req: NextRequest) {
  const { designUrl, size, color, recipient } = await req.json();

  if (!designUrl || !size || !recipient) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Unisex Staple T-Shirt (Bella + Canvas 3001) — Printful variant IDs per size
  const sizeToVariant: Record<string, number> = {
    XS: 4011,
    S: 4012,
    M: 4013,
    L: 4014,
    XL: 4015,
    "2XL": 4016,
    "3XL": 4017,
  };

  const variantId = sizeToVariant[size] ?? 4013;

  const body = {
    recipient,
    items: [
      {
        variant_id: variantId,
        quantity: 1,
        files: [
          {
            type: "front",
            url: designUrl,
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
