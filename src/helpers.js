import { AVATAR_COLORS, RANK_COLORS } from "./constants";

export function mkey(y, m) {
  return y + "-" + String(m + 1).padStart(2, "0");
}

export function isActiveInMonth(emp, y, m) {
  const first = mkey(y, m) + "-01";
  const last  = mkey(y, m) + "-31";
  if (emp.activeFrom > last) return false;
  if (emp.activeTo && emp.activeTo < first) return false;
  return true;
}

export function snapshotAt(emp, dateStr) {
  const sorted = [...emp.history].sort((a, b) => a.from.localeCompare(b.from));
  let snap = sorted[0];
  for (const s of sorted) { if (s.from <= dateStr) snap = s; }
  return snap;
}

export function toARS(pay, d) {
  let t = 0;
  if (pay.ARS)        t += pay.ARS;
  if (pay.Crypto)     t += pay.Crypto     * d;
  if (pay.Canada)     t += pay.Canada     * d;
  if (pay.Healthcare) t += pay.Healthcare * d;
  if (pay.Allowance)  t += pay.Allowance  * d;
  if (pay.Cash2)      t += pay.Cash2      * d;
  if (pay.Bonus)      t += pay.Bonus      * d;
  if (pay.Mono)       t += pay.Mono;
  return t;
}

// Costo real empleador: aplica carga social solo sobre componente ARS
export function toCosto(pay, d, cargaPct) {
  let t = 0;
  if (pay.ARS)        t += pay.ARS * (1 + cargaPct / 100);
  if (pay.Crypto)     t += pay.Crypto     * d;
  if (pay.Canada)     t += pay.Canada     * d;
  if (pay.Healthcare) t += pay.Healthcare * d;
  if (pay.Allowance)  t += pay.Allowance  * d;
  if (pay.Cash2)      t += pay.Cash2      * d;
  if (pay.Bonus)      t += pay.Bonus      * d;
  if (pay.Mono)       t += pay.Mono;
  return t;
}

export const fARS = n => new Intl.NumberFormat("es-AR", { style:"currency", currency:"ARS", maximumFractionDigits:0 }).format(n);
export const fUSD = n => "U$ " + new Intl.NumberFormat("es-AR", { maximumFractionDigits:0 }).format(n);
export const initials = n => n.split(" ").map(x => x[0]).join("").substring(0, 2).toUpperCase();
export const avatarColor = id => AVATAR_COLORS[id % AVATAR_COLORS.length];
export const rankColor = (rank, ranks) => { const i = ranks.indexOf(rank); return i >= 0 ? RANK_COLORS[i % RANK_COLORS.length] : "bg-gray-100 text-gray-600"; };
export const fDate = d => {
  if (!d) return "";
  const parts = d.split("-");
  if (parts.length === 3) return parts[2] + "/" + parts[1] + "/" + parts[0];
  if (parts.length === 2) return parts[1] + "/" + parts[0];
  return d;
};
