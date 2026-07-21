import nodemailer from "nodemailer";

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

const FROM    = `"UJI MATCHA" <${process.env.CPANEL_SMTP_USER || "info@qirox.online"}>`;
const ADMIN   = process.env.ADMIN_EMAIL || "qiroxsystem@gmail.com";
const STORE   = "https://ujimatcha.store";

/* ─────────────────────────────────────────────────────────────────
   SHARED LAYOUT
   Clean white card, no external images, works in all email clients
───────────────────────────────────────────────────────────────── */
function layout(body: string): string {
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
</head>
<body style="margin:0;padding:0;background:#F0EBE1;font-family:Arial,Tahoma,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr><td align="center" style="padding:40px 16px;">

    <table width="560" cellpadding="0" cellspacing="0" border="0"
           style="max-width:560px;background:#ffffff;border-radius:4px;overflow:hidden;
                  box-shadow:0 2px 12px rgba(0,0,0,0.07);">

      <!-- HEADER -->
      <tr>
        <td style="background:#1F3929;padding:32px 40px;text-align:center;">
          <div style="font-family:Georgia,'Times New Roman',serif;
                      font-size:22px;font-weight:400;letter-spacing:0.3em;
                      color:#F2EADB;">UJI MATCHA</div>
          <div style="width:32px;height:1px;background:#9BA17B;margin:10px auto 0;"></div>
        </td>
      </tr>

      <!-- BODY -->
      ${body}

      <!-- FOOTER -->
      <tr>
        <td style="background:#F7F4EF;padding:24px 40px;text-align:center;
                   border-top:1px solid #E5DDD0;">
          <p style="margin:0;font-size:11px;color:#A09680;line-height:1.8;">
            <a href="${STORE}" style="color:#1F3929;text-decoration:none;">ujimatcha.store</a>
            &nbsp;·&nbsp;
            <a href="mailto:info@qirox.online" style="color:#1F3929;text-decoration:none;">info@qirox.online</a>
          </p>
          <p style="margin:6px 0 0;font-size:10px;color:#C0B49A;">© 2026 UJI MATCHA — جميع الحقوق محفوظة</p>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body></html>`;
}

/* ─────────────────────────────────────────────────────────────────
   HELPER: info row for admin alert
───────────────────────────────────────────────────────────────── */
function row(label: string, value: string): string {
  return `
  <tr>
    <td style="padding:11px 0;border-bottom:1px solid #F0EBE1;font-size:13px;
               color:#9BA17B;width:110px;vertical-align:top;">${label}</td>
    <td style="padding:11px 0;border-bottom:1px solid #F0EBE1;font-size:13px;
               color:#1C201B;font-weight:500;">${value}</td>
  </tr>`;
}

/* ═══════════════════════════════════════════════════════════════
   1.  ADMIN ORDER ALERT  →  qiroxsystem@gmail.com
   Sent on every new order, cash or card
═══════════════════════════════════════════════════════════════ */
export async function sendAdminOrderAlert(order: any) {
  const items = (order.items || [])
    .map((i: any) => `${i.name} × ${i.qty}`)
    .join(" ، ");

  const payLabel =
    order.paymentMethod === "cod"    ? "عند الاستلام" :
    order.paymentMethod === "geidea" ? "بطاقة – Geidea" :
    order.paymentMethod || "—";

  const body = `
    <tr>
      <td style="padding:32px 40px;">

        <!-- badge -->
        <div style="display:inline-block;background:#F0EBE1;border-radius:20px;
                    padding:4px 14px;font-size:11px;letter-spacing:0.12em;
                    color:#9BA17B;margin-bottom:20px;">طلب جديد</div>

        <!-- order number -->
        <h1 style="margin:0 0 6px;font-size:26px;font-weight:700;
                   color:#1F3929;letter-spacing:0.04em;">
          ${order.orderNumber}
        </h1>
        <p style="margin:0 0 28px;font-size:13px;color:#A09680;">
          وصل للتو — يرجى المراجعة والتأكيد
        </p>

        <!-- divider -->
        <div style="height:1px;background:#F0EBE1;margin-bottom:20px;"></div>

        <!-- details table -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          ${row("العميل",    `${order.customer?.name || "—"}`)}
          ${row("الجوال",    order.customer?.phone  || "—")}
          ${row("البريد",    order.customer?.email  || "—")}
          ${row("المدينة",   `${order.address?.city || "—"}${order.address?.district ? " / " + order.address.district : ""}`)}
          ${row("الشارع",    order.address?.street  || "—")}
          ${row("المنتجات",  items || "—")}
          ${row("الدفع",     payLabel)}
        </table>

        <!-- total -->
        <div style="margin-top:24px;background:#1F3929;border-radius:3px;
                    padding:18px 24px;display:flex;justify-content:space-between;
                    align-items:center;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="font-size:13px;color:#9BA17B;">الإجمالي</td>
              <td style="text-align:left;font-size:22px;font-weight:700;
                         color:#F2EADB;">${(order.total || 0).toFixed(2)} <span style="font-size:12px;font-weight:400;">ر.س</span></td>
            </tr>
          </table>
        </div>

        <!-- CTA -->
        <div style="text-align:center;margin-top:28px;">
          <a href="${STORE}/admin"
             style="display:inline-block;background:#1F3929;color:#F2EADB;
                    padding:13px 36px;text-decoration:none;border-radius:3px;
                    font-size:13px;letter-spacing:0.08em;">
            فتح لوحة الإدارة ←
          </a>
        </div>

      </td>
    </tr>`;

  try {
    await transporter.sendMail({
      from: FROM,
      to: ADMIN,
      subject: `🛒 طلب جديد ${order.orderNumber} — ${(order.total || 0).toFixed(2)} ر.س`,
      html: layout(body),
      text: `طلب جديد: ${order.orderNumber}\nالعميل: ${order.customer?.name} ${order.customer?.phone}\nالإجمالي: ${(order.total || 0).toFixed(2)} ر.س`,
    });
    console.log("[email] admin alert →", ADMIN, "for", order.orderNumber);
  } catch (e) {
    console.error("[email] admin alert failed:", e);
  }
}

/* ═══════════════════════════════════════════════════════════════
   2.  ORDER CONFIRMATION  →  customer email
═══════════════════════════════════════════════════════════════ */
export async function sendOrderConfirmation(order: any) {
  const itemsRows = (order.items || []).map((i: any) => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #F0EBE1;font-size:13px;color:#1C201B;">
        ${i.name}
      </td>
      <td style="padding:10px 0;border-bottom:1px solid #F0EBE1;font-size:13px;
                 color:#9BA17B;text-align:center;width:40px;">×${i.qty}</td>
      <td style="padding:10px 0;border-bottom:1px solid #F0EBE1;font-size:13px;
                 font-weight:600;color:#1F3929;text-align:left;white-space:nowrap;width:80px;">
        ${(i.price * i.qty).toFixed(2)} ر.س
      </td>
    </tr>`).join("");

  const body = `
    <tr>
      <td style="padding:32px 40px;">

        <div style="display:inline-block;background:#F0EBE1;border-radius:20px;
                    padding:4px 14px;font-size:11px;letter-spacing:0.12em;
                    color:#9BA17B;margin-bottom:20px;">تأكيد الطلب</div>

        <h1 style="margin:0 0 6px;font-size:22px;font-weight:400;color:#1C201B;">
          أهلاً ${order.customer?.name || ""}،
        </h1>
        <p style="margin:0 0 6px;font-size:13px;color:#A09680;line-height:1.8;">
          تم استلام طلبك بنجاح.
        </p>
        <p style="margin:0 0 28px;font-size:13px;color:#A09680;">
          رقم الطلب: <strong style="color:#1F3929;">${order.orderNumber}</strong>
        </p>

        <div style="height:1px;background:#F0EBE1;margin-bottom:20px;"></div>

        <!-- items -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          ${itemsRows}
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #F0EBE1;font-size:12px;color:#9BA17B;">الشحن</td>
            <td></td>
            <td style="padding:10px 0;border-bottom:1px solid #F0EBE1;font-size:12px;
                       color:#9BA17B;text-align:left;">
              ${order.shipping === 0 ? "مجاني" : (order.shipping || 0) + " ر.س"}
            </td>
          </tr>
          <tr>
            <td style="padding:14px 0 0;font-size:15px;font-weight:700;color:#1F3929;">الإجمالي</td>
            <td></td>
            <td style="padding:14px 0 0;font-size:15px;font-weight:700;
                       color:#1F3929;text-align:left;">${(order.total || 0).toFixed(2)} ر.س</td>
          </tr>
        </table>

        <!-- address -->
        <div style="margin-top:24px;background:#F7F4EF;border-right:3px solid #9BA17B;
                    padding:16px 18px;border-radius:2px;">
          <div style="font-size:11px;letter-spacing:0.15em;color:#9BA17B;margin-bottom:8px;">
            عنوان التوصيل
          </div>
          <div style="font-size:13px;color:#555;line-height:1.9;">
            ${order.address?.city || ""}${order.address?.district ? " — " + order.address.district : ""}<br/>
            ${order.address?.street || ""}<br/>
            ${order.customer?.phone || ""}
          </div>
        </div>

        <!-- CTA -->
        <div style="text-align:center;margin-top:28px;">
          <a href="${STORE}"
             style="display:inline-block;background:#1F3929;color:#F2EADB;
                    padding:13px 36px;text-decoration:none;border-radius:3px;
                    font-size:13px;letter-spacing:0.08em;">
            تصفّح المتجر
          </a>
        </div>

      </td>
    </tr>`;

  if (!order.customer?.email) return;
  try {
    await transporter.sendMail({
      from: FROM,
      to: order.customer.email,
      subject: `تأكيد طلبك ${order.orderNumber} — UJI MATCHA`,
      html: layout(body),
      text: `تأكيد الطلب ${order.orderNumber} — الإجمالي: ${(order.total || 0).toFixed(2)} ر.س`,
    });
    console.log("[email] order confirmation →", order.customer.email);
  } catch (e) {
    console.error("[email] order confirmation failed:", e);
  }
}

