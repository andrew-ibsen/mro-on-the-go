import type { WorkOrder } from '@ops/shared';

export function generateInvoice(workOrder: WorkOrder) {
  const labor = workOrder.laborHours * workOrder.laborRate;
  const parts = workOrder.partsCost;
  const surcharge = Number((labor * 0.05).toFixed(2));
  const total = Number((labor + parts + surcharge).toFixed(2));

  return {
    workOrderId: workOrder.id,
    amount: total,
    lineItems: [
      { label: `Labor (${workOrder.laborHours}h @ ${workOrder.laborRate})`, amount: labor },
      { label: 'Parts', amount: parts },
      { label: 'Ops surcharge (5%)', amount: surcharge }
    ]
  };
}
