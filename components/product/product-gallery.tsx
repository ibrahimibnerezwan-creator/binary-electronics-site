"use client";
import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
export function ProductGallery({
  images,
  name = "Product",
}: {
  images: string[];
  name?: string;
}) {
  const [active, setActive] = useState(0);
  const photos = images.length ? images : ["/logo.png"];
  return (
    <div>
      <div className="sf-gallery-photo">
        <a
          href={photos[active]}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open full-size product image"
        >
          <Image
            src={photos[active]}
            alt={name}
            fill
            priority
            sizes="(max-width: 640px) 100vw, 50vw"
          />
        </a>
        <span className="sf-gallery-zoom">
          <ZoomIn size={19} />
        </span>
        {photos.length > 1 && (
          <>
            <button
              className="sf-gallery-arrow"
              style={{ left: 12 }}
              onClick={() =>
                setActive((active - 1 + photos.length) % photos.length)
              }
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              className="sf-gallery-arrow"
              style={{ right: 12 }}
              onClick={() => setActive((active + 1) % photos.length)}
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>
      {photos.length > 1 && (
        <div className="sf-gallery-thumbs">
          {photos.map((photo, index) => (
            <button
              key={index}
              onClick={() => setActive(index)}
              aria-label={`Show image ${index + 1}`}
              aria-pressed={index === active}
            >
              <Image
                src={photo}
                alt={`${name}, view ${index + 1}`}
                fill
                sizes="72px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
