import React, { useEffect, useRef, useState } from 'react';

interface AnimateInProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  delay?: number; // delay in ms
  duration?: number; // duration in ms
  className?: string;
  threshold?: number;
  once?: boolean;
}

export const AnimateIn: React.FC<AnimateInProps> = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 650,
  className = '',
  threshold = 0.1,
  once = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If IntersectionObserver is unavailable (e.g. SSR or old browser), default to visible
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once && ref.current) {
            observer.unobserve(ref.current);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -30px 0px',
      }
    );

    const currentEl = ref.current;
    if (currentEl) {
      observer.observe(currentEl);
    }

    return () => {
      if (currentEl) {
        observer.unobserve(currentEl);
      }
      observer.disconnect();
    };
  }, [threshold, once]);

  const getTransform = () => {
    if (isVisible) return 'translate3d(0, 0, 0) scale(1)';
    switch (direction) {
      case 'up':
        return 'translate3d(0, 28px, 0) scale(0.99)';
      case 'down':
        return 'translate3d(0, -28px, 0) scale(0.99)';
      case 'left':
        return 'translate3d(28px, 0, 0)';
      case 'right':
        return 'translate3d(-28px, 0, 0)';
      case 'none':
      default:
        return 'translate3d(0, 0, 0)';
    }
  };

  return (
    <div
      ref={ref}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transform: getTransform(),
      }}
      className={`transition-all cubic-bezier(0.16, 1, 0.3, 1) will-change-[transform,opacity] ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } ${className}`}
    >
      {children}
    </div>
  );
};
