import type { Allocation, InventoryItem, ToolItem, WorkOrder } from '@ops/shared';

export interface ExperienceLog {
  id: string;
  technician: string;
  skill: string;
  aircraftType: string;
  hours: number;
  date: string;
}

export interface TechnicalRecord {
  id: string;
  workOrderId: string;
  title: string;
  fileId: string;
  note?: string;
}

export interface Invoice {
  id: string;
  workOrderId: string;
  amount: number;
  lineItems: Array<{ label: string; amount: number }>;
  createdAt: string;
}

export interface DevDb {
  inventory: InventoryItem[];
  tools: ToolItem[];
  workOrders: WorkOrder[];
  allocations: Allocation[];
  experienceLogs: ExperienceLog[];
  technicalRecords: TechnicalRecord[];
  invoices: Invoice[];
}
