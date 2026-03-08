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

export interface StoresItem {
  id: string;
  airline: string;
  partNumber: string;
  description: string;
  jfkLocation: string;
  batchNumber?: string;
  serialNumber?: string;
  quantity: number;
  timeExpiration?: string;
  comments?: string;
  createdBy?: string;
  attachments?: Array<{ id: string; filename: string; path: string; uploadedAt: string }>;
}

export interface StoresTransaction {
  id: string;
  airline: string;
  type: 'IN' | 'OUT' | 'TRANSFER' | 'ADJUSTMENT';
  partNumber: string;
  quantity: number;
  fromLocation?: string;
  toLocation?: string;
  note?: string;
  createdAt: string;
  createdBy?: string;
}

export interface JfkUser {
  id: string;
  firstName: string;
  lastName: string;
  staffNumber?: string;
  email?: string;
  dateOfBirth?: string;
}

export interface DevDb {
  inventory: InventoryItem[];
  tools: ToolItem[];
  workOrders: WorkOrder[];
  allocations: Allocation[];
  experienceLogs: ExperienceLog[];
  technicalRecords: TechnicalRecord[];
  invoices: Invoice[];
  storesItems: StoresItem[];
  storesTransactions: StoresTransaction[];
  jfkUsers: JfkUser[];
}