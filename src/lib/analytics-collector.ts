"use client";

// ── Traffic source classification ────────────────────────────────────────────
function classifySource(referrer: string, utmSource: string, utmMedium: string): string {
  const src = utmSource.toLowerCase();
  const med = utmMedium.toLowerCase();
  if (src || med) {
    if (med === "cpc" || med === "paid" || med === "paid_social") {
      if (src.includes("facebook") || src.includes("meta") || src.includes("instagram")) return "meta_ads";
      if (src.includes("google")) return "google_ads";
      return "paid";
    }
    if (med === "email" || src.includes("email") || src.includes("mailchimp") || src.includes("klaviyo")) return "email";
    if (src.includes("facebook") || src.includes("instagram") || src.includes("tiktok") || src.includes("twitter") || src.includes("x.com") || src.includes("pinterest")) return "social";
    return "campaign";
  }
  if (!referrer) return "direct";
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "");
    if (host.includes("google.") || host.includes("bing.") || host.includes("yahoo.") || host.includes("duckduckgo.")) return "organic";
    if (host.includes("facebook.") || host.includes("instagram.") || host.includes("tiktok.") || host.includes("twitter.") || host.includes("x.com") || host.includes("pinterest.")) return "social";
  } catch { /* invalid URL */ }
  return "referral";
}

function getDeviceType(): "mobile" | "tablet" | "desktop" {
  const w = window.innerWidth;
  if (w < 768) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

function getOS(ua: string): string {
  if (/windows/i.test(ua)) return "Windows";
  if (/mac os x/i.test(ua)) return "macOS";
  if (/iphone|ipad/i.test(ua)) return "iOS";
  if (/android/i.test(ua)) return "Android";
  if (/linux/i.test(ua)) return "Linux";
  return "Other";
}

function getBrowser(ua: string): string {
  if (/edg\//i.test(ua)) return "Edge";
  if (/chrome/i.test(ua)) return "Chrome";
  if (/firefox/i.test(ua)) return "Firefox";
  if (/safari/i.test(ua)) return "Safari";
  return "Other";
}

function referrerDomain(ref: string): string {
  try { return new URL(ref).hostname.replace(/^www\./, ""); } catch { return ""; }
}

// ── Session / UTM persistence ────────────────────────────────────────────────
const SESSION_KEY = "altr_asid";
const UTM_KEY = "altr_utm";

function getOrCreateSession(): { sessionId: string; isNew: boolean } {
  try {
    const existing = sessionStorage.getItem(SESSION_KEY);
    if (existing) return { sessionId: existing, isNew: false };
    const id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem(SESSION_KEY, id);
    return { sessionId: id, isNew: true };
  } catch {
    return { sessionId: "unknown", isNew: false };
  }
}

interface StoredUtm { source: string; medium: string; campaign: string; content: string; term: string }

function readUtm(): StoredUtm {
  const params = new URLSearchParams(window.location.search);
  const live: StoredUtm = {
    source: params.get("utm_source") ?? "",
    medium: params.get("utm_medium") ?? "",
    campaign: params.get("utm_campaign") ?? "",
    content: params.get("utm_content") ?? "",
    term: params.get("utm_term") ?? "",
  };
  const hasLive = live.source || live.medium || live.campaign;
  if (hasLive) {
    try { sessionStorage.setItem(UTM_KEY, JSON.stringify(live)); } catch { /* */ }
    return live;
  }
  try {
    const stored = sessionStorage.getItem(UTM_KEY);
    if (stored) return JSON.parse(stored) as StoredUtm;
  } catch { /* */ }
  return live;
}

// ── Core send ────────────────────────────────────────────────────────────────
interface EventPayload {
  event_type: string;
  session_id: string;
  is_new_session: boolean;
  page_path: string;
  page_title: string;
  referrer: string;
  referrer_domain: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
  traffic_source: string;
  device_type: string;
  os: string;
  browser: string;
  screen_width: number;
  element_tag?: string;
  element_text?: string;
  element_href?: string;
  order_id?: string;
  order_value?: number;
  order_currency?: string;
}

function buildBase(isNew: boolean, sessionId: string): Omit<EventPayload, "event_type"> {
  const utm = readUtm();
  const ref = document.referrer;
  return {
    session_id: sessionId,
    is_new_session: isNew,
    page_path: window.location.pathname,
    page_title: document.title,
    referrer: ref,
    referrer_domain: referrerDomain(ref),
    utm_source: utm.source,
    utm_medium: utm.medium,
    utm_campaign: utm.campaign,
    utm_content: utm.content,
    utm_term: utm.term,
    traffic_source: classifySource(ref, utm.source, utm.medium),
    device_type: getDeviceType(),
    os: getOS(navigator.userAgent),
    browser: getBrowser(navigator.userAgent),
    screen_width: window.innerWidth,
  };
}

function send(payload: EventPayload): void {
  const body = JSON.stringify(payload);
  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/analytics/collect", new Blob([body], { type: "application/json" }));
  } else {
    fetch("/api/analytics/collect", { method: "POST", body, headers: { "Content-Type": "application/json" }, keepalive: true }).catch(() => {});
  }
}

// ── Public API ────────────────────────────────────────────────────────────────
let initialized = false;

export function trackPageView(): void {
  if (typeof window === "undefined") return;
  const { sessionId, isNew } = getOrCreateSession();
  send({ event_type: "pageview", ...buildBase(isNew, sessionId) });
}

export function trackClick(el: HTMLElement): void {
  if (typeof window === "undefined") return;
  const { sessionId } = getOrCreateSession();
  send({
    event_type: "click",
    ...buildBase(false, sessionId),
    element_tag: el.tagName.toLowerCase(),
    element_text: el.innerText?.slice(0, 120),
    element_href: (el as HTMLAnchorElement).href?.slice(0, 500) || "",
  });
}

export function trackPurchase(orderId: string, value: number, currency = "CAD"): void {
  if (typeof window === "undefined") return;
  const { sessionId } = getOrCreateSession();
  send({ event_type: "purchase", ...buildBase(false, sessionId), order_id: orderId, order_value: value, order_currency: currency });
}

export function initAnalytics(): void {
  if (typeof window === "undefined" || initialized) return;
  initialized = true;

  // Pageview on load
  trackPageView();

  // Track CTA / outbound link clicks
  document.addEventListener("click", (e) => {
    const el = (e.target as HTMLElement).closest("a, button");
    if (!el) return;
    const href = (el as HTMLAnchorElement).href ?? "";
    // Only track outbound links and buttons; skip internal nav (too noisy)
    const isOutbound = href && !href.startsWith(window.location.origin) && !href.startsWith("/") && !href.startsWith("#");
    const isButton = el.tagName === "BUTTON";
    const isCheckoutLink = href.includes("/checkout") || href.includes("/shop");
    if (isOutbound || isButton || isCheckoutLink) trackClick(el as HTMLElement);
  }, { passive: true });
}
