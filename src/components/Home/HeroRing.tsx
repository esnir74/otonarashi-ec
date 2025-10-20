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
  const animationRef = useRef<number>(0);

  const theta = 360 / itemsPerCircle;
  const radius = Math.round(
    imageSize / Math.tan(Math.PI / itemsPerCircle) / 1.5
  );

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

  // 画像を繰り返して配列作成
  const circleImages = Array.from({ length: itemsPerCircle }, (_, i) => {
    const imageIndex = i % images.length;
    return { ...images[imageIndex], uniqueKey: i };
  });

  console.log("Images loaded:", circleImages.length); // デバッグ用
  console.log("Radius:", radius); // デバッグ用

  return (
    <section className="relative w-full h-screen overflow-hidden bg-white">
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
          perspective: "2000px",
          perspectiveOrigin: "center center",
        }}
      >
        {/* Carousel Container */}
        <div
          className="relative"
          style={{
            width: `${imageSize}px`,
            height: `${imageSize}px`,
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
                  width: `${imageSize}px`,
                  height: `${imageSize}px`,
                  transform: `
                    rotateY(${angle}deg)
                    translateZ(${radius}px)
                  `,
                  transformStyle: "preserve-3d",
                }}
              >
                <div className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl bg-blue-200">
                  {/* まずは色付きボックスで確認 */}
                  <div className="w-full h-full flex items-center justify-center text-4xl font-bold">
                    {index + 1}
                  </div>

                  {/* 画像 */}
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={imageSize}
                    height={imageSize}
                    className="object-cover w-full h-full absolute inset-0"
                    priority={index < 4}
                    sizes={`${imageSize}px`}
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
        <div className="relative z-[200] h-full flex flex-col items-center justify-center text-center px-4 pointer-events-none">
          <div className="pointer-events-auto bg-white/80 backdrop-blur-sm px-8 py-6 rounded-2xl shadow-xl">
            {children}
          </div>
        </div>
      )}
    </section>
  );
}
