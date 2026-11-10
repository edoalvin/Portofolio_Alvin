/* ==========================================================================
   Animation helpers — easing presets, reduced-motion guard, reusable
   text-reveal builders. SplitText instances are returned so callers can
   revert them inside useGSAP cleanup.
   ========================================================================== */
import { gsap, ScrollTrigger, SplitText, CustomEase } from "@/lib/gsap";

/* One-time custom ease registration (idempotent) */
let easesReady = false;
function registerEases() {
  if (easesReady) return;
  CustomEase.create("cinema", "0.7, 0, 0.2, 1");
  CustomEase.create("smooth", "0.25, 1, 0.5, 1");
  CustomEase.create("power-out", "0.16, 1, 0.3, 1");
  CustomEase.create("expo-out", "0.19, 1, 0.22, 1");
  easesReady = true;
}
registerEases();

export const EASE = {
  cinema: "cinema",
  smooth: "smooth",
  powerOut: "power-out",
  expoOut: "expo-out",
} as const;

/** True when the user has requested reduced motion. */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Refresh ScrollTrigger after layout/images settle. */
export function refreshScroll(): void {
  if (typeof window !== "undefined") ScrollTrigger.refresh();
}

type SplitOptions = {
  type?: "chars" | "words" | "lines" | "chars,words" | "words,lines" | "chars,words,lines";
  mask?: "chars" | "words" | "lines" | undefined;
  aria?: "auto" | "hidden" | "none";
};

/** Split an element and return the instance (revert in useGSAP cleanup). */
export function splitText(el: Element | string, opts: SplitOptions = {}): SplitText {
  return new SplitText(el, {
    type: opts.type ?? "chars,words",
    mask: opts.mask,
    aria: opts.aria ?? "auto",
    linesClass: "split-line",
    wordsClass: "split-word",
    charsClass: "split-char",
  });
}

/**
 * Reveal heading characters from bottom-up using mask + translateY.
 * Returns the timeline. Caller reverts the SplitText.
 */
export function revealHeading(
  el: Element | string,
  opts: {
    trigger?: Element | string;
    start?: string;
    stagger?: number;
    duration?: number;
    delay?: number;
    y?: string;
  } = {}
): gsap.core.Timeline {
  const split = splitText(el, { type: "chars,words", mask: "chars" });
  const tl = gsap.timeline({
    scrollTrigger: opts.trigger
      ? {
          trigger: opts.trigger,
          start: opts.start ?? "top 80%",
          toggleActions: "play none none reverse",
        }
      : undefined,
  });
  tl.from(split.chars, {
    yPercent: opts.y ? undefined : 115,
    y: opts.y ? opts.y : undefined,
    duration: opts.duration ?? 1.1,
    ease: EASE.expoOut,
    stagger: opts.stagger ?? 0.025,
    delay: opts.delay ?? 0,
  });
  return tl;
}

/**
 * Reveal words of a paragraph — subtle fade + rise stagger.
 */
export function revealWords(
  el: Element | string,
  opts: {
    trigger?: Element | string;
    start?: string;
    stagger?: number;
    duration?: number;
    delay?: number;
  } = {}
): gsap.core.Timeline {
  const split = splitText(el, { type: "words" });
  const tl = gsap.timeline({
    scrollTrigger: opts.trigger
      ? {
          trigger: opts.trigger,
          start: opts.start ?? "top 85%",
          toggleActions: "play none none reverse",
        }
      : undefined,
  });
  tl.from(split.words, {
    yPercent: 40,
    opacity: 0,
    duration: opts.duration ?? 0.8,
    ease: EASE.smooth,
    stagger: opts.stagger ?? 0.018,
    delay: opts.delay ?? 0,
  });
  return tl;
}

/** Generic fade/rise entrance for any element collection. */
export function riseIn(
  targets: gsap.TweenTarget,
  opts: {
    y?: number;
    opacity?: number;
    duration?: number;
    stagger?: number;
    delay?: number;
    ease?: string;
    trigger?: Element | string;
    start?: string;
  } = {}
): gsap.core.Tween {
  return gsap.from(targets, {
    y: opts.y ?? 24,
    opacity: opts.opacity ?? 0,
    duration: opts.duration ?? 0.9,
    ease: opts.ease ?? EASE.smooth,
    stagger: opts.stagger ?? 0,
    delay: opts.delay ?? 0,
    scrollTrigger: opts.trigger
      ? {
          trigger: opts.trigger,
          start: opts.start ?? "top 85%",
          toggleActions: "play none none reverse",
        }
      : undefined,
  });
}
