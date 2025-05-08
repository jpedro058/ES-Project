import Footer from "../../components/footer";
import Navbar from "../../components/navbar";
import { IoIosSave } from "react-icons/io";
import Select from "../../components/select";
import SelectComponent from "../../components/select";

import { useLocation } from "react-router-dom";
import { useMemo } from "react";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function NewRepair() {
  const deviceOptions = [
    { value: "laptop", label: "Laptop" },
    { value: "desktop", label: "Desktop" },
    { value: "tablet", label: "Tablet" },
    { value: "phone", label: "Phone" },
  ];

  const servicesOptions = [
    { value: "screen-replacement", label: "Screen Replacement" },
    { value: "battery-replacement", label: "Batery Replacement" },
    { value: "software-issues", label: "Software Issues" },
    { value: "virus-removal", label: "Virus Removal" },
  ];

  const query = useQuery();
  const selectedType = query.get("type");

  const defaultServiceOption = servicesOptions.find(
    (opt) => opt.value === selectedType
  );

  return (
    <div className="bg-[#0F3D57] text-white font-sans min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow px-6 md:px-12 py-16">
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#00B8D9] mb-10">
          New Repair
        </h2>

        <form
          className="bg-[#145374] p-8 rounded-lg shadow-lg max-w-2xl mx-auto space-y-6"
          onSubmit={(e) => e.preventDefault()}
        >
          <div>
            <label className="block text-md font-medium mb-2" htmlFor="client">
              Client
            </label>
            <input
              type="text"
              id="client"
              className="w-full px-4 py-2 bg-[#0F3D57] border border-[#1F5F77] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B8D9]"
              placeholder="Client's name"
              required
            />
          </div>

          <div>
            <label className="block text-md font-medium mb-2" htmlFor="device">
              Device
            </label>
            <SelectComponent options={deviceOptions} required />
          </div>

          <div>
            <label className="block text-md font-medium mb-2" htmlFor="device">
              Service Type
            </label>
            <SelectComponent
              options={servicesOptions}
              defaultValue={defaultServiceOption}
              required
            />
          </div>

          <div>
            <label className="block text-md font-medium mb-2" htmlFor="issue">
              Issue Description
            </label>
            <textarea
              id="issue"
              rows={4}
              className="w-full px-4 py-2 bg-[#0F3D57] border border-[#1F5F77] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B8D9]"
              placeholder="Describe the problem with the device..."
              required
            />
          </div>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-[#00B8D9] text-[#0F3D57] font-semibold px-6 py-3 rounded-lg hover:bg-[#00a0c0] transition cursor-pointer"
          >
            <IoIosSave size={20} />
            Save Repair
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
}
