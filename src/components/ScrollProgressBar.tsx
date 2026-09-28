import React from 'react';
import { motion, useScroll, useSpring, useReducedMotion } from 'motion/react';

export const ScrollProgressBar: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  if (shouldReduceMotion) return null;

  return (
    <div className="fixed top-0 left-0 right-0 h-[3px] z-50 pointer-events-none bg-black/5 overflow-hidden">
      <motion.div
        style={{ scaleX }}
        className="h-full w-full origin-left bg-gradient-to-r from-[#D6B477] via-[#8FB5D1] to-[#D6B477] shadow-[0_0_8px_rgba(214,180,119,0.7)]"
      />
    </div>
  );
};
