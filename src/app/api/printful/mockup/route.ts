import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { designUrl, colorName } = await req.json();

  const host = req.headers.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  const proxyImageUrl = `${protocol}://${host}/api/image-proxy?url=${encodeURIComponent(designUrl)}`;

  // Fetch Bella+Canvas 3001 variants (catalog product ID: 71)
  const productRes = await fetch("https://api.printful.com/products/71", {
    headers: { Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}` },
  });
  const productData = await productRes.json();
  const variants: { id: number; size: string; color: string }[] = productData.result.variants;

  // Find M size variant matching the color name (fallback to first M)
  const matched =
    variants.find(v => v.size === "M" && v.color.toLowerCase() === colorName.toLowerCase()) ??
    variants.find(v => v.size === "M") ??
    variants[0];

  // Create mockup generation task — URL uses product ID (71), variant IDs go in body
  const taskRes = await fetch(
    `https://api.printful.com/mockup-generator/create-task/71`,
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
