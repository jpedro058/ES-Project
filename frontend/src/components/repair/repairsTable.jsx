import { Link } from "react-router-dom";
import { Check, XIcon } from "lucide-react";
import StatusBadge from "../../constants/repairStatus";

export default function RepairsTable({
	repairs,
	isAdmin = false,
	onShowedUp,
	onPickedUp,
}) {
	return (
		<div className="overflow-x-auto rounded-lg border border-[#1F5F77]">
			<table className="min-w-full table-auto text-sm md:text-base">
				<thead className="bg-[#1A4E6A] text-[#00B8D9] uppercase text-left">
					<tr>
						<th className="py-4 px-6 font-semibold">ID</th>
						<th className="py-4 px-6 font-semibold">Device</th>
						<th className="py-4 px-6 font-semibold">Type</th>
						<th className="py-4 px-10 font-semibold">State</th>
						{isAdmin && (
							<>
								<th className="py-4 px-10 font-semibold">Paid</th>
								<th className="py-4 px-10 font-semibold">Showed Up</th>
								<th className="py-4 px-10 font-semibold">Picked Up</th>
							</>
						)}
						<th className="py-4 px-6 font-semibold">Actions</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-[#1F5F77]">
					{repairs.map((repair, index) => (
						<tr
							key={repair.repair_id}
							className="hover:bg-[#1C5473] transition-colors"
						>
							<td className="py-4 px-6">{index + 1}</td>
							<td className="py-4 px-6">{repair.device}</td>
							<td className="py-4 px-6">{repair.service_type}</td>
							<td className="py-4 px-6">
								<Link
									to={`/repair-details/${repair.repair_id}`}
									state={{ repair }}
								>
									<span className="inline-block px-3 py-1 rounded-full text-xs font-medium">
										<StatusBadge status={repair.status} />
									</span>
								</Link>
							</td>

							{isAdmin && (
								<>
									<td className="py-4 px-6">
										{repair.paid ? (
											<Check className="w-6 h-6 text-green-400" />
										) : (
											<span className="text-red-400">Not paid</span>
										)}
									</td>
									<td className="py-4 px-12">
										<button
											type="button"
											className={`text-[#00B8D9] hover:text-green-400 hover:underline transition ${
												repair.customer_showed_up || repair.status === "Lost"
													? "cursor-not-allowed"
													: "cursor-pointer"
											}`}
											disabled={
												repair.customer_showed_up || repair.status === "Lost"
											}
											onClick={() => onShowedUp?.(repair)}
										>
											{repair.customer_showed_up ? (
												<Check className="w-6 h-6 text-green-400" />
											) : repair.status === "Lost" ? (
												<XIcon className="w-6 h-6 text-red-400" />
											) : (
												"Confirm showed up"
											)}
										</button>
									</td>
									<td className="py-4 px-12">
										<button
											type="button"
											className={`text-[#00B8D9] hover:text-green-400 hover:underline transition ${
												repair.picked_up ||
												repair.status === "Lost" ||
												!repair.customer_showed_up ||
												!repair.paid
													? "cursor-not-allowed"
													: "cursor-pointer"
											}`}
											disabled={
												repair.picked_up ||
												repair.status === "Lost" ||
												!repair.customer_showed_up ||
												!repair.paid
											}
											onClick={() => onPickedUp?.(repair)}
										>
											{repair.picked_up ? (
												<Check className="w-6 h-6 text-green-400" />
											) : repair.status === "Lost" ? (
												<XIcon className="w-6 h-6 text-red-400" />
											) : !repair.paid || !repair.customer_showed_up ? (
												<span className="text-red-400">Payment required</span>
											) : (
												"Confirm pickup"
											)}
										</button>
									</td>
								</>
							)}
							<td className="py-4 px-6 space-x-5">
								<Link
									to={
										isAdmin
											? `/repair-details-admin/${repair.repair_id}`
											: `/repair-details/${repair.repair_id}`
									}
									state={isAdmin ? { repair, fromAdmin: true } : { repair }}
									className="hover:text-[#00B8D9] hover:underline transition"
								>
									Details
								</Link>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
