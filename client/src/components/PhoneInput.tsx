import { useState, useRef, useEffect } from "react";

/* ── دول الخليج والعرب والعالم ── */
export const COUNTRIES = [
  { code: "+966", flag: "🇸🇦", name: "السعودية",     abbr: "SA", maxLen: 9  },
  { code: "+971", flag: "🇦🇪", name: "الإمارات",     abbr: "AE", maxLen: 9  },
  { code: "+965", flag: "🇰🇼", name: "الكويت",       abbr: "KW", maxLen: 8  },
  { code: "+974", flag: "🇶🇦", name: "قطر",          abbr: "QA", maxLen: 8  },
  { code: "+973", flag: "🇧🇭", name: "البحرين",      abbr: "BH", maxLen: 8  },
  { code: "+968", flag: "🇴🇲", name: "عُمان",        abbr: "OM", maxLen: 8  },
  { code: "+967", flag: "🇾🇪", name: "اليمن",        abbr: "YE", maxLen: 9  },
  { code: "+962", flag: "🇯🇴", name: "الأردن",       abbr: "JO", maxLen: 9  },
  { code: "+961", flag: "🇱🇧", name: "لبنان",        abbr: "LB", maxLen: 8  },
  { code: "+20",  flag: "🇪🇬", name: "مصر",          abbr: "EG", maxLen: 10 },
  { code: "+964", flag: "🇮🇶", name: "العراق",       abbr: "IQ", maxLen: 10 },
  { code: "+963", flag: "🇸🇾", name: "سوريا",        abbr: "SY", maxLen: 9  },
  { code: "+970", flag: "🇵🇸", name: "فلسطين",       abbr: "PS", maxLen: 9  },
  { code: "+212", flag: "🇲🇦", name: "المغرب",       abbr: "MA", maxLen: 9  },
  { code: "+216", flag: "🇹🇳", name: "تونس",         abbr: "TN", maxLen: 8  },
  { code: "+213", flag: "🇩🇿", name: "الجزائر",      abbr: "DZ", maxLen: 9  },
  { code: "+218", flag: "🇱🇾", name: "ليبيا",        abbr: "LY", maxLen: 9  },
  { code: "+249", flag: "🇸🇩", name: "السودان",      abbr: "SD", maxLen: 9  },
  { code: "+252", flag: "🇸🇴", name: "الصومال",      abbr: "SO", maxLen: 8  },
  { code: "+92",  flag: "🇵🇰", name: "باكستان",      abbr: "PK", maxLen: 10 },
  { code: "+91",  flag: "🇮🇳", name: "الهند",        abbr: "IN", maxLen: 10 },
  { code: "+880", flag: "🇧🇩", name: "بنغلاديش",     abbr: "BD", maxLen: 10 },
  { code: "+63",  flag: "🇵🇭", name: "الفلبين",      abbr: "PH", maxLen: 10 },
  { code: "+94",  flag: "🇱🇰", name: "سريلانكا",     abbr: "LK", maxLen: 9  },
  { code: "+44",  flag: "🇬🇧", name: "بريطانيا",     abbr: "GB", maxLen: 10 },
  { code: "+1",   flag: "🇺🇸", name: "أمريكا",       abbr: "US", maxLen: 10 },
  { code: "+49",  flag: "🇩🇪", name: "ألمانيا",      abbr: "DE", maxLen: 11 },
  { code: "+33",  flag: "🇫🇷", name: "فرنسا",        abbr: "FR", maxLen: 9  },
  { code: "+90",  flag: "🇹🇷", name: "تركيا",        abbr: "TR", maxLen: 10 },
  { code: "+98",  flag: "🇮🇷", name: "إيران",        abbr: "IR", maxLen: 10 },
];

export type Country = typeof COUNTRIES[0];

interface Props {
  /** رقم الجوال بدون كود الدولة */
  value: string;
  onChange: (number: string, country: Country) => void;
  countryCode?: string;           // كود الدولة المبدئي e.g. "+966"
  onCountryChange?: (c: Country) => void;
  placeholder?: string;
  /** أنماط CSS للـ wrapper */
  style?: React.CSSProperties;
  /** أنماط CSS للـ input */
  inputStyle?: React.CSSProperties;
  /** أنماط CSS لزر الكود */
  triggerStyle?: React.CSSProperties;
  required?: boolean;
  disabled?: boolean;
  /** dark mode (للأدمن) أم light (الشوب) */
  theme?: "dark" | "light";
}

