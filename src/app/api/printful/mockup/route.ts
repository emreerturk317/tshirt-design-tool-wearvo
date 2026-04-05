import { NextRequest, NextResponse } from "next/server";

interface PrintArea {
  placement: string;
  area_width: number;
  area_height: number;
  print_area_width: number;
  print_area_height: number;
  print_area_top: number;
  print_area_left: number;
}

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

async function getPlacementAndPrintArea(catalogProductId: number, variantId: number): Promise<PrintArea> {
  const res = await fetch(`https://api.printful.com/mockup-generator/templates/${catalogProductId}`, {
    headers: { Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}` },
  });
  const data = await res.json();

  // Find which placement this variant uses
  const mapping = data.result?.variant_mapping?.find(
    (m: { variant_id: number }) => m.variant_id === variantId
  );
  const placements: string[] = mapping?.templates?.map((t: { placement: string }) => t.placement) ?? [];
  const placement =
    placements.find(p => p === "front") ??
    placements.find(p => p === "default") ??
    placements[0] ??
    "front";

  // Get the template for this placement to read its print area
  const templates: {
    template_id: number;
    placement?: string;
    template_width: number;
    template_height: number;
    print_area_width: number;
    print_area_height: number;
    print_area_top: number;
    print_area_left: number;
  }[] = data.result?.templates ?? [];

  // Match template by placement (templates array uses placement field or first template)
  const templateId = mapping?.templates?.find((t: { placement: string }) => t.placement === placement)?.template_id;
  const template = templates.find(t => t.template_id === templateId) ?? templates[0];

  if (!template) {
    // Fallback to safe defaults
    return { placement, area_width: 1800, area_height: 2400, print_area_width: 1080, print_area_height: 1080, print_area_top: 480, print_area_left: 360 };
  }

  return {
    placement,
    area_width: template.template_width,
    area_height: template.template_height,
    print_area_width: template.print_area_width,
    print_area_height: template.print_area_height,
    print_area_top: template.print_area_top,
    print_area_left: template.print_area_left,
  };
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

  // Get correct placement + real print area for this product
  const printArea = await getPlacementAndPrintArea(catalogProductId, matched.id);

  // Design size: 80% of print area, centered within it
  const designSize = Math.round(Math.min(printArea.print_area_width, printArea.print_area_height) * 0.8);
  const designLeft = printArea.print_area_left + Math.round((printArea.print_area_width - designSize) / 2);
  const designTop = printArea.print_area_top + Math.round((printArea.print_area_height - designSize) * 0.3);

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
            placement: printArea.placement,
            image_url: proxyImageUrl,
            position: {
              area_width: printArea.area_width,
              area_height: printArea.area_height,
              width: designSize,
              height: designSize,
              top: designTop,
              left: designLeft,
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
