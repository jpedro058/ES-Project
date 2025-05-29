import { useEffect, useState } from "react";
import bateria from "../../assets/bateria.png";
import brokenScreen from "../../assets/brokenScreen.png";
import software from "../../assets/software.png";
import virus from "../../assets/virus.png";
import Footer from "../../components/footer";
import Navbar from "../../components/navbar";

const servicesImg = [
  {
    img: brokenScreen,
  },
  {
    img: bateria,
  },
  {
    img: software,
  },
  {
    img: virus,
  },
];

export default function HomePage() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(
          "http://django-env.eba-gmvprtui.us-east-1.elasticbeanstalk.com/"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }
        const data = await response.json();
        setServices(data.services);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="bg-[#0F3D57] min-h-screen text-white font-sans">
      <Navbar />

      <section className="px-12 py-16 min-h-[calc(100vh-4rem)]">
        <h2 className="text-center text-5xl font-bold mb-14 text-[#00B8D9]">
          Our Services
        </h2>

        <div className="grid gap-10 grid-cols-1 md:grid-cols-2">
          {services.map((s, index) => (
            <a href={`/new-repair?type=${s.type}`} key={s.title}>
              <div className="bg-[#145374] cursor-pointer rounded-3xl p-8 shadow-xl hover:shadow-2xl transition duration-300 flex flex-col lg:flex-row items-center gap-6 hover:scale-[1.02]">
                <img
                  src={servicesImg[index].img}
                  alt={s.title}
                  className="h-65 rounded-xl 
              aspect-[1/1] object-cover object-center"
                />
                <div className="flex flex-col gap-8 ">
                  <h3 className="text-3xl font-semibold text-[#00B8D9]">
                    {s.title}
                  </h3>
                  <p className="text-xl text-slate-100 leading-8">{s.desc}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
