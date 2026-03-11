import React from "react";

export default function DateInput({ value, onChange, className }) {
  const [open, setOpen] = React.useState(false);
  const [view, setView] = React.useState(() => {
    if (value) { const [y,m] = value.split("-"); return { year: +y, month: +m - 1 }; }
    const n = new Date(); return { year: n.getFullYear(), month: n.getMonth() };
  });
  const ref = React.useRef(null);
  React.useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  const toDisplay = v => {
    if (!v) return "";
    const [y,m,d] = v.split("-");
    return `${d}/${m}/${y}`;
  };
  const MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  const DAYS = ["Lu","Ma","Mi","Ju","Vi","Sa","Do"];
  const firstDay = new Date(view.year, view.month, 1).getDay(); // 0=Sun
  const startOffset = (firstDay === 0 ? 6 : firstDay - 1); // Mon-based
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  const selDay = value ? +value.split("-")[2] : null;
  const selMon = value ? +value.split("-")[1] - 1 : null;
  const selYear = value ? +value.split("-")[0] : null;
  const prevMonth = () => setView(v => v.month === 0 ? {year: v.year-1, month: 11} : {year: v.year, month: v.month-1});
  const nextMonth = () => setView(v => v.month === 11 ? {year: v.year+1, month: 0} : {year: v.year, month: v.month+1});
  const pick = d => {
    if (!d) return;
    const mm = String(view.month+1).padStart(2,"0");
    const dd = String(d).padStart(2,"0");
    onChange(`${view.year}-${mm}-${dd}`);
    setOpen(false);
  };
  return (
    <div className="relative w-full" ref={ref}>
      <button type="button"
        onClick={() => setOpen(o => !o)}
        className={className + " w-full flex items-center justify-between bg-white cursor-pointer text-left"}
        style={{minHeight:"38px"}}>
        <span className={value ? "text-gray-800 text-sm" : "text-gray-400 text-sm"}>
          {value ? toDisplay(value) : "dd/mm/aaaa"}
        </span>
        <span className="text-gray-400 text-sm ml-2">📅</span>
      </button>
      {open && (
        <div className="absolute z-50 mt-1 bg-white rounded-xl shadow-2xl border border-gray-200 p-2" style={{left:0, top:"100%", width:"168px"}}>
          {/* Header */}
          <div className="flex items-center justify-between mb-1">
            <button type="button" onClick={prevMonth} className="w-5 h-5 rounded hover:bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs">‹</button>
            <span className="text-xs font-bold text-gray-800">{MONTHS[view.month].slice(0,3)} {view.year}</span>
            <button type="button" onClick={nextMonth} className="w-5 h-5 rounded hover:bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs">›</button>
          </div>
          {/* Day headers */}
          <div className="grid grid-cols-7 mb-0.5">
            {DAYS.map(d => <div key={d} className="text-center font-bold text-gray-400 py-0.5" style={{fontSize:"9px"}}>{d}</div>)}
          </div>
          {/* Cells */}
          <div className="grid grid-cols-7">
            {cells.map((d, i) => {
              const isSelected = d && d === selDay && view.month === selMon && view.year === selYear;
              const isToday = d && new Date().getDate() === d && new Date().getMonth() === view.month && new Date().getFullYear() === view.year;
              return (
                <button key={i} type="button" onClick={() => pick(d)}
                  disabled={!d}
                  className={"w-5 h-5 rounded text-center flex items-center justify-center mx-auto transition-colors " +
                    (isSelected ? "text-white font-bold" :
                     isToday ? "font-bold border border-green-400 text-green-700" :
                     d ? "text-gray-700 hover:bg-gray-100" : "")
                  }
                  style={{fontSize:"10px", ...(isSelected ? {background:"#0a4a3a"} : {})}}>
                  {d || ""}
                </button>
              );
            })}
          </div>
          {/* Clear */}
          {value && (
            <div className="mt-1 pt-1 border-t border-gray-100 text-center">
              <button type="button" onClick={() => { onChange(""); setOpen(false); }}
                className="text-gray-400 hover:text-red-500" style={{fontSize:"10px"}}>× Limpiar</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
