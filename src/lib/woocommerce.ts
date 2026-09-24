/**
 * Headless WooCommerce connection.
 *
 * Authentication — two methods are supported; set exactly one in .env.local:
 *
 *   METHOD A — WooCommerce Consumer Key/Secret (traditional):
 *     WOOCOMMERCE_CONSUMER_KEY=ck_...
 *     WOOCOMMERCE_CONSUMER_SECRET=cs_...
 *
 *   METHOD B — WordPress Application Password (works with api.altrpeptides.com's
 *     api-lockdown.php because WP app-password auth runs before rest_authentication_errors
 *     and sets is_user_logged_in() = true, bypassing the lockdown):
 *     WORDPRESS_USERNAME=realadmin
 *     WORDPRESS_APP_PASSWORD=xxxx xxxx xxxx xxxx xxxx xxxx   (spaces ok, WP strips them)
 *
 * Common to both:
 *   WORDPRESS_URL=https://api.altrpeptides.com
 *
 * Checkout flow: Next.js server creates a `pending` WooCommerce order via the
 * WC REST API v3 Orders endpoint, then redirects the customer to WooCommerce's
 * own hosted "pay for order" page so WooCommerce/Stripe handles the actual charge.
 * This app never touches card details directly.
 *
 * IMPORTANT — product ID mapping: line_items need real WooCommerce `product_id`
 * values. Set `wooProductId` on each Product in lib/products.ts once the catalog
 * is imported into WooCommerce.
 */

import { Product } from "./types";

const WORDPRESS_URL = process.env.WORDPRESS_URL;
const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET;
const WP_USERNAME = process.env.WORDPRESS_USERNAME;
const WP_APP_PASSWORD = process.env.WORDPRESS_APP_PASSWORD;

function getAuthHeader(): string {
  if (CONSUMER_KEY && CONSUMER_SECRET) {
    return "Basic " + Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64");
  }
  if (WP_USERNAME && WP_APP_PASSWORD) {
    // WP Application Passwords allow spaces in the password value; strip them here
    // since Basic Auth encodes the raw string and WP accepts both forms.
    const pass = WP_APP_PASSWORD.replace(/\s+/g, "");
    return "Basic " + Buffer.from(`${WP_USERNAME}:${pass}`).toString("base64");
  }
  throw new Error("No WooCommerce auth credentials configured.");
}

export function isWooCommerceConfigured() {
  if (!WORDPRESS_URL) return false;
  const hasConsumerKeys = Boolean(CONSUMER_KEY && CONSUMER_SECRET);
  const hasAppPassword = Boolean(WP_USERNAME && WP_APP_PASSWORD);
  return hasConsumerKeys || hasAppPassword;
}

// TODO: implement once credentials are verified.
// export async function fetchWooProducts(): Promise<Product[]> { ... }
// export async function fetchWooProductBySlug(slug: string): Promise<Product | null> { ... }

export interface CheckoutLine {
  product: Pick<Product, "id" | "sku" | "name" | "wooProductId">;
  qty: number;
  unitPrice: number;
}

export interface CheckoutCustomer {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address1: string;
  address2?: string;
  city: string;
  province: string;
  postcode: string;
  country: string;
  customerNote?: string;
}

export interface CreateOrderResult {
  orderId: number;
  orderKey: string;
  payUrl: string;
}

/**
 * Creates a `pending` WooCommerce order and returns the hosted pay-for-order
 * URL to redirect the customer to. Throws if WooCommerce isn't configured or
 * if any line item is missing a real `wooProductId` mapping.
 */
export async function createWooOrder(lines: CheckoutLine[], customer: CheckoutCustomer): Promise<CreateOrderResult> {
  if (!isWooCommerceConfigured()) {
    throw new Error(
      "WooCommerce is not configured. Set WORDPRESS_URL and either " +
        "(WOOCOMMERCE_CONSUMER_KEY + WOOCOMMERCE_CONSUMER_SECRET) or " +
        "(WORDPRESS_USERNAME + WORDPRESS_APP_PASSWORD)."
    );
  }

  const unmapped = lines.filter((l) => !l.product.wooProductId);
  if (unmapped.length > 0) {
    throw new Error(
      `Missing WooCommerce product_id mapping for: ${unmapped.map((l) => l.product.name).join(", ")}. ` +
        `Import the catalog into WooCommerce and set wooProductId on each Product before checkout can go live.`
    );
  }

  const payload = {
    status: "pending",
    billing: {
      first_name: customer.firstName,
      last_name: customer.lastName,
      email: customer.email,
      phone: customer.phone ?? "",
      address_1: customer.address1,
      address_2: customer.address2 ?? "",
      city: customer.city,
      state: customer.province,
      postcode: customer.postcode,
      country: customer.country,
    },
    shipping: {
      first_name: customer.firstName,
      last_name: customer.lastName,
      address_1: customer.address1,
      address_2: customer.address2 ?? "",
      city: customer.city,
      state: customer.province,
      postcode: customer.postcode,
      country: customer.country,
    },
    line_items: lines.map((l) => ({
      product_id: l.product.wooProductId,
      quantity: l.qty,
    })),
    customer_note: customer.customerNote ?? "",
  };

  const res = await fetch(`${WORDPRESS_URL}/wp-json/wc/v3/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`WooCommerce order creation failed (${res.status}): ${detail}`);
  }

  const order = await res.json();

  return {
    orderId: order.id,
    orderKey: order.order_key,
    payUrl: `${WORDPRESS_URL}/checkout/order-pay/${order.id}/?pay_for_order=true&key=${order.order_key}`,
  };
}
