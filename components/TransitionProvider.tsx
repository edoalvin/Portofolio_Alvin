"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/animations";
import { TRANSITION_COPY } from "@/lib/constants";

type NavigateFn = (sectionId: string) => void;

const TransitionContext = createContext<NavigateFn>(() => {});

export function useNavigateTo(): NavigateFn {
  return useContext(TransitionContext);
}

export function TransitionProvider({ children }: { children: ReactNode }) {
  const curtainRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const lockRef = useRef(false);
  const [isReady] = useState(true); // gate reserved for preloader coordination

  const navigateTo = useCallback<NavigateFn>(
    (sectionId: string) => {
      const curtain = curtainRef.current;
      const textEl = textRef.current;
      const target = document.getElementById(sectionId);
      if (!target) return;
      if (lockRef.current) return;
      if (prefersReducedMotion()) {
        target.scrollIntoView({ behavior: "auto", block: "start" });
        return;
      }

      lockRef.current = true;
      const copy = TRANSITION_COPY[sectionId] ?? sectionId.toUpperCase();

      const tl = gsap.timeline({
        onComplete: () => {
          lockRef.current = false;
        },
      });

      tl.set(curtain, { display: "flex", yPercent: -100 })
        // curtain drops down to cover
        .to(curtain, { yPercent: 0, duration: 0.55, ease: "cinema" })
        // scramble + fade the transition copy in
        .fromTo(
          textEl,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.35,
            ease: "power2.out",
          },
          "-=0.15"
        )
        .to(
          textEl,
          {
            duration: 0.7,
            ease: "none",
            scrambleText: { text: copy, chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ", speed: 0.5, tweenLength: false },
          },
          "-=0.3"
        )
        // scroll the page underneath while covered
        .to(
          window,
          {
            duration: 0.9,
            ease: "cinema",
            scrollTo: { y: target, offsetY: 0 },
          },
          "<0.05"
        )
        // fade the copy out
        .to(textEl, { opacity: 0, duration: 0.35, ease: "power2.in" }, "+=0.15")
        // curtain rises away to reveal destination
        .to(curtain, { yPercent: 100, duration: 0.55, ease: "cinema" }, "-=0.1")
        .set(curtain, { display: "none", yPercent: -100 });
    },
    []
  );

  return (
    <TransitionContext.Provider value={navigateTo}>
      {children}
      {/* Curtain transition overlay */}
      <div
        ref={curtainRef}
        aria-hidden="true"
        style={{ display: "none" }}
        className="fixed inset-0 z-[9000] flex items-center justify-center bg-[#050505] pointer-events-none"
      >
        <div
          ref={textRef}
          className="font-display text-[clamp(2rem,9vw,8rem)] font-semibold tracking-tight text-white opacity-0 select-none"
        >
          {""}
        </div>
      </div>
    </TransitionContext.Provider>
  );
}