/* ═══════════════════════════════════════════════════════════════
   3.  NEWSLETTER WELCOME
═══════════════════════════════════════════════════════════════ */
export async function sendNewsletterWelcome(email: string) {
  const body = `
    <tr>
      <td style="padding:32px 40px;text-align:center;">

        <div style="font-size:32px;margin-bottom:16px;">🍵</div>

        <h1 style="margin:0 0 12px;font-size:22px;font-weight:400;color:#1C201B;">
          أهلاً بك في UJI MATCHA
        </h1>
        <p style="margin:0 auto 28px;font-size:13px;color:#A09680;line-height:1.9;max-width:360px;">
          انضممت إلى مجتمع عشّاق الماتشا اليابانية الأصيلة. ستصل إليك قريباً أسرار الريتشوال ومستجدات المجلة والإصدارات الحصرية.
        </p>

        <div style="height:1px;background:#F0EBE1;margin:0 0 28px;"></div>

        <!-- 3 pillars -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="padding:0 8px;text-align:center;vertical-align:top;width:33%;">
              <div style="font-size:20px;margin-bottom:8px;">🍃</div>
              <div style="font-size:12px;font-weight:600;color:#1C201B;margin-bottom:4px;">ريتشوال الماتشا</div>
              <div style="font-size:11px;color:#A09680;">دليلك لكوب مثالي</div>
            </td>
            <td style="padding:0 8px;text-align:center;vertical-align:top;width:33%;">
              <div style="font-size:20px;margin-bottom:8px;">📖</div>
              <div style="font-size:12px;font-weight:600;color:#1C201B;margin-bottom:4px;">من المجلة</div>
              <div style="font-size:11px;color:#A09680;">قصص من قلب أوجي</div>
            </td>
            <td style="padding:0 8px;text-align:center;vertical-align:top;width:33%;">
              <div style="font-size:20px;margin-bottom:8px;">✦</div>
              <div style="font-size:12px;font-weight:600;color:#1C201B;margin-bottom:4px;">عروض حصرية</div>
              <div style="font-size:11px;color:#A09680;">للمشتركين فقط</div>
            </td>
          </tr>
        </table>

        <div style="margin-top:28px;">
          <a href="${STORE}"
             style="display:inline-block;background:#1F3929;color:#F2EADB;
                    padding:13px 36px;text-decoration:none;border-radius:3px;
                    font-size:13px;letter-spacing:0.08em;">
            اكتشف المتجر
          </a>
        </div>

      </td>
    </tr>`;

  try {
    await transporter.sendMail({
      from: FROM,
      to: email,
      subject: "أهلاً بك في UJI MATCHA ✦",
      html: layout(body),
      text: "مرحباً بك في UJI MATCHA — شكراً لاشتراكك في نشرتنا البريدية.",
    });
    console.log("[email] newsletter welcome →", email);
  } catch (e) {
    console.error("[email] newsletter welcome failed:", e);
  }
}

