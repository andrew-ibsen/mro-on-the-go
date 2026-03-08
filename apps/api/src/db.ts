import fs from 'node:fs';
import path from 'node:path';
import type { DevDb } from './types.js';

const dbPath = path.resolve(process.cwd(), 'data/dev-db.json');

const emptyDb: DevDb = {
  inventory: [],
  tools: [],
  workOrders: [],
  allocations: [],
  experienceLogs: [],
  technicalRecords: [],
  invoices: [],
  storesItems: [],
  storesTransactions: [],
  jfkUsers: []
};

export function readDb(): DevDb {
  if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    fs.writeFileSync(dbPath, JSON.stringify(emptyDb, null, 2));
  }
  return JSON.parse(fs.readFileSync(dbPath, 'utf-8')) as DevDb;
}

export function writeDb(db: DevDb): void {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}
