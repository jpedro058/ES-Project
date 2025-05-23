export function RepairDetailCard({ label, value, icon, onClick, clickable }) {
  return (
    <div
      className={`bg-[#123C55] p-5 rounded-2xl shadow-md border border-cyan-700 hover:shadow-lg transition duration-300 ${
        clickable ? "cursor-pointer hover:border-yellow-500" : ""
      }`}
      onClick={onClick}
      tabIndex={clickable ? 0 : -1}
      onKeyDown={(e) => {
        if (clickable && (e.key === "Enter" || e.key === " ")) {
          onClick();
        }
      }}
    >
      <div className="flex items-center mb-2 gap-2 text-cyan-300 font-semibold text-xl">
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-white text-lg font-medium">{value}</div>
    </div>
  );
}
