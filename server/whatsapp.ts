import { randomUUID } from "crypto";

const QIROX_API_BASE = "https://qiroxstudio.online/api/v1/projects";

export class WhatsAppDeliveryError extends Error {
  constructor(
    readonly category: "configuration" | "timeout" | "network" | "http",
    readonly status?: number,
  ) {
    super("WhatsApp delivery request failed");
    this.name = "WhatsAppDeliveryError";
  }
}

export async function sendWhatsAppLoginCode({
  phone,
  name,
  code,
}: {
  phone: string;
  name: string;
  code: string;
}) {
  const apiKey = process.env.QIROX_WHATSAPP_API_KEY?.trim();
  const projectId = process.env.QIROX_WHATSAPP_PROJECT_ID?.trim();

  if (!apiKey?.startsWith("qrx_project_whatsapp_") || !projectId) {
    throw new WhatsAppDeliveryError("configuration");
  }

  let response: Response;
  try {
    response = await fetch(
      `${QIROX_API_BASE}/${encodeURIComponent(projectId)}/whatsapp`,
      {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": randomUUID(),
      },
      body: JSON.stringify({
        recipient: { phone, name },
        platformName: "UJI MATCHA",
        clientName: "UJI MATCHA",
        code,
        message: `رمز الدخول إلى UJI MATCHA هو ${code}. صالح لمدة 5 دقائق.`,
      }),
      signal: AbortSignal.timeout(10000),
      },
    );
  } catch (error: any) {
    throw new WhatsAppDeliveryError(error?.name === "TimeoutError" ? "timeout" : "network");
  }

  if (!response.ok) {
    throw new WhatsAppDeliveryError("http", response.status);
  }

  return { status: response.status };
}