"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/animations";

export default function Preloader() {
  const rootRef  = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const barRef   = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setShow(false);
      window.dispatchEvent(new CustomEvent("app:ready"));
      return;
    }

    const root  = rootRef.current;
    const count = countRef.current;
    const bar   = barRef.current;
    if (!root || !count || !bar) return;

    const proxy = { val: 0 };

    const tl = gsap.timeline({
      onComplete: () => {
        window.dispatchEvent(new CustomEvent("app:ready"));
        window.setTimeout(() => setShow(false), 200);
      },
    });

    // Counter 0 → 100%
    tl.to(proxy, {
      val: 100,
      duration: 2,
      ease: "power2.inOut",
      onUpdate: () => {
        count.textContent = Math.round(proxy.val) + "%";
      },
    });

    // Progress bar fills in sync
    tl.to(bar, { scaleX: 1, duration: 2, ease: "power2.inOut" }, 0);

    // Brief hold
    tl.to({}, { duration: 0.25 });

    // Lift away
    tl.to(root, { yPercent: -100, duration: 0.9, ease: "cinema" });

    return () => { tl.kill(); };
  }, []);

  if (!show) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[9500] flex flex-col items-center justify-center gap-6 bg-[#050505] px-6"
    >
      {/* WELCOME — the only headline, truly centered */}
      <p className="font-display text-[clamp(2.5rem,8vw,6rem)] font-semibold tracking-tight text-white leading-none select-none">
        WELCOME
      </p>

      {/* Counter + bar */}
      <div className="flex w-[min(360px,80vw)] items-center gap-4">
        <span
          ref={countRef}
          className="font-mono text-xs tracking-[0.3em] text-white/50 tabular-nums w-10 shrink-0"
        >
          0%
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
