import type { InventoryItem } from '@ops/shared';

export function issueInventory(item: InventoryItem, qty: number): InventoryItem {
  if (qty <= 0) throw new Error('Issue quantity must be positive');
  if (item.qtyOnHand < qty) throw new Error('Insufficient inventory');
  return { ...item, qtyOnHand: item.qtyOnHand - qty };
}

export function returnInventory(item: InventoryItem, qty: number): InventoryItem {
  if (qty <= 0) throw new Error('Return quantity must be positive');
  return { ...item, qtyOnHand: item.qtyOnHand + qty };
}
