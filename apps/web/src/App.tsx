import { useEffect, useMemo, useState } from 'react';

type Dashboard = any;
const API = 'http://localhost:4000';

export function App() {
  const [role, setRole] = useState('manager');
  const [data, setData] = useState<Dashboard | null>(null);
  const [faultText, setFaultText] = useState('Hydraulic pressure fluctuates during climb');
  const [faultResult, setFaultResult] = useState<any>(null);
  const [storesAirline, setStoresAirline] = useState('BA');

  const load = async () => {
    const res = await fetch(`${API}/dashboard`, { headers: { 'x-role': role } });
    setData(await res.json());
  };

  useEffect(() => {
    load();
  }, [role]);

  const lowStock = useMemo(() => (data?.inventory || []).filter((i: any) => i.qtyOnHand <= i.minQty), [data]);
  const storesItems = useMemo(
    () => (data?.storesItems || []).filter((i: any) => i.airline === storesAirline),
    [data, storesAirline]
  );
  const storesTx = useMemo(
    () => (data?.storesTransactions || []).filter((t: any) => t.airline === storesAirline).slice(0, 8),
    [data, storesAirline]
  );

  const runFault = async (woId: string) => {
    const fd = new FormData();
    fd.append('discrepancy', faultText);
    const res = await fetch(`${API}/work-orders/${woId}/fault-helper`, { method: 'POST', headers: { 'x-role': role }, body: fd });
    setFaultResult(await res.json());
    load();
  };

  const addAllocation = async () => {
    await fetch(`${API}/allocations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-role': role },
      body: JSON.stringify({
        resourceType: 'person',
        resourceId: 'tech-alex',
        workOrderId: 'wo2',
        start: '2026-03-08T09:00:00.000Z',
        end: '2026-03-08T13:00:00.000Z'
      })
    });
    load();
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <h1>MRO on the GO</h1>
        <p>Aircraft Maintenance Command</p>
        <label>Role</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option>manager</option><option>planner</option><option>storekeeper</option><option>technician</option>
        </select>
        <button onClick={load}>Refresh</button>
      </aside>

      <main className="content">
        <section className="card grid-2">
          <div>
            <h2>Stores Keeper — Inventory Management</h2>
            {(data?.inventory || []).map((i: any) => <div key={i.id} className="row"><span>{i.partNo} - {i.description}</span><b>{i.qtyOnHand}</b></div>)}
            <small>Low stock: {lowStock.length}</small>
          </div>
          <div>
            <h2>Stores Keeper — Tool Control</h2>
            {(data?.tools || []).map((t: any) => <div key={t.id} className="row"><span>{t.tag} {t.name}</span><b>{t.status}</b></div>)}
          </div>
        </section>

        <section className="card grid-2">
          <div>
            <h2>Stores Keeper (Power Apps clone)</h2>
            <label>Airline</label>{' '}
            <select value={storesAirline} onChange={(e) => setStoresAirline(e.target.value)}>
              <option>BA</option><option>EI</option><option>IB</option><option>QF</option><option>ANA</option><option>ANZ</option><option>NO</option>
            </select>
            {storesItems.map((s: any) => (
              <div key={s.id} className="row">
                <span>{s.partNumber} · {s.description} · {s.jfkLocation}</span>
                <b>{s.quantity}</b>
              </div>
            ))}
          </div>
          <div>
            <h2>Transaction Log JFK</h2>
            {storesTx.map((t: any) => (
              <div key={t.id} className="row">
                <span>{t.type} {t.partNumber}</span>
                <b>{t.quantity}</b>
              </div>
            ))}
          </div>
        </section>

        <section className="card">
          <h2>Work Orders → Billing</h2>
          {(data?.workOrders || []).map((w: any) => (
            <div key={w.id} className="wo">
              <div><b>{w.id}</b> {w.aircraftReg} — {w.discrepancy}</div>
              <div>Status: <span className="pill">{w.status}</span> | Trail: {w.faultTrail.length} | Attachments: {w.attachments.length}</div>
              <button onClick={() => runFault(w.id)}>Run Fault Helper</button>
            </div>
          ))}
          <input value={faultText} onChange={(e) => setFaultText(e.target.value)} placeholder="discrepancy text" />
          {faultResult?.guidance && <pre>{JSON.stringify(faultResult.guidance, null, 2)}</pre>}
        </section>

        <section className="card">
          <h2>Planner (Overlap-aware) + Gantt</h2>
          <button onClick={addAllocation}>Try overlapping allocation</button>
          <div className="timeline">
            {(data?.allocations || []).map((a: any) => {
              const startHr = new Date(a.start).getUTCHours();
              const endHr = new Date(a.end).getUTCHours();
              const left = (startHr - 6) * 30;
              const width = Math.max((endHr - startHr) * 30, 15);
              return <div key={a.id} className="bar" style={{ left, width }}>{a.resourceId}→{a.workOrderId}</div>;
            })}
          </div>
        </section>

        <section className="card grid-2">
          <div>
            <h2>Experience Logs</h2>
            {(data?.experienceLogs || []).map((e: any) => <div key={e.id} className="row"><span>{e.technician} - {e.skill}</span><b>{e.hours}h</b></div>)}
          </div>
          <div>
            <h2>Technical Records</h2>
            {(data?.technicalRecords || []).map((r: any) => <div key={r.id} className="row"><span>{r.title}</span><b>{r.workOrderId}</b></div>)}
            <small>Upload supported via API endpoint /technical-records</small>
          </div>
        </section>
      </main>
    </div>
  );
}

