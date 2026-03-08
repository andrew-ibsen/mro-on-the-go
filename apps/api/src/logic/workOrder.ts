import type { WorkOrderStatus } from '@ops/shared';

const transitions: Record<WorkOrderStatus, WorkOrderStatus[]> = {
  draft: ['approved'],
  approved: ['in_progress'],
  in_progress: ['awaiting_parts', 'completed'],
  awaiting_parts: ['in_progress', 'completed'],
  completed: ['invoiced'],
  invoiced: []
};

export function canTransition(from: WorkOrderStatus, to: WorkOrderStatus): boolean {
  return transitions[from].includes(to);
}

export function assertTransition(from: WorkOrderStatus, to: WorkOrderStatus): void {
  if (!canTransition(from, to)) {
    throw new Error(`Invalid work order transition: ${from} -> ${to}`);
  }
}
