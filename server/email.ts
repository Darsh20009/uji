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

// ── Embed logo as base64 so it always shows in any email client ──
let LOGO_WHITE_B64 = "";
let LOGO_GREEN_B64 = "";
try {
  LOGO_WHITE_B64 = fs
    .readFileSync(path.join(process.cwd(), "client/public/assets/brand/uji-logo-white-transparent.png"))
    .toString("base64");
  LOGO_GREEN_B64 = fs
    .readFileSync(path.join(process.cwd(), "client/public/assets/brand/uji-logo-forest-green-transparent.png"))
    .toString("base64");
} catch (_) {
  /* assets missing in prod build – fall back to text */
}

// ── Absolute image base for hosted (non-base64) images ──
const IMG_BASE = process.env.REPLIT_DEV_DOMAIN
  ? `https://${process.env.REPLIT_DEV_DOMAIN}`
  : "https://ujimatcha.store";

const BOWL_URL  = `${IMG_BASE}/assets/brand/uji-brand-identity-bowl-transparent.png`;
const CUP_URL   = `${IMG_BASE}/assets/brand/uji-brand-cup-matcha-repeat.png`;

/* ═══════════════════════════════════════════════════════════════════
   SHARED HELPERS
═══════════════════════════════════════════════════════════════════ */

const logoWhiteImg = LOGO_WHITE_B64
  ? `<img src="data:image/png;base64,${LOGO_WHITE_B64}" alt="UJI MATCHA" width="140" style="display:block;margin:0 auto;" />`
  : `<div style="color:#F2EADB;font-size:30px;letter-spacing:0.28em;font-weight:300;">UJI <span style="font-size:10px;letter-spacing:0.45em;vertical-align:super;color:#9BA17B;">MATCHA</span></div>`;

const logoGreenImg = LOGO_GREEN_B64
  ? `<img src="data:image/png;base64,${LOGO_GREEN_B64}" alt="UJI MATCHA" width="120" style="display:block;margin:0 auto;" />`
  : `<div style="color:#1F3929;font-size:26px;letter-spacing:0.28em;font-weight:300;">UJI MATCHA</div>`;

