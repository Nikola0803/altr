import { NextRequest, NextResponse } from "next/server";
import { fetchEvents, isAnalyticsConfigured } from "@/lib/analytics-db";

const PASSWORD = process.env.ANALYTICS_PASSWORD;

export async function GET(req: NextRequest) {
  if (PASSWORD) {
    const key = req.nextUrl.searchParams.get("key") ?? req.headers.get("x-analytics-key") ?? "";
    if (key !== PASSWORD) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!isAnalyticsConfigured()) return NextResponse.json({ error: "not_configured" }, { status: 503 });

  const range = req.nextUrl.searchParams.get("range") ?? "30d";
  const to = new Date();
  const from = new Date(to);
  if (range === "today") from.setHours(0, 0, 0, 0);
  else if (range === "7d") from.setDate(from.getDate() - 7);
  else if (range === "90d") from.setDate(from.getDate() - 90);
  else from.setDate(from.getDate() - 30);

  const events = await fetchEvents(from.toISOString(), to.toISOString());

  const headers = [
    "id", "event_type", "created_at", "session_id", "page_path", "page_title",
    "traffic_source", "referrer_domain", "utm_source", "utm_medium", "utm_campaign",
    "device_type", "os", "browser", "screen_width",
    "order_id", "order_value", "order_currency",
    "element_tag", "element_text", "element_href",
  ];

  const escape = (v: unknown) => {
    const s = v == null ? "" : String(v);
    if (s.includes(",") || s.includes('"') || s.includes("\n")) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };

  const rows = events.map(e =>
    headers.map(h => escape((e as unknown as Record<string, unknown>)[h])).join(",")
  );

  const csv = [headers.join(","), ...rows].join("\n");
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="altr-analytics-${range}-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
