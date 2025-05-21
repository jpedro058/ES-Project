import { useContext } from "react";
import logo from "../assets/logo.png";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { currentUser } = useContext(AuthContext);

  function handleLogout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/auth";
  }

  return (
    <header className="bg-white p-6 flex items-center justify-between px-10 shadow-md">
      <a href="/home">
        <img src={logo} alt="logo" className="h-16" />
      </a>
      {currentUser ? (
        <ul className="flex gap-6 text-lg font-medium text-[#0F3D57] items-center">
          <li>
            <a
              href="/my-repairs"
              className="hover:text-[#00B8D9] hover:underline transition duration-300"
            >
              My Repairs
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
          <li>
            <button
              type="button"
              onClick={handleLogout}
              className="px-4 py-2 bg-cyan-500 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-600 hover:shadow-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 cursor-pointer"
            >
              Logout
            </button>
          </li>
        </ul>
      ) : (
        <a
          href="/auth"
          className="px-4 py-2 bg-cyan-500 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-600 hover:shadow-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 cursor-pointer"
        >
          Log In
        </a>
      )}
    </header>
  );
}
