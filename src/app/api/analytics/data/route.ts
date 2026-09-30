import { NextRequest, NextResponse } from "next/server";
import { fetchEvents, isAnalyticsConfigured, type RawEvent } from "@/lib/analytics-db";

const PASSWORD = process.env.ANALYTICS_PASSWORD;

function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}

function rangeFromParam(range: string): { from: Date; to: Date } {
  const to = new Date();
  const from = new Date(to);
  switch (range) {
    case "today": from.setHours(0, 0, 0, 0); break;
    case "7d": from.setDate(from.getDate() - 7); break;
    case "90d": from.setDate(from.getDate() - 90); break;
    default: from.setDate(from.getDate() - 30); break; // 30d default
  }
  return { from, to };
}

function topN<T extends string>(map: Map<T, number>, n = 10): { label: T; count: number }[] {
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([label, count]) => ({ label, count }));
}

export async function GET(req: NextRequest) {
  if (PASSWORD) {
    const key = req.nextUrl.searchParams.get("key") ?? req.headers.get("x-analytics-key") ?? "";
    if (key !== PASSWORD) return unauthorized();
  }
  if (!isAnalyticsConfigured()) return NextResponse.json({ error: "not_configured" }, { status: 503 });

  const range = req.nextUrl.searchParams.get("range") ?? "30d";
  const { from, to } = rangeFromParam(range);
  const events = await fetchEvents(from.toISOString(), to.toISOString());

  const pageviews = events.filter(e => e.event_type === "pageview");
  const clicks = events.filter(e => e.event_type === "click");
  const purchases = events.filter(e => e.event_type === "purchase");

  // Unique sessions
  const allSessions = new Set(events.map(e => e.session_id));
  const newSessions = new Set(events.filter(e => e.is_new_session).map(e => e.session_id));

  // Revenue
  const totalRevenue = purchases.reduce((sum, e) => sum + (e.order_value ?? 0), 0);
  const avgOrderValue = purchases.length ? totalRevenue / purchases.length : 0;

  // Daily visits (last N days)
  const dailyMap = new Map<string, { visits: number; sessions: Set<string> }>();
  for (const e of pageviews) {
    const day = e.created_at.slice(0, 10);
    if (!dailyMap.has(day)) dailyMap.set(day, { visits: 0, sessions: new Set() });
    const d = dailyMap.get(day)!;
    d.visits++;
    d.sessions.add(e.session_id);
  }
  const dailyVisits = [...dailyMap.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, d]) => ({ date, visits: d.visits, uniqueVisitors: d.sessions.size }));

  // Top pages
  const pageMap = new Map<string, number>();
  for (const e of pageviews) pageMap.set(e.page_path, (pageMap.get(e.page_path) ?? 0) + 1);
  const topPages = topN(pageMap, 15).map(({ label, count }) => ({ path: label, visits: count }));

  // Traffic sources — sessions
  const sourceSessionMap = new Map<string, Set<string>>();
  const sourceRevenueMap = new Map<string, number>();
  for (const e of events) {
    const src = e.traffic_source || "direct";
    if (!sourceSessionMap.has(src)) sourceSessionMap.set(src, new Set());
    sourceSessionMap.get(src)!.add(e.session_id);
  }
  for (const e of purchases) {
    const src = e.traffic_source || "direct";
    sourceRevenueMap.set(src, (sourceRevenueMap.get(src) ?? 0) + (e.order_value ?? 0));
  }
  const trafficSources = [...sourceSessionMap.entries()]
    .sort((a, b) => b[1].size - a[1].size)
    .map(([source, sessions]) => ({ source, visits: sessions.size, revenue: sourceRevenueMap.get(source) ?? 0 }));

  // Devices
  const deviceMap = new Map<string, number>();
  for (const e of pageviews) deviceMap.set(e.device_type || "unknown", (deviceMap.get(e.device_type || "unknown") ?? 0) + 1);
  const devices = [...deviceMap.entries()].map(([type, count]) => ({ type, count })).sort((a, b) => b.count - a.count);

  // Top referrers (excluding empty / same site)
  const refMap = new Map<string, number>();
  for (const e of pageviews) {
    const d = e.referrer_domain;
    if (d && d !== "altrpeptides.com") refMap.set(d, (refMap.get(d) ?? 0) + 1);
  }
  const topReferrers = topN(refMap, 10).map(({ label, count }) => ({ domain: label, visits: count }));

  // UTM Campaigns
  const campaignKey = (e: RawEvent) => [e.utm_campaign || "(none)", e.utm_source || "", e.utm_medium || ""].join("|");
  const campaignVisitMap = new Map<string, number>();
  const campaignRevenueMap = new Map<string, number>();
  for (const e of pageviews) {
    const k = campaignKey(e);
    campaignVisitMap.set(k, (campaignVisitMap.get(k) ?? 0) + 1);
  }
  for (const e of purchases) {
    const k = campaignKey(e);
    campaignRevenueMap.set(k, (campaignRevenueMap.get(k) ?? 0) + (e.order_value ?? 0));
  }
  const campaigns = [...campaignVisitMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([key, visits]) => {
      const [campaign, source, medium] = key.split("|");
      return { campaign, source, medium, visits, revenue: campaignRevenueMap.get(key) ?? 0 };
    });

  // Recent purchases with attribution
  const recentPurchases = purchases.slice(0, 25).map(e => ({
    orderId: e.order_id,
    value: e.order_value,
    currency: e.order_currency ?? "CAD",
    source: e.traffic_source ?? "direct",
    campaign: e.utm_campaign,
    page: e.page_path,
    createdAt: e.created_at,
  }));

  // Top clicked elements
  const clickMap = new Map<string, number>();
  for (const e of clicks) {
    const label = e.element_text?.slice(0, 60) || e.element_href || e.element_tag || "unknown";
    clickMap.set(label, (clickMap.get(label) ?? 0) + 1);
  }
  const topClicks = topN(clickMap, 10).map(({ label, count }) => ({ label, count }));

  return NextResponse.json({
    overview: {
      totalVisits: pageviews.length,
      uniqueVisitors: allSessions.size,
      newVisitors: newSessions.size,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      avgOrderValue: Math.round(avgOrderValue * 100) / 100,
      purchases: purchases.length,
      totalClicks: clicks.length,
    },
    dailyVisits,
    topPages,
    trafficSources,
    devices,
    topReferrers,
    campaigns,
    recentPurchases,
    topClicks,
    generatedAt: new Date().toISOString(),
  });
}
