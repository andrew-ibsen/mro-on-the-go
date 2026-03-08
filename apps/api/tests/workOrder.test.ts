import { describe, expect, it } from 'vitest';
import { canTransition, assertTransition } from '../src/logic/workOrder.js';

describe('work order transitions', () => {
  it('allows valid transition', () => {
    expect(canTransition('draft', 'approved')).toBe(true);
  });

  it('blocks invalid transition', () => {
    expect(canTransition('draft', 'completed')).toBe(false);
    expect(() => assertTransition('draft', 'completed')).toThrow();
  });
});
