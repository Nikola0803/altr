"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { initAnalytics, trackPageView } from "@/lib/analytics-collector";

let booted = false;

export function AnalyticsScript() {
  const pathname = usePathname();

  useEffect(() => {
    if (!booted) {
      booted = true;
      // Defer slightly so it never blocks paint
      setTimeout(initAnalytics, 0);
    } else {
      trackPageView();
    }
  }, [pathname]);

  return null;
}
