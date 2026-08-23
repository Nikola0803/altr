/**
 * Headless WooCommerce connection.
 *
 * Reads (product catalog) still come from lib/products.ts mock data — see
 * the TODOs below for swapping those to live WooCommerce REST calls.
 *
 * Checkout (order creation) is implemented against the WooCommerce REST API
 * v3 Orders endpoint: https://woocommerce.github.io/woocommerce-rest-api-docs/#orders
 *
 * Flow: the Next.js server creates a `pending` order via the REST API (auth'd
 * with consumer key/secret, server-side only), then redirects the customer
 * to WooCommerce's own hosted "pay for order" page so WooCommerce — not this
 * app — handles the actual payment gateway (Stripe/PayPal/etc, whatever is
 * configured in WP admin). This avoids needing a PCI-compliant payment form
 * inside Next.js and reuses whatever gateways are already set up in Woo.
 *
 * Env vars required (see .env.example):
 *   WORDPRESS_URL=              e.g. https://shop.altrpeptides.com
 *   WOOCOMMERCE_CONSUMER_KEY=
 *   WOOCOMMERCE_CONSUMER_SECRET=
 *
 * IMPORTANT — product ID mapping: WooCommerce's Orders API line_items need a
 * real WooCommerce `product_id`, not this app's mock `Product.id`/`slug`.
 * Once the real catalog is imported into WooCommerce (e.g. via the ALTR CMS
 * plugin or a CSV import), each mock product needs its real WC product_id
 * attached — see `wooProductId` TODO on the Product type / a lookup table.
 * Until that mapping exists, `createWooOrder` will fail per-line with a
 * clear error rather than silently placing an order for the wrong item.
 */

import { Product } from "./types";

const WORDPRESS_URL = process.env.WORDPRESS_URL;
const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET;

export function isWooCommerceConfigured() {
  return Boolean(WORDPRESS_URL && CONSUMER_KEY && CONSUMER_SECRET);
}

// TODO: implement once credentials are available.
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
    throw new Error("WooCommerce is not configured — set WORDPRESS_URL, WOOCOMMERCE_CONSUMER_KEY and WOOCOMMERCE_CONSUMER_SECRET.");
  }

  const unmapped = lines.filter((l) => !l.product.wooProductId);
  if (unmapped.length > 0) {
    throw new Error(
      `Missing WooCommerce product_id mapping for: ${unmapped.map((l) => l.product.name).join(", ")}. ` +
        `Import the catalog into WooCommerce and set wooProductId on each Product before checkout can go live.`
    );
  }

  const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64");

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
  };

  const res = await fetch(`${WORDPRESS_URL}/wp-json/wc/v3/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
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
