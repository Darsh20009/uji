import { Router } from "express";
import passport from "passport";
import multer from "multer";
import path from "path";
import fs from "fs";
import { Product, Order, Customer, Settings, Review, Coupon, hashPass } from "./models";
import { requireAuth } from "./auth";
import { sendOrderConfirmation, sendAdminOrderAlert, sendNewsletterWelcome, sendTestEmail } from "./email";
import { createGeideaSession, verifyGeideaCallback, geideaEnabled } from "./geidea";

const router = Router();
const upload = multer({ dest: "uploads/", limits: { fileSize: 20 * 1024 * 1024 } });

const ADMIN_PHONE = process.env.ADMIN_PHONE || "0552469643";

const requireAdmin = (req: any, res: any, next: any) => {
  if (req.isAuthenticated() && ((req.user as any).phone === ADMIN_PHONE || (req.user as any).role === "admin")) return next();
  res.status(403).json({ message: "غير مصرح" });
};

const requireEmployee = (req: any, res: any, next: any) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: "يرجى تسجيل الدخول" });
};

function getLoyaltyTier(points: number): string {
  if (points >= 2000) return "platinum";
  if (points >= 1000) return "gold";
  if (points >= 300) return "silver";
  return "bronze";
}

/* ─── SEO: sitemap.xml ──────────────────────────────────────────── */
router.get("/sitemap.xml", async (_req, res) => {
  try {
    const products = await Product.find({ isActive: true }).select("_id updatedAt");
    const base = "https://ujimatcha.store";
    const staticPages = ["/", "/products", "/wholesale", "/policy"];
    const urls = [
      ...staticPages.map(p => `
  <url>
    <loc>${base}${p}</loc>
    <changefreq>${p === "/" ? "weekly" : "monthly"}</changefreq>
    <priority>${p === "/" ? "1.0" : "0.7"}</priority>
  </url>`),
      ...products.map(p => `
  <url>
    <loc>${base}/products/${p._id}</loc>
    <lastmod>${new Date(p.updatedAt as Date).toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`),
    ];
    res.set("Content-Type", "application/xml");
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("")}
</urlset>`);
  } catch { res.status(500).send(""); }
});

router.get("/robots.txt", (_req, res) => {
  res.set("Content-Type", "text/plain");
  res.send(`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/admin\nSitemap: https://ujimatcha.store/sitemap.xml`);
});

/* ─── Products ──────────────────────────────────────────────────── */
router.get("/products", async (req, res) => {
  try {
    const { q, category, featured } = req.query;
    const filter: any = { isActive: true };
    if (q) filter.name = { $regex: q, $options: "i" };
    if (category) filter.category = category;
    if (featured === "1") filter.featured = true;
    res.json(await Product.find(filter).sort({ sortOrder: 1, createdAt: -1 }));
  } catch (e: any) { res.status(500).json({ message: e.message }); }
});

router.get("/products/:id", async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ message: "المنتج غير موجود" });
    res.json(p);
  } catch (e: any) { res.status(500).json({ message: e.message }); }
});

/* ─── Reviews ───────────────────────────────────────────────────── */
router.get("/products/:id/reviews", async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.id, isApproved: true }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (e: any) { res.status(500).json({ message: e.message }); }
});

router.post("/products/:id/reviews", requireEmployee, async (req: any, res) => {
  try {
    const { rating, comment } = req.body;
    if (!rating || rating < 1 || rating > 5) return res.status(400).json({ message: "تقييم غير صحيح (1-5)" });
    const existing = await Review.findOne({ productId: req.params.id, customerId: req.user._id });
    if (existing) return res.status(400).json({ message: "لقد قيّمت هذا المنتج مسبقاً" });
    const review = await Review.create({
      productId: req.params.id,
      customerId: req.user._id,
      customerName: req.user.name,
      rating: Number(rating),
      comment,
    });
    const all = await Review.find({ productId: req.params.id, isApproved: true });
    const avg = all.reduce((s, r) => s + r.rating, 0) / all.length;
    await Product.findByIdAndUpdate(req.params.id, { avgRating: Math.round(avg * 10) / 10, reviewCount: all.length });
    res.json(review);
  } catch (e: any) { res.status(500).json({ message: e.message }); }
});

