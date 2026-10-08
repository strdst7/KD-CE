import { useRef, type ReactNode } from "react";
import { motion, useSpring, type HTMLMotionProps } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useExperience } from "./Experience";

export function StarMark({ className = "", face = false }: { className?: string; face?: boolean }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <path d="M50 14V86M14 50H86M25 25L75 75M25 75L75 25" stroke="currentColor" strokeWidth="20" strokeLinecap="round" />
      {face && <g stroke="#321b32" strokeLinecap="round"><path d="M40 47V50M60 47V50" strokeWidth="4" /><path d="M40 59Q50 69 60 59" strokeWidth="3" /></g>}
    </svg>
  );
}

export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const { animated } = useExperience();
  return (
    <motion.div className={className} initial={animated ? { opacity: 0, y: 38 } : false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

export function MagneticButton({ children, className = "", ...props }: HTMLMotionProps<"button">) {
  const ref = useRef<HTMLButtonElement>(null);
  const { animated } = useExperience();
  const x = useSpring(0, { stiffness: 280, damping: 20 });
  const y = useSpring(0, { stiffness: 280, damping: 20 });
  return (
    <motion.button {...props} ref={ref} className={`magnetic-button ${className}`} style={{ x, y }}
      onPointerMove={(event) => {
        if (!animated || event.pointerType !== "mouse" || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        x.set((event.clientX - rect.left - rect.width / 2) * 0.13);
        y.set((event.clientY - rect.top - rect.height / 2) * 0.18);
      }}
      onPointerLeave={() => { x.set(0); y.set(0); }} whileTap={animated ? { scale: 0.96 } : undefined}>
      {children}
    </motion.button>
  );
}

export function ActionButton({ children, onClick, light = false, className = "" }: { children: ReactNode; onClick: () => void; light?: boolean; className?: string }) {
  return <MagneticButton onClick={onClick} className={`action-button ${light ? "is-light" : ""} ${className}`}><span>{children}</span><span className="action-arrow"><ArrowUpRight size={20} strokeWidth={1.8} /></span></MagneticButton>;
}

export function SectionIntro({ label, children, description, className = "" }: { label: string; children: ReactNode; description?: string; className?: string }) {
  return (
    <div className={`section-intro ${className}`}>
      <Reveal><p className="eyebrow">{label}</p><h2>{children}</h2></Reveal>
      {description && <Reveal delay={0.12}><p className="section-description">{description}</p></Reveal>}
    </div>
  );
}