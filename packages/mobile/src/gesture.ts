export type Axis = 'x' | 'y';
export type GestureIntent = 'pending' | 'primary' | 'cross';

export const getIntent = (primary: number, cross: number, threshold = 8): GestureIntent => {
  if (Math.max(Math.abs(primary), Math.abs(cross)) < threshold) return 'pending';
  return Math.abs(primary) > Math.abs(cross) ? 'primary' : 'cross';
};

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const normalizeSnapPoints = (points: readonly number[]) => {
  if (!points.length || points.some((point) => !Number.isFinite(point) || point <= 0 || point > 1)) {
    throw new RangeError('Snap points must be fractions greater than zero and at most one.');
  }
  return [...new Set(points)].sort((a, b) => a - b);
};

export const nearestSnapPoint = (points: readonly number[], value: number) => {
  const [first, ...rest] = normalizeSnapPoints(points);
  return rest.reduce((best, next) => Math.abs(next - value) < Math.abs(best - value) ? next : best, first!);
};
