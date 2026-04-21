'use client';

import { useState, useEffect, useRef } from 'react';

// ─── FONT NOTE ──────────────────────────────────────────────────────────────
// In your Next.js project add to app/layout.js:
//   import { Fira_Mono, Almarai } from 'next/font/google';
//   Palestine font: add @font-face in globals.css pointing to /public/fonts/Palestine-*.woff2
// ────────────────────────────────────────────────────────────────────────────

// ─── DESIGN TOKENS ─────────────────────────────────────────────────────────
const C = {
  sand:    '#D4CEC4',
  stone:   '#B8AE9F',
  slate:   '#35465A',
  amber:   '#F0A65A',
  rust:    '#A45136',
  ink:     '#1E2D3A',
  sandLight: '#EDE9E2',
  sandPale:  '#F7F4EF',
  amberPale: '#FDF3E8',
  rustPale:  '#F9ECE8',
  inkFade:   'rgba(30,45,58,0.06)',
  white:     '#FFFFFF',
};

// ─── GLOBAL STYLES (injected once) ─────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fira+Mono:wght@400;500;700&family=Almarai:wght@300;400;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --sand: #D4CEC4; --stone: #B8AE9F; --slate: #35465A;
    --amber: #F0A65A; --rust: #A45136; --ink: #1E2D3A;
    --sand-light: #EDE9E2; --sand-pale: #F7F4EF;
    --amber-pale: #FDF3E8; --rust-pale: #F9ECE8;
    --font-mono: 'Fira Mono', monospace;
    --font-arabic: 'Almarai', sans-serif;
    --font-display: 'Palestine', 'Almarai', serif;
    --r: 10px; --r-lg: 18px; --r-full: 9999px;
    --shadow: 0 6px 32px rgba(30,45,58,.10);
    --shadow-lg: 0 16px 56px rgba(30,45,58,.16);
    --t: all .3s cubic-bezier(.4,0,.2,1);
  }

  html { scroll-behavior: smooth; font-size: 16px; overflow-x: hidden; }
  body { font-family: var(--font-arabic); background: var(--sand-pale);
         color: var(--ink); line-height: 1.65; overflow-x: hidden; }
  ::selection { background: var(--amber); color: var(--ink); }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: var(--sand-light); }
  ::-webkit-scrollbar-thumb { background: var(--amber); border-radius: 3px; }

  @keyframes fadeUp   { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:none; } }
  @keyframes fadeDown { from { opacity:0; transform:translateY(-16px); } to { opacity:1; transform:none; } }
  @keyframes spin     { to { transform: rotate(360deg); } }
  @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:.35} }
  @keyframes drift    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
  @keyframes slideIn  { from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:none} }
  @keyframes modalIn  { from{opacity:0;transform:scale(.96) translateY(20px)} to{opacity:1;transform:none} }

  .reveal { opacity:0; transform:translateY(28px); transition: opacity .65s cubic-bezier(.4,0,.2,1), transform .65s cubic-bezier(.4,0,.2,1); }
  .reveal.vis { opacity:1; transform:none; }
  .d1{transition-delay:.08s} .d2{transition-delay:.16s} .d3{transition-delay:.24s}
  .d4{transition-delay:.32s} .d5{transition-delay:.40s} .d6{transition-delay:.48s}
