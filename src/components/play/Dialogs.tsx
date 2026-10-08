import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Bookmark, CalendarPlus, Check, X } from "lucide-react";
import { useExperience } from "./Experience";
import { ActionButton, MagneticButton, StarMark } from "./UI";
import { type Brief, type Gathering, type Profile } from "./data";

export function Dialog({ children, onClose, focusKey }: { children: ReactNode; onClose: () => void; focusKey: string }) {
  const { animated } = useExperience();
  const panel = useRef<HTMLElement>(null);
  const close = useRef(onClose);
  close.current = onClose;

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    const background = document.getElementById("experience-content");
    document.body.style.overflow = "hidden";
    if (background) background.inert = true;
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); close.current(); }
      if (event.key !== "Tab" || !panel.current) return;
      const nodes = Array.from(panel.current.querySelectorAll<HTMLElement>('a[href], button:not(:disabled), input, select, textarea, [tabindex="0"]')).filter((node) => node.getClientRects().length > 0);
      const first = nodes[0]; const last = nodes[nodes.length - 1];
      if (!first) { event.preventDefault(); panel.current.focus(); return; }
      if (event.shiftKey && (document.activeElement === first || document.activeElement === panel.current)) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || document.activeElement === panel.current)) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", keydown);
    return () => {
      document.body.style.overflow = previousOverflow;
      if (background) background.inert = false;
      document.removeEventListener("keydown", keydown);
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    const raf = requestAnimationFrame(() => panel.current?.focus({ preventScroll: true }));
    return () => cancelAnimationFrame(raf);
  }, [focusKey]);

  return <motion.div className="dialog-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onPointerDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <motion.section ref={panel} className="dialog-panel" role="dialog" aria-modal="true" aria-labelledby="dialog-title" tabIndex={-1}
      initial={animated ? { opacity: 0, y: 60, rotate: 2 } : false} animate={{ opacity: 1, y: 0, rotate: 0 }} exit={{ opacity: 0, y: 35 }} transition={{ type: "spring", stiffness: 230, damping: 26 }}>
      <button className="dialog-close" onClick={onClose} aria-label="Close dialog"><X size={22} /></button>{children}
    </motion.section>
  </motion.div>;
}

export function BriefDetails({ brief, saved, onSave, onApply }: { brief: Brief; saved: boolean; onSave: () => void; onApply: () => void }) {
  return <div className="brief-dialog">
    <p className="eyebrow">A {brief.category.toLowerCase()} side quest</p><h2 id="dialog-title">{brief.title}</h2>
    <div className="dialog-art"><img src={brief.image} alt={brief.shortTitle} className={brief.id === "mascot" ? "mascot-detail" : ""} /></div>
    <div className="brief-reward"><strong>{brief.reward}<span>the reward</span></strong><p>{brief.deadline}<span>Sponsored by {brief.sponsor}</span></p></div>
    <p className="dialog-description">{brief.description}</p><h3 className="deliverables-label">What to bring to the table</h3>
    <ul className="deliverables">{brief.deliverables.map((line) => <li key={line}><Check size={17} /><span>{line}</span></li>)}</ul>
    <div className="dialog-actions"><ActionButton onClick={onApply}>I'm up for it</ActionButton><button className="dialog-save" onClick={onSave} aria-pressed={saved}><Bookmark size={18} fill={saved ? "currentColor" : "none"} />{saved ? "Saved to your picks" : "Save for a little later"}</button></div>
    <p className="concept-note">An illustrative brief for this creative exploration, not an active commission.</p>
  </div>;
}

