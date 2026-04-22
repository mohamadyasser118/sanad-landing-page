'use client';

import { useState, useEffect } from 'react';

const SOCIAL = {
  instagram: 'https://www.instagram.com/sanadstartup',
  facebook:  'https://web.facebook.com/SanadStartup',
  linkedin:  'https://linkedin.com/company/sanad-startup',
  whatsapp:  'https://wa.me/01027550456', 
  twitter:   'https://x.com/SanadStartup',
};

// ─── DESIGN TOKENS ───────────────────────────────────────────────
const C = {
  sand: '#D4CEC4',
  stone: '#B8AE9F',
  slate: '#35465A',
  amber: '#F0A65A',
  rust: '#A45136',
  ink: '#1E2D3A',
  sandLight: '#EDE9E2',
  sandPale: '#F7F4EF',
  amberPale: '#FDF3E8',
  rustPale: '#F9ECE8',
  white: '#FFFFFF',
  inkMid: '#26374A',
};

// ─── 27 محافظة مصرية ─────────────────────────────────────────────
const GOVS = [
  'القاهرة',
  'الجيزة',
  'الإسكندرية',
  'القليوبية',
  'الشرقية',
  'الدقهلية',
  'الغربية',
  'المنوفية',
  'كفر الشيخ',
  'البحيرة',
  'دمياط',
  'الإسماعيلية',
  'بورسعيد',
  'السويس',
  'شمال سيناء',
  'جنوب سيناء',
  'الفيوم',
  'بني سويف',
  'المنيا',
  'أسيوط',
  'سوهاج',
  'قنا',
  'الأقصر',
  'أسوان',
  'مطروح',
  'الوادي الجديد',
  'البحر الأحمر',
];

// ─── GLOBAL CSS ───────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fira+Mono:wght@400;500;700&family=Almarai:wght@300;400;700;800&display=swap');

  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

  :root {
    --sand:#D4CEC4; --stone:#B8AE9F; --slate:#35465A;
    --amber:#F0A65A; --rust:#A45136; --ink:#1E2D3A;
    --sand-light:#EDE9E2; --sand-pale:#F7F4EF;
    --amber-pale:#FDF3E8; --rust-pale:#F9ECE8;
    --font-mono:'Fira Mono',monospace;
    --font-body:'Almarai',sans-serif;
    --font-display:'Palestine','Almarai',serif;
    --r:10px; --r-lg:18px;
    --t:all .3s cubic-bezier(.4,0,.2,1);
    --max:1140px;
  }

  html { scroll-behavior:smooth; font-size:16px; overflow-x:hidden; direction:rtl; }
  body {
    font-family:var(--font-body); background:var(--sand-pale);
    color:var(--ink); line-height:1.75; overflow-x:hidden;
    direction:rtl; text-align:right; -webkit-font-smoothing:antialiased;
  }

  ::selection { background:var(--amber); color:var(--ink); }
  ::-webkit-scrollbar { width:5px; }
  ::-webkit-scrollbar-track { background:var(--sand-light); }
  ::-webkit-scrollbar-thumb { background:var(--amber); border-radius:3px; }

  @keyframes fadeUp   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:none} }
  @keyframes fadeDown { from{opacity:0;transform:translateY(-14px)} to{opacity:1;transform:none} }
  @keyframes spin     { to{transform:rotate(360deg)} }
  @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:.3} }
  @keyframes drift    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
  @keyframes modalIn  { from{opacity:0;transform:scale(.97) translateY(18px)} to{opacity:1;transform:none} }
  @keyframes shimmer  { 0%{opacity:.6} 50%{opacity:1} 100%{opacity:.6} }

  .reveal {
    opacity:0; transform:translateY(22px);
    transition:opacity .65s cubic-bezier(.4,0,.2,1), transform .65s cubic-bezier(.4,0,.2,1);
  }
  .reveal.vis { opacity:1; transform:none; }
  .d1{transition-delay:.07s} .d2{transition-delay:.14s} .d3{transition-delay:.21s}
  .d4{transition-delay:.28s} .d5{transition-delay:.35s} .d6{transition-delay:.42s}

  /* تحسين الأزرار */
  button { cursor:pointer; }
  a { text-decoration:none; color:inherit; }
  select { direction:rtl; text-align:right; -webkit-appearance:none; appearance:none; }
  input,textarea,select { font-family:var(--font-body)!important; }

  /* خط Palestine للوجو */
  .logo-text { font-family:'Palestine','Almarai',serif; }

  /* Responsive */
  @media(max-width:900px) { .hide-mob{display:none!important;} .show-mob{display:flex!important;} }
  @media(min-width:901px) { .show-mob{display:none!important;} }
  @media(max-width:680px) {
    .two-col { grid-template-columns:1fr!important; }
    .three-col { grid-template-columns:1fr!important; }
    .stat-row { grid-template-columns:1fr 1fr!important; }
    .footer-grid { grid-template-columns:1fr 1fr!important; }
    .hero-ctas { flex-direction:column!important; }
    .hero-ctas .btn { width:100%!important; justify-content:center!important; }
  }
`;

// ═══════════════════════════════════════════════════════════════════
//  ATOMS
// ═══════════════════════════════════════════════════════════════════

function Tag({ children, variant = 'amber' }) {
  const s = {
    amber: { bg: C.amberPale, c: C.rust },
    ink: { bg: 'rgba(30,45,58,.07)', c: C.slate },
    dark: { bg: 'rgba(240,166,90,.12)', c: C.amber },
  }[variant] || { bg: C.amberPale, c: C.rust };
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '5px 16px',
        borderRadius: 9999,
        background: s.bg,
        color: s.c,
        fontSize: '.7rem',
        fontWeight: 700,
        letterSpacing: '.07em',
        fontFamily: 'var(--font-mono)',
      }}
    >
      {children}
    </span>
  );
}

function Btn({
  children,
  variant = 'primary',
  onClick,
  type = 'button',
  fullWidth,
  disabled,
  style = {},
}) {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '14px 30px',
    borderRadius: 9999,
    fontSize: '1rem',
    fontWeight: 700,
    cursor: disabled ? 'not-allowed' : 'pointer',
    border: 'none',
    fontFamily: 'var(--font-body)',
    transition: 'var(--t)',
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled ? 0.6 : 1,
    direction: 'rtl',
    letterSpacing: '.01em',
    lineHeight: 1.3,
  };
  const v = {
    primary: {
      background: C.amber,
      color: C.ink,
      boxShadow: '0 4px 24px rgba(240,166,90,.28)',
    },
    rust: {
      background: C.rust,
      color: C.white,
      boxShadow: '0 4px 24px rgba(164,81,54,.22)',
    },
    secondary: { background: C.ink, color: C.sand },
    outline: {
      background: 'transparent',
      color: C.ink,
      border: `2px solid ${C.stone}`,
    },
    outlineLight: {
      background: 'transparent',
      color: C.sand,
      border: '2px solid rgba(212,206,196,.3)',
    },
    ghost: {
      background: 'rgba(212,206,196,.08)',
      color: C.sand,
      border: '1px solid rgba(212,206,196,.18)',
    },
  };
  return (
    <button
      className="btn"
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{ ...base, ...v[variant], ...style }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.filter = 'brightness(1.06)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.filter = 'none';
      }}
    >
      {children}
    </button>
  );
}

function Field({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  required,
  options,
  multiline,
  helper,
}) {
  const base = {
    width: '100%',
    padding: '13px 16px',
    borderRadius: 10,
    border: `1.5px solid ${C.sand}`,
    background: C.white,
    color: C.ink,
    fontSize: '.93rem',
    fontFamily: 'var(--font-body)',
    transition: 'var(--t)',
    outline: 'none',
    direction: 'rtl',
    textAlign: 'right',
    resize: multiline ? 'vertical' : 'none',
    minHeight: multiline ? 95 : 'auto',
  };
  return (
    <div style={{ marginBottom: 18 }}>
      <label
        style={{
          display: 'block',
          fontSize: '.78rem',
          fontWeight: 700,
          color: C.slate,
          marginBottom: 7,
          fontFamily: 'var(--font-mono)',
          letterSpacing: '.04em',
        }}
      >
        {label}
        {required && <span style={{ color: C.rust, marginRight: 2 }}> *</span>}
      </label>
      {options ? (
        <div style={{ position: 'relative' }}>
          <select
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            style={{ ...base, cursor: 'pointer', paddingLeft: 36 }}
            onFocus={(e) => {
              e.target.style.borderColor = C.amber;
              e.target.style.boxShadow = `0 0 0 3px ${C.amber}20`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = C.sand;
              e.target.style.boxShadow = 'none';
            }}
          >
            <option value="">— اختر —</option>
            {options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          <span
            style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              color: C.stone,
              fontSize: '.7rem',
              pointerEvents: 'none',
            }}
          >
            ▼
          </span>
        </div>
      ) : multiline ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          style={base}
          rows={4}
          onFocus={(e) => {
            e.target.style.borderColor = C.amber;
            e.target.style.boxShadow = `0 0 0 3px ${C.amber}20`;
          }}
          onBlur={(e) => {
            e.target.style.borderColor = C.sand;
            e.target.style.boxShadow = 'none';
          }}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          style={base}
          onFocus={(e) => {
            e.target.style.borderColor = C.amber;
            e.target.style.boxShadow = `0 0 0 3px ${C.amber}20`;
          }}
          onBlur={(e) => {
            e.target.style.borderColor = C.sand;
            e.target.style.boxShadow = 'none';
          }}
        />
      )}
      {helper && (
        <p
          style={{
            fontSize: '.75rem',
            color: C.stone,
            marginTop: 5,
            fontFamily: 'var(--font-mono)',
          }}
        >
          {helper}
        </p>
      )}
    </div>
  );
}

// ─── REVEAL HOOK ─────────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('vis');
        }),
      { threshold: 0.1, rootMargin: '0px 0px -36px 0px' },
    );
    document.querySelectorAll('.reveal').forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

// ─── MODAL ────────────────────────────────────────────────────────
function Modal({ open, onClose, title, subtitle, children }) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);
  if (!open) return null;
  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        background: 'rgba(30,45,58,.78)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          background: C.sandPale,
          borderRadius: 20,
          width: '100%',
          maxWidth: 540,
          maxHeight: '92vh',
          overflowY: 'auto',
          border: `1px solid ${C.sand}`,
          boxShadow: '0 32px 80px rgba(30,45,58,.4)',
          animation: 'modalIn .32s cubic-bezier(.4,0,.2,1) both',
          direction: 'rtl',
        }}
      >
        <div
          style={{
            padding: '30px 32px 22px',
            borderBottom: `1px solid ${C.sand}`,
            position: 'relative',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div style={{ flex: 1 }}>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.65rem',
                fontWeight: 700,
                color: C.ink,
                marginBottom: 7,
                lineHeight: 1.2,
              }}
            >
              {title}
            </h2>
            {subtitle && (
              <p
                style={{ fontSize: '.88rem', color: C.slate, lineHeight: 1.6 }}
              >
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              marginRight: 12,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: C.stone,
              fontSize: '1.3rem',
              lineHeight: 1,
              padding: 4,
              flexShrink: 0,
              transition: 'var(--t)',
              borderRadius: 6,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = C.ink;
              e.currentTarget.style.background = C.sandLight;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = C.stone;
              e.currentTarget.style.background = 'none';
            }}
          >
            ✕
          </button>
        </div>
        <div style={{ padding: '24px 32px 32px' }}>{children}</div>
      </div>
    </div>
  );
}

function SuccessState({ title, message, onClose }) {
  return (
    <div style={{ textAlign: 'center', padding: '16px 0 4px' }}>
      <div
        style={{
          width: 68,
          height: 68,
          borderRadius: '50%',
          background: C.amberPale,
          border: `2.5px solid ${C.amber}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.8rem',
          margin: '0 auto 22px',
          animation: 'shimmer 2s ease infinite',
        }}
      >
        ✓
      </div>
      <h3
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.35rem',
          fontWeight: 700,
          color: C.ink,
          marginBottom: 11,
          lineHeight: 1.25,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: '.92rem',
          color: C.slate,
          lineHeight: 1.8,
          marginBottom: 28,
        }}
      >
        {message}
      </p>
      <Btn variant="secondary" onClick={onClose}>
        إغلاق
      </Btn>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  FORM: قائمة انتظار العملاء
