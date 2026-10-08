import { useEffect, useRef, useState, type RefObject } from "react";
import { AnimatePresence, animate, motion, useMotionValue } from "motion/react";
import { Download, Move, Plus, RotateCcw, Shuffle } from "lucide-react";
import { useExperience } from "./Experience";
import { SectionIntro } from "./UI";
import { ToyArt, toyNames, type ToyKind } from "./ToyArt";

type Toy = { id: number; kind: ToyKind; x: number; y: number; size: number; rotation: number };
type Dimensions = { width: number; height: number };
const INITIAL: Toy[] = [
  { id: 1, kind: "flower", x: 0.24, y: 0.43, size: 208, rotation: -12 },
  { id: 2, kind: "ring", x: 0.52, y: 0.68, size: 174, rotation: -16 },
  { id: 3, kind: "cube", x: 0.77, y: 0.34, size: 160, rotation: 12 },
  { id: 4, kind: "wave", x: 0.78, y: 0.74, size: 151, rotation: 14 },
  { id: 5, kind: "blob", x: 0.48, y: 0.3, size: 153, rotation: -9 },
  { id: 6, kind: "orb", x: 0.13, y: 0.78, size: 101, rotation: 0 },
];
const KINDS: ToyKind[] = ["flower", "ring", "orb", "cube", "wave", "blob"];
const COLORS = [{ name: "Lilac", color: "#ded3f0" }, { name: "Butter", color: "#f7edc4" }, { name: "Mint", color: "#d3e8d7" }];
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const toySize = (toy: Toy, width: number) => Math.min(toy.size, width < 600 ? width * 0.29 : toy.size);

function DraggableToy({ toy, dimensions, bounds, onMove, onRotate }: { toy: Toy; dimensions: Dimensions; bounds: RefObject<HTMLDivElement | null>; onMove: (id: number, x: number, y: number) => void; onRotate: (id: number) => void }) {
  const { animated } = useExperience();
  const size = toySize(toy, dimensions.width);
  const targetX = clamp(toy.x * dimensions.width - size / 2, 0, dimensions.width - size);
  const targetY = clamp(toy.y * dimensions.height - size / 2, 0, dimensions.height - size);
  const x = useMotionValue(targetX);
  const y = useMotionValue(targetY);

  useEffect(() => {
    if (!animated) { x.set(targetX); y.set(targetY); return; }
    const a = animate(x, targetX, { type: "spring", stiffness: 180, damping: 22 });
    const b = animate(y, targetY, { type: "spring", stiffness: 180, damping: 22 });
    return () => { a.stop(); b.stop(); };
  }, [x, y, targetX, targetY, animated]);

  return <motion.button className="canvas-toy" data-toy-id={toy.id} style={{ x, y, width: size, height: size }}
    drag dragConstraints={bounds} dragElastic={0.08} dragMomentum={false}
    initial={animated ? { opacity: 0, scale: 0.4, rotate: toy.rotation - 30 } : false}
    animate={{ rotate: toy.rotation }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.15 }} exit={{ opacity: 0, scale: 0 }}
    transition={{ type: "spring", stiffness: 220, damping: 19 }}
    whileHover={animated ? { scale: 1.08 } : undefined} whileDrag={{ scale: animated ? 1.12 : 1, zIndex: 20 }} whileTap={animated ? { scale: 0.96 } : undefined}
    onDragEnd={() => onMove(toy.id, (x.get() + size / 2) / dimensions.width, (y.get() + size / 2) / dimensions.height)}
    onClick={() => onRotate(toy.id)}
    aria-label={`${toyNames[toy.kind]}. Drag or use arrow keys to move. Click or press Enter to rotate.`}
    onKeyDown={(event) => {
      const moves: Record<string, [number, number]> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
      if (!moves[event.key]) return;
      event.preventDefault();
      const step = event.shiftKey ? 35 : 15;
      const [dx, dy] = moves[event.key];
      const nextX = clamp(x.get() + dx * step, 0, dimensions.width - size);
      const nextY = clamp(y.get() + dy * step, 0, dimensions.height - size);
      onMove(toy.id, (nextX + size / 2) / dimensions.width, (nextY + size / 2) / dimensions.height);
    }}><ToyArt kind={toy.kind} /></motion.button>;
}