`;

// ─── REUSABLE ATOMS ─────────────────────────────────────────────────────────
function Tag({ children, variant = 'amber' }) {
  const bg = variant === 'amber' ? C.amberPale : variant === 'ink' ? C.inkFade : C.rustPale;
  const col = variant === 'amber' ? C.rust : variant === 'ink' ? C.slate : C.rust;
  return (
    <span style={{
      display:'inline-flex',alignItems:'center',gap:6,
      padding:'5px 14px',borderRadius:C.r_full,
      background:bg,color:col,
      fontSize:'.72rem',fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',
      fontFamily:'var(--font-mono)',
    }}>{children}</span>
  );
}

function Btn({ children, variant = 'primary', onClick, type = 'button', fullWidth, disabled, style = {} }) {
  const base = {
    display:'inline-flex',alignItems:'center',justifyContent:'center',gap:8,
    padding:'14px 30px',borderRadius:C.r_full,fontSize:'1rem',fontWeight:700,
    cursor: disabled ? 'not-allowed' : 'pointer',border:'none',
    fontFamily:'var(--font-arabic)',transition:'var(--t)',
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled ? .6 : 1,
  };
  const variants = {
    primary: { background:C.amber, color:C.ink, boxShadow:'0 4px 20px rgba(240,166,90,.3)' },
    secondary: { background:C.ink, color:C.sand },
    outline: { background:'transparent', color:C.ink, border:`2px solid ${C.stone}` },
    outlineLight: { background:'transparent', color:C.sand, border:`2px solid rgba(212,206,196,.35)` },
    rust: { background:C.rust, color:C.white, boxShadow:'0 4px 20px rgba(164,81,54,.25)' },
    ghost: { background:'rgba(212,206,196,.1)', color:C.sand, border:'1px solid rgba(212,206,196,.2)' },
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{ ...base, ...variants[variant], ...style }}
      onMouseEnter={e => { if(!disabled) e.currentTarget.style.transform='translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform='none'; }}
    >{children}</button>
  );
}

function Input({ label, name, type='text', placeholder, value, onChange, required, options, multiline, helper }) {
  const inputStyle = {
    width:'100%',padding:'13px 16px',
    borderRadius:C.r,border:`1.5px solid ${C.sand}`,
    background:C.white,color:C.ink,fontSize:'.95rem',
    fontFamily:'var(--font-arabic)',transition:'var(--t)',
    outline:'none',resize: multiline ? 'vertical' : 'none',
    minHeight: multiline ? 100 : 'auto',
  };
  return (
    <div style={{ marginBottom:20 }}>
      <label style={{ display:'block',fontSize:'.82rem',fontWeight:700,color:C.slate,
                      marginBottom:7,fontFamily:'var(--font-mono)',letterSpacing:'.05em' }}>
        {label}{required && <span style={{color:C.rust,marginLeft:3}}>*</span>}
      </label>
      {options ? (
        <select name={name} value={value} onChange={onChange} required={required}
          style={{...inputStyle,cursor:'pointer',appearance:'none'}}>
          <option value="">— Select —</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : multiline ? (
        <textarea name={name} value={value} onChange={onChange} placeholder={placeholder}
          required={required} style={inputStyle} rows={4}/>
      ) : (
        <input type={type} name={name} value={value} onChange={onChange}
          placeholder={placeholder} required={required} style={inputStyle}/>
      )}
      {helper && <p style={{fontSize:'.78rem',color:C.stone,marginTop:5,fontFamily:'var(--font-mono)'}}>{helper}</p>}
    </div>
  );
}

// ─── USE REVEAL HOOK ─────────────────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis'); }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

// ─── MODAL WRAPPER ───────────────────────────────────────────────────────────
function Modal({ open, onClose, children, title, subtitle }) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);
  if (!open) return null;
  return (
    <div onClick={e => { if(e.target===e.currentTarget) onClose(); }} style={{
      position:'fixed',inset:0,zIndex:1000,
      background:'rgba(30,45,58,.7)',backdropFilter:'blur(8px)',
      display:'flex',alignItems:'center',justifyContent:'center',
      padding:'20px',overflowY:'auto',
    }}>
      <div style={{
        background:C.sandPale,borderRadius:C.r_lg,
        width:'100%',maxWidth:560,maxHeight:'90vh',overflowY:'auto',
        boxShadow:'0 30px 80px rgba(30,45,58,.35)',
        animation:'modalIn .35s cubic-bezier(.4,0,.2,1) both',
        border:`1px solid ${C.sand}`,
      }}>
        {/* Modal Header */}
        <div style={{
          padding:'32px 36px 24px',
          borderBottom:`1px solid ${C.sand}`,
          position:'relative',
        }}>
          <button onClick={onClose} style={{
            position:'absolute',top:20,right:20,
            background:'none',border:'none',cursor:'pointer',
            color:C.stone,fontSize:'1.4rem',lineHeight:1,padding:4,
            transition:'var(--t)',
          }}
            onMouseEnter={e=>e.currentTarget.style.color=C.ink}
            onMouseLeave={e=>e.currentTarget.style.color=C.stone}
          >✕</button>
          <h2 style={{
            fontFamily:'var(--font-display)',fontSize:'1.75rem',
            fontWeight:700,color:C.ink,marginBottom:8,lineHeight:1.2,
          }}>{title}</h2>
          {subtitle && <p style={{fontSize:'.93rem',color:C.slate,lineHeight:1.6}}>{subtitle}</p>}
        </div>
        {/* Modal Body */}
        <div style={{ padding:'28px 36px 36px' }}>{children}</div>
      </div>
    </div>
  );
}

// ─── SUCCESS STATE ───────────────────────────────────────────────────────────
function SuccessState({ title, message, onClose }) {
  return (
    <div style={{ textAlign:'center', padding:'20px 0 8px' }}>
      <div style={{
        width:72,height:72,borderRadius:'50%',
        background:C.amberPale,border:`2px solid ${C.amber}`,
        display:'flex',alignItems:'center',justifyContent:'center',
        fontSize:'2rem',margin:'0 auto 24px',
      }}>✓</div>
      <h3 style={{ fontFamily:'var(--font-display)',fontSize:'1.4rem',fontWeight:700,color:C.ink,marginBottom:12 }}>{title}</h3>
      <p style={{ fontSize:'.95rem',color:C.slate,lineHeight:1.7,marginBottom:32 }}>{message}</p>
      <Btn variant="secondary" onClick={onClose}>Close</Btn>
    </div>
  );
}

// ─── USER WAITLIST FORM ───────────────────────────────────────────────────────
function UserWaitlistForm({ onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName:'', lastName:'', phone:'', email:'',
    governorate:'', legalNeed:'', description:'', howHeard:'',
  });

  const set = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400)); // Simulate API call
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) return (
    <SuccessState
      title="You're on the list! 🎉"
      message="We'll notify you the moment Sanad launches. You'll be among the first Egyptians to access verified legal help"
      onClose={onClose}
    />
  );

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 16px' }}>
        <Input label="First Name" name="firstName" value={form.firstName}
          onChange={set} placeholder="Ahmed" required/>
        <Input label="Last Name" name="lastName" value={form.lastName}
          onChange={set} placeholder="Hassan" required/>
      </div>
      <Input label="Phone Number" name="phone" type="tel" value={form.phone}
        onChange={set} placeholder="01X-XXXX-XXXX" required
        helper="We'll send your early access confirmation here"/>
      <Input label="Email Address" name="email" type="email" value={form.email}
        onChange={set} placeholder="ahmed@example.com"/>
      <Input label="Governorate" name="governorate" value={form.governorate}
        onChange={set} required
        options={['Cairo / القاهرة','Giza / الجيزة','Alexandria / الإسكندرية',
          'Mansoura / المنصورة','Tanta / طنطا','Asyut / أسيوط',
          'Luxor / الأقصر','Aswan / أسوان','Other / أخرى']}/>
      <Input label="What type of legal help do you need?" name="legalNeed"
        value={form.legalNeed} onChange={set} required
        options={['Real estate & rentals / عقارات وإيجارات',
          'Family law / قانون أحوال شخصية','Employment & labour / عمل وتوظيف',
          'Business & commercial / تجاري وشركات','Traffic & accidents / مرور وحوادث',
          'Debt & financial disputes / ديون ومنازعات','Criminal / جنائي',
          'Not sure yet / لست متأكدًا بعد']}/>
      <Input label="Briefly describe your situation (optional)" name="description"
        value={form.description} onChange={set}
        placeholder="In a few words, what's your legal challenge?"
        multiline/>
      <Input label="How did you hear about us?" name="howHeard"
        value={form.howHeard} onChange={set}
        options={['Friend or family','Social media','Google search',
          'WhatsApp group','Referred by a lawyer','Other']}/>
      <div style={{ marginTop:8 }}>
        <Btn type="submit" variant="rust" fullWidth disabled={loading}>
          {loading ? (
            <span style={{ display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ width:16,height:16,borderRadius:'50%',border:`2px solid ${C.sand}`,
                borderTopColor:'transparent',animation:'spin .7s linear infinite',display:'inline-block' }}/>
              Joining waitlist...
            </span>
          ) : 'Join the Waitlist — Free'}
        </Btn>
        <p style={{ fontSize:'.78rem',color:C.stone,textAlign:'center',marginTop:12,
                    fontFamily:'var(--font-mono)' }}>
          Free to join. No credit card. We'll notify you within 48 hours.
        </p>
      </div>
    </form>
  );
}

// ─── LAWYER REGISTRATION FORM ─────────────────────────────────────────────────
function LawyerRegisterForm({ onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    firstName:'', lastName:'', phone:'', email:'',
    governorate:'', officeAddress:'',
    specialization:'', yearsExp:'', barGrade:'',
    bio:'', linkedIn:'', howHeard:'', message:'',
  });

  const set = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleNext = e => {
    e.preventDefault();
    setStep(2);
    setTimeout(() => {
      document.querySelector('[data-modal-body]')?.scrollTo({ top:0, behavior:'smooth' });
    }, 50);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1600));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) return (
    <SuccessState
      title="Application Received! ⚖️"
      message="We'll review your details and reach out within 48 hours. As a Founding Lawyer, you'll get 10% commission for 3 months, a verified badge, and priority placement in client search results."
      onClose={onClose}
    />
  );

  return (
    <div>
      {/* Step indicator */}
      <div style={{ display:'flex',gap:8,marginBottom:28,alignItems:'center' }}>
        {[1,2].map(s => (
          <div key={s} style={{ display:'flex',alignItems:'center',gap:8 }}>
            <div style={{
              width:28,height:28,borderRadius:'50%',
              background: s <= step ? C.amber : C.sand,
              color: s <= step ? C.ink : C.stone,
              display:'flex',alignItems:'center',justifyContent:'center',
              fontSize:'.78rem',fontWeight:700,fontFamily:'var(--font-mono)',
              transition:'var(--t)',
            }}>{s}</div>
            <span style={{
              fontSize:'.78rem',fontFamily:'var(--font-mono)',
              color: s === step ? C.ink : C.stone, fontWeight: s===step ? 700:400,
            }}>
              {s===1 ? 'Personal Info' : 'Professional Info'}
            </span>
            {s < 2 && <span style={{ color:C.stone, fontSize:'.8rem', margin:'0 4px' }}>→</span>}
          </div>
        ))}
      </div>

      {step === 1 && (
        <form onSubmit={handleNext}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 16px' }}>
            <Input label="First Name" name="firstName" value={form.firstName}
              onChange={set} placeholder="Omar" required/>
            <Input label="Last Name" name="lastName" value={form.lastName}
              onChange={set} placeholder="Al-Rashidi" required/>
          </div>
          <Input label="Mobile Number" name="phone" type="tel" value={form.phone}
            onChange={set} placeholder="01X-XXXX-XXXX" required/>
          <Input label="Professional Email" name="email" type="email" value={form.email}
            onChange={set} placeholder="lawyer@example.com" required/>
          <Input label="Governorate of Practice" name="governorate"
            value={form.governorate} onChange={set} required
            options={['Cairo / القاهرة','Giza / الجيزة','Alexandria / الإسكندرية',
              'Mansoura / المنصورة','Tanta / طنطا','Asyut / أسيوط','Other / أخرى']}/>
          <Input label="Office Address (optional)" name="officeAddress"
            value={form.officeAddress} onChange={set}
            placeholder="Street, district, city"/>
          <Btn type="submit" variant="secondary" fullWidth>
            Continue to Professional Info →
          </Btn>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit}>
          <Input label="Primary Legal Specialisation" name="specialization"
            value={form.specialization} onChange={set} required
            options={['Personal Status & Family Law / أحوال شخصية',
              'Real Estate & Rental / عقارات','Labour & Employment / عمل وتوظيف',
              'Commercial & Corporate / تجاري وشركات','Criminal Law / جنائي',
              'Tax Law / ضرائب','Traffic & Accidents / مرور',
              'Administrative & Government / إداري','IP & Technology / ملكية فكرية',
              'Other / أخرى']}/>
          <Input label="Years of Experience" name="yearsExp"
            value={form.yearsExp} onChange={set} required
            options={['Less than 2 years','2–5 years','5–10 years','10–20 years','20+ years']}/>
          <Input label="Bar Registration Grade" name="barGrade"
            value={form.barGrade} onChange={set} required
            options={['Primary / ابتدائي','Appellate / استئناف','Cassation / نقض']}/>
          <Input label="Professional Bio" name="bio" value={form.bio}
            onChange={set} multiline required
            placeholder="Briefly describe your expertise, experience, and the types of cases you handle. (50–500 characters)"
            helper="This will appear on your public Sanad profile"/>
          <Input label="LinkedIn Profile URL (optional)" name="linkedIn"
            value={form.linkedIn} onChange={set} placeholder="linkedin.com/in/your-name"/>
          <Input label="Anything else you'd like us to know?" name="message"
            value={form.message} onChange={set} multiline
            placeholder="Questions, concerns, or anything specific about joining Sanad..."/>
          <Input label="How did you hear about Sanad?" name="howHeard"
            value={form.howHeard} onChange={set}
            options={['LinkedIn message','WhatsApp group','Bar Association event',
              'Referral from a colleague','Google search','Social media','Other']}/>
          <div style={{ display:'flex',gap:10,marginTop:8 }}>
            <Btn type="button" variant="outline" onClick={() => setStep(1)}
              style={{ flex:'0 0 auto' }}>← Back</Btn>
            <Btn type="submit" variant="rust" fullWidth disabled={loading}>
              {loading ? (
                <span style={{ display:'flex',alignItems:'center',gap:10 }}>
                  <span style={{ width:16,height:16,borderRadius:'50%',
                    border:`2px solid ${C.sand}`,borderTopColor:'transparent',
                    animation:'spin .7s linear infinite',display:'inline-block' }}/>
                  Submitting...
                </span>
              ) : 'Submit Application'}
            </Btn>
          </div>
          <p style={{ fontSize:'.78rem',color:C.stone,textAlign:'center',marginTop:12,
                      fontFamily:'var(--font-mono)' }}>
            Your information is secure and will only be used for onboarding.
          </p>
        </form>
      )}
    </div>
  );
}

// ─── NAV ─────────────────────────────────────────────────────────────────────
function Nav({ onOpenUser, onOpenLawyer }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);
  const navStyle = {
    position:'fixed',top:0,left:0,right:0,zIndex:100,
    transition:'var(--t)',padding: scrolled ? '12px 0' : '18px 0',
    background: scrolled ? 'rgba(30,45,58,.96)' : 'transparent',
    backdropFilter: scrolled ? 'blur(16px)' : 'none',
    borderBottom: scrolled ? '1px solid rgba(212,206,196,.1)' : 'none',
  };
  const linkStyle = {
    color:'rgba(212,206,196,.75)',fontSize:'.88rem',fontWeight:500,
    fontFamily:'var(--font-mono)',transition:'var(--t)',cursor:'pointer',
    textDecoration:'none',letterSpacing:'.03em',background:'none',border:'none',
  };
  return (
    <>
      <nav style={navStyle}>
        <div style={{ maxWidth:1140,margin:'0 auto',padding:'0 24px',
                      display:'flex',alignItems:'center',justifyContent:'space-between' }}>
          {/* Logo */}
          <a href="#" style={{textDecoration:'none'}}>
            <span style={{ fontFamily:'var(--font-display)',fontSize:'1.7rem',
                           fontWeight:900,color:'#D4CEC4',letterSpacing:'-.01em' }}>
              S<span style={{color:C.amber}}>a</span>nad
            </span>
          </a>
          {/* Desktop links */}
          <div style={{ display:'flex',gap:28,alignItems:'center' }} className="hide-mobile">
            {['#how-it-works','#features','#trust','#faq'].map((href, i) => (
              <a key={href} href={href} style={linkStyle}
                onMouseEnter={e=>e.currentTarget.style.color=C.sand}
                onMouseLeave={e=>e.currentTarget.style.color='rgba(212,206,196,.75)'}>
                {['How It Works','Features','Why Sanad','FAQ'][i]}
              </a>
            ))}
          </div>
          <div style={{ display:'flex',gap:10 }} className="hide-mobile">
            <Btn variant="ghost" onClick={onOpenUser} style={{padding:'10px 20px',fontSize:'.88rem'}}>
              Get Legal Help
            </Btn>
            <Btn variant="primary" onClick={onOpenLawyer} style={{padding:'10px 20px',fontSize:'.88rem'}}>
              Join as Lawyer
            </Btn>
          </div>
          {/* Burger */}
          <button onClick={() => setMobileOpen(true)} className="show-mobile"
            style={{background:'none',border:'none',cursor:'pointer',padding:4,display:'none'}}>
            <div style={{ width:22,height:2,background:C.sand,margin:'5px 0' }}/>
            <div style={{ width:22,height:2,background:C.sand,margin:'5px 0' }}/>
            <div style={{ width:16,height:2,background:C.sand,margin:'5px 0' }}/>
          </button>
        </div>
      </nav>
      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{position:'fixed',inset:0,zIndex:200,background:C.ink,
                     display:'flex',flexDirection:'column',alignItems:'center',
                     justifyContent:'center',gap:32,animation:'fadeDown .3s ease both'}}>
          <button onClick={()=>setMobileOpen(false)}
            style={{position:'absolute',top:20,right:24,background:'none',border:'none',
                    color:C.sand,fontSize:'1.8rem',cursor:'pointer'}}>✕</button>
          {['How It Works','Features','Why Sanad','FAQ'].map((label,i)=>(
            <a key={label} href={['#how-it-works','#features','#trust','#faq'][i]}
              onClick={()=>setMobileOpen(false)}
              style={{fontFamily:'var(--font-display)',fontSize:'2rem',fontWeight:700,
                      color:C.sand,textDecoration:'none',transition:'color .2s'}}
              onMouseEnter={e=>e.currentTarget.style.color=C.amber}
              onMouseLeave={e=>e.currentTarget.style.color=C.sand}>{label}</a>
          ))}
          <div style={{display:'flex',flexDirection:'column',gap:12,marginTop:8}}>
            <Btn variant="rust" onClick={()=>{setMobileOpen(false);onOpenUser()}} style={{width:260}}>Get Legal Help</Btn>
            <Btn variant="outlineLight" onClick={()=>{setMobileOpen(false);onOpenLawyer()}} style={{width:260}}>Join as Lawyer</Btn>
          </div>
        </div>
      )}
    </>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero({ onOpenUser, onOpenLawyer }) {
  return (
    <section style={{
      position:'relative',minHeight:'100vh',display:'flex',alignItems:'center',
      background:C.ink,overflow:'hidden',
    }}>
      {/* Grain texture overlay */}
      <div style={{
        position:'absolute',inset:0,opacity:.04,
        backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat:'repeat',backgroundSize:'200px 200px',zIndex:1,
      }}/>
      {/* Warm gradient wash */}
      <div style={{
        position:'absolute',inset:0,zIndex:0,
        background:`radial-gradient(ellipse 70% 80% at 65% 50%, rgba(164,81,54,.18) 0%, transparent 65%),
                    radial-gradient(ellipse 50% 60% at 10% 80%, rgba(240,166,90,.08) 0%, transparent 55%),
                    linear-gradient(160deg, #1E2D3A 0%, #26374A 45%, #1A2733 100%)`,
      }}/>
      {/* Geometric lines */}
      <div style={{
        position:'absolute',inset:0,zIndex:0,
        backgroundImage:`linear-gradient(rgba(212,206,196,.025) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(212,206,196,.025) 1px, transparent 1px)`,
        backgroundSize:'52px 52px',
        maskImage:'radial-gradient(ellipse 100% 100% at 50% 50%, black 20%, transparent 80%)',
      }}/>
      {/* Large decorative circle */}
      <div style={{
        position:'absolute',right:-120,top:'50%',transform:'translateY(-50%)',
        width:700,height:700,borderRadius:'50%',
        border:'1px solid rgba(240,166,90,.1)',zIndex:0,
        animation:'spin 60s linear infinite',
      }}>
        <div style={{position:'absolute',inset:60,borderRadius:'50%',border:'1px solid rgba(212,206,196,.05)'}}/>
        <div style={{position:'absolute',inset:120,borderRadius:'50%',border:'1px solid rgba(164,81,54,.08)'}}/>
      </div>
      {/* Amber glow */}
      <div style={{
        position:'absolute',right:100,top:'45%',transform:'translateY(-50%)',
        width:400,height:400,borderRadius:'50%',
        background:'radial-gradient(circle, rgba(164,81,54,.1) 0%, transparent 70%)',
        animation:'drift 8s ease-in-out infinite',zIndex:0,
      }}/>

      <div style={{ maxWidth:1140,margin:'0 auto',padding:'0 24px',
                    position:'relative',zIndex:2,width:'100%' }}>
        <div style={{ maxWidth:640 }}>
          {/* Eyebrow */}
          <div style={{
            display:'inline-flex',alignItems:'center',gap:8,
            background:'rgba(240,166,90,.12)',border:'1px solid rgba(240,166,90,.25)',
            color:C.amber,padding:'6px 16px',borderRadius:9999,
            fontSize:'.72rem',fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',
            fontFamily:'var(--font-mono)',marginBottom:32,
            animation:'fadeDown .8s .1s ease both',
          }}>
            <span style={{width:6,height:6,borderRadius:'50%',background:C.amber,
                          animation:'pulse 2s ease infinite'}}/>
            🇪🇬 Early Access Open
          </div>

          <h1 style={{
            fontFamily:'var(--font-display)',
            fontSize:'clamp(2.8rem, 5.5vw, 4.6rem)',
            fontWeight:900,lineHeight:1.06,color:C.sand,
            marginBottom:22,animation:'fadeUp .9s .2s ease both',
          }}>
            Your legal problem<br/>
            deserves a{' '}
            <span style={{
              color:'transparent',
              backgroundImage:`linear-gradient(135deg, ${C.amber}, ${C.rust})`,
              WebkitBackgroundClip:'text',backgroundClip:'text',
              fontStyle:'italic',
            }}>clear path</span>
            <br/>to resolution.
          </h1>

          <p style={{
            fontSize:'1.12rem',color:'rgba(212,206,196,.72)',lineHeight:1.75,
            marginBottom:44,maxWidth:520,animation:'fadeUp .9s .35s ease both',
          }}>
            Sanad connects you with verified, specialised Egyptian lawyers — with transparent pricing and a structured process designed around one thing: <strong style={{color:'rgba(212,206,196,.9)'}}>your outcome.</strong>
          </p>

          <div style={{
            display:'flex',gap:14,flexWrap:'wrap',
            animation:'fadeUp .9s .5s ease both',
          }}>
            <Btn variant="rust" onClick={onOpenUser} style={{padding:'16px 34px',fontSize:'1.03rem'}}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{flexShrink:0}}>
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              I Need Legal Help
            </Btn>
            <Btn variant="outlineLight" onClick={onOpenLawyer} style={{padding:'16px 34px',fontSize:'1.03rem'}}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{flexShrink:0}}>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              Join as a Lawyer
            </Btn>
          </div>

          {/* Trust bar */}
          <div style={{
            display:'flex',gap:28,flexWrap:'wrap',marginTop:52,
            animation:'fadeUp .9s .65s ease both',
          }}>
            {[['100','Founding Lawyer Spots'],['10%','Commission — 3 Months'],['24h','Verified Profiles']].map(([big,small]) => (
              <div key={big} style={{ display:'flex',alignItems:'center',gap:10 }}>
                <span style={{fontFamily:'var(--font-mono)',fontSize:'1.25rem',fontWeight:700,color:C.amber}}>{big}</span>
                <span style={{fontSize:'.82rem',color:'rgba(212,206,196,.45)',lineHeight:1.3}}>{small}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div style={{
        position:'absolute',bottom:32,left:'50%',transform:'translateX(-50%)',
        display:'flex',flexDirection:'column',alignItems:'center',gap:6,zIndex:2,
        animation:'fadeUp 1s .9s ease both',
      }}>
        <span style={{fontSize:'.65rem',letterSpacing:'.15em',textTransform:'uppercase',
                      fontFamily:'var(--font-mono)',color:'rgba(212,206,196,.25)'}}>Scroll</span>
        <div style={{width:1,height:36,background:`linear-gradient(to bottom, ${C.amber}60, transparent)`}}/>
      </div>
    </section>
  );
}

// ─── PROBLEM ──────────────────────────────────────────────────────────────────
function Problem() {
  const painPoints = [
    { icon:'⚠️', title:'"I don\'t know which lawyer I need."',
      desc:'65%+ of people with legal issues can\'t identify the right specialisation — so they either pick wrong or give up.', col: C.rust },
    { icon:'💸', title:'"The fees were never clear."',
      desc:'Legal costs in Egypt are almost never advertised upfront. Clients commit blind and feel trapped.', col: C.amber },
    { icon:'🔗', title:'"I found him through my cousin."',
      desc:'Referral chains dominate legal discovery — with no credential checks, no reviews, and no accountability.', col: C.slate },
  ];
  return (
    <section style={{ padding:'100px 0', background:C.sandPale }}>
      <div style={{ maxWidth:1140,margin:'0 auto',padding:'0 24px' }}>
        <div className="reveal" style={{ textAlign:'center',marginBottom:16 }}><Tag>The Reality</Tag></div>
        <h2 className="reveal d1" style={{
          fontFamily:'var(--font-display)',fontSize:'clamp(1.9rem,3.5vw,2.9rem)',
          fontWeight:700,color:C.ink,textAlign:'center',lineHeight:1.15,marginBottom:18,
        }}>
          Most Egyptians face legal problems{' '}
          <em style={{fontStyle:'italic',
            backgroundImage:`linear-gradient(135deg, ${C.amber}, ${C.rust})`,
            WebkitBackgroundClip:'text',backgroundClip:'text',color:'transparent'}}>
            alone
          </em>
        </h2>
        <p className="reveal d2" style={{
          fontSize:'1.05rem',color:C.slate,textAlign:'center',maxWidth:580,
          margin:'0 auto 64px',lineHeight:1.7,
        }}>
          The legal system was never designed for clarity. Access to qualified legal help in Egypt is fragmented, opaque, and often inaccessible. Sanad is changing that.
        </p>

        <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:24,marginBottom:64 }}>
          {painPoints.map((p,i) => (
            <div key={i} className={`reveal d${i+1}`} style={{
              background:C.white,borderRadius:C.r_lg,padding:'32px 28px',
              border:`1px solid ${C.sand}`,boxShadow:' 0 4px 20px rgba(30,45,58,.05)',
              transition:'var(--t)',cursor:'default',
            }}
              onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow=`0 16px 40px rgba(30,45,58,.12)`;}}
              onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='0 4px 20px rgba(30,45,58,.05)';}}
            >
              <div style={{
                width:48,height:48,borderRadius:12,display:'flex',alignItems:'center',
                justifyContent:'center',fontSize:'1.4rem',marginBottom:20,
                background:`${p.col}15`,border:`1px solid ${p.col}25`,
              }}>{p.icon}</div>
              <h4 style={{ fontFamily:'var(--font-display)',fontSize:'1.05rem',fontWeight:700,
                           color:C.ink,marginBottom:10,lineHeight:1.3 }}>{p.title}</h4>
              <p style={{ fontSize:'.9rem',color:C.slate,lineHeight:1.6 }}>{p.desc}</p>
            </div>
          ))}
        </div>

        {/* Stat strip */}
        <div className="reveal" style={{
          display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:24,
          background:C.ink,borderRadius:C.r_lg,padding:'40px 48px',
          border:`1px solid ${C.slate}40`,
        }}>
          {[['450K+','Registered Egyptian Lawyers'],['1 in 4','Give up without help'],['100M+','Citizens who deserve access']].map(([n,l],i) => (
            <div key={i} style={{ textAlign:'center' }}>
              <div style={{ fontFamily:'var(--font-mono)',fontSize:'clamp(1.8rem,3vw,2.6rem)',
                            fontWeight:700,color:C.amber,lineHeight:1,marginBottom:8 }}>{n}</div>
              <div style={{ fontSize:'.85rem',color:C.stone,lineHeight:1.4 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SOLUTION ─────────────────────────────────────────────────────────────────
function Solution() {
  const steps = [
    { n:'01', title:'Describe Your Situation', desc:'Tell us what you\'re dealing with in plain language. Our guided intake helps categorise your legal need without requiring you to know any legal terminology.'},
    { n:'02', title:'Find the Right Lawyer', desc:'Browse verified, specialised lawyers filtered by your specific case type, location, and budget. Credentials checked. Reviews verified. Full transparency.'},
    { n:'03', title:'Book, Consult, Resolve', desc:'Book a video or voice consultation, pay securely, and get expert legal guidance. Track progress, share documents — all in one structured place.'},
  ];
  return (
    <section style={{ padding:'100px 0', background:C.sandLight }}>
      <div style={{ maxWidth:1140,margin:'0 auto',padding:'0 24px' }}>
        <div className="reveal" style={{ textAlign:'center',marginBottom:16 }}><Tag variant="ink">The Sanad Way</Tag></div>
        <h2 className="reveal d1" style={{
          fontFamily:'var(--font-display)',fontSize:'clamp(1.9rem,3.5vw,2.9rem)',
          fontWeight:700,color:C.ink,textAlign:'center',lineHeight:1.15,marginBottom:18,
        }}>From confusion to clarity <em style={{fontStyle:'italic',color:C.rust}}>in three steps</em></h2>
        <p className="reveal d2" style={{
          fontSize:'1.05rem',color:C.slate,textAlign:'center',
          maxWidth:560,margin:'0 auto 72px',lineHeight:1.7,
        }}>Sanad is not a directory. It's a structured legal journey — engineered around getting you from a problem to a resolution.</p>

        <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(270px,1fr))',gap:0,position:'relative' }}>
          {steps.map((s,i) => (
            <div key={i} className={`reveal d${i+1}`} style={{
              padding:'0 36px',textAlign:'center',position:'relative',
              borderRight: i < 2 ? `1px solid ${C.sand}` : 'none',
            }}>
              {/* Connector dot */}
              {i < 2 && <div style={{
                position:'absolute',right:-6,top:56,width:12,height:12,
                borderRadius:'50%',background:C.amber,
                boxShadow:`0 0 0 4px ${C.sandLight}`,zIndex:1,
              }}/>}
              <div style={{
                width:72,height:72,borderRadius:'50%',
                background:C.ink,color:C.amber,
                fontFamily:'var(--font-mono)',fontSize:'1.5rem',fontWeight:700,
                display:'flex',alignItems:'center',justifyContent:'center',
                margin:'0 auto 28px',
                boxShadow:`0 8px 24px rgba(30,45,58,.2), 0 0 0 8px ${C.sand}30`,
                position:'relative',
              }}>
                {s.n}
                <div style={{
                  position:'absolute',inset:-8,borderRadius:'50%',
                  border:`2px dashed ${C.amber}35`,
                  animation:'spin 25s linear infinite',
                }}/>
              </div>
              <h3 style={{ fontFamily:'var(--font-display)',fontSize:'1.15rem',
                           fontWeight:700,color:C.ink,marginBottom:12 }}>{s.title}</h3>
              <p style={{ fontSize:'.92rem',color:C.slate,lineHeight:1.65 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── HOW IT WORKS ──────────────────────────────────────────────────────────────
function HowItWorks({ onOpenUser, onOpenLawyer }) {
  const [tab, setTab] = useState('users');

  const userSteps = [
    { icon:'📝', title:'Describe Your Issue', desc:'Use guided intake to explain your situation in plain language. No legal jargon required.' },
    { icon:'🎯', title:'Get Matched', desc:'Sanad filters verified lawyers by your case type, governorate, pricing, and availability.' },
    { icon:'📅', title:'Book & Pay', desc:'Choose a time slot, select video or voice, and pay securely before the session.' },
    { icon:'💬', title:'Consult & Follow Up', desc:'Conduct your session in-app, share documents, and track progress in one place.' },
  ];
  const lawyerSteps = [
    { icon:'✅', title:'Create Verified Profile', desc:'Register with your Bar Association credentials. Manual verification completed within 24 hours.' },
    { icon:'⚙️', title:'Set Availability & Rates', desc:'Define your hours, accepted specialisations, and consultation fees. Full control, always.' },
    { icon:'📥', title:'Receive Pre-Qualified Requests', desc:'Clients have described their issue, reviewed your profile, and already paid before you respond.' },
    { icon:'💰', title:'Consult & Get Paid', desc:'Fees are collected automatically after each session. No chasing. No awkward conversations.' },
  ];

  return (
    <section id="how-it-works" style={{ padding:'100px 0',background:C.ink,position:'relative',overflow:'hidden' }}>
      <div style={{
        position:'absolute',inset:0,
        backgroundImage:`linear-gradient(rgba(212,206,196,.02) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(212,206,196,.02) 1px, transparent 1px)`,
        backgroundSize:'48px 48px',
      }}/>
      <div style={{ maxWidth:1140,margin:'0 auto',padding:'0 24px',position:'relative',zIndex:1 }}>
        <div className="reveal" style={{ textAlign:'center',marginBottom:16 }}>
          <span style={{
            display:'inline-flex',alignItems:'center',gap:6,
            background:'rgba(240,166,90,.12)',border:'1px solid rgba(240,166,90,.25)',
            color:C.amber,padding:'5px 14px',borderRadius:9999,
            fontSize:'.72rem',fontWeight:700,letterSpacing:'.1em',
            textTransform:'uppercase',fontFamily:'var(--font-mono)',
          }}>For Everyone</span>
        </div>
        <h2 className="reveal d1" style={{
          fontFamily:'var(--font-display)',fontSize:'clamp(1.9rem,3.5vw,2.9rem)',
          fontWeight:700,color:C.sand,textAlign:'center',lineHeight:1.15,marginBottom:18,
        }}>Built around <em style={{fontStyle:'italic',color:C.amber}}>how you actually work</em></h2>
        <p className="reveal d2" style={{
          fontSize:'1.05rem',color:C.stone,textAlign:'center',
          maxWidth:560,margin:'0 auto 48px',lineHeight:1.7,
        }}>Two sides, one platform. Whether you need legal help or you provide it — Sanad handles both with the same structured clarity.</p>

        {/* Tabs */}
        <div className="reveal d3" style={{
          display:'flex',gap:4,background:'rgba(255,255,255,.06)',
          borderRadius:9999,padding:5,maxWidth:320,margin:'0 auto 56px',
        }}>
          {[['users','For Users'],['lawyers','For Lawyers']].map(([val,label]) => (
            <button key={val} onClick={() => setTab(val)} style={{
              flex:1,padding:'11px 20px',borderRadius:9999,border:'none',
              background: tab===val ? C.amber : 'transparent',
              color: tab===val ? C.ink : C.stone,
              fontFamily:'var(--font-arabic)',fontSize:'.9rem',fontWeight:700,
              cursor:'pointer',transition:'var(--t)',
            }}>{label}</button>
          ))}
        </div>

        {/* Steps grid */}
        <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:20 }}>
          {(tab==='users' ? userSteps : lawyerSteps).map((s,i) => (
            <div key={i} className="reveal" style={{
              background:'rgba(255,255,255,.04)',border:'1px solid rgba(212,206,196,.08)',
              borderRadius:C.r_lg,padding:'32px 26px',position:'relative',overflow:'hidden',
              transition:'var(--t)',
            }}
              onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,.07)';e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.borderColor='rgba(240,166,90,.25)';}}
              onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,.04)';e.currentTarget.style.transform='none';e.currentTarget.style.borderColor='rgba(212,206,196,.08)';}}
            >
              <div style={{
                position:'absolute',top:-8,right:12,
                fontFamily:'var(--font-mono)',fontSize:'5rem',fontWeight:700,
                color:'rgba(240,166,90,.05)',lineHeight:1,
              }}>0{i+1}</div>
              <div style={{
                width:50,height:50,borderRadius:12,
                background:'rgba(240,166,90,.12)',border:'1px solid rgba(240,166,90,.2)',
                display:'flex',alignItems:'center',justifyContent:'center',
                fontSize:'1.4rem',marginBottom:20,
              }}>{s.icon}</div>
              <h4 style={{ fontSize:'1rem',fontWeight:700,color:C.sand,marginBottom:10 }}>{s.title}</h4>
              <p style={{ fontSize:'.88rem',color:C.stone,lineHeight:1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA row */}
        <div className="reveal" style={{ display:'flex',gap:14,justifyContent:'center',flexWrap:'wrap',marginTop:56 }}>
          <Btn variant="rust" onClick={onOpenUser} style={{padding:'14px 32px'}}>
            Join the Waitlist →
          </Btn>
          <Btn variant="outlineLight" onClick={onOpenLawyer} style={{padding:'14px 32px'}}>
            Register as a Lawyer →
          </Btn>
        </div>
      </div>
    </section>
  );
}

// ─── VALUE PROPS ───────────────────────────────────────────────────────────────
function ValueProps() {
  const userValues = [
    { title:'Guided Clarity',desc:'Understand your legal situation before spending a single pound. Our intake process guides you to the right path from the first step.' },
    { title:'Transparent Pricing',desc:'See exactly what a consultation costs before you book. No hidden fees. No surprises after the fact.' },
    { title:'Verified Credentials',desc:'Every lawyer is checked against Bar Association records before going live. Real credentials. Real specialisations.' },
    { title:'Everything in One App',desc:'Booking, calling, documents, and follow-up — all structured in one place. No scattered WhatsApp threads.' },
  ];
  const lawyerValues = [
    { title:'Ready-to-Book Clients',desc:'Clients have described their issue, reviewed your profile, and paid before the request reaches you. Zero cold enquiries.' },
    { title:'Verified Digital Identity',desc:'Your Bar credentials, qualifications, and reviews are publicly searchable. Your expertise finally has a stage.' },
    { title:'Automatic Fee Collection',desc:'Clients pay before every session. Earnings transfer automatically after completion. No chasing, ever.' },
    { title:'Full Professional Control',desc:'You set your price, your hours, your specialisations. Accept, reschedule, or decline any request.' },
  ];
  return (
    <section style={{ padding:'100px 0',background:C.sandPale }}>
      <div style={{ maxWidth:1140,margin:'0 auto',padding:'0 24px' }}>
        <div className="reveal" style={{ textAlign:'center',marginBottom:16 }}><Tag>Why Sanad Works</Tag></div>
        <h2 className="reveal d1" style={{
          fontFamily:'var(--font-display)',fontSize:'clamp(1.9rem,3.5vw,2.9rem)',
          fontWeight:700,color:C.ink,textAlign:'center',lineHeight:1.15,marginBottom:18,
        }}>Real value on <em style={{fontStyle:'italic',color:C.rust}}>both sides</em></h2>
        <p className="reveal d2" style={{
          fontSize:'1.05rem',color:C.slate,textAlign:'center',
          maxWidth:560,margin:'0 auto 64px',lineHeight:1.7,
        }}>Sanad aligns the interests of clients and lawyers — so everyone gets what they actually came for.</p>

        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:24 }}>
          {/* User card */}
          <div className="reveal" style={{
            background:C.white,borderRadius:C.r_lg,padding:'44px 40px',
            border:`1px solid ${C.sand}`,
          }}>
            <div style={{ fontSize:'.72rem',fontWeight:700,letterSpacing:'.1em',
                          textTransform:'uppercase',color:C.amber,
                          fontFamily:'var(--font-mono)',marginBottom:16 }}>For Users</div>
            <h3 style={{ fontFamily:'var(--font-display)',fontSize:'1.6rem',fontWeight:700,
                         color:C.ink,marginBottom:32,lineHeight:1.2 }}>
              Stop guessing.<br/>Start resolving.
            </h3>
            <div style={{ display:'flex',flexDirection:'column',gap:20 }}>
              {userValues.map((v,i) => (
                <div key={i} style={{ display:'flex',gap:14 }}>
                  <div style={{
                    width:24,height:24,borderRadius:'50%',background:C.amberPale,
                    color:C.rust,display:'flex',alignItems:'center',justifyContent:'center',
                    fontSize:'.7rem',fontWeight:700,flexShrink:0,marginTop:1,
                  }}>✓</div>
                  <div>
                    <h5 style={{ fontSize:'.95rem',fontWeight:700,color:C.ink,marginBottom:3 }}>{v.title}</h5>
                    <p style={{ fontSize:'.87rem',color:C.slate,lineHeight:1.55 }}>{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Lawyer card */}
          <div className="reveal d2" style={{
            background:C.ink,borderRadius:C.r_lg,padding:'44px 40px',
            border:'1px solid rgba(212,206,196,.08)',
          }}>
            <div style={{ fontSize:'.72rem',fontWeight:700,letterSpacing:'.1em',
                          textTransform:'uppercase',color:C.amber,
                          fontFamily:'var(--font-mono)',marginBottom:16 }}>For Lawyers</div>
            <h3 style={{ fontFamily:'var(--font-display)',fontSize:'1.6rem',fontWeight:700,
                         color:C.sand,marginBottom:32,lineHeight:1.2 }}>
              Better clients.<br/>Less friction.
            </h3>
            <div style={{ display:'flex',flexDirection:'column',gap:20 }}>
              {lawyerValues.map((v,i) => (
                <div key={i} style={{ display:'flex',gap:14 }}>
                  <div style={{
                    width:24,height:24,borderRadius:'50%',
                    background:'rgba(240,166,90,.15)',color:C.amber,
                    display:'flex',alignItems:'center',justifyContent:'center',
                    fontSize:'.7rem',fontWeight:700,flexShrink:0,marginTop:1,
                  }}>✓</div>
                  <div>
                    <h5 style={{ fontSize:'.95rem',fontWeight:700,color:C.sand,marginBottom:3 }}>{v.title}</h5>
                    <p style={{ fontSize:'.87rem',color:C.stone,lineHeight:1.55 }}>{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FEATURES ─────────────────────────────────────────────────────────────────
function Features() {
  const feats = [
    { icon:'📅', title:'Smart Booking', desc:'Book video or voice sessions in minutes. Real-time availability, one-click rescheduling if needed.' },
    { icon:'🎯', title:'Specialisation Filtering', desc:'Filter by legal area, governorate, price range, experience, and rating. Find exactly who you need.' },
    { icon:'🔒', title:'Secure Communication', desc:'All calls and messages are encrypted, in-app. Your personal number is never shared.' },
    { icon:'📂', title:'Document Sharing', desc:'Upload and exchange legal documents securely. Accessible only to you and your lawyer.' },
    { icon:'⭐', title:'Verified Reviews', desc:'Reviews only from clients who completed paid consultations. No fake ratings. No anonymous opinions.' },
    { icon:'🏛️', title:'Bar Verification', desc:'Every lawyer\'s credentials are manually verified against Egyptian Bar Association records.' },
  ];
  return (
    <section id="features" style={{ padding:'100px 0',background:C.sandLight }}>
      <div style={{ maxWidth:1140,margin:'0 auto',padding:'0 24px' }}>
        <div className="reveal" style={{ textAlign:'center',marginBottom:16 }}><Tag variant="ink">Platform Features</Tag></div>
        <h2 className="reveal d1" style={{
          fontFamily:'var(--font-display)',fontSize:'clamp(1.9rem,3.5vw,2.9rem)',
          fontWeight:700,color:C.ink,textAlign:'center',lineHeight:1.15,marginBottom:18,
        }}>Every tool you need in <em style={{fontStyle:'italic',color:C.rust}}>one focused platform</em></h2>
        <p className="reveal d2" style={{
          fontSize:'1.05rem',color:C.slate,textAlign:'center',
          maxWidth:560,margin:'0 auto 64px',lineHeight:1.7,
        }}>Not a directory. Not a chatbot. A complete legal coordination system built around outcomes.</p>

        <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:20 }}>
          {feats.map((f,i) => (
            <div key={i} className={`reveal d${(i%3)+1}`} style={{
              background:C.white,borderRadius:C.r_lg,padding:'36px 30px',
              border:`1px solid ${C.sand}`,transition:'var(--t)',position:'relative',overflow:'hidden',
            }}
              onMouseEnter={e=>{
                e.currentTarget.style.borderColor=C.amber;
                e.currentTarget.style.transform='translateY(-5px)';
                e.currentTarget.style.boxShadow=`0 20px 48px rgba(30,45,58,.12)`;
                e.currentTarget.querySelector('.feat-icon').style.background=C.ink;
              }}
              onMouseLeave={e=>{
                e.currentTarget.style.borderColor=C.sand;
                e.currentTarget.style.transform='none';
                e.currentTarget.style.boxShadow='none';
                e.currentTarget.querySelector('.feat-icon').style.background=C.amberPale;
              }}
            >
              <div className="feat-icon" style={{
                width:52,height:52,borderRadius:14,background:C.amberPale,
                display:'flex',alignItems:'center',justifyContent:'center',
                fontSize:'1.5rem',marginBottom:22,transition:'var(--t)',
              }}>{f.icon}</div>
              <h4 style={{ fontSize:'1rem',fontWeight:700,color:C.ink,marginBottom:10 }}>{f.title}</h4>
              <p style={{ fontSize:'.9rem',color:C.slate,lineHeight:1.6 }}>{f.desc}</p>
              {/* Bottom accent */}
              <div style={{
                position:'absolute',bottom:0,left:0,right:0,height:3,
                background:`linear-gradient(to right, ${C.amber}, ${C.rust})`,
                transform:'scaleX(0)',transformOrigin:'left',transition:'transform .3s ease',
              }} className="feat-accent"/>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── TRUST ─────────────────────────────────────────────────────────────────────
function Trust() {
  const cards = [
    { icon:'🏛️', title:'Bar Association Verified', desc:'Every lawyer\'s Bar membership is manually reviewed before their profile goes live. No exceptions.' },
    { icon:'💳', title:'Payment Protection', desc:'Clients pay before sessions. Lawyers receive funds automatically after completion. No cash, no ambiguity.' },
    { icon:'🔐', title:'Confidentiality Guaranteed', desc:'All communications and documents are encrypted. Your legal matters are shared only with your chosen lawyer.' },
    { icon:'⚖️', title:'Real Reviews Only', desc:'Reviews require a completed, paid consultation. No anonymous opinions. No fake ratings.' },
    { icon:'🛡️', title:'Data Protection', desc:'Sanad complies with Egypt\'s Personal Data Protection Law No. 151 of 2020. Your data belongs to you.' },
    { icon:'📋', title:'Transparent Terms', desc:'No hidden fees. No lock-in contracts. Clear pricing for clients, clear commissions for lawyers.' },
  ];
  return (
    <section id="trust" style={{ padding:'100px 0',background:C.ink,position:'relative',overflow:'hidden' }}>
      <div style={{
        position:'absolute',bottom:-100,right:-100,width:500,height:500,
        borderRadius:'50%',background:`radial-gradient(circle, ${C.rust}10, transparent 70%)`,
      }}/>
      <div style={{ maxWidth:1140,margin:'0 auto',padding:'0 24px',position:'relative',zIndex:1 }}>
        <div className="reveal" style={{ textAlign:'center',marginBottom:16 }}>
          <span style={{
            display:'inline-flex',alignItems:'center',gap:6,
            background:'rgba(240,166,90,.12)',border:'1px solid rgba(240,166,90,.25)',
            color:C.amber,padding:'5px 14px',borderRadius:9999,
            fontSize:'.72rem',fontWeight:700,letterSpacing:'.1em',
            textTransform:'uppercase',fontFamily:'var(--font-mono)',
          }}>Why Trust Sanad</span>
        </div>
        <h2 className="reveal d1" style={{
          fontFamily:'var(--font-display)',fontSize:'clamp(1.9rem,3.5vw,2.9rem)',
          fontWeight:700,color:C.sand,textAlign:'center',lineHeight:1.15,marginBottom:18,
        }}>Trust built on <em style={{fontStyle:'italic',color:C.amber}}>demonstration</em></h2>
        <p className="reveal d2" style={{
          fontSize:'1.05rem',color:C.stone,textAlign:'center',
          maxWidth:560,margin:'0 auto 64px',lineHeight:1.7,
        }}>Trust isn't claimed. It's earned through structure, transparency, and consistency. Here's how Sanad earns yours.</p>

        <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:20,marginBottom:48 }}>
          {cards.map((c,i) => (
            <div key={i} className={`reveal d${(i%3)+1}`} style={{
              background:'rgba(255,255,255,.04)',border:'1px solid rgba(212,206,196,.07)',
              borderRadius:C.r_lg,padding:'32px 26px',textAlign:'center',transition:'var(--t)',
            }}
              onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,.07)';e.currentTarget.style.borderColor='rgba(240,166,90,.25)';e.currentTarget.style.transform='translateY(-4px)';}}
              onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,.04)';e.currentTarget.style.borderColor='rgba(212,206,196,.07)';e.currentTarget.style.transform='none';}}
            >
              <div style={{ fontSize:'2rem',marginBottom:16 }}>{c.icon}</div>
              <h4 style={{ fontFamily:'var(--font-display)',fontSize:'1.05rem',fontWeight:700,
                           color:C.sand,marginBottom:10 }}>{c.title}</h4>
              <p style={{ fontSize:'.88rem',color:C.stone,lineHeight:1.6 }}>{c.desc}</p>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="reveal" style={{
          padding:'28px 36px',background:'rgba(255,255,255,.03)',
          border:'1px solid rgba(212,206,196,.06)',borderRadius:C.r_lg,textAlign:'center',
        }}>
          <p style={{ fontSize:'.9rem',color:'rgba(212,206,196,.4)',lineHeight:1.75 }}>
            <strong style={{color:'rgba(212,206,196,.65)'}}>Important:</strong>{' '}
            Sanad is a technology marketplace that facilitates connections between clients and independent legal professionals.
            Sanad is <strong style={{color:'rgba(212,206,196,.65)'}}>not a law firm</strong> and does not provide legal advice.
            All legal services are the sole responsibility of the licensed lawyer providing them.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── EARLY ACCESS ──────────────────────────────────────────────────────────────
function EarlyAccess({ onOpenUser, onOpenLawyer }) {
  return (
    <section id="early" style={{
      padding:'100px 0',
      background:`linear-gradient(135deg, ${C.sandLight} 0%, ${C.sand} 100%)`,
      position:'relative',overflow:'hidden',
    }}>
      <div style={{ position:'absolute',top:-60,left:-60,width:280,height:280,borderRadius:'50%',border:`2px solid ${C.stone}20` }}/>
      <div style={{ position:'absolute',bottom:-80,right:-80,width:380,height:380,borderRadius:'50%',border:`1px solid ${C.stone}15` }}/>
      <div style={{ maxWidth:700,margin:'0 auto',padding:'0 24px',textAlign:'center',position:'relative',zIndex:1 }}>
        <div className="reveal" style={{ marginBottom:24 }}>
          <span style={{
            display:'inline-flex',alignItems:'center',gap:8,
            background:'rgba(164,81,54,.1)',border:'1px solid rgba(164,81,54,.25)',
            color:C.rust,padding:'6px 16px',borderRadius:9999,
            fontSize:'.72rem',fontWeight:700,letterSpacing:'.1em',
            textTransform:'uppercase',fontFamily:'var(--font-mono)',
          }}>
            <span style={{width:7,height:7,borderRadius:'50%',background:C.rust,animation:'pulse 2s infinite'}}/>
            🚀 Early Access — Now Open
          </span>
        </div>
        <h2 className="reveal d1" style={{
          fontFamily:'var(--font-display)',fontSize:'clamp(2rem,4vw,3rem)',
          fontWeight:700,color:C.ink,lineHeight:1.15,marginBottom:18,
        }}>Be among the first.<br/>Shape what Sanad becomes.</h2>
        <p className="reveal d2" style={{
          fontSize:'1.05rem',color:C.slate,lineHeight:1.75,marginBottom:48,
        }}>Join during our founding phase and unlock benefits that won't exist once we launch publicly. First to join. First to benefit. First to shape the platform.</p>

        <div className="reveal d3" style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:44,textAlign:'left' }}>
          {[
            { label:'For Users', title:'Join Early. Get More Attention.', desc:'Join the waitlist and book your first consultation with no Sanad service fee.' },
            { label:'For Lawyers', title:'10% Commission — First 3 Months', desc:'First 100 lawyers get zero commission, a Founding badge, and priority search placement.' },
          ].map((c,i) => (
            <div key={i} style={{
              background:C.white,borderRadius:C.r,padding:'28px 24px',
              border:`1px solid ${C.sand}`,boxShadow:'0 4px 20px rgba(30,45,58,.05)',
            }}>
              <div style={{ fontSize:'.72rem',fontWeight:700,letterSpacing:'.08em',
                            textTransform:'uppercase',color:C.amber,
                            fontFamily:'var(--font-mono)',marginBottom:10 }}>{c.label}</div>
              <h4 style={{ fontSize:'.98rem',fontWeight:700,color:C.ink,marginBottom:8,lineHeight:1.3 }}>{c.title}</h4>
              <p style={{ fontSize:'.86rem',color:C.slate,lineHeight:1.55 }}>{c.desc}</p>
            </div>
          ))}
        </div>

        <div className="reveal d4" style={{ display:'flex',gap:14,justifyContent:'center',flexWrap:'wrap' }}>
          <Btn variant="rust" onClick={onOpenUser} style={{padding:'15px 32px'}}>
            Join the Waitlist →
          </Btn>
          <Btn variant="outline" onClick={onOpenLawyer} style={{padding:'15px 32px'}}>
            Register as a Lawyer →
          </Btn>
        </div>
        <p className="reveal d5" style={{
          marginTop:18,fontSize:'.8rem',color:C.stone,fontFamily:'var(--font-mono)',
        }}>Free to join · No credit card · Arabic & English · Egypt-based lawyers</p>
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
function FAQ() {
  const [open, setOpen] = useState(null);
  const faqs = [
    { q:'Is Sanad free to use?', a:'Registering on Sanad is completely free for both clients and lawyers. Clients pay only for consultations they book — the fee is set by the lawyer and shown upfront before commitment. Lawyers pay a small platform commission only when a consultation is completed. During the founding period, the first 100 lawyers pay 10% commission for 3 months.' },
    { q:'How do I choose the right lawyer?', a:'Sanad\'s filtering system lets you narrow by legal specialisation, governorate, consultation price, years of experience, and rating. Every lawyer profile shows Bar Association credentials, academic qualifications, work history, and verified client reviews. You see everything before you book.' },
    { q:'Does Sanad provide legal advice?', a:'No. Sanad does not provide legal advice. We are a technology platform connecting clients with independent, licensed Egyptian lawyers. All legal advice and services are provided exclusively by the lawyer you choose — who carries full professional responsibility for their work.' },
    { q:'How do lawyers get paid?', a:'Clients pay their consultation fee upfront when booking — through bank card, Fawry, Vodafone Cash, or InstaPay. After the consultation is completed, the fee (minus Sanad\'s commission) is automatically transferred to the lawyer. Founding lawyers pay 0% for 3 months, then a flat 10% thereafter.' },
    { q:'What happens if my lawyer cancels?', a:'If a lawyer cancels, rejects your booking, or fails to appear, you receive a full automatic refund to your original payment method within 5–10 business days. All no-show incidents are reviewed as part of our quality management process.' },
    { q:'Is my information private?', a:'Yes. All data is encrypted in transit (TLS 1.3) and at rest (AES-256). Your personal phone number is never shared with lawyers. Documents are accessible only to you and your matched lawyer. Sanad complies with Egypt\'s Personal Data Protection Law No. 151 of 2020.' },
    { q:'Can I consult in Arabic?', a:'Absolutely. Sanad is built for the Egyptian market. The full app is available in Arabic (RTL) and English. All lawyers on the platform are Egyptian legal professionals — consultations happen in Arabic unless you and your lawyer agree otherwise.' },
  ];
  return (
    <section id="faq" style={{ padding:'100px 0',background:C.sandPale }}>
      <div style={{ maxWidth:1140,margin:'0 auto',padding:'0 24px' }}>
        <div className="reveal" style={{ textAlign:'center',marginBottom:16 }}><Tag>FAQ</Tag></div>
        <h2 className="reveal d1" style={{
          fontFamily:'var(--font-display)',fontSize:'clamp(1.9rem,3.5vw,2.9rem)',
          fontWeight:700,color:C.ink,textAlign:'center',lineHeight:1.15,marginBottom:18,
        }}>Every question you're thinking <em style={{fontStyle:'italic',color:C.rust}}>right now</em></h2>
        <p className="reveal d2" style={{
          fontSize:'1.05rem',color:C.slate,textAlign:'center',
          maxWidth:560,margin:'0 auto 56px',lineHeight:1.7,
        }}>Straightforward answers. No fluff.</p>
        <div style={{ maxWidth:760,margin:'0 auto' }}>
          {faqs.map((f,i) => (
            <div key={i} className="reveal" style={{
              borderRadius:C.r,overflow:'hidden',marginBottom:8,
              border:`1.5px solid ${open===i ? C.amber : C.sand}`,
              transition:'border-color .3s ease',
            }}>
              <button onClick={() => setOpen(open===i ? null : i)} style={{
                width:'100%',display:'flex',alignItems:'center',justifyContent:'space-between',
                gap:16,padding:'20px 26px',
                background: open===i ? C.ink : C.white,
                border:'none',cursor:'pointer',textAlign:'left',
                fontFamily:'var(--font-arabic)',fontSize:'1rem',fontWeight:600,
                color: open===i ? C.sand : C.ink,
                transition:'var(--t)',
              }}>
                {f.q}
                <span style={{
                  width:28,height:28,borderRadius:'50%',
                  border:`2px solid currentColor`,
                  display:'flex',alignItems:'center',justifyContent:'center',
                  flexShrink:0,
                  transform: open===i ? 'rotate(180deg)' : 'none',
                  transition:'transform .3s ease',
                  fontSize:'.7rem',
                }}>▼</span>
              </button>
              {open===i && (
                <div style={{
                  padding:'18px 26px 22px',
                  background:C.sandPale,
                  borderTop:`1px solid ${C.sand}`,
                  animation:'fadeDown .3s ease both',
                }}>
                  <p style={{ fontSize:'.95rem',color:C.slate,lineHeight:1.75 }}>{f.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FINAL CTA ─────────────────────────────────────────────────────────────────
function FinalCTA({ onOpenUser, onOpenLawyer }) {
  return (
    <section style={{
      padding:'120px 0',
      background:`linear-gradient(160deg, ${C.ink} 0%, #26374A 40%, ${C.slate} 100%)`,
      position:'relative',overflow:'hidden',textAlign:'center',
    }}>
      <div style={{
        position:'absolute',inset:0,
        backgroundImage:`linear-gradient(rgba(212,206,196,.02) 1px,transparent 1px),
                         linear-gradient(90deg,rgba(212,206,196,.02) 1px,transparent 1px)`,
        backgroundSize:'40px 40px',
      }}/>
      <div style={{
        position:'absolute',top:'50%',left:'50%',
        transform:'translate(-50%,-50%)',
        width:800,height:800,borderRadius:'50%',
        border:'1px solid rgba(240,166,90,.05)',pointerEvents:'none',
      }}>
        <div style={{position:'absolute',inset:80,borderRadius:'50%',border:'1px solid rgba(212,206,196,.03)'}}/>
      </div>
      <div style={{ maxWidth:760,margin:'0 auto',padding:'0 24px',position:'relative',zIndex:1 }}>
        <div className="reveal" style={{ marginBottom:24 }}>
          <span style={{
            display:'inline-flex',alignItems:'center',gap:6,
            background:'rgba(240,166,90,.12)',border:'1px solid rgba(240,166,90,.25)',
            color:C.amber,padding:'5px 14px',borderRadius:9999,
            fontSize:'.72rem',fontWeight:700,letterSpacing:'.1em',
            textTransform:'uppercase',fontFamily:'var(--font-mono)',
          }}>Your Next Step</span>
        </div>
        <h2 className="reveal d1" style={{
          fontFamily:'var(--font-display)',fontSize:'clamp(2.2rem,5vw,3.8rem)',
          fontWeight:900,color:C.sand,lineHeight:1.1,marginBottom:20,
        }}>
          Your legal problem has a{' '}
          <em style={{
            fontStyle:'italic',color:'transparent',
            backgroundImage:`linear-gradient(135deg, ${C.amber}, ${C.rust})`,
            WebkitBackgroundClip:'text',backgroundClip:'text',
          }}>clear path forward.</em>
        </h2>
        <p className="reveal d2" style={{
          fontSize:'1.1rem',color:'rgba(212,206,196,.65)',marginBottom:52,lineHeight:1.75,maxWidth:580,margin:'0 auto 52px',
        }}>Whether you're facing a legal challenge or ready to grow your legal practice — Sanad gives you the structure, the tools, and the right people to make it happen.</p>
        <div className="reveal d3" style={{ display:'flex',gap:16,justifyContent:'center',flexWrap:'wrap',marginBottom:40 }}>
          <Btn variant="rust" onClick={onOpenUser} style={{padding:'17px 36px',fontSize:'1.05rem'}}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{flexShrink:0}}>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            I Need Legal Help
          </Btn>
          <Btn variant="ghost" onClick={onOpenLawyer} style={{padding:'17px 36px',fontSize:'1.05rem'}}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{flexShrink:0}}>
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            Join as a Founding Lawyer
          </Btn>
        </div>
        <p className="reveal d4" style={{ fontSize:'.82rem',color:'rgba(212,206,196,.3)',fontFamily:'var(--font-mono)' }}>
          Free to register · No credit card · Egypt-based verified lawyers · Arabic & English
        </p>
      </div>
    </section>
  );
}

// ─── FOOTER ────────────────────────────────────────────────────────────────────
function Footer({ onOpenUser, onOpenLawyer }) {
  return (
    <footer style={{ background:C.ink,borderTop:`1px solid rgba(212,206,196,.06)`,padding:'56px 0 28px' }}>
      <div style={{ maxWidth:1140,margin:'0 auto',padding:'0 24px' }}>
        <div style={{ display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',gap:40,marginBottom:48 }}>
          <div>
            <div style={{ fontFamily:'var(--font-display)',fontSize:'1.8rem',fontWeight:900,color:C.sand,marginBottom:14 }}>
              S<span style={{color:C.amber}}>a</span>nad
            </div>
            <p style={{ fontSize:'.9rem',color:'rgba(212,206,196,.4)',lineHeight:1.65,marginBottom:20,maxWidth:260 }}>
              Egypt's first outcome-driven legal platform. Connecting people with the right legal help — clearly, fairly, and digitally.
            </p>
            <div style={{ display:'flex',gap:10 }}>
              {['in','ig','fb'].map(s => (
                <a key={s} href="#" style={{
                  width:34,height:34,borderRadius:'50%',
                  background:'rgba(255,255,255,.05)',border:'1px solid rgba(212,206,196,.1)',
                  display:'flex',alignItems:'center',justifyContent:'center',
                  color:'rgba(212,206,196,.4)',fontSize:'.78rem',fontFamily:'var(--font-mono)',
                  textDecoration:'none',transition:'var(--t)',
                }}
                  onMouseEnter={e=>{e.currentTarget.style.background=`${C.amber}20`;e.currentTarget.style.color=C.amber;}}
                  onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,.05)';e.currentTarget.style.color='rgba(212,206,196,.4)';}}
                >{s}</a>
              ))}
            </div>
          </div>
          {[
            { title:'Platform', links:['How It Works','Features','Early Access','Download App'] },
            { title:'For Lawyers', links:['Join as a Lawyer','Founding Program','Pricing','Lawyer Support'] },
            { title:'Company', links:['About Sanad','Privacy Policy','Terms of Use','Contact Us'] },
          ].map(col => (
            <div key={col.title}>
              <h5 style={{ fontSize:'.72rem',fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',
                           color:C.amber,marginBottom:18,fontFamily:'var(--font-mono)' }}>{col.title}</h5>
              {col.links.map(l => (
                <a key={l} href="#" style={{
                  display:'block',fontSize:'.88rem',color:'rgba(212,206,196,.45)',
                  marginBottom:10,textDecoration:'none',transition:'color .2s',
                }}
                  onMouseEnter={e=>e.currentTarget.style.color=C.sand}
                  onMouseLeave={e=>e.currentTarget.style.color='rgba(212,206,196,.45)'}
                >{l}</a>
              ))}
            </div>
          ))}
        </div>
        <div style={{
          display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:16,
          paddingTop:24,borderTop:'1px solid rgba(212,206,196,.06)',
        }}>
          <p style={{ fontSize:'.82rem',color:'rgba(212,206,196,.3)' }}>© 2026 Sanad. All rights reserved.</p>
          <p style={{ fontSize:'.78rem',color:'rgba(212,206,196,.2)',maxWidth:420,textAlign:'right' }}>
            Sanad is a technology marketplace. Not a law firm. Does not provide legal advice. All legal services provided by independent licensed lawyers.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── ROOT PAGE ─────────────────────────────────────────────────────────────────
export default function SanadLandingPage() {
  const [userModalOpen, setUserModalOpen]     = useState(false);
  const [lawyerModalOpen, setLawyerModalOpen] = useState(false);

  // Inject global CSS once
  useEffect(() => {
    const id = 'sanad-global-css';
    if (!document.getElementById(id)) {
      const style = document.createElement('style');
      style.id = id;
      style.textContent = GLOBAL_CSS;
      document.head.appendChild(style);
    }
    return () => {
      const el = document.getElementById(id);
      if (el) el.remove();
    };
  }, []);

  // Responsive helper CSS
  useEffect(() => {
    const id = 'sanad-responsive-css';
    if (!document.getElementById(id)) {
      const style = document.createElement('style');
      style.id = id;
      style.textContent = `
        @media(max-width:900px) {
          .hide-mobile { display:none !important; }
          .show-mobile { display:block !important; }
        }
        @media(min-width:901px) {
          .show-mobile { display:none !important; }
        }
      `;
      document.head.appendChild(style);
    }
    return () => { const el = document.getElementById(id); if(el) el.remove(); };
  }, []);

  useReveal();

  return (
    <>
      {/* Modals */}
      <Modal
        open={userModalOpen}
        onClose={() => setUserModalOpen(false)}
        title="Join the Sanad Waitlist"
        subtitle="Get early access and join Early, Get More Attention. We'll notify you the moment we launch."
      >
        <UserWaitlistForm onClose={() => setUserModalOpen(false)} />
      </Modal>

      <Modal
        open={lawyerModalOpen}
        onClose={() => setLawyerModalOpen(false)}
        title="Register as a Founding Lawyer"
        subtitle="First 100 verified lawyers get 10% commission for 3 months, a Founding badge, and priority search placement."
      >
        <LawyerRegisterForm onClose={() => setLawyerModalOpen(false)} />
      </Modal>

      {/* Page */}
      <Nav onOpenUser={() => setUserModalOpen(true)} onOpenLawyer={() => setLawyerModalOpen(true)} />
      <Hero onOpenUser={() => setUserModalOpen(true)} onOpenLawyer={() => setLawyerModalOpen(true)} />
      <Problem />
      <Solution />
      <HowItWorks onOpenUser={() => setUserModalOpen(true)} onOpenLawyer={() => setLawyerModalOpen(true)} />
      <ValueProps />
      <Features />
      <Trust />
      <EarlyAccess onOpenUser={() => setUserModalOpen(true)} onOpenLawyer={() => setLawyerModalOpen(true)} />
      <FAQ />
      <FinalCTA onOpenUser={() => setUserModalOpen(true)} onOpenLawyer={() => setLawyerModalOpen(true)} />
      <Footer onOpenUser={() => setUserModalOpen(true)} onOpenLawyer={() => setLawyerModalOpen(true)} />
    </>
  );
}
