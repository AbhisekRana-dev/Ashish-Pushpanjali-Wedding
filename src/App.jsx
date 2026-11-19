
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

const butterflyFlights = [
  { left: '5%', top: '20%', delay: '-5s', duration: '28s', size: '22px' },
  { left: '28%', top: '68%', delay: '-17s', duration: '32s', size: '25px' },
  { left: '48%', top: '30%', delay: '-11s', duration: '25s', size: '19px' },
  { left: '68%', top: '78%', delay: '-22s', duration: '34s', size: '24px' },
  { left: '88%', top: '42%', delay: '-8s', duration: '29s', size: '20px' },
];
function ButterflyFlight({ muted = false }) {
  if (muted) return null;
  return <div className="butterfly-flight" aria-hidden="true">
    {butterflyFlights.map((butterfly, i) => <span key={i} className={`flying-butterfly butterfly-${i + 1}`} style={{
      '--flight-left': butterfly.left, '--flight-top': butterfly.top,
      '--flight-delay': butterfly.delay, '--flight-duration': butterfly.duration, '--flight-size': butterfly.size,
    }}>🦋</span>)}
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
    document.documentElement.classList.add('has-scroll-reveal');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
    nodes.forEach(node => observer.observe(node));
    return () => {
      observer.disconnect();
      document.documentElement.classList.remove('has-scroll-reveal');
    };
  }, [enabled]);
}


function EnvelopeOpening({ onReveal, onStartMusic }) {
  const reducedMotion = useReducedMotion();
  const [opened, setOpened] = useState(false);
  const [cardUp, setCardUp] = useState(false);

  const openEnvelope = () => {
    if (opened) return;
    setOpened(true);
    onStartMusic?.();
  };

  useEffect(() => {
    if (!opened) return;
    if (reducedMotion) {
      setCardUp(true);
      const revealTimer = window.setTimeout(onReveal, 250);
      return () => window.clearTimeout(revealTimer);
    }
    const cardTimer = window.setTimeout(() => setCardUp(true), 650);
    const revealTimer = window.setTimeout(onReveal, 2250);
    return () => {
      window.clearTimeout(cardTimer);
      window.clearTimeout(revealTimer);
    };
  }, [opened, reducedMotion, onReveal]);

  return <section className={`envelope-scroll-section ${cardUp ? 'envelope-is-open' : 'envelope-is-closed'}`} aria-label="The wedding invitation envelope">
    <Petals muted={reducedMotion}/>
    <div className="envelope-intro-copy">
      <span className="intro-overline">A LITTLE SOMETHING, SEALED WITH LOVE</span>
      <h1>A Special Invitation <em>For You</em></h1>
      <p>{opened ? 'Your invitation is opening...' : 'Tap the envelope to open your invitation'}</p>
    </div>
    <div className={`envelope-stage ${opened ? 'is-opening' : ''} ${cardUp ? 'card-is-up' : ''}`}>
      <div className="envelope-glow"/>
      <div className="invitation-paper">
        <div className="paper-floral-corner top-left">✿</div>
        <div className="paper-floral-corner top-right">❀</div>
        <span className="paper-mantra">॥ श्री गणेशाय नमः ॥</span>
        <span className="paper-caption">THE WEDDING CELEBRATION OF</span>
        <strong>{wedding.groom.name}</strong>
        <i className="paper-amp">&</i>
        <strong>{wedding.bride.name}</strong>
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
        <div className="gold-wax-seal" aria-hidden="true">
          <span className="wax-edge"/>
          <span className="wax-center"><Heart size={25} fill="currentColor" strokeWidth={1.2}/></span>
        </div>
      </div>
      <button
        className="envelope-open-button"
        type="button"
        onClick={openEnvelope}
        disabled={opened}
        aria-label={opened ? 'Envelope opening' : 'Tap once to open the wedding envelope'}
      />
    </div>
    <div className="envelope-under-copy">
      <span className="tiny-flourish">✦</span>
      <span>WITH LOVE, ASHISH & PUSHPANJALI</span>
      <span className="tiny-flourish">✦</span>
    </div>
    <div className="envelope-scroll-hint" aria-hidden="true">
      {cardUp ? 'YOUR INVITATION IS OPEN — SCROLL DOWN' : 'ONE TAP TO OPEN'}
      <ChevronDown size={15}/>
    </div>
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
  return <article className={`event-detail-card event-${event.theme}`} data-reveal>
    <div className="event-card-visual">
      <img src={event.image} alt={event.imageAlt} loading="lazy" onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/wedding-placeholder.svg'; }}/>
      <span className="event-visual-shade"/>
      <span className="event-card-number">{event.number}</span>
      <span className="event-card-date-hindi">{event.dateHindi}</span>
      <span className="event-card-deco">{event.icon}</span>
    </div>
    <div className="event-card-copy">
      <span className="event-date-label"><CalendarDays size={14}/> {event.date} · {wedding.eventYear}</span>
      <h3>{event.name}</h3>
      <p className="event-hindi">{event.nameHindi}</p>
      <div className="event-place"><MapPin size={15}/><span>{event.venue}</span></div>
      <div className="event-card-actions"><a href={mapsUrl} target="_blank" rel="noreferrer">DIRECTIONS <ArrowUpRight size={13}/></a><button type="button" onClick={addCalendar}>ADD TO CALENDAR <CalendarDays size={13}/></button></div>
    </div>
  </article>;
}

