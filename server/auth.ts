import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import MongoStore from "connect-mongo";
import { Customer, hashPass, checkPass } from "./models";
import type { Express } from "express";

export function setupAuth(app: Express) {
  const isReplit = !!process.env.REPL_ID;
  app.use(session({
    secret: process.env.SESSION_SECRET || "store-secret",
    resave: false, saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI!, collectionName: "sessions" }),
    cookie: { secure: isReplit || process.env.NODE_ENV === "production", sameSite: isReplit ? "none" : "lax", maxAge: 7*24*60*60*1000 },
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(new LocalStrategy({ usernameField: "phone" }, async (phone, password, done) => {
    try {
      const c = await Customer.findOne({ phone, isActive: true });
      if (!c || !checkPass(password, c.password!)) return done(null, false, { message: "بيانات غير صحيحة" });
      return done(null, c);
    } catch (e) { return done(e); }
  }));
  passport.serializeUser((u: any, done) => done(null, u._id.toString()));
  passport.deserializeUser(async (id: string, done) => {
    try { done(null, await Customer.findById(id).select("-password")); } catch (e) { done(e); }
  });
}
export const requireAuth = (req: any, res: any, next: any) => req.isAuthenticated() ? next() : res.status(401).json({ message: "يرجى تسجيل الدخول" });