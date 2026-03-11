import { useState, useRef } from "react";

export default function Select({ value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);
  const prevOptions = useRef(options);
  if (prevOptions.current !== options) {
    prevOptions.current = options;
    if (open) setOpen(false);
  }
  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen(o => !o)}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-left bg-white flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-gray-300">
        <span className={value ? "text-gray-800" : "text-gray-400"}>{value || placeholder}</span>
        <span className="text-gray-400 text-xs ml-2">{open ? "^" : "v"}</span>
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl max-h-52 overflow-y-auto">
          <button type="button" onClick={() => { onChange("All"); setOpen(false); }}
            className={"w-full text-left px-3 py-2 text-sm hover:bg-gray-50 " + (!value ? "bg-gray-50 text-gray-500 font-semibold" : "text-gray-400")}>
            {placeholder}
          </button>
          {options.filter(opt => opt !== "All").map(opt => (
            <button key={opt} type="button" onClick={() => { onChange(opt); setOpen(false); }}
              className={"w-full text-left px-3 py-2 text-sm hover:bg-blue-50 " + (value === opt ? "bg-blue-50 text-blue-700 font-semibold" : "text-gray-700")}>
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
