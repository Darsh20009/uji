export default function PolicyPage() {
  const sectionStyle: React.CSSProperties = {
    marginBottom: "3rem",
  };
  const h2Style: React.CSSProperties = {
    fontFamily: "'Aref Ruqaa', 'Cormorant Garamond', serif",
    fontSize: "1.6rem", fontWeight: 300, color: "#1F3929",
    marginBottom: "1.25rem", paddingBottom: "0.75rem",
    borderBottom: "1px solid rgba(200,187,164,0.3)",
  };
  const h3Style: React.CSSProperties = {
    fontFamily: "'IBM Plex Sans Arabic', sans-serif",
    fontSize: "0.95rem", fontWeight: 600, color: "#1C201B",
    marginBottom: "0.75rem", marginTop: "1.5rem",
  };
  const pStyle: React.CSSProperties = {
    fontFamily: "'IBM Plex Sans Arabic', sans-serif",
    fontSize: "0.88rem", lineHeight: 2, color: "#555",
    marginBottom: "0.75rem",
  };
  const qStyle: React.CSSProperties = {
    fontFamily: "'IBM Plex Sans Arabic', sans-serif",
    fontSize: "0.88rem", lineHeight: 1.9, color: "#1C201B",
    fontWeight: 600, marginBottom: "0.4rem",
  };

  return (
    <div style={{ background: "#F2EADB", paddingTop: 100, paddingBottom: 80, direction: "rtl" }}>
      <div className="container" style={{ maxWidth: 780 }}>
        {/* Header */}
        <div style={{ marginBottom: "4rem", borderBottom: "1px solid rgba(200,187,164,0.3)", paddingBottom: "2.5rem" }}>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: "0.58rem",
            letterSpacing: "0.3em", textTransform: "uppercase", color: "#9BA17B", marginBottom: "1rem",
          }}>POLICIES — السياسات</p>
          <h1 style={{
            fontFamily: "'Aref Ruqaa', 'Cormorant Garamond', serif", fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 300, color: "#1C201B", lineHeight: 1.2,
          }}>
            سياسات المتجر
          </h1>
          <p style={{ ...pStyle, color: "#9BA17B", marginTop: "0.75rem" }}>
            سياسة الاستبدال والاسترجاع · سياسة الخصوصية
          </p>
        </div>

        {/* Return Policy */}
        <div style={sectionStyle}>
          <h2 style={h2Style}>سياسة الاستبدال والاسترجاع</h2>

          <p style={pStyle}>
            حرصاً منا على سلامتكم فإننا نعتذر عن استرجاع أو استبدال المنتجات الغذائية لسلامتكم جميعاً .. باستثناء المنتجات التي تصل إليكم تالفة، بشرط أن لا يتم استخدامها أو فتحها وأن تكون بحالتها الأصلية كما تم استلامها.
          </p>

          <div style={{ background: "#F7F2E8", border: "1px solid rgba(200,187,164,0.3)", padding: "2rem", marginTop: "1.5rem" }}>
            <h3 style={{ ...h3Style, marginTop: 0 }}>الأسئلة الشائعة</h3>

            {[
              {
                q: "كم هي المدة المسموحة للاستبدال / استرجاع المنتج التالف؟",
                a: "يمكنكم استبدال / استرجاع المنتج التالف خلال 3 أيام من عملية الشراء."
              },
              {
                q: "هل هناك رسوم للاسترجاع؟",
                a: "عند إسترجاع منتج سليم غير تالف (قبل الاستلام) فأن رسوم الشحن يتحملها العميل ويتم خصمها من قيمة المُنتج المسترجع، أما عند استرجاع المنتج التالف فإننا في UJI نتحمل كامل الرسوم."
              },
              {
                q: "كيف يمكنني استبدال / استرجاع المنتج التالف؟",
                a: "نسعد في خدمة العملاء بتواصلكم حيال ذلك من خلال وسائل التواصل المتاحة (اتصال / واتساب / إيميل) مع توضيح رقم الطلب وبشرط أن يكون المنتج المستبدل / المسترجع بحالته الأصلية وبغلافه الأصلي ولم يتم استخدامه أو فتحه أو تغيير ملامح التغليف الخاصة بالمنتج."
              },
              {
                q: "كم تستغرق عملية الاستبدال / الاسترجاع للمنتج التالف؟",
                a: "في UJI نعمل بكل جهد لرضاكم علماً بأنه قد تستغرق مدة عملية الاستبدال / الاسترجاع 10 أيام عمل."
              },
              {
                q: "في عملية الاسترجاع، كيف يمكنني استرداد المبلغ الذي دفعته؟",
                a: "يتم استرداد المبلغ بعد وصول المنتج التالف إلينا والتأكد من حالته، ومن ثم تحويل المبلغ لحسابكم فوراً."
              },
              {
                q: "في عملية الاستبدال، ماهي الخطوات المتخذة حيال ذلك؟",
                a: "عند رغبتكم باستبدال المنتج التالف، واختيار المنتج البديل نرجو منكم تحويل مبلغ الفرق بين المنتج التالف والمنتج البديل."
              },
              {
                q: "العروض الترويجية أو التخفيضات هل يشملها الاسترجاع والاستبدال؟",
                a: "لا يمكن استرجاع أو استبدال المنتجات المشتراة في التخفيضات أو العروض إلا في حالات التلف."
              },
            ].map(({ q, a }, i) => (
              <div key={i} style={{ marginBottom: "1.5rem", paddingBottom: "1.5rem", borderBottom: i < 6 ? "1px solid rgba(200,187,164,0.25)" : "none" }}>
                <p style={qStyle}>س: {q}</p>
                <p style={{ ...pStyle, marginBottom: 0 }}>ج: {a}</p>
              </div>
            ))}

            <div style={{ background: "rgba(31,57,41,0.06)", border: "1px solid rgba(31,57,41,0.12)", padding: "1rem 1.25rem", marginTop: "0.5rem" }}>
              <p style={{ ...pStyle, marginBottom: 0, color: "#1F3929", fontWeight: 500 }}>
                ملاحظة: حالات التلف يتم النظر فيها وإثباتها من قبل الجهة المختصة.
              </p>
            </div>
          </div>
        </div>

        {/* Privacy Policy */}
        <div style={sectionStyle}>
          <h2 style={h2Style}>سياسة الخصوصية</h2>
          <p style={pStyle}>
            هذه السياسة للخصوصية توضح المعلومات التي نجمعها عنك وكيفية استخدامها والخطوات التي نتخذها لضمان الحفاظ عليها آمنة.
          </p>

          <h3 style={h3Style}>ما المعلومات التي نجمعها؟</h3>
          <p style={pStyle}>
            عند فتح حساب جديد، نقوم بجمع معلومات التسجيل للعميل مثل الاسم، البريد الإلكتروني، عنوان الشحن، رقم الجوال، علماً أنه يتوجب تعبئة هذه المعلومات لإكمال عملية التسجيل. كما نقوم بجمع بيانات العمليات الشرائية والمفضلة.
          </p>

          <h3 style={h3Style}>كيف سنستخدم معلوماتك؟</h3>
          <p style={pStyle}>
            جميع المعلومات الشخصية التي نحصل عليها عنك سيتم تسجيلها واستخدامها وحمايتها بمعرفتنا طبقاً لقانون حماية البيانات الحالي وهذه السياسة للخصوصية. سنستخدم معلوماتك الشخصية في الأساس لتقديم منتجاتنا وخدماتنا لك وعلى سبيل المثال:
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1rem" }}>
            {[
              "إدارة وتقديم المنتجات والخدمات التي تطلبها",
              "التواصل معك في حالة عدم توفر أي من المنتجات أو الخدمات التي تطلبها",
              "لأغراض حفظ السجلات، وحساب مستوى أي مكافأة إخلاص مستحقة لك",
              "متابعة النشاط على موقعنا الإلكتروني",
            ].map((item, i) => (
              <li key={i} style={{ ...pStyle, marginBottom: "0.5rem", display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                <span style={{ color: "#9BA17B", marginTop: 3 }}>✦</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p style={pStyle}>
            هذه المعلومات تحتفظ بشكل آمن ولن يتم مشاركتها أو بيعها لأي جهة خارجية.
          </p>

          <h3 style={h3Style}>الكوكيز</h3>
          <p style={pStyle}>
            كإجراء شائع لدى العديد من مشغلي المواقع الإلكترونية الأخرى، قد نستخدم تكنولوجيا قياسية تسمى "الكوكيز" على هذا الموقع. الكوكيز هي معلومات صغيرة يتم تسجيلها من قبل برنامجك للتصفح على القرص الصلب لحاسبك الآلي وتستخدم لتسجيل كيفية تصفحك لهذا الموقع الإلكتروني في كل زيارة. تستخدم الكوكيز الخاصة بنا لتمكيننا من تطوير موقعنا الإلكتروني.
          </p>

          <h3 style={h3Style}>التغييرات على سياسة الخصوصية</h3>
          <p style={pStyle}>
            نحن نحتفظ بجميع الحقوق في تغيير أمننا وسياسات الخصوصية في أي وقت، لذلك فإننا نوصي بأن تقوم بمراجعة هذه الصفحة دائماً لتكون على علم بسياساتنا الحالية.
          </p>

          <div style={{
            background: "#F7F2E8", border: "1px solid rgba(200,187,164,0.3)",
            padding: "1.25rem 1.5rem", marginTop: "2rem",
            borderRight: "3px solid #9BA17B",
          }}>
            <p style={{ ...pStyle, marginBottom: 0, fontSize: "0.82rem", color: "#9BA17B" }}>
              يتبع هذا الموقع لسياسة الخصوصية للجهة المعالجة، شركة القدرة التقنية لتقنية المعلومات والاتصالات المحدودة (زد).
            </p>
          </div>
        </div>

        {/* Contact CTA */}
        <div style={{
          textAlign: "center", padding: "3rem",
          background: "#1F3929", marginTop: "3rem",
        }}>
          <p style={{ fontFamily: "'Aref Ruqaa','Cormorant Garamond',serif", fontSize: "1.4rem", fontWeight: 300, color: "#F2EADB", marginBottom: "0.75rem" }}>
            هل لديك استفسار؟
          </p>
          <p style={{ ...pStyle, color: "rgba(155,161,123,0.85)", marginBottom: "1.5rem" }}>
            فريقنا جاهز للمساعدة في أي وقت
          </p>
          <a
            href="https://wa.me/966552469643"
            target="_blank" rel="noopener"
            style={{
              display: "inline-block",
              background: "#25D366", color: "#fff",
              padding: "0.875rem 2rem", textDecoration: "none",
              fontFamily: "'IBM Plex Sans Arabic',sans-serif", fontSize: "0.88rem",
            }}
          >
            تواصل عبر واتساب
          </a>
        </div>
      </div>
    </div>
  );
}