export default function PhoneInput({
  value,
  onChange,
  countryCode = "+966",
  onCountryChange,
  placeholder,
  style,
  inputStyle,
  triggerStyle,
  required,
  disabled,
  theme = "light",
}: Props) {
  const [open, setOpen]       = useState(false);
  const [search, setSearch]   = useState("");
  const [selected, setSelected] = useState<Country>(
    () => COUNTRIES.find(c => c.code === countryCode) ?? COUNTRIES[0]
  );
  const wrapRef  = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  /* إغلاق عند الضغط خارج القائمة */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 60);
  }, [open]);

  const pick = (c: Country) => {
    setSelected(c);
    setOpen(false);
    setSearch("");
    onCountryChange?.(c);
    onChange(value, c);
  };

  const filtered = search
    ? COUNTRIES.filter(c =>
        c.name.includes(search) ||
        c.code.includes(search) ||
        c.abbr.toLowerCase().includes(search.toLowerCase())
      )
    : COUNTRIES;

  /* ── الألوان حسب الثيم ── */
  const dark = theme === "dark";
  const clr = {
    border:      dark ? "#2a2a2a" : "rgba(200,187,164,0.5)",
    borderFocus: dark ? "#1F3929" : "rgba(31,57,41,0.5)",
    bg:          dark ? "#1a1a1a" : "#F7F2E8",
    text:        dark ? "#E8E0D0" : "#1C201B",
    btn:         dark ? "#141414" : "#EDE8DF",
    divider:     dark ? "#2a2a2a" : "rgba(200,187,164,0.4)",
    ddBg:        dark ? "#141414" : "#FDFAF5",
    ddBorder:    dark ? "#2a2a2a" : "#DDD5C3",
    hoverBg:     dark ? "#1F3929" : "#EDE8DF",
    searchBg:    dark ? "#1a1a1a" : "#F7F2E8",
    placeholder: dark ? "#555"    : "#9BA17B",
    codeColor:   dark ? "#9BA17B" : "#1F3929",
  };

  const baseInput: React.CSSProperties = {
    background:  clr.bg,
    border:      "none",
    outline:     "none",
    color:       clr.text,
    fontFamily:  "'IBM Plex Sans Arabic', Tahoma, sans-serif",
    fontSize:    "0.88rem",
    flex:        1,
    padding:     "0 0.75rem",
    height:      "100%",
    direction:   "ltr",            /* ← أرقام دائماً LTR */
    textAlign:   "left",
    boxSizing:   "border-box",
    minWidth:    0,
  };

  return (
    <div ref={wrapRef} style={{ position: "relative", ...style }}>
      {/* ── الحقل الرئيسي ── */}
      <div
        style={{
          display:     "flex",
          alignItems:  "center",
          background:  clr.bg,
          border:      `1px solid ${clr.border}`,
          height:      48,
          borderRadius: 0,
          overflow:    "hidden",
          direction:   "ltr",      /* الكود على اليسار */
          boxSizing:   "border-box",
          ...style,
          position:    "relative",
        }}
      >
        {/* زر كود البلد */}
        <button
          type="button"
          onClick={() => !disabled && setOpen(v => !v)}
          disabled={disabled}
          style={{
            display:        "flex",
            alignItems:     "center",
            gap:            5,
            padding:        "0 10px",
            height:         "100%",
            background:     clr.btn,
            border:         "none",
            borderLeft:     `1px solid ${clr.divider}`,
            cursor:         disabled ? "default" : "pointer",
            flexShrink:     0,
            whiteSpace:     "nowrap",
            direction:      "ltr",
            ...triggerStyle,
          }}
        >
          <span style={{ fontSize: "1.2rem", lineHeight: 1 }}>{selected.flag}</span>
          <span style={{ fontSize: "0.78rem", color: clr.codeColor, fontFamily: "monospace", letterSpacing: "0.02em" }}>
            {selected.code}
          </span>
          <span style={{ fontSize: "0.55rem", color: clr.placeholder, marginRight: 1 }}>▾</span>
        </button>

        {/* حقل الرقم */}
        <input
          type="tel"
          value={value}
          onChange={e => onChange(e.target.value, selected)}
          placeholder={placeholder ?? (selected.code === "+966" ? "05xxxxxxxx" : "xxxxxxxxx")}
          required={required}
          disabled={disabled}
          autoComplete="tel"
          inputMode="tel"
          style={{ ...baseInput, ...inputStyle }}
        />
      </div>

      {/* ── قائمة الدول ── */}
      {open && (
        <div
          style={{
            position:   "absolute",
            top:        "calc(100% + 4px)",
            left:       0,
            right:      0,
            background: clr.ddBg,
            border:     `1px solid ${clr.ddBorder}`,
            boxShadow:  "0 8px 32px rgba(0,0,0,0.18)",
            zIndex:     999,
            borderRadius: 2,
            overflow:   "hidden",
            direction:  "rtl",
          }}
        >
          {/* بحث */}
          <div style={{ padding: "8px 10px", borderBottom: `1px solid ${clr.ddBorder}` }}>
            <input
              ref={searchRef}
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="ابحث عن دولة..."
              style={{
                width: "100%", border: `1px solid ${clr.ddBorder}`,
                background: clr.searchBg, color: clr.text,
                padding: "6px 10px", borderRadius: 4, outline: "none",
                fontFamily: "'IBM Plex Sans Arabic', Tahoma, sans-serif", fontSize: "0.82rem",
                boxSizing: "border-box", direction: "rtl",
              }}
            />
          </div>

          {/* القائمة */}
          <div style={{ maxHeight: 240, overflowY: "auto" }}>
            {filtered.length === 0 && (
              <div style={{ padding: "12px 14px", color: clr.placeholder, fontSize: "0.82rem" }}>
                لا توجد نتائج
              </div>
            )}
            {filtered.map(c => (
              <button
                key={c.code + c.abbr}
                type="button"
                onClick={() => pick(c)}
                style={{
                  width:      "100%",
                  display:    "flex",
                  alignItems: "center",
                  gap:        10,
                  padding:    "9px 14px",
                  background: c.code === selected.code ? clr.hoverBg : "transparent",
                  border:     "none",
                  cursor:     "pointer",
                  textAlign:  "right",
                  direction:  "rtl",
                  color:      clr.text,
                  fontFamily: "'IBM Plex Sans Arabic', Tahoma, sans-serif",
                  fontSize:   "0.84rem",
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = clr.hoverBg)}
                onMouseLeave={e => (e.currentTarget.style.background = c.code === selected.code ? clr.hoverBg : "transparent")}
              >
                <span style={{ fontSize: "1.15rem", flexShrink: 0 }}>{c.flag}</span>
                <span style={{ flex: 1 }}>{c.name}</span>
                <span style={{ fontFamily: "monospace", fontSize: "0.78rem", color: clr.placeholder, flexShrink: 0, direction: "ltr" }}>
                  {c.code}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
