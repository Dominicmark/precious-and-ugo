import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'motion/react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

export interface ParallaxContentContainerProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Vertical pixel offset from entry to exit for tactile depth.
   */
  offsetRange?: [number, number];
  /**
   * Reveal direction and distance when scrolling into view via IntersectionObserver.
   */
  revealDistance?: number;
  revealDuration?: number;
  revealDelay?: number;
  /**
   * Optional subtle scale or tilt difference for enhanced physical depth
   */
  depthScale?: [number, number];
  id?: string;
}

export const ParallaxContentContainer: React.FC<ParallaxContentContainerProps> = ({
  children,
  className = '',
  offsetRange = [18, -18],
  revealDistance = 24,
  revealDuration = 0.75,
  revealDelay = 0.05,
  depthScale,
  id,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Native IntersectionObserver to trigger graceful scroll reveals
  const [observerRef, isIntersecting] = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px',
    triggerOnce: true,
  });

  // Track scroll progress specifically through this section's viewport window
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Spring physics for tactile luxury motion
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 26,
    restDelta: 0.001,
  });

  // Vertical parallax offset relative to background & card
  const yParallax = useTransform(smoothProgress, [0, 1], offsetRange);

  // Optional subtle depth scale transformation
  const scaleParallax = useTransform(
    smoothProgress,
    [0, 0.5, 1],
    depthScale ? [depthScale[0], 1, depthScale[1]] : [1, 1, 1]
  );

  // Combine refs for container
  const setRefs = (node: HTMLDivElement | null) => {
    (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
    (observerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
  };

  if (shouldReduceMotion) {
    return (
      <div id={id} ref={setRefs} className={className}>
        {children}
      </div>
    );
  }

  return (
    <div id={id} ref={setRefs} className="relative">
      <motion.div
        initial={false}
        animate={{
          opacity: isIntersecting ? 1 : 0,
          y: isIntersecting ? 0 : revealDistance,
        }}
        transition={{
          duration: revealDuration,
          delay: revealDelay,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <motion.div
          style={{
            y: yParallax,
            scale: depthScale ? scaleParallax : 1,
          }}
          className={`${className} will-change-transform`}
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
};
