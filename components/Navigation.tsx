"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { NAV_ITEMS } from "@/lib/constants";
import { useNavigateTo } from "@/components/TransitionProvider";
import { prefersReducedMotion } from "@/lib/animations";

export default function Navigation() {
  const navigateTo = useNavigateTo();
  const [active,   setActive]   = useState<string>("home");
  const [onLight,  setOnLight]  = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef  = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  /* ─────────────────────────────────────────────────────────────────────
     THEME DETECTION
     Strategy: each section has data-theme="light|dark".
     The skills section is special — it scrubs from dark to light as it
     enters, so we DON'T trust data-theme there while it's still dark.
     Instead we check the section's scroll progress to know if the scrub
     has actually completed (bg is cream) before switching to light mode.
  ───────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    const NAV_H = 72; // navbar height px

    const getTheme = (): "light" | "dark" => {
      const sections = Array.from(
        document.querySelectorAll<HTMLElement>("section[data-theme]")
      );

      // Find which section's bounding box straddles the navbar bottom edge
      for (const sec of sections) {
        const rect = sec.getBoundingClientRect();
        if (rect.top > NAV_H) continue;   // hasn't reached navbar yet
        if (rect.bottom <= NAV_H) continue; // already scrolled past

        const rawTheme = sec.dataset.theme as "light" | "dark";

        // Skills section: only report "light" once the bg scrub is far
        // enough along. We define "enough" as: the section top has passed
        // 20% of the viewport (same as the scrub `end: "top 10%"` → by
        // the time rect.top <= -viewport*0.0 it's fully cream).
        if (sec.id === "skills") {
          // rect.top is negative once section top is above viewport top.
          // Scrub goes from "top 90%" (sec.top = 90% vh) to "top 10%"
          // (sec.top = 10% vh).  We switch to light once sec.top <= 40% vh.
          const pct = rect.top / window.innerHeight; // 1 → 0 → negative
          if (pct > 0.4) return "dark";   // scrub not far enough — still dark visually
          return rawTheme;
        }

        return rawTheme;
      }
      return "dark";
    };

    const update = () => setOnLight(getTheme() === "light");

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  /* ── Active section ──────────────────────────────────────────────────── */
  useEffect(() => {
    const sections = NAV_ITEMS.map((n) => document.getElementById(n.id))
      .filter(Boolean) as HTMLElement[];
    if (!sections.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const v = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (v[0]) setActive(v[0].target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  /* ── Mobile menu ─────────────────────────────────────────────────────── */
  useEffect(() => {
    const menu  = menuRef.current;
    const items = itemsRef.current;
    if (!menu || !items) return;
    if (menuOpen) {
      document.body.style.overflow = "hidden";
      if (prefersReducedMotion()) {
        gsap.set(menu, { display: "flex", opacity: 1 });
        gsap.set(items.children, { opacity: 1, y: 0 });
        return;
      }
      const tl = gsap.timeline();
      tl.set(menu, { display: "flex" })
        .fromTo(menu, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out" })
        .from(items.children, { y: 60, opacity: 0, stagger: 0.08, duration: 0.7, ease: "expo-out" }, "-=0.15");
      return () => { tl.kill(); };
    } else {
      document.body.style.overflow = "";
      if (prefersReducedMotion()) { gsap.set(menu, { display: "none" }); return; }
      const tl = gsap.timeline();
      tl.to(items.children, { y: -40, opacity: 0, stagger: 0.04, duration: 0.3, ease: "power2.in" })
        .to(menu, { opacity: 0, duration: 0.3, ease: "power2.in" }, "-=0.1")
        .set(menu, { display: "none" });
    }
  }, [menuOpen]);

  const handleNav = (id: string) => {
    setMenuOpen(false);
    window.setTimeout(() => navigateTo(id), menuOpen ? 350 : 0);
  };

  /* ── Tokens ──────────────────────────────────────────────────────────── */
  const logoClass  = onLight ? "text-[#111]"      : "text-white";
  const linkActive = onLight ? "text-[#111]"      : "text-white";
  const linkIdle   = onLight ? "text-[#555]"      : "text-[#a0a0a0]";
  const linkHover  = onLight ? "hover:text-[#111]": "hover:text-white";
  const burgerLine = onLight ? "bg-[#111]"        : "bg-white";

  // headerBg logic:
  // · Over hero (light bg, no scroll) → transparent, blends with #e8e8e8
  // · Over skills cream section → cream panel
  // · Over any dark section → dark panel
  // onLight is already computed from data-theme + scroll-pct,
  // and the skills section only returns "light" once pct <= 0.4.
  // For the hero we simply check if the hero section's bottom is still
  // visible — if yes, go transparent; skills cream gets its own bg.
  const heroStillVisible = (() => {
    if (typeof window === "undefined") return true;
    const hero = document.getElementById("home");
    return hero ? hero.getBoundingClientRect().bottom > 72 : false;
  })();

  const headerBg = !onLight
    ? "bg-[#050505]/90 backdrop-blur-md border-b border-white/[0.06]"
    : heroStillVisible
      ? "bg-transparent border-b border-transparent"
      : "bg-[#F5F0E8]/90 backdrop-blur-md border-b border-black/10";

  return (
    <>
      <header className={`fixed top-0 left-0 z-[8000] w-full transition-all duration-500 ${headerBg}`}>
        <nav className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5 md:px-12 md:py-7">
          <button
            onClick={() => handleNav("home")}
            className={`font-display text-sm font-semibold tracking-tight transition-colors duration-500 md:text-base ${logoClass}`}
            aria-label="Go to home"
          >
            EDOARDO ALVIN NUGROHO
          </button>

          <ul className="hidden md:flex items-center gap-10">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleNav(item.id)}
                  data-cursor=""
                  className={`nav-link font-mono text-[0.7rem] uppercase tracking-[0.2em] transition-colors duration-300 ${
                    active === item.id ? linkActive : `${linkIdle} ${linkHover}`
                  }`}
                >
                  <span className="relative">
                    {item.label}
                    <span className={`nav-link__underline ${active === item.id ? "is-active" : ""}`} />
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden relative z-[8100] flex h-8 w-8 flex-col items-center justify-center gap-[6px]"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <span className={`block h-px w-6 transition-all duration-300 ${burgerLine} ${menuOpen ? "translate-y-[3.5px] rotate-45" : ""}`} />
            <span className={`block h-px w-6 transition-all duration-300 ${burgerLine} ${menuOpen ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
          </button>
        </nav>
      </header>

      <div
        ref={menuRef}
        className="fixed inset-0 z-[7900] hidden flex-col items-start justify-center bg-[#050505] px-8 md:hidden"
      >
        <div ref={itemsRef} className="flex flex-col gap-2 w-full">
          {NAV_ITEMS.map((item) => (
            <button key={item.id} onClick={() => handleNav(item.id)} className="group py-3 text-left">
              <span className="font-display text-[clamp(2.5rem,12vw,4.5rem)] font-semibold leading-none tracking-tight text-white transition-colors group-hover:text-white/60">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
