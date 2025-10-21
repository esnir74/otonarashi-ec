// components/HeroRing3D.tsx
"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export interface RingImage {
  src: string;
  alt: string;
}

export interface HeroRing3DProps {
  images: RingImage[];
  imageSize?: number;
  children?: React.ReactNode;
  itemsPerCircle?: number;
}

export default function HeroRing3D({
  images,
  imageSize = 280,
  children,
  itemsPerCircle = 12,
}: HeroRing3DProps) {
  const [rotation, setRotation] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const animationRef = useRef<number>(0);

  const theta = 360 / itemsPerCircle;
  const effectiveImageSize = isMobile
    ? Math.min(imageSize * 0.9, 280)
    : imageSize;
  const radius = Math.round(
    effectiveImageSize /
      Math.tan(Math.PI / itemsPerCircle) /
      (isMobile ? 1.7 : 1.5)
  );
  const perspective = isMobile ? 2000 : 2200;

  useEffect(() => {
    let lastTime = Date.now();
    const rotationSpeed = 0.15;

    const animate = () => {
      const now = Date.now();
      const delta = now - lastTime;

      if (delta > 16) {
        setRotation((prev) => (prev + rotationSpeed) % 360);
        lastTime = now;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const query = window.matchMedia("(max-width: 768px)");
    const handleChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    setIsMobile(query.matches);

    if (typeof query.addEventListener === "function") {
      query.addEventListener("change", handleChange);
      return () => query.removeEventListener("change", handleChange);
    }

    const legacyQuery = query as MediaQueryList & {
      onchange: ((this: MediaQueryList, ev: MediaQueryListEvent) => void) | null;
    };
    const legacyHandler = (event: MediaQueryListEvent) => handleChange(event);
    legacyQuery.onchange = legacyHandler;

    return () => {
      if (legacyQuery.onchange === legacyHandler) {
        legacyQuery.onchange = null;
      }
    };
  }, []);

  // 画像を繰り返して配列作成
  const circleImages = Array.from({ length: itemsPerCircle }, (_, i) => {
    const imageIndex = i % images.length;
    return { ...images[imageIndex], uniqueKey: i };
  });

  console.log("Images loaded:", circleImages.length); // デバッグ用
  console.log("Radius:", radius); // デバッグ用

  return (
    <section
      className="relative flex h-full w-full items-center justify-center overflow-hidden bg-transparent"
      style={{ minHeight: "calc(100vh - var(--header-height, 64px))" }}
    >
      {/* デバッグ情報 */}
      {/* <div className="absolute top-4 left-4 z-50 bg-black text-white p-4 text-xs">
        <div>Images: {circleImages.length}</div>
        <div>Radius: {radius}px</div>
        <div>Rotation: {rotation.toFixed(2)}°</div>
        <div>ImageSize: {imageSize}px</div>
      </div> */}

      {/* 3D Container */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          perspective: `${perspective}px`,
          perspectiveOrigin: "center center",
        }}
      >
        {/* Carousel Container */}
        <div
          className="relative"
          style={{
            width: `${effectiveImageSize}px`,
            height: `${effectiveImageSize}px`,
            transformStyle: "preserve-3d",
            transform: `rotateY(${rotation}deg)`,
          }}
        >
          {circleImages.map((image, index) => {
            const angle = index * theta;

            return (
              <div
                key={image.uniqueKey}
                className="absolute top-0 left-0"
                style={{
                  width: `${effectiveImageSize}px`,
                  height: `${effectiveImageSize}px`,
                  transform: `
                    rotateY(${angle}deg)
                    translateZ(${radius}px)
                  `,
                  transformStyle: "preserve-3d",
                }}
              >
                <div className="relative w-full h-full overflow-hidden">

                  {/* 画像 */}
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={effectiveImageSize}
                    height={effectiveImageSize}
                    className="object-cover w-full h-full absolute inset-0 opacity-80 brightness-[0.78] saturate-[0.92]"
                    priority={index < 4}
                    sizes={`${effectiveImageSize}px`}
                    onError={(e) => {
                      console.error("Image load error:", image.src);
                    }}
                    onLoad={() => {
                      console.log("Image loaded:", image.src);
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Content Overlay */}
      {children && (
        <div className="pointer-events-none absolute inset-0 z-[200] flex flex-col items-center justify-center px-4 text-center">
          <div className="pointer-events-auto rounded-2xl bg-white/80 px-8 py-6 shadow-xl backdrop-blur-sm">
            {children}
          </div>
        </div>
      )}
    </section>
  );
}