/* ─── Coupon ────────────────────────────────────────────────────── */
router.post("/coupons/apply", async (req, res) => {
  try {
    const { code, orderTotal } = req.body;
    if (!code) return res.status(400).json({ message: "أدخل رمز الكوبون" });
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) return res.status(404).json({ message: "كوبون غير صحيح أو منتهي" });
    if (coupon.expiresAt && coupon.expiresAt < new Date()) return res.status(400).json({ message: "انتهت صلاحية الكوبون" });
    if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) return res.status(400).json({ message: "تجاوز الكوبون الحد الأقصى للاستخدام" });
    if (coupon.minOrder > 0 && orderTotal < coupon.minOrder) return res.status(400).json({ message: `الحد الأدنى للطلب ${coupon.minOrder} ر.س` });
    const discount = coupon.type === "percent"
      ? Math.round((orderTotal * coupon.value) / 100)
      : coupon.value;
    res.json({ ok: true, discount: Math.min(discount, orderTotal), code: coupon.code, type: coupon.type, value: coupon.value });
  } catch (e: any) { res.status(500).json({ message: e.message }); }
});

/* ─── Orders ────────────────────────────────────────────────────── */
router.post("/orders", async (req: any, res) => {
  try {
    const { customer, address, items, paymentMethod, notes, couponCode } = req.body;
    if (!items?.length) return res.status(400).json({ message: "السلة فارغة" });

    const num = "ORD-" + Date.now();
    const subtotal = items.reduce((s: number, i: any) => s + i.price * i.qty, 0);

    const shippingThresholdSetting = await Settings.findOne({ key: "shippingFreeThreshold" });
    const shippingFeeSetting = await Settings.findOne({ key: "shippingFee" });
    const threshold = Number(shippingThresholdSetting?.value ?? 200);
    const shippingFee = Number(shippingFeeSetting?.value ?? 30);
    const shipping = subtotal >= threshold ? 0 : shippingFee;

    let discount = 0;
    let validCoupon: any = null;
    if (couponCode) {
      validCoupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (validCoupon) {
        discount = validCoupon.type === "percent"
          ? Math.round((subtotal * validCoupon.value) / 100)
          : validCoupon.value;
        discount = Math.min(discount, subtotal);
      }
    }

    const total = Math.max(0, subtotal - discount + shipping);
    const pointsEarned = Math.floor(total / 10);

    // For Geidea: initially pending_payment; for COD/others: pending
    const initialStatus = paymentMethod === "geidea" ? "pending_payment" : "pending";

    const order = await Order.create({
      orderNumber: num,
      customerId: req.isAuthenticated() ? req.user._id : undefined,
      customer, address, items,
      subtotal, discount, shipping, total,
      paymentMethod, couponCode: validCoupon?.code, notes,
      pointsEarned,
      status: initialStatus,
    });

    if (validCoupon) await Coupon.findByIdAndUpdate(validCoupon._id, { $inc: { usedCount: 1 } });

    if (req.isAuthenticated() && paymentMethod !== "geidea") {
      const newPoints = (req.user.loyaltyPoints || 0) + pointsEarned;
      const newSpent = (req.user.totalSpent || 0) + total;
      const newTier = getLoyaltyTier(newPoints);
      await Customer.findByIdAndUpdate(req.user._id, {
        $inc: { loyaltyPoints: pointsEarned, totalSpent: total },
        loyaltyTier: newTier,
      });
    }

    if (paymentMethod === "geidea") {
      // Create Geidea session
      try {
        const baseUrl = process.env.REPLIT_DEV_DOMAIN
          ? `https://${process.env.REPLIT_DEV_DOMAIN}`
          : "https://ujimatcha.store";
        const { redirectUrl } = await createGeideaSession({
          amount: total,
          orderId: order.orderNumber,
          callbackUrl: `${baseUrl}/api/payment/geidea/callback`,
          returnUrl: `${baseUrl}/checkout?geidea_return=1&order=${order._id}`,
          customerEmail: customer?.email,
          customerName: customer?.name,
        });
        return res.json({ order, geideaRedirectUrl: redirectUrl });
      } catch (geideaErr: any) {
        // Fallback: update status back to pending, notify admin
        await Order.findByIdAndUpdate(order._id, { status: "pending", notes: (notes || "") + " [Geidea error: " + geideaErr.message + "]" });
        sendAdminOrderAlert(order).catch(console.error);
        return res.json({ order, geideaError: geideaErr.message });
      }
    }

    // Non-Geidea orders
    if (customer?.email) sendOrderConfirmation(order).catch(console.error);
    sendAdminOrderAlert(order).catch(console.error);

    res.json({ order });
  } catch (e: any) { res.status(500).json({ message: e.message }); }
});

