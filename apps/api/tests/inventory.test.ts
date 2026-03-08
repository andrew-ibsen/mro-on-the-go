import { describe, expect, it } from 'vitest';
import { issueInventory, returnInventory } from '../src/logic/inventory.js';

describe('inventory constraints', () => {
  const item = { id: 'inv', partNo: 'p', description: 'd', qtyOnHand: 10, minQty: 2, unitCost: 1 };

  it('prevents over-issue', () => {
    expect(() => issueInventory(item as any, 20)).toThrow();
  });

  it('allows return', () => {
    expect(returnInventory(item as any, 2).qtyOnHand).toBe(12);
  });
});
