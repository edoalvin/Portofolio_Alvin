"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { NAV_ITEMS } from "@/lib/constants";
import { useNavigateTo } from "@/components/TransitionProvider";
import { prefersReducedMotion } from "@/lib/animations";

/*
  HYDRATION SAFETY
  ─────────────────
  The server has no DOM, so it cannot know scroll position or which section
  is at the top of the viewport.  We must render identical HTML on both
  server and client on the first pass, then update state via useEffect.

  Safe initial values that match the server output:
    · onLight     = true   (page starts at the light hero)
    · heroVisible = true   (hero is visible at page-load)
    · mounted     = false  (gates any DOM-reading inside render)

  On the first client render (before any effect fires), all three are still
  at their initial values → same classes as the server → no mismatch.
  After mount, the scroll-listener effect runs once, reads the real DOM,
  and sets the correct values.
*/

export default function Navigation() {
  const navigateTo = useNavigateTo();

  /* Deterministic defaults — MUST match server render */
  const [mounted,     setMounted]     = useState(false);   // true only after hydration
  const [onLight,     setOnLight]     = useState(true);    // hero is light
  const [heroVisible, setHeroVisible] = useState(true);    // start at top
  const [active,      setActive]      = useState<string>("home");
  const [menuOpen,    setMenuOpen]    = useState(false);

  const menuRef  = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  /* ── Mount flag — prevents any DOM access during SSR render ─────────── */
  useEffect(() => {
    setMounted(true);
  }, []);

  /* ── Theme + hero-visibility detection (runs only after mount) ───────── */
  useEffect(() => {
    if (!mounted) return;

    const NAV_H = 72;

    const getTheme = (): "light" | "dark" => {
      const sections = Array.from(
        document.querySelectorAll<HTMLElement>("section[data-theme]")
      );
      for (const sec of sections) {
        const rect = sec.getBoundingClientRect();
        if (rect.top > NAV_H)    continue;
        if (rect.bottom <= NAV_H) continue;

        const rawTheme = sec.dataset.theme as "light" | "dark";

        // For sections that scrub from dark to light, read the actual
        // computed background colour to know if the scrub has completed.
        // We consider it "light" only once the section's bg luminance is
        // above ~40% (i.e. mid-grey or brighter).
        if (sec.id === "skills" || sec.id === "work") {
          const bg = window.getComputedStyle(sec).backgroundColor;
          // Parse rgb(r,g,b) — if any component can't be read, trust data-theme
          const match = bg.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
          if (match) {
            const r = parseInt(match[1]), g = parseInt(match[2]), b = parseInt(match[3]);
            // Perceived luminance threshold: if avg channel < 128, still dark
            const avg = (r + g + b) / 3;
            return avg > 100 ? "light" : "dark";
          }
        }

        return rawTheme;
      }
      return "dark";
    };

    const getHeroVisible = (): boolean => {
      const hero = document.getElementById("home");
      return hero ? hero.getBoundingClientRect().bottom > NAV_H : false;
    };

    const update = () => {
      setOnLight(getTheme() === "light");
      setHeroVisible(getHeroVisible());
    };

    // Run once immediately after mount to sync with real scroll position
    update();

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [mounted]);

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

  /* ── Style tokens — adapt to light/dark section ─────────────────────── */
  const logoClass  = onLight ? "text-[#111]"      : "text-white";
  const linkActive = onLight ? "text-[#111]"      : "text-white";
  const linkIdle   = onLight ? "text-[#555]"      : "text-[#a0a0a0]";
  const linkHover  = onLight ? "hover:text-[#111]": "hover:text-white";
  const burgerLine = onLight ? "bg-[#111]"        : "bg-white";

  /*
    headerBg:
    · Over hero (light, heroVisible)        → transparent, blends with white
    · Over any light section (not hero)     → white/90 frosted
    · Over any dark section (about/exp/contact) → dark/90 frosted
  */
  const headerBg = !onLight
    ? "bg-[#050505]/90 backdrop-blur-md border-b border-white/[0.06]"
    : heroVisible
      ? "bg-transparent border-b border-transparent"
      : "bg-white/90 backdrop-blur-md border-b border-black/[0.06]";

  return (
    <>
      <header
        className={`fixed top-0 left-0 z-[8000] w-full transition-all duration-500 ${headerBg}`}
      >
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
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className="group py-3 text-left"
            >
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
