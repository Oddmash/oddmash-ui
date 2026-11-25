import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cx } from './cx';

export type CodeBlockProps = ComponentPropsWithoutRef<'div'>;
export const CodeBlock = /* @__PURE__ */ forwardRef<HTMLDivElement, CodeBlockProps>(
  ({ className, ...props }, ref) => (
    <div {...props} ref={ref} className={cx('om-code-block', className)} />
  ),
);
CodeBlock.displayName = 'CodeBlock';

export type CodeBlockHeaderProps = ComponentPropsWithoutRef<'div'>;
export const CodeBlockHeader = /* @__PURE__ */ forwardRef<HTMLDivElement, CodeBlockHeaderProps>(
  ({ className, ...props }, ref) => (
    <div {...props} ref={ref} className={cx('om-code-block-header', className)} />
  ),
);
CodeBlockHeader.displayName = 'CodeBlockHeader';

export type CodeBlockCaptionProps = ComponentPropsWithoutRef<'span'>;
export const CodeBlockCaption = /* @__PURE__ */ forwardRef<HTMLSpanElement, CodeBlockCaptionProps>(
  ({ className, ...props }, ref) => (
    <span {...props} ref={ref} className={cx('om-code-block-caption', className)} />
  ),
);
CodeBlockCaption.displayName = 'CodeBlockCaption';

export type CodeBlockContentProps = ComponentPropsWithoutRef<'pre'>;
export const CodeBlockContent = /* @__PURE__ */ forwardRef<HTMLPreElement, CodeBlockContentProps>(
  ({ className, ...props }, ref) => (
    <pre {...props} ref={ref} className={cx('om-code-block-content', className)} />
  ),
);
CodeBlockContent.displayName = 'CodeBlockContent';

export type CodeBlockCopyProps = ComponentPropsWithoutRef<'button'>;
export const CodeBlockCopy = /* @__PURE__ */ forwardRef<HTMLButtonElement, CodeBlockCopyProps>(
  ({ className, type = 'button', ...props }, ref) => (
    <button {...props} ref={ref} type={type} className={cx('om-code-block-copy', className)} />
  ),
);
CodeBlockCopy.displayName = 'CodeBlockCopy';
