import { Lang } from "../context/LanguageContext";

const T = {
  /* ── Navbar ── */
  "nav.products":    { ar: "المنتجات",   en: "Products"   },
  "nav.about":       { ar: "قصتنا",      en: "Our Story"  },
  "nav.ritual":      { ar: "الريتشوال",  en: "Ritual"     },
  "nav.magazine":    { ar: "المجلة",     en: "Journal"    },
  "nav.menu":        { ar: "القائمة",    en: "Menu"       },
  "nav.search":      { ar: "بحث",        en: "Search"     },
  "nav.login":       { ar: "تسجيل الدخول", en: "Sign In"  },

  /* ── Mobile menu ── */
  "menu.home":       { ar: "الرئيسية",   en: "Home"       },
  "menu.shop":       { ar: "المنتجات",   en: "Shop"       },
  "menu.about":      { ar: "قصتنا",      en: "Our Story"  },
  "menu.ritual":     { ar: "الريتشوال",  en: "Ritual"     },
  "menu.magazine":   { ar: "المجلة",     en: "Journal"    },
  "menu.cart":       { ar: "السلة",      en: "Cart"       },
  "menu.account":    { ar: "حسابي",      en: "Account"    },
  "menu.login":      { ar: "تسجيل الدخول", en: "Login"    },

  /* ── Mobile bottom nav ── */
  "bnav.home":       { ar: "الرئيسية",   en: "Home"       },
  "bnav.shop":       { ar: "تسوق",       en: "Shop"       },
  "bnav.cart":       { ar: "السلة",      en: "Cart"       },
  "bnav.wholesale":  { ar: "الجملة",     en: "Wholesale"  },
  "bnav.account":    { ar: "حسابي",      en: "Account"    },
  "bnav.login":      { ar: "دخول",       en: "Login"      },

  /* ── Footer ── */
  "footer.tagline":         { ar: "ماتشا يابانية احتفالية\nمن قلب زراعة الشاي الياباني", en: "Ceremonial Japanese matcha\nfrom the heart of Japan's tea gardens" },
  "footer.section.shop":    { ar: "المتجر",    en: "Shop"       },
  "footer.section.company": { ar: "الشركة",    en: "Company"    },
  "footer.section.help":    { ar: "المساعدة",  en: "Help"       },
  "footer.link.pouch":      { ar: "ماتشا الكيس",        en: "Matcha Pouch"      },
  "footer.link.allproducts":{ ar: "جميع المنتجات",      en: "All Products"      },
  "footer.link.offers":     { ar: "العروض",              en: "Offers"            },
  "footer.link.about":      { ar: "قصتنا",               en: "Our Story"         },
  "footer.link.ritual":     { ar: "دليل الريتشوال",     en: "Ritual Guide"      },
  "footer.link.magazine":   { ar: "المجلة",              en: "Journal"           },
  "footer.link.wholesale":  { ar: "مبيعات الجملة",      en: "Wholesale"         },
  "footer.link.contact":    { ar: "تواصل معنا",          en: "Contact Us"        },
  "footer.link.shipping":   { ar: "الشحن والتوصيل",     en: "Shipping & Delivery" },
  "footer.link.returns":    { ar: "سياسة الإرجاع",      en: "Return Policy"     },
  "footer.link.privacy":    { ar: "سياسة الخصوصية",     en: "Privacy Policy"    },
  "footer.copyright":       { ar: "ريتشوالك اليومي",    en: "Your daily ritual"  },
  "footer.licensed":        { ar: "مرخّص ومسجّل لدى",   en: "Licensed & registered with" },
  "footer.madeby":          { ar: "صُنع بواسطة",         en: "Made by"           },

  /* ── 404 ── */
  "404.message":     { ar: "الصفحة غير موجودة",    en: "Page not found"          },
  "404.back":        { ar: "العودة للرئيسية",       en: "Back to home"            },

  /* ── Common ── */
  "common.addtocart":  { ar: "أضف للسلة",           en: "Add to cart"            },
  "common.buynow":     { ar: "اشترِ الآن",           en: "Buy now"               },
  "common.learnmore":  { ar: "اعرف أكثر",            en: "Learn more"            },
  "common.close":      { ar: "إغلاق",                en: "Close"                 },
  "common.save":       { ar: "حفظ",                  en: "Save"                  },
  "common.cancel":     { ar: "إلغاء",                en: "Cancel"                },
  "common.whatsapp":   { ar: "تواصل عبر واتساب",     en: "Chat on WhatsApp"      },
  "common.shopnow":    { ar: "تسوّق الآن",            en: "Shop Now"             },
  "common.contactus":  { ar: "تواصل معنا",            en: "Contact Us"           },

  /* ── CMS Sidebar ── */
  "cms.editor":       { ar: "محرر المحتوى",          en: "Content Editor"        },
  "cms.saveall":      { ar: "💾 حفظ الكل",           en: "💾 Save All"           },
  "cms.saving":       { ar: "حفظ...",                en: "Saving..."             },
  "cms.saved":        { ar: "✓ محفوظ",              en: "✓ Saved"               },
  "cms.error":        { ar: "⚠ خطأ",                en: "⚠ Error"              },
  "cms.search":       { ar: "🔍 بحث في الحقول...",   en: "🔍 Search fields..."   },
  "cms.shortcuts":    { ar: "اختصارات لوحة المفاتيح", en: "Keyboard shortcuts"   },
  "cms.shortcut.toggle": { ar: "تفعيل/إيقاف التعديل", en: "Toggle edit mode"    },
  "cms.shortcut.save":   { ar: "حفظ يدوي",           en: "Manual save"          },
  "cms.shortcut.close":  { ar: "إغلاق الشريط",       en: "Close sidebar"        },
  "cms.click-hint":   { ar: "انقر للتعديل في اللوحة الجانبية", en: "Click to edit in sidebar" },
  "cms.visible":      { ar: "ظاهر",                  en: "Visible"              },
  "cms.hidden":       { ar: "مخفي",                  en: "Hidden"               },
  "cms.uploading":    { ar: "⟳ جاري الرفع...",       en: "⟳ Uploading..."       },
  "cms.changeimage":  { ar: "⬆ تغيير الصورة",       en: "⬆ Change image"       },
} as const;

export type TKey = keyof typeof T;

export function t(key: TKey, lang: Lang): string {
  return T[key][lang];
}

export function useT() {
  // Lazy import to avoid circular dep — caller must pass lang
  return (key: TKey, lang: Lang) => t(key, lang);
}
