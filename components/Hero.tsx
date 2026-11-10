"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP, SplitText } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/animations";
import { PROFILE } from "@/lib/constants";

export default function Hero() {
  const container = useRef<HTMLDivElement>(null);
  const overlineRef = useRef<HTMLHeadingElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const supportRef = useRef<HTMLParagraphElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const introTimeline = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      // Reduced motion: show everything, no splits.
      if (prefersReducedMotion()) {
        gsap.set([metaRef.current, overlineRef.current, headlineRef.current, subtitleRef.current, supportRef.current, imageWrapRef.current, scrollRef.current], { opacity: 1, y: 0, clipPath: "none" });
        return;
      }

      // --- Split headline into chars with mask wrappers ---
      const headlineSplit = new SplitText(headlineRef.current, {
        type: "chars,words",
        mask: "chars",
        aria: "auto",
      });
      const overlineSplit = new SplitText(overlineRef.current, {
        type: "words",
        mask: "words",
        aria: "auto",
      });

      // Intro timeline (paused until preloader signals ready)
      const tl = gsap.timeline({ paused: true });
      introTimeline.current = tl;

      tl.set(metaRef.current, { opacity: 0, y: -12 })
        .set(overlineSplit.words, { yPercent: 115 })
        .set(headlineSplit.chars, { yPercent: 115 })
        .set(subtitleRef.current, { opacity: 0, y: 20 })
        .set(supportRef.current, { opacity: 0, y: 16 })
        .set(scrollRef.current, { opacity: 0 })
        .set(imageWrapRef.current, { clipPath: "inset(100% 0 0 0)" }) // fully hidden, reveals downward

        .to(metaRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" })
        .to(overlineSplit.words, { yPercent: 0, duration: 0.9, ease: "expo-out", stagger: 0.12 }, "<0.1")
        .to(headlineSplit.chars, { yPercent: 0, duration: 1.1, ease: "expo-out", stagger: 0.022 }, "-=0.4")
        .to(imageWrapRef.current, { clipPath: "inset(0% 0 0 0)", duration: 1.1, ease: "cinema" }, "-=0.9")
        .to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, "-=0.5")
        .to(supportRef.current, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, "-=0.5")
        .to(scrollRef.current, { opacity: 1, duration: 0.6, ease: "power2.out" }, "-=0.3");

      return () => {
        headlineSplit.revert();
        overlineSplit.revert();
      };
    },
    { scope: container }
  );

  /* Start intro on preloader-ready (with fallback) */
  useEffect(() => {
    if (prefersReducedMotion()) {
      introTimeline.current?.time(introTimeline.current.duration()).kill();
      return;
    }
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      introTimeline.current?.play();
    };
    window.addEventListener("app:ready", start, { once: true });
    const fallback = window.setTimeout(start, 3800);
    return () => {
      window.removeEventListener("app:ready", start);
      window.clearTimeout(fallback);
    };
  }, []);

  /* Subtle mouse parallax (desktop only) */
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      gsap.to(parallaxRef.current, {
        x: x * 14,
        y: y * 10,
        duration: 1.2,
        ease: "power2.out",
      });
      gsap.to(headlineRef.current, {
        x: x * -8,
        duration: 1.2,
        ease: "power2.out",
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section
      id="home"
      ref={container}
      className="relative flex min-h-[100svh] flex-col justify-between px-6 pt-28 pb-10 md:px-12 md:pt-32"
    >
      {/* Top meta row */}
      <div
        ref={metaRef}
        className="flex items-start justify-between font-mono text-[0.7rem] uppercase tracking-[0.2em] text-[#a0a0a0]"
      >
        <div className="flex flex-col gap-1">
          <span>{PROFILE.location}</span>
          <span className="flex items-center gap-2 text-white/70">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400/80 animate-pulse" />
            {PROFILE.availability}
          </span>
        </div>
        <div className="hidden sm:block text-right">
          <span>Portfolio — 2025</span>
        </div>
      </div>

      {/* Main hero block */}
      <div className="relative flex flex-1 flex-col justify-center py-10">
        <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-[1.7fr_1fr] md:gap-12">
          {/* Headline column */}
          <div ref={parallaxRef}>
            <div className="overflow-hidden">
              <p
                ref={overlineRef}
                className="mb-3 font-display text-[clamp(1rem,3vw,1.75rem)] font-light tracking-[0.05em] text-[#a0a0a0] md:mb-5"
              >
                Hello, I&apos;m
              </p>
            </div>
            <div className="overflow-hidden">
              <h1
                ref={headlineRef}
                className="font-display text-[clamp(3rem,13vw,12rem)] font-semibold leading-[0.85] tracking-[-0.04em] text-white"
              >
                EDOARDO ALVIN.
              </h1>
            </div>
          </div>

          {/* Hero image with reveal */}
          <div className="hidden md:block">
            <div
              ref={imageWrapRef}
              className="relative aspect-[3/4] w-full overflow-hidden border border-[#1a1a1a]"
            >
              <Image
                src="https://picsum.photos/seed/edoardo-hero/800/1000"
                alt="Editorial portrait placeholder"
                fill
                className="object-cover"
                sizes="40vw"
                priority
              />
            </div>
          </div>
        </div>

        {/* Subtitle + supporting text */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:mt-14 md:grid-cols-[1.7fr_1fr] md:gap-12">
          <div ref={subtitleRef} className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/80">
              {PROFILE.title}
            </p>
          </div>
          <p
            ref={supportRef}
            className="max-w-md text-sm leading-relaxed text-[#a0a0a0] md:text-base"
          >
            {PROFILE.tagline}
          </p>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        className="flex items-center justify-center gap-3 pt-2"
      >
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-[#a0a0a0]">
          Scroll
        </span>
        <div className="scroll-indicator" aria-hidden="true" />
      </div>
    </section>
  );
}
