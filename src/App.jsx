
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
  { left: '-4%', top: '12%', delay: '-2s', duration: '18s', size: '23px' },
  { left: '8%', top: '36%', delay: '-9s', duration: '22s', size: '21px' },
  { left: '17%', top: '71%', delay: '-15s', duration: '20s', size: '24px' },
  { left: '31%', top: '22%', delay: '-5s', duration: '24s', size: '19px' },
  { left: '43%', top: '55%', delay: '-13s', duration: '19s', size: '22px' },
  { left: '57%', top: '82%', delay: '-18s', duration: '23s', size: '20px' },
  { left: '69%', top: '39%', delay: '-7s', duration: '18s', size: '25px' },
  { left: '82%', top: '15%', delay: '-12s', duration: '21s', size: '21px' },
];
function ButterflyFlight({ muted = false }) {
  if (muted) return null;
  return <div className="butterfly-flight" aria-hidden="true">
    {butterflyFlights.map((butterfly, i) => <span key={i} className={`flying-butterfly butterfly-${i + 1}`} style={{
      '--flight-left': butterfly.left, '--flight-top': butterfly.top,
      '--flight-delay': butterfly.delay, '--flight-duration': butterfly.duration, '--flight-size': butterfly.size,
    }}><span className="butterfly-glyph">🦋</span></span>)}
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
        <strong>{wedding.bride.name}</strong>
        <i className="paper-amp">&</i>
        <strong>{wedding.groom.name}</strong>
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
      <span>{wedding.brideSide.envelopeByline}</span>
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
    const content = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Pushpanjali and Ashish//EN', 'BEGIN:VEVENT', `UID:${event.number}-${date}@pushpanjali-ashish`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')}`, `DTSTART;VALUE=DATE:${date}`, `DTEND;VALUE=DATE:${end}`, `SUMMARY:${safe(event.name)}`, `LOCATION:${safe(event.venue)}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
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

function InvitationShowcase() {
  const shareUrl = 'https://wa.me/?text=' + encodeURIComponent(wedding.brideSide.whatsappMessage);
  return <section className="invite-section invitation-showcase-section" id="invitation">
    <SectionHeading eyebrow="AN INVITATION FROM OUR FAMILY" title="A Beautiful" accent="Beginning"/>
    <figure className="editorial-preview editorial-preview-photo" data-reveal>
      <a className="editorial-couple-photo-link" href={wedding.invitationCardImage} target="_blank" rel="noreferrer" aria-label="Open the full wedding invitation card">
        <img className="editorial-couple-photo" src={wedding.invitationCardImage} alt="Wedding invitation for Pushpanjali Kumari and Ashish Kumar Gupta, with their wedding dates and Darbhanga location" loading="lazy"/>
        <span className="editorial-card-name-reorder" aria-hidden="true">
          <strong>{wedding.bride.name}</strong><i>&</i><strong>{wedding.groom.name}</strong>
        </span>
        <span className="editorial-preview-open">OPEN INVITATION <ArrowUpRight size={14}/></span>
      </a>
      <figcaption><span>॥ श्री गणेशाय नमः ॥</span><small>WITH LOVE FROM PUSHPANJALI'S FAMILY</small></figcaption>
    </figure>
    <div className="editorial-actions editorial-share-actions">
      <a className="editorial-primary-action" href={shareUrl} target="_blank" rel="noreferrer">
        SHARE OUR INVITATION ON WHATSAPP <Share2 size={15}/>
      </a>
    </div>
  </section>;
}
function FamilyBlessings() {
  return <section className="family-blessings-section" aria-label="Pushpanjali's family and the groom's family" id="families">
    <div className="family-section-index"><span>02</span><i/><strong>OUR FAMILIES</strong></div>
    <div className="family-editorial-heading" data-reveal>
      <span className="family-hindi-kicker">शुभारम्भ</span>
      <h2>Our Beloved Daughter.<em>Two Families, One Celebration.</em></h2>
      <p>{wedding.brideSide.familyIntroduction}</p>
    </div>
    <div className="family-blessing-grid">
      <article className="family-blessing-card bride-family" data-reveal>
        <span className="family-card-kicker">OUR BELOVED DAUGHTER</span>
        <span className="family-card-flower" aria-hidden="true">✿</span>
        <div className="family-profile-portrait portrait-bride">
          <img src={wedding.bride.photo} alt={wedding.bride.photoAlt} loading="lazy" decoding="async" onError={e=>{e.currentTarget.onerror=null;e.currentTarget.src='/images/wedding-placeholder.svg';}}/>
        </div>
        <h3>{wedding.bride.name}</h3>
        <p className="family-card-hindi">{wedding.bride.hindi}</p>
        <div className="family-divider">✧</div>
        <p className="family-parent-name">{wedding.bride.father}</p>
        <p className="family-card-hindi">{wedding.bride.fatherHindi}</p>
        <p className="family-parent-name">{wedding.bride.mother}</p>
        <p className="family-card-hindi">{wedding.bride.motherHindi}</p>
      </article>
      <div className="family-union-mark" aria-label="Together in marriage">
        <span><Heart size={22} fill="currentColor" strokeWidth={1.2}/></span>
        <strong>बंधन</strong>
        <small>TOGETHER</small>
      </div>
      <article className="family-blessing-card groom-family" data-reveal>
        <span className="family-card-kicker">THE GROOM & HIS FAMILY</span>
        <span className="family-card-flower" aria-hidden="true">✿</span>
        <div className="family-profile-portrait portrait-groom">
          <img src={wedding.groom.photo} alt={wedding.groom.photoAlt} loading="lazy" decoding="async" onError={e=>{e.currentTarget.onerror=null;e.currentTarget.src='/images/wedding-placeholder.svg';}}/>
        </div>
        <h3>{wedding.groom.name}</h3>
        <p className="family-card-hindi">{wedding.groom.hindi}</p>
        <div className="family-divider">✧</div>
        <p className="family-parent-name">{wedding.groom.father}</p>
        <p className="family-card-hindi">{wedding.groom.fatherHindi}</p>
        <p className="family-parent-name">{wedding.groom.mother}</p>
        <p className="family-card-hindi">{wedding.groom.motherHindi}</p>
      </article>
    </div>
    <p className="family-blessing-line"><span>✿</span> May the blessings of both families guide their new journey <span>✿</span></p>
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
    <span className="section-eyebrow">THE WEDDING CELEBRATION</span>
    <h2>Where Our <em>Families Unite</em></h2>
    <strong>{address}</strong>
    <p>एम.जी. कॉलेज, सुंदरपुर, दरभंगा</p>
    <p>Our family looks forward to welcoming you here for the wedding celebration.</p>
    <a href={url} target="_blank" rel="noreferrer">VIEW DIRECTIONS <ArrowUpRight size={14}/></a>
  </section>;
}

function RSVP() {
  const eventSymbols = { 'MATKOR PUJA': '🌿', 'HALDI & MEHNDI': '🥣', WEDDING: '🔥' };
  return <section className="rsvp-invitation closing-invitation" id="rsvp" aria-label="Wedding invitation from the bride's family">
    <div className="closing-floral-corners" aria-hidden="true">
      <span className="closing-floral closing-floral-left">✿ ❀ 🌹</span>
      <span className="closing-floral closing-floral-right">🌹 ❀ ✿</span>
      <span className="closing-lantern closing-lantern-left">✧</span>
      <span className="closing-lantern closing-lantern-right">✧</span>
    </div>
    <div className="closing-invitation-content">
      <div className="closing-top-ornament" aria-hidden="true">✧　✿　❀　✿　✧</div>
      <span className="closing-invitation-eyebrow">YOU ARE CORDIALLY INVITED</span>
      <h2>Your Presence Is Our <em>Greatest Gift</em></h2>
      <div className="closing-heart-flourish" aria-hidden="true">─────── ♡ ───────</div>
      <p className="closing-invitation-message">
        We warmly invite you to celebrate the wedding of our beloved daughter
        <strong> {wedding.bride.name.split(' ')[0]} </strong>with
        <strong> {wedding.groom.name.split(' ')[0]}.</strong>
      </p>
      <div className="closing-event-frame">
        <div className="closing-event-grid">
          {wedding.events.map(event => {
            const title = event.name === 'WEDDING' ? 'WEDDING MUHURAT' : event.name;
            const date = new Date(`${event.isoDate}T12:00:00`).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
            return <article className="closing-event-card" key={event.number}>
              <span className="closing-event-symbol" aria-hidden="true">{eventSymbols[event.name] || '✿'}</span>
              <h3>{title}</h3>
              <p><CalendarDays size={16}/>{date}</p>
            </article>;
          })}
        </div>
      </div>
      <div className="closing-location"><MapPin size={22}/><span>Darbhanga, Bihar</span></div>
      <div className="closing-procession" aria-hidden="true">────── ✧　❀　✧ ──────</div>
      <p className="closing-blessing">With Love &amp; Blessings,</p>
      <div className="closing-family-name">The Family of {wedding.bride.name.split(' ').map(n => n[0] + n.slice(1).toLowerCase()).join(' ')}</div>
      <p className="closing-invitation-hindi">सादर आमंत्रण एवं हार्दिक स्वागत</p>
    </div>
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
    <SectionHeading eyebrow="BLESSINGS FOR OUR BELOVED DAUGHTER" title="Your Wishes" accent="Our Treasure"/>
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
    <h2>{wedding.bride.name.split(' ')[0]} <em>&</em> {wedding.groom.name.split(' ')[0]}</h2>
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
  const ambientAudio = useRef(null);

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
  const startMusic = React.useCallback(() => {
    let engine = ambientAudio.current;
    if (!engine) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) { setMusicOn(false); return; }
      const context = new AudioContextClass({ latencyHint: 'playback' });
      const master = context.createGain();
      const lowPass = context.createBiquadFilter();
      lowPass.type = 'lowpass';
      lowPass.frequency.setValueAtTime(1450, context.currentTime);
      lowPass.Q.setValueAtTime(0.55, context.currentTime);
      master.gain.setValueAtTime(0, context.currentTime);
      master.connect(lowPass);
      lowPass.connect(context.destination);

      // Original, non-melodic ambient bed: a soft Sa-Pa drone with slow breathing.
      const droneTones = [
        { frequency: 65.41, level: 0.12, detune: -2 },
        { frequency: 65.41, level: 0.12, detune: 2 },
        { frequency: 98.00, level: 0.075, detune: -1 },
        { frequency: 130.81, level: 0.055, detune: 1 },
        { frequency: 196.00, level: 0.032, detune: -1 },
        { frequency: 261.63, level: 0.018, detune: 1 },
        { frequency: 392.00, level: 0.009, detune: 0 },
      ];
      const voices = [];
      droneTones.forEach((tone, index) => {
        const oscillator = context.createOscillator();
        const voiceGain = context.createGain();
        const slowWave = context.createOscillator();
        const slowDepth = context.createGain();
        oscillator.type = index < 3 ? 'sine' : 'triangle';
        oscillator.frequency.setValueAtTime(tone.frequency, context.currentTime);
        oscillator.detune.setValueAtTime(tone.detune, context.currentTime);
        voiceGain.gain.setValueAtTime(tone.level, context.currentTime);
        slowWave.type = 'sine';
        slowWave.frequency.setValueAtTime(0.035 + index * 0.004, context.currentTime);
        slowDepth.gain.setValueAtTime(tone.level * 0.12, context.currentTime);
        slowWave.connect(slowDepth);
        slowDepth.connect(voiceGain.gain);
        oscillator.connect(voiceGain);
        voiceGain.connect(master);
        oscillator.start();
        slowWave.start();
        voices.push(oscillator, slowWave);
      });

      // A very quiet filtered air layer adds space without a beat or melody.
      const noiseBuffer = context.createBuffer(1, context.sampleRate * 3, context.sampleRate);
      const noiseData = noiseBuffer.getChannelData(0);
      for (let i = 0; i < noiseData.length; i += 1) noiseData[i] = (Math.random() * 2 - 1) * 0.35;
      const air = context.createBufferSource();
      const airFilter = context.createBiquadFilter();
      const airGain = context.createGain();
      air.buffer = noiseBuffer;
      air.loop = true;
      airFilter.type = 'bandpass';
      airFilter.frequency.setValueAtTime(620, context.currentTime);
      airFilter.Q.setValueAtTime(0.35, context.currentTime);
      airGain.gain.setValueAtTime(0.012, context.currentTime);
      air.connect(airFilter);
      airFilter.connect(airGain);
      airGain.connect(master);
      air.start();
      voices.push(air);
      engine = { context, master, voices, pauseTimer: null };
      ambientAudio.current = engine;
    }
    if (engine.pauseTimer) { window.clearTimeout(engine.pauseTimer); engine.pauseTimer = null; }
    engine.context.resume().then(() => {
      const now = engine.context.currentTime;
      engine.master.gain.cancelScheduledValues(now);
      engine.master.gain.setTargetAtTime(0.34, now, 1.25);
      setMusicOn(true);
    }).catch(() => setMusicOn(false));
  }, []);

  const toggleMusic = () => {
    const engine = ambientAudio.current;
    if (!musicOn) { startMusic(); return; }
    if (engine?.context && engine.master) {
      const now = engine.context.currentTime;
      engine.master.gain.cancelScheduledValues(now);
      engine.master.gain.setTargetAtTime(0, now, 0.45);
      engine.pauseTimer = window.setTimeout(() => {
        if (engine.context.state === 'running') engine.context.suspend().catch(() => {});
      }, 2200);
    }
    setMusicOn(false);
  };

  useEffect(() => () => {
    const engine = ambientAudio.current;
    if (!engine) return;
    if (engine.pauseTimer) window.clearTimeout(engine.pauseTimer);
    engine.context.close().catch(() => {});
    ambientAudio.current = null;
  }, []);
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
              <span className="section-eyebrow">{wedding.brideSide.perspectiveLabel}</span>
              <h1>{wedding.bride.name}<em>&</em>{wedding.groom.name}</h1>
              <p className="hero-hindi-names">{wedding.bride.hindi} ♥ {wedding.groom.hindi}</p>
              <div className="hero-date-chip">05 · 08 · 09 <small>DECEMBER {wedding.eventYear}</small></div>
              <div className="hero-photo-pair">
                <figure><img src={wedding.bride.photo} alt={wedding.bride.photoAlt} loading="eager" fetchPriority="high" decoding="async" onError={e=>{e.currentTarget.onerror=null;e.currentTarget.src='/images/wedding-placeholder.svg';}}/><figcaption>THE BRIDE</figcaption></figure>
                <span className="pair-heart">♥</span>
                <figure><img src={wedding.groom.photo} alt={wedding.groom.photoAlt} loading="eager" fetchPriority="high" decoding="async" onError={e=>{e.currentTarget.onerror=null;e.currentTarget.src='/images/wedding-placeholder.svg';}}/><figcaption>THE GROOM</figcaption></figure>
              </div>
              <p className="hero-verse">With joy and pride, we invite you to celebrate our beloved daughter, Pushpanjali, as she begins a beautiful new journey with Ashish.<br/>आप सपरिवार पधारकर नवदंपति को अपना आशीर्वाद दें।</p>
            </div>
            <span className="scroll-invite" aria-hidden="true">SCROLL TO EXPLORE <ChevronDown size={15}/></span>
          </section>

          <InvitationShowcase/>

          <FamilyBlessings/>

          <section className="invite-section event-section" id="events">
            <header className="celebrations-heading">
              <div className="celebrations-section-index"><span>03</span><i/><strong>THE CELEBRATIONS</strong></div>
              <p className="celebrations-hindi">मंगल अवसर</p>
              <div className="celebrations-title-row">
                <h2>Three days.<em>Countless memories.</em></h2>
                <p>{wedding.brideSide.eventsIntroduction}</p>
              </div>
            </header>
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
        <div className="wedding-floating-controls" aria-label="Music and page controls">
          <button
            type="button"
            className={`music-float-button ${musicOn ? 'music-is-on' : ''}`}
            onClick={toggleMusic}
            aria-label={musicOn ? 'Turn wedding background music off' : 'Turn wedding background music on'}
            aria-pressed={musicOn}
          >
            {musicOn ? <Pause size={17}/> : <Play size={17}/>}
            <span>{musicOn ? 'MUSIC ON' : 'MUSIC OFF'}</span>
          </button>
          {showTop && <button type="button" className="top-action" aria-label="Back to top" onClick={()=>window.scrollTo({top:0,behavior:reducedMotion?'auto':'smooth'})}><ArrowUpRight size={20}/></button>}
        </div>
{showBlessing && <div className="wish-toast" role="status" onAnimationEnd={()=>setShowBlessing(false)}><Sparkles size={16}/>{blessings[blessing]}</div>}
        </>}
      </div>
    {activePhoto >= 0 && <GalleryViewer photo={wedding.gallery[activePhoto]} index={activePhoto} total={wedding.gallery.length} onClose={closePhoto} onNext={nextPhoto} onPrevious={prevPhoto}/>}
  </>;
}
