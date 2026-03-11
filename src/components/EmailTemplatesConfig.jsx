import React from "react";

export default function EmailTemplatesConfig({ emailTemplates, setEmailTemplates, fillTemplate }) {
  const [expanded, setExpanded] = React.useState({});
  const labels = { salesSupport: "Sales Support → Antonella", cad: "CAD → Mariela, Andrea, Silvana", crypto: "Crypto payment → Mary, Eliana, Rob", monotributo: "Monotributo → Ezequiel", dependencia: "Relación de Dependencia → Ezequiel", cash2Change: "Cash 2 change → Ezequiel + Rob", bonusChange: "Bonus change → Ezequiel + Rob" };
  const colors = { salesSupport: "#7e22ce", cad: "#1d4ed8", crypto: "#b45309", monotributo: "#166534", dependencia: "#15803d", cash2Change: "#0e7490", bonusChange: "#be185d" };
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2" style={{background:"#f0faf5"}}>
        <span className="text-base">✉️</span>
        <span className="font-bold text-sm" style={{color:"#0a4a3a"}}>Email Templates — Onboarding</span>
        <span className="text-xs text-gray-400 ml-2">Se disparan automáticamente al agregar un empleado</span>
      </div>
      <div className="divide-y divide-gray-100">
        {Object.entries(emailTemplates).map(([key, tmpl]) => {
          const isOpen = !!expanded[key];
          const color = colors[key] || "#6b7280";
          return (
            <div key={key}>
              {/* Collapsed row */}
              <div
                className="flex items-center gap-2 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpanded(p => ({ ...p, [key]: !p[key] }))}>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold shrink-0"
                  style={{background: color+'18', color, fontSize:"10px"}}>{labels[key] || key}</span>
                <span className="text-xs text-gray-300 shrink-0">{isOpen ? '▲' : '▼'}</span>
              </div>
              {/* Expanded editor */}
              {isOpen && (
                <div className="px-4 pb-4 space-y-3 bg-gray-50 border-t border-gray-100">
                  <div className="space-y-3 pt-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-1">To</label>
                      <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-400 bg-white"
                        value={tmpl.to}
                        onChange={e => setEmailTemplates(p => ({ ...p, [key]: { ...p[key], to: e.target.value } }))} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-1">CC</label>
                      <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-400 bg-white"
                        value={tmpl.cc}
                        onChange={e => setEmailTemplates(p => ({ ...p, [key]: { ...p[key], cc: e.target.value } }))} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Subject</label>
                    <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-400 bg-white"
                      value={tmpl.subject}
                      onChange={e => setEmailTemplates(p => ({ ...p, [key]: { ...p[key], subject: e.target.value } }))} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Body</label>
                    <textarea rows={6} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-400 font-mono resize-y bg-white"
                      value={tmpl.body}
                      onChange={e => setEmailTemplates(p => ({ ...p, [key]: { ...p[key], body: e.target.value } }))} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
