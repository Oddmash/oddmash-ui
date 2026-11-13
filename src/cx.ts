export const cx = (...values: (string | undefined)[]) => values.filter(Boolean).join(' ');
