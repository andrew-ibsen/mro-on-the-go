-- Dev reference schema (logical model)
CREATE TABLE inventory_items (
  id TEXT PRIMARY KEY,
  part_no TEXT NOT NULL,
  description TEXT NOT NULL,
  qty_on_hand INTEGER NOT NULL,
  min_qty INTEGER NOT NULL,
  unit_cost REAL NOT NULL
);

CREATE TABLE tools (
  id TEXT PRIMARY KEY,
  tag TEXT NOT NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL,
  issued_to TEXT
);

CREATE TABLE work_orders (
  id TEXT PRIMARY KEY,
  aircraft_reg TEXT NOT NULL,
  discrepancy TEXT NOT NULL,
  status TEXT NOT NULL,
  labor_hours REAL NOT NULL,
  labor_rate REAL NOT NULL,
  parts_cost REAL NOT NULL
);

CREATE TABLE allocations (
  id TEXT PRIMARY KEY,
  resource_type TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  work_order_id TEXT NOT NULL,
  start_ts TEXT NOT NULL,
  end_ts TEXT NOT NULL
);

CREATE TABLE invoices (
  id TEXT PRIMARY KEY,
  work_order_id TEXT NOT NULL,
  amount REAL NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE uploaded_files (
  id TEXT PRIMARY KEY,
  filename TEXT NOT NULL,
  path TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  uploaded_at TEXT NOT NULL
);