//  ─────────────────────────────────────────────────────────────────
//  لربط البيانات بداتابيز:
//  1. أنشئ /app/api/waitlist/route.js في مشروع Next.js
//  2. استخدم Supabase أو MongoDB أو Airtable
//  3. غيّر الـ fake await بـ: await fetch('/api/waitlist', { method:'POST', body: JSON.stringify(form) })
//  مثال كامل موجود في README.md
// ═══════════════════════════════════════════════════════════════════
function UserForm({ onClose }) {
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    governorate: '',
    legalNeed: '',
    description: '',
    howHeard: '',
  });
  const set = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() ? form.email.trim() : null,
        governorate: form.governorate,
        legalNeed: form.legalNeed,
        description: form.description.trim(),
        howHeard: form.howHeard,
      };

      const res = await fetch('https://sanad.page/api/v1/waiting-list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('فشل إرسال البيانات، حاول مرة أخرى.');
      }

      setDone(true);
    } catch (err) {
      setError(err?.message || 'حدث خطأ غير متوقع أثناء الإرسال.');
    } finally {
      setLoading(false);
    }
  };

  if (done)
    return (
      <SuccessState
        title="تم تسجيلك بنجاح 🎉"
        message="سنُبلّغك فور إطلاق سَنَد. ستكون من أوائل من يصلون إلى محامين موثّقين ومتخصصين في مصر."
        onClose={onClose}
      />
    );

  return (
    <form onSubmit={submit}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0 14px',
        }}
      >
        <Field
          label="الاسم الأول"
          name="firstName"
          value={form.firstName}
          onChange={set}
          placeholder="أحمد"
          required
        />
        <Field
          label="الاسم الأخير"
          name="lastName"
          value={form.lastName}
          onChange={set}
          placeholder="حسن"
          required
        />
      </div>
      <Field
        label="رقم الهاتف"
        name="phone"
        type="tel"
        value={form.phone}
        onChange={set}
        placeholder="01X-XXXX-XXXX"
        required
        helper="سنُرسل إليك تأكيد التسجيل على هذا الرقم"
      />
      <Field
        label="البريد الإلكتروني (اختياري)"
        name="email"
        type="email"
        value={form.email}
        onChange={set}
        placeholder="example@mail.com"
      />
      <Field
        label="المحافظة"
        name="governorate"
        value={form.governorate}
        onChange={set}
        required
        options={GOVS}
      />
      <Field
        label="نوع المساعدة القانونية المطلوبة"
        name="legalNeed"
        value={form.legalNeed}
        onChange={set}
        required
        options={[
          'عقارات وإيجارات',
          'أحوال شخصية (طلاق، حضانة، ميراث)',
          'عمل وتوظيف',
          'تأسيس شركات وقضايا تجارية',
          'مرور وحوادث',
          'ديون ومنازعات مالية',
          'قضايا جنائية',
          'إداري وحقوق',
          'ملكية فكرية',
          'غير متأكد بعد',
        ]}
      />
      <Field
        label="وصف موجز لوضعك"
        name="description"
        value={form.description}
        onChange={set}
        placeholder="اشرح لنا بإيجاز ما تواجهه..."
        multiline
        required
        helper="هذا الحقل مطلوب لإكمال التسجيل"
      />
      <Field
        label="كيف سمعت عن سَنَد؟"
        name="howHeard"
        value={form.howHeard}
        onChange={set}
        options={[
          'صديق أو أحد أفراد العائلة',
          'منصات التواصل الاجتماعي',
          'بحث جوجل',
          'مجموعة واتساب',
          'توصية من محامٍ',
          'أخرى',
        ]}
      />
      {error && (
        <p
          style={{
            fontSize: '.82rem',
            color: C.rust,
            marginBottom: 12,
            fontFamily: 'var(--font-mono)',
            lineHeight: 1.6,
          }}
        >
          {error}
        </p>
      )}
      <div style={{ marginTop: 10 }}>
        <Btn type="submit" variant="rust" fullWidth disabled={loading}>
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  border: `2px solid ${C.sand}`,
                  borderTopColor: 'transparent',
                  animation: 'spin .7s linear infinite',
                  display: 'inline-block',
                }}
              />
              جارٍ التسجيل...
            </span>
          ) : (
            'انضم إلى قائمة الانتظار'
          )}
        </Btn>
        <p
          style={{
            fontSize: '.75rem',
            color: C.stone,
            textAlign: 'center',
            marginTop: 11,
            fontFamily: 'var(--font-mono)',
          }}
        >
          التسجيل مجاني · لا حاجة لبطاقة بنكية
        </p>
      </div>
    </form>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  FORM: تسجيل المحامين
//  ─────────────────────────────────────────────────────────────────
//  لربط البيانات بداتابيز:
//  أنشئ /app/api/lawyers/route.js واستخدم:
//  const res = await fetch('/api/lawyers', { method:'POST', body: JSON.stringify(form) })
// ═══════════════════════════════════════════════════════════════════
function LawyerForm({ onClose }) {
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    governorate: '',
    officeAddress: '',
    specialization: '',
    yearsExp: '',
    barGrade: '',
    bio: '',
    linkedIn: '',
    message: '',
    howHeard: '',
  });
  const set = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const next = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        governorate: form.governorate,
        officeAddress: form.officeAddress.trim() ? form.officeAddress.trim() : null,
        specialization: form.specialization,
        yearsExp: form.yearsExp,
        barGrade: form.barGrade,
        bio: form.bio.trim(),
        linkedIn: form.linkedIn.trim() ? form.linkedIn.trim() : null,
        howHeard: form.howHeard.trim() ? form.howHeard.trim() : null,
        message: form.message.trim() ? form.message.trim() : null,
      };

      const res = await fetch('https://sanad.page/api/v1/founding-lawyers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('فشل إرسال الطلب، حاول مرة أخرى.');
      }

      setDone(true);
    } catch (err) {
      setError(err?.message || 'حدث خطأ غير متوقع أثناء الإرسال.');
    } finally {
      setLoading(false);
    }
  };

  if (done)
    return (
      <SuccessState
        title="وصل طلبك! ⚖️"
        message="سنراجع بياناتك ونتواصل معك خلال 48 ساعة. بوصفك محاميًا مؤسسًا، ستحصل على عمولة 5% فقط للأشهر الثلاثة الأولى، وشارة المؤسس، وأولوية الظهور في نتائج البحث."
        onClose={onClose}
      />
    );

  return (
    <div>
      {/* مؤشر الخطوات */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 24,
          justifyContent: 'flex-end',
        }}
      >
        {[1, 2].map((s, i) => (
          <div
            key={s}
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            {i > 0 && (
              <span style={{ color: C.stone, fontSize: '.75rem' }}>←</span>
            )}
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                background: s <= step ? C.amber : C.sand,
                color: s <= step ? C.ink : C.stone,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '.75rem',
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
                transition: 'var(--t)',
                flexShrink: 0,
              }}
            >
              {s}
            </div>
            <span
              style={{
                fontSize: '.76rem',
                fontFamily: 'var(--font-mono)',
                color: s === step ? C.ink : C.stone,
                fontWeight: s === step ? 700 : 400,
              }}
            >
              {s === 1 ? 'البيانات الشخصية' : 'البيانات المهنية'}
            </span>
          </div>
        ))}
      </div>

      {step === 1 && (
        <form onSubmit={next}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0 14px',
            }}
          >
            <Field
              label="الاسم الأول"
              name="firstName"
              value={form.firstName}
              onChange={set}
              placeholder="عمر"
              required
            />
            <Field
              label="الاسم الأخير"
              name="lastName"
              value={form.lastName}
              onChange={set}
              placeholder="محمود"
              required
            />
          </div>
          <Field
            label="رقم الهاتف"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={set}
            placeholder="01X-XXXX-XXXX"
            required
          />
          <Field
            label="البريد الإلكتروني المهني"
            name="email"
            type="email"
            value={form.email}
            onChange={set}
            placeholder="lawyer@example.com"
            required
          />
          <Field
            label="محافظة الممارسة"
            name="governorate"
            value={form.governorate}
            onChange={set}
            required
            options={GOVS}
          />
          <Field
            label="عنوان المكتب (اختياري)"
            name="officeAddress"
            value={form.officeAddress}
            onChange={set}
            placeholder="الشارع، الحي، المدينة"
          />
          <Btn type="submit" variant="secondary" fullWidth>
            التالي — البيانات المهنية ←
          </Btn>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={submit}>
          <Field
            label="التخصص القانوني الرئيسي"
            name="specialization"
            value={form.specialization}
            onChange={set}
            required
            options={[
              'أحوال شخصية وقانون الأسرة',
              'عقارات وإيجارات',
              'عمل وتوظيف',
              'تجاري وشركات',
              'جنائي',
              'ضرائب',
              'مرور وحوادث',
              'إداري وحقوق',
              'ملكية فكرية وتكنولوجيا',
              'أخرى',
            ]}
          />
          <Field
            label="سنوات الخبرة"
            name="yearsExp"
            value={form.yearsExp}
            onChange={set}
            required
            options={[
              'أقل من سنتين',
              '2–5 سنوات',
              '5–10 سنوات',
              '10–20 سنة',
              'أكثر من 20 سنة',
            ]}
          />
          <Field
            label="درجة القيد بالنقابة"
            name="barGrade"
            value={form.barGrade}
            onChange={set}
            required
            options={['قيد ابتدائي', 'قيد استئناف', 'قيد نقض']}
          />
          <Field
            label="نبذة مهنية"
            name="bio"
            value={form.bio}
            onChange={set}
            multiline
            required
            placeholder="اكتب باختصار عن تخصصك وخبراتك وأنواع القضايا التي تتولاها..."
            helper="ستظهر هذه النبذة في ملفك الشخصي العام على سَنَد"
          />
          <Field
            label="رابط LinkedIn (اختياري)"
            name="linkedIn"
            value={form.linkedIn}
            onChange={set}
            placeholder="linkedin.com/in/your-name"
          />
          <Field
            label="كيف سمعت عن سَنَد؟"
            name="howHeard"
            value={form.howHeard}
            onChange={set}
            options={[
              'رسالة على LinkedIn',
              'مجموعة واتساب',
              'فعالية بنقابة المحامين',
              'توصية من زميل',
              'بحث جوجل',
              'وسائل التواصل الاجتماعي',
              'أخرى',
            ]}
          />
          <Field
            label="أي ملاحظات أو أسئلة؟ (اختياري)"
            name="message"
            value={form.message}
            onChange={set}
            multiline
            placeholder="شاركنا أي تساؤلات أو أفكار..."
          />
          {error && (
            <p
              style={{
                fontSize: '.82rem',
                color: C.rust,
                marginBottom: 12,
                fontFamily: 'var(--font-mono)',
                lineHeight: 1.6,
              }}
            >
              {error}
            </p>
          )}
          <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
            <Btn
              type="button"
              variant="outline"
              onClick={() => setStep(1)}
              style={{ flexShrink: 0 }}
            >
              ← رجوع
            </Btn>
            <Btn type="submit" variant="rust" fullWidth disabled={loading}>
              {loading ? (
                <span
                  style={{ display: 'flex', alignItems: 'center', gap: 10 }}
                >
                  <span
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      border: `2px solid ${C.sand}`,
                      borderTopColor: 'transparent',
                      animation: 'spin .7s linear infinite',
                      display: 'inline-block',
                    }}
                  />
                  جارٍ الإرسال...
                </span>
              ) : (
                'إرسال الطلب'
              )}
            </Btn>
          </div>
          <p
            style={{
              fontSize: '.75rem',
              color: C.stone,
              textAlign: 'center',
              marginTop: 11,
              fontFamily: 'var(--font-mono)',
            }}
          >
            بياناتك محفوظة ولن تُستخدم إلا في عملية التأهيل.
          </p>
        </form>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  NAVBAR
