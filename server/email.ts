import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

const transporter = nodemailer.createTransport({
  host: process.env.CPANEL_SMTP_HOST || "server222.web-hosting.com",
  port: parseInt(process.env.CPANEL_SMTP_PORT || "465"),
  secure: true,
  auth: {
    user: process.env.CPANEL_SMTP_USER || "info@qirox.online",
    pass: process.env.SMTP_PASS,
  },
  tls: { rejectUnauthorized: false },
});

const FROM = `"UJI MATCHA" <${process.env.CPANEL_SMTP_USER || "info@qirox.online"}>`;

// ── Embed logo as base64 so it always shows ──
let LOGO_WHITE_B64 = "";
try {
  LOGO_WHITE_B64 = fs
    .readFileSync(path.join(process.cwd(), "client/public/assets/brand/uji-logo-white-transparent.png"))
    .toString("base64");
} catch (_) {}

const IMG_BASE = process.env.REPLIT_DEV_DOMAIN
  ? `https://${process.env.REPLIT_DEV_DOMAIN}`
  : "https://ujimatcha.store";

const BOWL_URL = `${IMG_BASE}/assets/brand/uji-brand-identity-bowl-transparent.png`;
const CUP_URL  = `${IMG_BASE}/assets/brand/uji-brand-cup-matcha-repeat.png`;

// ── Logo img tag (fully inline, no class references) ──
const logoImg = LOGO_WHITE_B64
  ? `<img src="data:image/png;base64,${LOGO_WHITE_B64}" alt="UJI MATCHA" width="140" style="display:block;margin:0 auto;border:0;outline:none;" />`
  : `<div style="color:#F2EADB;font-family:Georgia,'Times New Roman',serif;font-size:30px;letter-spacing:0.28em;font-weight:300;text-align:center;">UJI <span style="font-size:10px;letter-spacing:0.45em;vertical-align:super;color:#9BA17B;">MATCHA</span></div>`;

const logoImgSmall = LOGO_WHITE_B64
  ? `<img src="data:image/png;base64,${LOGO_WHITE_B64}" alt="UJI MATCHA" width="90" style="display:block;margin:0 auto;border:0;outline:none;" />`
  : `<div style="color:#F2EADB;font-family:Georgia,serif;font-size:20px;letter-spacing:0.28em;font-weight:300;text-align:center;">UJI MATCHA</div>`;

