"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/animations";
import { useIsTouch } from "@/hooks/useIsTouch";

/**
 * Custom cursor: a precise dot + a lagging ring that scales on hover and
 * can display contextual labels (e.g. "VIEW PROJECT"). Disabled on touch
 * devices and when reduced motion is requested.
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const isTouch = useIsTouch();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (isTouch === null) return; // resolving
    if (isTouch) return; // touch device -> no custom cursor
    if (prefersReducedMotion()) return;
    setEnabled(true);
  }, [isTouch]);

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const text = textRef.current;
    if (!dot || !ring || !text) return;

    document.body.classList.add("has-custom-cursor");

    // quickTo gives buttery lerp-following without rAF loops
    const xToDot = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3.out" });
    const yToDot = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3.out" });
    const xToRing = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3.out" });
    const yToRing = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      xToDot(e.clientX);
      yToDot(e.clientY);
      xToRing(e.clientX);
      yToRing(e.clientY);
    };

    // Contextual hover states
    const onOver = (e: MouseEvent) => {
      const t = (e.target as HTMLElement)?.closest<HTMLElement>(
        "a, button, [data-cursor], input, [role='button']"
      );
      if (!t) return;
      const label = t.getAttribute("data-cursor");
      if (label) {
        text.textContent = label;
        gsap.to(ring, {
          width: 96,
          height: 96,
          backgroundColor: "rgba(255,255,255,0.08)",
          borderColor: "rgba(255,255,255,0.9)",
          duration: 0.3,
          ease: "power3.out",
        });
        gsap.to(text, { opacity: 1, duration: 0.2 });
      } else {
        gsap.to(ring, {
          width: 60,
          height: 60,
          backgroundColor: "transparent",
          borderColor: "rgba(255,255,255,0.7)",
          duration: 0.3,
          ease: "power3.out",
        });
      }
    };

    const onOut = (e: MouseEvent) => {
      const t = (e.target as HTMLElement)?.closest<HTMLElement>(
        "a, button, [data-cursor], input, [role='button']"
      );
      if (!t) return;
      gsap.to(ring, {
        width: 42,
        height: 42,
        backgroundColor: "transparent",
        borderColor: "rgba(255,255,255,0.5)",
        duration: 0.3,
        ease: "power3.out",
      });
      gsap.to(text, { opacity: 0, duration: 0.15 });
    };

    // Shrink ring on press
    const onDown = () => gsap.to(ring, { scale: 0.8, duration: 0.2 });
    const onUp = () => gsap.to(ring, { scale: 1, duration: 0.3 });

    // Hide when leaving the window
    const onLeave = () => gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
    const onEnter = () => gsap.to([dot, ring], { opacity: 1, duration: 0.2 });

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      document.body.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring">
        <span ref={textRef} className="cursor-ring__text" />
      </div>
    </>
  );
}
