"use client";

import { useRef, type RefObject } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/animations";

/**
 * Magnetic hover effect. Attach the returned ref to an element and call
 * `attach()` inside a useEffect / useGSAP. Returns cleanup.
 *
 * Example:
 *   const { ref, attach } = useMagnetic({ strength: 0.4 });
 *   useGSAP(() => attach(), { scope: container });
 */
export function useMagnetic<T extends HTMLElement = HTMLElement>(opts?: {
  strength?: number;
  radius?: number;
}) {
  const ref = useRef<T>(null);

  const attach = () => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    const strength = opts?.strength ?? 0.35;
    const radius = opts?.radius ?? 120;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist > radius) return;
      gsap.to(el, {
        x: dx * strength,
        y: dy * strength,
        duration: 0.6,
        ease: "power3.out",
      });
    };

    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      gsap.to(el, { x: 0, y: 0, duration: 0.1 });
    };
  };

  return { ref, attach };
}

export type MagneticRef = RefObject<HTMLElement | null>;
