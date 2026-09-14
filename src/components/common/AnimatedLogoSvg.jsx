import React, { useState, useMemo } from 'react';
import logoPaths from './logoPaths.json';

function isWhitePath(p) {
  if (p.fill === 'rgb(253,253,253)') return true;
  if (p.fill === 'rgb(204,200,210)') return true;
  const m = p.fill.match(/rgb\\s*\\(\\s*(\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)\\s*\\)/i);
  if (!m) return false;
  const r = parseInt(m[1]), g = parseInt(m[2]), b = parseInt(m[3]);
  const isGoldOrAccent = (r > 170 && g > 150 && b < 160) || (r - b > 45) || (r < 80);
  if (isGoldOrAccent) return false;
  return (r > 190 && g > 190 && b > 180);
}

/**
 * AnimatedLogoSvg Component
 * Silky smooth, 60fps hardware-accelerated vector drawing:
 *  - White elements (dome + left-to-right SAPORE VERACE lettering) draw first.
 *  - Golden elements (flame, subtitle, borders, and signature) draw next.
 *  - Uses 2-point keyframes with GPU transforms to eliminate any micro-stutter.
 */
export const AnimatedLogoSvg = ({
  className = 'w-full h-auto',
  style = {},
  animate = true,
  strokeWidth = 2.5,
  allowReplay = true,
}) => {
  const [animationKey, setAnimationKey] = useState(0);

  const handleReplay = () => {
    if (!allowReplay) return;
    setAnimationKey((prev) => prev + 1);
  };

  // Pre-calculate sorted groups for organic reading flow (Left to Right)
  const { whitePaths, colorPaths } = useMemo(() => {
    const enriched = logoPaths.map((p) => {
      const nums = p.d.match(/[0-9.]+/g).map(Number);
      const ys = nums.filter((_, idx) => idx % 2 === 1);
      const xs = nums.filter((_, idx) => idx % 2 === 0);
      return {
        ...p,
        minY: Math.min(...ys),
        minX: Math.min(...xs),
        isWhite: isWhitePath(p),
      };
    });

    const whites = enriched.filter((p) => p.isWhite);
    // Sort dome first, then letters from left to right
    whites.sort((a, b) => {
      if (a.minY < 1000 && b.minY >= 1000) return -1;
      if (b.minY < 1000 && a.minY >= 1000) return 1;
      return a.minX - b.minX;
    });

    const colors = enriched.filter((p) => !p.isWhite);
    // Sort flame first, then details from left to right
    colors.sort((a, b) => {
      if (a.minY < 1000 && b.minY >= 1000) return -1;
      if (b.minY < 1000 && a.minY >= 1000) return 1;
      return a.minX - b.minX;
    });

    return { whitePaths: whites, colorPaths: colors };
  }, []);

  return (
    <div
      onClick={handleReplay}
      className={`relative inline-flex items-center justify-center select-none ${
        allowReplay ? 'cursor-pointer' : ''
      } ${className}`}
      style={style}
      title={allowReplay ? 'Clicca per rivedere l\'animazione' : undefined}
    >
      <svg
        key={animationKey}
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1996 2000"
        className="w-full h-full object-contain overflow-visible"
        style={{
          filter: 'drop-shadow(0 15px 35px rgba(0,0,0,0.9)) drop-shadow(0 0 25px rgba(210,64,30,0.25))',
          transform: 'translate3d(0, 0, 0)',
        }}
      >
        <defs>
          <style>
            {`
              @keyframes strokeDraw {
                from {
                  stroke-dashoffset: 100;
                }
                to {
                  stroke-dashoffset: 0;
                }
              }

              @keyframes fillFadeIn {
                from {
                  fill-opacity: 0;
                }
                to {
                  fill-opacity: var(--target-fill-op, 1);
                }
              }

              .anim-stroke-white {
                stroke-dasharray: 100;
                stroke-dashoffset: 100;
                fill-opacity: 0;
                animation:
                  strokeDraw 1.1s cubic-bezier(0.22, 1, 0.36, 1) forwards,
                  fillFadeIn 0.5s ease-out forwards;
              }

              .anim-stroke-color {
                stroke-dasharray: 100;
                stroke-dashoffset: 100;
                fill-opacity: 0;
                animation:
                  strokeDraw 1.1s cubic-bezier(0.22, 1, 0.36, 1) forwards,
                  fillFadeIn 0.5s ease-out forwards;
              }

              .anim-static {
                stroke-dashoffset: 0;
                fill-opacity: var(--target-fill-op, 1);
              }
            `}
          </style>
        </defs>

        <g>
          {/* 1. FIRST: ALL WHITE ELEMENTS (Dome first, then Letters L-to-R: 0.0s to 1.1s) */}
          {whitePaths.map((p, index) => {
            const strokeDelay = (index / whitePaths.length) * 0.7;
            const fillDelay = strokeDelay + 0.45;
            const targetOpacity = p.opacity !== undefined ? p.opacity : 1;
            const strokeColor = '#ffffff';

            return (
              <path
                key={`white-${p.id || index}`}
                d={p.d}
                transform={p.transform || undefined}
                pathLength="100"
                fill={p.fill}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                className={animate ? 'anim-stroke-white' : 'anim-static'}
                style={{
                  '--target-fill-op': targetOpacity,
                  animationDelay: animate ? `${strokeDelay.toFixed(3)}s, ${fillDelay.toFixed(3)}s` : '0s, 0s',
                }}
              />
            );
          })}

          {/* 2. SECOND: ALL GOLD/ACCENT ELEMENTS (Starts at 1.25s: Flame, Subtitle, Signature) */}
          {colorPaths.map((p, index) => {
            const baseDelay = 1.25;
            const strokeDelay = baseDelay + (index / colorPaths.length) * 0.8;
            const fillDelay = strokeDelay + 0.45;
            const targetOpacity = p.opacity !== undefined ? p.opacity : 1;
            const strokeColor = p.fill || '#ceb964';

            return (
              <path
                key={`color-${p.id || index}`}
                d={p.d}
                transform={p.transform || undefined}
                pathLength="100"
                fill={p.fill}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                className={animate ? 'anim-stroke-color' : 'anim-static'}
                style={{
                  '--target-fill-op': targetOpacity,
                  animationDelay: animate ? `${strokeDelay.toFixed(3)}s, ${fillDelay.toFixed(3)}s` : '0s, 0s',
                }}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export default AnimatedLogoSvg;
