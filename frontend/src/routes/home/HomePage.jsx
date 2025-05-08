import brokenScreen from "../../assets/brokenScreen.png";
import bateria from "../../assets/bateria.png";
import software from "../../assets/software.png";
import virus from "../../assets/virus.png";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import { useEffect } from "react";

export default function HomePage() {
	const services = [
		{
			title: "Substituição de Ecrã",
			type: "screen-replacement",
			desc: "O ecrã do seu dispositivo está partido, riscado ou sem resposta ao toque? A nossa equipa especializada realiza a substituição com peças de alta qualidade, garantindo a integridade e a sensibilidade original do ecrã. Serviço rápido e com garantia.",
			img: brokenScreen,
		},
		{
			title: "Troca de Bateria",
			type: "battery-replacement",
			desc: "Nota que o seu dispositivo descarrega rapidamente ou desliga-se inesperadamente? Efetuamos a substituição da bateria por uma nova, com desempenho garantido e compatibilidade certificada, para que possa voltar a confiar na autonomia do seu equipamento.",
			img: bateria,
		},
		{
			title: "Problemas de Software",
			type: "software-issues",
			desc: "O seu computador está lento, apresenta erros constantes ou não arranca corretamente? Fazemos uma análise completa do sistema operativo e software instalado, solucionamos conflitos, otimizamos o desempenho e garantimos uma utilização fluida e segura.",
			img: software,
		},
		{
			title: "Remoção de Vírus",
			type: "virus-removal",
			desc: "Detetou comportamentos estranhos, pop-ups ou ficheiros suspeitos no seu sistema? Utilizamos ferramentas avançadas para remover vírus, malware e spyware, restaurando a segurança e a estabilidade do seu dispositivo sem comprometer os seus dados.",
			img: virus,
		},
	];
	useEffect(() => {
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
	}, []);
	return (
		<div className="bg-[#0F3D57] min-h-screen text-white font-sans">
			<Navbar />

			<section className="px-12 py-16 min-h-[calc(100vh-4rem)]">
				<h2 className="text-center text-5xl font-bold mb-14 text-[#00B8D9]">
					Os nossos serviços
				</h2>

				<div className="grid gap-10 grid-cols-1 md:grid-cols-2">
					{services.map((s) => (
						<a href={`/new-repair?type=${s.type}`} key={s.title}>
							<div className="bg-[#145374] cursor-pointer rounded-3xl p-8 shadow-xl hover:shadow-2xl transition duration-300 flex flex-col md:flex-row items-center gap-6 hover:scale-[1.02]">
								<img
									src={s.img}
									alt={s.title}
									className="h-65 rounded-xl 
              aspect-[1/1] object-cover object-center"
								/>
								<div className="flex flex-col gap-8">
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
