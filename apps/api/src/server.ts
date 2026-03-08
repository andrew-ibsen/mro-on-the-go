import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import { nanoid } from 'nanoid';
import { readDb, writeDb } from './db.js';
import { assertTransition } from './logic/workOrder.js';
import { hasAllocationConflict } from './logic/planner.js';
import { issueInventory, returnInventory } from './logic/inventory.js';
import { generateInvoice } from './logic/invoice.js';
import { mockSmsSend, runFaultHelper } from './logic/faultHelper.js';

const app = express();
const port = 4000;

const uploadDir = path.resolve(process.cwd(), 'storage');
fs.mkdirSync(uploadDir, { recursive: true });
const upload = multer({ dest: uploadDir });

app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadDir));

app.use((req, _res, next) => {
  (req as any).role = req.header('x-role') || 'technician';
  next();
});

app.get('/health', (_req, res) => res.json({ ok: true }));
app.get('/dashboard', (_req, res) => res.json(readDb()));

app.get('/stores/items', (req, res) => {
  const db = readDb();
  const airline = String(req.query.airline || '').trim();
  const items = airline ? db.storesItems.filter((i) => i.airline.toLowerCase() === airline.toLowerCase()) : db.storesItems;
  res.json(items);
});

app.post('/stores/items', (req, res) => {
  const db = readDb();
  const item = {
    id: nanoid(),
    airline: String(req.body.airline || 'BA').toUpperCase(),
    partNumber: req.body.partNumber,
    description: req.body.description,
    jfkLocation: req.body.jfkLocation,
    batchNumber: req.body.batchNumber || 'N/A',
    serialNumber: req.body.serialNumber || 'N/A',
    quantity: Number(req.body.quantity ?? 0),
    timeExpiration: req.body.timeExpiration,
    comments: req.body.comments,
    createdBy: req.body.createdBy || (req as any).role,
    attachments: []
  };

  if (!item.partNumber || !item.description || !item.jfkLocation) {
    return res.status(400).json({ error: 'partNumber, description, and jfkLocation are required' });
  }

  db.storesItems.push(item as any);
  writeDb(db);
  return res.status(201).json(item);
});

app.post('/stores/transactions', (req, res) => {
  const db = readDb();
  const type = String(req.body.type || '').toUpperCase();
  if (!['IN', 'OUT', 'TRANSFER', 'ADJUSTMENT'].includes(type)) {
    return res.status(400).json({ error: 'Invalid type. Use IN, OUT, TRANSFER, or ADJUSTMENT' });
  }

  const qty = Number(req.body.quantity);
  if (!Number.isFinite(qty) || qty <= 0) {
    return res.status(400).json({ error: 'quantity must be > 0' });
  }

  const airline = String(req.body.airline || 'BA').toUpperCase();
  const partNumber = String(req.body.partNumber || '').trim();
  const item = db.storesItems.find((i) => i.airline === airline && i.partNumber === partNumber);
  if (!item) return res.status(404).json({ error: 'Stores item not found for airline + partNumber' });

  if (type === 'OUT' && item.quantity < qty) {
    return res.status(400).json({ error: 'Insufficient quantity for OUT transaction' });
  }

  if (type === 'IN') item.quantity += qty;
  if (type === 'OUT') item.quantity -= qty;
  if (type === 'ADJUSTMENT') item.quantity = qty;

  if (type === 'TRANSFER') {
    const from = String(req.body.fromLocation || item.jfkLocation);
    const to = String(req.body.toLocation || '').trim();
    if (!to) return res.status(400).json({ error: 'toLocation required for TRANSFER' });
    item.jfkLocation = to;
    req.body.fromLocation = from;
  }

  const tx = {
    id: nanoid(),
    airline,
    type,
    partNumber,
    quantity: qty,
    fromLocation: req.body.fromLocation,
    toLocation: req.body.toLocation,
    note: req.body.note,
    createdAt: new Date().toISOString(),
    createdBy: req.body.createdBy || (req as any).role
  };

  db.storesTransactions.unshift(tx as any);
  writeDb(db);
  return res.status(201).json({ transaction: tx, item });
});

app.get('/stores/transactions', (req, res) => {
  const db = readDb();
  const airline = String(req.query.airline || '').trim();
  const rows = airline ? db.storesTransactions.filter((t) => t.airline.toLowerCase() === airline.toLowerCase()) : db.storesTransactions;
  res.json(rows.slice(0, 300));
});

app.get('/jfk-users', (_req, res) => {
  const db = readDb();
  res.json(db.jfkUsers);
});

