"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type ProductGalleryProps = {
  images: string[];
  productName: string;
  mainImageBlur?: string | null;
  subImageBlurs?: (string | null)[];
};

export default function ProductGallery({
  images,
  productName,
  mainImageBlur,
  subImageBlurs,
}: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const thumbScrollRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);

  if (images.length === 0) {
    return (
      <div className="relative aspect-square w-full overflow-hidden bg-neutral-100">
        <div className="flex h-full items-center justify-center text-neutral-400">
          No image
        </div>
      </div>
    );
  }

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentIndex < images.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleScroll = () => {
    if (!scrollRef.current || isScrollingRef.current) return;

    const scrollLeft = scrollRef.current.scrollLeft;
    const width = scrollRef.current.offsetWidth;
    const newIndex = Math.round(scrollLeft / width);

    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < images.length) {
      setCurrentIndex(newIndex);
    }
  };

  useEffect(() => {
    if (!scrollRef.current) return;

    isScrollingRef.current = true;
    const width = scrollRef.current.offsetWidth;

    scrollRef.current.scrollTo({
      left: currentIndex * width,
      behavior: "smooth",
    });

    const timer = setTimeout(() => {
      isScrollingRef.current = false;
    }, 800);

    return () => clearTimeout(timer);
  }, [currentIndex, images.length]);

  // サムネイルを自動スクロール
  useEffect(() => {
    if (!thumbScrollRef.current) return;

    const thumbButtons = thumbScrollRef.current.querySelectorAll("button");
    const activeThumb = thumbButtons[currentIndex];

    if (activeThumb) {
      activeThumb.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [currentIndex]);

  return (
    <section className="lg:col-span-7 min-w-0">
      {/* メイン表示 */}
      <div className="relative aspect-square w-full overflow-hidden bg-neutral-100">
        {/* スクロール可能なコンテナ */}
        <div
          ref={scrollRef}
          className="flex h-full w-full snap-x snap-mandatory overflow-x-auto scrollbar-none"
          onScroll={handleScroll}
        >
          {images.map((src, i) => (
            <div
              key={i}
              className="relative h-full w-full shrink-0 snap-center snap-always"
            >
              <Image
                src={src}
                alt={`${productName} - ${i + 1}`}
                fill
                sizes="(min-width: 1024px) 48vw, 100vw"
                className="object-cover"
                placeholder={
                  (i === 0 && mainImageBlur) || subImageBlurs?.[i - 1]
                    ? "blur"
                    : "empty"
                }
                blurDataURL={
                  (i === 0 ? mainImageBlur : subImageBlurs?.[i - 1]) ||
                  undefined
                }
              />
            </div>
          ))}
        </div>

        {/* 前へボタン */}
        {currentIndex > 0 && (
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-500/50 text-white transition-colors hover:bg-gray-600/60"
            aria-label="Previous image"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>
        )}

        {/* 次へボタン */}
        {currentIndex < images.length - 1 && (
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-500/50 text-white transition-colors hover:bg-gray-600/60"
            aria-label="Next image"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        )}
      </div>

      {/* サムネイル */}
      {images.length > 1 && (
        <div
          ref={thumbScrollRef}
          className="mt-4 overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-neutral-300 hover:scrollbar-thumb-neutral-400"
        >
          <div className="flex gap-3 pb-1">
            {images.map((src, i) => (
              <button
                key={`thumb-${i}`}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentIndex(i);
                }}
                className={`relative aspect-square w-20 shrink-0 overflow-hidden border-2 transition-colors ${
                  currentIndex === i
                    ? "border-slate-400"
                    : "border-transparent hover:border-slate-300"
                }`}
              >
                <Image
                  src={src}
                  alt={`thumb ${i + 1}`}
                  fill
                  sizes="100px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
