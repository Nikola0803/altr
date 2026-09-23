import { NextRequest, NextResponse } from "next/server";
import { createWooOrder, isWooCommerceConfigured, CheckoutLine, CheckoutCustomer } from "@/lib/woocommerce";

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
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error creating order.";
    return NextResponse.json({ error: "order_creation_failed", message }, { status: 502 });
  }
}
