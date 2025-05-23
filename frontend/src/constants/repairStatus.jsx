export default function StatusBadge({ status }) {
  const statusMap = {
    Scheduled: "bg-cyan-400/20 text-cyan-300",
    Repairing: "bg-purple-400/20 text-purple-400",
    "Waiting Payment": "bg-yellow-400/20 text-yellow-300",
    "Waiting Pickup": "bg-yellow-400/20 text-amber-600",
    Lost: "bg-red-400/20 text-red-300",
    Finished: "bg-green-400/20 text-green-300",
  };

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
        statusMap[status] || ""
      }`}
    >
      {status}
    </span>
  );
}
