import { useEffect, useState } from "react";
import Footer from "../../components/footer";
import Navbar from "../../components/navbar";
import RepairsTable from "../../components/repair/repairsTable";

export default function Admin() {
  const [repairs, setRepairs] = useState([]);
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const fetchRepairs = async () => {
      try {
        const response = await fetch("/api/repairs");
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

  function handleCostumerShows(repair) {
    const updatedRepair = async () => {
      try {
        const response = await fetch(
          `/api/admin/picked-up/${repair.repair_id}/`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to update repair");
        }
        setRepairs((prevRepairs) =>
          prevRepairs.map((r) =>
            r.repair_id === repair.repair_id ? { ...r, picked_up: true } : r
          )
        );
      } catch (error) {
        console.error("Error updating repair:", error);
      }
    };
    updatedRepair();
  }

  function handleCostumerShowedUp(repair) {
    const updatedRepair = async () => {
      try {
        const response = await fetch(
          `/api/admin/showed-up/${repair.repair_id}/`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to update repair");
        }
        setRepairs((prevRepairs) =>
          prevRepairs.map((r) =>
            r.repair_id === repair.repair_id
              ? { ...r, customer_showed_up: true }
              : r
          )
        );
      } catch (error) {
        console.error("Error updating repair:", error);
      }
    };
    updatedRepair();
  }

  return (
    <div className="bg-[#0F3D57] text-white font-sans min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow px-6 md:px-12 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#00B8D9] mb-10">
            Admin Board
          </h2>
        </div>
        {repairs.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-[#1F5F77]">
            <RepairsTable
              repairs={repairs}
              isAdmin
              onShowedUp={handleCostumerShowedUp}
              onPickedUp={handleCostumerShows}
            />
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
