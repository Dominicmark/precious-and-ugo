import React from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

export interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  delay?: number;
  duration?: number;
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  as?: React.ElementType;
  id?: string;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  direction = 'up',
  distance = 24,
  delay = 0,
  duration = 750,
  threshold = 0.12,
  rootMargin = '0px 0px -40px 0px',
  triggerOnce = true,
  as: Component = 'div',
  id,
}) => {
  const [ref, isIntersecting] = useIntersectionObserver<HTMLElement>({
    threshold,
    rootMargin,
    triggerOnce,
  });

  // Calculate transform according to direction
  const getTransform = () => {
    if (isIntersecting || direction === 'none') return 'translate3d(0, 0, 0)';
    switch (direction) {
      case 'up':
        return `translate3d(0, ${distance}px, 0)`;
      case 'down':
        return `translate3d(0, -${distance}px, 0)`;
      case 'left':
        return `translate3d(${distance}px, 0, 0)`;
      case 'right':
        return `translate3d(-${distance}px, 0, 0)`;
      default:
        return 'translate3d(0, 0, 0)';
    }
  };

  return (
    <Component
      id={id}
      ref={ref}
      className={`will-change-[opacity,transform] ${className}`}
      style={{
        opacity: isIntersecting ? 1 : 0,
        transform: getTransform(),
        transitionProperty: 'opacity, transform',
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      {children}
    </Component>
  );
};
