"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function AOSInit() {
  useEffect(() => {
    let timeoutId: number | null = null;

    const initAOS = () => {
      timeoutId = window.setTimeout(() => {
        AOS.init({
          duration: 1000,
          once: true,
        });
        AOS.refreshHard();
      }, 120);
    };

    if (document.readyState === "complete") {
      initAOS();
    } else {
      window.addEventListener("load", initAOS, { once: true });
    }

    return () => {
      window.removeEventListener("load", initAOS);
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  return null;
}
