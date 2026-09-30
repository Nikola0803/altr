import { NextRequest, NextResponse } from "next/server";
import { createWooOrder, isWooCommerceConfigured, CheckoutLine, CheckoutCustomer } from "@/lib/woocommerce";
import { sendPurchaseEvent } from "@/lib/meta-capi";
import { insertEvent, isAnalyticsConfigured } from "@/lib/analytics-db";

export async function POST(req: NextRequest) {
  if (!isWooCommerceConfigured()) {
    return NextResponse.json(
      {
        error: "store_not_connected",
        message:
          "This store isn't connected to WooCommerce yet. Set WORDPRESS_URL and either (WOOCOMMERCE_CONSUMER_KEY + WOOCOMMERCE_CONSUMER_SECRET) or (WORDPRESS_USERNAME + WORDPRESS_APP_PASSWORD) to enable checkout.",
      },
      { status: 501 }
    );
  }

  let body: { lines: CheckoutLine[]; customer: CheckoutCustomer };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_body", message: "Malformed request body." }, { status: 400 });
  }

  if (!body?.lines?.length || !body?.customer) {
    return NextResponse.json({ error: "invalid_body", message: "Missing cart lines or customer details." }, { status: 400 });
  }

  try {
    const result = await createWooOrder(body.lines, body.customer);

    const total = body.lines.reduce((sum, l) => sum + l.unitPrice * l.qty, 0);
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? req.headers.get("x-real-ip") ?? undefined;
    sendPurchaseEvent({
      orderId: String(result.orderId),
      value: total,
      email: body.customer.email,
      firstName: body.customer.firstName,
      lastName: body.customer.lastName,
      city: body.customer.city,
      state: body.customer.province,
      zip: body.customer.postcode,
      country: body.customer.country,
      clientIp: ip,
      userAgent: req.headers.get("user-agent") ?? undefined,
      fbp: req.cookies.get("_fbp")?.value,
      fbc: req.cookies.get("_fbc")?.value,
    });

    // Analytics purchase event (non-blocking, server-side attribution)
    if (isAnalyticsConfigured()) {
      const sessionId = req.cookies.get("altr_asid")?.value ?? req.headers.get("x-analytics-session") ?? "server";
      const fbSource = req.cookies.get("_fbc")?.value ? "meta_ads" : undefined;
      insertEvent({
        event_type: "purchase",
        session_id: sessionId,
        page_path: "/checkout",
        order_id: String(result.orderId),
        order_value: total,
        order_currency: "CAD",
        traffic_source: fbSource,
        is_new_session: false,
      }).catch(() => {});
    }

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error creating order.";
    return NextResponse.json({ error: "order_creation_failed", message }, { status: 502 });
  }
}
