import { describe, expect, it } from 'vitest';
import { hasAllocationConflict } from '../src/logic/planner.js';

describe('planner overlap logic', () => {
  it('detects overlap for same resource', () => {
    const existing = [{ id: '1', resourceType: 'person', resourceId: 'A', workOrderId: 'wo1', start: '2026-03-08T08:00:00Z', end: '2026-03-08T10:00:00Z' }] as any;
    const next = { id: '2', resourceType: 'person', resourceId: 'A', workOrderId: 'wo2', start: '2026-03-08T09:00:00Z', end: '2026-03-08T11:00:00Z' } as any;
    expect(hasAllocationConflict(existing, next)).toBe(true);
  });

  it('allows non-overlap', () => {
    const existing = [{ id: '1', resourceType: 'person', resourceId: 'A', workOrderId: 'wo1', start: '2026-03-08T08:00:00Z', end: '2026-03-08T10:00:00Z' }] as any;
    const next = { id: '2', resourceType: 'person', resourceId: 'A', workOrderId: 'wo2', start: '2026-03-08T10:00:00Z', end: '2026-03-08T11:00:00Z' } as any;
    expect(hasAllocationConflict(existing, next)).toBe(false);
  });
});
