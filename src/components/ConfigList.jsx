import { useState } from "react";

export default function ConfigList({ title, icon, items, onUpdate, usedCount, readOnly }) {
  const [editing, setEditing] = useState(null);
  const [editVal, setEditVal] = useState("");
  const [adding, setAdding]   = useState(false);
  const [newVal, setNewVal]   = useState("");
  const [confirm, setConfirm] = useState(null);

  function startEdit(i) { setEditing(i); setEditVal(items[i]); setConfirm(null); }
  function saveEdit(i) {
    const v = editVal.trim();
    if (!v || items.some((x, j) => x === v && j !== i)) { setEditing(null); return; }
    const u = [...items]; u[i] = v;
    onUpdate(u, items[i], v);
    setEditing(null);
  }
  function del(i) { onUpdate(items.filter((_, j) => j !== i), items[i], null); setConfirm(null); }
  function add() {
    const v = newVal.trim();
    if (!v || items.includes(v)) return;
    onUpdate([...items, v], null, v);
    setNewVal(""); setAdding(false);
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <div>
            <div className="font-bold text-gray-800">{title}</div>
            <div className="text-xs text-gray-400">{items.length} en total</div>
          </div>
        </div>
        {!readOnly && <button onClick={() => { setAdding(true); setEditing(null); setConfirm(null); }}
          className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700">
          + Agregar
        </button>}
      </div>
      {!readOnly && adding && (
        <div className="px-5 py-3 bg-blue-50 border-b border-blue-200 flex gap-2 items-center">
          <input autoFocus className="flex-1 border border-blue-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none"
            placeholder="Nombre..." value={newVal} onChange={e => setNewVal(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") add(); if (e.key === "Escape") { setAdding(false); setNewVal(""); } }} />
          <button onClick={add} className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold">ok</button>
          <button onClick={() => { setAdding(false); setNewVal(""); }} className="px-3 py-2 text-gray-500 text-sm">x</button>
        </div>
      )}
      <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto">
        {items.map((item, i) => {
          const cnt = usedCount(item);
          return (
            <div key={i} className="px-5 py-2.5 flex items-center gap-3 hover:bg-gray-50 group">
              {editing === i ? (
                <>
                  <input autoFocus className="flex-1 border border-blue-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none"
                    value={editVal} onChange={e => setEditVal(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") saveEdit(i); if (e.key === "Escape") setEditing(null); }} />
                  <button onClick={() => saveEdit(i)} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold">ok</button>
                  <button onClick={() => setEditing(null)} className="px-2 text-gray-400 text-xs">x</button>
                </>
              ) : confirm === i ? (
                <>
                  <span className="flex-1 text-sm text-red-600 font-medium">Eliminar <strong>{item}</strong>?{cnt > 0 ? " (" + cnt + " asignados)" : ""}</span>
                  <button onClick={() => del(i)} className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-bold">Eliminar</button>
                  <button onClick={() => setConfirm(null)} className="px-2 text-gray-400 text-xs">x</button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-sm text-gray-700 font-medium">{item}</span>
                  {cnt > 0 && <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{cnt}</span>}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => startEdit(i)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 text-sm">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button onClick={() => setConfirm(i)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 text-sm">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
