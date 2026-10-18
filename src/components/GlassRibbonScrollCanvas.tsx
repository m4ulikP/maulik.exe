import React, { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './GlassRibbonScrollCanvas.css';

gsap.registerPlugin(ScrollTrigger);

export interface GlassRibbonScrollCanvasProps {
  isReducedMotion?: boolean;
}

const TOTAL_FRAMES = 240;

/**
 * 194 deduplicated, temporally continuous frame indices.
 * Strips 46 duplicated telecine frames (e.g. 13, 18, 23, 28...) to eliminate cadence stutter.
 */
const CLEAN_FRAME_INDICES: number[] = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17, 19, 20, 21, 22, 24, 25, 26, 27, 29, 30, 31, 32,
  34, 35, 36, 37, 39, 40, 41, 42, 44, 45, 46, 47, 49, 50, 51, 52, 54, 55, 56, 57, 59, 60, 61, 62, 64, 65,
  66, 67, 69, 70, 71, 72, 74, 75, 76, 77, 79, 80, 81, 82, 84, 85, 86, 87, 89, 90, 91, 92, 94, 95, 96, 97,
  99, 100, 101, 102, 104, 105, 106, 107, 109, 110, 111, 112, 114, 115, 116, 117, 119, 120, 121, 122, 124, 125,
  126, 127, 129, 130, 131, 132, 134, 135, 136, 137, 139, 140, 141, 142, 144, 145, 146, 147, 149, 150, 151, 152,
  154, 155, 156, 157, 159, 160, 161, 162, 164, 165, 166, 167, 169, 170, 171, 172, 174, 175, 176, 177, 179, 180,
  181, 182, 184, 185, 186, 187, 189, 190, 191, 192, 194, 195, 196, 197, 199, 200, 201, 202, 204, 205, 206, 207,
  209, 210, 211, 212, 214, 215, 216, 217, 219, 220, 221, 222, 224, 225, 226, 227, 229, 230, 231, 232, 234, 235,
  236, 237, 239, 240
];

/**
 * Numerically sorted URL generator for the glass-ribbon sequence.
 * Range: 1 to 240 (ezgif-frame-001.jpg to ezgif-frame-240.jpg)
 */
const getFrameUrl = (frameIndex: number): string => {
  const clamped = Math.max(1, Math.min(TOTAL_FRAMES, frameIndex));
  const padded = String(clamped).padStart(3, '0');
  return `/sequences/glass-ribbon/ezgif-frame-${padded}.jpg`;
};