/* ─── Geidea callback (POST from Geidea servers) ────────────────── */
router.post("/payment/geidea/callback", async (req, res) => {
  try {
    const params = req.body;
    const isValid = verifyGeideaCallback(params);
    if (!isValid) {
      console.warn("[Geidea] invalid callback signature", params);
      return res.status(400).json({ message: "invalid signature" });
    }
    const { merchantReferenceId, responseCode } = params;
    const success = responseCode === "000";
    const order = await Order.findOne({ orderNumber: merchantReferenceId });
    if (!order) return res.status(404).json({ message: "order not found" });

    if (success) {
      await Order.findByIdAndUpdate(order._id, { status: "confirmed", paymentStatus: "paid" });
      // Award loyalty points
      if (order.customerId) {
        const newTier = getLoyaltyTier(order.pointsEarned || 0);
        await Customer.findByIdAndUpdate(order.customerId, {
          $inc: { loyaltyPoints: order.pointsEarned || 0, totalSpent: order.total || 0 },
          loyaltyTier: newTier,
        });
      }
      if ((order as any).customer?.email) sendOrderConfirmation(order).catch(console.error);
      sendAdminOrderAlert(order).catch(console.error);
    } else {
      await Order.findByIdAndUpdate(order._id, { status: "cancelled" });
    }
    res.json({ ok: true });
  } catch (e: any) { res.status(500).json({ message: e.message }); }
});

/* ─── Geidea return URL (GET from browser) ──────────────────────── */
router.get("/payment/geidea/callback", async (req, res) => {
  res.redirect("/");
});

router.get("/orders/:id", async (req, res) => {
  try {
    const o = await Order.findById(req.params.id);
    if (!o) return res.status(404).json({ message: "الطلب غير موجود" });
    res.json(o);
  } catch (e: any) { res.status(500).json({ message: e.message }); }
});

router.get("/me/orders", requireEmployee, async (req: any, res) => {
  try {
    const orders = await Order.find({ customerId: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (e: any) { res.status(500).json({ message: e.message }); }
});

/* ─── Newsletter ────────────────────────────────────────────────── */
router.post("/newsletter", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res.status(400).json({ message: "بريد إلكتروني غير صحيح" });
    const existing = await Settings.findOne({ key: "newsletter_subscribers" });
    const list: string[] = existing?.value || [];
    if (!list.includes(email)) {
      list.push(email);
      await Settings.findOneAndUpdate({ key: "newsletter_subscribers" }, { value: list }, { upsert: true });
      sendNewsletterWelcome(email).catch(console.error);
    }
    res.json({ ok: true });
  } catch (e: any) { res.status(500).json({ message: e.message }); }
});

/* ─── Auth ──────────────────────────────────────────────────────── */
router.post("/auth/register", async (req: any, res) => {
  try {
    const { name, phone, password, email, role, jobTitle } = req.body;
    if (!name || !phone || !password) return res.status(400).json({ message: "بيانات ناقصة" });
    if (await Customer.findOne({ phone })) return res.status(400).json({ message: "الجوال مسجل مسبقاً" });

    // Only allow customer or employee on self-registration; admin must be set via admin-setup
    const safeRole = role === "employee" ? "employee" : "customer";

    const customer = await Customer.create({
      name, phone, email,
      password: hashPass(password),
      role: safeRole,
      jobTitle: safeRole === "employee" ? jobTitle : undefined,
    });

    req.login(customer, (err: any) => err ? res.status(500).json({ message: "خطأ في تسجيل الدخول" }) : res.json({
      id: customer._id, name, phone, role: customer.role,
      loyaltyPoints: 0, loyaltyTier: "bronze",
    }));
  } catch (e: any) { res.status(500).json({ message: e.message }); }
});

router.post("/auth/login", (req, res, next) => {
  passport.authenticate("local", (err: any, user: any, info: any) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info?.message || "بيانات غير صحيحة" });
    req.login(user, (err2: any) => err2 ? next(err2) : res.json({
      id: user._id, name: user.name, phone: user.phone,
      role: user.role, loyaltyPoints: user.loyaltyPoints, loyaltyTier: user.loyaltyTier,
    }));
  })(req, res, next);
});

router.post("/auth/logout", (req, res) => { req.logout(() => {}); res.json({ ok: true }); });