/* ─── Shared CSS block ─── */
const SHARED_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=IBM+Plex+Sans+Arabic:wght@300;400;600&display=swap');
  *{box-sizing:border-box;}
  body{margin:0;padding:0;background:#EDE5D4;}
  .outer{background:#EDE5D4;padding:32px 16px;}
  .card{max-width:600px;margin:0 auto;background:#FDFAF5;border:1px solid #DDD5C3;border-radius:2px;overflow:hidden;}
  /* Header */
  .hdr{background:#16281D;padding:44px 40px 36px;text-align:center;}
  .hdr-line{width:40px;height:1px;background:#9BA17B;margin:16px auto 0;}
  .hdr-tag{color:#9BA17B;font-size:10px;letter-spacing:0.35em;margin-top:10px;font-family:Cormorant Garamond,Georgia,serif;}
  /* Bowl visual */
  .bowl-wrap{background:#1F3929;text-align:center;overflow:hidden;height:200px;position:relative;}
  .bowl-img{width:100%;height:200px;object-fit:cover;object-position:center top;opacity:0.88;display:block;}
  .bowl-overlay{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(22,40,29,0.25),rgba(22,40,29,0.72));display:flex;align-items:center;justify-content:center;}
  .bowl-quote{color:#F2EADB;font-family:'Cormorant Garamond',Georgia,serif;font-size:19px;font-weight:300;letter-spacing:0.06em;text-align:center;padding:0 32px;line-height:1.55;}
  /* Body */
  .body{padding:44px 44px 36px;direction:rtl;text-align:right;}
  .eyebrow{font-size:10px;letter-spacing:0.25em;color:#9BA17B;text-transform:uppercase;margin-bottom:10px;font-family:Cormorant Garamond,Georgia,serif;}
  h1.greeting{font-family:'IBM Plex Sans Arabic',Tahoma,sans-serif;font-size:22px;font-weight:400;color:#1C201B;margin:0 0 6px;}
  .sub{font-family:'IBM Plex Sans Arabic',Tahoma,sans-serif;font-size:14px;color:#7a7a6e;line-height:1.95;margin:0 0 32px;}
  /* Divider */
  .divider{border:none;border-top:1px solid #DDD5C3;margin:28px 0;}
  /* Table */
  .sec-label{font-size:9px;letter-spacing:0.28em;color:#9BA17B;text-transform:uppercase;margin-bottom:12px;font-family:Cormorant Garamond,Georgia,serif;}
  table.items{width:100%;border-collapse:collapse;}
  table.items td{font-family:'IBM Plex Sans Arabic',Tahoma,sans-serif;padding:11px 0;border-bottom:1px solid #EDE8DF;font-size:14px;color:#1C201B;}
  table.items .qty{text-align:center;color:#9BA17B;width:50px;}
  table.items .price{text-align:left;font-weight:600;color:#1F3929;width:90px;}
  table.items .total-row td{border-top:2px solid #16281D;border-bottom:none;padding-top:14px;font-weight:700;font-size:16px;color:#16281D;}
  table.items .ship-row td{color:#9BA17B;font-size:13px;border-bottom:1px solid #EDE8DF;}
  /* Address box */
  .address-box{background:#F0EBE1;border-right:3px solid #9BA17B;padding:18px 20px;margin-top:24px;font-family:'IBM Plex Sans Arabic',Tahoma,sans-serif;font-size:13px;color:#555;line-height:1.9;}
  /* CTA */
  .cta-wrap{text-align:center;margin:36px 0 8px;}
  .cta{display:inline-block;background:#16281D;color:#F2EADB;padding:14px 40px;text-decoration:none;font-family:Cormorant Garamond,Georgia,serif;font-size:13px;letter-spacing:0.18em;border-radius:1px;}
  /* Cup strip */
  .cup-strip{background:#1C201B;text-align:center;overflow:hidden;}
  .cup-img{width:100%;height:90px;object-fit:cover;object-position:center;opacity:0.65;display:block;}
  /* Footer */
  .ftr{background:#16281D;padding:28px 40px;text-align:center;}
  .ftr p{font-family:'IBM Plex Sans Arabic',Tahoma,sans-serif;font-size:11px;color:#6E8870;line-height:1.8;margin:0;}
  .ftr a{color:#9BA17B;text-decoration:none;}
  .ftr .ftr-divider{width:30px;height:1px;background:#2F4E3A;margin:14px auto;}
`;

/* ═══════════════════════════════════════════════════════════════════
   ORDER CONFIRMATION
═══════════════════════════════════════════════════════════════════ */
export async function sendOrderConfirmation(order: any) {
  const itemsHtml = order.items
    .map(
      (i: any) => `
      <tr>
        <td>${i.name}</td>
        <td class="qty">×${i.qty}</td>
        <td class="price">${(i.price * i.qty).toFixed(2)} ر.س</td>
      </tr>`
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>تأكيد طلبك — UJI MATCHA</title>
  <style>${SHARED_CSS}</style>
</head>
<body>
<div class="outer">
  <div class="card">

    <!-- HEADER -->
    <div class="hdr">
      ${logoWhiteImg}
      <div class="hdr-line"></div>
      <div class="hdr-tag">CEREMONIAL GRADE MATCHA</div>
    </div>

    <!-- HERO BOWL IMAGE -->
    <div class="bowl-wrap" style="height:190px;">
      <img class="bowl-img" src="${BOWL_URL}" alt="" style="height:190px;" />
      <div class="bowl-overlay">
        <div class="bowl-quote">شكراً لاختيارك تجربة الماتشا الأصيلة</div>
      </div>
    </div>

    <!-- BODY -->
    <div class="body">
      <div class="eyebrow">تأكيد الطلب</div>
      <h1 class="greeting">أهلاً ${order.customer?.name || ""}،</h1>
      <p class="sub">
        تم استلام طلبك بنجاح وسيتم التواصل معك قريباً لتأكيد موعد التوصيل.
        <br/>رقم الطلب: <strong style="color:#1F3929;">${order.orderNumber}</strong>
      </p>

      <hr class="divider"/>

      <!-- ORDER TABLE -->
      <div class="sec-label">تفاصيل الطلب</div>
      <table class="items">
        ${itemsHtml}
        <tr class="ship-row">
          <td>الشحن</td>
          <td class="qty"></td>
          <td class="price">${order.shipping === 0 ? "مجاني 🎁" : order.shipping + " ر.س"}</td>
        </tr>
        <tr class="total-row">
          <td>الإجمالي</td>
          <td class="qty"></td>
          <td class="price">${order.total?.toFixed(2)} ر.س</td>
        </tr>
      </table>

      <!-- ADDRESS -->
      <div class="sec-label" style="margin-top:28px;">عنوان التوصيل</div>
      <div class="address-box">
        📍 ${order.address?.city || ""}${order.address?.district ? " — " + order.address.district : ""}<br/>
        ${order.address?.street || ""}<br/>
        📞 ${order.customer?.phone || ""}
      </div>

      <!-- CTA -->
      <div class="cta-wrap">
        <a class="cta" href="https://ujimatcha.store">تصفّح المتجر</a>
      </div>
    </div>

    <!-- CUP STRIP -->
    <div class="cup-strip">
      <img class="cup-img" src="${CUP_URL}" alt="" />
    </div>

    <!-- FOOTER -->
    <div class="ftr">
      ${logoWhiteImg.replace('width="140"', 'width="100"')}
      <div class="ftr-divider"></div>
      <p>
        ماتشا يابانية احتفالية بكل كوب قصة<br/>
        <a href="https://ujimatcha.store">ujimatcha.store</a> &nbsp;·&nbsp;
        <a href="mailto:info@qirox.online">info@qirox.online</a>
      </p>
      <p style="margin-top:10px;font-size:10px;color:#3E5E48;">
        © 2026 UJI MATCHA — جميع الحقوق محفوظة
      </p>
    </div>

  </div>
</div>
</body>
</html>`;

  try {
    await transporter.sendMail({
      from: FROM,
      to: order.customer?.email,
      subject: `تأكيد طلبك ${order.orderNumber} — UJI MATCHA ✦`,
      html,
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
  const html = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8"/>
  <style>${SHARED_CSS}</style>
</head>
<body>
<div class="outer">
  <div class="card">
    <div class="hdr">
      ${logoWhiteImg}
      <div class="hdr-line"></div>
      <div class="hdr-tag">ADMIN ALERT — NEW ORDER</div>
    </div>
    <div class="body">
      <div class="eyebrow">طلب جديد وارد</div>
      <h1 class="greeting">${order.orderNumber}</h1>
      <p class="sub" style="margin-bottom:20px;">تم استلام طلب جديد — يرجى المراجعة والتأكيد.</p>
      <hr class="divider"/>
      <table style="width:100%;border-collapse:collapse;font-family:'IBM Plex Sans Arabic',Tahoma,sans-serif;font-size:14px;">
        ${[
          ["العميل",  `${order.customer?.name || "—"} (${order.customer?.phone || "—"})`],
          ["البريد",  order.customer?.email || "—"],
          ["المدينة", `${order.address?.city || "—"} / ${order.address?.district || "—"}`],
          ["الشارع",  order.address?.street || "—"],
          ["الإجمالي",`<strong style="color:#1F3929;">${order.total?.toFixed(2)} ر.س</strong>`],
          ["الدفع",   order.paymentMethod === "cod" ? "عند الاستلام 💵" : order.paymentMethod],
        ].map(([k,v]) => `
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #EDE8DF;color:#9BA17B;width:100px;">${k}</td>
            <td style="padding:10px 0;border-bottom:1px solid #EDE8DF;color:#1C201B;">${v}</td>
          </tr>`).join("")}
      </table>
      <div class="cta-wrap">
        <a class="cta" href="https://ujimatcha.store/admin">لوحة الإدارة</a>
      </div>
    </div>
    <div class="ftr">
      <p>هذا إشعار تلقائي من متجر UJI MATCHA</p>
    </div>
  </div>
</div>
</body>
</html>`;

  try {
    await transporter.sendMail({
      from: FROM,
      to: process.env.CPANEL_SMTP_USER,
      subject: `🛒 طلب جديد ${order.orderNumber} — ${order.total?.toFixed(2)} ر.س`,
      html,
    });
  } catch (e) {
    console.error("[email] admin alert failed:", e);
  }
}

/* ═══════════════════════════════════════════════════════════════════
   NEWSLETTER WELCOME
═══════════════════════════════════════════════════════════════════ */
export async function sendNewsletterWelcome(email: string) {
  const html = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>مرحباً في UJI MATCHA</title>
  <style>${SHARED_CSS}</style>
</head>
<body>
<div class="outer">
  <div class="card">

    <!-- HEADER -->
    <div class="hdr">
      ${logoWhiteImg}
      <div class="hdr-line"></div>
      <div class="hdr-tag">أهلاً بك في عائلتنا</div>
    </div>

    <!-- HERO -->
    <div class="bowl-wrap" style="height:220px;">
      <img class="bowl-img" src="${BOWL_URL}" alt="" style="height:220px;" />
      <div class="bowl-overlay">
        <div class="bowl-quote">
          في كل كوب ماتشا<br/>
          <span style="font-size:14px;opacity:0.75;">قصة من قلب أوجي اليابانية</span>
        </div>
      </div>
    </div>

    <!-- BODY -->
    <div class="body" style="text-align:center;padding:44px 40px 36px;">
      <div class="eyebrow" style="text-align:center;">النشرة البريدية</div>
      <h1 class="greeting" style="text-align:center;font-size:24px;">أهلاً بك في UJI MATCHA</h1>
      <p class="sub" style="text-align:center;max-width:380px;margin:12px auto 32px;">
        انضممت إلى مجتمع عشّاق الماتشا اليابانية الأصيلة.
        ستصل إليك قريباً أسرار الريتشوال، ومستجدات المجلة، والإصدارات الحصرية.
      </p>

      <hr class="divider"/>

      <!-- 3 pillars -->
      <table style="width:100%;border-collapse:collapse;text-align:center;font-family:'IBM Plex Sans Arabic',Tahoma,sans-serif;">
        <tr>
          ${[
            ["🍵","ريتشوال الماتشا","دليلك لإعداد كوب مثالي"],
            ["📖","من المجلة","مقالات عن أصول الماتشا"],
            ["✦","عروض حصرية","لمشتركي النشرة فقط"],
          ].map(([icon,title,sub]) => `
            <td style="padding:16px 8px;vertical-align:top;">
              <div style="font-size:26px;margin-bottom:8px;">${icon}</div>
              <div style="font-size:13px;font-weight:600;color:#1C201B;margin-bottom:4px;">${title}</div>
              <div style="font-size:12px;color:#9BA17B;">${sub}</div>
            </td>`).join("")}
        </tr>
      </table>

      <div class="cta-wrap" style="margin-top:28px;">
        <a class="cta" href="https://ujimatcha.store">اكتشف المتجر</a>
      </div>
    </div>

    <!-- CUP STRIP -->
    <div class="cup-strip">
      <img class="cup-img" src="${CUP_URL}" alt="" />
    </div>

    <!-- FOOTER -->
    <div class="ftr">
      ${logoWhiteImg.replace('width="140"', 'width="100"')}
      <div class="ftr-divider"></div>
      <p>
        <a href="https://ujimatcha.store">ujimatcha.store</a> &nbsp;·&nbsp;
        <a href="mailto:info@qirox.online">info@qirox.online</a>
      </p>
      <p style="margin-top:10px;font-size:10px;color:#3E5E48;">
        © 2026 UJI MATCHA · إذا لم تشترك بنفسك تجاهل هذه الرسالة
      </p>
    </div>

  </div>
</div>
</body>
</html>`;

  try {
    await transporter.sendMail({
      from: FROM,
      to: email,
      subject: "مرحباً في UJI MATCHA ✦ — ريتشوال الماتشا ينتظرك",
      html,
    });
    console.log("[email] newsletter welcome sent to", email);
  } catch (e) {
    console.error("[email] newsletter welcome failed:", e);
  }
}

/* ═══════════════════════════════════════════════════════════════════
   TEST EMAIL (sends all three templates in one go)
═══════════════════════════════════════════════════════════════════ */
export async function sendTestEmail(to: string) {
  // 1. Newsletter welcome
  await sendNewsletterWelcome(to);

  // 2. Mock order confirmation
  const mockOrder = {
    orderNumber: "UJI-TEST-001",
    customer: { name: "عبدالله الاختباري", phone: "0512345678", email: to },
    items: [
      { name: "ماتشا احتفالية — Grade A", qty: 2, price: 149 },
      { name: "طقم إعداد الماتشا", qty: 1, price: 299 },
    ],
    address: { city: "الرياض", district: "النخيل", street: "شارع التخصصي 12" },
    shipping: 0,
    total: 597,
    paymentMethod: "cod",
  };
  await sendOrderConfirmation(mockOrder);

  // 3. Admin alert
  await sendAdminOrderAlert(mockOrder);
}

/* ═══════════════════════════════════════════════════════════════════
   PASSWORD RESET OTP
═══════════════════════════════════════════════════════════════════ */
export async function sendPasswordResetOtp(email: string, name: string, otp: string) {
  const html = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>رمز إعادة كلمة المرور</title>
  <style>${SHARED_CSS}</style>
</head>
<body>
<div class="outer">
  <div class="card">
    <div class="hdr">
      ${logoWhiteImg}
      <div class="hdr-line"></div>
      <div class="hdr-tag">إعادة تعيين كلمة المرور</div>
    </div>
    <div class="body" style="text-align:center;padding:40px 40px 32px;">
      <div class="eyebrow" style="text-align:center;">رمز التحقق</div>
      <h1 class="greeting" style="text-align:center;font-size:20px;margin-bottom:8px;">
        مرحباً ${name || ""}،
      </h1>
      <p class="sub" style="text-align:center;max-width:360px;margin:0 auto 32px;">
        طلبت إعادة تعيين كلمة المرور. استخدم الرمز أدناه خلال <strong style="color:#1F3929;">١٥ دقيقة</strong>.
      </p>

      <!-- OTP Box -->
      <div style="background:#1F3929;padding:24px 40px;margin:0 auto 32px;display:inline-block;min-width:200px;">
        <div style="font-family:monospace;font-size:36px;font-weight:700;letter-spacing:0.35em;color:#F2EADB;direction:ltr;text-align:center;">
          ${otp}
        </div>
      </div>

      <p style="font-family:'IBM Plex Sans Arabic',Tahoma,sans-serif;font-size:13px;color:#9BA17B;line-height:1.8;text-align:center;max-width:320px;margin:0 auto 24px;">
        إذا لم تطلب إعادة كلمة المرور، تجاهل هذه الرسالة — حسابك بأمان.
      </p>

      <hr style="border:none;border-top:1px solid #DDD5C3;margin:0 0 24px;" />
      <div style="font-family:'IBM Plex Sans Arabic',Tahoma,sans-serif;font-size:12px;color:#C8BBA4;text-align:center;">
        ينتهي هذا الرمز بعد ١٥ دقيقة من وقت الإرسال
      </div>
    </div>
    <div class="ftr">
      ${logoWhiteImg.replace('width="140"', 'width="90"')}
      <div class="ftr-divider"></div>
      <p>
        <a href="https://ujimatcha.store">ujimatcha.store</a> &nbsp;·&nbsp;
        <a href="mailto:info@qirox.online">info@qirox.online</a>
      </p>
      <p style="margin-top:8px;font-size:10px;color:#3E5E48;">© 2026 UJI MATCHA</p>
    </div>
  </div>
</div>
</body>
</html>`;
  try {
    await transporter.sendMail({
      from: FROM,
      to: email,
      subject: `${otp} — رمز إعادة تعيين كلمة المرور في UJI MATCHA`,
      html,
    });
    console.log("[email] password reset OTP sent to", email);
  } catch (e) {
    console.error("[email] password reset failed:", e);
  }
}

export { transporter };
