const WP_URL = process.env.WORDPRESS_URL;
const ANALYTICS_SECRET = process.env.ANALYTICS_SECRET;

export function isAnalyticsConfigured(): boolean {
  return !!WP_URL;
}

function wpFetch(path: string, options?: RequestInit): Promise<unknown> {
  if (!WP_URL) return Promise.resolve(null);
  return fetch(`${WP_URL}/wp-json/altr/v1/${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-Analytics-Key": ANALYTICS_SECRET ?? "",
      ...(options?.headers ?? {}),
    },
  })
    .then(r => (r.ok ? r.json().catch(() => null) : null))
    .catch(() => null);
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
  await wpFetch("analytics", { method: "POST", body: JSON.stringify(event) });
}

export type RawEvent = AnalyticsEvent & { id: number; created_at: string };

export async function fetchEvents(fromIso: string, toIso: string): Promise<RawEvent[]> {
  const result = await wpFetch(
    `analytics?from=${encodeURIComponent(fromIso)}&to=${encodeURIComponent(toIso)}`
  );
  return (result as RawEvent[] | null) ?? [];
}
