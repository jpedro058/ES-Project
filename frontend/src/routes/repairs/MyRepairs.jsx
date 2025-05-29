import { useContext, useEffect, useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import Footer from "../../components/footer";
import Navbar from "../../components/navbar";
import RepairsTable from "../../components/repair/repairsTable";
import { AuthContext } from "../../context/AuthContext";

export default function MyRepairs() {
  const [repairs, setRepairs] = useState([]);
  const { currentUser } = useContext(AuthContext);
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const fetchRepairs = async () => {
      try {
        const response = await fetch(`/api/repairs?customer_id=${currentUser}`);
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
            <RepairsTable repairs={repairs} />
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