export function JoinForm({ profile, brief, onSubmit, onClose }: { profile: Profile | null; brief?: Brief; onSubmit: (value: Profile) => void; onClose: () => void }) {
  const { animated } = useExperience();
  const [name, setName] = useState(profile?.name ?? "");
  const [email, setEmail] = useState(profile?.email ?? "");
  const [discipline, setDiscipline] = useState(profile?.discipline ?? "");
  const [done, setDone] = useState(false);
  const successTitle = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (done) successTitle.current?.focus({ preventScroll: true });
  }, [done]);

  if (done) return <div className="join-success"><StarMark face className="success-star" /><p className="eyebrow">A very good new beginning</p><h2 id="dialog-title" ref={successTitle} tabIndex={-1}>You're in the mix,<br /><span className="serif-word">{name.trim().split(" ")[0]}.</span></h2><p>Your demo profile{brief ? ` and interest in "${brief.title}"` : ""} is saved on this device. Nothing was sent to a server.</p><ActionButton onClick={() => { onClose(); document.getElementById("playground")?.scrollIntoView({ behavior: animated ? "smooth" : "auto" }); }}>Back to the playground</ActionButton></div>;

  return <div className="join-dialog"><p className="eyebrow">There's room for your kind of weird</p><h2 id="dialog-title">Hey, curious<br /><span className="serif-word">human.</span></h2><p className="dialog-description">{brief ? `Feeling inspired by "${brief.title}"? Tell us a little about yourself.` : "No auditions. No perfect portfolios. Just you, and whatever you're excited to make."}</p>
    <form className="join-form" onSubmit={(event) => {
      event.preventDefault();
      if (name.trim().length < 2) {
        const input = event.currentTarget.elements.namedItem("name") as HTMLInputElement;
        input.setCustomValidity("Tell us your name, using at least two characters."); input.reportValidity(); return;
      }
      onSubmit({ name: name.trim(), email: email.trim(), discipline, ...(brief ? { interest: brief.id } : {}) }); setDone(true);
    }}>
      <label>Your name<input type="text" name="name" autoComplete="given-name" required minLength={2} maxLength={60} value={name} onChange={(event) => { event.currentTarget.setCustomValidity(""); setName(event.target.value); }} placeholder="What should we call you?" /></label>
      <label>Your email<input type="email" name="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@somewhere.nice" /></label>
      <label>What are you into?<select name="discipline" required value={discipline} onChange={(event) => setDiscipline(event.target.value)}><option value="" disabled>Pick your current obsession</option>{["Design", "Development", "Art & illustration", "Motion & film", "Words & stories", "A little bit of everything"].map((option) => <option key={option}>{option}</option>)}</select></label>
      <MagneticButton type="submit" className="action-button form-submit"><span>{profile ? "Save my corner of the playground" : "Make a little room for me"}</span><span className="action-arrow"><ArrowUpRight size={20} /></span></MagneticButton>
      <p className="concept-note">Concept mode: this saves a profile locally, not a real account. No emails are sent.</p>
    </form>
  </div>;
}

function addToCalendar(event: Gathering) {
  const escape = (value: string) => value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/([;,])/g, "\\$1");
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//KrackedDev Creative Concept//EN", "BEGIN:VEVENT", `UID:${event.id}@krackeddev-concept.local`, `DTSTAMP:${stamp}`, `DTSTART:${event.start}`, `DTEND:${event.end}`, `SUMMARY:${escape(event.name)}`, `DESCRIPTION:${escape(`Illustrative event for the KrackedDev creative concept. ${event.description}`)}`, `LOCATION:${escape(event.place)}`, "END:VEVENT", "END:VCALENDAR"];
  const content = lines.map((line) => (line.match(/.{1,73}/g) ?? [line]).join("\r\n ")).join("\r\n") + "\r\n";
  const url = URL.createObjectURL(new Blob([content], { type: "text/calendar;charset=utf-8" }));
  const link = document.createElement("a"); link.href = url; link.download = `krackeddev-${event.id}.ics`; link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function EventDetails({ event, going, onToggle }: { event: Gathering; going: boolean; onToggle: () => void }) {
  return <div className="event-dialog"><p className="eyebrow">{event.kind}</p><h2 id="dialog-title">{event.name}</h2><div className="event-time"><span className="event-big-date">{event.day}<small>{event.month} 2026</small></span><div><strong>{event.time}</strong><p>{event.place}</p></div></div><p className="dialog-description">{event.description}</p>
    {going ? <div className="rsvp-confirmation" role="status"><Check size={23} /><div><strong>A little space, just for you.</strong><p>Your demo RSVP is saved on this device. No booking was sent.</p></div></div> : <ActionButton onClick={onToggle}>Count me in</ActionButton>}
    {going && <div className="event-actions"><button className="calendar-button" onClick={() => addToCalendar(event)}><CalendarPlus size={19} />Add to my calendar</button><button className="text-link" onClick={onToggle}>Undo RSVP</button></div>}
    <p className="concept-note">An imagined gathering for this concept. Calendar downloads are marked as illustrative.</p>
  </div>;
}