import React, { useState, useEffect, useRef } from 'react';

/**
 * ParallaxCard - Ultra-smooth entrance animation + 3D magnetic tilt following mouse cursor.
 * Inspired by the DitchWich interactive card physics.
 */
export default function ParallaxCard({
  children,
  delay = 0,
  duration = 1.2,
  maxTiltDeg = 6,
  maxTranslatePx = 6,
  style = {},
  className = '',
  onClick,
  ...props
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, tx: 0, ty: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const domRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (domRef.current) observer.unobserve(domRef.current);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );

    const { current } = domRef;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, []);

  const handleMouseMove = (e) => {
    if (!domRef.current) return;
    const rect = domRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    // Calculate mouse position ratio relative to center (-1 to +1)
    const rx = ((y - cy) / cy) * -maxTiltDeg;
    const ry = ((x - cx) / cx) * maxTiltDeg;
    const tx = ((x - cx) / cx) * maxTranslatePx;
    const ty = ((y - cy) / cy) * maxTranslatePx;

    setTilt({ rx, ry, tx, ty });
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0, tx: 0, ty: 0 });
    setIsHovered(false);
  };

  return (
    <div
      ref={domRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? isHovered
            ? `perspective(1000px) rotateX(${tilt.rx.toFixed(2)}deg) rotateY(${tilt.ry.toFixed(2)}deg) translate3d(${tilt.tx.toFixed(2)}px, ${tilt.ty.toFixed(2)}px, 0px)`
            : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translate3d(0px, 0px, 0px)'
          : 'perspective(1000px) translateY(55px) scale(0.96)',
        transition: isHovered
          ? 'transform 0.15s ease-out, opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1)'
          : `opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
        willChange: 'opacity, transform',
        transformStyle: 'preserve-3d',
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
}