app.post('/inventory/:id/issue', (req, res) => {
  const db = readDb();
  const item = db.inventory.find((i) => i.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Item not found' });
  try {
    const next = issueInventory(item, Number(req.body.qty));
    Object.assign(item, next);
    writeDb(db);
    return res.json(item);
  } catch (e: any) {
    return res.status(400).json({ error: e.message });
  }
});

app.post('/inventory/:id/return', (req, res) => {
  const db = readDb();
  const item = db.inventory.find((i) => i.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Item not found' });
  try {
    const next = returnInventory(item, Number(req.body.qty));
    Object.assign(item, next);
    writeDb(db);
    return res.json(item);
  } catch (e: any) {
    return res.status(400).json({ error: e.message });
  }
});

app.post('/tools/:id/issue', (req, res) => {
  const db = readDb();
  const tool = db.tools.find((t) => t.id === req.params.id);
  if (!tool) return res.status(404).json({ error: 'Tool not found' });
  if (tool.status === 'issued') return res.status(400).json({ error: 'Tool already issued' });
  tool.status = 'issued';
  tool.issuedTo = req.body.issuedTo;
  writeDb(db);
  return res.json(tool);
});

app.post('/tools/:id/return', (req, res) => {
  const db = readDb();
  const tool = db.tools.find((t) => t.id === req.params.id);
  if (!tool) return res.status(404).json({ error: 'Tool not found' });
  tool.status = 'available';
  tool.issuedTo = undefined;
  writeDb(db);
  return res.json(tool);
});

app.post('/work-orders', (req, res) => {
  const db = readDb();
  const wo = {
    id: nanoid(),
    aircraftReg: req.body.aircraftReg,
    discrepancy: req.body.discrepancy,
    status: 'draft',
    laborHours: Number(req.body.laborHours ?? 2),
    laborRate: Number(req.body.laborRate ?? 160),
    partsCost: Number(req.body.partsCost ?? 0),
    history: [{ at: new Date().toISOString(), by: 'system', action: 'created' }],
    faultTrail: [],
    attachments: []
  };
  db.workOrders.push(wo as any);
  writeDb(db);
  res.status(201).json(wo);
});

app.patch('/work-orders/:id/status', (req, res) => {
  const db = readDb();
  const wo = db.workOrders.find((w) => w.id === req.params.id);
  if (!wo) return res.status(404).json({ error: 'Work order not found' });
  try {
    assertTransition(wo.status, req.body.to);
    wo.status = req.body.to;
    wo.history.push({ at: new Date().toISOString(), by: (req as any).role, action: `status:${req.body.to}` });
    writeDb(db);
    return res.json(wo);
  } catch (e: any) {
    return res.status(400).json({ error: e.message });
  }
});

app.post('/work-orders/:id/invoice', (req, res) => {
  const db = readDb();
  const wo = db.workOrders.find((w) => w.id === req.params.id);
  if (!wo) return res.status(404).json({ error: 'Work order not found' });
  if (wo.status !== 'completed' && wo.status !== 'invoiced') return res.status(400).json({ error: 'Work order not completed' });
  const draft = generateInvoice(wo);
  const invoice = { id: nanoid(), ...draft, createdAt: new Date().toISOString() };
  db.invoices.push(invoice as any);
  wo.status = 'invoiced';
  wo.history.push({ at: new Date().toISOString(), by: (req as any).role, action: 'invoiced' });
  writeDb(db);
  return res.json(invoice);
});

app.post('/allocations', (req, res) => {
  const db = readDb();
  const next = { id: nanoid(), ...req.body };
  if (hasAllocationConflict(db.allocations as any, next as any)) {
    return res.status(400).json({ error: 'Allocation conflict detected' });
  }
  db.allocations.push(next as any);
  writeDb(db);
  return res.status(201).json(next);
});

app.post('/work-orders/:id/fault-helper', upload.array('files', 5), (req, res) => {
  const db = readDb();
  const wo = db.workOrders.find((w) => w.id === req.params.id);
  if (!wo) return res.status(404).json({ error: 'Work order not found' });

  const files = ((req.files as Express.Multer.File[]) || []).map((f) => ({
    id: nanoid(),
    filename: f.originalname,
    path: `/files/${f.filename}`,
    mimeType: f.mimetype,
    uploadedAt: new Date().toISOString()
  }));

  wo.attachments.push(...files as any);
  const guidance = runFaultHelper(req.body.discrepancy || wo.discrepancy, files.map((f) => f.filename));
  wo.faultTrail.push(guidance as any);
  wo.history.push({ at: new Date().toISOString(), by: (req as any).role, action: 'fault_helper', note: guidance.explainability.join(' | ') });
  writeDb(db);

  const smsPreview = mockSmsSend('Shift Supervisor', `WO ${wo.id} fault guidance ready. Confidence ${(guidance.confidence * 100).toFixed(0)}%`);
  return res.json({ guidance, files, smsPreview });
});

app.post('/technical-records', upload.single('file'), (req, res) => {
  const db = readDb();
  if (!req.file) return res.status(400).json({ error: 'file required' });
  const fileMeta = {
    id: nanoid(),
    filename: req.file.originalname,
    path: `/files/${req.file.filename}`,
    mimeType: req.file.mimetype,
    uploadedAt: new Date().toISOString()
  };
  const wo = db.workOrders.find((w) => w.id === req.body.workOrderId);
  if (wo) wo.attachments.push(fileMeta as any);

  const record = {
    id: nanoid(),
    workOrderId: req.body.workOrderId,
    title: req.body.title,
    note: req.body.note,
    fileId: fileMeta.id
  };
  db.technicalRecords.push(record as any);
  writeDb(db);
  res.status(201).json({ record, file: fileMeta });
});

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
