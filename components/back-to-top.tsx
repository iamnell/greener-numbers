"use client";

import { useEffect, useState } from "react";

const SCROLL_THRESHOLD = 600;

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => setVisible(window.scrollY >= SCROLL_THRESHOLD);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const scrollToTop = () => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  };

  return <button className="back-to-top" type="button" aria-label="Back to top" onClick={scrollToTop} hidden={!visible}>↑</button>;
}
