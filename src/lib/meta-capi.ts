import crypto from "crypto";

const PIXEL_ID = process.env.META_PIXEL_ID;
const CAPI_TOKEN = process.env.META_CAPI_TOKEN;

function hash(value: string): string {
  return crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

interface PurchaseEventData {
  orderId: string;
  value: number;
  currency?: string;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  clientIp?: string;
  userAgent?: string;
  fbp?: string;
  fbc?: string;
}

export async function sendPurchaseEvent(data: PurchaseEventData): Promise<void> {
  if (!PIXEL_ID || !CAPI_TOKEN) return;

  const userData: Record<string, string> = {};
  if (data.email) userData.em = hash(data.email);
  if (data.phone) userData.ph = hash(data.phone.replace(/\D/g, ""));
  if (data.firstName) userData.fn = hash(data.firstName);
  if (data.lastName) userData.ln = hash(data.lastName);
  if (data.city) userData.ct = hash(data.city);
  if (data.state) userData.st = hash(data.state);
  if (data.zip) userData.zp = hash(data.zip);
  if (data.country) userData.country = hash(data.country);
  if (data.clientIp) userData.client_ip_address = data.clientIp;
  if (data.userAgent) userData.client_user_agent = data.userAgent;
  if (data.fbp) userData.fbp = data.fbp;
  if (data.fbc) userData.fbc = data.fbc;

  const payload = {
    data: [
      {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        event_id: data.orderId,
        action_source: "website",
        user_data: userData,
        custom_data: {
          value: data.value,
          currency: data.currency ?? "CAD",
          order_id: data.orderId,
        },
      },
    ],
  };

  try {
    await fetch(`https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${CAPI_TOKEN}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // CAPI failure is non-fatal — order already placed
  }
}
