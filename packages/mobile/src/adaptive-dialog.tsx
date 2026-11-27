'use client';
import { useEffect, useState } from 'react';
import { BottomSheet } from './bottom-sheet.js';
import type { BottomSheetProps } from './bottom-sheet.js';

export type AdaptiveDialogProps = Omit<BottomSheetProps, 'presentation'> & { breakpoint?: number; presentation?: 'auto' | 'sheet' | 'dialog' };

export const AdaptiveDialog = ({ breakpoint = 640, presentation = 'auto', ...props }: AdaptiveDialogProps) => {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const query = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const update = () => setNarrow(query.matches);
    update(); query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, [breakpoint]);
  return <BottomSheet {...props} presentation={presentation === 'auto' ? (narrow ? 'sheet' : 'dialog') : presentation} />;
};
