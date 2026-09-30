import { NextRequest, NextResponse } from "next/server";
import { insertEvent, isAnalyticsConfigured, type AnalyticsEvent } from "@/lib/analytics-db";

const ALLOWED_EVENTS = new Set(["pageview", "click", "purchase"]);

export async function POST(req: NextRequest) {
  if (!isAnalyticsConfigured()) return NextResponse.json({ ok: false }, { status: 200 });

  let body: AnalyticsEvent;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (!ALLOWED_EVENTS.has(body.event_type)) return NextResponse.json({ ok: false }, { status: 400 });

  // Scrub to only known fields
  const event: AnalyticsEvent = {
    event_type: String(body.event_type).slice(0, 50),
    session_id: String(body.session_id || "").slice(0, 100),
    page_path: String(body.page_path || "").slice(0, 500),
    page_title: String(body.page_title || "").slice(0, 300),
    referrer: String(body.referrer || "").slice(0, 500),
    referrer_domain: String(body.referrer_domain || "").slice(0, 200),
    utm_source: String(body.utm_source || "").slice(0, 100),
    utm_medium: String(body.utm_medium || "").slice(0, 100),
    utm_campaign: String(body.utm_campaign || "").slice(0, 200),
    utm_content: String(body.utm_content || "").slice(0, 200),
    utm_term: String(body.utm_term || "").slice(0, 200),
    traffic_source: String(body.traffic_source || "direct").slice(0, 50),
    device_type: String(body.device_type || "").slice(0, 20),
    os: String(body.os || "").slice(0, 50),
    browser: String(body.browser || "").slice(0, 50),
    screen_width: typeof body.screen_width === "number" ? Math.min(body.screen_width, 9999) : undefined,
    is_new_session: Boolean(body.is_new_session),
    // click fields
    element_tag: body.element_tag ? String(body.element_tag).slice(0, 20) : undefined,
    element_text: body.element_text ? String(body.element_text).slice(0, 120) : undefined,
    element_href: body.element_href ? String(body.element_href).slice(0, 500) : undefined,
    // purchase fields
    order_id: body.order_id ? String(body.order_id).slice(0, 100) : undefined,
    order_value: typeof body.order_value === "number" ? body.order_value : undefined,
    order_currency: body.order_currency ? String(body.order_currency).slice(0, 3) : undefined,
  };

  await insertEvent(event);
  return NextResponse.json({ ok: true }, { status: 200 });
}
