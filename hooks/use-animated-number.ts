"use client";

import { useEffect, useRef, useState } from "react";

const easeOutCubic = (progress: number) => 1 - Math.pow(1 - progress, 3);

export function useAnimatedNumber(target: number, duration = 820) {
  const [value, setValue] = useState(target);
  const valueRef = useRef(target);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const frameId = requestAnimationFrame(() => {
        valueRef.current = target;
        setValue(target);
      });

      return () => cancelAnimationFrame(frameId);
    }

    const startValue = valueRef.current;
    const distance = target - startValue;

    if (Math.abs(distance) < 0.01) return;

    const startTime = performance.now();
    let frameId = 0;

    const animate = (time: number) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const nextValue = startValue + distance * easeOutCubic(progress);

      valueRef.current = nextValue;
      setValue(nextValue);

      if (progress < 1) frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [duration, target]);

  return value;
}
