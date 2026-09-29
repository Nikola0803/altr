declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export function pixelTrack(event: string, data?: Record<string, unknown>) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  window.fbq("track", event, data);
}
