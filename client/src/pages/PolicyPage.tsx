import { EditableText } from "../components/editor/EditableText";
import { useLang } from "../context/LanguageContext";

export default function PolicyPage() {
  const { isRTL, lang } = useLang();
  const isEnglish = lang === "en";
  const faq = isEnglish
    ? [
        {
          q: "How long do I have to return or exchange a damaged product?",
          a: "You may return or exchange a damaged product within 3 days of purchase.",
        },
        {
          q: "Is there a return fee?",
          a: "For an undamaged product returned before delivery, the customer covers the shipping fee, which is deducted from the refund. UJI covers all fees when the product arrives damaged.",
        },
        {
          q: "How can I return or exchange a damaged product?",
          a: "Please contact our customer service team by phone, WhatsApp, or email with your order number. The product must be unused, unopened, and in its original packaging.",
        },
        {
          q: "How long does a return or exchange take?",
          a: "We work hard to resolve every case quickly, but a return or exchange may take up to 10 business days.",
        },
        {
          q: "How will I receive my refund?",
          a: "Once the damaged product reaches us and its condition is verified, the refund will be transferred to your account.",
        },
        {
          q: "What happens during an exchange?",
          a: "After you choose the replacement product, please transfer any difference between the damaged product and the replacement.",
        },
        {
          q: "Can discounted or promotional purchases be returned?",
          a: "Products purchased during a sale or promotion cannot be returned or exchanged unless they arrive damaged.",
        },
      ]
    : [
        { q: "كم هي المدة المسموحة للاستبدال / استرجاع المنتج التالف؟", a: "يمكنكم استبدال / استرجاع المنتج التالف خلال 3 أيام من عملية الشراء." },
        { q: "هل هناك رسوم للاسترجاع؟", a: "عند إسترجاع منتج سليم غير تالف (قبل الاستلام) فأن رسوم الشحن يتحملها العميل ويتم خصمها من قيمة المُنتج المسترجع، أما عند استرجاع المنتج التالف فإننا في UJI نتحمل كامل الرسوم." },
        { q: "كيف يمكنني استبدال / استرجاع المنتج التالف؟", a: "نسعد في خدمة العملاء بتواصلكم حيال ذلك من خلال وسائل التواصل المتاحة (اتصال / واتساب / إيميل) مع توضيح رقم الطلب وبشرط أن يكون المنتج المستبدل / المسترجع بحالته الأصلية وبغلافه الأصلي ولم يتم استخدامه أو فتحه أو تغيير ملامح التغليف الخاصة بالمنتج." },
        { q: "كم تستغرق عملية الاستبدال / الاسترجاع للمنتج التالف؟", a: "في UJI نعمل بكل جهد لرضاكم علماً بأنه قد تستغرق مدة عملية الاستبدال / الاسترجاع 10 أيام عمل." },
        { q: "في عملية الاسترجاع، كيف يمكنني استرداد المبلغ الذي دفعته؟", a: "يتم استرداد المبلغ بعد وصول المنتج التالف إلينا والتأكد من حالته، ومن ثم تحويل المبلغ لحسابكم فوراً." },
        { q: "في عملية الاستبدال، ماهي الخطوات المتخذة حيال ذلك؟", a: "عند رغبتكم باستبدال المنتج التالف، واختيار المنتج البديل نرجو منكم تحويل مبلغ الفرق بين المنتج التالف والمنتج البديل." },
        { q: "العروض الترويجية أو التخفيضات هل يشملها الاسترجاع والاستبدال؟", a: "لا يمكن استرجاع أو استبدال المنتجات المشتراة في التخفيضات أو العروض إلا في حالات التلف." },
      ];
  const privacyBullets = isEnglish
    ? [
        "Manage and provide the products and services you request",
        "Contact you if one of your requested products or services is unavailable",
        "Maintain records and calculate any loyalty rewards you have earned",
        "Monitor activity on our website",
      ]
    : [
        "إدارة وتقديم المنتجات والخدمات التي تطلبها",
        "التواصل معك في حالة عدم توفر أي من المنتجات أو الخدمات التي تطلبها",
        "لأغراض حفظ السجلات، وحساب مستوى أي مكافأة إخلاص مستحقة لك",
        "متابعة النشاط على موقعنا الإلكتروني",
      ];
  const sectionStyle: React.CSSProperties = {
    marginBottom: "3rem",
  };
  const h2Style: React.CSSProperties = {
    fontFamily: "'Mirza', serif",
    fontSize: "1.6rem", fontWeight: 300, color: "#1F3929",
    marginBottom: "1.25rem", paddingBottom: "0.75rem",
    borderBottom: "1px solid rgba(200,187,164,0.3)",
  };
  const h3Style: React.CSSProperties = {
    fontFamily: "'Mirza', serif",
    fontSize: "0.95rem", fontWeight: 600, color: "#1C201B",
    marginBottom: "0.75rem", marginTop: "1.5rem",
  };
  const pStyle: React.CSSProperties = {
    fontFamily: "'Mirza', serif",
    fontSize: "0.88rem", lineHeight: 2, color: "#555",
    marginBottom: "0.75rem",
  };
  const qStyle: React.CSSProperties = {
    fontFamily: "'Mirza', serif",
    fontSize: "0.88rem", lineHeight: 1.9, color: "#1C201B",
    fontWeight: 600, marginBottom: "0.4rem",
  };

  return (
    <div style={{ background: "#F2EADB", paddingTop: 100, paddingBottom: 80, direction: isRTL ? "rtl" : "ltr" }}>
      <div className="container" style={{ maxWidth: 780 }}>
        {/* Header */}
        <div style={{ marginBottom: "4rem", borderBottom: "1px solid rgba(200,187,164,0.3)", paddingBottom: "2.5rem" }}>
          <p style={{
            fontFamily: "'Cascadia Code', monospace", fontSize: "0.58rem",
            letterSpacing: "0.3em", textTransform: "uppercase", color: "#9BA17B", marginBottom: "1rem",
          }}>POLICIES {isEnglish ? "" : "— السياسات"}</p>
          <h1 style={{
            fontFamily: "'Mirza', serif", fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 300, color: "#1C201B", lineHeight: 1.2,
          }}>
            {isEnglish ? "Store Policies" : "سياسات المتجر"}
          </h1>
          <p style={{ ...pStyle, color: "#9BA17B", marginTop: "0.75rem" }}>
            {isEnglish ? "Returns & exchanges · Privacy policy" : "سياسة الاستبدال والاسترجاع · سياسة الخصوصية"}
          </p>
        </div>

        {/* Return Policy */}
        <div style={sectionStyle}>
          <EditableText
            contentKey="policy.return.title"
            defaultValue="سياسة الاستبدال والاسترجاع"
            as="h2"
            style={h2Style}
          />

          <EditableText
            contentKey="policy.return.intro"
            defaultValue="حرصاً منا على سلامتكم فإننا نعتذر عن استرجاع أو استبدال المنتجات الغذائية لسلامتكم جميعاً .. باستثناء المنتجات التي تصل إليكم تالفة، بشرط أن لا يتم استخدامها أو فتحها وأن تكون بحالتها الأصلية كما تم استلامها."
            as="p"
            style={pStyle}
          />

          <div style={{ background: "#F7F2E8", border: "1px solid rgba(200,187,164,0.3)", padding: "2rem", marginTop: "1.5rem" }}>
             <h3 style={{ ...h3Style, marginTop: 0 }}>{isEnglish ? "Frequently asked questions" : "الأسئلة الشائعة"}</h3>

            {faq.map(({ q, a }, i) => (
              <div key={i} style={{ marginBottom: "1.5rem", paddingBottom: "1.5rem", borderBottom: i < 6 ? "1px solid rgba(200,187,164,0.25)" : "none" }}>
                <p style={qStyle}>{isEnglish ? "Q:" : "س:"} {q}</p>
                <p style={{ ...pStyle, marginBottom: 0 }}>{isEnglish ? "A:" : "ج:"} {a}</p>
              </div>
            ))}

            <div style={{ background: "rgba(31,57,41,0.06)", border: "1px solid rgba(31,57,41,0.12)", padding: "1rem 1.25rem", marginTop: "0.5rem" }}>
              <EditableText
                contentKey="policy.return.note"
                defaultValue="ملاحظة: حالات التلف يتم النظر فيها وإثباتها من قبل الجهة المختصة."
                as="p"
                style={{ ...pStyle, marginBottom: 0, color: "#1F3929", fontWeight: 500 }}
              />
            </div>
          </div>
        </div>

        {/* Privacy Policy */}
        <div style={sectionStyle}>
          <EditableText
            contentKey="policy.privacy.title"
            defaultValue="سياسة الخصوصية"
            as="h2"
            style={h2Style}
          />
          <EditableText
            contentKey="policy.privacy.intro"
            defaultValue="هذه السياسة للخصوصية توضح المعلومات التي نجمعها عنك وكيفية استخدامها والخطوات التي نتخذها لضمان الحفاظ عليها آمنة."
            as="p"
            style={pStyle}
          />

           <h3 style={h3Style}>{isEnglish ? "What information do we collect?" : "ما المعلومات التي نجمعها؟"}</h3>
          <EditableText
            contentKey="policy.privacy.whatinfo"
            defaultValue="عند فتح حساب جديد، نقوم بجمع معلومات التسجيل للعميل مثل الاسم، البريد الإلكتروني، عنوان الشحن، رقم الجوال، علماً أنه يتوجب تعبئة هذه المعلومات لإكمال عملية التسجيل. كما نقوم بجمع بيانات العمليات الشرائية والمفضلة."
            as="p"
            style={pStyle}
          />

           <h3 style={h3Style}>{isEnglish ? "How will we use your information?" : "كيف سنستخدم معلوماتك؟"}</h3>
          <EditableText
            contentKey="policy.privacy.howuse"
            defaultValue="جميع المعلومات الشخصية التي نحصل عليها عنك سيتم تسجيلها واستخدامها وحمايتها بمعرفتنا طبقاً لقانون حماية البيانات الحالي وهذه السياسة للخصوصية. سنستخدم معلوماتك الشخصية في الأساس لتقديم منتجاتنا وخدماتنا لك وعلى سبيل المثال:"
            as="p"
            style={pStyle}
          />
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1rem" }}>
            {privacyBullets.map((item, i) => (
              <li key={i} style={{ ...pStyle, marginBottom: "0.5rem", display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                <span style={{ color: "#9BA17B", marginTop: 3 }}>✦</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <EditableText
            contentKey="policy.privacy.secure"
            defaultValue="هذه المعلومات تحتفظ بشكل آمن ولن يتم مشاركتها أو بيعها لأي جهة خارجية."
            as="p"
            style={pStyle}
          />

           <h3 style={h3Style}>{isEnglish ? "Cookies" : "الكوكيز"}</h3>
          <EditableText
            contentKey="policy.privacy.cookies"
            defaultValue='كإجراء شائع لدى العديد من مشغلي المواقع الإلكترونية الأخرى، قد نستخدم تكنولوجيا قياسية تسمى "الكوكيز" على هذا الموقع. الكوكيز هي معلومات صغيرة يتم تسجيلها من قبل برنامجك للتصفح على القرص الصلب لحاسبك الآلي وتستخدم لتسجيل كيفية تصفحك لهذا الموقع الإلكتروني في كل زيارة. تستخدم الكوكيز الخاصة بنا لتمكيننا من تطوير موقعنا الإلكتروني.'
            as="p"
            style={pStyle}
          />

           <h3 style={h3Style}>{isEnglish ? "Changes to this privacy policy" : "التغييرات على سياسة الخصوصية"}</h3>
          <EditableText
            contentKey="policy.privacy.changes"
            defaultValue="نحن نحتفظ بجميع الحقوق في تغيير أمننا وسياسات الخصوصية في أي وقت، لذلك فإننا نوصي بأن تقوم بمراجعة هذه الصفحة دائماً لتكون على علم بسياساتنا الحالية."
            as="p"
            style={pStyle}
          />

          <div style={{
            background: "#F7F2E8", border: "1px solid rgba(200,187,164,0.3)",
            padding: "1.25rem 1.5rem", marginTop: "2rem",
            borderRight: "3px solid #9BA17B",
          }}>
            <EditableText
              contentKey="policy.privacy.footer"
              defaultValue="يتبع هذا الموقع لسياسة الخصوصية للجهة المعالجة، شركة القدرة التقنية لتقنية المعلومات والاتصالات المحدودة (زد)."
              as="p"
              style={{ ...pStyle, marginBottom: 0, fontSize: "0.82rem", color: "#9BA17B" }}
            />
          </div>
        </div>

        {/* Contact CTA */}
        <div style={{
          textAlign: "center", padding: "3rem",
          background: "#1F3929", marginTop: "3rem",
        }}>
          <EditableText
            contentKey="policy.cta.title"
            defaultValue="هل لديك استفسار؟"
            as="p"
            style={{ fontFamily: "'Mirza', serif", fontSize: "1.4rem", fontWeight: 300, color: "#F2EADB", marginBottom: "0.75rem" }}
          />
          <EditableText
            contentKey="policy.cta.body"
            defaultValue="فريقنا جاهز للمساعدة في أي وقت"
            as="p"
            style={{ ...pStyle, color: "rgba(155,161,123,0.85)", marginBottom: "1.5rem" }}
          />
          <a
            href="https://wa.me/966552469643"
            target="_blank" rel="noopener"
            style={{
              display: "inline-block",
              background: "#25D366", color: "#fff",
              padding: "0.875rem 2rem", textDecoration: "none",
              fontFamily: "'Mirza', serif", fontSize: "0.88rem",
            }}
          >
            <EditableText
              contentKey="policy.cta.btn"
              defaultValue="تواصل عبر واتساب"
            />
          </a>
        </div>
      </div>
    </div>
  );
}
