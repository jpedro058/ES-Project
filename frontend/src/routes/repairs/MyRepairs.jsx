import { useContext, useEffect, useState } from "react";
import Footer from "../../components/footer";
import Navbar from "../../components/navbar";
import { IoIosAddCircleOutline } from "react-icons/io";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const repairStatus = {
	Scheduled: (
		<span className="inline-block px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-300 text-xs font-medium">
			Scheduled
		</span>
	),
	Repairing: (
		<span className="inline-block px-3 py-1 rounded-full bg-purple-400/20 text-purple-400 text-xs font-medium">
			Repairing
		</span>
	),
	"Waiting Payment": (
		<span className="inline-block px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-300 text-xs font-medium">
			Waiting Payment
		</span>
	),
	"Waiting Pickup": (
		<span className="inline-block px-3 py-1 rounded-full bg-yellow-400/20 text-amber-600 text-xs font-medium">
			Waiting Pickup
		</span>
	),
	Lost: (
		<span className="inline-block px-3 py-1 rounded-full bg-red-400/20 text-red-300 text-xs font-medium">
			Lost
		</span>
	),
	Finished: (
		<span className="inline-block px-3 py-1 rounded-full bg-green-400/20 text-green-300 text-xs font-medium">
			Finished
		</span>
	),
};

export default function MyRepairs() {
	const [repairs, setRepairs] = useState([]);
	const { currentUser } = useContext(AuthContext);
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const fetchRepairs = async () => {
			try {
				const response = await fetch(
					`http://localhost:8000/repairs?customer_id=${currentUser}`
				);
				if (!response.ok) {
					throw new Error("Failed to fetch repairs");
				}
				const data = await response.json();
				setRepairs(data.repairs);
			} catch (error) {
				console.error("Error fetching repairs:", error);
			}
		};

		fetchRepairs();
	}, [setRepairs]);

	return (
		<div className="bg-[#0F3D57] text-white font-sans min-h-screen flex flex-col">
			<Navbar />

			<main className="flex-grow px-6 md:px-12 py-16">
				<div className="flex items-center justify-between mb-8">
					<h2 className="text-4xl md:text-5xl font-extrabold text-[#00B8D9] mb-10">
						My repairs
					</h2>

					<a
						href="/new-repair"
						className="text-[#00B8D9] hover:text-white transition"
					>
						<IoIosAddCircleOutline size={60} />
					</a>
				</div>
				{repairs.length > 0 ? (
					<div className="overflow-x-auto rounded-lg border border-[#1F5F77]">
						<table className="min-w-full table-auto text-sm md:text-base">
							<thead className="bg-[#1A4E6A] text-[#00B8D9] uppercase text-left">
								<tr>
									<th className="py-4 px-6 font-semibold">ID</th>
									<th className="py-4 px-6 font-semibold">Device</th>
									<th className="py-4 px-6 font-semibold">Type</th>
									<th className="py-4 px-10 font-semibold">State</th>
									<th className="py-4 px-6 font-semibold">Actions</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-[#1F5F77]">
								{repairs.length > 0 ? (
									repairs.map((repair, index) => (
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
														{repairStatus[repair.status]}
													</span>
												</Link>
											</td>
											<td className="py-4 px-6 space-x-5">
												<Link
													to={`/repair-details/${repair.repair_id}`}
													state={{ repair }}
													className="hover:text-[#00B8D9] hover:underline transition duration-300 ease-out"
												>
													Details
												</Link>
											</td>
										</tr>
									))
								) : (
									<div className="py-4 px-6 text-center" />
								)}
							</tbody>
						</table>
					</div>
				) : (
					<div className="py-4">
						<p className="text-2xl">No repairs found.</p>
					</div>
				)}
			</main>

			<Footer />
		</div>
	);
}
