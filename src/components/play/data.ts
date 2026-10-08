export type Brief = {
  id: string;
  category: "Design" | "Code" | "Motion";
  title: string;
  shortTitle: string;
  reward: string;
  deadline: string;
  image: string;
  color: string;
  sponsor: string;
  description: string;
  deliverables: string[];
};

export const briefs: Brief[] = [
  {
    id: "mascot", category: "Design", title: "Give our chaos a character.", shortTitle: "A mascot with main-character energy", reward: "$800", deadline: "6 days left",
    image: "/images/kracked-playground.jpg", color: "#eea2a6", sponsor: "The KrackedDev community",
    description: "We're looking for the slightly odd, ridiculously lovable face of our next community gathering. Not another robot. Not another rocket. A little character with a big personality, made in your own way.",
    deliverables: ["One original character and three expressive poses", "A short story about what makes your character tick", "Editable source files, ready for the community to remix"],
  },
  {
    id: "directory", category: "Code", title: "Build a better happy accident.", shortTitle: "A serendipitous member directory", reward: "$1,200", deadline: "12 days left",
    image: "/images/kracked-chrome.jpg", color: "#204dda", sponsor: "The Side Quest Club",
    description: "The best collaborations start with 'oh, you make that too?' Build a tiny browser-based experience that introduces two makers with unexpectedly compatible interests. Surprise us with the interaction, not the framework.",
    deliverables: ["A working, keyboard-accessible browser prototype", "A thoughtful matching interaction using sample member data", "Source code and a short walkthrough of your decisions"],
  },
  {
    id: "ident", category: "Motion", title: "Make our next hello move.", shortTitle: "Six seconds of beautiful weird", reward: "$600", deadline: "9 days left",
    image: "/images/kracked-motion.jpg", color: "#cbc0e9", sponsor: "Show & Tell Nights",
    description: "Every showcase starts with a hello. We'd love a six-second opener that feels like meeting a new friend: a little unexpected, a lot of warmth. Type, objects, stop-motion, or all of the above. Make it yours.",
    deliverables: ["A six-second looping ident, with and without sound", "A 16:9 version and a square social crop", "The editable project and a still frame we can print"],
  },
];

export const members = [
  { name: "Rae", role: "Artist. Serial doodler.", image: "https://images.pexels.com/photos/15553301/pexels-photo-15553301.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800", position: "50% 40%", quote: "I posted a very unfinished idea. Someone said, 'Let's finish it together.' That's kind of the whole thing." },
  { name: "Alex", role: "Dev. Professional side-quester.", image: "https://images.pexels.com/photos/10150395/pexels-photo-10150395.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800", position: "50% 35%", quote: "The best thing I've shipped here wasn't an app. It was the courage to show someone my first attempt." },
  { name: "Mei", role: "Designer. Curious about everything.", image: "https://images.pexels.com/photos/24205642/pexels-photo-24205642.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800", position: "50% 24%", quote: "Nobody asked where I studied. They asked what I was excited to make. I knew I'd found my people." },
  { name: "Sam", role: "Maker. Happily hard to categorize.", image: "https://images.pexels.com/photos/16835105/pexels-photo-16835105.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800", position: "50% 38%", quote: "Came for a weekend project. Stayed for the people who make even the messy middle feel worth it." },
];

export const gatherings = [
  { id: "show-tell", day: "14", month: "AUG", name: "Show, tell, slightly overshare.", kind: "Show & tell", place: "Online, from your favorite corner", time: "7:00 PM MYT", start: "20260814T110000Z", end: "20260814T123000Z", description: "Five minutes to show what you've been making. Finished, unfinished, unexpectedly on fire: all welcome. Bring something you're excited about, or just come to cheer." },
  { id: "jam", day: "22", month: "AUG", name: "The wonderfully unnecessary jam.", kind: "Weekend jam", place: "Online, wherever you are", time: "10:00 AM MYT", start: "20260822T020000Z", end: "20260823T100000Z", description: "A weekend to make something the world absolutely does not need, but will be very glad exists. Small teams, a very loose theme, and lots of ridiculous little ideas." },
  { id: "critique", day: "04", month: "SEP", name: "A little feedback. A lot of love.", kind: "Critique circle", place: "Online, six seats per circle", time: "8:00 PM MYT", start: "20260904T120000Z", end: "20260904T130000Z", description: "Bring one work-in-progress and one question. We'll make room for honest, specific, kind feedback. It's a conversation, not a portfolio roast." },
];

export type Gathering = typeof gatherings[number];
export type Profile = { name: string; email: string; discipline: string; interest?: string };
export const isProfile = (value: unknown): value is Profile | null => value === null || (typeof value === "object" && value !== null && "name" in value && typeof value.name === "string" && "email" in value && typeof value.email === "string" && "discipline" in value && typeof value.discipline === "string");