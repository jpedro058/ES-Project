import {
  CalendarClock,
  CheckCircle,
  Euro,
  FileText,
  Info,
  Laptop,
  UserCheck,
  Wrench,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AditionalCostModal from "../../components/aditionalCost";
import Footer from "../../components/footer";
import Navbar from "../../components/navbar";
import { RepairDetailCard } from "../../components/repair/repairDetailsCard";

const iconMap = {
  device: <Laptop />,
  service_type: <Wrench />,
  description: <FileText />,
  initial_cost: <Euro />,
  aditional_cost: <Euro />,
  appointment_date: <CalendarClock />,
  paid: <CheckCircle />,
  picked_up: <CheckCircle />,
  customer_showed_up: <UserCheck />,
};

export default function RepairDetailsAdmin() {
  const { repairId } = useParams();
  const [localRepair, setLocalRepair] = useState(null);
  const [showAditionalCostModal, setShowAditionalCostModal] = useState(false);
  const steps =
    localRepair?.status === "Lost"
      ? ["Scheduled", "Repairing", "Waiting Payment", "Waiting Pickup", "Lost"]
      : [
          "Scheduled",
          "Repairing",
          "Waiting Payment",
          "Waiting Pickup",
          "Finished",
        ];

  const getStatusColor = (step, currentStatus) => {
    const currentIndex = steps.indexOf(currentStatus);
    const stepIndex = steps.indexOf(step);

    if (currentStatus === "Finished") return "bg-green-400";
    if (currentStatus === "Lost") return "bg-red-400";
    if (stepIndex < currentIndex) return "bg-green-400";
    if (stepIndex === currentIndex) return "bg-yellow-400";
    return "bg-gray-400";
  };

  const formatValue = (key, value) => {
    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }
    if (typeof value === "object" && value !== null) {
      return JSON.stringify(value);
    }
    if (key.includes("cost")) {
      return `€${value}`;
    }
    if (key.includes("date")) {
      const date = new Date(value);
      return date.toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return value;
  };

  useEffect(() => {
    if (repairId) {
      fetchRepairById(repairId);
    }
  }, [repairId]);

  async function fetchRepairById(id) {
    const res = await fetch(`http://localhost:8000/repairs/${id}`);
    if (res.ok) {
      const data = await res.json();
      setLocalRepair(data.repair);
    }
  }

  async function handleAditionalCost(newValue) {
    try {
      const response = await fetch(
        `http://localhost:8000/admin/adcost/${localRepair.repair_id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            aditional_cost: newValue,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update repair");
      }
      await fetchRepairById(localRepair.repair_id);

      setShowAditionalCostModal(false);
    } catch (error) {
      console.error("Error updating repair:", error);
    }
  }

  if (!localRepair) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-white text-2xl">Loading...</p>
      </div>
    );
  }
  return (
    <div className="bg-[#0F3D57] text-white font-sans min-h-screen flex flex-col">
      <Navbar />

      <AditionalCostModal
        isOpen={showAditionalCostModal}
        onClose={() => setShowAditionalCostModal(false)}
        currentValue={localRepair.aditional_cost || 0}
        onConfirm={handleAditionalCost}
      />

      <main className="flex-grow px-6 md:px-12 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#00B8D9] mb-10">
            Repair Details
          </h2>
        </div>

        <div className="bg-[#1A4D6D] p-6 shadow-lg min-h-35 rounded-full">
          <div className="flex items-center space-x-2 md:space-x-4">
            {steps.map((step, index) => (
              <React.Fragment key={step}>
                <div className="flex flex-col justify-between items-center relative">
                  <div
                    className={`capitalize w-6 h-6 md:w-30 md:h-30 rounded-full flex justify-center items-center ${getStatusColor(
                      step,
                      localRepair.status
                    )}`}
                  >
                    <span className="text-[10px] font-bold text-center text-zinc-800">
                      {step}
                    </span>
                  </div>
                </div>
                {index !== steps.length - 1 && (
                  <div className="h-1 w-full rounded-full bg-white" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-9">
          {Object.entries(localRepair).map(([key, value]) => {
            if (
              [
                "repair_id",
                "status",
                "user_id",
                "updated_at",
                "created_at",
              ].includes(key)
            )
              return null;

            const formattedKey = key
              .replace(/_/g, " ")
              .replace(/([a-z])([A-Z])/g, "$1 $2")
              .replace(/\b\w/g, (l) => l.toUpperCase());

            const icon = iconMap[key] || (
              <Info className="w-6 h-6 text-cyan-400 flex-shrink-0" />
            );

            const isClickableAditionalCost =
              key === "aditional_cost" &&
              !localRepair.paid &&
              !localRepair.picked_up &&
              !localRepair.status.includes("Finished") &&
              !localRepair.status.includes("Lost") &&
              localRepair.status !== "Waiting Pickup";

            return (
              <RepairDetailCard
                key={key}
                label={formattedKey}
                value={formatValue(key, value)}
                icon={icon}
                clickable={isClickableAditionalCost}
                onClick={() => {
                  if (isClickableAditionalCost) {
                    setShowAditionalCostModal(true);
                  }
                }}
              />
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
