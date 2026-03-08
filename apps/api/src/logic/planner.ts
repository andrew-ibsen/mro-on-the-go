import type { Allocation } from '@ops/shared';

export function overlaps(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  return new Date(aStart) < new Date(bEnd) && new Date(bStart) < new Date(aEnd);
}

export function hasAllocationConflict(existing: Allocation[], next: Allocation): boolean {
  return existing.some(
    (a) =>
      a.resourceType === next.resourceType &&
      a.resourceId === next.resourceId &&
      overlaps(a.start, a.end, next.start, next.end)
  );
}