/* ── Shared layout wrapper (no classes, all inline) ── */
function wrapEmail(content: string, footerExtra = ""): string {
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <!--[if mso]><style type="text/css">body,table,td{font-family:Arial,sans-serif!important;}</style><![endif]-->
</head>
<body style="margin:0;padding:0;background:#EDE5D4;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#EDE5D4;">
  <tr><td align="center" style="padding:32px 16px;">
    <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#FDFAF5;border:1px solid #DDD5C3;border-radius:2px;overflow:hidden;">

      <!-- HEADER -->
      <tr><td style="background:#16281D;padding:44px 40px 36px;text-align:center;">
        ${logoImg}
        <div style="width:40px;height:1px;background:#9BA17B;margin:16px auto 0;"></div>
        <div style="color:#9BA17B;font-size:10px;letter-spacing:0.35em;margin-top:10px;font-family:Georgia,'Times New Roman',serif;">CEREMONIAL GRADE MATCHA</div>
      </td></tr>

      ${content}

      <!-- FOOTER -->
      <tr><td style="background:#16281D;padding:28px 40px;text-align:center;">
        ${logoImgSmall}
        <div style="width:30px;height:1px;background:#2F4E3A;margin:14px auto;"></div>
        <p style="font-family:Arial,Tahoma,sans-serif;font-size:11px;color:#6E8870;line-height:1.8;margin:0;">
          ماتشا يابانية احتفالية بكل كوب قصة<br/>
          <a href="https://ujimatcha.store" style="color:#9BA17B;text-decoration:none;">ujimatcha.store</a>
          &nbsp;·&nbsp;
          <a href="mailto:info@qirox.online" style="color:#9BA17B;text-decoration:none;">info@qirox.online</a>
        </p>
        ${footerExtra}
        <p style="margin-top:10px;font-size:10px;color:#3E5E48;font-family:Arial,sans-serif;">© 2026 UJI MATCHA — جميع الحقوق محفوظة</p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body></html>`;
}

/* ═══════════════════════════════════════════════════════════════════
   ORDER CONFIRMATION  (fully inlined styles — no class references)
═══════════════════════════════════════════════════════════════════ */
export async function sendOrderConfirmation(order: any) {
  const itemsRows = order.items.map((i: any) => `
    <tr>
      <td style="font-family:Arial,Tahoma,sans-serif;padding:11px 0;border-bottom:1px solid #EDE8DF;font-size:14px;color:#1C201B;">${i.name}</td>
      <td style="font-family:Arial,Tahoma,sans-serif;padding:11px 0;border-bottom:1px solid #EDE8DF;font-size:14px;color:#9BA17B;text-align:center;width:50px;">×${i.qty}</td>
      <td style="font-family:Arial,Tahoma,sans-serif;padding:11px 0;border-bottom:1px solid #EDE8DF;font-size:14px;font-weight:600;color:#1F3929;text-align:left;width:90px;">${(i.price * i.qty).toFixed(2)} ر.س</td>
    </tr>`).join("");

  const content = `
    <!-- HERO IMAGE -->
    <tr><td style="background:#1F3929;text-align:center;overflow:hidden;height:190px;position:relative;padding:0;">
      <img src="${BOWL_URL}" alt="" width="600" style="width:100%;height:190px;object-fit:cover;object-position:center top;opacity:0.88;display:block;border:0;" />
    </td></tr>
    <tr><td style="background:#1F3929;text-align:center;padding:0 40px 30px;">
      <div style="color:#F2EADB;font-family:Georgia,'Times New Roman',serif;font-size:19px;font-weight:300;letter-spacing:0.06em;text-align:center;line-height:1.55;">
        شكراً لاختيارك تجربة الماتشا الأصيلة
      </div>
    </td></tr>

    <!-- BODY -->
    <tr><td style="padding:44px 44px 36px;direction:rtl;text-align:right;">
      <div style="font-size:10px;letter-spacing:0.25em;color:#9BA17B;text-transform:uppercase;margin-bottom:10px;font-family:Georgia,serif;">تأكيد الطلب</div>
      <h1 style="font-family:Arial,Tahoma,sans-serif;font-size:22px;font-weight:400;color:#1C201B;margin:0 0 6px;">أهلاً ${order.customer?.name || ""}،</h1>
      <p style="font-family:Arial,Tahoma,sans-serif;font-size:14px;color:#7a7a6e;line-height:1.95;margin:0 0 32px;">
        تم استلام طلبك بنجاح وسيتم التواصل معك قريباً لتأكيد موعد التوصيل.<br/>
        رقم الطلب: <strong style="color:#1F3929;">${order.orderNumber}</strong>
      </p>

      <hr style="border:none;border-top:1px solid #DDD5C3;margin:28px 0;" />

      <!-- ORDER TABLE -->
      <div style="font-size:9px;letter-spacing:0.28em;color:#9BA17B;text-transform:uppercase;margin-bottom:12px;font-family:Georgia,serif;">تفاصيل الطلب</div>
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        ${itemsRows}
        <tr>
          <td style="font-family:Arial,Tahoma,sans-serif;padding:11px 0;border-bottom:1px solid #EDE8DF;font-size:13px;color:#9BA17B;">الشحن</td>
          <td style="font-family:Arial,Tahoma,sans-serif;padding:11px 0;border-bottom:1px solid #EDE8DF;font-size:13px;color:#9BA17B;text-align:center;"></td>
          <td style="font-family:Arial,Tahoma,sans-serif;padding:11px 0;border-bottom:1px solid #EDE8DF;font-size:13px;font-weight:600;color:#9BA17B;text-align:left;">${order.shipping === 0 ? "مجاني 🎁" : order.shipping + " ر.س"}</td>
        </tr>
        <tr>
          <td style="font-family:Arial,Tahoma,sans-serif;padding:14px 0 0;border-top:2px solid #16281D;font-size:16px;font-weight:700;color:#16281D;">الإجمالي</td>
          <td style="font-family:Arial,Tahoma,sans-serif;padding:14px 0 0;border-top:2px solid #16281D;text-align:center;"></td>
          <td style="font-family:Arial,Tahoma,sans-serif;padding:14px 0 0;border-top:2px solid #16281D;font-size:16px;font-weight:700;color:#16281D;text-align:left;">${order.total?.toFixed(2)} ر.س</td>
        </tr>
      </table>

      <!-- ADDRESS -->
      <div style="font-size:9px;letter-spacing:0.28em;color:#9BA17B;text-transform:uppercase;margin:28px 0 12px;font-family:Georgia,serif;">عنوان التوصيل</div>
      <div style="background:#F0EBE1;border-right:3px solid #9BA17B;padding:18px 20px;font-family:Arial,Tahoma,sans-serif;font-size:13px;color:#555;line-height:1.9;">
        📍 ${order.address?.city || ""}${order.address?.district ? " — " + order.address.district : ""}<br/>
        ${order.address?.street || ""}<br/>
        📞 ${order.customer?.phone || ""}
      </div>

      <!-- CTA -->
      <div style="text-align:center;margin:36px 0 8px;">
        <a href="${IMG_BASE}" style="display:inline-block;background:#16281D;color:#F2EADB;padding:14px 40px;text-decoration:none;font-family:Georgia,serif;font-size:13px;letter-spacing:0.18em;">تصفّح المتجر</a>
      </div>
    </td></tr>

    <!-- CUP STRIP -->
    <tr><td style="background:#1C201B;text-align:center;overflow:hidden;padding:0;">
      <img src="${CUP_URL}" alt="" width="600" style="width:100%;height:90px;object-fit:cover;object-position:center;opacity:0.65;display:block;border:0;" />
    </td></tr>`;

  const html = wrapEmail(content);

  try {
    await transporter.sendMail({
      from: FROM,
      to: order.customer?.email,
      subject: `تأكيد طلبك ${order.orderNumber} — UJI MATCHA ✦`,
      html,
      text: `تأكيد الطلب ${order.orderNumber} — إجمالي: ${order.total?.toFixed(2)} ر.س`,
    });
    console.log("[email] order confirmation sent to", order.customer?.email);
  } catch (e) {
    console.error("[email] order confirmation failed:", e);
  }
}

/* ═══════════════════════════════════════════════════════════════════
   ADMIN ORDER ALERT
═══════════════════════════════════════════════════════════════════ */
export async function sendAdminOrderAlert(order: any) {
  const rows = [
    ["العميل",   `${order.customer?.name || "—"} (${order.customer?.phone || "—"})`],
    ["البريد",   order.customer?.email || "—"],
    ["المدينة",  `${order.address?.city || "—"} / ${order.address?.district || "—"}`],
    ["الشارع",   order.address?.street || "—"],
    ["الإجمالي", `<strong style="color:#1F3929;">${order.total?.toFixed(2)} ر.س</strong>`],
    ["الدفع",    order.paymentMethod === "cod" ? "عند الاستلام 💵" : order.paymentMethod === "geidea" ? "Geidea 💳" : order.paymentMethod],
  ].map(([k, v]) => `
    <tr>
      <td style="font-family:Arial,Tahoma,sans-serif;padding:10px 0;border-bottom:1px solid #EDE8DF;font-size:14px;color:#9BA17B;width:100px;">${k}</td>
      <td style="font-family:Arial,Tahoma,sans-serif;padding:10px 0;border-bottom:1px solid #EDE8DF;font-size:14px;color:#1C201B;">${v}</td>
    </tr>`).join("");

  const content = `
    <tr><td style="padding:44px 44px 36px;direction:rtl;text-align:right;">
      <div style="font-size:10px;letter-spacing:0.25em;color:#9BA17B;text-transform:uppercase;margin-bottom:10px;font-family:Georgia,serif;">طلب جديد وارد</div>
      <h1 style="font-family:Arial,Tahoma,sans-serif;font-size:22px;font-weight:400;color:#1C201B;margin:0 0 6px;">${order.orderNumber}</h1>
      <p style="font-family:Arial,Tahoma,sans-serif;font-size:14px;color:#7a7a6e;line-height:1.95;margin:0 0 20px;">تم استلام طلب جديد — يرجى المراجعة والتأكيد.</p>
      <hr style="border:none;border-top:1px solid #DDD5C3;margin:28px 0;" />
      <table width="100%" cellpadding="0" cellspacing="0" border="0">${rows}</table>
      <div style="text-align:center;margin:36px 0 8px;">
        <a href="${IMG_BASE}/admin" style="display:inline-block;background:#16281D;color:#F2EADB;padding:14px 40px;text-decoration:none;font-family:Georgia,serif;font-size:13px;letter-spacing:0.18em;">لوحة الإدارة</a>
      </div>
    </td></tr>`;

  const html = wrapEmail(content, `<p style="margin-top:10px;font-size:10px;color:#3E5E48;font-family:Arial,sans-serif;">هذا إشعار تلقائي — لا تحتاج للرد عليه</p>`);

  try {
    await transporter.sendMail({
      from: FROM,
      to: process.env.CPANEL_SMTP_USER,
      subject: `🛒 طلب جديد ${order.orderNumber} — ${order.total?.toFixed(2)} ر.س`,
      html,
      text: `طلب جديد: ${order.orderNumber}\nالعميل: ${order.customer?.name} ${order.customer?.phone}\nالإجمالي: ${order.total?.toFixed(2)} ر.س`,
    });
    console.log("[email] admin alert sent for", order.orderNumber);
  } catch (e) {
    console.error("[email] admin alert failed:", e);
  }
}

/* ═══════════════════════════════════════════════════════════════════
   NEWSLETTER WELCOME
═══════════════════════════════════════════════════════════════════ */
export async function sendNewsletterWelcome(email: string) {
  const pillars = [
    ["🍵", "ريتشوال الماتشا", "دليلك لإعداد كوب مثالي"],
    ["📖", "من المجلة",       "مقالات عن أصول الماتشا"],
    ["✦",  "عروض حصرية",    "لمشتركي النشرة فقط"],
  ];

  const pillarsHtml = pillars.map(([icon, title, sub]) => `
    <td style="padding:16px 8px;vertical-align:top;text-align:center;font-family:Arial,Tahoma,sans-serif;width:33%;">
      <div style="font-size:26px;margin-bottom:8px;">${icon}</div>
      <div style="font-size:13px;font-weight:600;color:#1C201B;margin-bottom:4px;">${title}</div>
      <div style="font-size:12px;color:#9BA17B;">${sub}</div>
    </td>`).join("");

  const content = `
    <!-- HERO -->
    <tr><td style="background:#1F3929;text-align:center;overflow:hidden;padding:0;">
      <img src="${BOWL_URL}" alt="" width="600" style="width:100%;height:220px;object-fit:cover;object-position:center top;opacity:0.88;display:block;border:0;" />
    </td></tr>
    <tr><td style="background:#1F3929;text-align:center;padding:0 40px 40px;">
      <div style="color:#F2EADB;font-family:Georgia,serif;font-size:19px;font-weight:300;letter-spacing:0.06em;line-height:1.55;">
        في كل كوب ماتشا<br/>
        <span style="font-size:14px;opacity:0.75;font-family:Georgia,serif;">قصة من قلب أوجي اليابانية</span>
      </div>
    </td></tr>

    <!-- BODY -->
    <tr><td style="padding:44px 40px 36px;direction:rtl;text-align:center;">
      <div style="font-size:10px;letter-spacing:0.25em;color:#9BA17B;text-transform:uppercase;margin-bottom:10px;font-family:Georgia,serif;text-align:center;">النشرة البريدية</div>
      <h1 style="font-family:Arial,Tahoma,sans-serif;font-size:24px;font-weight:400;color:#1C201B;margin:0 0 12px;text-align:center;">أهلاً بك في UJI MATCHA</h1>
      <p style="font-family:Arial,Tahoma,sans-serif;font-size:14px;color:#7a7a6e;line-height:1.95;margin:0 auto 32px;max-width:380px;text-align:center;">
        انضممت إلى مجتمع عشّاق الماتشا اليابانية الأصيلة. ستصل إليك قريباً أسرار الريتشوال ومستجدات المجلة والإصدارات الحصرية.
      </p>
      <hr style="border:none;border-top:1px solid #DDD5C3;margin:28px 0;" />
      <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>${pillarsHtml}</tr></table>
      <div style="text-align:center;margin:28px 0 8px;">
        <a href="${IMG_BASE}" style="display:inline-block;background:#16281D;color:#F2EADB;padding:14px 40px;text-decoration:none;font-family:Georgia,serif;font-size:13px;letter-spacing:0.18em;">اكتشف المتجر</a>
      </div>
    </td></tr>

    <!-- CUP STRIP -->
    <tr><td style="background:#1C201B;text-align:center;padding:0;">
      <img src="${CUP_URL}" alt="" width="600" style="width:100%;height:90px;object-fit:cover;opacity:0.65;display:block;border:0;" />
    </td></tr>`;

  const html = wrapEmail(content, `<p style="margin-top:10px;font-size:10px;color:#3E5E48;font-family:Arial,sans-serif;">إذا لم تشترك بنفسك تجاهل هذه الرسالة</p>`);

  try {
    await transporter.sendMail({
      from: FROM,
      to: email,
      subject: "مرحباً في UJI MATCHA ✦ — ريتشوال الماتشا ينتظرك",
      html,
      text: "مرحباً بك في UJI MATCHA — شكراً لاشتراكك في نشرتنا البريدية.",
    });
    console.log("[email] newsletter welcome sent to", email);
  } catch (e) {
    console.error("[email] newsletter welcome failed:", e);
  }
}

/* ═══════════════════════════════════════════════════════════════════
   PASSWORD RESET OTP
═══════════════════════════════════════════════════════════════════ */
export async function sendPasswordResetOtp(email: string, name: string, otp: string) {
  const content = `
    <tr><td style="padding:40px 40px 32px;direction:rtl;text-align:center;">
      <div style="font-size:10px;letter-spacing:0.25em;color:#9BA17B;text-transform:uppercase;margin-bottom:10px;font-family:Georgia,serif;text-align:center;">رمز التحقق</div>
      <h1 style="font-family:Arial,Tahoma,sans-serif;font-size:20px;font-weight:400;color:#1C201B;margin:0 0 8px;text-align:center;">مرحباً ${name || ""}،</h1>
      <p style="font-family:Arial,Tahoma,sans-serif;font-size:14px;color:#7a7a6e;line-height:1.95;margin:0 auto 32px;max-width:360px;text-align:center;">
        طلبت إعادة تعيين كلمة المرور. استخدم الرمز أدناه خلال <strong style="color:#1F3929;">١٥ دقيقة</strong>.
      </p>

      <!-- OTP Box -->
      <div style="background:#1F3929;padding:24px 40px;margin:0 auto 32px;display:inline-block;min-width:200px;text-align:center;">
        <div style="font-family:monospace,Courier New,monospace;font-size:36px;font-weight:700;letter-spacing:0.35em;color:#F2EADB;direction:ltr;text-align:center;">
          ${otp}
        </div>
      </div>

      <p style="font-family:Arial,Tahoma,sans-serif;font-size:13px;color:#9BA17B;line-height:1.8;text-align:center;max-width:320px;margin:0 auto 24px;">
        إذا لم تطلب إعادة كلمة المرور، تجاهل هذه الرسالة — حسابك بأمان.
      </p>
      <hr style="border:none;border-top:1px solid #DDD5C3;margin:0 0 24px;" />
      <div style="font-family:Arial,Tahoma,sans-serif;font-size:12px;color:#C8BBA4;text-align:center;">
        ينتهي هذا الرمز بعد ١٥ دقيقة من وقت الإرسال
      </div>
    </td></tr>`;

  const html = wrapEmail(content);

  try {
    await transporter.sendMail({
      from: FROM,
      to: email,
      subject: `${otp} — رمز إعادة تعيين كلمة المرور في UJI MATCHA`,
      html,
      text: `رمز التحقق لإعادة تعيين كلمة المرور: ${otp}\nصالح لمدة ١٥ دقيقة.`,
    });
    console.log("[email] password reset OTP sent to", email);
  } catch (e) {
    console.error("[email] password reset failed:", e);
  }
}

/* ═══════════════════════════════════════════════════════════════════
   TEST EMAIL
═══════════════════════════════════════════════════════════════════ */
export async function sendTestEmail(to: string) {
  await sendNewsletterWelcome(to);
  const mockOrder = {
    orderNumber: "UJI-TEST-001",
    customer: { name: "عبدالله الاختباري", phone: "0512345678", email: to },
    items: [
      { name: "ماتشا UJI — كيس احتفالي", qty: 2, price: 149 },
    ],
    address: { city: "الرياض", district: "النخيل", street: "شارع التخصصي 12" },
    shipping: 0,
    total: 298,
    paymentMethod: "cod",
  };
  await sendOrderConfirmation(mockOrder);
  await sendAdminOrderAlert(mockOrder);
  console.log("[email] test suite sent to", to);
}

export { transporter };
