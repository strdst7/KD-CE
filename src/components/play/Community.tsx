import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight, Plus } from "lucide-react";
import { members, gatherings, type Gathering } from "./data";
import { useExperience } from "./Experience";
import { ActionButton, Reveal, SectionIntro, StarMark } from "./UI";

export function Community({ onJoin }: { onJoin: () => void }) {
  const { animated } = useExperience();
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const slide = useTransform(scrollYProgress, [0, 1], [42, -42]);
  const selected = members[active];

  return (
    <section className="community-section section-pad" id="people" ref={ref}>
      <div className="page-width">
        <SectionIntro label="Find your kind of weird" description="Different backgrounds. Different obsessions. The same feeling of finally finding your people.">Different brains.<br /><span className="serif-word">Same wavelength.</span></SectionIntro>
        <motion.div className="member-strip" style={{ x: animated ? slide : 0 }}>
          {members.map((member, index) => <motion.button key={member.name} className={`member-photo ${active === index ? "is-selected" : ""}`} onClick={() => setActive(index)} aria-pressed={active === index} aria-label={`Meet ${member.name}, ${member.role}`} initial={false}
            animate={{ rotate: animated ? [-5, 3, -3, 5][index] : 0, y: active === index && animated ? -9 : 0 }}
            whileHover={animated ? { rotate: 0, y: -18, scale: 1.035 } : undefined} whileFocus={animated ? { rotate: 0, y: -18 } : undefined} transition={{ type: "spring", stiffness: 200, damping: 19 }}>
            <div className="member-image"><img src={member.image} alt={`Creative portrait study representing ${member.name}`} style={{ objectPosition: member.position }} loading="lazy" draggable={false} /><span className="member-wave" aria-hidden="true"><ArrowUpRight size={26} /></span></div>
            <div className="member-caption"><span>{member.name}</span><p>{member.role}</p></div>
          </motion.button>)}
        </motion.div>
        <div className="member-quote-area"><AnimatePresence mode="wait"><motion.blockquote key={selected.name} initial={animated ? { opacity: 0, y: 15 } : false} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}><p>"{selected.quote}"</p><footer>{selected.name}, one of the beautifully curious</footer></motion.blockquote></AnimatePresence></div>
        <div className="community-join"><ActionButton onClick={onJoin} light>There's room for you, too</ActionButton><StarMark className="community-flower ambient-motion" /></div>
      </div>
    </section>
  );
}

export function Gatherings({ rsvps, onOpen }: { rsvps: string[]; onOpen: (event: Gathering) => void }) {
  const { animated } = useExperience();
  return (
    <section className="gatherings-section section-pad" id="happenings">
      <div className="page-width gatherings-layout">
        <SectionIntro label="Same place. Good company." description="Bring your unfinished project, your favorite drink, or just yourself. We're very good at making room.">The internet.<br /><span className="serif-word">But a bit friendlier.</span></SectionIntro>
        <div className="gathering-list">{gatherings.map((event, index) => <Reveal key={event.id} delay={index * 0.07}><motion.button className="gathering-row" onClick={() => onOpen(event)} whileHover={animated ? { x: 5 } : undefined} transition={{ type: "spring", stiffness: 230, damping: 24 }}><span className="gathering-date"><strong>{event.day}</strong><span>{event.month}</span></span><span className="gathering-text"><span>{event.kind}</span><h3>{event.name}</h3><p>{event.place}</p></span><span className={`gathering-arrow ${rsvps.includes(event.id) ? "is-going" : ""}`}>{rsvps.includes(event.id) ? <span>In</span> : <ArrowUpRight size={21} />}</span></motion.button></Reveal>)}</div>
      </div>
    </section>
  );
}

const questions = [
  { question: "Do I have to be 'good' at something?", answer: "Only at being curious. First projects, career pivots, side quests, and happy accidents belong here. You don't need a polished portfolio to pull up a chair." },
  { question: "What can I actually make here?", answer: "Anything you're excited about. A tiny game, a poster, a useful tool, a very unnecessary animation. Bounties have a brief; the rest of the playground is yours to explore." },
  { question: "Is this the official KrackedDev site?", answer: "No. This is an independent, playable design exploration for the open creative bounty. The briefs, member profiles, and gatherings are illustrative. Forms save locally on your device; they don't create a real account." },
];

export function Questions() {
  const { animated } = useExperience();
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="questions-section section-pad" id="questions"><div className="page-width questions-layout">
      <SectionIntro label="Before you jump in">No secret handshake.<br /><span className="serif-word">Just curiosity.</span></SectionIntro>
      <div className="question-list">{questions.map((item, index) => <div className="question-item" key={item.question}><button id={`question-${index}`} aria-expanded={open === index} aria-controls={`answer-${index}`} onClick={() => setOpen(open === index ? null : index)}><h3>{item.question}</h3><motion.span animate={{ rotate: open === index ? 45 : 0 }} transition={{ duration: 0.25 }}><Plus size={21} /></motion.span></button><AnimatePresence initial={false}>{open === index && <motion.div id={`answer-${index}`} role="region" aria-labelledby={`question-${index}`} initial={animated ? { height: 0, opacity: 0 } : false} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}><p>{item.answer}</p></motion.div>}</AnimatePresence></div>)}</div>
    </div></section>
  );
}

export function Footer({ onJoin }: { onJoin: () => void }) {
  const { animated, toggleMotion, systemReduced } = useExperience();
  return (
    <footer className="creative-footer" id="join">
      <div className="page-width">
        <Reveal><div className="footer-invite"><div><p className="eyebrow">You don't have to fit in. You just have to show up.</p><h2>Your weird<br /><span className="serif-word">is welcome.</span></h2><ActionButton onClick={onJoin}>Let's make something</ActionButton></div><motion.div className="footer-mascot" animate={animated ? { rotate: [-9, 8, -9], y: [0, -15, 0] } : { rotate: 0, y: 0 }} transition={{ duration: 7, repeat: animated ? Infinity : 0, ease: "easeInOut" }}><StarMark face /></motion.div></div></Reveal>
        <div className="footer-rule"><a href="#top" className="brand-link"><StarMark className="brand-star" /><span>krackeddev</span></a><div className="footer-links"><a href="#playground">Play</a><a href="#bounties">Make</a><a href="#people">Belong</a><a href="#questions">Questions</a></div><a href="#top" className="back-top">Back to top <ArrowUpRight size={17} /></a></div>
        <div className="footer-bottom"><p>An independent creative exploration. Not the official KrackedDev site.</p><button onClick={toggleMotion} disabled={systemReduced}>{systemReduced ? "Reduced motion enabled" : animated ? "Motion is on. Take a breather?" : "Motion is off. Bring it back?"}</button></div>
      </div>
    </footer>
  );
}