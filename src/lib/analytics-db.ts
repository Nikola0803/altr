const SUPABASE_URL = process.env.ANALYTICS_SUPABASE_URL;
const SUPABASE_KEY = process.env.ANALYTICS_SUPABASE_SERVICE_KEY;

export function isAnalyticsConfigured(): boolean {
  return !!(SUPABASE_URL && SUPABASE_KEY);
}

async function sbFetch(path: string, options?: RequestInit): Promise<unknown> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return null;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
      ...options,
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
        ...(options?.headers ?? {}),
      },
    });
    if (!res.ok) return null;
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}

export interface AnalyticsEvent {
  event_type: string;
  session_id: string;
  page_path: string;
  page_title?: string;
  referrer?: string;
  referrer_domain?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  traffic_source?: string;
  device_type?: string;
  os?: string;
  browser?: string;
  screen_width?: number;
  element_tag?: string;
  element_text?: string;
  element_href?: string;
  order_id?: string;
  order_value?: number;
  order_currency?: string;
  is_new_session?: boolean;
}

export async function insertEvent(event: AnalyticsEvent): Promise<void> {
  await sbFetch("analytics_events", { method: "POST", body: JSON.stringify(event) });
}

export type RawEvent = AnalyticsEvent & { id: number; created_at: string };

export async function fetchEvents(fromIso: string, toIso: string): Promise<RawEvent[]> {
  const result = await sbFetch(
    `analytics_events?created_at=gte.${encodeURIComponent(fromIso)}&created_at=lte.${encodeURIComponent(toIso)}&order=created_at.desc&limit=50000`,
    { headers: { Prefer: "return=representation" } }
  );
  return (result as RawEvent[] | null) ?? [];
}
