import { describe, expect, it } from 'vitest';
import { generateInvoice } from '../src/logic/invoice.js';

describe('invoice generation', () => {
  it('computes labor + parts + surcharge', () => {
    const result = generateInvoice({ id: 'wo', laborHours: 2, laborRate: 100, partsCost: 50 } as any);
    expect(result.amount).toBe(260);
    expect(result.lineItems.length).toBe(3);
  });
});
