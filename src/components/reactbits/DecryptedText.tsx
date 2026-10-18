import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { motion } from 'motion/react';
import type { HTMLMotionProps } from 'motion/react';
import './DecryptedText.css';

export interface DecryptedTextProps extends HTMLMotionProps<'span'> {
  text: string;
  speed?: number;
  maxIterations?: number;
  leadIterations?: number;
  sequential?: boolean;
  revealDirection?: 'start' | 'end' | 'center';
  useOriginalCharsOnly?: boolean;
  characters?: string;
  className?: string;
  parentClassName?: string;
  encryptedClassName?: string;
  animateOn?: 'view' | 'hover' | 'inViewHover' | 'click';
  clickMode?: 'once' | 'toggle';
  isReducedMotion?: boolean;
  threshold?: number;
  rootMargin?: string;
}

type Direction = 'forward' | 'reverse';

export const DecryptedText: React.FC<DecryptedTextProps> = ({
  text,
  speed = 65,
  maxIterations = 10,
  leadIterations,
  sequential = true,
  revealDirection = 'start',
  useOriginalCharsOnly = false,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!<>-_/[]#',
  className = 'decrypted-text-char--revealed',
  parentClassName = '',
  encryptedClassName = 'decrypted-text-char--encrypted',
  animateOn = 'view',
  clickMode = 'once',
  isReducedMotion = false,
  threshold = 0.8,
  rootMargin = '0px 0px -15% 0px',
  ...props
}) => {
  // Check reduced-motion preferences
  const checkReducedMotion = useCallback((): boolean => {
    if (isReducedMotion) return true;
    if (typeof document !== 'undefined') {
      if (document.documentElement.getAttribute('data-reduced-motion') === 'true') return true;
    }
    if (typeof window !== 'undefined' && window.matchMedia) {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
    }
    return false;
  }, [isReducedMotion]);

  const prefersReduced = checkReducedMotion();

  const availableChars = useMemo<string[]>(() => {
    return useOriginalCharsOnly
      ? Array.from(new Set(text.split(''))).filter((char) => char !== ' ')
      : characters.split('');
  }, [useOriginalCharsOnly, text, characters]);

  const shuffleText = useCallback(
    (originalText: string, currentRevealed: Set<number>) => {
      return originalText
        .split('')
        .map((char, i) => {
          if (char === ' ') return ' ';
          if (currentRevealed.has(i)) return originalText[i];
          return availableChars[Math.floor(Math.random() * availableChars.length)] || char;
        })
        .join('');
    },
    [availableChars]
  );

  const [displayText, setDisplayText] = useState<string>(() => {
    if (!prefersReduced && animateOn === 'click') {
      return shuffleText(text, new Set());
    }
    return text;
  });
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());
  const [hasAnimated, setHasAnimated] = useState<boolean>(false);
  const [isDecrypted, setIsDecrypted] = useState<boolean>(prefersReduced || animateOn !== 'click');
  const [direction, setDirection] = useState<Direction>('forward');

  const containerRef = useRef<HTMLSpanElement>(null);
  const orderRef = useRef<number[]>([]);
  const pointerRef = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const computeOrder = useCallback(
    (len: number): number[] => {
      const order: number[] = [];
      if (len <= 0) return order;
      if (revealDirection === 'start') {
        for (let i = 0; i < len; i++) order.push(i);
        return order;
      }
      if (revealDirection === 'end') {
        for (let i = len - 1; i >= 0; i--) order.push(i);
        return order;
      }
      // center
      const middle = Math.floor(len / 2);
      let offset = 0;
      while (order.length < len) {
        if (offset % 2 === 0) {
          const idx = middle + offset / 2;
          if (idx >= 0 && idx < len) order.push(idx);
        } else {
          const idx = middle - Math.ceil(offset / 2);
          if (idx >= 0 && idx < len) order.push(idx);
        }
        offset++;
      }
      return order.slice(0, len);
    },
    [revealDirection]
  );

  const fillAllIndices = useCallback((): Set<number> => {
    const s = new Set<number>();
    for (let i = 0; i < text.length; i++) s.add(i);
    return s;
  }, [text]);

  const removeRandomIndices = useCallback((set: Set<number>, count: number): Set<number> => {
    const arr = Array.from(set);
    for (let i = 0; i < count && arr.length > 0; i++) {
      const idx = Math.floor(Math.random() * arr.length);
      arr.splice(idx, 1);
    }
    return new Set(arr);
  }, []);

  const triggerDecrypt = useCallback(() => {
    if (checkReducedMotion()) {
      setDisplayText(text);
      setIsAnimating(false);
      setIsDecrypted(true);
      return;
    }

    if (sequential) {
      orderRef.current = computeOrder(text.length);
      pointerRef.current = 0;
      setRevealedIndices(new Set());
    } else {
      setRevealedIndices(new Set());
    }
    setDirection('forward');
    setIsAnimating(true);
  }, [sequential, computeOrder, text, checkReducedMotion]);

  const triggerReverse = useCallback(() => {
    if (checkReducedMotion()) {
      setDisplayText(text);
      setIsAnimating(false);
      setIsDecrypted(true);
      return;
    }

    if (sequential) {
      orderRef.current = computeOrder(text.length).slice().reverse();
      pointerRef.current = 0;
      setRevealedIndices(fillAllIndices());
      setDisplayText(shuffleText(text, fillAllIndices()));
    } else {
      setRevealedIndices(fillAllIndices());
      setDisplayText(shuffleText(text, fillAllIndices()));
    }
    setDirection('reverse');
    setIsAnimating(true);
  }, [sequential, computeOrder, fillAllIndices, shuffleText, text, checkReducedMotion]);

  // Animation cycle
  useEffect(() => {
    if (!isAnimating || checkReducedMotion()) return;

    let currentIteration = 0;
    const computedLead = Math.max(5, Math.round(1450 / speed) - text.length);
    const effectiveLead = sequential && direction === 'forward' ? (leadIterations ?? computedLead) : 0;

    const getNextIndex = (revealedSet: Set<number>): number => {
      const textLength = text.length;
      switch (revealDirection) {
        case 'start':
          return revealedSet.size;
        case 'end':
          return textLength - 1 - revealedSet.size;
        case 'center': {
          const middle = Math.floor(textLength / 2);
          const offset = Math.floor(revealedSet.size / 2);
          const nextIndex = revealedSet.size % 2 === 0 ? middle + offset : middle - offset - 1;

          if (nextIndex >= 0 && nextIndex < textLength && !revealedSet.has(nextIndex)) {
            return nextIndex;
          }

          for (let i = 0; i < textLength; i++) {
            if (!revealedSet.has(i)) return i;
          }
          return 0;
        }
        default:
          return revealedSet.size;
      }
    };

    intervalRef.current = setInterval(() => {
      setRevealedIndices((prevRevealed) => {
        if (sequential) {
          // Forward
          if (direction === 'forward') {
            if (currentIteration < effectiveLead) {
              currentIteration++;
              setDisplayText(shuffleText(text, prevRevealed));
              return prevRevealed;
            }

            if (prevRevealed.size < text.length) {
              const nextIndex = getNextIndex(prevRevealed);
              const newRevealed = new Set(prevRevealed);
              newRevealed.add(nextIndex);
              setDisplayText(shuffleText(text, newRevealed));
              return newRevealed;
            } else {
              if (intervalRef.current) clearInterval(intervalRef.current);
              setIsAnimating(false);
              setIsDecrypted(true);
              setDisplayText(text);
              return prevRevealed;
            }
          }
          // Reverse
          if (direction === 'reverse') {
            if (pointerRef.current < orderRef.current.length) {
              const idxToRemove = orderRef.current[pointerRef.current++];
              const newRevealed = new Set(prevRevealed);
              newRevealed.delete(idxToRemove);
              setDisplayText(shuffleText(text, newRevealed));
              if (newRevealed.size === 0) {
                if (intervalRef.current) clearInterval(intervalRef.current);
                setIsAnimating(false);
                setIsDecrypted(false);
              }
              return newRevealed;
            } else {
              if (intervalRef.current) clearInterval(intervalRef.current);
              setIsAnimating(false);
              setIsDecrypted(false);
              return prevRevealed;
            }
          }
        } else {
          // Non-Sequential
          if (direction === 'forward') {
            setDisplayText(shuffleText(text, prevRevealed));
            currentIteration++;
            if (currentIteration >= maxIterations) {
              if (intervalRef.current) clearInterval(intervalRef.current);
              setIsAnimating(false);
              setDisplayText(text);
              setIsDecrypted(true);
            }
            return prevRevealed;
          }

          // Non-Sequential Reverse
          if (direction === 'reverse') {
            let currentSet = prevRevealed;
            if (currentSet.size === 0) {
              currentSet = fillAllIndices();
            }
            const removeCount = Math.max(1, Math.ceil(text.length / Math.max(1, maxIterations)));
            const nextSet = removeRandomIndices(currentSet, removeCount);
            setDisplayText(shuffleText(text, nextSet));
            currentIteration++;
            if (nextSet.size === 0 || currentIteration >= maxIterations) {
              if (intervalRef.current) clearInterval(intervalRef.current);
              setIsAnimating(false);
              setIsDecrypted(false);
              setDisplayText(shuffleText(text, new Set()));
              return new Set();
            }
            return nextSet;
          }
        }
        return prevRevealed;
      });
    }, speed);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [
    isAnimating,
    text,
    speed,
    maxIterations,
    leadIterations,
    sequential,
    revealDirection,
    shuffleText,
    direction,
    fillAllIndices,
    removeRandomIndices,
    checkReducedMotion,
  ]);

  /* Click Behaviour */
  const handleClick = () => {
    if (animateOn !== 'click') return;

    if (clickMode === 'once') {
      if (isDecrypted) return;
      setDirection('forward');
      triggerDecrypt();
    }

    if (clickMode === 'toggle') {
      if (isDecrypted) {
        triggerReverse();
      } else {
        setDirection('forward');
        triggerDecrypt();
      }
    }
  };

  /* Hover Behaviour */
  const triggerHoverDecrypt = useCallback(() => {
    if (isAnimating || checkReducedMotion()) return;

    setRevealedIndices(new Set());
    setIsDecrypted(false);
    setDisplayText(text);
    setDirection('forward');
    setIsAnimating(true);
  }, [isAnimating, text, checkReducedMotion]);

  const resetToPlainText = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsAnimating(false);
    setRevealedIndices(new Set());
    setDisplayText(text);
    setIsDecrypted(true);
    setDirection('forward');
  }, [text]);

  /* Intersection View Observer */
  useEffect(() => {
    if (animateOn !== 'view' && animateOn !== 'inViewHover') return;
    if (prefersReduced) return;

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          triggerDecrypt();
          observer.disconnect();
        }
      });
    };

    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin,
      threshold,
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      observer.disconnect();
    };
  }, [animateOn, hasAnimated, triggerDecrypt, prefersReduced, rootMargin, threshold]);

  const animateProps =
    animateOn === 'hover' || animateOn === 'inViewHover'
      ? {
          onMouseEnter: triggerHoverDecrypt,
          onMouseLeave: resetToPlainText,
        }
      : animateOn === 'click'
        ? {
            onClick: handleClick,
          }
        : {};

  // If reduced motion is preferred, render the clean final text directly
  if (prefersReduced) {
    return (
      <span className={`decrypted-text-wrapper ${parentClassName}`} ref={containerRef} {...(props as React.HTMLAttributes<HTMLSpanElement>)}>
        <span className="decrypted-text-sr">{text}</span>
        <span aria-hidden="true" className={className}>
          {text}
        </span>
      </span>
    );
  }

  return (
    <motion.span
      className={`decrypted-text-wrapper ${parentClassName}`}
      ref={containerRef}
      {...animateProps}
      {...props}
    >
      {/* Screen-reader accessible canonical text */}
      <span className="decrypted-text-sr">{text}</span>

      {/* Visual scrambling/decryption text */}
      <span aria-hidden="true">
        {displayText.split('').map((char, index) => {
          const isRevealedOrDone = revealedIndices.has(index) || (!isAnimating && isDecrypted);

          return (
            <span
              key={index}
              className={`decrypted-text-char ${isRevealedOrDone ? className : encryptedClassName}`}
            >
              {char}
            </span>
          );
        })}
      </span>
    </motion.span>
  );
};

export default DecryptedText;
