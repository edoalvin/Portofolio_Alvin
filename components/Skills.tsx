"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, SplitText, ScrollTrigger } from "@/lib/gsap";
import { SKILLS } from "@/lib/constants";

export default function Skills() {
  const container = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);

  // Heading + section reveal
  useGSAP(
    () => {
      if (typeof window === "undefined") return;
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const split = new SplitText(headingRef.current, { type: "words", mask: "words", aria: "auto" });
      const tl = gsap.timeline({
        scrollTrigger: { trigger: container.current, start: "top 70%", toggleActions: "play none none reverse" },
      });
      if (!prefersReduced) {
        tl.from(split.words, { yPercent: 115, duration: 1, ease: "expo-out", stagger: 0.07 });
      }
      tl.from(tabsRef.current, { opacity: 0, y: 16, duration: 0.6, ease: "power2.out" }, prefersReduced ? 0 : "-=0.4");
      return () => split.revert();
    },
    { scope: container }
  );

  // Animate the active indicator line under the selected tab
  useEffect(() => {
    const tab = tabsRef.current?.querySelectorAll<HTMLElement>("[data-tab]")[active];
    const indicator = indicatorRef.current;
    if (!tab || !indicator) return;
    gsap.to(indicator, {
      left: tab.offsetLeft,
      width: tab.offsetWidth,
      duration: 0.6,
      ease: "cinema",
    });
  }, [active]);

  // Stagger the skill list in whenever the active category changes
  useEffect(() => {
    if (!listRef.current) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const items = listRef.current.querySelectorAll<HTMLElement>("[data-skill]");
    if (prefersReduced) {
      gsap.set(items, { opacity: 1, y: 0 });
      return;
    }
    gsap.fromTo(
      items,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.05 }
    );
  }, [active]);

  // Count up the skill number on change
  useEffect(() => {
    const el = countRef.current;
    if (!el) return;
    const total = SKILLS[active].skills.length;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      el.textContent = String(total);
      return;
    }
    const proxy = { v: 0 };
    gsap.to(proxy, {
      v: total,
      duration: 0.7,
      ease: "power2.out",
      onUpdate: () => (el.textContent = String(Math.round(proxy.v))),
    });
  }, [active]);

  // Spotlight hover: brighten the hovered skill, dim the rest
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const onOver = (e: MouseEvent) => {
      const item = (e.target as HTMLElement).closest<HTMLElement>("[data-skill]");
      if (!item) return;
      const all = list.querySelectorAll<HTMLElement>("[data-skill]");
      all.forEach((s) => {
        if (s === item) gsap.to(s, { color: "#ffffff", scale: 1.04, duration: 0.3, ease: "power2.out" });
        else gsap.to(s, { color: "#3a3a3a", duration: 0.3, ease: "power2.out" });
      });
    };
    const onLeave = () => {
      const all = list.querySelectorAll<HTMLElement>("[data-skill]");
      all.forEach((s) => gsap.to(s, { color: "#a0a0a0", scale: 1, duration: 0.3, ease: "power2.out" }));
    };
    list.addEventListener("mouseover", onOver);
    list.addEventListener("mouseleave", onLeave);
    return () => {
      list.removeEventListener("mouseover", onOver);
      list.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const category = SKILLS[active];

  return (
    <section
      id="skills"
      ref={container}
      className="relative px-6 py-24 md:px-12 md:py-40 border-t border-[#1a1a1a]"
    >
      {/* Header */}
      <div className="mb-12 flex items-baseline gap-6 md:mb-16">
        <span className="font-mono text-xs tracking-[0.2em] text-white/40">(03)</span>
        <p className="label-mono text-white/50">Capabilities</p>
      </div>

      <div className="overflow-hidden">
        <h2
          ref={headingRef}
          className="font-display text-[clamp(2.5rem,7vw,6rem)] font-semibold leading-[0.9] tracking-[-0.04em] text-white mb-16 md:mb-24"
        >
          The toolkit.
        </h2>
      </div>

      {/* Category tabs */}
      <div ref={tabsRef} className="relative flex flex-wrap gap-8 border-b border-[#1a1a1a] pb-1">
        {SKILLS.map((cat, i) => (
          <button
            key={cat.title}
            data-tab=""
            onClick={() => setActive(i)}
            className={`group relative pb-3 font-mono text-xs uppercase tracking-[0.2em] transition-colors duration-300 ${
              active === i ? "text-white" : "text-[#a0a0a0] hover:text-white"
            }`}
          >
            <span className="text-white/30">{cat.index}</span>{" "}
            {cat.title}
          </button>
        ))}
        {/* Active indicator */}
        <div
          ref={indicatorRef}
          className="absolute bottom-[-1px] h-px bg-white"
          style={{ left: 0, width: 0 }}
        />
      </div>

      {/* Active category skills */}
      <div className="mt-12 grid grid-cols-1 gap-10 md:mt-16 md:grid-cols-12">
        <div className="md:col-span-3">
          <p className="label-mono text-white/40">Count</p>
          <p className="mt-2 font-display text-6xl font-semibold text-white tabular-nums">
            <span ref={countRef}>0</span>
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#a0a0a0]">
            {active === 0 && "Design fundamentals — from research to refined prototypes."}
            {active === 1 && "Building interfaces with modern, typed front-end tooling."}
            {active === 2 && "Data layers and the everyday tools that keep work shipping."}
          </p>
        </div>

        <div ref={listRef} className="md:col-span-9">
          <div className="flex flex-wrap gap-x-6 gap-y-4">
            {category.skills.map((skill) => (
              <span
                key={skill}
                data-skill=""
                className="cursor-default font-display text-[clamp(1.75rem,5vw,3.5rem)] font-medium leading-tight tracking-tight text-[#a0a0a0] transition-colors duration-300"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