// ═══════════════════════════════════════════════════════════════════
function Nav({ onUser, onLawyer }) {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const lnk = {
    color: 'rgba(212,206,196,.72)',
    fontSize: '.87rem',
    fontWeight: 500,
    fontFamily: 'var(--font-mono)',
    transition: 'var(--t)',
    textDecoration: 'none',
    cursor: 'pointer',
    letterSpacing: '.03em',
    background: 'none',
    border: 'none',
    padding: 0,
  };

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 500,
          padding: scrolled ? '11px 0' : '16px 0',
          background: scrolled ? 'rgba(30,45,58,.97)' : 'rgba(30,45,58,.0)',
          backdropFilter: scrolled ? 'blur(18px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(212,206,196,.08)' : 'none',
          transition: 'var(--t)',
        }}
      >
        <div
          style={{
            maxWidth: 'var(--max)',
            margin: '0 auto',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <a
            href="#"
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span
              className="logo-text"
              style={{
                fontSize: '1.9rem',
                fontWeight: 900,
                color: C.sand,
                letterSpacing: '.02em',
                lineHeight: 1,
              }}
            >
              سند
            </span>
          </a>

          {/* Links - Desktop */}
          <div
            className="hide-mob"
            style={{ display: 'flex', gap: 26, alignItems: 'center' }}
          >
            {[
              ['#problem', 'المشكلة'],
              ['#how-it-works', 'آلية العمل'],
              ['#features', 'الميزات'],
              ['#trust', 'لماذا سَنَد'],
              ['#faq', 'الأسئلة'],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                style={lnk}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.sand)}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = 'rgba(212,206,196,.72)')
                }
              >
                {label}
              </a>
            ))}
          </div>

          {/* CTAs - Desktop */}
          <div className="hide-mob" style={{ display: 'flex', gap: 10 }}>
            <Btn
              variant="ghost"
              onClick={onUser}
              style={{ padding: '9px 18px', fontSize: '.86rem' }}
            >
              أحتاج مساعدة قانونية
            </Btn>
            <Btn
              variant="primary"
              onClick={onLawyer}
              style={{ padding: '9px 18px', fontSize: '.86rem' }}
            >
              انضم كمحامٍ
            </Btn>
          </div>

          {/* Burger */}
          <button
            className="show-mob"
            onClick={() => setMenu(true)}
            style={{
              background: 'none',
              border: 'none',
              padding: 4,
              cursor: 'pointer',
              display: 'none',
              flexDirection: 'column',
              gap: 5,
            }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: 22,
                  height: 2,
                  background: C.sand,
                  borderRadius: 2,
                }}
              />
            ))}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menu && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: C.ink,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 28,
            animation: 'fadeDown .28s ease both',
            direction: 'rtl',
          }}
        >
          <button
            onClick={() => setMenu(false)}
            style={{
              position: 'absolute',
              top: 18,
              left: 22,
              background: 'none',
              border: 'none',
              color: C.sand,
              fontSize: '1.6rem',
              cursor: 'pointer',
              lineHeight: 1,
            }}
          >
            ✕
          </button>
          <span
            className="logo-text"
            style={{
              fontSize: '2.2rem',
              fontWeight: 900,
              color: C.amber,
              marginBottom: 8,
            }}
          >
            سند
          </span>
          {[
            ['#problem', 'المشكلة'],
            ['#how-it-works', 'آلية العمل'],
            ['#features', 'الميزات'],
            ['#trust', 'لماذا سَنَد'],
            ['#faq', 'الأسئلة'],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              onClick={() => setMenu(false)}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.6rem',
                fontWeight: 700,
                color: C.sand,
                textDecoration: 'none',
                transition: 'color .2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.amber)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.sand)}
            >
              {label}
            </a>
          ))}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              marginTop: 12,
              width: 260,
            }}
          >
            <Btn
              variant="rust"
              onClick={() => {
                setMenu(false);
                onUser();
              }}
              fullWidth
            >
              أحتاج مساعدة قانونية
            </Btn>
            <Btn
              variant="outlineLight"
              onClick={() => {
                setMenu(false);
                onLawyer();
              }}
              fullWidth
            >
              انضم كمحامٍ مؤسس
            </Btn>
          </div>
        </div>
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  HERO
// ═══════════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════
//  HERO
// ═══════════════════════════════════════════════════════════════════
function Hero({ onUser, onLawyer }) {
  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: C.ink,
        overflow: 'hidden',
        direction: 'rtl',
      }}
    >
      {/* طبقات الخلفية */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.04,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px',
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          background: `radial-gradient(ellipse 70% 70% at 30% 55%, rgba(164,81,54,.18) 0%, transparent 60%),
                    radial-gradient(ellipse 45% 55% at 85% 80%, rgba(240,166,90,.07) 0%, transparent 55%),
                    linear-gradient(158deg, #1E2D3A 0%, #25364A 50%, #1C2C3C 100%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          backgroundImage: `linear-gradient(rgba(212,206,196,.022) 1px,transparent 1px),
                         linear-gradient(90deg,rgba(212,206,196,.022) 1px,transparent 1px)`,
          backgroundSize: '52px 52px',
          maskImage:
            'radial-gradient(ellipse 110% 100% at 50% 50%, black 20%, transparent 80%)',
        }}
      />

      {/* حلقات زخرفية */}
      <div
        style={{
          position: 'absolute',
          left: -100,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 640,
          height: 640,
          borderRadius: '50%',
          border: '1px solid rgba(240,166,90,.09)',
          zIndex: 0,
          animation: 'spin 55s linear infinite',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 65,
            borderRadius: '50%',
            border: '1px solid rgba(212,206,196,.04)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 130,
            borderRadius: '50%',
            border: '1px solid rgba(164,81,54,.06)',
          }}
        />
      </div>

      <div
        style={{
          maxWidth: 'var(--max)',
          margin: '0 auto',
          padding: '130px 24px 80px',
          position: 'relative',
          zIndex: 2,
          width: '100%',
        }}
      >
        {/* استخدام الـ Grid لتقسيم الشاشة لجزأين */}
        <div
          className="two-col"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: '40px',
            alignItems: 'center',
          }}
        >
          {/* الجانب الأيمن: النصوص (Text Content) */}
          <div style={{ maxWidth: 660 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(240,166,90,.1)',
                border: '1px solid rgba(240,166,90,.22)',
                color: C.amber,
                padding: '6px 16px',
                borderRadius: 9999,
                fontSize: '.7rem',
                fontWeight: 700,
                letterSpacing: '.07em',
                fontFamily: 'var(--font-mono)',
                marginBottom: 30,
                animation: 'fadeDown .8s .1s ease both',
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: C.amber,
                  animation: 'pulse 2s ease infinite',
                }}
              />
              🇪🇬 مبني لسوق القانون المصري — التسجيل المبكر مفتوح الآن
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.6rem, 5vw, 4.2rem)',
                fontWeight: 900,
                lineHeight: 1.1,
                color: C.sand,
                marginBottom: 20,
                animation: 'fadeUp .9s .2s ease both',
              }}
            >
              مشكلتك القانونية
              <br />
              تستحق{' '}
              <span
                style={{
                  color: 'transparent',
                  backgroundImage: `linear-gradient(135deg, ${C.amber} 0%, ${C.rust} 100%)`,
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  fontStyle: 'italic',
                }}
              >
                طريقًا واضحًا
              </span>{' '}
              دون تعقيد.
              <br />
            </h1>

            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.05rem,1.8vw,1.22rem)',
                color: C.amber,
                fontStyle: 'italic',
                marginBottom: 14,
                opacity: 0.9,
                animation: 'fadeUp .9s .32s ease both',
                letterSpacing: '.02em',
              }}
            >
              سندك في كل خطوة قانونية
            </p>

            <p
              style={{
                fontSize: '1.05rem',
                color: 'rgba(212,206,196,.68)',
                lineHeight: 1.82,
                marginBottom: 40,
                maxWidth: 520,
                animation: 'fadeUp .9s .4s ease both',
              }}
            >
              سَنَد تربطك بالمحامي المصري المتخصص المناسب لقضيتك — بأسعار شفافة،
              وإجراءات منظّمة، وتجربة موثوقة من البداية حتى{' '}
              <strong style={{ color: 'rgba(212,206,196,.88)' }}>
                الوصول إلى حل.
              </strong>
            </p>

            <div
              className="hero-ctas"
              style={{
                display: 'flex',
                gap: 12,
                flexWrap: 'wrap',
                animation: 'fadeUp .9s .52s ease both',
              }}
            >
              <Btn
                variant="rust"
                onClick={onUser}
                style={{ padding: '15px 32px', fontSize: '1rem' }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  style={{ flexShrink: 0 }}
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                أحتاج مساعدة قانونية
              </Btn>
              <Btn
                variant="outlineLight"
                onClick={onLawyer}
                style={{ padding: '15px 32px', fontSize: '1rem' }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  style={{ flexShrink: 0 }}
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                انضم كمحامٍ مؤسس
              </Btn>
            </div>

            {/* إحصائيات سريعة للثقة */}
            <div
              style={{
                display: 'flex',
                gap: 28,
                flexWrap: 'wrap',
                marginTop: 48,
                animation: 'fadeUp .9s .65s ease both',
              }}
            >
              {[
                ['40', 'مقعد للمحاميين المؤسسين'],
                ['5%', 'عمولة للأشهر الثلاثة الأولى'],
              ].map(([n, l]) => (
                <div
                  key={n}
                  style={{ display: 'flex', alignItems: 'center', gap: 9 }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '2.15rem',
                      fontWeight: 700,
                      color: C.amber,
                    }}
                  >
                    {n}
                  </span>
                  <span
                    style={{
                      fontSize: '.8rem',
                      color: 'rgba(212,206,196,.42)',
                      lineHeight: 1.3,
                      maxWidth: 90,
                    }}
                  >
                    {l}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* الجانب الأيسر: الـ Mockup */}
          <div
            className="reveal"
            style={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              animationDelay: '0.4s',
            }}
          >
            {/* إضاءة خلفية تحت الموبايل لتعطيه بروز (Glow) */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '70%',
                height: '80%',
                background: C.slate,
                filter: 'blur(70px)',
                borderRadius: '50%',
                opacity: 0.5,
                zIndex: 0,
              }}
            />

            <img
              src="/sanad-mockup.png"
              alt="تطبيق سند"
              style={{
                position: 'relative',
                zIndex: 1,
                width: '100%',
                maxWidth: '320px',
                height: 'auto',
                transform: 'rotate(-3deg)',
                transition: 'all 0.6s cubic-bezier(.4,0,.2,1)',
                filter: 'drop-shadow(0 30px 40px rgba(0,0,0,0.6))',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform =
                  'rotate(0deg) translateY(-12px)';
                e.currentTarget.style.filter =
                  'drop-shadow(0 40px 50px rgba(0,0,0,0.8))';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'rotate(-3deg)';
                e.currentTarget.style.filter =
                  'drop-shadow(0 30px 40px rgba(0,0,0,0.6))';
              }}
            />
          </div>
        </div>
      </div>

      {/* مؤشر التمرير للأسفل */}
      <div
        style={{
          position: 'absolute',
          bottom: 28,
          right: '50%',
          transform: 'translateX(50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 5,
          zIndex: 2,
          animation: 'fadeUp 1s .9s ease both',
        }}
      >
        <span
          style={{
            fontSize: '.62rem',
            letterSpacing: '.15em',
            fontFamily: 'var(--font-mono)',
            color: 'rgba(212,206,196,.22)',
            textTransform: 'uppercase',
          }}
        >
          انزل
        </span>
        <div
          style={{
            width: 1,
            height: 34,
            background: `linear-gradient(to bottom, ${C.amber}55, transparent)`,
          }}
        />
      </div>
    </section>
  );
}
// ═══════════════════════════════════════════════════════════════════
//  PROBLEM
// ═══════════════════════════════════════════════════════════════════
function Problem() {
  const cards = [
    {
      icon: '⚠️',
      title: 'لا تعرف أيّ محامٍ يناسبك',
      desc: 'تشير التقديرات إلى أن غالبية المصريين يواجهون صعوبة في تحديد التخصص القانوني الدقيق لمشكلاتهم، مما يجعل رحلة البحث عن المحامي المناسب استنزافاً للوقت والمال.',
      c: C.rust,
    },
    {
      icon: '💸',
      title: 'الأتعاب غير واضحة',
      desc: 'الرسوم القانونية في مصر لا تُعلَن قبل الاستشارة في الغالب. يدفع الناس دون أن يعرفوا المقابل، مما يُفقدهم الثقة ويُعرّضهم للاستغلال.',
      c: C.amber,
    },
    {
      icon: '🔗',
      title: 'التوصيات الشخصية البديل الوحيد',
      desc: 'معظم الناس يجدون محاميهم عبر شبكة معارف ضيقة، دون أي تحقق من الكفاءة أو التخصص أو السمعة المهنية.',
      c: C.slate,
    },
  ];
  return (
    <section
      id="problem"
      style={{ padding: '96px 0', background: C.sandPale, direction: 'rtl' }}
    >
      <div
        style={{ maxWidth: 'var(--max)', margin: '0 auto', padding: '0 24px' }}
      >
        <div
          className="reveal"
          style={{ textAlign: 'center', marginBottom: 14 }}
        >
          <Tag>الواقع الذي نغيّره</Tag>
        </div>
        <h2
          className="reveal d1"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.85rem,3.5vw,2.8rem)',
            fontWeight: 700,
            color: C.ink,
            textAlign: 'center',
            lineHeight: 1.18,
            marginBottom: 16,
          }}
        >
          معظم المصريين يواجهون مشاكلهم القانونية{' '}
          <em
            style={{
              fontStyle: 'italic',
              color: 'transparent',
              backgroundImage: `linear-gradient(135deg,${C.amber},${C.rust})`,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
            }}
          >
            بلا دليل
          </em>
        </h2>
        <p
          className="reveal d2"
          style={{
            fontSize: '1.03rem',
            color: C.slate,
            textAlign: 'center',
            maxWidth: 560,
            margin: '0 auto 60px',
            lineHeight: 1.8,
          }}
        >
          في مصر، الوصول إلى المساعدة القانونية المناسبة ليس بسيطًا كما ينبغي.
          العملية معقّدة، غير شفافة، وغالبًا ما تبدأ بخطوة خاطئة. سَنَد وُجدت
          لتضع حدًا لهذا الارتباك.
        </p>

        <div
          className="three-col"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3,1fr)',
            gap: 20,
            marginBottom: 60,
          }}
        >
          {cards.map((c, i) => (
            <div
              key={i}
              className={`reveal d${i + 1}`}
              style={{
                background: C.white,
                borderRadius: 16,
                padding: '30px 26px',
                border: `1px solid ${C.sand}`,
                transition: 'var(--t)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = `0 14px 36px rgba(30,45,58,.11)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 11,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.3rem',
                  marginBottom: 18,
                  background: `${c.c}14`,
                  border: `1px solid ${c.c}22`,
                }}
              >
                {c.icon}
              </div>
              <h4
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: C.ink,
                  marginBottom: 9,
                  lineHeight: 1.3,
                }}
              >
                {c.title}
              </h4>
              <p
                style={{ fontSize: '.88rem', color: C.slate, lineHeight: 1.68 }}
              >
                {c.desc}
              </p>
            </div>
          ))}
        </div>

        {/* شريط الإحصاءات */}
        <div
          className="stat-row reveal"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3,1fr)',
            gap: 20,
            background: C.ink,
            borderRadius: 16,
            padding: '36px 40px',
            border: `1px solid ${C.inkMid}`,
          }}
        >
          {[
            ['700,000+', 'محامٍ مسجّل في مصر'],
            ['75%', 'يعتمدون على "المعارف"'],
            ['120 مليون+', 'مواطن يستحق وصولًا سهلًا للعدالة'],
          ].map(([n, l], i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'clamp(1.6rem,2.8vw,2.3rem)',
                  fontWeight: 700,
                  color: C.amber,
                  lineHeight: 1,
                  marginBottom: 7,
                }}
              >
                {n}
              </div>
              <div
                style={{ fontSize: '.84rem', color: C.stone, lineHeight: 1.45 }}
              >
                {l}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  SOLUTION
// ═══════════════════════════════════════════════════════════════════
function Solution() {
  const steps = [
    {
      n: '01',
      title: 'تصفح قائمة المحامين',
      desc: 'تصفّح ملفات محامين موثّقين ومتخصصين، حسب التخصص، الخبرة، الموقع، والسعر بشفافية تامة.',
    },
    {
      n: '02',
      title: 'اختر المحامي المناسب',
      desc: 'قارن بين الخيارات واختر المحامي الذي يناسب حالتك واحتياجك.',
    },
    {
      n: '03',
      title: 'احجز واستشر واحصل على نتيجة',
      desc: 'احجز جلستك صوتًا أو مرئيًا وادفع بأمان. تابع قضيتك وشارك مستنداتك — كل شيء منظّم في مكان واحد.',
    },
  ];
  return (
    <section
      style={{ padding: '96px 0', background: C.sandLight, direction: 'rtl' }}
    >
      <div
        style={{ maxWidth: 'var(--max)', margin: '0 auto', padding: '0 24px' }}
      >
        <div
          className="reveal"
          style={{ textAlign: 'center', marginBottom: 14 }}
        >
          <Tag variant="ink">طريقة سَنَد</Tag>
        </div>
        <h2
          className="reveal d1"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.85rem,3.5vw,2.8rem)',
            fontWeight: 700,
            color: C.ink,
            textAlign: 'center',
            lineHeight: 1.18,
            marginBottom: 16,
          }}
        >
          من الحيرة إلى الوضوح{' '}
          <em style={{ fontStyle: 'italic', color: C.rust }}>في 3 خطوات</em>
        </h2>
        <p
          className="reveal d2"
          style={{
            fontSize: '1.03rem',
            color: C.slate,
            textAlign: 'center',
            maxWidth: 540,
            margin: '0 auto 68px',
            lineHeight: 1.8,
          }}
        >
          سند ليست مجرد وسيط؛ هي رفيقك الرقمي في كل خطوة قانونية، صُممت لتختصر
          عليك الطريق وتضمن لك النتيجة.
        </p>

        <div
          className="three-col"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3,1fr)',
            gap: 0,
            position: 'relative',
          }}
        >
          {steps.map((s, i) => (
            <div
              key={i}
              className={`reveal d${i + 1}`}
              style={{
                padding: '0 32px',
                textAlign: 'center',
                position: 'relative',
                borderLeft: i < 2 ? `1px solid ${C.sand}` : 'none',
              }}
            >
              {i < 2 && (
                <div
                  style={{
                    position: 'absolute',
                    left: -6,
                    top: 52,
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: C.amber,
                    boxShadow: `0 0 0 4px ${C.sandLight}`,
                    zIndex: 1,
                  }}
                />
              )}
              <div
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: '50%',
                  background: C.ink,
                  color: C.amber,
                  fontFamily: 'var(--font-mono)',
                  fontSize: '1.4rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 26px',
                  position: 'relative',
                  boxShadow: `0 8px 24px rgba(30,45,58,.18), 0 0 0 7px ${C.sand}28`,
                }}
              >
                {s.n}
                <div
                  style={{
                    position: 'absolute',
                    inset: -7,
                    borderRadius: '50%',
                    border: `2px dashed ${C.amber}30`,
                    animation: 'spin 28s linear infinite',
                  }}
                />
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: C.ink,
                  marginBottom: 11,
                }}
              >
                {s.title}
              </h3>
              <p style={{ fontSize: '.9rem', color: C.slate, lineHeight: 1.7 }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
// ═══════════════════════════════════════════════════════════════════
//  HOW IT WORKS (Optimized for Tabs & Performance)
// ═══════════════════════════════════════════════════════════════════
function HowItWorks({ onUser, onLawyer }) {
  const [tab, setTab] = useState('users');
  const userSteps = [
    {
      icon: '📝',
      title: 'تصفح المحامين',
      desc: 'استعرض محامين موثّقين حسب التخصص، الخبرة، والتقييمات، الموقع، والسعر ثم تصفح ملفاتهم الشخصية بشفافية.',
    },
    {
      icon: '🎯',
      title: 'اختر الأنسب لحالتك',
      desc: 'قارن بين الخيارات المتاحة أمامك واختر الأنسب لحالتك بعد التصفح والمراجعة، مما يضمن لك اختيارًا مطمئنًا ومنطقيًا.',
    },
    {
      icon: '📅',
      title: 'احجز وادفع بأمان',
      desc: 'اختر موعدًا وأسلوب الاستشارة (مرئي أو صوتي) وادفع داخل التطبيق. لا مفاجآت في الأسعار.',
    },
    {
      icon: '💬',
      title: 'استشر وتابع قضيتك',
      desc: 'أجرِ الاستشارة عبر سَنَد وشارك مستنداتك وتابع تطورات استشارتك — كل ذلك في مكان واحد.',
    },
  ];
  const lawyerSteps = [
    {
      icon: '✅',
      title: 'أنشئ ملفًا شخصيًا موثّقًا',
      desc: 'سجّل ببيانات نقابة المحامين. فريقنا يراجع حسابك ويفعّله خلال 24 ساعة. خبرتك أخيرًا لها منصة.',
    },
    {
      icon: '⚙️',
      title: 'حدد مواعيدك وأتعابك',
      desc: 'أنت من يضبط ساعات عملك وتخصصاتك وأسعارك. تحكم كامل في كل تفاصيل عملك.',
    },
    {
      icon: '📥',
      title: 'استلم طلبات مؤهّلة',
      desc: 'كل عميل على سَنَد وصف قضيته وراجع بروفايلك ودفع مسبقًا. لا استفسارات عشوائية مضيعة للوقت.',
    },
    {
      icon: '💰',
      title: 'استشر واستلم أتعابك',
      desc: 'الأتعاب تُحوَّل تلقائيًا بعد كل استشارة مكتملة. لا ملاحقة للعملاء ولا محادثات محرجة بشأن المال.',
    },
  ];
  return (
    <section
      id="how-it-works"
      style={{
        padding: '96px 0',
        background: C.ink,
        position: 'relative',
        overflow: 'hidden',
        direction: 'rtl',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(rgba(212,206,196,.018) 1px,transparent 1px),
                         linear-gradient(90deg,rgba(212,206,196,.018) 1px,transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />
      <div
        style={{
          maxWidth: 'var(--max)',
          margin: '0 auto',
          padding: '0 24px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          className="reveal"
          style={{ textAlign: 'center', marginBottom: 14 }}
        >
          <Tag variant="dark">للجميع</Tag>
        </div>
        <h2
          className="reveal d1"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.85rem,3.5vw,2.8rem)',
            fontWeight: 700,
            color: C.sand,
            textAlign: 'center',
            lineHeight: 1.18,
            marginBottom: 16,
          }}
        >
          مبني لضمان{' '}
          <em style={{ fontStyle: 'italic', color: C.amber }}>
            تواصل قانوني بسيط
          </em>
        </h2>
        <p
          className="reveal d2"
          style={{
            fontSize: '1.03rem',
            color: C.stone,
            textAlign: 'center',
            maxWidth: 540,
            margin: '0 auto 44px',
            lineHeight: 1.8,
          }}
        >
          {' '}
          منصة واحدة للجانبان. سواء كنت تحتاج مساعدة قانونية أو تقدّمها — سَنَد
          تتعامل مع الطرفين بنفس الوضوح والكفاءة.
        </p>

        {/* تبويبات */}
        <div
          className="reveal d3"
          style={{
            display: 'flex',
            gap: 4,
            background: 'rgba(255,255,255,.06)',
            borderRadius: 9999,
            padding: 5,
            maxWidth: 300,
            margin: '0 auto 52px',
            direction: 'rtl',
          }}
        >
          {[
            ['users', 'للعملاء'],
            ['lawyers', 'للمحامين'],
          ].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setTab(val)}
              style={{
                flex: 1,
                padding: '10px 18px',
                borderRadius: 9999,
                border: 'none',
                background: tab === val ? C.amber : 'transparent',
                color: tab === val ? C.ink : C.stone,
                fontFamily: 'var(--font-body)',
                fontSize: '.88rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'var(--t)',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* بطاقات الخطوات - تم التعديل هنا */}
        <div
          className="two-col"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2,1fr)',
            gap: 16,
          }}
        >
          {(tab === 'users' ? userSteps : lawyerSteps).map((s, i) => (
            <div
              key={i + tab}
              className="how-it-card"
              style={{
                background: 'rgba(255,255,255,.04)',
                border: '1px solid rgba(212,206,196,.07)',
                borderRadius: 16,
                padding: '28px 24px',
                position: 'relative',
                overflow: 'hidden',
                // تفعيل الأنيميشن بناءً على الـ CSS Keyframes الموجودة في ملفك، مع تأخير متسلسل
                animation: `fadeUp 0.5s ${i * 0.1}s ease both`,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: -6,
                  left: 10,
                  fontFamily: 'var(--font-mono)',
                  fontSize: '4.5rem',
                  fontWeight: 700,
                  color: 'rgba(240,166,90,.045)',
                  lineHeight: 1,
                  pointerEvents: 'none',
                }}
              >
                0{i + 1}
              </div>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 11,
                  background: 'rgba(240,166,90,.11)',
                  border: '1px solid rgba(240,166,90,.18)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.3rem',
                  marginBottom: 18,
                }}
              >
                {s.icon}
              </div>
              <h4
                style={{
                  fontSize: '.97rem',
                  fontWeight: 700,
                  color: C.sand,
                  marginBottom: 9,
                }}
              >
                {s.title}
              </h4>
              <p
                style={{ fontSize: '.87rem', color: C.stone, lineHeight: 1.65 }}
              >
                {s.desc}
              </p>
            </div>
          ))}
        </div>

        <div
          className="reveal"
          style={{
            display: 'flex',
            gap: 12,
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginTop: 52,
          }}
        >
          <Btn variant="rust" onClick={onUser} style={{ padding: '13px 30px' }}>
            سجّل في قائمة الانتظار ←
          </Btn>
          <Btn
            variant="outlineLight"
            onClick={onLawyer}
            style={{ padding: '13px 30px' }}
          >
            سجّل كمحامٍ مؤسس ←
          </Btn>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  VALUE PROPS
// ═══════════════════════════════════════════════════════════════════
function ValueProps() {
  const uv = [
    {
      t: 'وضوح من أول خطوة',
      d: 'بدل الحيرة أو البحث العشوائي، تصفّح محامين متخصصين واختر من يناسبك مباشرة من أول خطوة.',
    },
    {
      t: 'أسعار معلنة وشفافة',
      d: 'اعرف تكلفة الاستشارة قبل تأكيد الحجز. لا رسوم خفية. لا مفاجآت في نهاية الجلسة.',
    },
    {
      t: 'بيانات اعتماد موثّقة',
      d: 'كل محامٍ على سَنَد قد تحقّق فريقنا من بيانات عضويته بالنقابة قبل ظهور ملفه الشخصي. مما يضمن كفاءة حقيقية، لا ادعاءات.',
    },
    {
      t: 'كل شيء في تطبيق واحد',
      d: 'الحجز والمكالمات والمستندات والمتابعة — كلها منظّمة في مكان واحد. لا فوضى على واتساب، لا رسائل ضائعة.',
    },
  ];
  const lv = [
    {
      t: 'عملاء جاهزون للتعامل',
      d: 'العملاء يصلون إليك بعد تصفّحهم لمحامين موثّقين واختيارك دونًا عنهم، مع استعداد واضح لبدء الاستشارة.',
    },
    {
      t: 'هوية رقمية موثّقة ومرئية',
      d: 'مؤهلاتك وخبراتك وتقييمات عملائك — متاحة وقابلة للبحث. خبرتك أخيرًا تُعرَض بالشكل الذي تستحقه.',
    },
    {
      t: 'تحصيل أتعاب تلقائي وآمن',
      d: 'العملاء يدفعون قبل كل جلسة. الأتعاب تُحوَّل إليك بعد الاكتمال تلقائيًا. لا ملاحقة ولا إحراج.',
    },
    {
      t: 'تحكم مهني كامل',
      d: 'أنت من يحدد أتعابك ومواعيدك وتخصصاتك. تقبل أو تعيد الجدولة أو ترفض أي طلب باستقلالية تامة.',
    },
  ];

  const CardItem = ({ t, d, dark }) => (
    <div style={{ display: 'flex', gap: 13 }}>
      <div
        style={{
          width: 23,
          height: 23,
          borderRadius: '50%',
          flexShrink: 0,
          marginTop: 2,
          background: dark ? 'rgba(240,166,90,.15)' : C.amberPale,
          color: dark ? C.amber : C.rust,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '.68rem',
          fontWeight: 700,
        }}
      >
        ✓
      </div>
      <div>
        <h5
          style={{
            fontSize: '.93rem',
            fontWeight: 700,
            marginBottom: 3,
            color: dark ? C.sand : C.ink,
          }}
        >
          {t}
        </h5>
        <p
          style={{
            fontSize: '.86rem',
            color: dark ? C.stone : C.slate,
            lineHeight: 1.6,
          }}
        >
          {d}
        </p>
      </div>
    </div>
  );

  return (
    <section
      style={{ padding: '96px 0', background: C.sandPale, direction: 'rtl' }}
    >
      <div
        style={{ maxWidth: 'var(--max)', margin: '0 auto', padding: '0 24px' }}
      >
        <div
          className="reveal"
          style={{ textAlign: 'center', marginBottom: 14 }}
        >
          <Tag>لماذا سَنَد؟</Tag>
        </div>
        <h2
          className="reveal d1"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.85rem,3.5vw,2.8rem)',
            fontWeight: 700,
            color: C.ink,
            textAlign: 'center',
            lineHeight: 1.18,
            marginBottom: 16,
          }}
        >
          قيمة حقيقية{' '}
          <em style={{ fontStyle: 'italic', color: C.rust }}>للجانبين معًا</em>
        </h2>
        <p
          className="reveal d2"
          style={{
            fontSize: '1.03rem',
            color: C.slate,
            textAlign: 'center',
            maxWidth: 540,
            margin: '0 auto 60px',
            lineHeight: 1.8,
          }}
        >
          سَنَد تُوازن مصالح العملاء والمحامين — تضمن احتياج العميل الصحيح وفرص
          عادلة للمحامي.
        </p>

        <div
          className="two-col"
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}
        >
          {/* بطاقة العملاء */}
          <div
            className="reveal"
            style={{
              background: C.white,
              borderRadius: 18,
              padding: '40px 36px',
              border: `1px solid ${C.sand}`,
            }}
          >
            <div
              style={{
                fontSize: '.7rem',
                fontWeight: 700,
                letterSpacing: '.08em',
                textTransform: 'uppercase',
                color: C.amber,
                fontFamily: 'var(--font-mono)',
                marginBottom: 14,
              }}
            >
              للعملاء
            </div>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.55rem',
                fontWeight: 700,
                color: C.ink,
                marginBottom: 28,
                lineHeight: 1.25,
              }}
            >
              توقف عن التخمين.
              <br />
              ابدأ بالحل.
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {uv.map((v, i) => (
                <CardItem key={i} t={v.t} d={v.d} />
              ))}
            </div>
          </div>
          {/* بطاقة المحامين */}
          <div
            className="reveal d2"
            style={{
              background: C.ink,
              borderRadius: 18,
              padding: '40px 36px',
              border: '1px solid rgba(212,206,196,.07)',
            }}
          >
            <div
              style={{
                fontSize: '.7rem',
                fontWeight: 700,
                letterSpacing: '.08em',
                textTransform: 'uppercase',
                color: C.amber,
                fontFamily: 'var(--font-mono)',
                marginBottom: 14,
              }}
            >
              للمحامين
            </div>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.55rem',
                fontWeight: 700,
                color: C.sand,
                marginBottom: 28,
                lineHeight: 1.25,
              }}
            >
              عملاء أفضل.
              <br />
              احتكاك أقل.
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {lv.map((v, i) => (
                <CardItem key={i} t={v.t} d={v.d} dark />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  FEATURES
// ═══════════════════════════════════════════════════════════════════
function Features() {
  const feats = [
    {
      icon: '📅',
      title: 'حجز ذكي',
      desc: 'احجز جلسات فيديو أو صوت في دقائق مع المحامي المناسب. أتمتة كاملة للمواعيد مع إمكانية إعادة الجدولة بنقرة واحدة.',
    },
    {
      icon: '🎯',
      title: 'تصفية دقيقة',
      desc: 'صفّ بحثك حسب التخصص القانوني والمحافظة والأتعاب وسنوات الخبرة والتقييم. ابحث بذكاء، لا بالصدفة.',
    },
    {
      icon: '🔒',
      title: 'تواصل آمن ومشفّر',
      desc: 'مكالمات الفيديو والصوت والرسائل — كلها مشفّرة وداخل سَنَد. رقمك الشخصي لا يُشارَك أبدًا مع أي محامٍ.',
    },
    {
      icon: '📂',
      title: 'مشاركة المستندات',
      desc: 'ارفع وشارك مستنداتك القانونية مباشرةً عبر المنصة. مشفّرة ومتاحة لك وللمحامي فقط، دون أي وسيط.',
    },
    {
      icon: '⭐',
      title: 'تقييمات موثّقة',
      desc: 'التقييمات من عملاء أكملوا استشارات مدفوعة حصرًا. لا آراء مجهولة. لا تقييمات مزوّرة. ثقة حقيقية.',
    },
    {
      icon: '🏛️',
      title: 'توثيق من النقابة',
      desc: 'كل محامٍ يتحقق فريقنا يدويًا من بيانات قيده في النقابة قبل تفعيل حسابه. لا استثناءات، لا تساهل.',
    },
  ];
  return (
    <section
      id="features"
      style={{ padding: '96px 0', background: C.sandLight, direction: 'rtl' }}
    >
      <div
        style={{ maxWidth: 'var(--max)', margin: '0 auto', padding: '0 24px' }}
      >
        <div
          className="reveal"
          style={{ textAlign: 'center', marginBottom: 14 }}
        >
          <Tag variant="ink">ميزات المنصة</Tag>
        </div>
        <h2
          className="reveal d1"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.85rem,3.5vw,2.8rem)',
            fontWeight: 700,
            color: C.ink,
            textAlign: 'center',
            lineHeight: 1.18,
            marginBottom: 16,
          }}
        >
          كل ما تحتاجه{' '}
          <em style={{ fontStyle: 'italic', color: C.rust }}>في منصة واحدة</em>
        </h2>
        <p
          className="reveal d2"
          style={{
            fontSize: '1.03rem',
            color: C.slate,
            textAlign: 'center',
            maxWidth: 540,
            margin: '0 auto 60px',
            lineHeight: 1.8,
          }}
        >
          ليست مجرد دليل محامين. منظومة تنسيق قانوني متكاملة مبنية حول الوصول
          إلى نتائج.
        </p>

        <div
          className="three-col"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3,1fr)',
            gap: 18,
          }}
        >
          {feats.map((f, i) => (
            <div
              key={i}
              className={`reveal d${(i % 3) + 1}`}
              style={{
                background: C.white,
                borderRadius: 16,
                padding: '32px 26px',
                border: `1px solid ${C.sand}`,
                transition: 'var(--t)',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = C.amber;
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = `0 18px 44px rgba(30,45,58,.11)`;
                e.currentTarget.querySelector('.fi').style.background = C.ink;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = C.sand;
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.querySelector('.fi').style.background =
                  C.amberPale;
              }}
            >
              <div
                className="fi"
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 12,
                  background: C.amberPale,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.35rem',
                  marginBottom: 20,
                  transition: 'var(--t)',
                }}
              >
                {f.icon}
              </div>
              <h4
                style={{
                  fontSize: '.97rem',
                  fontWeight: 700,
                  color: C.ink,
                  marginBottom: 9,
                }}
              >
                {f.title}
              </h4>
              <p
                style={{ fontSize: '.88rem', color: C.slate, lineHeight: 1.65 }}
              >
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  TRUST (Optimized)
// ═══════════════════════════════════════════════════════════════════
function Trust() {
  const cards = [
    {
      icon: '🏛️',
      title: 'توثيق من النقابة',
      desc: 'كل بيانات القيد تُراجَع يدويًا قبل تفعيل أي حساب. لا استثناءات، لا ادعاءات غير موثّقة.',
    },
    {
      icon: '💳',
      title: 'حماية كاملة للمدفوعات',
      desc: 'العملاء يدفعون قبل الجلسات. الأتعاب تُحوَّل تلقائيًا بعد الاكتمال. لا نقد ولا التباس.',
    },
    {
      icon: '🔐',
      title: 'سرية مضمونة',
      desc: 'كل الاتصالات والمستندات مشفّرة. شؤونك القانونية لا يطّلع عليها إلا المحامي الذي اخترته.',
    },
    {
      icon: '⚖️',
      title: 'تقييمات حقيقية فقط',
      desc: 'التقييمات تتطلب استشارة مكتملة مدفوعة. لا آراء مجهولة. لا تلاعب. سمعة حقيقية يُبنى عليها.',
    },
    {
      icon: '🛡️',
      title: 'حماية بيانات شخصية',
      desc: 'سَنَد ملتزمة بقانون حماية البيانات الشخصية المصري رقم 151 لسنة 2020. بياناتك ملك لك وحدك.',
    },
    {
      icon: '📋',
      title: 'شروط شفافة دائمًا',
      desc: 'لا رسوم خفية. لا عقود مُقيِّدة. أسعار واضحة للعملاء وعمولات واضحة للمحامين — كل شيء مكتوب.',
    },
  ];

  return (
    <section
      id="trust"
      style={{
        padding: '96px 0',
        background: C.ink,
        position: 'relative',
        overflow: 'hidden',
        direction: 'rtl',
      }}
    >
      {/* Background Glow */}
      <div
        style={{
          position: 'absolute',
          bottom: -90,
          left: -90,
          width: 460,
          height: 460,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${C.rust}09, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          maxWidth: 'var(--max)',
          margin: '0 auto',
          padding: '0 24px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 14 }}>
          <Tag variant="dark">لماذا تثق بسَنَد؟</Tag>
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.85rem,3.5vw,2.8rem)',
            fontWeight: 700,
            color: C.sand,
            textAlign: 'center',
            lineHeight: 1.18,
            marginBottom: 16,
          }}
        >
          ثقة مبنية على{' '}
          <em style={{ fontStyle: 'italic', color: C.amber }}>
            الأفعال لا الكلام
          </em>
        </h2>

        <p
          style={{
            fontSize: '1.03rem',
            color: C.stone,
            textAlign: 'center',
            maxWidth: 540,
            margin: '0 auto 60px',
            lineHeight: 1.8,
          }}
        >
          الثقة لا تُدّعى، تُكتسب من خلال البنية والشفافية والاتساق. هذا كيف
          تكسبها سَنَد.
        </p>

        {/* الكروت باستخدام CSS Classes بدلاً من JS Hovers */}
        <div
          className="three-col"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 18,
            marginBottom: 44,
          }}
        >
          {cards.map((c, i) => (
            <div
              key={i}
              className="trust-card"
              style={{
                borderRadius: 16,
                padding: '28px 22px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '1.9rem', marginBottom: 14 }}>
                {c.icon}
              </div>
              <h4
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: C.sand,
                  marginBottom: 9,
                }}
              >
                {c.title}
              </h4>
              <p
                style={{ fontSize: '.87rem', color: C.stone, lineHeight: 1.65 }}
              >
                {c.desc}
              </p>
            </div>
          ))}
        </div>

        {/* إخلاء المسؤولية */}
        <div
          style={{
            padding: '24px 32px',
            background: 'rgba(255,255,255,.025)',
            border: '1px solid rgba(212,206,196,.055)',
            borderRadius: 14,
            textAlign: 'center',
          }}
        >
          <p
            style={{
              fontSize: '.88rem',
              color: 'rgba(212,206,196,.38)',
              lineHeight: 1.8,
            }}
          >
            <strong style={{ color: 'rgba(212,206,196,.6)' }}>
              تنبيه مهم:
            </strong>{' '}
            سَنَد منصة تكنولوجية لتيسير التواصل بين العملاء والمحامين المستقلين.
            سَنَد{' '}
            <strong style={{ color: 'rgba(212,206,196,.6)' }}>
              ليست مكتب محاماة
            </strong>{' '}
            ولا تقدّم استشارات قانونية بأي شكل.
          </p>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  EARLY ACCESS