export function Playground() {
  const stage = useRef<HTMLDivElement>(null);
  const nextId = useRef(7);
  const [dimensions, setDimensions] = useState<Dimensions>({ width: 1100, height: 450 });
  const [toys, setToys] = useState<Toy[]>(INITIAL);
  const [color, setColor] = useState(COLORS[0].color);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!stage.current) return;
    const el = stage.current;
    const resize = () => setDimensions({ width: el.clientWidth, height: el.clientHeight });
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 3500);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const move = (id: number, x: number, y: number) => setToys((items) => items.map((toy) => toy.id === id ? { ...toy, x, y } : toy));
  const rotate = (id: number) => setToys((items) => items.map((toy) => toy.id === id ? { ...toy, rotation: toy.rotation + 45 } : toy));
  const add = () => {
    if (toys.length >= 12) return;
    const id = nextId.current++;
    setToys((items) => [...items, { id, kind: KINDS[(id - 1) % KINDS.length], x: 0.2 + Math.random() * 0.6, y: 0.24 + Math.random() * 0.5, size: 125 + Math.random() * 60, rotation: Math.random() * 40 - 20 }]);
  };
  const shuffle = () => setToys((items) => items.map((toy) => ({ ...toy, x: 0.15 + Math.random() * 0.7, y: 0.2 + Math.random() * 0.6, rotation: Math.random() * 90 - 45 })));
  const reset = () => { setToys(INITIAL.map((toy) => ({ ...toy }))); setColor(COLORS[0].color); setNotice("A fresh start. No wrong turns."); };

  const download = () => {
    if (!stage.current) return;
    const { width, height } = dimensions;
    // Export the same SVG shapes and coordinates used by the interactive canvas.
    const shapes = toys.map((toy) => {
      const svg = stage.current?.querySelector(`[data-toy-id="${toy.id}"] svg`);
      const size = toySize(toy, width);
      const cx = clamp(toy.x * width, size / 2, width - size / 2);
      const cy = clamp(toy.y * height, size / 2, height - size / 2);
      return `<g transform="translate(${cx} ${cy}) rotate(${toy.rotation}) translate(${-size / 2} ${-size / 2})"><svg width="${size}" height="${size}" viewBox="0 0 200 200">${svg?.innerHTML ?? ""}</svg></g>`;
    }).join("");
    const source = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><title>A beautiful little KrackedDev mess</title><rect width="100%" height="100%" fill="${color}"/>${shapes}<text x="24" y="${height - 18}" font-family="Arial,sans-serif" font-size="12" fill="#321b32">made with a little krackeddev energy.</text></svg>`;
    const url = URL.createObjectURL(new Blob([source], { type: "image/svg+xml;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url; link.download = "krackeddev-my-little-mess.svg"; link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 2000);
    setNotice("Your little masterpiece is downloading.");
  };

  return (
    <section className="playground-section section-pad" id="playground">
      <div className="page-width">
        <SectionIntro label="A playground. Not a portfolio." description="Grab a shape. Follow a weird idea. There is, genuinely, nothing to break.">Less watching.<br /><span className="serif-word">More messing around.</span></SectionIntro>
        <div className="playground-board">
          <div className="canvas-stage" ref={stage} style={{ backgroundColor: color }}>
            <div className="canvas-heading"><span>YOUR BEAUTIFULLY UNNECESSARY MASTERPIECE</span><Move size={17} /></div>
            <div className="canvas-word" aria-hidden="true">what if?</div>
            <AnimatePresence>{toys.map((toy) => <DraggableToy key={toy.id} toy={toy} dimensions={dimensions} bounds={stage} onMove={move} onRotate={rotate} />)}</AnimatePresence>
          </div>
          <div className="canvas-toolbar">
            <div className="canvas-tools">
              <button className="add-shape" onClick={add} disabled={toys.length >= 12} title={toys.length >= 12 ? "Twelve shapes is a good mess. Reset to start again." : "Add another shape"}><Plus size={17} /><span>Add a shape</span></button>
              <button onClick={shuffle} aria-label="Shuffle the shapes" title="Shuffle"><Shuffle size={17} /><span>Shuffle</span></button>
              <button onClick={reset} aria-label="Reset the playground" title="Start fresh"><RotateCcw size={17} /><span>Reset</span></button>
              <button onClick={download} aria-label="Download your artwork as an SVG" title="Save your masterpiece"><Download size={17} /><span>Keep it</span></button>
            </div>
            <div className="canvas-colors" role="group" aria-label="Choose a canvas color">{COLORS.map((choice) => <button key={choice.name} onClick={() => setColor(choice.color)} style={{ backgroundColor: choice.color }} aria-label={`${choice.name} canvas`} aria-pressed={color === choice.color} className={color === choice.color ? "is-active" : ""} />)}</div>
          </div>
        </div>
        <div className="canvas-footnote"><p role="status" aria-live="polite">{notice || "Drag to move. Click to spin. Arrow keys work, too."}</p><span>{String(toys.length).padStart(2, "0")} shapes. Infinite possibilities.</span></div>
      </div>
    </section>
  );
}