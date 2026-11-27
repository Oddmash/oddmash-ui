'use client';
import { useEffect, useState } from 'react';

export const useViewport = () => {
  const [viewport, setViewport] = useState<{height: number; width: number; offsetTop: number; bottomInset: number} | null>(null);
  useEffect(() => {
    const visual = window.visualViewport;
    const update = () => setViewport({ height: visual?.height ?? window.innerHeight, width: visual?.width ?? window.innerWidth, offsetTop: visual?.offsetTop ?? 0, bottomInset: visual ? Math.max(0, window.innerHeight - visual.height - visual.offsetTop) : 0 });
    update();
    window.addEventListener('resize', update);
    visual?.addEventListener('resize', update);
    visual?.addEventListener('scroll', update);
    return () => {
      window.removeEventListener('resize', update);
      visual?.removeEventListener('resize', update);
      visual?.removeEventListener('scroll', update);
    };
  }, []);
  return viewport;
};
