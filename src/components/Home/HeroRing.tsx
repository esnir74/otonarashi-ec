// components/HeroRing3D.tsx
"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const SPIN_DURATION = 2;
const PAUSE_DURATION = 0.4;
const REVEAL_DURATION = 0.3;
const LOGO_FLOAT_DURATION = 1.6;
const SECONDARY_OVERLAY_DELAY = 0.08;
const INTRO_PHASE_DURATION = SPIN_DURATION + PAUSE_DURATION + REVEAL_DURATION;
const TOTAL_DURATION =
  SPIN_DURATION + PAUSE_DURATION + REVEAL_DURATION + LOGO_FLOAT_DURATION;

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

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
  const [elapsedSeconds, setElapsedSeconds] = useState(0); // 経過時間（秒）
  const [introComplete, setIntroComplete] = useState(false);
  const [logoRevealComplete, setLogoRevealComplete] = useState(false);
  const animationRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const rotationRef = useRef(0);

  const theta = 360 / itemsPerCircle;
  const effectiveImageSize = isMobile
    ? Math.min(imageSize * 0.9, 280)
    : imageSize;
  const baseRadius = Math.round(
    effectiveImageSize /
      Math.tan(Math.PI / itemsPerCircle) /
      (isMobile ? 1.7 : 1.2)
  );
  const perspective = isMobile ? 2000 : 2200;

  const rotationSpeedDegPerSecond = 360 / SPIN_DURATION;

  useEffect(() => {
    if (typeof window === "undefined") return;

    rotationRef.current = 0;
    setRotation(0);
    setElapsedSeconds(0);
    setIntroComplete(false);
    setLogoRevealComplete(false);

    const start =
      typeof performance !== "undefined" ? performance.now() : Date.now();
    startTimeRef.current = start;

    const animate = (now: number) => {
      const elapsed = (now - startTimeRef.current) / 1000; /* 秒単位 */
      const clampedElapsed = Math.min(elapsed, TOTAL_DURATION);
      setElapsedSeconds(clampedElapsed);

      const spinElapsed = Math.min(elapsed, SPIN_DURATION);
      const newRotation = spinElapsed * rotationSpeedDegPerSecond;
      if (rotationRef.current !== newRotation) {
        rotationRef.current = newRotation;
        setRotation(newRotation);
      }

      if (elapsed < TOTAL_DURATION) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [itemsPerCircle, theta]);

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
      onchange:
        | ((this: MediaQueryList, ev: MediaQueryListEvent) => void)
        | null;
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
  const rotationProgress = clamp(elapsedSeconds / SPIN_DURATION);
  const fadeProgress =
    rotationProgress <= 0.45 ? 0 : clamp((rotationProgress - 0.45) / 0.35);
  const fadeOpacity = 1 - fadeProgress;
  const revealStart = SPIN_DURATION + PAUSE_DURATION;
  const primaryOverlayProgress = clamp(
    (elapsedSeconds - revealStart) / REVEAL_DURATION
  );
  const secondaryOverlayDuration = Math.max(
    REVEAL_DURATION - SECONDARY_OVERLAY_DELAY,
    0.05
  );
  const secondaryOverlayProgress = clamp(
    (elapsedSeconds - (revealStart + SECONDARY_OVERLAY_DELAY)) /
      secondaryOverlayDuration
  );
  const primaryTranslateX = `${primaryOverlayProgress * 120}%`;
  const secondaryTranslateX = `${secondaryOverlayProgress * 120}%`;
  const heroLogoProgress = clamp(
    (elapsedSeconds - (revealStart + REVEAL_DURATION + 0.7)) /
      LOGO_FLOAT_DURATION
  );
  const heroLogoEase =
    heroLogoProgress <= 0 ? 0 : 1 - Math.pow(1 - heroLogoProgress, 3);
  const heroLogoOpacity = heroLogoEase;
  const heroLogoTranslateY = (1 - heroLogoEase) * 5;
  const introActive = elapsedSeconds < INTRO_PHASE_DURATION;

  useEffect(() => {
    if (!introActive && !introComplete) {
      setIntroComplete(true);
    }
  }, [introActive, introComplete]);

  useEffect(() => {
    if (!logoRevealComplete && heroLogoProgress >= 0.999) {
      setLogoRevealComplete(true);
    }
  }, [heroLogoProgress, logoRevealComplete]);

  const overlayActive = introActive || !introComplete;

  useEffect(() => {
    if (typeof document === "undefined") return;

    const body = document.body;
    const className = "hero-intro-active";

    if (overlayActive) {
      body.classList.add(className);
    } else {
      body.classList.remove(className);
    }

    return () => {
      body.classList.remove(className);
    };
  }, [overlayActive]);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const body = document.body;
    const className = "hero-logo-revealed";

    if (logoRevealComplete) {
      body.classList.add(className);
    } else {
      body.classList.remove(className);
    }

    return () => {
      body.classList.remove(className);
    };
  }, [logoRevealComplete]);
  const containerClassName = overlayActive
    ? "fixed inset-0 z-[999] flex h-full min-h-screen w-full items-center justify-center overflow-hidden bg-transparent transition-[transform,opacity] duration-500"
    : "relative flex h-full w-full items-center justify-center overflow-hidden bg-transparent transition-[transform,opacity] duration-500";
  const containerStyle = overlayActive
    ? undefined
    : { minHeight: "calc(100vh - var(--header-height, 64px))" };

  return (
    <section
      data-hero-overlay={overlayActive ? "active" : "inactive"}
      className={containerClassName}
      style={containerStyle}
    >
      {/* Background reveal */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-neutral-200"
          style={{
            transform: `translateX(${primaryTranslateX})`,
          }}
        />
        <div
          className="absolute inset-0 bg-neutral-200/70"
          style={{
            transform: `translateX(${secondaryTranslateX})`,
          }}
        />
      </div>

      {/* Logo reveal after background slides */}
      <div
        className="pointer-events-none absolute z-10 flex items-center justify-center"
        style={{
          top: overlayActive ? 0 : "var(--header-height, 64px)",
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <div
          className="relative transition-all ease-out w-[60vw] md:w-[40vw] max-w-[780px] md:max-w-[520px] min-w-[220px]"
          style={{
            opacity: heroLogoOpacity,
            transform: `translateY(calc(${heroLogoTranslateY}px - 80%))`,
          }}
        >
          <Image
            src="/logo.webp"
            alt="Otonarashi wordmark"
            width={775}
            height={261}
            className="w-full h-auto object-contain"
            priority
          />
        </div>
      </div>

      {/* 3D Container */}
      <div
        className="absolute z-20 flex items-center justify-center"
        style={{
          top: overlayActive ? 0 : "var(--header-height, 64px)",
          left: 0,
          right: 0,
          bottom: 0,
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
            transform: `rotateY(${rotation % 360}deg)`,
          }}
        >
          {circleImages.map((image, index) => {
            const angle = index * theta;
            const opacity = fadeOpacity;

            return (
              <div
                key={image.uniqueKey}
                className="absolute top-0 left-0 transition-opacity duration-300"
                style={{
                  width: `${effectiveImageSize}px`,
                  height: `${effectiveImageSize}px`,
                  transform: `
                    rotateY(${angle}deg)
                    translateZ(${baseRadius}px)
                  `,
                  transformStyle: "preserve-3d",
                  opacity: opacity <= 0.001 ? 0 : opacity,
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
