
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, CalendarDays, Check, ChevronDown, Clock3, Copy, Flower2, Heart, MapPin, Music2, Pause, Play, Share2, Sparkles, X } from 'lucide-react';
import { wedding } from './data/wedding.js';

const flowerPetals = Array.from({ length: 20 }, (_, i) => i);
const blessings = [
  'May your home always be filled with laughter.',
  'May every new morning bring you closer.',
  'May love and kindness light your journey.',
  'May the blessings of elders stay with you.',
];

function Petals({ muted = false }) {
  if (muted) return null;
  return <div className="petal-sprinkle" aria-hidden="true">
    {flowerPetals.map(i => <i key={i} style={{ '--left': `${(i * 43) % 100}%`, '--delay': `${(i % 9) * -1.4}s`, '--duration': `${12 + (i % 6) * 2}s`, '--drift': `${((i * 23) % 110) - 55}px` }} />)}
  </div>;
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!media) return;
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener?.('change', update);
    return () => media.removeEventListener?.('change', update);
  }, []);
  return reduced;
}

function useReveal(enabled) {
  useEffect(() => {
    if (!enabled) return;
    const nodes = document.querySelectorAll('[data-reveal]');
    if (!('IntersectionObserver' in window)) {
      nodes.forEach(node => node.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
    nodes.forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, [enabled]);
}

function EnvelopeIntro({ onContinue, onSkip, reducedMotion }) {
  const [opened, setOpened] = useState(false);
  const [cardUp, setCardUp] = useState(false);
  const [stage, setStage] = useState('sealed');
  const openEnvelope = () => {
    if (opened) return;
    setOpened(true);
    setStage('opening');
    if (reducedMotion) {
      setCardUp(true);
      setStage('revealed');
      return;
    }
    window.setTimeout(() => setCardUp(true), 700);
    window.setTimeout(() => setStage('revealed'), 2350);
  };
  return <main className="envelope-intro" aria-label="Wedding invitation envelope">
    <Petals muted={reducedMotion}/>
    <button className="intro-skip" type="button" onClick={onSkip}>SKIP INTRO <ArrowUpRight size={14}/></button>
    <div className="envelope-intro-copy">
      <span className="intro-overline">A LITTLE SOMETHING, SEALED WITH LOVE</span>
      <h1>A Special Invitation <em>For You</em></h1>
      <p>Tap the golden seal to open your invitation</p>
    </div>
    <div className={`envelope-stage ${opened ? 'is-opening' : ''} ${cardUp ? 'card-is-up' : ''}`}>
      <div className="envelope-glow"/>
      <div className="invitation-paper">
        <div className="paper-floral-corner top-left">✿</div><div className="paper-floral-corner top-right">❀</div>
        <span className="paper-mantra">॥ श्री गणेशाय नमः ॥</span>
        <span className="paper-caption">THE WEDDING CELEBRATION OF</span>
        <strong>{wedding.groom.name}</strong><i className="paper-amp">&</i><strong>{wedding.bride.name}</strong>
        <span className="paper-date">05 · 08 · 09 DECEMBER {wedding.eventYear}</span>
        <span className="paper-venue">DARBHANGA · BIHAR</span>
      </div>
      <div className="envelope-body">
        <div className="envelope-texture"/>
        <div className="envelope-back-fold"/>
        <div className="envelope-pocket-left"/>
        <div className="envelope-pocket-right"/>
        <div className="envelope-pocket-bottom"/>
        <div className="envelope-flap"><span/></div>
        <button className={`gold-wax-seal ${opened ? 'seal-broken' : ''}`} onClick={openEnvelope} type="button" aria-label="Break the golden wax seal and open invitation" disabled={opened}>
          <span className="wax-edge"/><span className="wax-center"><Heart size={25} fill="currentColor" strokeWidth={1.2}/></span>
        </button>
      </div>
    </div>
    <div className="envelope-under-copy">
      <span className="tiny-flourish">✦</span>
      <span>{stage === 'revealed' ? 'YOUR INVITATION IS READY' : 'WITH LOVE, ASHISH & PUSHPANJALI'}</span>
      <span className="tiny-flourish">✦</span>
    </div>
    {stage === 'revealed' && <button type="button" className="continue-invitation" onClick={onContinue}>OPEN THE INVITATION <ArrowDown size={15}/></button>}
  </main>;
}

function ScratchReveal({ onReveal, reducedMotion }) {
  const canvasRef = useRef(null);
  const drawRef = useRef({ drawing: false, previous: null, checked: false });
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (reducedMotion) {
      setRevealed(true);
      return;
    }
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    const box = canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(box.width * ratio));
    canvas.height = Math.max(1, Math.round(box.height * ratio));
    ctx.scale(ratio, ratio);
    const grad = ctx.createLinearGradient(0, 0, box.width, box.height);
    grad.addColorStop(0, '#e7c89b');
    grad.addColorStop(.45, '#bf9664');
    grad.addColorStop(1, '#ead6b2');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, box.width, box.height);
    ctx.strokeStyle = 'rgba(255,255,255,.36)';
    ctx.lineWidth = 1.5;
    for (let x = -box.height; x < box.width + box.height; x += 18) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + box.height, box.height); ctx.stroke();
    }
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const getPoint = event => {
      const rect = canvas.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };
    const start = event => {
      if (revealed) return;
      event.preventDefault();
      drawRef.current.drawing = true;
      drawRef.current.previous = getPoint(event);
      canvas.setPointerCapture?.(event.pointerId);
      ctx.beginPath();
      ctx.arc(drawRef.current.previous.x, drawRef.current.previous.y, 22, 0, Math.PI * 2);
      ctx.fill();
    };
    const move = event => {
      if (!drawRef.current.drawing || revealed) return;
      const p = getPoint(event);
      ctx.beginPath();
      ctx.lineWidth = 48;
      ctx.moveTo(drawRef.current.previous?.x ?? p.x, drawRef.current.previous?.y ?? p.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      drawRef.current.previous = p;
      if (drawRef.current.checked) return;
      drawRef.current.checked = true;
      requestAnimationFrame(() => {
        drawRef.current.checked = false;
        try {
          const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
          let clear = 0; let total = 0;
          for (let i = 3; i < pixels.length; i += 64) { total++; if (pixels[i] < 24) clear++; }
          if (total && clear / total > .34) setRevealed(true);
        } catch { /* Canvas readback can be unavailable in hardened browsers. */ }
      });
    };
    const stop = () => { drawRef.current.drawing = false; drawRef.current.previous = null; };
    canvas.addEventListener('pointerdown', start);
    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerup', stop);
    canvas.addEventListener('pointercancel', stop);
    canvas.addEventListener('lostpointercapture', stop);
    return () => {
      canvas.removeEventListener('pointerdown', start);
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerup', stop);
      canvas.removeEventListener('pointercancel', stop);
      canvas.removeEventListener('lostpointercapture', stop);
    };
  }, [reducedMotion, revealed]);

  return <section className={`scratch-greeting ${revealed ? 'scratch-is-revealed' : ''}`} aria-label="Scratch to reveal a greeting">
    <div className="scratch-heading">
      <span className="section-eyebrow">A SMALL SURPRISE</span>
      <h2>Scratch to Reveal <em>Our Love</em></h2>
      <p>Gently rub the heart and discover a little message from us.</p>
    </div>
    <div className="scratch-heart-card">
      <div className="scratch-underlay">
        <span className="scratch-heart-icon">♡</span>
        <strong>Save the Date!</strong>
        <span>We can't wait to celebrate with you</span>
        <small>ASHISH & PUSHPANJALI</small>
      </div>
      <svg className="heart-scratch-clip" viewBox="0 0 320 290" aria-hidden="true">
        <defs><clipPath id="scratchHeartClip"><path d="M160 270 C135 247 22 174 22 92 C22 12 118 -10 160 58 C202 -10 298 12 298 92 C298 174 185 247 160 270Z"/></clipPath></defs>
        <foreignObject x="0" y="0" width="320" height="290" clipPath="url(#scratchHeartClip)">
          <canvas ref={canvasRef} className="scratch-canvas" aria-label="Scratch over the heart to reveal the message"/>
        </foreignObject>
      </svg>
      <div className="scratch-label">SCRATCH HERE</div>
    </div>
    {!revealed ? <button className="scratch-tap" type="button" onClick={() => setRevealed(true)}>TAP TO REVEAL INSTEAD</button> :
      <button className="scratch-continue" type="button" onClick={onReveal}>CONTINUE TO INVITATION <ArrowDown size={14}/></button>}
  </section>;
}

