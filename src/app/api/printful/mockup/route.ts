import { NextRequest, NextResponse } from "next/server";

async function getCatalogInfo(storeProductId: string): Promise<{ catalogProductId: number; variantId: number | null }> {
  const res = await fetch(`https://api.printful.com/store/products/${storeProductId}`, {
    headers: {
      Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}`,
      "X-PF-Store-Id": process.env.PRINTFUL_STORE_ID ?? "",
    },
  });
  const data = await res.json();
  const firstVariant = data.result?.sync_variants?.[0];
  return {
    catalogProductId: firstVariant?.product?.product_id ?? 71,
    variantId: firstVariant?.variant_id ?? null,
  };
}

async function getPlacement(catalogProductId: number, variantId: number): Promise<string> {
  const res = await fetch(`https://api.printful.com/mockup-generator/templates/${catalogProductId}`, {
    headers: { Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}` },
  });
  const data = await res.json();
  const mapping = data.result?.variant_mapping?.find(
    (m: { variant_id: number }) => m.variant_id === variantId
  );
  const placements: string[] = mapping?.templates?.map((t: { placement: string }) => t.placement) ?? [];
  // Prefer "front", then "default", then first available
  return placements.find(p => p === "front") ?? placements.find(p => p === "default") ?? placements[0] ?? "front";
}

export async function POST(req: NextRequest) {
  const { designUrl, colorName, productId } = await req.json();

  const host = req.headers.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  const proxyImageUrl = `${protocol}://${host}/api/image-proxy?url=${encodeURIComponent(designUrl)}`;

  // Determine catalog product ID
  let catalogProductId = 71;
  let storeVariantId: number | null = null;
  if (productId) {
    const info = await getCatalogInfo(productId);
    catalogProductId = info.catalogProductId;
    storeVariantId = info.variantId;
  }

  // Find the right catalog variant by color
  const productRes = await fetch(`https://api.printful.com/products/${catalogProductId}`, {
    headers: { Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}` },
  });
  const productData = await productRes.json();
  const variants: { id: number; size: string; color: string }[] = productData.result?.variants ?? [];

  const matched =
    variants.find(v => v.size === "M" && v.color.toLowerCase() === colorName?.toLowerCase()) ??
    variants.find(v => v.size === "M") ??
    (storeVariantId ? variants.find(v => v.id === storeVariantId) : null) ??
    variants[0];

  if (!matched) {
    return NextResponse.json({ error: "No matching variant found" }, { status: 400 });
  }

  // Get correct placement for this product/variant
  const placement = await getPlacement(catalogProductId, matched.id);

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
            placement,
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