/* ═══════════════════════════════════════════════════════════════
   4.  PASSWORD RESET OTP
═══════════════════════════════════════════════════════════════ */
export async function sendPasswordResetOtp(email: string, name: string, otp: string) {
  const body = `
    <tr>
      <td style="padding:32px 40px;text-align:center;">

        <h1 style="margin:0 0 8px;font-size:20px;font-weight:400;color:#1C201B;">
          مرحباً ${name || ""}،
        </h1>
        <p style="margin:0 auto 28px;font-size:13px;color:#A09680;line-height:1.9;max-width:340px;">
          طلبت إعادة تعيين كلمة المرور. استخدم الرمز أدناه خلال
          <strong style="color:#1F3929;">١٥ دقيقة</strong>.
        </p>

        <!-- OTP box -->
        <div style="background:#1F3929;border-radius:4px;padding:22px 40px;
                    display:inline-block;margin-bottom:24px;">
          <div style="font-family:'Courier New',monospace;font-size:34px;
                      font-weight:700;letter-spacing:0.4em;color:#F2EADB;
                      direction:ltr;">
            ${otp}
          </div>
        </div>

        <p style="margin:0 auto 0;font-size:11px;color:#C0B49A;max-width:300px;line-height:1.8;">
          إذا لم تطلب إعادة كلمة المرور، تجاهل هذه الرسالة — حسابك بأمان.
        </p>

      </td>
    </tr>`;

  try {
    await transporter.sendMail({
      from: FROM,
      to: email,
      subject: `${otp} — رمز التحقق في UJI MATCHA`,
      html: layout(body),
      text: `رمز التحقق: ${otp}\nصالح لمدة ١٥ دقيقة.`,
    });
    console.log("[email] OTP →", email);
  } catch (e) {
    console.error("[email] OTP failed:", e);
  }
}

/* ═══════════════════════════════════════════════════════════════
   5.  TEST — sends admin alert + order confirmation to one address
═══════════════════════════════════════════════════════════════ */
export async function sendTestEmail(to: string) {
  const mockOrder = {
    orderNumber:   "UJI-TEST-001",
    customer:      { name: "محمد الاختباري", phone: "0512345678", email: to },
    items: [
      { name: "ماتشا UJI — كيس احتفالي 30g", qty: 2, price: 149 },
      { name: "ماتشا UJI — علبة كلاسيك",      qty: 1, price: 89  },
    ],
    address:       { city: "الرياض", district: "النخيل", street: "شارع التخصصي 12" },
    shipping:      0,
    total:         387,
    paymentMethod: "cod",
  };

  // Override ADMIN for test so it goes to the requested address
  const originalAdmin = process.env.ADMIN_EMAIL;
  process.env.ADMIN_EMAIL = to;

  await sendAdminOrderAlert(mockOrder);
  await sendOrderConfirmation(mockOrder);

  process.env.ADMIN_EMAIL = originalAdmin;
  console.log("[email] test suite sent to", to);
}

export { transporter };
