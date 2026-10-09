"use client";

import { useState } from "react";

export function ImageGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [active, setActive] = useState(0);
  const safe = images.length > 0 ? images : ["/images/placeholder.jpg"];

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-line bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={safe[active]}
          alt={alt}
          className="h-full w-full object-cover"
        />
      </div>

      {safe.length > 1 && (
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {safe.map((src, i) => (
            <button
              key={src + i}
              onClick={() => setActive(i)}
              aria-label={`تصویر ${i + 1}`}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                i === active ? "border-brand-500" : "border-line"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
