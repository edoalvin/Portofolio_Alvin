"use client";

import { useEffect, useState } from "react";

/**
 * Detects fine-pointer (desktop mouse) vs coarse-pointer (touch).
 * Used to gate the custom cursor and pointer-only interactions.
 */
export function useIsTouch() {
  const [isTouch, setIsTouch] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(hover: none), (pointer: coarse)");
    const update = () => setIsTouch(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isTouch;
}

/** True only once we've confirmed a fine pointer (desktop). */
export function useIsDesktop() {
  const isTouch = useIsTouch();
  return isTouch === false; // null while resolving => false until sure
}
