/* ==========================================================================
   GSAP ENTRY POINT — single source for plugin registration & re-exports
   Import gsap utilities from "@/lib/gsap" in every component.
   ========================================================================== */
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { SplitText } from "gsap/SplitText";
import { Observer } from "gsap/Observer";
import { Flip } from "gsap/Flip";
import { Draggable } from "gsap/Draggable";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { CustomEase } from "gsap/CustomEase";
import { RoughEase, ExpoScaleEase, SlowMo } from "gsap/EasePack";

// Register once. Safe to call multiple times.
gsap.registerPlugin(
  useGSAP,
  ScrollTrigger,
  ScrollToPlugin,
  SplitText,
  Observer,
  Flip,
  Draggable,
  ScrambleTextPlugin,
  CustomEase,
  RoughEase,
  ExpoScaleEase,
  SlowMo
);

/* Re-export so components have one import path */
export { gsap, useGSAP, ScrollTrigger, SplitText, Observer, Flip, Draggable, CustomEase };

