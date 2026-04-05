import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch("https://api.printful.com/store/products", {
    headers: {
      Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}`,
    },
    next: { revalidate: 3600 },
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: res.status });
  }

  return NextResponse.json(data.result);
}
