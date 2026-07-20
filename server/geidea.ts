/**
 * Geidea Payment Gateway Integration
 * Docs: https://geidea.net/developer
 *
 * Required env vars:
 *   GEIDEA_MERCHANT_KEY   — your Merchant Public Key (UUID)
 *   GEIDEA_API_PASSWORD   — your API Password
 *   GEIDEA_API_BASE       — optional, defaults to production
 */

import crypto from "crypto";

const MERCHANT_KEY = process.env.GEIDEA_MERCHANT_KEY || "";
const API_PASSWORD = process.env.GEIDEA_API_PASSWORD || "";
const API_BASE = process.env.GEIDEA_API_BASE || "https://api.geidea.net";

export function geideaEnabled() {
  return !!(MERCHANT_KEY && API_PASSWORD);
}

/** Generate the SHA256 signature Geidea requires on every request */
export function geideaSignature(amount: string, currency: string, orderId: string, timestamp: string): string {
  const data = `${MERCHANT_KEY}${amount}${currency}${orderId}${timestamp}`;
  return crypto.createHmac("sha256", API_PASSWORD).update(data).digest("hex");
}

/**
 * Create a Geidea checkout session.
 * Returns { sessionId, redirectUrl } on success.
 */
export async function createGeideaSession(opts: {
  amount: number;
  orderId: string;
  currency?: string;
  callbackUrl: string;
  returnUrl: string;
  customerEmail?: string;
  customerName?: string;
}) {
  if (!geideaEnabled()) throw new Error("Geidea credentials not configured");

  const currency = opts.currency || "SAR";
  const amount = opts.amount.toFixed(2);
  const timestamp = new Date().toISOString();
  const signature = geideaSignature(amount, currency, opts.orderId, timestamp);

  const body = {
    amount,
    currency,
    orderId: opts.orderId,
    timestamp,
    signature,
    callbackUrl: opts.callbackUrl,
    merchantReferenceId: opts.orderId,
    customer: {
      email: opts.customerEmail || undefined,
      name: opts.customerName || undefined,
    },
    returnUrl: opts.returnUrl,
  };

  const resp = await fetch(`${API_BASE}/payment-intent/api/v2/direct/session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(`${MERCHANT_KEY}:${API_PASSWORD}`).toString("base64")}`,
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`Geidea session error: ${err}`);
  }

  const data = await resp.json() as any;
  const sessionId = data?.session?.id;
  if (!sessionId) throw new Error("Geidea: no session ID returned");

  const redirectUrl = `https://www.geidea.net/payment-intent/pay/${MERCHANT_KEY}?session.id=${sessionId}`;
  return { sessionId, redirectUrl };
}

/** Verify the callback signature from Geidea */
export function verifyGeideaCallback(params: Record<string, string>): boolean {
  try {
    const { merchantReferenceId, amount, currency, responseCode, cardToken, signature } = params;
    const data = `${MERCHANT_KEY}${amount}${currency}${merchantReferenceId}${responseCode}${cardToken || ""}`;
    const expected = crypto.createHmac("sha256", API_PASSWORD).update(data).digest("hex");
    return expected === signature;
  } catch {
    return false;
  }
}
