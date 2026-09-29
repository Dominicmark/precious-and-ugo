import React from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'motion/react';

export const VintageMapBackground: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();

  const smoothScrollY = useSpring(scrollY, {
    stiffness: 55,
    damping: 24,
    restDelta: 0.001,
  });

  // Slow depth parallax for the background map and floral elements (-0.05x to -0.12x)
  const mapY = useTransform(smoothScrollY, [0, 3500], [0, -160]);
  const compassRotate = useTransform(smoothScrollY, [0, 3500], [0, 45]);
  const floralYLeft = useTransform(smoothScrollY, [0, 3500], [0, -220]);
  const floralYRight = useTransform(smoothScrollY, [0, 3500], [0, -190]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
      {/* 1. Base Warm Tea-Stained Antique Parchment Canvas */}
      <div className="absolute inset-0 bg-[#FAF5EA] vintage-parchment-texture" />

      {/* 2. Antique Cartography Lines & Compass Rose Watermark */}
      <motion.div
        style={{ y: shouldReduceMotion ? 0 : mapY }}
        className="absolute inset-0 flex items-center justify-center opacity-40 will-change-transform"
      >
        <svg
          viewBox="0 0 1000 1000"
          className="w-[900px] h-[900px] text-[#D6B477]/35 stroke-current"
          fill="none"
          strokeWidth="1"
        >
          {/* Subtle Latitude / Longitude Curvature Rings */}
          <circle cx="500" cy="500" r="420" strokeDasharray="4 8" />
          <circle cx="500" cy="500" r="340" strokeWidth="0.75" />
          <circle cx="500" cy="500" r="260" strokeDasharray="3 6" />
          <circle cx="500" cy="500" r="180" strokeWidth="0.75" />

          {/* Compass Coordinate Axes */}
          <line x1="80" y1="500" x2="920" y2="500" strokeWidth="0.5" strokeDasharray="8 6" />
          <line x1="500" y1="80" x2="500" y2="920" strokeWidth="0.5" strokeDasharray="8 6" />
          <line x1="200" y1="200" x2="800" y2="800" strokeWidth="0.5" strokeDasharray="6 8" />
          <line x1="800" y1="200" x2="200" y2="800" strokeWidth="0.5" strokeDasharray="6 8" />

          {/* Antique Compass Rose Watermark */}
          <g transform="translate(500, 500)">
            {/* North Star Points */}
            <polygon points="0,-140 18,-35 0,-15 -18,-35" fill="currentColor" opacity="0.4" />
            <polygon points="0,140 18,35 0,15 -18,35" fill="currentColor" opacity="0.4" />
            <polygon points="-140,0 -35,18 -15,0 -35,-18" fill="currentColor" opacity="0.4" />
            <polygon points="140,0 35,18 15,0 35,-18" fill="currentColor" opacity="0.4" />

            <polygon points="-90,-90 -25,-40 -10,-10 -40,-25" fill="currentColor" opacity="0.25" />
            <polygon points="90,-90 40,-25 10,-10 25,-40" fill="currentColor" opacity="0.25" />
            <polygon points="-90,90 -40,25 -10,10 -25,40" fill="currentColor" opacity="0.25" />
            <polygon points="90,90 25,40 10,10 40,25" fill="currentColor" opacity="0.25" />

            {/* Inner Gold Rings */}
            <circle cx="0" cy="0" r="32" strokeWidth="1.5" />
            <circle cx="0" cy="0" r="16" fill="currentColor" opacity="0.3" />
            <circle cx="0" cy="0" r="4" fill="#0E1B2E" />
          </g>
        </svg>
      </motion.div>

      {/* 3. High-Res Watercolor Floral Wedding Wallpaper (faintly blended into parchment) */}
      <motion.div
        style={{
          y: shouldReduceMotion ? 0 : mapY,
          backgroundImage:
            'url("https://res.cloudinary.com/dbbw8jsjc/image/upload/f_auto,q_auto:good,w_1600/v1790564842/Watercolor_floral_wedding_invita__2K_20260928040504_c91ftu.jpg")',
        }}
        className="absolute -inset-y-20 inset-x-0 bg-cover bg-center bg-no-repeat opacity-35 mix-blend-multiply will-change-transform"
      />

      {/* 4. Delicate Vignette & Light Veil to Ensure Flawless Text Legibility */}
      <div className="absolute inset-0 bg-radial-[circle_at_center] from-transparent via-[#FAF5EA]/35 to-[#FAF5EA]/70" />
    </div>
  );
};
