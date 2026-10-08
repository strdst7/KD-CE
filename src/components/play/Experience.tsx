import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { MotionConfig, useReducedMotion } from "motion/react";

const ExperienceContext = createContext({ animated: true, paused: false, systemReduced: false, toggleMotion: () => {} });

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const systemReduced = Boolean(useReducedMotion());
  const [paused, setPaused] = useState(() => {
    try { return localStorage.getItem("kracked-motion-paused") === "true"; } catch { return false; }
  });
  const animated = !paused && !systemReduced;

  useEffect(() => {
    try { localStorage.setItem("kracked-motion-paused", String(paused)); } catch { /* Storage can be disabled. */ }
  }, [paused]);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = animated ? "smooth" : "auto";
    return () => { document.documentElement.style.scrollBehavior = ""; };
  }, [animated]);

  return (
    <ExperienceContext.Provider value={{ animated, paused, systemReduced, toggleMotion: () => setPaused((v) => !v) }}>
      <MotionConfig reducedMotion={animated ? "never" : "always"}>
        <div className={animated ? "experience" : "experience is-still"}>{children}</div>
      </MotionConfig>
    </ExperienceContext.Provider>
  );
}

export const useExperience = () => useContext(ExperienceContext);

export function useLocalState<T>(key: string, fallback: T, valid: (value: unknown) => value is T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const parsed: unknown = JSON.parse(localStorage.getItem(key) ?? "null");
      return valid(parsed) ? parsed : fallback;
    } catch { return fallback; }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* The UI still works without storage. */ }
  }, [key, value]);
  return [value, setValue] as const;
}

export const isStringArray = (value: unknown): value is string[] => Array.isArray(value) && value.every((item) => typeof item === "string");