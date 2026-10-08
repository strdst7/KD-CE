import { useEffect, useRef } from "react";
import landingMarkup from "./new-design/landing.html?raw";

export default function App() {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    const closeMenu = () => {
      const button = page.querySelector<HTMLButtonElement>(".menu-toggle");
      const nav = page.querySelector<HTMLElement>(".nav-links");
      button?.setAttribute("aria-expanded", "false");
      button?.setAttribute("aria-label", "Open navigation");
      nav?.classList.remove("is-open");
    };

    const handleClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;

      const menuButton = target.closest<HTMLButtonElement>(".menu-toggle");
      if (menuButton) {
        const isOpen = menuButton.getAttribute("aria-expanded") === "true";
        const nav = page.querySelector<HTMLElement>(".nav-links");
        menuButton.setAttribute("aria-expanded", String(!isOpen));
        menuButton.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
        nav?.classList.toggle("is-open", !isOpen);
        return;
      }

      if (target.closest(".nav-links a")) closeMenu();

      const nudgeButton = target.closest<HTMLButtonElement>("#nudge-button");
      if (nudgeButton) {
        const nudges = [
          "You don't need a perfect plan.",
          "Start small. Stay curious.",
          "Your first draft counts.",
          "It's okay to ask the room.",
        ];
        const copy = page.querySelector<HTMLElement>("#nudge-copy");
        if (copy) {
          const current = Number(nudgeButton.dataset.nudgeIndex ?? 0);
          const next = (current + 1) % nudges.length;
          nudgeButton.dataset.nudgeIndex = String(next);
          copy.textContent = nudges[next];
        }
        return;
      }

      const filterButton = target.closest<HTMLButtonElement>(".filter-button");
      if (filterButton) {
        const filter = filterButton.dataset.filter ?? "all";
        page.querySelectorAll<HTMLButtonElement>(".filter-button").forEach((button) => {
          button.setAttribute("aria-pressed", String(button === filterButton));
        });
        page.querySelectorAll<HTMLElement>(".project-card[data-category]").forEach((card) => {
          card.hidden = filter !== "all" && card.dataset.category !== filter;
        });
      }
    };

    page.addEventListener("click", handleClick);

    let observer: IntersectionObserver | undefined;
    if (
      "IntersectionObserver" in window &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      document.documentElement.classList.add("has-motion");
      observer = new IntersectionObserver(
        (entries, activeObserver) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              activeObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12 },
      );
      page.querySelectorAll(".reveal").forEach((item) => observer?.observe(item));
    }

    return () => {
      page.removeEventListener("click", handleClick);
      observer?.disconnect();
      document.documentElement.classList.remove("has-motion");
    };
  }, []);

  return <div ref={pageRef} dangerouslySetInnerHTML={{ __html: landingMarkup }} />;
}
