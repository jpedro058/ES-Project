import logo from "../assets/logo.png";

export default function Navbar() {
  return (
    <header className="bg-white p-6 flex items-center justify-between px-10 shadow-md">
      <img src={logo} alt="logo" className="h-16" />
      <ul className="flex gap-6 text-lg font-medium text-[#0F3D57]">
        <li>
          <a
            href="/repair-status"
            className="hover:text-[#00B8D9] hover:underline transition duration-300"
          >
            Repair Status
          </a>
        </li>
        <li>
          <a
            href="/new-repair"
            className="hover:text-[#00B8D9] hover:underline transition duration-300"
          >
            New Repair
          </a>
        </li>
      </ul>
    </header>
  );
}
