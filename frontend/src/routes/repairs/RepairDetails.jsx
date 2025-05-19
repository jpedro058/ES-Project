import React from "react";
import Footer from "../../components/footer";
import Navbar from "../../components/navbar";
import { useLocation } from "react-router-dom";

import {
  Wrench,
  Laptop,
  FileText,
  Euro,
  Info,
  CalendarClock,
  UserCheck,
  CheckCircle,
} from "lucide-react";

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

export default function RepairDetails() {
  const location = useLocation();
  const repair = location.state?.repair;

  const steps =
    repair.status === "Lost"
      ? ["Scheduled", "Waiting Payment", "Lost"]
      : ["Scheduled", "Waiting Payment", "Finished"];

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

  return (
    <div className="bg-[#0F3D57] text-white font-sans min-h-screen flex flex-col">
      <Navbar />

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
                      repair.status
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
          {Object.entries(repair).map(([key, value]) => {
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

            return (
              <div
                key={key}
                className="bg-[#123C55] p-5 rounded-2xl shadow-md border border-cyan-700 hover:shadow-lg transition duration-300"
              >
                <div className="flex items-center mb-2 gap-2 text-cyan-300 font-semibold text-xl">
                  {icon}
                  <span>{formattedKey}</span>
                </div>
                <div className="text-white text-lg font-medium">
                  {formatValue(key, value)}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
