import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { ExperienceProvider, isStringArray, useLocalState } from "./components/play/Experience";
import { Hero, KineticRibbon, Navigation } from "./components/play/Hero";
import { Playground } from "./components/play/Playground";
import { BountyBoard } from "./components/play/BountyBoard";
import { Community, Footer, Gatherings, Questions } from "./components/play/Community";
import { BriefDetails, Dialog, EventDetails, JoinForm } from "./components/play/Dialogs";
import { isProfile, type Brief, type Gathering, type Profile } from "./components/play/data";

type ActiveDialog = { type: "brief"; brief: Brief } | { type: "join"; brief?: Brief } | { type: "event"; event: Gathering } | null;

function CreativePage() {
  const [saved, setSaved] = useLocalState<string[]>("kracked-toybox-picks-v1", [], isStringArray);
  const [rsvps, setRsvps] = useLocalState<string[]>("kracked-toybox-rsvps-v1", [], isStringArray);
  const [profile, setProfile] = useLocalState<Profile | null>("kracked-toybox-profile-v1", null, isProfile);
  const [dialog, setDialog] = useState<ActiveDialog>(null);
  const toggleSaved = (id: string) => setSaved((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);
  const toggleRsvp = (id: string) => setRsvps((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);
  const join = () => setDialog({ type: "join" });
  const close = () => setDialog(null);
  const focusKey = dialog?.type === "brief" ? `brief-${dialog.brief.id}` : dialog?.type === "event" ? `event-${dialog.event.id}` : `join-${dialog?.brief?.id ?? "community"}`;

  return <>
    <div id="experience-content">
    <a className="skip-link" href="#main-content">Skip to the playground</a>
    <Navigation onJoin={join} />
    <main id="main-content">
      <Hero onJoin={join} />
      <KineticRibbon />
      <Playground />
      <BountyBoard saved={saved} onSave={toggleSaved} onOpen={(brief) => setDialog({ type: "brief", brief })} />
      <Community onJoin={join} />
      <Gatherings rsvps={rsvps} onOpen={(event) => setDialog({ type: "event", event })} />
      <Questions />
    </main>
    <Footer onJoin={join} />
    </div>
    <AnimatePresence>{dialog && <Dialog onClose={close} focusKey={focusKey}>
      {dialog.type === "brief" && <BriefDetails brief={dialog.brief} saved={saved.includes(dialog.brief.id)} onSave={() => toggleSaved(dialog.brief.id)} onApply={() => setDialog({ type: "join", brief: dialog.brief })} />}
      {dialog.type === "join" && <JoinForm key={`join-${dialog.brief?.id ?? "community"}`} profile={profile} brief={dialog.brief} onSubmit={setProfile} onClose={close} />}
      {dialog.type === "event" && <EventDetails event={dialog.event} going={rsvps.includes(dialog.event.id)} onToggle={() => toggleRsvp(dialog.event.id)} />}
    </Dialog>}</AnimatePresence>
  </>;
}

export default function App() {
  return <ExperienceProvider><CreativePage /></ExperienceProvider>;
}