router.get("/auth/me", (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).json({ message: "غير مسجل" });
  const u = req.user as any;
  res.json({ id: u._id, name: u.name, phone: u.phone, email: u.email, role: u.role, loyaltyPoints: u.loyaltyPoints, loyaltyTier: u.loyaltyTier, totalSpent: u.totalSpent, jobTitle: u.jobTitle });
});

router.post("/auth/forgot-password", async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: "يرجى إدخال رقم الجوال" });
    const customer = await Customer.findOne({ phone });
    if (!customer) return res.status(404).json({ message: "لا يوجد حساب بهذا الرقم" });
    if (!customer.email) return res.status(400).json({ message: "لا يوجد بريد إلكتروني مرتبط بهذا الحساب" });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await Customer.updateOne({ phone }, { resetOtp: otp, resetOtpExpiry: new Date(Date.now() + 15 * 60 * 1000) });
    const { sendPasswordResetOtp } = await import("./email");
    await sendPasswordResetOtp(customer.email, customer.name || "", otp);
    res.json({ ok: true, message: `تم إرسال رمز التحقق إلى ${customer.email}` });
  } catch (e: any) { res.status(500).json({ message: e.message }); }
});

router.post("/auth/reset-password", async (req, res) => {
  try {
    const { phone, otp, newPassword } = req.body;
    if (!phone || !otp || !newPassword) return res.status(400).json({ message: "بيانات ناقصة" });
    if (newPassword.length < 6) return res.status(400).json({ message: "كلمة المرور قصيرة جداً" });
    const customer = await Customer.findOne({ phone });
    if (!customer) return res.status(404).json({ message: "الحساب غير موجود" });
    if (!customer.resetOtp || customer.resetOtp !== otp) return res.status(400).json({ message: "رمز التحقق غير صحيح" });
    if (!customer.resetOtpExpiry || customer.resetOtpExpiry < new Date()) return res.status(400).json({ message: "انتهت صلاحية رمز التحقق" });
    await Customer.updateOne({ phone }, { password: hashPass(newPassword), resetOtp: null, resetOtpExpiry: null });
    res.json({ ok: true, message: "تم تغيير كلمة المرور بنجاح" });
  } catch (e: any) { res.status(500).json({ message: e.message }); }
});

router.post("/auth/admin-setup", async (req, res) => {
  try {
    const { password } = req.body;
    if (!password || password.length < 6) return res.status(400).json({ message: "كلمة المرور قصيرة جداً" });
    const existing = await Customer.findOne({ phone: ADMIN_PHONE });
    if (existing) {
      await Customer.updateOne({ phone: ADMIN_PHONE }, { password: hashPass(password), role: "admin" });
      return res.json({ ok: true, message: "تم تحديث كلمة المرور" });
    }
    await Customer.create({ name: "المدير", phone: ADMIN_PHONE, password: hashPass(password), role: "admin" });
    res.json({ ok: true, message: "تم إنشاء حساب المدير" });
  } catch (e: any) { res.status(500).json({ message: e.message }); }
});

/* ─── Admin — Products ──────────────────────────────────────────── */
router.get("/admin/products", requireAdmin, async (_req, res) => {
  res.json(await Product.find().sort({ sortOrder: 1, createdAt: -1 }));
});

router.post("/admin/products", requireAdmin, upload.array("images", 10), async (req, res) => {
  try {
    const data = JSON.parse(req.body.data || "{}");
    const newImages = (req.files as any[]).map((f: any) => `/uploads/${f.filename}`);
    res.json(await Product.create({ ...data, images: [...(data.existingImages || []), ...newImages] }));
  } catch (e: any) { res.status(500).json({ message: e.message }); }
});

router.put("/admin/products/:id", requireAdmin, upload.array("images", 10), async (req, res) => {
  try {
    let updateData: any;
    if (req.headers["content-type"]?.includes("multipart/form-data")) {
      const data = JSON.parse(req.body.data || "{}");
      const newImages = (req.files as any[]).map((f: any) => `/uploads/${f.filename}`);
      updateData = { ...data, images: [...(data.existingImages || []), ...newImages] };
    } else {
      updateData = req.body;
    }
    res.json(await Product.findByIdAndUpdate(req.params.id, updateData, { new: true }));
  } catch (e: any) { res.status(500).json({ message: e.message }); }
});

router.delete("/admin/products/:id", requireAdmin, async (req, res) => {
  try { await Product.findByIdAndDelete(req.params.id); res.json({ ok: true }); }
  catch (e: any) { res.status(500).json({ message: e.message }); }
});

