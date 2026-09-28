import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { fireWeddingConfetti } from '../lib/confetti';
import { playCelebrationChime, playScratchSwoosh } from '../lib/audio';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface ScratchRevealProps {
  onRevealed?: () => void;
}

export const ScratchReveal: React.FC<ScratchRevealProps> = ({ onRevealed }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);
  const [isScratching, setIsScratching] = useState(false);
  const lastSoundRef = useRef<number>(0);
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

    // Metallic Champagne Gold Foil Gradient
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#EED8A1');
    grad.addColorStop(0.25, '#D6B477');
    grad.addColorStop(0.5, '#F9EFCF');
    grad.addColorStop(0.75, '#B88A3B');
    grad.addColorStop(1, '#D6B477');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Subtle luxury speckles / gold dust
    for (let i = 0; i < 400; i++) {
      const sx = Math.random() * w;
      const sy = Math.random() * h;
      const sr = Math.random() * 1.5;
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.45)' : 'rgba(184,138,59,0.35)';
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fill();
    }

    // Inner embossed filigree border on the scratch foil
    ctx.strokeStyle = '#8E6723';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(6, 6, w - 12, h - 12);

    ctx.strokeStyle = '#FFF3D4';
    ctx.lineWidth = 1;
    ctx.strokeRect(9, 9, w - 18, h - 18);

    // Decorative corner diamonds
    const corners = [
      [14, 14],
      [w - 14, 14],
      [14, h - 14],
      [w - 14, h - 14],
    ];
    corners.forEach(([cx, cy]) => {
      ctx.fillStyle = '#8E6723';
      ctx.beginPath();
      ctx.moveTo(cx, cy - 3);
      ctx.lineTo(cx + 3, cy);
      ctx.lineTo(cx, cy + 3);
      ctx.lineTo(cx - 3, cy);
      ctx.closePath();
      ctx.fill();
    });

    // Stamp text: SCRATCH TO REVEAL
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Sub-icon
    ctx.fillStyle = '#6E4515';
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
    return () => window.removeEventListener('resize', handleResize);
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

  // Compute scratched percentage by sampling
  const checkScratchPercentage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealedRef.current) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.width;
    const h = canvas.height;
    
    // Sample a 30x20 grid to maintain fast 60fps on mobile
    const sampleCols = 30;
    const sampleRows = 20;
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
          if (data[alphaIndex] < 128) {
            transparentPixels++;
          }
        }
      }

      const percent = Math.round((transparentPixels / totalSamples) * 100);
      setScratchPercent(percent);

      // Trigger automatic reveal when reaching 70%
      if (percent >= 70) {
        triggerReveal();
      }
    } catch {
      // ignore security origin bounds if any
    }
  }, [triggerReveal]);

  // Scratch action
  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealedRef.current) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const x = (clientX - rect.left) * dpr;
    const y = (clientY - rect.top) * dpr;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 24 * dpr, 0, Math.PI * 2);
    ctx.fill();

    // Occasional gentle scratch sound (rate-limited)
    const now = Date.now();
    if (now - lastSoundRef.current > 120) {
      playScratchSwoosh();
      lastSoundRef.current = now;
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isRevealed) return;
    setIsScratching(true);
    scratch(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isScratching || isRevealed) return;
    scratch(e.clientX, e.clientY);
  };

  const handlePointerUp = () => {
    if (!isScratching) return;
    setIsScratching(false);
    checkScratchPercentage();
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Editorial Section Kicker */}
      <div className="text-center mb-3">
        <p className="font-serif-luxury text-xs tracking-[0.25em] text-[#5687AD] uppercase font-semibold">
          Mark Your Calendar
        </p>
        <h3 className="font-display text-base sm:text-lg tracking-wider text-[#0E1B2E] font-bold mt-0.5">
          A SPECIAL DATE AWAITS
        </h3>
      </div>

      {/* Scratch Box Frame */}
      <div
        ref={containerRef}
        className="relative w-full max-w-[340px] sm:max-w-[380px] h-[150px] rounded-xl overflow-hidden shadow-xl border-2 border-[#D6B477] bg-[#FAF7F2]"
        style={{
          boxShadow: '0 12px 30px -5px rgba(14, 27, 46, 0.25), inset 0 0 20px rgba(214, 180, 119, 0.2)'
        }}
      >
        {/* UNDERNEATH LAYER: The Revealed Date */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-3 select-none paper-texture">
          {/* Subtle ornate inner border */}
          <div className="absolute inset-2 border border-[#D6B477]/50 rounded-lg pointer-events-none" />

          <motion.div
            animate={isRevealed ? { scale: [1, 1.08, 1], filter: ['drop-shadow(0 0 0px #D6B477)', 'drop-shadow(0 0 15px rgba(214,180,119,0.8))', 'drop-shadow(0 0 0px transparent)'] } : {}}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="text-center z-0"
          >
            <span className="font-serif-luxury text-xs tracking-[0.3em] text-[#5687AD] font-semibold uppercase block">
              Friday
            </span>
            <h4 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0E1B2E] tracking-widest my-0.5">
              13 NOVEMBER
            </h4>
            <div className="flex items-center justify-center gap-2">
              <span className="w-5 h-[1px] bg-[#D6B477]" />
              <span className="font-display text-base font-bold text-[#5687AD] tracking-[0.25em]">
                2026
              </span>
              <span className="w-5 h-[1px] bg-[#D6B477]" />
            </div>
          </motion.div>

          {/* Celebratory badge tag when fully revealed */}
          {isRevealed && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-1 flex items-center gap-1 text-[10px] font-semibold tracking-wider text-[#5687AD] uppercase"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#5687AD]" />
              <span>Date Revealed!</span>
            </motion.div>
          )}
        </div>

        {/* SCRATCH LAYER: Champagne-Gold Canvas */}
        <AnimatePresence>
          {!isRevealed && (
            <motion.canvas
              ref={canvasRef}
              exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeOut' } }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onPointerLeave={handlePointerUp}
              className="scratch-canvas absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10"
              style={{ touchAction: 'none' }}
              aria-label="Scratch card surface. Drag finger or mouse to reveal wedding date."
            />
          )}
        </AnimatePresence>
      </div>

      {/* Helper Scratch Guidance, Progress Bar & Accessible Fallback */}
      <div className="mt-3.5 w-full max-w-[340px] sm:max-w-[380px] flex flex-col items-center gap-2.5">
        {!isRevealed ? (
          <div className="w-full space-y-2">
            {/* Gold Progress Track */}
            <div className="w-full bg-[#E5EEF5] h-2 rounded-full overflow-hidden border border-[#D6B477]/60 shadow-inner p-0.5">
              <div
                className="h-full rounded-full gold-foil-gradient transition-all duration-150 relative"
                style={{ width: `${Math.min(100, (scratchPercent / 70) * 100)}%` }}
              >
                <div className="absolute inset-0 animate-shimmer" />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-[#0E1B2E]/80 font-medium flex items-center gap-1.5 text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-[#8FB5D1] animate-pulse" />
                <span>Rub surface with finger or mouse</span>
              </span>

              <span className="font-mono text-[11px] font-bold text-[#5687AD]">
                {scratchPercent}% / 70%
              </span>
            </div>

            {/* Accessibility Fallback for screen-reader / keyboard / quick reveal */}
            <div className="text-center pt-1">
              <button
                onClick={triggerReveal}
                type="button"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0E1B2E] hover:text-[#5687AD] px-3 py-1 rounded-full bg-white/90 border border-[#D6B477]/60 hover:border-[#8FB5D1] shadow-2xs transition-all cursor-pointer"
              >
                <span>✦ Tap to reveal date directly</span>
              </button>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center p-2 rounded-xl bg-white/80 border border-[#D6B477]/50 w-full"
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
