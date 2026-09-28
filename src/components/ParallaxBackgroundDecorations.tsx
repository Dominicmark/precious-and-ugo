import React from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'motion/react';

export const ParallaxBackgroundDecorations: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();

  // Smooth springs for buttery parallax motion
  const smoothScrollY = useSpring(scrollY, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001,
  });

  // Layer 1: Slow depth parallax (-0.1x speed)
  const yLayerSlow = useTransform(smoothScrollY, [0, 3000], [0, -250]);
  const rotateSlow = useTransform(smoothScrollY, [0, 3000], [0, 35]);

  // Layer 2: Medium depth parallax (-0.22x speed)
  const yLayerMed = useTransform(smoothScrollY, [0, 3000], [0, -480]);
  const rotateMed = useTransform(smoothScrollY, [0, 3000], [0, -50]);

  // Layer 3: Dynamic fast parallax (-0.38x speed)
  const yLayerFast = useTransform(smoothScrollY, [0, 3000], [0, -750]);
  const rotateFast = useTransform(smoothScrollY, [0, 3000], [0, 90]);

  // Subtle floating scale effect
  const scalePulsing = useTransform(smoothScrollY, [0, 1500, 3000], [1, 1.08, 0.96]);

  if (shouldReduceMotion) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-5 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* LEFT MARGIN PARALLAX MOTIFS */}

      {/* 1. Top-Left Champagne Gold Laurel & Ring Motif (Slow) */}
      <motion.div
        style={{ y: yLayerSlow, rotate: rotateSlow, scale: scalePulsing }}
        className="absolute -left-12 sm:left-4 top-[14vh] opacity-25 sm:opacity-35"
      >
        <svg
          width="140"
          height="140"
          viewBox="0 0 100 100"
          fill="none"
          stroke="#D6B477"
          strokeWidth="1.2"
          className="drop-shadow-[0_4px_12px_rgba(214,180,119,0.3)]"
        >
          <circle cx="50" cy="50" r="38" strokeDasharray="3 3" />
          <circle cx="50" cy="50" r="32" stroke="#8FB5D1" strokeWidth="0.8" opacity="0.6" />
          <path
            d="M50 18 C58 28 58 42 50 50 C42 42 42 28 50 18 Z"
            fill="#D6B477"
            fillOpacity="0.2"
          />
          <path
            d="M50 82 C58 72 58 58 50 50 C42 58 42 72 50 82 Z"
            fill="#D6B477"
            fillOpacity="0.2"
          />
          <text
            x="50"
            y="54"
            textAnchor="middle"
            fontFamily="serif"
            fontSize="14"
            fill="#D6B477"
            fontWeight="bold"
          >
            ❖
          </text>
        </svg>
      </motion.div>

      {/* 2. Mid-Left Sky Blue Floating Floral Petal (Medium Speed) */}
      <motion.div
        style={{ y: yLayerMed, rotate: rotateMed }}
        className="absolute -left-8 sm:left-10 top-[52vh] opacity-30 sm:opacity-40"
      >
        <svg
          width="110"
          height="110"
          viewBox="0 0 100 100"
          fill="none"
          className="drop-shadow-sm"
        >
          <path
            d="M50 10 C75 30 85 65 50 90 C15 65 25 30 50 10 Z"
            fill="url(#skyBlueGrad)"
            opacity="0.35"
          />
          <path
            d="M20 50 C40 25 75 15 90 50 C65 85 30 75 20 50 Z"
            stroke="#8FB5D1"
            strokeWidth="0.75"
            strokeDasharray="2 2"
          />
          <defs>
            <linearGradient id="skyBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8FB5D1" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#D6B477" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* 3. Lower-Left Monogram Ring Motif (Fast Speed) */}
      <motion.div
        style={{ y: yLayerFast, rotate: rotateFast }}
        className="absolute -left-10 sm:left-8 top-[85vh] opacity-20 sm:opacity-30"
      >
        <svg
          width="120"
          height="120"
          viewBox="0 0 100 100"
          fill="none"
          stroke="#D6B477"
          strokeWidth="1"
        >
          <polygon points="50,15 85,50 50,85 15,50" strokeWidth="0.8" opacity="0.6" />
          <circle cx="50" cy="50" r="22" stroke="#0E1B2E" strokeWidth="0.5" opacity="0.4" />
          <circle cx="50" cy="50" r="6" fill="#D6B477" fillOpacity="0.5" />
        </svg>
      </motion.div>

      {/* RIGHT MARGIN PARALLAX MOTIFS */}

      {/* 4. Top-Right Botanical Monogram Ring (Medium Speed) */}
      <motion.div
        style={{ y: yLayerMed, rotate: rotateSlow }}
        className="absolute -right-12 sm:right-6 top-[20vh] opacity-25 sm:opacity-35"
      >
        <svg
          width="150"
          height="150"
          viewBox="0 0 100 100"
          fill="none"
          className="drop-shadow-[0_4px_15px_rgba(143,181,209,0.25)]"
        >
          <circle cx="50" cy="50" r="42" stroke="#8FB5D1" strokeWidth="0.9" strokeDasharray="4 2" />
          <circle cx="50" cy="50" r="35" stroke="#D6B477" strokeWidth="1.2" />
          <path
            d="M30 50 Q50 20 70 50 Q50 80 30 50"
            stroke="#D6B477"
            strokeWidth="0.8"
            fill="none"
          />
          <text
            x="50"
            y="54"
            textAnchor="middle"
            fontFamily="serif"
            fontSize="12"
            fill="#0E1B2E"
            opacity="0.6"
          >
            ✦
          </text>
        </svg>
      </motion.div>

      {/* 5. Mid-Right Golden Love Leaf (Fast Speed) */}
      <motion.div
        style={{ y: yLayerFast, rotate: rotateMed }}
        className="absolute -right-8 sm:right-10 top-[58vh] opacity-25 sm:opacity-35"
      >
        <svg
          width="100"
          height="100"
          viewBox="0 0 100 100"
          fill="none"
          stroke="#D6B477"
          strokeWidth="1"
        >
          <path
            d="M50 20 C65 35 65 65 50 80 C35 65 35 35 50 20 Z"
            fill="#FAF7F2"
            fillOpacity="0.5"
          />
          <line x1="50" y1="20" x2="50" y2="80" stroke="#8FB5D1" strokeWidth="0.8" />
          <path d="M50 35 Q60 40 50 45" stroke="#D6B477" strokeWidth="0.75" />
          <path d="M50 50 Q40 55 50 60" stroke="#D6B477" strokeWidth="0.75" />
        </svg>
      </motion.div>

      {/* 6. Lower-Right Elegant Double Heart Knot (Slow Speed) */}
      <motion.div
        style={{ y: yLayerSlow, rotate: rotateSlow }}
        className="absolute -right-12 sm:right-8 top-[90vh] opacity-20 sm:opacity-30"
      >
        <svg
          width="130"
          height="130"
          viewBox="0 0 100 100"
          fill="none"
          stroke="#8FB5D1"
          strokeWidth="1"
        >
          <circle cx="42" cy="50" r="26" stroke="#D6B477" strokeWidth="1" opacity="0.6" />
          <circle cx="58" cy="50" r="26" stroke="#8FB5D1" strokeWidth="1" opacity="0.6" />
          <path
            d="M50 36 C55 30 63 30 67 36 C71 42 67 48 50 64 C33 48 29 42 33 36 C37 30 45 30 50 36 Z"
            fill="#D6B477"
            fillOpacity="0.25"
            stroke="#D6B477"
            strokeWidth="0.8"
          />
        </svg>
      </motion.div>
    </div>
  );
};