/* ─── Admin — Seed matcha bag ───────────────────────────────────── */
router.post("/admin/seed-matcha-bag", requireAdmin, async (_req, res) => {
  try {
    // Delete all existing products
    await Product.deleteMany({});
    // Add matcha bag product
    const product = await Product.create({
      name: "ماتشا UJI — كيس احتفالي",
      nameEn: "UJI Matcha — Ceremonial Bag",
      description: "ماتشا يابانية احتفالية من الدرجة الأولى، مصدرها أوجي، كيوتو. مطحونة بالحجر، مزروعة في الظل، نقية 100% بدون إضافات. كيس 30 جرام يكفي لـ 15 كوباً.",
      price: 149,
      comparePrice: 199,
      stock: 100,
      category: "matcha",
      isActive: true,
      featured: true,
      sortOrder: 1,
      images: ["/uploads/matcha-bag-1.png", "/uploads/matcha-bag-2.png", "/uploads/matcha-bag-3.png"],
    });
    res.json({ ok: true, product });
  } catch (e: any) { res.status(500).json({ message: e.message }); }
});

/* ─── Admin — Orders ────────────────────────────────────────────── */
router.get("/admin/orders", requireAdmin, async (_req, res) => {
  res.json(await Order.find().sort({ createdAt: -1 }));
});

router.put("/admin/orders/:id", requireAdmin, async (req, res) => {
  try { res.json(await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })); }
  catch (e: any) { res.status(500).json({ message: e.message }); }
});

router.delete("/admin/orders/:id", requireAdmin, async (req, res) => {
  try { await Order.findByIdAndDelete(req.params.id); res.json({ ok: true }); }
  catch (e: any) { res.status(500).json({ message: e.message }); }
});

/* ─── Admin — Customers / Employees ────────────────────────────── */
router.get("/admin/customers", requireAdmin, async (req, res) => {
  try {
    const { role } = req.query;
    const filter: any = {};
    if (role) filter.role = role;
    res.json(await Customer.find(filter).select("-password -resetOtp -resetOtpExpiry").sort({ createdAt: -1 }));
  } catch (e: any) { res.status(500).json({ message: e.message }); }
});

router.put("/admin/customers/:id", requireAdmin, async (req, res) => {
  try {
    const { role, jobTitle, department, permissions, isActive } = req.body;
    const update: any = {};
    if (role !== undefined) update.role = role;
    if (jobTitle !== undefined) update.jobTitle = jobTitle;
    if (department !== undefined) update.department = department;
    if (permissions !== undefined) update.permissions = permissions;
    if (isActive !== undefined) update.isActive = isActive;
    res.json(await Customer.findByIdAndUpdate(req.params.id, update, { new: true }).select("-password"));
  } catch (e: any) { res.status(500).json({ message: e.message }); }
});

router.delete("/admin/customers/:id", requireAdmin, async (req, res) => {
  try { await Customer.findByIdAndDelete(req.params.id); res.json({ ok: true }); }
  catch (e: any) { res.status(500).json({ message: e.message }); }
});

/* ─── Admin — Reviews ───────────────────────────────────────────── */
router.get("/admin/reviews", requireAdmin, async (_req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }).populate("productId", "name");
    res.json(reviews);
  } catch (e: any) { res.status(500).json({ message: e.message }); }
});

router.put("/admin/reviews/:id", requireAdmin, async (req, res) => {
  try { res.json(await Review.findByIdAndUpdate(req.params.id, { isApproved: req.body.isApproved }, { new: true })); }
  catch (e: any) { res.status(500).json({ message: e.message }); }
});

router.delete("/admin/reviews/:id", requireAdmin, async (req, res) => {
  try {
    const r = await Review.findByIdAndDelete(req.params.id);
    if (r) {
      const all = await Review.find({ productId: r.productId, isApproved: true });
      const avg = all.length ? all.reduce((s, x) => s + x.rating, 0) / all.length : 0;
      await Product.findByIdAndUpdate(r.productId, { avgRating: Math.round(avg * 10) / 10, reviewCount: all.length });
    }
    res.json({ ok: true });
  } catch (e: any) { res.status(500).json({ message: e.message }); }
});

/* ─── Admin — Coupons ───────────────────────────────────────────── */
router.get("/admin/coupons", requireAdmin, async (_req, res) => {
  res.json(await Coupon.find().sort({ createdAt: -1 }));
});

