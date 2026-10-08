import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimationControls, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowDown, ArrowDownRight, ArrowUpRight, Menu, Pause, Play, X } from "lucide-react";
import { useExperience } from "./Experience";
import { ActionButton, StarMark } from "./UI";

const ambientArt = { scale: [1.025, 1.04, 1.025], rotate: 0, transition: { duration: 12, repeat: Infinity, ease: "easeInOut" as const } };

export function Navigation({ onJoin }: { onJoin: () => void }) {
  const { animated, systemReduced, toggleMotion } = useExperience();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => setScrolled(latest > 48));
  const links = [{ label: "The playground", href: "#playground" }, { label: "The bounties", href: "#bounties" }, { label: "The people", href: "#people" }];

  useEffect(() => {
    if (!menuOpen) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setMenuOpen(false); menuButton.current?.focus(); }
    };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, [menuOpen]);

  return (
    <header className={`site-nav ${scrolled ? "is-scrolled" : ""}`}>
      <div className="nav-inner">
        <a href="#top" className="brand-link" aria-label="KrackedDev home"><StarMark className="brand-star" /><span>krackeddev</span></a>
        <nav className="desktop-nav" aria-label="Main navigation">{links.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}</nav>
        <div className="nav-actions">
          <button className="motion-toggle" onClick={toggleMotion} disabled={systemReduced} aria-label={systemReduced ? "Reduced motion follows your device settings" : animated ? "Pause animations" : "Enable animations"} title={systemReduced ? "Reduced motion is enabled on your device" : animated ? "Pause the motion" : "Bring back the motion"}>{animated ? <Pause size={15} /> : <Play size={15} />}</button>
          <button className="nav-join" onClick={onJoin}>Come hang <ArrowUpRight size={16} /></button>
          <button ref={menuButton} className="mobile-menu-toggle" onClick={() => setMenuOpen((v) => !v)} aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} aria-controls="mobile-nav">{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
        </div>
      </div>
      <AnimatePresence>
        {menuOpen && <motion.nav id="mobile-nav" className="mobile-nav" aria-label="Mobile navigation" initial={animated ? { height: 0, opacity: 0 } : false} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
          {links.map((link) => <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>{link.label}<ArrowUpRight size={22} /></a>)}
          <button onClick={() => { setMenuOpen(false); onJoin(); }}>Find your people<ArrowUpRight size={22} /></button>
        </motion.nav>}
      </AnimatePresence>
    </header>
  );
}

export function Hero({ onJoin }: { onJoin: () => void }) {
  const { animated } = useExperience();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const parallax = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const artX = useSpring(0, { stiffness: 75, damping: 22 });
  const artY = useSpring(0, { stiffness: 75, damping: 22 });
  const artControls = useAnimationControls();
  const motionAllowed = useRef(animated);

  useEffect(() => {
    motionAllowed.current = animated;
    if (animated) void artControls.start(ambientArt);
    else { artControls.stop(); artControls.set({ scale: 1.025, rotate: 0 }); }
    return () => { motionAllowed.current = false; artControls.stop(); };
  }, [animated, artControls]);

  return (
    <section className="hero" id="top" ref={ref}
      onPointerMove={(event) => {
        if (!animated || event.pointerType !== "mouse") return;
        const rect = event.currentTarget.getBoundingClientRect();
        artX.set((event.clientX / rect.width - 0.5) * 14);
        artY.set(((event.clientY - rect.top) / rect.height - 0.5) * 12);
      }} onPointerLeave={() => { artX.set(0); artY.set(0); }}>
      <motion.button className="hero-art" style={{ y: animated ? parallax : 0 }} disabled={!animated} aria-label="Give the smiley mascot a little nudge"
        onClick={() => {
          if (!animated) return;
          void artControls.start({ rotate: [0, -1.6, 1.2, 0], scale: [1.025, 1.055, 1.025], transition: { duration: 0.75, ease: "easeInOut" } }).then(() => {
            if (motionAllowed.current) void artControls.start(ambientArt);
          });
        }}>
        <motion.img src="/images/kracked-playground.jpg" alt="A sunshine-yellow smiley flower, chrome ring, and cobalt arch in a pink sculptural playground" fetchPriority="high" draggable={false} initial={{ scale: 1.025 }} animate={artControls} style={{ x: animated ? artX : 0, y: animated ? artY : 0 }} />
      </motion.button>
      <div className="hero-word-wrap">
        <h1 className="hero-word" aria-label="KrackedDev">
          {"krackeddev".split("").map((letter, index) => <motion.span aria-hidden="true" key={index}
            initial={animated ? { y: "105%", rotate: index % 2 ? 8 : -8, opacity: 0 } : false}
            animate={{ y: 0, rotate: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 130, damping: 19, delay: animated ? 0.12 + index * 0.045 : 0 }}
            whileHover={animated ? { y: -14, rotate: index % 2 ? 5 : -5, scaleY: 1.08, transition: { type: "spring", stiffness: 350, damping: 13 } } : undefined}>{letter}</motion.span>)}
        </h1>
      </div>
      <motion.div className="hero-copy" initial={animated ? { opacity: 0, y: 28 } : false} animate={{ opacity: 1, y: 0 }} transition={{ delay: animated ? 0.65 : 0, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
        <h2>Good people.<br />Wild ideas.</h2>
        <p>A playground for developers, designers, artists, and ideas that don't fit in a box.</p>
        <div className="hero-ctas"><ActionButton onClick={onJoin}>Find your people</ActionButton><a href="#playground" className="text-link">Or make a little mess <ArrowDownRight size={18} /></a></div>
      </motion.div>
      <a className="hero-scroll" href="#playground"><motion.span animate={animated ? { y: [0, 5, 0] } : { y: 0 }} transition={{ duration: 2.1, repeat: animated ? Infinity : 0, ease: "easeInOut" }}><ArrowDown size={18} /></motion.span><span>There's more to play with</span></a>
    </section>
  );
}

export function KineticRibbon() {
  return <div className="kinetic-ribbon" role="img" aria-label="Less gatekeeping. More making."><div className="ribbon-track ambient-motion" aria-hidden="true">{[0, 1, 2, 3].map((copy) => <div className="ribbon-copy" key={copy}><span>LESS GATEKEEPING.</span><StarMark className="ribbon-star ambient-motion" /><span>MORE MAKING.</span><StarMark className="ribbon-star ambient-motion" /></div>)}</div></div>;
}