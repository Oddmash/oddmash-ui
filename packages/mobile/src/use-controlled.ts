'use client';
import { useState } from 'react';

export const useControlled = <T,>(value: T | undefined, initial: T, onChange?: (value: T) => void) => {
  const [internal, setInternal] = useState(initial);
  const current = value === undefined ? internal : value;
  const set = (next: T) => {
    if (Object.is(current, next)) return;
    if (value === undefined) setInternal(next);
    onChange?.(next);
  };
  return [current, set] as const;
};
