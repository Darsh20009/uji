import mongoose, { Schema } from "mongoose";
import { scryptSync, randomBytes, timingSafeEqual } from "crypto";

export function hashPass(p: string) {
  const s = randomBytes(16).toString("hex");
  return scryptSync(p, s, 64).toString("hex") + "." + s;
}
export function checkPass(supplied: string, stored: string) {
  const [h, s] = stored.split(".");
  if (!h || !s) return false;
  return timingSafeEqual(Buffer.from(h, "hex"), scryptSync(supplied, s, 64));
}

/* ─── Product ────────────────────────────────────────────────────── */
const ProductSchema = new Schema({
  name: String, nameEn: String, description: String, price: Number,
  comparePrice: Number, images: [String], category: String,
  stock: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  sortOrder: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  avgRating: { type: Number, default: 0 },
}, { timestamps: true });
export const Product = mongoose.model("Product", ProductSchema);

/* ─── Order ──────────────────────────────────────────────────────── */
const OrderSchema = new Schema({
  orderNumber: { type: String, unique: true },
  customerId: { type: Schema.Types.ObjectId, ref: "Customer" },
  customer: { name: String, phone: String, email: String },
  address: { city: String, district: String, street: String, notes: String },
  items: [{ product: { type: Schema.Types.ObjectId, ref: "Product" }, name: String, price: Number, qty: Number }],
  subtotal: Number, discount: { type: Number, default: 0 },
  shipping: Number, total: Number,
  status: {
    type: String,
    enum: ["pending", "pending_payment", "confirmed", "shipped", "delivered", "cancelled"],
    default: "pending"
  },
  paymentMethod: { type: String, default: "cod" },
  paymentStatus: { type: String, enum: ["unpaid", "paid", "refunded"], default: "unpaid" },
  couponCode: String, notes: String,
  pointsEarned: { type: Number, default: 0 },
}, { timestamps: true });
export const Order = mongoose.model("Order", OrderSchema);

/* ─── Customer ───────────────────────────────────────────────────── */
const CustomerSchema = new Schema({
  name: String,
  phone: { type: String, unique: true },
  email: String,
  password: String,
  isActive: { type: Boolean, default: true },
  role: { type: String, enum: ["customer", "employee", "admin"], default: "customer" },
  permissions: [String],
  jobTitle: String,
  department: String,
  loyaltyPoints: { type: Number, default: 0 },
  loyaltyTier: { type: String, enum: ["bronze", "silver", "gold", "platinum"], default: "bronze" },
  totalSpent: { type: Number, default: 0 },
  resetOtp: String,
  resetOtpExpiry: Date,
}, { timestamps: true });
export const Customer = mongoose.model("Customer", CustomerSchema);

/* ─── Review ─────────────────────────────────────────────────────── */
const ReviewSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  customerId: { type: Schema.Types.ObjectId, ref: "Customer" },
  customerName: String,
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: String,
  isApproved: { type: Boolean, default: true },
}, { timestamps: true });
export const Review = mongoose.model("Review", ReviewSchema);

/* ─── Coupon ─────────────────────────────────────────────────────── */
const CouponSchema = new Schema({
  code: { type: String, unique: true, uppercase: true },
  type: { type: String, enum: ["percent", "fixed"], default: "percent" },
  value: Number,
  minOrder: { type: Number, default: 0 },
  maxUses: { type: Number, default: 0 },
  usedCount: { type: Number, default: 0 },
  expiresAt: Date,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });
export const Coupon = mongoose.model("Coupon", CouponSchema);

/* ─── Settings ───────────────────────────────────────────────────── */
const SettingsSchema = new Schema({
  key: { type: String, unique: true }, value: Schema.Types.Mixed,
});
export const Settings = mongoose.model("Settings", SettingsSchema);