function FamilyBlessings() {
  return <section className="family-blessings-section" aria-label="Family details">
    <SectionHeading eyebrow="WITH THE BLESSINGS OF OUR ELDERS" title="Two Families" accent="One Celebration"/>
    <div className="family-blessing-grid">
      <article className="family-blessing-card groom-family" data-reveal>
        <div className="family-profile-portrait groom-portrait"><span>{wedding.groom.name.charAt(0)}</span><small>THE GROOM</small></div><span className="family-card-flower">❀</span><span className="family-card-kicker">GROOM'S FAMILY</span>
        <h3>{wedding.groom.name}</h3><p className="family-card-hindi">{wedding.groom.hindi}</p>
        <div className="family-divider">✦</div>
        <p>{wedding.groom.father}</p><p className="family-card-hindi">{wedding.groom.fatherHindi}</p>
        <p>{wedding.groom.mother}</p><p className="family-card-hindi">{wedding.groom.motherHindi}</p>
      </article>
      <article className="family-blessing-card bride-family" data-reveal>
        <div className="family-profile-portrait bride-portrait"><span>{wedding.bride.name.charAt(0)}</span><small>THE BRIDE</small></div><span className="family-card-flower">✿</span><span className="family-card-kicker">BRIDE'S FAMILY</span>
        <h3>{wedding.bride.name}</h3><p className="family-card-hindi">{wedding.bride.hindi}</p>
        <div className="family-divider">✦</div>
        <p>{wedding.bride.father}</p><p className="family-card-hindi">{wedding.bride.fatherHindi}</p>
        <p>{wedding.bride.mother}</p><p className="family-card-hindi">{wedding.bride.motherHindi}</p>
      </article>
    </div>
  </section>;
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
  const [envelopeRevealed, setEnvelopeRevealed] = useState(false);
  const revealWebsite = React.useCallback(() => setEnvelopeRevealed(true), []);
  const [activePhoto, setActivePhoto] = useState(-1);
  const [showBlessing, setShowBlessing] = useState(false);
  const [blessing, setBlessing] = useState(0);
  const [musicOn, setMusicOn] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const [showTop, setShowTop] = useState(false);
  const musicPlayer = useRef(null);

  useReveal(envelopeRevealed);

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
  const sendMusicCommand = command => {
    const frame = musicPlayer.current;
    if (!frame?.contentWindow) return false;
    frame.contentWindow.postMessage(JSON.stringify({ event: 'command', func: command, args: [] }), 'https://www.youtube.com');
    return true;
  };
  const startMusic = React.useCallback(() => { setMusicOn(true); }, []);
  const toggleMusic = () => {
    const next = !musicOn;
    sendMusicCommand(next ? 'playVideo' : 'pauseVideo');
    setMusicOn(next);
    document.getElementById('music')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };
  const handleMusicPlayerLoad = () => { if (musicOn) sendMusicCommand('playVideo'); };
  const openPhoto = index => setActivePhoto(index);
  const closePhoto = () => setActivePhoto(-1);
  const nextPhoto = () => setActivePhoto(i => (i + 1) % wedding.gallery.length);
  const prevPhoto = () => setActivePhoto(i => (i - 1 + wedding.gallery.length) % wedding.gallery.length);

  return <>

    <div className="invite-website"><div className="page-progress" style={{ transform: `scaleX(${scrollPct})` }}/><ButterflyFlight muted={reducedMotion}/>
        <main>
          <EnvelopeOpening onReveal={revealWebsite} onStartMusic={startMusic}/>
          {envelopeRevealed && <>
          <section className="invite-hero" id="home">
            <Petals muted={reducedMotion}/>
            <div className="hero-card-art" data-reveal>
              <span className="hero-small-mantra">॥ श्री गणेशाय नमः ॥</span>
              <span className="section-eyebrow">TOGETHER WITH OUR FAMILIES</span>
              <h1>{wedding.groom.name}<em>&</em>{wedding.bride.name}</h1>
              <p className="hero-hindi-names">{wedding.groom.hindi} ♥ {wedding.bride.hindi}</p>
              <div className="hero-date-chip">05 · 08 · 09 <small>DECEMBER {wedding.eventYear}</small></div>
              <div className="hero-photo-pair">
                <figure><img src={wedding.groom.photo} alt={wedding.groom.photoAlt} onError={e=>{e.currentTarget.onerror=null;e.currentTarget.src='/images/wedding-placeholder.svg';}}/><figcaption>THE GROOM</figcaption></figure>
                <span className="pair-heart">♥</span>
                <figure><img src={wedding.bride.photo} alt={wedding.bride.photoAlt} onError={e=>e.currentTarget.style.opacity='0'}/><figcaption>THE BRIDE</figcaption></figure>
              </div>
              <p className="hero-verse">Two hearts, one promise, a lifetime of togetherness.<br/>We request the honour of your presence and blessings.</p>
            </div>
            <span className="scroll-invite" aria-hidden="true">SCROLL TO EXPLORE <ChevronDown size={15}/></span>
          </section>

          <section className="wedding-song-section" id="music" aria-label="Ganesh Vandana instrumental music">
            <div className="wedding-song-card" data-reveal>
              <span className="wedding-song-ornament">॥ ॐ गं गणपतये नमः ॥</span>
              <span className="section-eyebrow">A SACRED BEGINNING</span>
              <h2>श्री गणेश <em>वंदना</em></h2>
              <p className="wedding-song-subtitle">A peaceful flute instrumental inspired by Ganesh Vandana — a gentle blessing to begin the wedding celebrations</p>
              <div className="wedding-song-player">
                <iframe
                  ref={musicPlayer}
                  title="Divine Om Gan Ganapataye Flute Instrumental — Flutewala Music"
                  src={wedding.backgroundMusic + "?autoplay=1&controls=1&enablejsapi=1&playsinline=1&rel=0&origin=" + encodeURIComponent(window.location.origin)}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                  onLoad={handleMusicPlayerLoad}
                />
              </div>
              <p className="wedding-song-credit">ॐ गं गणपतये नमः · Divine Om Gan Ganapataye · Flute instrumental by Flutewala Music</p>
              <button type="button" className="wedding-song-toggle" onClick={toggleMusic}>
                {musicOn ? <Pause size={17}/> : <Play size={17}/>}
                {musicOn ? 'PAUSE VANDANA' : 'PLAY VANDANA'}
              </button>
            </div>
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

          <FamilyBlessings/>

          <section className="invite-section event-section" id="events">
            <SectionHeading eyebrow="PLEASE JOIN US" title="Wedding" accent="Celebrations"/>
            <div className="event-card-list">{wedding.events.map(event=><EventCard key={event.number} event={event}/>)}</div>
            <CountDown/>
          </section>

          <Venue/>

          <Gallery onOpen={openPhoto}/>

          <BlessingForm/>
          <RSVP/>
          </>}
        </main>
        {envelopeRevealed && <>
        <Footer/>
        <nav className="mobile-quick-dock" aria-label="Wedding quick navigation">
          <a href="#events"><CalendarDays size={18}/><span>EVENTS</span></a>
          <a href="#gallery"><Flower2 size={18}/><span>GALLERY</span></a>
          <button type="button" className="dock-music" onClick={toggleMusic} aria-label={musicOn ? "Pause Ganesh Vandana instrumental" : "Play Ganesh Vandana instrumental"}>{musicOn ? <Pause size={18}/> : <Music2 size={18}/>}<span>{musicOn ? 'PLAYING' : 'VANDANA'}</span></button>
          <a href="#rsvp"><Heart size={18}/><span>RSVP</span></a>
        </nav>
        {showTop && <button type="button" className="top-action" aria-label="Back to top" onClick={()=>window.scrollTo({top:0,behavior:reducedMotion?'auto':'smooth'})}><ArrowUpRight size={17}/></button>}
        {showBlessing && <div className="wish-toast" role="status" onAnimationEnd={()=>setShowBlessing(false)}><Sparkles size={16}/>{blessings[blessing]}</div>}
        </>}
      </div>
    {activePhoto >= 0 && <GalleryViewer photo={wedding.gallery[activePhoto]} index={activePhoto} total={wedding.gallery.length} onClose={closePhoto} onNext={nextPhoto} onPrevious={prevPhoto}/>}
  </>;
}
