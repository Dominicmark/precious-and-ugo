import confetti from 'canvas-confetti';

const WEDDING_PALETTE = [
  '#D6B477', // Champagne Gold
  '#8FB5D1', // Powder / Sky Blue
  '#FAF7F2', // Warm Ivory
  '#0E1B2E', // Deep Navy
  '#A3C1DA', // Soft Sky Blue
  '#ECC880', // Light Champagne Gold
];

/**
 * Fires a celebratory confetti explosion tailored to luxury wedding stationery.
 */
export function fireWeddingConfetti() {
  const duration = 2.5 * 1000;
  const animationEnd = Date.now() + duration;

  // First center burst
  confetti({
    particleCount: 60,
    spread: 70,
    origin: { y: 0.6 },
    colors: WEDDING_PALETTE,
    shapes: ['circle', 'square'],
    scalar: 1.1,
    disableForReducedMotion: true,
  });

  // Dual side cannons for cinematic celebration
  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.65 },
      colors: WEDDING_PALETTE,
      disableForReducedMotion: true,
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.65 },
      colors: WEDDING_PALETTE,
      disableForReducedMotion: true,
    });

    if (Date.now() < animationEnd) {
      requestAnimationFrame(frame);
    }
  };

  requestAnimationFrame(frame);
}
