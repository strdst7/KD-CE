import { forwardRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useSpring } from "motion/react";
import { ArrowUpRight, Bookmark } from "lucide-react";
import { briefs, type Brief } from "./data";
import { useExperience } from "./Experience";
import { SectionIntro } from "./UI";

const BriefTile = forwardRef<HTMLElement, { brief: Brief; saved: boolean; onSave: () => void; onOpen: () => void }>(function BriefTile({ brief, saved, onSave, onOpen }, ref) {
  const { animated } = useExperience();
  const [hovered, setHovered] = useState(false);
  const x = useSpring(0, { stiffness: 230, damping: 24 });
  const y = useSpring(0, { stiffness: 230, damping: 24 });

  return (
    <motion.article ref={ref} className="brief-tile" layout={animated} initial={animated ? { opacity: 0, y: 24 } : false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
      <button className="brief-open" onClick={onOpen} aria-label={`Open brief: ${brief.title}`}>
        <div className={`brief-art brief-art-${brief.id}`} style={{ backgroundColor: brief.color }}
          onPointerEnter={(event) => { if (event.pointerType === "mouse") setHovered(true); }}
          onPointerLeave={() => setHovered(false)}
          onPointerMove={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            x.set(event.clientX - rect.left - 42); y.set(event.clientY - rect.top - 42);
          }}>
          <motion.img src={brief.image} alt={brief.id === "mascot" ? "A yellow smiley flower art toy" : brief.id === "directory" ? "A sculptural chrome K on cobalt blue" : "A coral loop and yellow ring on lilac"} loading="lazy" draggable={false}
            animate={{ scale: hovered && animated ? 1.075 : 1, rotate: hovered && animated ? (brief.id === "directory" ? -2 : 2) : 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} />
          <motion.span className="brief-cursor" aria-hidden="true" style={{ x, y }} animate={{ opacity: hovered && animated ? 1 : 0, scale: hovered && animated ? 1 : 0.7 }} transition={{ duration: 0.2 }}>Take<br />a look<ArrowUpRight size={18} /></motion.span>
        </div>
        <div className="brief-title"><h3>{brief.title}</h3><span className="brief-title-arrow"><ArrowUpRight size={24} strokeWidth={1.6} /></span></div>
      </button>
      <div className="brief-details"><span>{brief.category}<span className="meta-dot" />{brief.deadline}</span><strong>{brief.reward}</strong></div>
      <div className="brief-bottom"><span>{brief.sponsor}</span><button onClick={onSave} aria-label={saved ? `Unsave ${brief.title}` : `Save ${brief.title}`} aria-pressed={saved} className={saved ? "is-saved" : ""}><Bookmark size={15} fill={saved ? "currentColor" : "none"} /><span>{saved ? "Saved" : "Save brief"}</span></button></div>
    </motion.article>
  );
});

export function BountyBoard({ saved, onSave, onOpen }: { saved: string[]; onSave: (id: string) => void; onOpen: (brief: Brief) => void }) {
  const { animated } = useExperience();
  const [filter, setFilter] = useState("All");
  const [savedOnly, setSavedOnly] = useState(false);
  const list = briefs.filter((brief) => (filter === "All" || brief.category === filter) && (!savedOnly || saved.includes(brief.id)));

  return (
    <section className="bounties-section section-pad" id="bounties">
      <div className="page-width">
        <SectionIntro label="Your next side quest" description="A good excuse to try something new, with a real brief and a reward at the finish line.">Good briefs.<br /><span className="serif-word">Great excuses.</span></SectionIntro>
        <div className="brief-filters">
          <LayoutGroup id="brief-filter"><div className="filter-tabs" role="group" aria-label="Filter bounties by discipline">{["All", "Design", "Code", "Motion"].map((category) => <button key={category} onClick={() => setFilter(category)} aria-pressed={filter === category} className={filter === category ? "is-active" : ""}>{category}{category === "All" && <sup>03</sup>}{filter === category && <motion.span layoutId="active-filter" className="filter-line" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}</button>)}</div></LayoutGroup>
          <button className={`saved-filter ${savedOnly ? "is-active" : ""}`} aria-pressed={savedOnly} onClick={() => setSavedOnly((value) => !value)}><Bookmark size={16} fill={savedOnly ? "currentColor" : "none"} />Your picks <span>{saved.length}</span></button>
        </div>
        <motion.div className="brief-grid" layout={animated}>
          <AnimatePresence mode="popLayout">{list.map((brief) => <BriefTile key={brief.id} brief={brief} saved={saved.includes(brief.id)} onSave={() => onSave(brief.id)} onOpen={() => onOpen(brief)} />)}</AnimatePresence>
        </motion.div>
        {list.length === 0 && <div className="empty-picks"><Bookmark size={28} /><h3>A little room for possibility.</h3><p>{savedOnly ? "Save a brief that makes you curious. It'll be right here when you're ready." : "No briefs in this discipline yet. Try a different one."}</p><button className="text-link" onClick={() => { setSavedOnly(false); setFilter("All"); }}>Show all the good stuff <ArrowUpRight size={18} /></button></div>}
        <div className="bounty-note"><span>A rough first attempt beats a perfect someday.</span><span>All disciplines. All experience levels.</span></div>
      </div>
    </section>
  );
}