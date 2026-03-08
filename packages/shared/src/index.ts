export type Role = 'manager' | 'planner' | 'storekeeper' | 'technician';

export type WorkOrderStatus =
  | 'draft'
  | 'approved'
  | 'in_progress'
  | 'awaiting_parts'
  | 'completed'
  | 'invoiced';

export interface InventoryItem {
  id: string;
  partNo: string;
  description: string;
  qtyOnHand: number;
  minQty: number;
  unitCost: number;
}

export interface ToolItem {
  id: string;
  tag: string;
  name: string;
  status: 'available' | 'issued' | 'calibration_due';
  issuedTo?: string;
}

export interface WorkOrder {
  id: string;
  aircraftReg: string;
  discrepancy: string;
  status: WorkOrderStatus;
  laborHours: number;
  laborRate: number;
  partsCost: number;
  history: Array<{ at: string; by: string; action: string; note?: string }>;
  faultTrail: FaultGuidance[];
  attachments: UploadedFile[];
}

export interface UploadedFile {
  id: string;
  filename: string;
  path: string;
  mimeType: string;
  uploadedAt: string;
}

export interface Allocation {
  id: string;
  resourceType: 'person' | 'tool';
  resourceId: string;
  workOrderId: string;
  start: string;
  end: string;
}

export interface FaultGuidance {
  id: string;
  createdAt: string;
  discrepancy: string;
  probableCauses: string[];
  diagnosticSteps: string[];
  recommendedActions: string[];
  confidence: number;
  explainability: string[];
}
