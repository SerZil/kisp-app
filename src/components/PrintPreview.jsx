import { useRef } from "react";
import { MONTHS, PAYMENT_TYPES, PAYMENT_META } from "../constants";
import { mkey, toARS, fARS, fUSD, fDate } from "../helpers";

export default function PrintPreview({ emp, dolarMap, ranks, chartData, year, month, rangeFrom, rangeTo, onClose }) {
  const printRef = useRef();
  const sorted = [...emp.history].sort((a, b) => a.from.localeCompare(b.from));
  const now = new Date();
  const today = now.toLocaleDateString("es-AR");

  // Use selected period
  const selectedKey = mkey(year, month);
  const current = sorted.filter(s => s.from.slice(0,7) <= selectedKey).slice(-1)[0]
                  || sorted[sorted.length - 1];
  const currentDolar = dolarMap[selectedKey] || 1420;
  const currentTotal = current ? toARS(current.payments, currentDolar) : 0;
  const periodLabel = MONTHS[month] + " " + year;

  // Age at selected period
  const selectedDate = new Date(year, month, 1);
  const ageMonths = Math.max(0, Math.floor((selectedDate - new Date(emp.activeFrom)) / (1000 * 60 * 60 * 24 * 30)));

  // Snapshots within the selected range
  const effectiveFrom = rangeFrom || sorted[0]?.from?.slice(0,7) || "";
  const effectiveTo   = rangeTo   || selectedKey;
  const snapsUpToPeriod = sorted.filter(s => s.from.slice(0,7) <= selectedKey);
  const snapsInRange    = sorted.filter(s => s.from.slice(0,7) >= effectiveFrom && s.from.slice(0,7) <= effectiveTo);

  // Variation: from start of range to end of range
  let varTotal = null;
  let varLabel = "vs ingreso";
  if (snapsInRange.length >= 1) {
    const s0 = snapsInRange[0];
    const d0 = dolarMap[mkey(new Date(s0.from).getFullYear(), new Date(s0.from).getMonth())] || 1420;
    const first = toARS(s0.payments, d0);
    if (first > 0) {
      varTotal = ((currentTotal - first) / first) * 100;
      varLabel = "vs " + s0.from.slice(0,7);
    }
  }

  function handlePrint() {
    if (!printRef.current) return;
    const content = printRef.current.innerHTML;
    const w = window.open("", "_blank");
    if (!w) { alert("Por favor permitir popups para imprimir"); return; }
    w.document.write("<!DOCTYPE html><html><head><meta charset='UTF-8'><style>" +
      "@page{margin:15mm;size:A4}" +
      "*{box-sizing:border-box;font-family:Arial,sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact}" +
      "body{margin:0;padding:16px;font-size:11px;color:#111}" +
      "</style></head><body>" + content + "</body></html>");
    w.document.close();
    w.onload = () => { w.focus(); w.print(); w.close(); };
    setTimeout(() => { try { w.focus(); w.print(); } catch(e){} }, 800);
  }

  const maxARS = Math.max(...chartData.map(p => p.ars), 1);
  const barSample = chartData.filter((_, i) => i % Math.max(1, Math.floor(chartData.length / 18)) === 0);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-2">
      <div className="bg-white rounded-2xl shadow-2xl flex flex-col" style={{ width: "700px", maxWidth: "100%", maxHeight: "92vh" }}>

        {/* toolbar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 shrink-0">
          <div>
            <div className="font-bold text-gray-800 text-sm">Vista previa — {emp.name}</div>
            <div className="text-xs text-gray-400">{periodLabel} · {today}</div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handlePrint} className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-700">
              Imprimir / PDF
            </button>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 text-lg">x</button>
          </div>
        </div>

        {/* scrollable preview */}
        <div className="overflow-y-auto flex-1 bg-gray-100 p-4">
          <div ref={printRef} style={{ background: "white", padding: "24px", borderRadius: "8px", fontFamily: "Arial,sans-serif", fontSize: "11px", color: "#111" }}>

            {/* header */}
            <div style={{ background: "#1f2937", color: "white", padding: "16px 20px", borderRadius: "8px", marginBottom: "14px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: "18px", fontWeight: 900, marginBottom: "3px" }}>{emp.name}</div>
                <div style={{ color: "#9ca3af", fontSize: "11px" }}>Equipo: {emp.team}</div>
                <div style={{ color: "#9ca3af", fontSize: "11px", marginTop: "2px" }}>Desde {fDate(emp.activeFrom)}{emp.activeTo ? " · hasta " + fDate(emp.activeTo) : ""}</div>
                <div style={{ background: "rgba(255,255,255,0.15)", padding: "2px 8px", borderRadius: "20px", fontSize: "10px", fontWeight: 600, display: "inline-block", marginTop: "6px" }}>{current && current.rank}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: "#9ca3af", fontSize: "9px", textTransform: "uppercase", letterSpacing: "1px" }}>Sueldo — {periodLabel}</div>
                <div style={{ fontSize: "20px", fontWeight: 900 }}>{fARS(currentTotal)}</div>
                <div style={{ color: "#9ca3af", fontSize: "10px" }}>{fUSD(currentDolar > 0 ? currentTotal / currentDolar : 0)}</div>
                <div style={{ color: "#6b7280", fontSize: "9px", marginTop: "6px" }}>KiSP Nomina · {periodLabel}</div>
              </div>
            </div>

            {/* stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "10px", marginBottom: "14px" }}>
              {[
                { label: "Periodos registrados", val: sorted.length, sub: sorted.length > 1 ? (sorted.length - 1) + " cambio(s)" : "Sin cambios" },
                { label: "Antiguedad", val: (Math.floor(ageMonths/12) > 0 ? Math.floor(ageMonths/12) + "a " : "") + (ageMonths%12) + "m", sub: "desde " + fDate(emp.activeFrom) },
                { label: "Variacion periodo", val: varTotal != null ? (varTotal > 0 ? "+" : "") + varTotal.toFixed(1) + "%" : "—", sub: varLabel, color: varTotal != null ? (varTotal > 0 ? "#15803d" : "#b91c1c") : undefined },
              ].map(s => (
                <div key={s.label} style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "6px", padding: "10px 12px" }}>
                  <div style={{ fontSize: "9px", color: "#9ca3af", textTransform: "uppercase", marginBottom: "3px" }}>{s.label}</div>
                  <div style={{ fontSize: "16px", fontWeight: 800, color: s.color || "#111" }}>{s.val}</div>
                  <div style={{ fontSize: "10px", color: "#6b7280", marginTop: "2px" }}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* chart bars */}
            {chartData.length > 2 && (
              <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "6px", padding: "12px", marginBottom: "14px" }}>
                <div style={{ fontSize: "10px", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", marginBottom: "8px" }}>Evolucion salarial (ARS)</div>
                <div style={{ display: "flex", alignItems: "flex-end", height: "70px", gap: "2px", borderBottom: "1px solid #e5e7eb" }}>
                  {barSample.map((p, i) => (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end" }}>
                      <div style={{ background: "#3b82f6", width: "100%", height: Math.max(2, (p.ars / maxARS) * 66) + "px", borderRadius: "2px 2px 0 0" }} />
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: "2px", marginTop: "2px" }}>
                  {barSample.map((p, i) => (
                    <div key={i} style={{ flex: 1, fontSize: "7px", color: "#9ca3af", textAlign: "center", overflow: "hidden" }}>{p.label}</div>
                  ))}
                </div>
              </div>
            )}

            {/* history table */}
            <div style={{ marginBottom: "14px" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", marginBottom: "8px" }}>Historial de cambios</div>
              <div style={{ border: "1px solid #e5e7eb", borderRadius: "6px", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#f3f4f6" }}>
                      {["Periodo", "Cargo", "Composicion salarial", "Total ARS", "Variacion"].map(h => (
                        <th key={h} style={{ padding: "8px 10px", textAlign: h === "Total ARS" || h === "Variacion" ? "right" : "left", fontSize: "9px", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", borderBottom: "1px solid #e5e7eb" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[...snapsUpToPeriod].reverse().map((snap, ri) => {
                      const i = snapsUpToPeriod.length - 1 - ri;
                      const isLast = i === snapsUpToPeriod.length - 1;
                      const next = sorted[i + 1];
                      const sd = new Date(snap.from);
                      const dk = mkey(sd.getFullYear(), sd.getMonth());
                      const d = dolarMap[dk] || 1420;
                      const arsTotal = toARS(snap.payments, d);
                      let pct = null;
                      if (i > 0) {
                        const prev = sorted[i - 1];
                        const pd2 = new Date(prev.from);
                        const pk = mkey(pd2.getFullYear(), pd2.getMonth());
                        const pd = dolarMap[pk] || 1420;
                        const prevTotal = toARS(prev.payments, pd);
                        if (prevTotal > 0) pct = ((arsTotal - prevTotal) / prevTotal) * 100;
                      }
                      const period = next ? fDate(snap.from) + " - " + fDate(next.from) : fDate(snap.from) + " - Actual";
                      return (
                        <tr key={i} style={{ background: isLast ? "#eff6ff" : "white", borderBottom: "1px solid #f3f4f6" }}>
                          <td style={{ padding: "8px 10px", fontSize: "9px", color: "#6b7280", verticalAlign: "top" }}>
                            <div>{period}</div>
                            {snap.note && <div style={{ fontStyle: "italic", color: "#9ca3af", marginTop: "2px" }}>{snap.note}</div>}
                          </td>
                          <td style={{ padding: "8px 10px", verticalAlign: "top" }}>
                            <span style={{ background: "#e0e7ff", color: "#4338ca", padding: "2px 7px", borderRadius: "12px", fontSize: "9px", fontWeight: 600 }}>{snap.rank}</span>
                            {isLast && <span style={{ background: "#dbeafe", color: "#1d4ed8", padding: "2px 7px", borderRadius: "12px", fontSize: "9px", fontWeight: 600, marginLeft: "3px" }}>Actual</span>}
                          </td>
                          <td style={{ padding: "8px 10px", verticalAlign: "top" }}>
                            {PAYMENT_TYPES.filter(pt => snap.payments[pt] > 0).map(pt => {
                              const meta = PAYMENT_META[pt];
                              const val = snap.payments[pt];
                              const label = pt === "ARS" ? fARS(val) : "U$ " + val.toLocaleString("es-AR");
                              return <span key={pt} style={{ background: "#f1f5f9", border: "1px solid #cbd5e1", padding: "2px 6px", borderRadius: "12px", fontSize: "9px", display: "inline-block", margin: "1px" }}>{label}</span>;
                            })}
                          </td>
                          <td style={{ padding: "8px 10px", textAlign: "right", fontWeight: 700, fontSize: "11px", whiteSpace: "nowrap", verticalAlign: "top" }}>{fARS(arsTotal)}</td>
                          <td style={{ padding: "8px 10px", textAlign: "right", verticalAlign: "top" }}>
                            {pct != null
                              ? <span style={{ background: pct > 0 ? "#dcfce7" : "#fee2e2", color: pct > 0 ? "#15803d" : "#b91c1c", padding: "2px 7px", borderRadius: "12px", fontSize: "9px", fontWeight: 700 }}>{pct > 0 ? "+" : ""}{pct.toFixed(1)}%</span>
                              : <span style={{ color: "#9ca3af", fontSize: "9px" }}>Ingreso</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* footer */}
            <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "8px", display: "flex", justifyContent: "space-between", color: "#9ca3af", fontSize: "9px" }}>
              <span>KiSP Nomina — Historial salarial confidencial</span>
              <span>Generado el {today}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
