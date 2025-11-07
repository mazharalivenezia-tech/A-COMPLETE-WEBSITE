import React, { ReactNode, useEffect, useState, useRef, RefObject } from 'react';

// --- The Hook ---
interface UseScrollAnimationOptions {
  threshold?: number;
  triggerOnce?: boolean;
}

const useScrollAnimation = <T extends HTMLElement>(
  options?: UseScrollAnimationOptions
): { ref: RefObject<T>; isVisible: boolean } => {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { threshold = 0.1, triggerOnce = true } = options || {};

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        }
      },
      { threshold }
    );
    observer.observe(element);
    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [ref, threshold, triggerOnce]);

  return { ref, isVisible };
};

// --- The Component ---
interface AnimatedDivProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  initialClass?: string;
  finalClass?: string;
  transitionClass?: string;
  delay?: number;
  staggerIndex?: number;
}

const AnimatedDiv: React.FC<AnimatedDivProps> = ({
  children,
  initialClass = 'opacity-0 translate-y-5',
  finalClass = 'opacity-100 translate-y-0',
  transitionClass = 'transition-all duration-700 ease-out',
  delay = 0,
  staggerIndex = 0,
  ...props
}) => {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({ threshold: 0.1, triggerOnce: true });
  const totalDelay = delay + staggerIndex * 100;

  return (
    <div
      ref={ref}
      {...props}
      className={`${props.className || ''} ${transitionClass} ${isVisible ? finalClass : initialClass}`}
      style={{ transitionDelay: `${totalDelay}ms`, ...props.style }}
    >
      {children}
    </div>
  );
};

export default AnimatedDiv;
