import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ReactNode,
  type MouseEventHandler,
} from 'react';
import { Button, type ButtonProps } from './button';
import { cx } from './cx';

export type ClipboardState = 'idle' | 'pending' | 'copied' | 'error';
export type ClipboardLabels = Record<ClipboardState, string>;

const defaultLabels: ClipboardLabels = {
  idle: 'Copy',
  pending: 'Copying',
  copied: 'Copied',
  error: 'Could not copy. Select the text and copy it manually.',
};

export const copyText = async (text: string): Promise<void> => {
  const clipboard = globalThis.navigator?.clipboard;
  if (!clipboard || typeof clipboard.writeText !== 'function') {
    throw new Error('Clipboard writing is unavailable.');
  }
  await clipboard.writeText(text);
};

export type ClipboardButtonProps = Omit<ButtonProps, 'children'> & {
  text: string;
  labels?: ClipboardLabels;
  children?: ReactNode | ((state: ClipboardState) => ReactNode);
  resetDelay?: number | null;
  announce?: boolean;
  onCopied?: (text: string) => void;
  onCopyError?: (error: unknown) => void;
};

export const ClipboardButton = /* @__PURE__ */ forwardRef<HTMLButtonElement, ClipboardButtonProps>(
  (
    {
      text,
      labels = defaultLabels,
      children,
      resetDelay = 2500,
      announce = true,
      onCopied,
      onCopyError,
      onClick,
      className,
      variant = 'secondary',
      ...props
    },
    ref,
  ) => {
    const [state, setState] = useState<ClipboardState>('idle');
    const button = useRef<HTMLButtonElement>(null);
    useImperativeHandle(ref, () => button.current!, []);
    const currentText = useRef(text);
    const pending = useRef(false);
    const reset = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    useEffect(() => () => clearTimeout(reset.current), []);

    useEffect(() => {
      currentText.current = text;
      clearTimeout(reset.current);
      if (!pending.current) setState('idle');
    }, [text]);

    const click: MouseEventHandler<HTMLButtonElement> = (event) => {
      onClick?.(event);
      if (event.defaultPrevented || pending.current || props.disabled) return;

      pending.current = true;
      clearTimeout(reset.current);
      setState('pending');
      const complete = async () => {
        let result: { ok: true } | { ok: false; error: unknown };
        try {
          await copyText(text);
          result = { ok: true };
        } catch (error) {
          result = { ok: false, error };
        }

        pending.current = false;
        if (!button.current) return;
        if (currentText.current !== text) {
          setState('idle');
          return;
        }

        if (result.ok) {
          setState('copied');
          if (resetDelay !== null && Number.isFinite(resetDelay) && resetDelay >= 0) {
            reset.current = setTimeout(() => {
              if (button.current && !pending.current && currentText.current === text) setState('idle');
            }, resetDelay);
          }
          onCopied?.(text);
        } else {
          setState('error');
          onCopyError?.(result.error);
        }
      };
      void complete();
    };

    return (
      <>
        <Button
          {...props}
          ref={button}
          variant={variant}
          className={cx('om-clipboard-button', className)}
          onClick={click}
          aria-busy={state === 'pending' || props['aria-busy']}
          aria-label={props['aria-label'] ?? labels[state]}
          data-copy-state={state}
        >
          {typeof children === 'function' ? children(state) : children ?? labels[state]}
        </Button>
        {announce && (
          <span className="om-clipboard-announcement" role="status" aria-atomic="true">
            {state === 'copied' || state === 'error' ? labels[state] : ''}
          </span>
        )}
      </>
    );
  },
);
ClipboardButton.displayName = 'ClipboardButton';
