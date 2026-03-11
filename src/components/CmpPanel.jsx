import { MONTHS } from "../constants";
import { toARS, initials, avatarColor } from "../helpers";

export default function CmpPanel({ emp, search, setSearch, setEmp, label, allEmps, dolar, month, year }) {
  const PAY_LABELS = { ARS:'ARS', Crypto:'Crypto USD', Canada:'Canada USD', Healthcare:'Healthcare USD', Allowance:'Allowance USD', Cash2:'Cash 2 USD', Bonus:'Bonus USD', Monotributo:'Monotributo ARS' };
  const types = ['ARS','Crypto','Canada','Healthcare','Allowance','Cash2','Bonus','Monotributo'];
  const results = search.length >= 2
    ? allEmps.filter(e => e.name.toLowerCase().includes(search.toLowerCase())).slice(0, 8)
    : [];
  const total = emp ? toARS(emp.payments, dolar) : 0;
  const usd   = dolar > 0 && total > 0 ? total / dolar : 0;
  const payments = emp ? emp.payments : {};
  const fARS2 = v => '$' + Math.round(v).toLocaleString('es-AR');
  const fUSD2 = v => 'U$' + v.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return (
    <div className="flex-1 min-w-0 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
      <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between" style={{background:"#f0faf5"}}>
        <span className="text-xs font-bold uppercase tracking-wide" style={{color:"#0a4a3a"}}>{label}</span>
        {emp && <button onClick={() => { setEmp(null); setSearch(""); }} className="text-xs text-gray-400 hover:text-gray-600 px-2 py-0.5 rounded-lg hover:bg-gray-100">× Cambiar</button>}
      </div>
      {!emp ? (
        <div className="p-4 flex-1">
          <input
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-400 mb-3"
            placeholder="Buscar por nombre..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoComplete="off"
          />
          {results.length > 0 && (
            <div className="space-y-1">
              {results.map(e => (
                <div key={e.id} onClick={() => { setEmp(e); setSearch(""); }}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 cursor-pointer border border-transparent hover:border-gray-200">
                  <div className={"w-8 h-8 " + avatarColor(e.id) + " rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0"}>
                    {initials(e.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-800 truncate">{e.name}</div>
                    <div className="text-xs text-gray-400">{e.rank} · {e.area}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {search.length >= 2 && results.length === 0 && <div className="text-sm text-gray-400 text-center py-6">Sin resultados</div>}
          {search.length < 2 && <div className="text-sm text-gray-300 text-center py-8">Escribí al menos 2 letras</div>}
        </div>
      ) : (
        <div className="p-4 flex-1 space-y-4">
          <div className="flex items-center gap-3">
            <div className={"w-12 h-12 " + avatarColor(emp.id) + " rounded-2xl flex items-center justify-center text-white text-lg font-bold shrink-0"}>{initials(emp.name)}</div>
            <div className="flex-1 min-w-0">
              <div className="font-black text-gray-900 truncate">{emp.name}</div>
              <div className="text-xs text-gray-500">{emp.rank}</div>
              <div className="flex gap-1.5 mt-1 flex-wrap">
                {emp.area && <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-semibold">{emp.area}</span>}
                {emp.team && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{emp.team}</span>}
              </div>
            </div>
          </div>
          <div className="rounded-xl p-3 border border-gray-100" style={{background:"#f0faf5"}}>
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total · {MONTHS[month]} {year}</div>
            <div className="text-2xl font-black text-gray-900">{fARS2(total)}</div>
            {dolar > 0 && <div className="text-sm font-semibold text-gray-500 mt-0.5">{fUSD2(usd)}</div>}
          </div>
          <div className="space-y-1.5">
            {types.filter(t => payments[t]).map(t => {
              const isUSD = t !== 'ARS' && t !== 'Monotributo';
              const raw = payments[t];
              const inARS = isUSD ? raw * dolar : raw;
              return (
                <div key={t} className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{PAY_LABELS[t]}</span>
                  <div className="text-right">
                    <span className="font-semibold text-gray-800">{isUSD ? fUSD2(raw) : fARS2(raw)}</span>
                    {isUSD && dolar > 0 && <span className="text-xs text-gray-400 ml-1">({fARS2(inARS)})</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
