"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/animations";

/**
 * Cinematic intro: counts to 100, reveals the name, then lifts away to
 * expose the hero. Dispatches an "app:ready" CustomEvent when finished so
 * the hero can start its entrance animation in sync.
 */
export default function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Reduced motion: skip the intro, signal ready immediately.
    if (prefersReducedMotion()) {
      setShow(false);
      window.dispatchEvent(new CustomEvent("app:ready"));
      return;
    }

    const root = rootRef.current;
    const name = nameRef.current;
    const count = countRef.current;
    const bar = barRef.current;
    if (!root || !name || !count || !bar) return;

    const proxy = { val: 0 };

    const tl = gsap.timeline({
      onComplete: () => {
        window.dispatchEvent(new CustomEvent("app:ready"));
        // unmount after the lift-away completes
        window.setTimeout(() => setShow(false), 200);
      },
    });

    // Counter 0 -> 100
    tl.to(proxy, {
      val: 100,
      duration: 2,
      ease: "power2.inOut",
      onUpdate: () => {
        count.textContent = String(Math.round(proxy.val)).padStart(3, "0");
      },
    });

    // Name rises in (mask reveal)
    tl.from(name, { yPercent: 110, duration: 1, ease: "expo-out" }, 0.2);

    // Progress bar fills
    tl.to(bar, { scaleX: 1, duration: 2, ease: "power2.inOut" }, 0);

    // Brief hold
    tl.to({}, { duration: 0.25 });

    // Lift the whole preloader away
    tl.to(root, { yPercent: -100, duration: 0.9, ease: "cinema" });

    return () => {
      tl.kill();
    };
  }, []);

  if (!show) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[9500] flex flex-col items-center justify-center bg-[#050505] px-6"
    >
      <div className="overflow-hidden">
        <div
          ref={nameRef}
          className="font-display text-[clamp(1.75rem,7vw,5rem)] font-semibold tracking-tight text-white text-center leading-[0.95]"
        >
          EDOARDO ALVIN
        </div>
      </div>

      <div className="mt-8 flex w-[min(420px,80vw)] items-center gap-4">
        <span
          ref={countRef}
          className="font-mono text-xs tracking-[0.3em] text-white/70 tabular-nums"
        >
          000
        </span>
        <div className="h-px flex-1 overflow-hidden bg-white/15">
          <div
            ref={barRef}
            className="h-full w-full origin-left bg-white"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>
    </div>
  );
}
