import { randomUUID } from "crypto";

const QIROX_API_BASE = "https://qiroxstudio.online/api/v1/projects";

export async function sendWhatsAppLoginCode({
  phone,
  name,
  code,
}: {
  phone: string;
  name: string;
  code: string;
}) {
  const apiKey = process.env.QIROX_WHATSAPP_API_KEY;
  const projectId = process.env.QIROX_WHATSAPP_PROJECT_ID;

  if (!apiKey || !projectId) {
    throw new Error("WhatsApp login is not configured");
  }

  const response = await fetch(
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

  if (!response.ok) {
    throw new Error(`WhatsApp provider returned HTTP ${response.status}`);
  }
}