// ═══════════════════════════════════════════════════════════════════
function EarlyAccess({ onUser, onLawyer }) {
  return (
    <section
      id="early"
      style={{
        padding: '96px 0',
        background: `linear-gradient(135deg, ${C.sandLight} 0%, ${C.sand} 100%)`,
        position: 'relative',
        overflow: 'hidden',
        direction: 'rtl',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -60,
          right: -60,
          width: 260,
          height: 260,
          borderRadius: '50%',
          border: `2px solid ${C.stone}18`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -80,
          left: -80,
          width: 360,
          height: 360,
          borderRadius: '50%',
          border: `1px solid ${C.stone}12`,
        }}
      />
      <div
        style={{
          maxWidth: 680,
          margin: '0 auto',
          padding: '0 24px',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div className="reveal" style={{ marginBottom: 22 }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(164,81,54,.1)',
              border: '1px solid rgba(164,81,54,.22)',
              color: C.rust,
              padding: '5px 16px',
              borderRadius: 9999,
              fontSize: '.7rem',
              fontWeight: 700,
              letterSpacing: '.07em',
              fontFamily: 'var(--font-mono)',
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: C.rust,
                animation: 'pulse 2s infinite',
              }}
            />
            🚀 الوصول المبكر — مفتوح الآن
          </span>
        </div>
        <h2
          className="reveal d1"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.9rem,4vw,2.9rem)',
            fontWeight: 700,
            color: C.ink,
            lineHeight: 1.18,
            marginBottom: 16,
          }}
        >
          كن من الأوائل.
          <br />
          شارك في بناء سَنَد.
        </h2>
        <p
          className="reveal d2"
          style={{
            fontSize: '1.03rem',
            color: C.slate,
            lineHeight: 1.8,
            marginBottom: 44,
          }}
        >
          انضم في مرحلتنا التأسيسية واحصل على مزايا حصرية لن تتوفر بعد الإطلاق
          الرسمي.
        </p>

        <div
          className="two-col reveal d3"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 16,
            marginBottom: 40,
            textAlign: 'right',
          }}
        >
          {[
            {
              label: 'للعملاء',
              title: 'وصول مبكر مميّز',
              desc: 'انضم إلى قائمة الانتظار وكن من أوائل من يصلون إلى محامين موثّقين ومتخصصين عبر منصة منظّمة وشفافة.',
            },
            {
              label: 'للمحامين',
              title: 'عمولة 5% للأشهر الثلاثة الأولى',
              desc: 'أول 40 محامٍ يسجّلون يحصلون على عمولة مخفضة 5% لثلاثة أشهر، وشارة المؤسس، وأولوية الظهور في نتائج البحث.',
            },
          ].map((c, i) => (
            <div
              key={i}
              style={{
                background: C.white,
                borderRadius: 10,
                padding: '26px 22px',
                border: `1px solid ${C.sand}`,
                boxShadow: '0 4px 18px rgba(30,45,58,.05)',
              }}
            >
              <div
                style={{
                  fontSize: '.7rem',
                  fontWeight: 700,
                  letterSpacing: '.08em',
                  textTransform: 'uppercase',
                  color: C.amber,
                  fontFamily: 'var(--font-mono)',
                  marginBottom: 9,
                }}
              >
                {c.label}
              </div>
              <h4
                style={{
                  fontSize: '.96rem',
                  fontWeight: 700,
                  color: C.ink,
                  marginBottom: 8,
                  lineHeight: 1.3,
                }}
              >
                {c.title}
              </h4>
              <p
                style={{ fontSize: '.85rem', color: C.slate, lineHeight: 1.65 }}
              >
                {c.desc}
              </p>
            </div>
          ))}
        </div>

        <div
          className="reveal d4"
          style={{
            display: 'flex',
            gap: 12,
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Btn variant="rust" onClick={onUser} style={{ padding: '14px 32px' }}>
            انضم إلى قائمة الانتظار ←
          </Btn>
          <Btn
            variant="outline"
            onClick={onLawyer}
            style={{ padding: '14px 32px' }}
          >
            سجّل كمحامٍ مؤسس ←
          </Btn>
        </div>
        <p
          className="reveal d5"
          style={{
            marginTop: 16,
            fontSize: '.76rem',
            color: C.stone,
            fontFamily: 'var(--font-mono)',
          }}
        >
          التسجيل مجاني · لا حاجة لبطاقة بنكية · محامون موثّقون من النقابة
        </p>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  FAQ
// ═══════════════════════════════════════════════════════════════════
function FAQ() {
  const [open, setOpen] = useState(null);
  const faqs = [
    {
      q: 'هل التسجيل في سَنَد مجاني؟',
      a: 'نعم، التسجيل مجاني تمامًا لكل من العملاء والمحامين. العملاء يدفعون فقط مقابل الاستشارات التي يحجزونها، والأتعاب يحددها المحامي وتظهر بوضوح قبل تأكيد الحجز. أما المحامون، فيدفعون عمولة منصة صغيرة فقط عند اكتمال الاستشارة وتحصيل الأتعاب — لا شيء قبل ذلك.',
    },
    {
      q: 'كيف أختار المحامي المناسب لقضيتي؟',
      a: 'نظام التصفية في سَنَد يساعدك على الوصول للمحامي المناسب حسب التخصص القانوني والمحافظة وسعر الاستشارة وسنوات الخبرة والتقييم. كل بروفايل يعرض درجة قيد المحامي بالنقابة ومؤهلاته الأكاديمية وخبراته وتقييمات عملاء حقيقيين — كل ذلك قبل أن تضغط على حجز.',
    },
    {
      q: 'هل سَنَد تقدم استشارات قانونية؟',
      a: 'لا. سَنَد لا تقدم استشارات قانونية بأي شكل. نحن منصة تكنولوجية تربط العملاء بمحامين مرخّصين مستقلين. كل المشورة والخدمات القانونية تُقدَّم حصريًا من قِبَل المحامي الذي تختاره، وهو المسؤول مهنيًا بالكامل عن عمله وفق قانون المهنة.',
    },
    {
      q: 'كيف يحصل المحامون على أتعابهم؟',
      a: 'يدفع العملاء أتعاب الاستشارة مسبقًا عند الحجز عبر بطاقة بنكية أو فوري أو فودافون كاش أو إنستاباي. بعد اكتمال الاستشارة، تُحوَّل الأتعاب تلقائيًا للمحامي بعد خصم عمولة سَنَد. المحامون المؤسسون (أول 40) يدفعون عمولة مخفضة 5% للأشهر الثلاثة الأولى فقط، ثم العمولة القياسية بعد ذلك.',
    },
    {
      q: 'ماذا يحدث إذا ألغى المحامي الجلسة أو لم يحضر؟',
      a: 'إذا ألغى المحامي الاستشارة أو رفض الطلب أو لم يحضر في موعده، تحصل على استرداد تلقائي كامل إلى وسيلة الدفع الأصلية خلال 5 إلى 10 أيام عمل. كل حوادث الغياب تُسجَّل وتُراجَع ضمن آليات ضبط الجودة في المنصة.',
    },
    {
      q: 'هل بياناتي ومحادثاتي خاصة ومحفوظة؟',
      a: 'نعم بالكامل. كل البيانات مشفّرة أثناء النقل (TLS 1.3) وعند التخزين (AES-256). رقم هاتفك الشخصي لا يُشارَك أبدًا مع المحامين. المستندات متاحة فقط لك وللمحامي المرتبط بقضيتك. سَنَد ملتزمة بقانون حماية البيانات الشخصية المصري رقم 151 لسنة 2020.',
    },
    {
      q: 'هل يمكنني الغاء الاستشارة بعد الحجز؟',
      a: 'نعم، يمكنك الإلغاء قبل موعد الجلسة بأكثر من 24 ساعة مع استرداد كافة الرسوم. أما إذا تم الإلغاء خلال أقل من 24 ساعة من الموعد، يتم خصم 50% من قيمة الاستشارة.',
    },
  ];
  return (
    <section
      id="faq"
      style={{ padding: '96px 0', background: C.sandPale, direction: 'rtl' }}
    >
      <div
        style={{ maxWidth: 'var(--max)', margin: '0 auto', padding: '0 24px' }}
      >
        <div
          className="reveal"
          style={{ textAlign: 'center', marginBottom: 14 }}
        >
          <Tag>الأسئلة الشائعة</Tag>
        </div>
        <h2
          className="reveal d1"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.85rem,3.5vw,2.8rem)',
            fontWeight: 700,
            color: C.ink,
            textAlign: 'center',
            lineHeight: 1.18,
            marginBottom: 16,
          }}
        >
          كل سؤال في ذهنك{' '}
          <em style={{ fontStyle: 'italic', color: C.rust }}>الآن</em>
        </h2>
        <p
          className="reveal d2"
          style={{
            fontSize: '1.03rem',
            color: C.slate,
            textAlign: 'center',
            maxWidth: 520,
            margin: '0 auto 52px',
            lineHeight: 1.8,
          }}
        >
          إجابات مباشرة وواضحة. بلا تعقيد.
        </p>

        <div style={{ maxWidth: 740, margin: '0 auto' }}>
          {faqs.map((f, i) => (
            <div
              key={i}
              className="reveal"
              style={{
                borderRadius: 10,
                overflow: 'hidden',
                marginBottom: 8,
                border: `1.5px solid ${open === i ? C.amber : C.sand}`,
                transition: 'border-color .25s ease',
              }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 14,
                  padding: '18px 24px',
                  background: open === i ? C.ink : C.white,
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'right',
                  fontFamily: 'var(--font-body)',
                  fontSize: '.97rem',
                  fontWeight: 600,
                  color: open === i ? C.sand : C.ink,
                  transition: 'var(--t)',
                  direction: 'rtl',
                }}
              >
                <span style={{ flex: 1, textAlign: 'right' }}>{f.q}</span>
                <span
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    border: '2px solid currentColor',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: '.65rem',
                    transform: open === i ? 'rotate(180deg)' : 'none',
                    transition: 'transform .28s ease',
                  }}
                >
                  ▼
                </span>
              </button>
              {open === i && (
                <div
                  style={{
                    padding: '16px 24px 20px',
                    background: C.sandPale,
                    borderTop: `1px solid ${C.sand}`,
                    animation: 'fadeDown .26s ease both',
                    direction: 'rtl',
                    textAlign: 'right',
                  }}
                >
                  <p
                    style={{
                      fontSize: '.93rem',
                      color: C.slate,
                      lineHeight: 1.82,
                    }}
                  >
                    {f.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  FINAL CTA
// ═══════════════════════════════════════════════════════════════════
function FinalCTA({ onUser, onLawyer }) {
  return (
    <section
      style={{
        padding: '112px 0',
        background: `linear-gradient(160deg, ${C.ink} 0%, ${C.inkMid} 45%, ${C.slate} 100%)`,
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
        direction: 'rtl',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(rgba(212,206,196,.018) 1px,transparent 1px),
                         linear-gradient(90deg,rgba(212,206,196,.018) 1px,transparent 1px)`,
          backgroundSize: '42px 42px',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          width: 750,
          height: 750,
          borderRadius: '50%',
          border: '1px solid rgba(240,166,90,.05)',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 85,
            borderRadius: '50%',
            border: '1px solid rgba(212,206,196,.028)',
          }}
        />
      </div>

      <div
        style={{
          maxWidth: 720,
          margin: '0 auto',
          padding: '0 24px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div className="reveal" style={{ marginBottom: 22 }}>
          <Tag variant="dark">خطوتك التالية</Tag>
        </div>
        <h2
          className="reveal d1"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem,5vw,3.6rem)',
            fontWeight: 900,
            color: C.sand,
            lineHeight: 1.1,
            marginBottom: 18,
          }}
        >
          حلك القانوني في{' '}
          <em
            style={{
              fontStyle: 'italic',
              color: 'transparent',
              backgroundImage: `linear-gradient(135deg, ${C.amber}, ${C.rust})`,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
            }}
          >
            خطوة واحدة الآن
          </em>
        </h2>
        <p
          className="reveal d2"
          style={{
            fontSize: '1.08rem',
            color: 'rgba(212,206,196,.62)',
            marginBottom: 48,
            lineHeight: 1.85,
            maxWidth: 540,
            margin: '0 auto 48px',
          }}
        >
          سَنَد تمنحك البنية والأدوات والأشخاص المناسبين لتحقيق ذلك — سواء كنت
          تبحث عن حل قانوني أو تبني ممارستك القانونية رقميًا.
        </p>
        <div
          className="reveal d3"
          style={{
            display: 'flex',
            gap: 14,
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: 36,
          }}
        >
          <Btn
            variant="rust"
            onClick={onUser}
            style={{ padding: '16px 36px', fontSize: '1.02rem' }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              style={{ flexShrink: 0 }}
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            أحتاج مساعدة قانونية
          </Btn>
          <Btn
            variant="ghost"
            onClick={onLawyer}
            style={{ padding: '16px 36px', fontSize: '1.02rem' }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              style={{ flexShrink: 0 }}
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            انضم كمحامٍ مؤسس
          </Btn>
        </div>
        <p
          className="reveal d4"
          style={{
            fontSize: '.78rem',
            color: 'rgba(212,206,196,.28)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          التسجيل مجاني · لا بطاقة بنكية · محامون موثّقون · عربي وإنجليزي
        </p>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  FOOTER — روابط حقيقية فقط + سوشيال ميديا
// ═══════════════════════════════════════════════════════════════════
function Footer({ onUser, onLawyer }) {
  // روابط Footer الحقيقية — كلها تؤدي إلى أنكر أو صفحات موجودة
  const navLinks = [
    { label: 'كيف يعمل', href: '#how-it-works' },
    { label: 'ميزات المنصة', href: '#features' },
    { label: 'لماذا سَنَد', href: '#trust' },
    { label: 'الأسئلة الشائعة', href: '#faq' },
  ];
  const lawyerLinks = [
    { label: 'انضم كمحامٍ', action: onLawyer },
    { label: 'برنامج المؤسسين', href: '#early' },
  ];
  const companyLinks = [
    { label: 'عن سَنَد', href: '#problem' },
    { label: 'تواصل معنا', href: `mailto:hello@sanad.app` },
    { label: 'سياسة الخصوصية', href: '/privacy' }, // صفحة منفصلة
    { label: 'الشروط والأحكام', href: '/terms' }, // صفحة منفصلة
  ];

  const SocialIcon = ({ href, label, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={label}
      style={{
        width: 36,
        height: 36,
        borderRadius: '50%',
        background: 'rgba(255,255,255,.06)',
        border: '1px solid rgba(212,206,196,.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'rgba(212,206,196,.45)',
        fontSize: '.8rem',
        textDecoration: 'none',
        transition: 'var(--t)',
        fontFamily: 'var(--font-mono)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = `${C.amber}1E`;
        e.currentTarget.style.color = C.amber;
        e.currentTarget.style.borderColor = `${C.amber}40`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,.06)';
        e.currentTarget.style.color = 'rgba(212,206,196,.45)';
        e.currentTarget.style.borderColor = 'rgba(212,206,196,.1)';
      }}
    >
      {children}
    </a>
  );

  const ColLink = ({ label, href, action }) => {
    const s = {
      display: 'block',
      fontSize: '.87rem',
      color: 'rgba(212,206,196,.45)',
      marginBottom: 10,
      textDecoration: 'none',
      transition: 'color .2s',
      cursor: 'pointer',
      background: 'none',
      border: 'none',
      textAlign: 'right',
      width: '100%',
      fontFamily: 'var(--font-body)',
    };
    if (action)
      return (
        <button
          style={s}
          onClick={action}
          onMouseEnter={(e) => (e.currentTarget.style.color = C.sand)}
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = 'rgba(212,206,196,.45)')
          }
        >
          {label}
        </button>
      );
    return (
      <a
        href={href}
        style={s}
        onMouseEnter={(e) => (e.currentTarget.style.color = C.sand)}
        onMouseLeave={(e) =>
          (e.currentTarget.style.color = 'rgba(212,206,196,.45)')
        }
      >
        {label}
      </a>
    );
  };

  return (
    <footer
      style={{
        background: C.ink,
        borderTop: '1px solid rgba(212,206,196,.05)',
        padding: '52px 0 24px',
        direction: 'rtl',
      }}
    >
      <div
        style={{ maxWidth: 'var(--max)', margin: '0 auto', padding: '0 24px' }}
      >
        {/* صف رئيسي */}
        <div
          className="footer-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr',
            gap: 36,
            marginBottom: 44,
          }}
        >
          {/* العمود الأول — براند */}
          <div>
            <div
              className="logo-text"
              style={{
                fontSize: '1.9rem',
                fontWeight: 900,
                color: C.sand,
                marginBottom: 6,
                lineHeight: 1,
              }}
            >
              سند
            </div>
            <p
              style={{
                fontSize: '.82rem',
                fontFamily: 'var(--font-display)',
                color: C.amber,
                fontStyle: 'italic',
                marginBottom: 14,
                opacity: 0.8,
              }}
            >
              سندك في كل خطوة قانونية
            </p>
            <p
              style={{
                fontSize: '.87rem',
                color: 'rgba(212,206,196,.38)',
                lineHeight: 1.72,
                marginBottom: 22,
                maxWidth: 240,
              }}
            >
              أول منصة مصرية لرحلة النتائج القانونية. نربطك بالمساعدة القانونية
              الصحيحة — بوضوح، وعدالة، ورقمية.
            </p>
            {/* روابط السوشيال ميديا */}
            <div style={{ marginBottom: 10 }}>
              <p
                style={{
                  fontSize: '.7rem',
                  fontWeight: 700,
                  letterSpacing: '.08em',
                  color: C.amber,
                  fontFamily: 'var(--font-mono)',
                  marginBottom: 12,
                  textTransform: 'uppercase',
                }}
              >
                تابعنا
              </p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <SocialIcon href={SOCIAL.instagram} label="إنستغرام">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </SocialIcon>
                <SocialIcon href={SOCIAL.facebook} label="فيسبوك">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </SocialIcon>
                <SocialIcon href={SOCIAL.linkedin} label="لينكدإن">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </SocialIcon>
                <SocialIcon href={SOCIAL.whatsapp} label="واتساب">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                </SocialIcon>
                <SocialIcon href={SOCIAL.twitter} label="تويتر/X">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </SocialIcon>
              </div>
            </div>
          </div>

          {/* روابط التنقل */}
          <div>
            <h5
              style={{
                fontSize: '.7rem',
                fontWeight: 700,
                letterSpacing: '.08em',
                textTransform: 'uppercase',
                color: C.amber,
                marginBottom: 16,
                fontFamily: 'var(--font-mono)',
              }}
            >
              المنصة
            </h5>
            {navLinks.map((l) => (
              <ColLink key={l.label} label={l.label} href={l.href} />
            ))}
          </div>

          {/* للمحامين */}
          <div>
            <h5
              style={{
                fontSize: '.7rem',
                fontWeight: 700,
                letterSpacing: '.08em',
                textTransform: 'uppercase',
                color: C.amber,
                marginBottom: 16,
                fontFamily: 'var(--font-mono)',
              }}
            >
              للمحامين
            </h5>
            {lawyerLinks.map((l) => (
              <ColLink
                key={l.label}
                label={l.label}
                href={l.href}
                action={l.action}
              />
            ))}
          </div>

          {/* الشركة */}
          <div>
            <h5
              style={{
                fontSize: '.7rem',
                fontWeight: 700,
                letterSpacing: '.08em',
                textTransform: 'uppercase',
                color: C.amber,
                marginBottom: 16,
                fontFamily: 'var(--font-mono)',
              }}
            >
              الشركة
            </h5>
            {companyLinks.map((l) => (
              <ColLink key={l.label} label={l.label} href={l.href} />
            ))}
          </div>
        </div>

        {/* الحاشية */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 14,
            paddingTop: 20,
            borderTop: '1px solid rgba(212,206,196,.05)',
          }}
        >
          <p style={{ fontSize: '.8rem', color: 'rgba(212,206,196,.28)' }}>
            © 2026 سَنَد. جميع الحقوق محفوظة.
          </p>
          <p
            style={{
              fontSize: '.76rem',
              color: 'rgba(212,206,196,.18)',
              maxWidth: 460,
              textAlign: 'left',
            }}
          >
            سَنَد منصة تكنولوجية وليست مكتب محاماة. لا تقدم استشارات قانونية.
            جميع الخدمات يقدمها محامون مستقلون مرخّصون.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  ROOT PAGE
// ═══════════════════════════════════════════════════════════════════
export default function SanadAR() {
  const [userOpen, setUserOpen] = useState(false);
  const [lawyerOpen, setLawyerOpen] = useState(false);

  useEffect(() => {
    const id = 'sanad-global';
    if (!document.getElementById(id)) {
      const s = document.createElement('style');
      s.id = id;
      s.textContent = GLOBAL_CSS;
      document.head.appendChild(s);
    }
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'ar');
    return () => {
      const el = document.getElementById(id);
      if (el) el.remove();
      document.documentElement.removeAttribute('dir');
    };
  }, []);

  useReveal();

  const ou = () => setUserOpen(true);
  const ol = () => setLawyerOpen(true);

  return (
    <>
      {/* Modal: قائمة الانتظار */}
      <Modal
        open={userOpen}
        onClose={() => setUserOpen(false)}
        title="انضم إلى قائمة انتظار سَنَد"
        subtitle="سنُبلّغك فور الإطلاق. كن من أوائل من يصلون إلى محامين موثّقين ومتخصصين في مصر."
      >
        <UserForm onClose={() => setUserOpen(false)} />
      </Modal>

      {/* Modal: تسجيل المحامين */}
      <Modal
        open={lawyerOpen}
        onClose={() => setLawyerOpen(false)}
        title="سجّل كمحامٍ مؤسس"
        subtitle="أول 100 محامٍ يحصلون على عمولة 10% فقط للأشهر الثلاثة الأولى، وشارة المؤسس، وأولوية الظهور في نتائج البحث."
      >
        <LawyerForm onClose={() => setLawyerOpen(false)} />
      </Modal>

      {/* الصفحة */}
      <Nav onUser={ou} onLawyer={ol} />
      <Hero onUser={ou} onLawyer={ol} />
      <Problem />
      <Solution />
      <HowItWorks onUser={ou} onLawyer={ol} />
      <ValueProps />
      <Features />
      <Trust />
      <EarlyAccess onUser={ou} onLawyer={ol} />
      <FAQ />
      <FinalCTA onUser={ou} onLawyer={ol} />
      <Footer onUser={ou} onLawyer={ol} />
    </>
  );
}
