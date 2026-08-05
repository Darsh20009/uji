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
  /* ══════════════════ POLICY PAGE ══════════════════ */
  {
    id: "policy-return",
    label: "سياسة الاسترجاع",
    fields: [
      { key: "policy.return.title",    label: "عنوان القسم",      type: "text",    default: "سياسة الاستبدال والاسترجاع" },
      { key: "policy.return.intro",    label: "المقدمة",           type: "textarea", default: "حرصاً منا على سلامتكم فإننا نعتذر عن استرجاع أو استبدال المنتجات الغذائية لسلامتكم جميعاً .. باستثناء المنتجات التي تصل إليكم تالفة، بشرط أن لا يتم استخدامها أو فتحها وأن تكون بحالتها الأصلية كما تم استلامها." },
      { key: "policy.return.note",     label: "ملاحظة الجهة",     type: "textarea", default: "ملاحظة: حالات التلف يتم النظر فيها وإثباتها من قبل الجهة المختصة." },
    ],
  },
  {
    id: "policy-privacy",
    label: "سياسة الخصوصية",
    fields: [
      { key: "policy.privacy.title",     label: "عنوان القسم",           type: "text",    default: "سياسة الخصوصية" },
      { key: "policy.privacy.intro",     label: "المقدمة",                type: "textarea", default: "هذه السياسة للخصوصية توضح المعلومات التي نجمعها عنك وكيفية استخدامها والخطوات التي نتخذها لضمان الحفاظ عليها آمنة." },
      { key: "policy.privacy.whatinfo",  label: "ما المعلومات — نص",     type: "textarea", default: "عند فتح حساب جديد، نقوم بجمع معلومات التسجيل للعميل مثل الاسم، البريد الإلكتروني، عنوان الشحن، رقم الجوال، علماً أنه يتوجب تعبئة هذه المعلومات لإكمال عملية التسجيل. كما نقوم بجمع بيانات العمليات الشرائية والمفضلة." },
      { key: "policy.privacy.howuse",    label: "كيف نستخدم — نص",       type: "textarea", default: "جميع المعلومات الشخصية التي نحصل عليها عنك سيتم تسجيلها واستخدامها وحمايتها بمعرفتنا طبقاً لقانون حماية البيانات الحالي وهذه السياسة للخصوصية. سنستخدم معلوماتك الشخصية في الأساس لتقديم منتجاتنا وخدماتنا لك وعلى سبيل المثال:" },
      { key: "policy.privacy.secure",   label: "نص الحفظ الآمن",         type: "textarea", default: "هذه المعلومات تحتفظ بشكل آمن ولن يتم مشاركتها أو بيعها لأي جهة خارجية." },
      { key: "policy.privacy.cookies",  label: "فقرة الكوكيز",           type: "textarea", default: "كإجراء شائع لدى العديد من مشغلي المواقع الإلكترونية الأخرى، قد نستخدم تكنولوجيا قياسية تسمى \"الكوكيز\" على هذا الموقع. الكوكيز هي معلومات صغيرة يتم تسجيلها من قبل برنامجك للتصفح على القرص الصلب لحاسبك الآلي وتستخدم لتسجيل كيفية تصفحك لهذا الموقع الإلكتروني في كل زيارة. تستخدم الكوكيز الخاصة بنا لتمكيننا من تطوير موقعنا الإلكتروني." },
      { key: "policy.privacy.changes",  label: "فقرة التغييرات",         type: "textarea", default: "نحن نحتفظ بجميع الحقوق في تغيير أمننا وسياسات الخصوصية في أي وقت، لذلك فإننا نوصي بأن تقوم بمراجعة هذه الصفحة دائماً لتكون على علم بسياساتنا الحالية." },
      { key: "policy.privacy.footer",   label: "نص التذييل (الجهة)",     type: "textarea", default: "يتبع هذا الموقع لسياسة الخصوصية للجهة المعالجة، شركة القدرة التقنية لتقنية المعلومات والاتصالات المحدودة (زد)." },
    ],
  },
  {
    id: "policy-cta",
    label: "سياسة — بلوك التواصل",
    fields: [
      { key: "policy.cta.title", label: "عنوان CTA", type: "text",    default: "هل لديك استفسار؟" },
      { key: "policy.cta.body",  label: "وصف CTA",   type: "textarea", default: "فريقنا جاهز للمساعدة في أي وقت" },
      { key: "policy.cta.btn",   label: "نص الزر",   type: "text",    default: "تواصل عبر واتساب" },
    ],
  },

  /* ══════════════════ OUR STORY PAGE ══════════════════ */
  {
    id: "story-hero",
    label: "قصتنا — الهيرو",
    fields: [
      { key: "story.hero.eyebrow",     label: "النص الصغير",      type: "text",    default: "قصتنا" },
      { key: "story.hero.title",       label: "العنوان الرئيسي",  type: "textarea", default: "من شيزوكا اليابانية\nإلى كوبك" },
      { key: "story.hero.description", label: "الوصف",             type: "textarea", default: "بدأ الأمر بسؤال بسيط: لماذا لا تتوفر ماتشا يابانية حقيقية في المنطقة العربية؟ كل ما في الأسواق كان إما ماتشا طهي في أكياس فاخرة، أو مساحيق مجهولة المصدر. قررنا أن نغيّر ذلك." },
    ],
  },
  {
    id: "story-why",
    label: "قصتنا — لماذا وُجدنا",
    fields: [
      { key: "story.why.title",    label: "العنوان",  type: "textarea", default: "لماذا لا تتوفر ماتشا\nحقيقية في السوق السعودي؟" },
      { key: "story.why.body",     label: "الوصف",    type: "textarea", default: "هذا السؤال هو سبب وجودنا. جلسنا نفكر فيه طويلاً ووجدنا ثلاثة أسباب حقيقية." },
      { key: "story.why.solution", label: "نص الحل", type: "textarea", default: "قررنا أن نحلّ المشكلة من جذرها، شراء مباشر من مزارع شيزوكا، توصيل مباشر إليك، وشفافية كاملة عن كل ما في العلبة." },
      { key: "story.why.detail",   label: "تفاصيل الحل", type: "textarea", default: "لهذا كل منتج UJI مرفق بشهادة المصدر. لهذا نذكر اسم المزرعة. لهذا نشرح الفرق بين كل صنف. الشفافية أساس الثقة." },
    ],
  },
  {
    id: "story-origin",
    label: "قصتنا — المزرعة والعلامة",
    fields: [
      { key: "story.shizuoka.title", label: "عنوان مزارع شيزوكا", type: "text",    default: "مزارع شيزوكا" },
      { key: "story.shizuoka.body",  label: "وصف شيزوكا",         type: "textarea", default: "تقع شيزوكا على سفوح جبل فوجي، من أبرز مناطق زراعة الشاي في اليابان. مناخها المعتدل وتربتها البركانية الغنية والضباب الصباحي الذي يكسو مزارعها يخلقون ماتشا ذات نكهة عميقة وجودة استثنائية." },
      { key: "story.brand.title",    label: "عنوان علامتنا",      type: "text",    default: "علامتنا" },
      { key: "story.brand.body",     label: "وصف العلامة",         type: "textarea", default: "UJI MATCHA ليست مجرد علامة تجارية، إنها جسر بين ثقافتين. نحمل روح الماتشا اليابانية في كل علبة: ماتشا مزروعة في شيزوكا، بنفس الجودة الاحتفالية التي يشربها اليابانيون." },
    ],
  },
  {
    id: "story-cta",
    label: "قصتنا — CTA",
    fields: [
      { key: "story.cta.title", label: "عنوان CTA", type: "text",    default: "كن جزءاً من القصة" },
      { key: "story.cta.body",  label: "وصف CTA",   type: "textarea", default: "اشترك في نشرتنا وكن أول من يعرف كل جديد." },
      { key: "story.cta.btn",   label: "نص الزر",   type: "text",    default: "تسوّق الآن ←" },
    ],
  },

  /* ══════════════════ WHOLESALE PAGE ══════════════════ */
  {
    id: "wholesale-hero",
    label: "الجملة — الهيرو",
    fields: [
      { key: "wholesale.hero.eyebrow",     label: "النص الصغير",      type: "text",    default: "للمقاهي والمشاريع" },
      { key: "wholesale.hero.title",       label: "العنوان الرئيسي",  type: "textarea", default: "نقدم الماتشا\nكما يستحق عميلك" },
      { key: "wholesale.hero.description", label: "الوصف",             type: "textarea", default: "من الوصفات الجاهزة إلى تدريب فريقك، نبني معك تجربة ماتشا تجعل عميلك يعود." },
      { key: "wholesale.hero.btn",         label: "نص الزر",           type: "text",    default: "تواصل معنا ←" },
      { key: "wholesale.hero.redirect",    label: "نص إعادة التوجيه", type: "text",    default: "سيتم توجيهك تلقائياً خلال ثوانٍ" },
    ],
  },
  {
    id: "wholesale-pillars",
    label: "الجملة — الركائز الثلاث",
    fields: [
      { key: "wholesale.pillar.0.title", label: "ركيزة 1 — عنوان", type: "text",    default: "ماتشا احتفالية" },
      { key: "wholesale.pillar.0.body",  label: "ركيزة 1 — وصف",   type: "textarea", default: "ماتشا يابانية من أعلى الدرجات، مناسبة للمشروبات الراقية والقوائم المميزة." },
      { key: "wholesale.pillar.1.title", label: "ركيزة 2 — عنوان", type: "text",    default: "وصفات وتدريب" },
      { key: "wholesale.pillar.1.body",  label: "ركيزة 2 — وصف",   type: "textarea", default: "نقدم وصفات جاهزة وتدريباً لفريقك حتى تُقدَّم كل كوب بالطريقة الصحيحة." },
      { key: "wholesale.pillar.2.title", label: "ركيزة 3 — عنوان", type: "text",    default: "دعم متواصل" },
      { key: "wholesale.pillar.2.body",  label: "ركيزة 3 — وصف",   type: "textarea", default: "لا تختفي بعد أول طلب، نبقى معك في كل مرحلة من مراحل نمو مشروعك." },
    ],
  },
  {
    id: "wholesale-cta",
    label: "الجملة — CTA",
    fields: [
      { key: "wholesale.cta.title", label: "عنوان CTA",  type: "text",    default: "أرسل لنا معلومات مشروعك" },
      { key: "wholesale.cta.body",  label: "وصف CTA",    type: "textarea", default: "اسم المشروع · قطاع النشاط · الاستخدام المتوقع" },
    ],
  },

  /* ══════════════════ RITUAL PAGE ══════════════════ */
  {
    id: "ritual-page-hero",
    label: "الريتشوال — الهيرو",
    fields: [
      { key: "ritualpage.hero.eyebrow",     label: "النص الصغير",      type: "text",    default: "THE MATCHA RITUAL · دليل الريتشوال" },
      { key: "ritualpage.hero.title",       label: "العنوان الرئيسي",  type: "textarea", default: "فن إعداد\nالماتشا الأصيل" },
      { key: "ritualpage.hero.description", label: "الوصف",             type: "textarea", default: "خمس خطوات تحوّل الماتشا من مسحوق إلى تجربة حسية. تعلّمها مرة واحدة وستصنعها مدى الحياة." },
    ],
  },
  {
    id: "ritual-page-steps",
    label: "الريتشوال — الخطوات",
    fields: [
      { key: "ritualpage.step.0.desc",   label: "خطوة 1 — النخل — وصف",     type: "textarea", default: "انخل ملعقة صغيرة من الماتشا (٣–٤ غرام) في وعاء التشاوان لتفكيك أي تكتلات وضمان ناعومة مثالية." },
      { key: "ritualpage.step.0.detail", label: "خطوة 1 — النخل — تفصيل",   type: "textarea", default: "النخل خطوة يتجاهلها كثيرون، لكنه الفارق بين كوب أملس وكوب به حبيبات." },
      { key: "ritualpage.step.1.desc",   label: "خطوة 2 — الماء — وصف",     type: "textarea", default: "سخّن الماء إلى ٧٠–٨٠ درجة مئوية. الماء المغلي يحرق أوراق الماتشا ويُكسب الكوب مرارة غير مرغوبة." },
      { key: "ritualpage.step.1.detail", label: "خطوة 2 — الماء — تفصيل",   type: "textarea", default: "اترك الماء المغلي يبرد لدقيقتين، أو استخدم ميزان حرارة للدقة." },
      { key: "ritualpage.step.2.desc",   label: "خطوة 3 — الخفق — وصف",     type: "textarea", default: "أضف ٤٠ مل من الماء ثم اخفق بحركة W سريعة لمدة ٣٠ ثانية حتى يتشكل رغوة ناعمة على السطح." },
      { key: "ritualpage.step.2.detail", label: "خطوة 3 — الخفق — تفصيل",   type: "textarea", default: "استخدم المشة البامبو (Chasen) من الوسط للخارج، لا بحركة دائرية." },
      { key: "ritualpage.step.3.desc",   label: "خطوة 4 — الصبّ — وصف",     type: "textarea", default: "لـ Matcha Latte: أضف الحليب المبخّر ببطء فوق الماتشا المركّزة. للماتشا الكلاسيكية: تُشرب مباشرة." },
      { key: "ritualpage.step.3.detail", label: "خطوة 4 — الصبّ — تفصيل",   type: "textarea", default: "الحليب النباتي (الشوفان أو اللوز) يُعطي نكهة مميزة مع الماتشا." },
      { key: "ritualpage.step.4.desc",   label: "خطوة 5 — التذوق — وصف",    type: "textarea", default: "قبل أول رشفة، شمّ العطر، لاحظ اللون الزمردي، واشعر بالدفء في يديك. هذا هو الريتشوال." },
      { key: "ritualpage.step.4.detail", label: "خطوة 5 — التذوق — تفصيل",  type: "textarea", default: "الماتشا الاحتفالية لها ثلاث طبقات من النكهة: عشبية، ثم حلوة، ثم أومامي." },
    ],
  },
  {
    id: "ritual-page-tips",
    label: "الريتشوال — نصائح الخبراء",
    fields: [
      { key: "ritualpage.tips.title",    label: "عنوان قسم النصائح",   type: "text",    default: "نصائح الخبراء" },
      { key: "ritualpage.tip.0.title",   label: "نصيحة 1 — عنوان",     type: "text",    default: "درجة الحرارة" },
      { key: "ritualpage.tip.0.body",    label: "نصيحة 1 — وصف",       type: "textarea", default: "٧٠–٨٠° للماتشا النقية، ٨٠–٨٥° للاتيه" },
      { key: "ritualpage.tip.1.title",   label: "نصيحة 2 — عنوان",     type: "text",    default: "الكمية" },
      { key: "ritualpage.tip.1.body",    label: "نصيحة 2 — وصف",       type: "textarea", default: "٣–٤ غرام لكل ٤٠ مل ماء" },
      { key: "ritualpage.tip.2.title",   label: "نصيحة 3 — عنوان",     type: "text",    default: "المخفقة" },
      { key: "ritualpage.tip.2.body",    label: "نصيحة 3 — وصف",       type: "textarea", default: "احفظها في حامل بعد الاستخدام لتدوم أكثر" },
      { key: "ritualpage.tip.3.title",   label: "نصيحة 4 — عنوان",     type: "text",    default: "الحفظ" },
      { key: "ritualpage.tip.3.body",    label: "نصيحة 4 — وصف",       type: "textarea", default: "أغلق العبوة وضعها في الثلاجة بعيداً عن الضوء" },
    ],
  },
  {
    id: "ritual-page-cta",
    label: "الريتشوال — CTA",
    fields: [
      { key: "ritualpage.cta.title", label: "عنوان CTA", type: "text",    default: "جاهز لتجربة الريتشوال؟" },
      { key: "ritualpage.cta.body",  label: "وصف CTA",   type: "textarea", default: "احصل على ماتشا UJI الاحتفالية وابدأ اليوم." },
      { key: "ritualpage.cta.btn",   label: "نص الزر",   type: "text",    default: "تسوّق الماتشا ←" },
    ],
  },

  /* ══════════════════ HOME PAGE (original) ══════════════════ */
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
