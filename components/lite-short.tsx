"use client";

import { useState } from "react";
import type { YouTubeShort } from "../lib/youtube-shorts";

/** Thumbnail-first Short player: the YouTube iframe loads only after a tap. */
export function LiteShort({ short, eager = false }: { short: YouTubeShort; eager?: boolean }) {
  const [playing, setPlaying] = useState(false);
  return <figure className="lite-short">
    <div className="lite-short-frame">
      {playing ? <iframe src={`https://www.youtube-nocookie.com/embed/${short.id}?autoplay=1&playsinline=1&rel=0`} title={short.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
        : <button type="button" onClick={() => setPlaying(true)} aria-label={`Play Short: ${short.title}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`https://i.ytimg.com/vi/${short.id}/hqdefault.jpg`} alt="" width={480} height={360} loading={eager ? "eager" : "lazy"} decoding="async" />
          <span className="lite-short-play" aria-hidden="true">▶</span>
        </button>}
    </div>
    <figcaption><a href={short.url} target="_blank" rel="noreferrer">{short.title}</a></figcaption>
  </figure>;
}