function CountDown() {
  const target = useMemo(() => new Date(`${wedding.eventYear}-12-09T00:00:00+05:30`).getTime(), []);
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const left = Math.max(0, target - now);
  const values = [
    ['DAYS', Math.floor(left / 86400000)],
    ['HOURS', Math.floor((left / 3600000) % 24)],
    ['MINUTES', Math.floor((left / 60000) % 60)],
    ['SECONDS', Math.floor((left / 1000) % 60)],
  ];
  return <div className="countdown-strip" aria-label="Countdown to December 9, 2026">
    {values.map(([label, value]) => <div className="countdown-cell" key={label}><strong>{String(value).padStart(2, '0')}</strong><span>{label}</span></div>)}
  </div>;
}

function SectionHeading({ eyebrow, title, accent }) {
  return <header className="content-heading" data-reveal>
    <span className="section-eyebrow">{eyebrow}</span>
    <h2>{title} <em>{accent}</em></h2>
    <span className="heading-flourish">— ✿ —</span>
  </header>;
}

function EventCard({ event }) {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.searchVenue)}`;
  const addCalendar = () => {
    if (!event.isoDate) return;
    const [year, month, day] = event.isoDate.split('-').map(Number);
    const end = new Date(Date.UTC(year, month - 1, day + 1)).toISOString().slice(0, 10).replaceAll('-', '');
    const date = event.isoDate.replaceAll('-', '');
    const safe = value => String(value || '').replace(/\\/g, '\\\\').replace(/[,;]/g, '\\$&').replace(/\n/g, '\\n');
    const content = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Ashish and Pushpanjali//EN', 'BEGIN:VEVENT', `UID:${event.number}-${date}@ashish-pushpanjali`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')}`, `DTSTART;VALUE=DATE:${date}`, `DTEND;VALUE=DATE:${end}`, `SUMMARY:${safe(event.name)}`, `LOCATION:${safe(event.venue)}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const url = URL.createObjectURL(new Blob([content], { type: 'text/calendar' }));
    const link = document.createElement('a'); link.href = url; link.download = `${event.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.ics`; link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1500);
  };
  return <article className="event-detail-card" data-reveal>
    <div className="event-card-number">{event.number}</div>
    <div className="event-card-copy">
      <span className="event-date-label"><CalendarDays size={14}/> {event.date} · {wedding.eventYear}</span>
      <h3>{event.name}</h3>
      <p className="event-hindi">{event.nameHindi}</p>
      <div className="event-place"><MapPin size={15}/><span>{event.venue}</span></div>
      <div className="event-card-actions"><a href={mapsUrl} target="_blank" rel="noreferrer">DIRECTIONS <ArrowUpRight size={13}/></a><button type="button" onClick={addCalendar}>ADD TO CALENDAR <CalendarDays size={13}/></button></div>
    </div>
    <div className="event-card-flower" aria-hidden="true">{event.icon}</div>
  </article>;
}

function Gallery({ onOpen }) {
  return <section className="invite-section gallery-section" id="gallery">
    <SectionHeading eyebrow="A FEW BEAUTIFUL MOMENTS" title="Love in" accent="Every Detail"/>
    <div className="photo-mosaic">
      {wedding.gallery.map((photo, index) => <button key={photo.title} type="button" className={`photo-tile tile-${index + 1}`} onClick={() => onOpen(index)} aria-label={`Open ${photo.title}`}>
        <img src={photo.image} alt={photo.alt} loading="lazy" onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/wedding-placeholder.svg'; }}/>
        <span className="photo-tile-shade"/><span className="photo-tile-caption"><small>0{index + 1}</small><strong>{photo.title}</strong></span>
      </button>)}
    </div>
    <p className="gallery-demo-note">Some images are sample inspiration images. Replace them with your own wedding photographs in <code>src/data/wedding.js</code>.</p>
  </section>;
}

function GalleryViewer({ photo, index, total, onClose, onPrevious, onNext }) {
  useEffect(() => {
    const key = e => { if (e.key === 'Escape') onClose(); if (e.key === 'ArrowRight') onNext(); if (e.key === 'ArrowLeft') onPrevious(); };
    document.addEventListener('keydown', key);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', key); document.body.style.overflow = ''; };
  }, [onClose, onNext, onPrevious]);
  return <div className="gallery-viewer" role="dialog" aria-modal="true" aria-label={photo.alt} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    <button type="button" className="viewer-close" onClick={onClose} aria-label="Close gallery"><X/></button>
    <button type="button" className="viewer-arrow previous" onClick={onPrevious} aria-label="Previous photo"><ArrowLeft/></button>
    <img src={photo.image} alt={photo.alt}/>
    <button type="button" className="viewer-arrow next" onClick={onNext} aria-label="Next photo"><ArrowRight/></button>
    <span className="viewer-counter">{index + 1} / {total}</span>
  </div>;
}

function Venue() {
  const address = 'M.G. COLLEGE, SUNDARPUR, DARBHANGA';
  const url = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('M.G. College, Sundarpur, Darbhanga, Bihar');
  return <section className="venue-panel" id="venue" data-reveal>
    <div className="venue-map-mark"><MapPin size={27}/></div>
    <span className="section-eyebrow">WHERE WE SAY I DO</span>
    <h2>A Place for <em>Our Forever</em></h2>
    <strong>{address}</strong>
    <p>एम.जी. कॉलेज, सुंदरपुर, दरभंगा</p>
    <a href={url} target="_blank" rel="noreferrer">VIEW DIRECTIONS <ArrowUpRight size={14}/></a>
  </section>;
}

function RSVP() {
  const [form, setForm] = useState({ name: '', attendance: 'Joyfully attending', guests: '', mobile: '', message: '' });
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);
  const change = key => event => setForm(current => ({ ...current, [key]: event.target.value }));
  const submit = event => {
    event.preventDefault();
    if (!form.name.trim() || (form.attendance === 'Joyfully attending' && !form.guests) || (form.mobile && !/^[0-9+() -]{7,18}$/.test(form.mobile))) return;
    setDone(true);
  };
  const copy = async () => {
    const text = [
      'Wedding RSVP', `Name: ${form.name}`, `Mobile: ${form.mobile || 'Not provided'}`, `Attendance: ${form.attendance}`,
      `Guests: ${form.attendance === "Sorry, can't make it" ? '0' : (form.guests || 'Not confirmed')}`, `Message: ${form.message || '—'}`,
    ].join('\n');
    try { await navigator.clipboard.writeText(text); setCopied(true); } catch { setCopied(false); }
  };
  return <section className="rsvp-invitation" id="rsvp">
    <span className="section-eyebrow">A REPLY WOULD MEAN THE WORLD</span>
    <h2>Will You <em>Join Us?</em></h2>
    <p>We would be so happy to celebrate this special day with you.</p>
    {done ? <div className="rsvp-confirmation" role="status"><Check size={24}/><h3>Thank you, {form.name}!</h3><p>Your response is ready to share with the family.</p><button type="button" onClick={copy}><Copy size={14}/>{copied ? 'COPIED' : 'COPY RSVP DETAILS'}</button><button type="button" className="edit-rsvp" onClick={() => setDone(false)}>EDIT RESPONSE</button></div> :
      <form className="rsvp-invitation-form" onSubmit={submit}>
        <label>YOUR NAME<input value={form.name} onChange={change('name')} placeholder="Your full name" maxLength={100} required/></label>
        <label>MOBILE NUMBER <span className="optional">(OPTIONAL)</span><input value={form.mobile} onChange={change('mobile')} inputMode="tel" placeholder="Your mobile number" maxLength={18}/></label>
        <label>WILL YOU ATTEND?<select value={form.attendance} onChange={change('attendance')}><option>Joyfully attending</option><option>Sorry, can't make it</option><option>Maybe</option></select></label>
        <label>NUMBER OF GUESTS<select value={form.guests} onChange={change('guests')} disabled={form.attendance === "Sorry, can't make it"} required={form.attendance === 'Joyfully attending'}><option value="" disabled>Select guest count</option>{[1,2,3,4,5].map(n=><option key={n} value={String(n)}>{n} {n===1?'guest':'guests'}</option>)}<option value="6+">6+ guests</option></select></label>
        <label>A NOTE FOR THE COUPLE <textarea value={form.message} onChange={change('message')} rows={3} maxLength={500} placeholder="Your wishes and blessings..."/></label>
        <button className="rsvp-submit" type="submit">SEND YOUR RSVP <ArrowUpRight size={15}/></button>
        <small>This invitation preview prepares a shareable RSVP; it does not submit to a guest database.</small>
      </form>}
  </section>;
}

function BlessingForm() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [items, setItems] = useState(() => {
    try { const parsed = JSON.parse(localStorage.getItem('ashish-pushpanjali-wishes') || '[]'); return Array.isArray(parsed) ? parsed.slice(0, 8) : []; }
    catch { return []; }
  });
  const submit = e => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    const next = [{ id: Date.now(), name: name.trim(), message: message.trim() }, ...items].slice(0, 8);
    setItems(next);
    try { localStorage.setItem('ashish-pushpanjali-wishes', JSON.stringify(next)); } catch { /* local storage not available */ }
    setName(''); setMessage('');
  };
  return <section className="wishes-section" id="wishes">
    <SectionHeading eyebrow="A LITTLE LOVE FROM YOU" title="Your Wishes" accent="Our Treasure"/>
    <form className="wish-form" onSubmit={submit}>
      <input value={name} onChange={e => setName(e.target.value)} maxLength={50} placeholder="Your name" required aria-label="Your name"/>
      <textarea value={message} onChange={e => setMessage(e.target.value)} maxLength={220} rows={3} placeholder="Leave a lovely message..." required aria-label="Your message"/>
      <button type="submit">SEND A WISH <Heart size={14}/></button>
      <small>Wishes are stored only in this browser, not sent to the couple.</small>
    </form>
    {items.length > 0 && <div className="wish-list">{items.map(item=><blockquote key={item.id}><p>“{item.message}”</p><cite>— {item.name}</cite></blockquote>)}</div>}
  </section>;
}

function Footer() {
  return <footer className="invite-footer">
    <div className="footer-flower">✿</div>
    <p>WITH LOVE & BLESSINGS</p>
    <h2>{wedding.groom.name.split(' ')[0]} <em>&</em> {wedding.bride.name.split(' ')[0]}</h2>
    <span>05 · 08 · 09 DECEMBER {wedding.eventYear}</span>
    <small>MADE WITH LOVE · DARBHANGA, BIHAR</small>
  </footer>;
}

export default function App() {
  const reducedMotion = useReducedMotion();
  const [introDone, setIntroDone] = useState(() => {
    try { return sessionStorage.getItem('ashish-pushpanjali-intro-v2') === 'done'; }
    catch { return false; }
  });
  const [sectionReady, setSectionReady] = useState(false);
  const [activePhoto, setActivePhoto] = useState(-1);
  const [showBlessing, setShowBlessing] = useState(false);
  const [blessing, setBlessing] = useState(0);
  const [musicOn, setMusicOn] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const [showTop, setShowTop] = useState(false);
  const audio = useRef(null);

  useReveal(sectionReady);

  const finishIntro = () => {
    try { sessionStorage.setItem('ashish-pushpanjali-intro-v2', 'done'); } catch { /* session storage disabled */ }
    setIntroDone(true);
    window.setTimeout(() => {
      setSectionReady(true);
      document.getElementById('home')?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    }, 80);
  };
  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(max > 0 ? window.scrollY / max : 0);
      setShowTop(window.scrollY > 500);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  const toggleMusic = async () => {
    if (!audio.current) return;
    if (musicOn) { audio.current.pause(); setMusicOn(false); return; }
    try { await audio.current.play(); setMusicOn(true); } catch { setMusicOn(false); }
  };
  const openPhoto = index => setActivePhoto(index);
  const closePhoto = () => setActivePhoto(-1);
  const nextPhoto = () => setActivePhoto(i => (i + 1) % wedding.gallery.length);
  const prevPhoto = () => setActivePhoto(i => (i - 1 + wedding.gallery.length) % wedding.gallery.length);

  return <>
    <audio ref={audio} src={wedding.backgroundMusic} loop preload="none" onPause={() => setMusicOn(false)} onPlay={() => setMusicOn(true)}/>
    {!introDone ? <EnvelopeIntro onContinue={finishIntro} onSkip={finishIntro} reducedMotion={reducedMotion}/> :
      <div className="invite-website"><div className="page-progress" style={{ transform: `scaleX(${scrollPct})` }}/>
        <main>
          <section className="invite-hero" id="home">
            <Petals muted={reducedMotion}/>
            <div className="hero-card-art" data-reveal>
              <span className="hero-small-mantra">॥ श्री गणेशाय नमः ॥</span>
              <span className="section-eyebrow">TOGETHER WITH OUR FAMILIES</span>
              <h1>{wedding.groom.name}<em>&</em>{wedding.bride.name}</h1>
              <p className="hero-hindi-names">{wedding.groom.hindi} ♥ {wedding.bride.hindi}</p>
              <div className="hero-date-chip">05 · 08 · 09 <small>DECEMBER {wedding.eventYear}</small></div>
              <div className="hero-photo-pair">
                <figure><img src={wedding.groom.photo} alt={wedding.groom.photoAlt} onError={e=>e.currentTarget.style.opacity='0'}/><figcaption>THE GROOM</figcaption></figure>
                <span className="pair-heart">♥</span>
                <figure><img src={wedding.bride.photo} alt={wedding.bride.photoAlt} onError={e=>e.currentTarget.style.opacity='0'}/><figcaption>THE BRIDE</figcaption></figure>
              </div>
              <p className="hero-verse">Two hearts, one promise, a lifetime of togetherness.<br/>We request the honour of your presence and blessings.</p>
            </div>
            <a href="#invitation-details" className="scroll-invite">SCROLL TO EXPLORE <ChevronDown size={15}/></a>
          </section>

          <section className="invite-section" id="invitation-details">
            <SectionHeading eyebrow="WITH THE BLESSINGS OF OUR FAMILIES" title="The Wedding" accent="Invitation"/>
            <div className="invitation-message-card" data-reveal>
              <span className="card-floral">❀</span>
              <p className="invitation-mantra">॥ श्री गणेशाय नमः ॥</p>
              <p>With immense joy and the blessings of our elders,</p>
              <p>we cordially invite you and your family to grace the wedding celebrations of</p>
              <h3>{wedding.groom.name}</h3><span className="invite-amp">&</span><h3>{wedding.bride.name}</h3>
              <p className="invitation-last-line">Your presence will make our celebration complete.</p>
            </div>
          </section>

          <section className="invite-section event-section" id="events">
            <SectionHeading eyebrow="PLEASE JOIN US" title="Wedding" accent="Celebrations"/>
            <div className="event-card-list">{wedding.events.map(event=><EventCard key={event.number} event={event}/>)}</div>
            <CountDown/>
          </section>

          <Venue/>

          <Gallery onOpen={openPhoto}/>

          <section className="scratch-section-wrap" id="scratch">
            <ScratchReveal onReveal={() => document.getElementById('invitation-details')?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' })} reducedMotion={reducedMotion}/>
          </section>

          <BlessingForm/>
          <RSVP/>
        </main>
        <Footer/>
        <div className="float-actions">
          <button type="button" className={`music-action ${musicOn ? 'active' : ''}`} onClick={toggleMusic} aria-label={musicOn ? 'Pause music' : 'Play music'}>{musicOn ? <Pause size={17}/> : <Play size={17}/>}<span>{musicOn ? 'MUSIC ON' : 'MUSIC'}</span></button>
          {showTop && <button type="button" className="top-action" aria-label="Back to top" onClick={()=>window.scrollTo({top:0,behavior:reducedMotion?'auto':'smooth'})}><ArrowUpRight size={17}/></button>}
        </div>
        {showBlessing && <div className="wish-toast" role="status" onAnimationEnd={()=>setShowBlessing(false)}><Sparkles size={16}/>{blessings[blessing]}</div>}
      </div>}
    {activePhoto >= 0 && <GalleryViewer photo={wedding.gallery[activePhoto]} index={activePhoto} total={wedding.gallery.length} onClose={closePhoto} onNext={nextPhoto} onPrevious={prevPhoto}/>}
  </>;
}
