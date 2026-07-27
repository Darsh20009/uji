export type FieldType = "text" | "textarea" | "image" | "section";

export interface ContentField {
  key: string;
  label: string;
  type: FieldType;
  default: string;
}

export interface ContentGroup {
  id: string;
  label: string;
  fields: ContentField[];
}

export const CONTENT_REGISTRY: ContentGroup[] = [
  {
    id: "hero",
    label: "الهيرو الرئيسي",
    fields: [
      { key: "home.hero.eyebrow",     label: "النص الصغير العلوي",  type: "text",    default: "CEREMONIAL JAPANESE MATCHA" },
      { key: "home.hero.title",        label: "العنوان الرئيسي",     type: "textarea", default: "تجربة الماتشا\nاليابانية الحقيقية" },
      { key: "home.hero.description",  label: "الوصف",               type: "textarea", default: "ماتشا احتفالية من مستوى الدرجة الأولى، مزروعة في شيزوكا\nومصممة لريتشوالك اليومي." },
      { key: "home.hero.btn1",         label: "نص الزر الأول",       type: "text",    default: "اكتشف UJI" },
      { key: "home.hero.btn2",         label: "نص الزر الثاني",      type: "text",    default: "تسوق الماتشا" },
      { key: "home.hero.image",        label: "صورة الخلفية",        type: "image",   default: "/assets/hero/uji-banner-matcha-powder.jpg" },
    ],
  },
  {
    id: "products",
    label: "قسم المنتجات",
    fields: [
      { key: "home.products.eyebrow", label: "النص الصغير", type: "text", default: "THE COLLECTION" },
      { key: "home.products.title",   label: "العنوان",     type: "text", default: "منتجاتنا" },
    ],
  },
  {
    id: "tin",
    label: "قسم الماتشا",
    fields: [
      { key: "home.section.tin",  label: "إظهار القسم",  type: "section",  default: "true" },
      { key: "home.tin.title",    label: "العنوان",      type: "textarea", default: "ماتشا احتفالية\nبجودة استثنائية." },
      { key: "home.tin.body",     label: "الوصف",        type: "textarea", default: "مسحوق ماتشا ياباني أصلي من الدرجة الاحتفالية، مطحون بالحجر من أوراق الشاي المظللة للحصول على أعمق نكهة وأغنى لون أخضر." },
      { key: "home.tin.image",    label: "الصورة",       type: "image",    default: "/assets/packaging/uji-tin-hero.png" },
    ],
  },
  {
    id: "whyuji",
    label: "قسم لماذا UJI",
    fields: [
      { key: "home.section.whyuji",       label: "إظهار القسم",         type: "section",  default: "true" },
      { key: "home.whyuji.title",         label: "العنوان",             type: "textarea", default: "ماتشا مختارة بعناية\nلكل طريقة تحضير." },
      { key: "home.whyuji.body",          label: "الوصف",               type: "textarea", default: "سواء كنت تعدّها لنفسك أو تشاركها في تجمع، كل صنف من ماتشا UJI مختار بدقة من مزارع اليابان." },
      { key: "home.whyuji.tile.0.title",  label: "ميزة 1 — عنوان",     type: "text",    default: "من مزارع شيزوكا اليابانية" },
      { key: "home.whyuji.tile.0.body",   label: "ميزة 1 — وصف",       type: "textarea", default: "نختار من أبرز مزارع شيزوكا في اليابان، حيث يُزرع أجود الشاي منذ قرون." },
      { key: "home.whyuji.tile.1.title",  label: "ميزة 2 — عنوان",     type: "text",    default: "لكل أسلوب تحضير" },
      { key: "home.whyuji.tile.1.body",   label: "ميزة 2 — وصف",       type: "textarea", default: "من الماتشا اللاتيه إلى الريتشوال الياباني الكلاسيكي، عندنا الصنف المناسب لك." },
      { key: "home.whyuji.tile.2.title",  label: "ميزة 3 — عنوان",     type: "text",    default: "للأفراد والتجمعات" },
      { key: "home.whyuji.tile.2.body",   label: "ميزة 3 — وصف",       type: "textarea", default: "سواء كنت تبدأ يومك بهدوء أو تشارك لحظة مميزة مع أشخاص تحبهم." },
      { key: "home.whyuji.tile.3.title",  label: "ميزة 4 — عنوان",     type: "text",    default: "نقية 100% بلا إضافات" },
      { key: "home.whyuji.tile.3.body",   label: "ميزة 4 — وصف",       type: "textarea", default: "بدون سكر أو نكهات اصطناعية أو مواد حافظة. ماتشا خالصة من قلب اليابان إلى كوبك." },
    ],
  },
  {
    id: "finder",
    label: "اختبار الماتشا",
    fields: [
      { key: "home.section.finder", label: "إظهار القسم", type: "section", default: "true" },
    ],
  },
  {
    id: "ritual",
    label: "قسم الريتشوال",
    fields: [
      { key: "home.section.ritual",  label: "إظهار القسم",  type: "section",  default: "true" },
      { key: "home.ritual.quote",    label: "الاقتباس",      type: "text",    default: "تباطأ. تذوّق الماتشا." },
      { key: "home.ritual.body",     label: "الوصف",         type: "textarea", default: "الماتشا ليست مجرد مشروب. إنها لحظة تتوقف فيها عن كل شيء وتحضر في اللحظة الراهنة." },
    ],
  },
  {
    id: "newsletter",
    label: "النشرة البريدية",
    fields: [
      { key: "home.newsletter.heading", label: "العنوان الرئيسي", type: "text",    default: "نشرة بريدية" },
      { key: "home.newsletter.body",    label: "الوصف",           type: "textarea", default: "كل ما تحتاج معرفته عن عالم الماتشا — ريتشوالات، مقالات من المجلة، وإصدارات حصرية. بدون ضجيج." },
    ],
  },
];
