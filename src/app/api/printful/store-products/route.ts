import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch("https://api.printful.com/store/products?limit=100", {
    headers: {
      Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}`,
      "X-PF-Store-Id": process.env.PRINTFUL_STORE_ID ?? "",
    },
    next: { revalidate: 3600 },
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: res.status });
  }

  return NextResponse.json(data.result ?? []);
}
