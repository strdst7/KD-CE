import { useId } from "react";

export type ToyKind = "flower" | "ring" | "orb" | "cube" | "wave" | "blob";
export const toyNames: Record<ToyKind, string> = { flower: "Smiley flower", ring: "Chrome ring", orb: "Coral sphere", cube: "Lilac cube", wave: "Blue arch", blob: "Mint friend" };

export function ToyArt({ kind }: { kind: ToyKind }) {
  const id = useId().replace(/:/g, "");
  const fill = (name: string) => `url(#${id}-${name})`;
  return (
    <svg viewBox="0 0 200 200" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-yellow`} x1="35" y1="15" x2="160" y2="185" gradientUnits="userSpaceOnUse"><stop stopColor="#fff790" /><stop offset=".35" stopColor="#ffe738" /><stop offset=".72" stopColor="#f5c510" /><stop offset="1" stopColor="#db9605" /></linearGradient>
        <linearGradient id={`${id}-metal`} x1="30" y1="20" x2="165" y2="180" gradientUnits="userSpaceOnUse"><stop stopColor="#f8e9ef" /><stop offset=".17" stopColor="#858593" /><stop offset=".29" stopColor="#fffaf5" /><stop offset=".42" stopColor="#504b59" /><stop offset=".55" stopColor="#e7e2e5" /><stop offset=".66" stopColor="#fffdf8" /><stop offset=".78" stopColor="#817a86" /><stop offset=".88" stopColor="#393342" /><stop offset="1" stopColor="#ccc6ce" /></linearGradient>
        <radialGradient id={`${id}-red`} cx=".3" cy=".24" r=".85"><stop stopColor="#ffd1bd" /><stop offset=".25" stopColor="#ff876b" /><stop offset=".7" stopColor="#f1493b" /><stop offset="1" stopColor="#b42629" /></radialGradient>
        <linearGradient id={`${id}-blue`} x1="25" y1="30" x2="150" y2="185" gradientUnits="userSpaceOnUse"><stop stopColor="#9db9ff" /><stop offset=".25" stopColor="#427cff" /><stop offset=".65" stopColor="#214bd0" /><stop offset="1" stopColor="#102169" /></linearGradient>
        <linearGradient id={`${id}-mint`} x1="30" y1="20" x2="160" y2="185" gradientUnits="userSpaceOnUse"><stop stopColor="#d8ffdf" /><stop offset=".4" stopColor="#a4dfac" /><stop offset="1" stopColor="#41925d" /></linearGradient>
        <linearGradient id={`${id}-purple`} x1="20" y1="50" x2="170" y2="170" gradientUnits="userSpaceOnUse"><stop stopColor="#dfceff" /><stop offset=".5" stopColor="#a17bdb" /><stop offset="1" stopColor="#63468e" /></linearGradient>
        <filter id={`${id}-shadow`} x="-40%" y="-30%" width="180%" height="190%"><feDropShadow dx="0" dy="10" stdDeviation="7" floodColor="#302038" floodOpacity=".2" /></filter>
      </defs>
      <g filter={fill("shadow")}>
        {kind === "flower" && <>
          <path d="M100 36V164M36 100H164M55 55L145 145M55 145L145 55" stroke={fill("yellow")} strokeWidth="43" strokeLinecap="round" />
          <circle cx="100" cy="100" r="32" fill={fill("yellow")} />
          <path d="M96 27V40M38 94H48M54 50L62 59" stroke="#fffbd0" strokeWidth="4" strokeLinecap="round" opacity=".5" />
          <ellipse cx="87" cy="97" rx="4" ry="6" fill="#2e2630" /><ellipse cx="113" cy="97" rx="4" ry="6" fill="#2e2630" />
          <path d="M88 111Q100 123 112 111" stroke="#2e2630" strokeWidth="3.5" strokeLinecap="round" />
        </>}
        {kind === "ring" && <>
          <ellipse cx="100" cy="102" rx="62" ry="59" transform="rotate(-25 100 102)" stroke={fill("metal")} strokeWidth="40" />
          <path d="M49 68C69 40 115 32 145 56" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".65" />
          <ellipse cx="100" cy="102" rx="48" ry="45" transform="rotate(-25 100 102)" stroke="#ffffff" strokeOpacity=".15" strokeWidth="2" />
        </>}
        {kind === "orb" && <><circle cx="100" cy="95" r="76" fill={fill("red")} /><ellipse cx="73" cy="49" rx="22" ry="10" transform="rotate(-30 73 49)" fill="#fff" opacity=".36" /></>}
        {kind === "wave" && <><path d="M40 158V94C40 23 160 23 160 94V158" stroke={fill("blue")} strokeWidth="43" strokeLinecap="round" /><path d="M38 85C41 53 68 37 92 40" stroke="#b7cfff" strokeWidth="4" strokeLinecap="round" opacity=".5" /></>}
        {kind === "cube" && <>
          <path d="M100 20Q105 20 110 23L169 55Q177 60 177 70V133Q177 141 169 146L108 180Q100 184 92 180L31 146Q23 141 23 133V70Q23 60 31 55L90 23Q95 20 100 20Z" fill={fill("purple")} />
          <path d="M30 60L100 100L171 60L105 24Q100 21 95 24Z" fill="#dfc8fa" /><path d="M100 100V182L171 143Q176 140 176 132V66Z" fill="#8a62bb" />
          <path d="M35 64L99 102V171" stroke="#efe1ff" strokeWidth="3" strokeLinecap="round" opacity=".5" />
        </>}
        {kind === "blob" && <>
          <path d="M40 43C62 20 83 33 101 52C118 23 147 22 164 44C189 75 176 113 150 139C130 158 113 166 101 177C83 159 60 157 39 134C12 105 12 71 40 43Z" fill={fill("mint")} />
          <path d="M41 48Q60 32 78 47" stroke="#ecfff1" strokeWidth="5" strokeLinecap="round" opacity=".6" />
          <ellipse cx="82" cy="91" rx="4" ry="6" fill="#23352b" /><ellipse cx="115" cy="91" rx="4" ry="6" fill="#23352b" /><path d="M85 109Q99 121 113 109" stroke="#23352b" strokeWidth="3.5" strokeLinecap="round" />
        </>}
      </g>
    </svg>
  );
}