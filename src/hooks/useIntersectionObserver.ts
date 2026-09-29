import { useEffect, useState, useRef } from 'react';

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  triggerOnce?: boolean;
}

export function useIntersectionObserver<T extends HTMLElement = HTMLDivElement>(
  options: UseIntersectionObserverOptions = {}
): [React.RefObject<T | null>, boolean, IntersectionObserverEntry | null] {
  const { threshold = 0.15, root = null, rootMargin = '0px 0px -40px 0px', triggerOnce = true } =
    options;

  const targetRef = useRef<T | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

  useEffect(() => {
    const node = targetRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setIsIntersecting(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([observerEntry]) => {
        setEntry(observerEntry);
        if (observerEntry.isIntersecting) {
          setIsIntersecting(true);
          if (triggerOnce) {
            observer.unobserve(node);
          }
        } else if (!triggerOnce) {
          setIsIntersecting(false);
        }
      },
      { threshold, root, rootMargin }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [threshold, root, rootMargin, triggerOnce]);

  return [targetRef, isIntersecting, entry];
}
