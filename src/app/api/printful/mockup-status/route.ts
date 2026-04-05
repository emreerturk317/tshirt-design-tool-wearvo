import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const taskKey = req.nextUrl.searchParams.get("taskKey");
  if (!taskKey) return NextResponse.json({ error: "Missing taskKey" }, { status: 400 });

  const res = await fetch(
    `https://api.printful.com/mockup-generator/task?task_key=${taskKey}`,
    {
      headers: { Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}` },
    }
  );

  const data = await res.json();
  const status = data.result?.status;

  if (status === "completed") {
    const mockupUrl = data.result.mockups?.[0]?.mockup_url ?? null;
    return NextResponse.json({ status: "completed", mockupUrl });
  }

  if (status === "failed") {
    return NextResponse.json({ status: "failed" });
  }

  return NextResponse.json({ status: "pending" });
}