export const GlassRibbonScrollCanvas: React.FC<GlassRibbonScrollCanvasProps> = ({
  isReducedMotion = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // In-memory image cache: frame index (1-240) -> HTMLImageElement
  const imageCacheRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const activeFloatPosRef = useRef<number>(0);
  const isCancelledRef = useRef<boolean>(false);

  // Responsive optical framing configuration (read from CSS custom properties on resize)
  const framingConfigRef = useRef<{
    offsetXRatio: number;
    offsetYRatio: number;
    overscale: number;
  }>({
    offsetXRatio: 0,
    offsetYRatio: 0.04,
    overscale: 1.22,
  });

  /**
   * High-performance canvas drawing function with sub-frame alpha blending,
   * high-quality anti-aliasing, and integer pixel alignment to eliminate edge crawling.
   */
  const renderCompositeToCanvas = useCallback(
    (imgA: HTMLImageElement, imgB: HTMLImageElement | null, blendAlpha: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const cw = canvas.width;
      const ch = canvas.height;
      if (cw === 0 || ch === 0) return;

      const iw = imgA.naturalWidth || 1920;
      const ih = imgA.naturalHeight || 1080;

      // Optical centering with responsive overscale and focal mass centering.
      // The 3D ribbon sculpture's visual center in the 1920x1080 source frames sits at ~1160px (~60.4% from left).
      const RIBBON_FOCAL_X_RATIO = 0.604;
      const { offsetXRatio, offsetYRatio, overscale } = framingConfigRef.current;
      const baseScale = Math.max(cw / iw, ch / ih);
      const scale = baseScale * overscale;
      const nw = Math.round(iw * scale);
      const nh = Math.round(ih * scale);
      const cx = Math.round((cw * 0.5) - (nw * RIBBON_FOCAL_X_RATIO) + (cw * offsetXRatio));
      const cy = Math.round((ch - nh) / 2 + (ch * offsetYRatio));

      // Enable high-quality bicubic smoothing for clean refraction caustics
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      ctx.clearRect(0, 0, cw, ch);

      // Draw primary base frame
      ctx.globalAlpha = 1.0;
      ctx.drawImage(imgA, cx, cy, nw, nh);

      // Seamless optical sub-frame cross-fade
      if (imgB && blendAlpha > 0.005) {
        ctx.globalAlpha = Math.min(1, Math.max(0, blendAlpha));
        ctx.drawImage(imgB, cx, cy, nw, nh);
      }

      ctx.globalAlpha = 1.0;
    },
    []
  );

  /**
   * Draw interpolated continuous position across clean deduplicated frames
   */
  const drawInterpolatedFrame = useCallback(
    (floatPos: number) => {
      const cache = imageCacheRef.current;
      activeFloatPosRef.current = floatPos;

      const maxIdx = CLEAN_FRAME_INDICES.length - 1;
      const clampedPos = Math.max(0, Math.min(maxIdx, floatPos));
      const lowerIdx = Math.floor(clampedPos);
      const upperIdx = Math.min(maxIdx, Math.ceil(clampedPos));
      const alpha = clampedPos - lowerIdx;

      const frameA = CLEAN_FRAME_INDICES[lowerIdx];
      const frameB = CLEAN_FRAME_INDICES[upperIdx];

      const imgA = cache.get(frameA);
      const imgB = cache.get(frameB);

      if (imgA && imgB && frameA !== frameB && alpha > 0.01) {
        renderCompositeToCanvas(imgA, imgB, alpha);
        return;
      }

      if (imgA) {
        renderCompositeToCanvas(imgA, null, 0);
        return;
      }

      if (imgB) {
        renderCompositeToCanvas(imgB, null, 0);
        return;
      }

      // Fallback: Search nearest loaded neighbor to prevent momentary dropouts
      let nearestDist = Infinity;
      let nearestImg: HTMLImageElement | null = null;

      for (const [idx, img] of cache.entries()) {
        const dist = Math.abs(idx - frameA);
        if (dist < nearestDist) {
          nearestDist = dist;
          nearestImg = img;
        }
      }

      if (nearestImg) {
        renderCompositeToCanvas(nearestImg, null, 0);
      }
    },
    [renderCompositeToCanvas]
  );

  /**
   * Resize observer to maintain crisp DPR rendering without layout shifts
   */
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);

      // Read responsive framing configuration tokens from container CSS
      const containerStyle = window.getComputedStyle(container);
      const rawOffsetX = parseFloat(containerStyle.getPropertyValue('--ribbon-optical-offset-x'));
      const rawOffsetY = parseFloat(containerStyle.getPropertyValue('--ribbon-optical-offset-y'));
      const rawOverscale = parseFloat(containerStyle.getPropertyValue('--ribbon-overscale'));
      framingConfigRef.current = {
        offsetXRatio: Number.isFinite(rawOffsetX) ? rawOffsetX : 0,
        offsetYRatio: Number.isFinite(rawOffsetY) ? rawOffsetY : 0.04,
        overscale: Number.isFinite(rawOverscale) ? rawOverscale : 1.22,
      };

      // Redraw current active position on resize
      drawInterpolatedFrame(activeFloatPosRef.current);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    window.addEventListener('resize', handleResize, { passive: true });
    handleResize();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [drawInterpolatedFrame]);

  /**
   * Three-tier progressive preloading:
   * 1. Hero keyframe 1 immediate paint
   * 2. Hero initial cluster (frames 1–35) pre-buffered sequentially
   * 3. Background timeline streaming with active-frame reactive redraw
   */
  useEffect(() => {
    isCancelledRef.current = false;
    const cache = imageCacheRef.current;

    const loadSingleImage = (frameIdx: number): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        if (cache.has(frameIdx)) {
          resolve(cache.get(frameIdx)!);
          return;
        }

        const img = new Image();
        img.src = getFrameUrl(frameIdx);
        img.onload = () => {
          if (!isCancelledRef.current) {
            cache.set(frameIdx, img);
            // If the active position is waiting on this frame, immediately update canvas
            const curLower = CLEAN_FRAME_INDICES[Math.floor(activeFloatPosRef.current)] || 1;
            const curUpper = CLEAN_FRAME_INDICES[Math.ceil(activeFloatPosRef.current)] || 1;
            if (frameIdx === curLower || frameIdx === curUpper) {
              drawInterpolatedFrame(activeFloatPosRef.current);
            }
            resolve(img);
          }
        };
        img.onerror = () => {
          reject(new Error(`Failed to load frame ${frameIdx}`));
        };
      });
    };

    // Priority 1: Load frame 1 immediately for instant hero paint
    loadSingleImage(1)
      .then(() => {
        if (isCancelledRef.current) return;
        drawInterpolatedFrame(0);

        // Priority 2: Pre-buffer the first 35 hero frames sequentially for butter-smooth initial exploration
        const heroFrames = CLEAN_FRAME_INDICES.slice(1, 35);
        // Priority 3: Remaining frames across timeline
        const remainingFrames = CLEAN_FRAME_INDICES.slice(35);

        const queue = [...heroFrames, ...remainingFrames];
        const CONCURRENCY = 4;
        let activeRequests = 0;
        let queueIndex = 0;

        const processQueue = () => {
          if (isCancelledRef.current) return;

          while (activeRequests < CONCURRENCY && queueIndex < queue.length) {
            const nextFrame = queue[queueIndex++];
            activeRequests++;

            loadSingleImage(nextFrame)
              .catch(() => {
                // Ignore transient network hiccups
              })
              .finally(() => {
                activeRequests--;
                processQueue();
              });
          }
        };

        if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
          (window as unknown as { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(() => {
            processQueue();
          });
        } else {
          setTimeout(processQueue, 40);
        }
      })
      .catch((err) => {
        console.warn('Initial frame 1 load error:', err);
      });

    return () => {
      isCancelledRef.current = true;
    };
  }, [drawInterpolatedFrame]);

  /**
   * GSAP ScrollTrigger Integration for Site-Wide Scroll-Controlled Playback
   */
  useEffect(() => {
    if (isReducedMotion) {
      // In reduced motion, present a serene static frame without scroll scrubbing
      drawInterpolatedFrame(0);
      return;
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5, // Buttery smooth spring interpolation across entire document scroll
        onUpdate: (self) => {
          const progress = self.progress; // 0.0 (top of page) to 1.0 (bottom of page)
          const floatPos = progress * (CLEAN_FRAME_INDICES.length - 1);
          drawInterpolatedFrame(floatPos);
        },
      });
    });

    return () => {
      ctx.revert();
    };
  }, [isReducedMotion, drawInterpolatedFrame]);

  return (
    <div
      ref={containerRef}
      className={`glass-ribbon-background ${isReducedMotion ? 'reduced-motion' : ''}`}
      aria-hidden="true"
      data-liquid-ignore="true"
    >
      {/* Spectral Ambient Lighting Backdrop (Cobalt, Cyan, Emerald & subtle violet caustics) */}
      <div className="glass-ribbon-spectral-lighting" />

      <canvas
        ref={canvasRef}
        className="glass-ribbon-canvas"
      />

      {/* Central Reading Column Scrim (reduces prominence behind hero text & dense content) */}
      <div className="glass-ribbon-center-scrim" />

      {/* Atmospheric Radial Vignette & Edge Blending Overlay */}
      <div className="glass-ribbon-vignette-overlay" />
    </div>
  );
};