router.post("/admin/coupons", requireAdmin, async (req, res) => {
  try {
    const { code, type, value, minOrder, maxUses, expiresAt } = req.body;
    if (!code || !value) return res.status(400).json({ message: "الرمز والقيمة مطلوبان" });
    const coupon = await Coupon.create({
      code: code.toUpperCase().replace(/\s/g, ""),
      type: type || "percent", value: Number(value),
      minOrder: Number(minOrder) || 0,
      maxUses: Number(maxUses) || 0,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
    });
    res.json(coupon);
  } catch (e: any) {
    if (e.code === 11000) return res.status(400).json({ message: "هذا الرمز موجود مسبقاً" });
    res.status(500).json({ message: e.message });
  }
});

router.put("/admin/coupons/:id", requireAdmin, async (req, res) => {
  try { res.json(await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true })); }
  catch (e: any) { res.status(500).json({ message: e.message }); }
});

router.delete("/admin/coupons/:id", requireAdmin, async (req, res) => {
  try { await Coupon.findByIdAndDelete(req.params.id); res.json({ ok: true }); }
  catch (e: any) { res.status(500).json({ message: e.message }); }
});

/* ─── Admin — Stats ─────────────────────────────────────────────── */
router.get("/admin/stats", requireAdmin, async (_req, res) => {
  try {
    const [totalOrders, totalCustomers, totalEmployees, totalProducts, orders] = await Promise.all([
      Order.countDocuments(),
      Customer.countDocuments({ role: "customer" }),
      Customer.countDocuments({ role: "employee" }),
      Product.countDocuments({ isActive: true }),
      Order.find({ status: { $ne: "cancelled" } }).select("total createdAt"),
    ]);
    const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const dailyRevenue: Record<string, number> = {};
    orders.filter(o => o.createdAt > sevenDaysAgo).forEach(o => {
      const day = new Date(o.createdAt as Date).toLocaleDateString("ar-SA", { weekday: "short" });
      dailyRevenue[day] = (dailyRevenue[day] || 0) + (o.total || 0);
    });
    res.json({ totalOrders, totalCustomers, totalEmployees, totalProducts, totalRevenue, dailyRevenue });
  } catch (e: any) { res.status(500).json({ message: e.message }); }
});

/* ─── Admin — Upload ────────────────────────────────────────────── */
router.post("/admin/upload", requireAdmin, upload.single("file"), (req, res) => {
  const f = req.file;
  if (!f) return res.status(400).json({ message: "لا يوجد ملف" });
  res.json({ url: `/uploads/${f.filename}` });
});

/* ─── Admin — Settings ──────────────────────────────────────────── */
router.get("/admin/settings", requireAdmin, async (_req, res) => {
  const settings = await Settings.find({ key: { $ne: "newsletter_subscribers" } });
  const obj: any = {};
  settings.forEach((s) => { obj[s.key] = s.value; });
  // Add Geidea status
  obj._geideaEnabled = geideaEnabled();
  res.json(obj);
});

router.put("/admin/settings", requireAdmin, async (req, res) => {
  try {
    await Promise.all(
      Object.entries(req.body as Record<string, any>).map(([key, value]) =>
        Settings.findOneAndUpdate({ key }, { value }, { upsert: true, new: true })
      )
    );
    res.json({ ok: true });
  } catch (e: any) { res.status(500).json({ message: e.message }); }
});

router.get("/admin/newsletter", requireAdmin, async (_req, res) => {
  const s = await Settings.findOne({ key: "newsletter_subscribers" });
  res.json({ count: (s?.value as string[] || []).length, emails: s?.value || [] });
});

/* ─── Public Settings ───────────────────────────────────────────── */
router.get("/settings", async (_req, res) => {
  const keys = ["storeName","storePhone","storeEmail","shippingFee","shippingFreeThreshold","maintenanceMode","whatsapp","trustBadges","trustBadgesPosition"];
  const settings = await Settings.find({ key: { $in: keys } });
  const obj: any = {};
  settings.forEach((s) => { obj[s.key] = s.value; });
  obj._geideaEnabled = geideaEnabled();
  res.json(obj);
});

/* ─── Test Email ────────────────────────────────────────────────── */
router.post("/admin/send-test-email", requireAdmin, async (req: any, res) => {
  const { to } = req.body;
  if (!to) return res.status(400).json({ message: "missing `to`" });
  try { await sendTestEmail(to); res.json({ ok: true }); }
  catch (e: any) { res.status(500).json({ message: e.message }); }
});

export default router;
