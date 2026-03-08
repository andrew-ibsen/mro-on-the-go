import { writeDb } from './db.js';

writeDb({
  inventory: [
    { id: 'inv1', partNo: 'BAC-1001', description: 'Hydraulic Seal Kit', qtyOnHand: 12, minQty: 5, unitCost: 180 },
    { id: 'inv2', partNo: 'BAC-2203', description: 'Landing Light Assembly', qtyOnHand: 4, minQty: 3, unitCost: 650 },
    { id: 'inv3', partNo: 'BAC-7788', description: 'Fuel Filter Cartridge', qtyOnHand: 30, minQty: 10, unitCost: 45 }
  ],
  tools: [
    { id: 'tool1', tag: 'TC-001', name: 'Digital Torque Wrench', status: 'available' },
    { id: 'tool2', tag: 'TC-002', name: 'Hydraulic Pressure Test Rig', status: 'available' },
    { id: 'tool3', tag: 'TC-003', name: 'Borescope Camera', status: 'calibration_due' }
  ],
  workOrders: [
    {
      id: 'wo1',
      aircraftReg: 'G-BA001',
      discrepancy: 'Hydraulic system B pressure fluctuates during climb',
      status: 'in_progress',
      laborHours: 6,
      laborRate: 165,
      partsCost: 420,
      history: [{ at: new Date().toISOString(), by: 'manager', action: 'seeded' }],
      faultTrail: [],
      attachments: []
    },
    {
      id: 'wo2',
      aircraftReg: 'G-BA229',
      discrepancy: 'Cabin panel vibration near row 28',
      status: 'completed',
      laborHours: 3,
      laborRate: 160,
      partsCost: 120,
      history: [{ at: new Date().toISOString(), by: 'manager', action: 'seeded' }],
      faultTrail: [],
      attachments: []
    }
  ],
  allocations: [
    {
      id: 'al1',
      resourceType: 'person',
      resourceId: 'tech-alex',
      workOrderId: 'wo1',
      start: '2026-03-08T08:00:00.000Z',
      end: '2026-03-08T12:00:00.000Z'
    }
  ],
  experienceLogs: [
    { id: 'exp1', technician: 'Alex', skill: 'Hydraulic troubleshooting', aircraftType: 'A320', hours: 2.5, date: '2026-03-05' },
    { id: 'exp2', technician: 'Maya', skill: 'Cabin interior repair', aircraftType: 'B777', hours: 1.8, date: '2026-03-06' }
  ],
  technicalRecords: [],
  invoices: [],
  storesItems: [
    {
      id: 'stk-ba-1',
      airline: 'BA',
      partNumber: 'BA-320-DOOR-LATCH',
      description: 'Door Latch Assembly',
      jfkLocation: 'JFK-A1-SHELF-3',
      batchNumber: 'BA-B321',
      serialNumber: 'SN-99301',
      quantity: 6,
      timeExpiration: '2027-12-31',
      comments: 'Priority part',
      createdBy: 'andrew.ibsen@ba.com'
    },
    {
      id: 'stk-ei-1',
      airline: 'EI',
      partNumber: 'EI-737-FLTR-90',
      description: 'Fuel Filter',
      jfkLocation: 'JFK-B4-BIN-7',
      quantity: 14,
      timeExpiration: '2028-01-20',
      createdBy: 'stores.agent@ba.com'
    }
  ],
  storesTransactions: [
    {
      id: 'tx-1',
      airline: 'BA',
      type: 'IN',
      partNumber: 'BA-320-DOOR-LATCH',
      quantity: 6,
      toLocation: 'JFK-A1-SHELF-3',
      note: 'Initial stock',
      createdAt: new Date().toISOString(),
      createdBy: 'andrew.ibsen@ba.com'
    }
  ],
  jfkUsers: [
    { id: 'u1', firstName: 'Andrew', lastName: 'Ibsen', email: 'andrew.ibsen@ba.com', staffNumber: 'BA001' },
    { id: 'u2', firstName: 'Katia', lastName: 'Ibsen', email: 'katia.ibsen@ba.com', staffNumber: 'BA002' }
  ]
});

console.log('Seed complete.');