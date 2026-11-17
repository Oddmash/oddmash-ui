import { forwardRef, useState, type ComponentPropsWithoutRef } from 'react';
import { cx } from './cx';

export type AvatarProps = ComponentPropsWithoutRef<'span'> & {
  src?: string;
  label?: string;
};

const AvatarImage = ({ src }: { src: string }) => {
  const [visible, setVisible] = useState(false);
  return (
    <img
      src={src}
      alt=""
      hidden={!visible}
      onLoad={() => setVisible(true)}
      onError={() => setVisible(false)}
    />
  );
};

export const Avatar = /* @__PURE__ */ forwardRef<HTMLSpanElement, AvatarProps>(
  ({ className, src, label, children, ...props }, ref) => (
    <span
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      {...props}
      ref={ref}
      className={cx('om-avatar', className)}
    >
      {children}
      {src && <AvatarImage key={src} src={src} />}
    </span>
  ),
);
Avatar.displayName = 'Avatar';
