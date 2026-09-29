import React from 'react';
import { motion } from 'motion/react';

interface ScrollToRsvpGuideProps {
  className?: string;
  label?: string;
}

export const ScrollToRsvpGuide: React.FC<ScrollToRsvpGuideProps> = ({
  className = '',
  label = 'SCROLL TO RSVP',
}) => {
  const handleClick = () => {
    const el = document.getElementById('rsvp-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`flex flex-col items-center justify-center my-6 cursor-pointer select-none group ${className}`}
      role="button"
      tabIndex={0}
      aria-label={label}
    >
      <span className="font-serif-luxury text-[10px] sm:text-[11px] tracking-[0.25em] text-[#5687AD] font-bold uppercase mb-2 group-hover:text-[#0E1B2E] transition-colors">
        {label}
      </span>

      {/* Animated Mouse Oval Pill Indicator (inspired directly by the screenshot) */}
      <div className="w-5 h-8 sm:w-6 sm:h-9 rounded-full border-1.5 border-[#D6B477] flex items-start justify-center p-1 bg-white/40 backdrop-blur-2xs shadow-xs group-hover:border-[#5687AD] transition-colors">
        <motion.div
          animate={{
            y: [0, 10, 0],
            opacity: [1, 0.4, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.8,
            ease: 'easeInOut',
          }}
          className="w-1.5 h-1.5 rounded-full bg-[#5687AD]"
        />
      </div>
    </div>
  );
};
