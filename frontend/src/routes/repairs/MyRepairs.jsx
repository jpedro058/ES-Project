import Footer from "../../components/footer";
import Navbar from "../../components/navbar";
import { IoIosAddCircleOutline } from "react-icons/io";

export default function MyRepairs() {
  const repairs = [
    {
      id: 1,
      date: "2023-10-01",
      type: "Screen Replacement",
      status: "On going",
    },
    {
      id: 2,
      date: "2023-09-15",
      type: "Battery Replacement",
      status: "Finished",
    },
    {
      id: 3,
      date: "2023-08-20",
      type: "Software Issues",
      status: "Cancelled",
    },
  ];

  const repairStatus = {
    "On going": (
      <span className="inline-block px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-300 text-xs font-medium">
        On going
      </span>
    ),
    Finished: (
      <span className="inline-block px-3 py-1 rounded-full bg-green-400/20 text-green-300 text-xs font-medium">
        Finished
      </span>
    ),
    Cancelled: (
      <span className="inline-block px-3 py-1 rounded-full bg-red-400/20 text-red-300 text-xs font-medium">
        Cancelled
      </span>
    ),
  };

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

        <div className="overflow-x-auto rounded-lg border border-[#1F5F77]">
          <table className="min-w-full table-auto text-sm md:text-base">
            <thead className="bg-[#1A4E6A] text-[#00B8D9] uppercase text-left">
              <tr>
                <th className="py-4 px-6 font-semibold">ID</th>
                <th className="py-4 px-6 font-semibold">Date</th>
                <th className="py-4 px-6 font-semibold">Type</th>
                <th className="py-4 px-10 font-semibold">State</th>
                <th className="py-4 px-6 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F5F77]">
              {repairs.map((repair) => (
                <tr
                  key={repair.id}
                  className="hover:bg-[#1C5473] transition-colors"
                >
                  <td className="py-4 px-6">{repair.id}</td>
                  <td className="py-4 px-6">{repair.date}</td>
                  <td className="py-4 px-6">{repair.type}</td>
                  <td className="py-4 px-6">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium">
                      {repairStatus[repair.status]}
                    </span>
                  </td>
                  <td className="py-4 px-6 space-x-5">
                    <a
                      href={`/repair/${repair.id}`}
                      className="text-[#00B8D9] hover:text-white hover:underline transition"
                    >
                      Remove
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <Footer />
    </div>
  );
}
