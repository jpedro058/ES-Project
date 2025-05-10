import brokenScreen from "../../assets/brokenScreen.png";
import bateria from "../../assets/bateria.png";
import software from "../../assets/software.png";
import virus from "../../assets/virus.png";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";

export default function HomePage() {
  const services = [
    {
      title: "Screen Replacement",
      type: "screen-replacement",
      desc: "Is your device's screen broken, scratched or unresponsive to touch? Our specialized team will replace it with high-quality parts, guaranteeing the integrity and original sensitivity of the screen. Fast and guaranteed service.",
      img: brokenScreen,
    },
    {
      title: "Battery Replacement",
      type: "battery-replacement",
      desc: "Do you notice that your device discharges quickly or shuts down unexpectedly? We'll replace the battery with a new one, with guaranteed performance and certified compatibility, so you can once again rely on your device's autonomy.",
      img: bateria,
    },
    {
      title: "Software Issues",
      type: "software-issues",
      desc: "Is your computer slow, does it constantly show errors or doesn't boot up properly? We carry out a complete analysis of the operating system and installed software, resolve conflicts, optimize performance and guarantee smooth and safe use.",
      img: software,
    },
    {
      title: "Virus Removal",
      type: "virus-removal",
      desc: "Have you detected strange behavior, pop-ups or suspicious files on your system? We use advanced tools to remove viruses, malware and spyware, restoring security and stability to your device without compromising your data.",
      img: virus,
    },
  ];

  //Use this to fetch data from the backend
  /* useEffect(() => {
		let response;
		fetch("http://localhost:8000/api/shop/")
			.then((res) => res.json())
			.then((data) => {
				response = data;
				console.log("Shop data:", response);
			})
			.catch((err) => {
				console.error("Error fetching shop data:", err);
			});
	}, []); */

  return (
    <div className="bg-[#0F3D57] min-h-screen text-white font-sans">
      <Navbar />

      <section className="px-12 py-16 min-h-[calc(100vh-4rem)]">
        <h2 className="text-center text-5xl font-bold mb-14 text-[#00B8D9]">
          Our Services
        </h2>

        <div className="grid gap-10 grid-cols-1 md:grid-cols-2">
          {services.map((s) => (
            <a href={`/new-repair?type=${s.type}`} key={s.title}>
              <div className="bg-[#145374] cursor-pointer rounded-3xl p-8 shadow-xl hover:shadow-2xl transition duration-300 flex flex-col lg:flex-row items-center gap-6 hover:scale-[1.02]">
                <img
                  src={s.img}
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
