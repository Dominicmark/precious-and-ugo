import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { fireWeddingConfetti } from '../lib/confetti';
import { playCelebrationChime, playScratchSwoosh } from '../lib/audio';
import { Sparkles, CheckCircle2, Wand2 } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface ScratchRevealProps {
  onRevealed?: () => void;
}

export const ScratchReveal: React.FC<ScratchRevealProps> = ({ onRevealed }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);
  const [isScratching, setIsScratching] = useState(false);
  const [hasStartedScratching, setHasStartedScratching] = useState(false);

  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const lastSoundRef = useRef<number>(0);
  const lastCheckTimeRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const isRevealedRef = useRef(false);

  // Initialize Canvas Gold Foil Layer
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;

    // Reset composite operation
    ctx.globalCompositeOperation = 'source-over';

    // Rich Metallic Champagne Gold Foil Gradient
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#F5E3B5');
    grad.addColorStop(0.2, '#D6B477');
    grad.addColorStop(0.45, '#FFF2D1');
    grad.addColorStop(0.7, '#B38333');
    grad.addColorStop(0.85, '#E8C787');
    grad.addColorStop(1, '#D6B477');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Diagonal foil brushed texture lines for realistic metal sheen
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    for (let i = -w; i < w * 2; i += 8) {
      ctx.fillRect(i, 0, 4, h);
    }

    // Subtle luxury speckles / gold leaf grain
    for (let i = 0; i < 350; i++) {
      const sx = Math.random() * w;
      const sy = Math.random() * h;
      const sr = Math.random() * 1.4;
      ctx.fillStyle = Math.random() > 0.45 ? 'rgba(255,255,255,0.4)' : 'rgba(168,126,52,0.3)';
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fill();
    }

    // Embossed inner border filigree
    ctx.strokeStyle = '#8E6723';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(6, 6, w - 12, h - 12);

    ctx.strokeStyle = '#FFF6DE';
    ctx.lineWidth = 1;
    ctx.strokeRect(8.5, 8.5, w - 17, h - 17);

    // Decorative corner diamond florets
    const corners = [
      [14, 14],
      [w - 14, 14],
      [14, h - 14],
      [w - 14, h - 14],
    ];
    corners.forEach(([cx, cy]) => {
      ctx.fillStyle = '#8E6723';
      ctx.beginPath();
      ctx.moveTo(cx, cy - 3.5);
      ctx.lineTo(cx + 3.5, cy);
      ctx.lineTo(cx, cy + 3.5);
      ctx.lineTo(cx - 3.5, cy);
      ctx.closePath();
      ctx.fill();
    });

    // Stamp text: SCRATCH TO REVEAL
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillStyle = '#784E1A';
    ctx.font = 'bold 10px "Cinzel", serif';
    ctx.letterSpacing = '3px';
    ctx.fillText('✦  A SPECIAL DATE  ✦', w / 2, h / 2 - 14);

    ctx.font = 'bold 15px "Cinzel", serif';
    ctx.fillStyle = '#0E1B2E';
    ctx.fillText('SCRATCH TO REVEAL', w / 2, h / 2 + 10);
  }, []);

  useEffect(() => {
    initCanvas();
    const handleResize = () => {
      if (!isRevealedRef.current) {
        initCanvas();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [initCanvas]);

  // Complete reveal trigger
  const triggerReveal = useCallback(() => {
    if (isRevealedRef.current) return;
    isRevealedRef.current = true;
    setIsRevealed(true);
    setScratchPercent(100);

    // Celebratory sound and confetti
    playCelebrationChime();
    fireWeddingConfetti();
    onRevealed?.();
  }, [onRevealed]);

  // Efficient Downsampled Percentage Calculation (fast 20x12 grid)
  const checkScratchPercentage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealedRef.current) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    const sampleCols = 20;
    const sampleRows = 12;
    const stepX = Math.floor(w / sampleCols);
    const stepY = Math.floor(h / sampleRows);

    try {
      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;
      let transparentPixels = 0;
      let totalSamples = 0;

      for (let y = 0; y < h; y += stepY) {
        for (let x = 0; x < w; x += stepX) {
          totalSamples++;
          const alphaIndex = (y * w + x) * 4 + 3;
          if (data[alphaIndex] < 120) {
            transparentPixels++;
          }
        }
      }

      const percent = Math.min(100, Math.round((transparentPixels / totalSamples) * 100));
      setScratchPercent(percent);

      // Trigger reveal smoothly at 50% so guests don't have to scrape every pixel
      if (percent >= 50) {
        triggerReveal();
      }
    } catch {
      // safe fallback
    }
  }, [triggerReveal]);

  // Silky-Smooth Continuous Scratch Stroke
  const performScratch = (clientX: number, clientY: number, isStart: boolean) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealedRef.current) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const currX = (clientX - rect.left) * dpr;
    const currY = (clientY - rect.top) * dpr;
    const brushRadius = 26 * dpr;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = brushRadius * 2;

    const prevPoint = lastPointRef.current;

    // Connect last point and current point with a solid rounded stroke
    if (!isStart && prevPoint) {
      ctx.beginPath();
      ctx.moveTo(prevPoint.x, prevPoint.y);
      ctx.lineTo(currX, currY);
      ctx.stroke();
    }

    // Circular brush head
    ctx.beginPath();
    ctx.arc(currX, currY, brushRadius, 0, Math.PI * 2);
    ctx.fill();

    lastPointRef.current = { x: currX, y: currY };

    // Gentle tactile scratch audio
    const now = performance.now();
    if (now - lastSoundRef.current > 110) {
      playScratchSwoosh();
      lastSoundRef.current = now;
    }

    // Throttled live percentage calculation during continuous motion
    if (now - lastCheckTimeRef.current > 180) {
      lastCheckTimeRef.current = now;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = requestAnimationFrame(() => {
        checkScratchPercentage();
      });
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isRevealed) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setIsScratching(true);
    setHasStartedScratching(true);
    performScratch(e.clientX, e.clientY, true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isScratching || isRevealed) return;
    performScratch(e.clientX, e.clientY, false);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isScratching) return;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    setIsScratching(false);
    lastPointRef.current = null;
    checkScratchPercentage();
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Section Header */}
      <ScrollReveal direction="up" distance={16} duration={700} className="text-center mb-3">
        <p className="font-serif-luxury text-xs tracking-[0.25em] text-[#5687AD] uppercase font-semibold">
          Mark Your Calendar
        </p>
        <h3 className="font-display text-base sm:text-lg tracking-wider text-[#0E1B2E] font-bold mt-0.5">
          A SPECIAL DATE AWAITS
        </h3>
      </ScrollReveal>

      {/* Scratch Box Frame */}
      <div
        ref={containerRef}
        className="relative w-full max-w-[340px] sm:max-w-[380px] h-[175px] sm:h-[185px] rounded-2xl overflow-hidden shadow-2xl border-2 border-[#D6B477] bg-[#FAF7F2] select-none"
        style={{
          boxShadow: '0 14px 35px -8px rgba(14, 27, 46, 0.28), inset 0 0 20px rgba(214, 180, 119, 0.25)',
        }}
      >
        {/* UNDERNEATH LAYER: The Revealed Date and Time */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-3 select-none paper-texture">
          {/* Subtle ornate inner border */}
          <div className="absolute inset-2 border border-[#D6B477]/50 rounded-xl pointer-events-none" />

          <motion.div
            animate={
              isRevealed
                ? {
                    scale: [1, 1.05, 1],
                    filter: [
                      'drop-shadow(0 0 0px #D6B477)',
                      'drop-shadow(0 0 16px rgba(214,180,119,0.9))',
                      'drop-shadow(0 0 0px transparent)',
                    ],
                  }
                : {}
            }
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center z-0 px-2"
          >
            <span className="font-serif-luxury text-[11px] sm:text-xs tracking-[0.3em] text-[#5687AD] font-semibold uppercase block">
              Friday
            </span>
            <h4 className="font-display text-xl sm:text-2xl font-extrabold text-[#0E1B2E] tracking-widest my-0.5">
              13 NOVEMBER 2026
            </h4>

            {/* Revealed Nuptial Time */}
            <div className="flex items-center justify-center gap-2 my-1">
              <span className="w-5 h-[1px] bg-[#D6B477]" />
              <span className="font-display text-xs sm:text-sm font-bold text-[#5687AD] tracking-[0.2em] uppercase">
                4:00 PM WAT
              </span>
              <span className="w-5 h-[1px] bg-[#D6B477]" />
            </div>

            <span className="font-serif-luxury text-[10px] tracking-[0.15em] text-[#0E1B2E]/70 font-semibold uppercase block">
              Strictly by Invitation
            </span>
          </motion.div>

          {/* Celebratory badge tag when fully revealed */}
          {isRevealed && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="mt-1 flex items-center gap-1 text-[10px] font-semibold tracking-wider text-[#5687AD] uppercase"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#5687AD]" />
              <span>Date &amp; Time Revealed!</span>
            </motion.div>
          )}
        </div>

        {/* SCRATCH LAYER: Champagne-Gold Foil Canvas with Smooth Fadeout */}
        <AnimatePresence>
          {!isRevealed && (
            <>
              <motion.canvas
                ref={canvasRef}
                exit={{
                  opacity: 0,
                  scale: 1.02,
                  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                className="scratch-canvas absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 touch-none will-change-transform"
                style={{ touchAction: 'none' }}
                aria-label="Scratch card surface. Drag finger or mouse to reveal wedding date."
              />

              {/* Shimmer Light Sweeping across the gold foil before user starts scratching */}
              {!hasStartedScratching && (
                <motion.div
                  initial={{ x: '-120%' }}
                  animate={{ x: '220%' }}
                  transition={{
                    repeat: Infinity,
                    duration: 2.8,
                    ease: 'easeInOut',
                    repeatDelay: 1.2,
                  }}
                  className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-25deg] pointer-events-none z-20"
                />
              )}
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Progress Track & Quick Reveal Button */}
      <div className="mt-3.5 w-full max-w-[340px] sm:max-w-[380px] flex flex-col items-center gap-2">
        {!isRevealed ? (
          <div className="w-full space-y-2">
            {/* Gold Progress Bar */}
            <div className="w-full bg-[#E5EEF5] h-2 rounded-full overflow-hidden border border-[#D6B477]/60 shadow-inner p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#D6B477] via-[#FFF3D4] to-[#B38333] transition-all duration-150"
                style={{ width: `${Math.min(100, (scratchPercent / 50) * 100)}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-[#0E1B2E]/80 font-medium flex items-center gap-1.5 text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-[#5687AD] animate-pulse" />
                <span>Rub surface to reveal</span>
              </span>

              <span className="font-mono text-[11px] font-bold text-[#5687AD]">
                {scratchPercent}% / 50%
              </span>
            </div>

            {/* Quick Instant Reveal Button */}
            <div className="text-center pt-0.5">
              <button
                onClick={triggerReveal}
                type="button"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0E1B2E] hover:text-[#5687AD] px-3.5 py-1 rounded-full bg-white/95 border border-[#D6B477]/60 hover:border-[#8FB5D1] shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
              >
                <Wand2 className="w-3.5 h-3.5 text-[#D6B477] group-hover:rotate-12 transition-transform" />
                <span>Tap to reveal date immediately</span>
              </button>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center p-2 rounded-xl bg-white/85 border border-[#D6B477]/50 w-full shadow-xs"
          >
            <p className="text-xs text-[#0E1B2E] font-serif-luxury font-semibold flex items-center justify-center gap-1.5">
              <span className="text-[#D6B477]">✦</span>
              <span>13 November 2026 · We look forward to celebrating with you!</span>
              <span className="text-[#D6B477]">✦</span>
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};
