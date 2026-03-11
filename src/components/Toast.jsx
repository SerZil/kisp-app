export default function Toast({ msg, type }) {
  return (
    <div className={"fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-xl text-white text-sm font-semibold " + (type === "warn" ? "bg-amber-500" : "bg-emerald-600")}>
      {msg}
    </div>
  );
}
