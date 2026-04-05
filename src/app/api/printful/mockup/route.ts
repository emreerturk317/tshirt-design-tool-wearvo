import { NextRequest, NextResponse } from "next/server";

async function getCatalogProductId(storeProductId: string): Promise<number> {
  const res = await fetch(`https://api.printful.com/store/products/${storeProductId}`, {
    headers: { Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}` },
  });
  const data = await res.json();
  // sync_variants[0].product.product_id is the catalog product ID
  return data.result?.sync_variants?.[0]?.product?.product_id ?? 71;
}

export async function POST(req: NextRequest) {
  const { designUrl, colorName, productId } = await req.json();

  const host = req.headers.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  const proxyImageUrl = `${protocol}://${host}/api/image-proxy?url=${encodeURIComponent(designUrl)}`;

  // Determine which catalog product to use for mockup generation
  let catalogProductId = 71; // default: Bella+Canvas 3001
  if (productId) {
    catalogProductId = await getCatalogProductId(productId);
  }

  // Fetch catalog product variants to find the right one by color
  const productRes = await fetch(`https://api.printful.com/products/${catalogProductId}`, {
    headers: { Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}` },
  });
  const productData = await productRes.json();
  const variants: { id: number; size: string; color: string }[] = productData.result.variants;

  // Find M size variant matching the color name (fallback to first M, then first)
  const matched =
    variants.find(v => v.size === "M" && v.color.toLowerCase() === colorName.toLowerCase()) ??
    variants.find(v => v.size === "M") ??
    variants[0];

  const taskRes = await fetch(
    `https://api.printful.com/mockup-generator/create-task/${catalogProductId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        variant_ids: [matched.id],
        files: [
          {
            placement: "front",
            image_url: proxyImageUrl,
            position: {
              area_width: 1800,
              area_height: 2400,
              width: 1500,
              height: 1500,
              top: 400,
              left: 150,
            },
          },
        ],
        format: "jpg",
      }),
    }
  );

  const taskData = await taskRes.json();

  if (!taskRes.ok) {
    return NextResponse.json(
      { error: taskData.error?.message ?? "Failed to create mockup task", raw: taskData },
      { status: taskRes.status }
    );
  }

  if (!taskData.result?.task_key) {
    return NextResponse.json({ error: "No task_key in response", raw: taskData }, { status: 500 });
  }

  return NextResponse.json({ taskKey: taskData.result.task_key });
}
