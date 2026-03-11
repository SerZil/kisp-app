import { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { MONTHS, MONTHS_SHORT, PAYMENT_TYPES, PAYMENT_META, COLOR, DATA_BY_AREA } from "../constants";
import { mkey, snapshotAt, toARS, fARS, fUSD, initials, avatarColor, rankColor, fDate } from "../helpers";
import DateInput from "./DateInput";
import Select from "./Select";

export default function EmployeeProfile({ emp, dolarMap, ranks, onClose, onSaveHistory, onSaveNotes, onPrint }) {
  const [addingNote, setAddingNote] = useState(false);
  const [newNote, setNewNote] = useState({ text: "", reminder: "" });

  const notes = useMemo(() => [...(emp.notes || [])].sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [emp.notes]);

  function saveNote() {
    if (!newNote.text.trim()) return;
    const note = { id: Date.now(), text: newNote.text.trim(), reminder: newNote.reminder, createdAt: new Date().toISOString().slice(0,10) };
    onSaveNotes(emp.id, [...(emp.notes || []), note]);
    setNewNote({ text: "", reminder: "" });
    setAddingNote(false);
  }

  function deleteNote(id) {
    onSaveNotes(emp.id, (emp.notes || []).filter(n => n.id !== id));
  }

  function clearReminder(id) {
    onSaveNotes(emp.id, (emp.notes || []).map(n => n.id === id ? { ...n, reminder: "" } : n));
  }

  const sorted = useMemo(() => [...emp.history].sort((a, b) => a.from.localeCompare(b.from)), [emp.history]);

  // Range filter - default: last 24 months
  const defaultFrom = useMemo(() => {
    const d = new Date(); d.setMonth(d.getMonth() - 24);
    return d.toISOString().slice(0, 7);
  }, []);
  const firstMonth = useMemo(() => sorted[0]?.from?.slice(0, 7) || "2023-01", [sorted]);
  const [rangeFrom, setRangeFrom] = useState(defaultFrom);
  const [rangeTo, setRangeTo]     = useState(new Date().toISOString().slice(0, 7));

  const chartData = useMemo(() => {
    const pts = [];
    const start = new Date(rangeFrom + "-01");
    const end   = new Date(rangeTo   + "-28");
    const empEnd = emp.activeTo ? new Date(emp.activeTo) : new Date();
    const actualEnd = end < empEnd ? end : empEnd;
    let cur = new Date(start.getFullYear(), start.getMonth(), 1);
    while (cur <= actualEnd) {
      const y = cur.getFullYear(), m = cur.getMonth();
      const k = mkey(y, m);
      const d = dolarMap[k] || 0;
      const snap = snapshotAt(emp, k + "-15");
      if (snap) pts.push({ label: MONTHS_SHORT[m] + " " + y, key: k, ars: toARS(snap.payments, d) });
      cur = new Date(y, m + 1, 1);
    }
    return pts;
  }, [emp, dolarMap, rangeFrom, rangeTo]);

  const filteredHistory = useMemo(() =>
    sorted.filter(s => s.from.slice(0,7) >= rangeFrom && s.from.slice(0,7) <= rangeTo)
  , [sorted, rangeFrom, rangeTo]);

  const changeKeys = useMemo(() =>
    filteredHistory.slice(1).map(s => { const d = new Date(s.from); return mkey(d.getFullYear(), d.getMonth()); })
  , [filteredHistory]);

  const current = sorted[sorted.length - 1];
  const nowKey = mkey(new Date().getFullYear(), new Date().getMonth());
  const currentDolar = dolarMap[nowKey] || 1420;
  const currentTotal = current ? toARS(current.payments, currentDolar) : 0;

  function deleteSnap(idx) {
    if (sorted.length <= 1) return;
    onSaveHistory(emp.id, emp.history.filter((_, j) => j !== idx));
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-end justify-center z-50" style={{alignItems: window.innerWidth < 500 ? "flex-end" : "center", padding: window.innerWidth < 500 ? "0" : "8px"}}>
      <div className="bg-white w-full max-w-3xl flex flex-col relative" style={{ maxHeight: window.innerWidth < 500 ? "95vh" : "92vh", borderRadius: window.innerWidth < 500 ? "20px 20px 0 0" : "16px", marginLeft: window.innerWidth < 500 ? 0 : "8px", marginRight: window.innerWidth < 500 ? 0 : "8px" }}>

        {/* Botón cerrar SIEMPRE visible arriba a la derecha */}
        <button onClick={onClose} className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 text-lg font-bold shadow-sm">×</button>

        {/* header */}
        <div className="p-4 pr-14 border-b border-gray-200 flex items-start gap-3 shrink-0">
          <div className={"w-11 h-11 " + avatarColor(emp.id) + " rounded-2xl flex items-center justify-center text-white text-base font-bold shrink-0"}>
            {initials(emp.name)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-lg font-black text-gray-900 truncate">{emp.name}</div>
            <div className="text-xs text-gray-500">{emp.team}</div>
            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
              {emp.area && <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-semibold">{emp.area}</span>}
              <span className={"px-2 py-0.5 rounded-full text-xs font-medium " + rankColor(current && current.rank, ranks)}>{current && current.rank}</span>
              <span className="text-xs text-gray-400">desde {fDate(emp.activeFrom)}</span>
            </div>
            {(emp.dni || emp.address) && (
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                {emp.dni && <span className="text-xs text-gray-500">🪪 <span className="font-mono">{emp.dni}</span></span>}
                {emp.address && <span className="text-xs text-gray-500">📍 {emp.address}</span>}
                {emp.personalEmail && <span className="text-xs text-gray-500">✉️ {emp.personalEmail}</span>}
              </div>
            )}
          </div>
          <div className="text-right shrink-0">
            <div className="text-xs text-gray-400 uppercase tracking-wide">Sueldo</div>
            <div className="text-base font-black text-gray-900">{fARS(currentTotal)}</div>
            <div className="text-xs text-gray-400">{fUSD(currentDolar > 0 ? currentTotal / currentDolar : 0)}</div>
            <button onClick={() => onPrint(emp, chartData, rangeFrom, rangeTo)} className="mt-1 flex items-center gap-1 px-2 py-1 bg-gray-900 text-white rounded-lg text-xs font-bold hover:bg-gray-700">
              <span>PDF</span>
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 p-5 space-y-5">

          {/* range selector */}
          <div className="bg-gray-50 rounded-xl border border-gray-200 px-4 py-3 flex items-center gap-3 flex-wrap">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide shrink-0">Periodo</span>
            <div className="flex items-center gap-2 flex-1">
              <input type="month" value={rangeFrom} min={firstMonth} max={rangeTo}
                onChange={e => setRangeFrom(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-300" />
              <span className="text-gray-400 text-sm">—</span>
              <input type="month" value={rangeTo} min={rangeFrom}
                onChange={e => setRangeTo(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-300" />
            </div>
            <div className="flex gap-1">
              {[["6m","6 meses",6],["1a","1 año",12],["2a","2 años",24],["Todo","Todo",null]].map(([label, title, months]) => (
                <button key={label} onClick={() => {
                  if (months === null) { setRangeFrom(firstMonth); setRangeTo(new Date().toISOString().slice(0,7)); }
                  else { const d = new Date(); d.setMonth(d.getMonth() - months); setRangeFrom(d.toISOString().slice(0,7)); setRangeTo(new Date().toISOString().slice(0,7)); }
                }} className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white border border-gray-200 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all">
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* chart */}
          {chartData.length > 1 && (
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
              <div className="text-sm font-semibold text-gray-700 mb-3">Evolucion salarial (ARS)</div>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={chartData} margin={{ top: 4, right: 8, left: 8, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} interval={Math.floor(chartData.length / 6)} />
                  <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false}
                    tickFormatter={v => v >= 1000000 ? "$" + (v / 1000000).toFixed(1) + "M" : "$" + (v / 1000).toFixed(0) + "K"} />
                  <Tooltip formatter={v => fARS(v)} labelStyle={{ fontWeight: 700 }} />
                  {changeKeys.map(k => {
                    const idx = chartData.findIndex(p => p.key === k);
                    if (idx < 0) return null;
                    return <ReferenceLine key={k} x={chartData[idx].label} stroke="#6366f1" strokeDasharray="4 2" strokeWidth={1.5} />;
                  })}
                  <Line type="monotone" dataKey="ars" stroke="#3b82f6" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* ── NOTES ── */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-gray-900">📝 Notas</span>
                {notes.length > 0 && <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full">{notes.length}</span>}
              </div>
              <button onClick={() => setAddingNote(v => !v)}
                className="px-3 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-bold hover:bg-gray-700">
                + Agregar nota
              </button>
            </div>

            {addingNote && (
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-3 mb-3 space-y-2">
                <textarea rows={3} placeholder="Escribí tu nota aquí..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 resize-none"
                  value={newNote.text} onChange={e => setNewNote(p => ({ ...p, text: e.target.value }))} />
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-gray-500 uppercase shrink-0">Reminder</label>
                  <input type="month" className="border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                    value={newNote.reminder} onChange={e => setNewNote(p => ({ ...p, reminder: e.target.value }))} />
                  <span className="text-xs text-gray-400">(opcional)</span>
                </div>
                <div className="flex gap-2 justify-end">
                  <button onClick={() => { setAddingNote(false); setNewNote({ text: "", reminder: "" }); }}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-50">Cancelar</button>
                  <button onClick={saveNote} disabled={!newNote.text.trim()}
                    className="px-3 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-bold hover:bg-gray-700 disabled:opacity-40">Guardar</button>
                </div>
              </div>
            )}

            {notes.length === 0 && !addingNote && (
              <div className="text-center py-6 text-gray-400 text-sm">Sin notas aún</div>
            )}

            <div className="space-y-2">
              {notes.map(note => {
                const today = new Date().toISOString().slice(0,7);
                const hasReminder = !!note.reminder;
                const isPending = hasReminder && note.reminder >= today;
                const isOverdue = hasReminder && note.reminder < today;
                return (
                  <div key={note.id} className={"rounded-xl border p-3 group " + (isPending ? "bg-amber-50 border-amber-200" : isOverdue ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-100")}>
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm text-gray-800 flex-1 whitespace-pre-wrap">{note.text}</p>
                      <button onClick={() => deleteNote(note.id)}
                        className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 text-xs px-1.5 py-0.5 rounded transition-opacity shrink-0">
                        Del
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-gray-400">{note.createdAt}</span>
                      {hasReminder ? (
                        <span className={"inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full " + (isPending ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700")}>
                          {isOverdue ? "⚠️ Vencido" : "🔔"} {MONTHS[parseInt(note.reminder.slice(5,7))-1]} {note.reminder.slice(0,4)}
                          <button onClick={() => clearReminder(note.id)} className="ml-0.5 hover:opacity-60 font-black leading-none">×</button>
                        </span>
                      ) : (
                        <input type="month" title="Agregar reminder"
                          className="text-xs border border-dashed border-gray-300 rounded-full px-2 py-0.5 text-gray-400 focus:outline-none focus:border-amber-400 cursor-pointer"
                          onChange={e => { if(e.target.value) onSaveNotes(emp.id, (emp.notes||[]).map(n => n.id===note.id ? {...n, reminder:e.target.value} : n)); }} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* timeline */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="text-sm font-semibold text-gray-700">
                  Historial de cambios
                  {filteredHistory.length < sorted.length && <span className="ml-2 text-xs text-gray-400">({filteredHistory.length} de {sorted.length})</span>}
                </div>
                {(() => {
                  const fromKey = rangeFrom; // "YYYY-MM"
                  const toKey   = rangeTo;
                  const fdSnap = snapshotAt(emp, fromKey + "-15");
                  const tdSnap = snapshotAt(emp, toKey   + "-15");
                  if (!fdSnap || !tdSnap) return null;
                  const dFirst = dolarMap[fromKey] || 1420;
                  const dLast  = dolarMap[toKey]   || 1420;
                  const totalFirst = toARS(fdSnap.payments, dFirst);
                  const totalLast  = toARS(tdSnap.payments, dLast);
                  if (totalFirst <= 0) return null;
                  const pct = ((totalLast - totalFirst) / totalFirst) * 100;
                  const color = pct >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";
                  return (
                    <span className={"px-2.5 py-1 rounded-full text-xs font-bold " + color}>
                      {pct >= 0 ? "+" : ""}{pct.toFixed(1)}% en el periodo
                    </span>
                  );
                })()}
              </div>
            </div>

            <div className="relative">
              <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200" />
              {filteredHistory.length === 0 && (
                <div className="text-center py-8 text-gray-400 text-sm">No hay cambios en este periodo</div>
              )}
              {filteredHistory.map((snap, i) => {
                const isLast = snap === sorted[sorted.length - 1];
                const next = filteredHistory[i + 1];
                const sd = new Date(snap.from);
                const dk = mkey(sd.getFullYear(), sd.getMonth());
                const d = dolarMap[dk] || 1420;
                const arsTotal = toARS(snap.payments, d);
                let pct = null;
                if (i > 0) {
                  const prev = filteredHistory[i - 1];
                  const pd2 = new Date(prev.from);
                  const pk = mkey(pd2.getFullYear(), pd2.getMonth());
                  const pd = dolarMap[pk] || 1420;
                  const prevTotal = toARS(prev.payments, pd);
                  if (prevTotal > 0) pct = ((arsTotal - prevTotal) / prevTotal) * 100;
                }
                return (
                  <div key={i} className="relative flex gap-4 pb-5">
                    <div className={"relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 " + (isLast ? "bg-blue-600 border-blue-600" : "bg-white border-gray-300")}>
                      <span className={"text-xs font-black " + (isLast ? "text-white" : "text-gray-500")}>{i + 1}</span>
                    </div>
                    <div className={"flex-1 rounded-2xl border p-4 group " + (isLast ? "bg-blue-50 border-blue-200" : "bg-white border-gray-200")}>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-gray-800 text-sm">{fDate(snap.from)}</span>
                            {next && <span className="text-gray-400 text-xs">→ {fDate(next.from)}</span>}
                            {isLast && <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-bold">Actual</span>}
                            <span className={"px-2 py-0.5 rounded-full text-xs font-medium " + rankColor(snap.rank, ranks)}>{snap.rank}</span>
                          </div>
                          {snap.note && <div className="text-xs text-gray-500 mt-1 italic">{snap.note}</div>}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {pct != null && (
                            <span className={"text-xs font-bold px-2 py-1 rounded-full " + (pct > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
                              {pct > 0 ? "+" : ""}{pct.toFixed(1)}%
                            </span>
                          )}
                          {sorted.indexOf(snap) > 0 && (
                            <button onClick={() => deleteSnap(sorted.indexOf(snap))} className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 text-red-400 text-xs transition-opacity">
                              Del
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {PAYMENT_TYPES.filter(pt => snap.payments[pt] > 0).map(pt => {
                          const meta = PAYMENT_META[pt];
                          const cc = COLOR[meta.color];
                          const val = snap.payments[pt];
                          const label = pt === "ARS" ? fARS(val) : `U$ ${val.toLocaleString("es-AR")}`;
                          return <span key={pt} className={"px-2.5 py-1 rounded-full text-xs font-semibold border " + cc.badge + " " + cc.border}>{meta.label} {label}</span>;
                        })}
                      </div>
                      <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xs text-gray-400">Total al dolar del periodo (${d.toLocaleString("es-AR")})</span>
                        <span className="font-bold text-gray-800 text-sm">{fARS(arsTotal)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
