import { LogIn } from "lucide-react";
import { useState } from "react";
import FacilAuth from "../../components/auth/facilAuth";
import Login from "../../components/auth/login";
import Footer from "../../components/footer";
import Navbar from "../../components/navbar";

export default function Auth() {
  const [isFaceId, setIsFaceId] = useState(false);
  return (
    <div className="min-h-screen bg-[#0F3D57] text-white flex flex-col">
      <Navbar />

      <main className="flex-grow flex items-center justify-center px-4">
        <div className="bg-[#1A4D6D] rounded-2xl shadow-xl p-8 md:p-12 w-full max-w-md">
          <div className="flex items-center gap-3 mb-6">
            <LogIn className="text-cyan-400 w-6 h-6" />
            <h2 className="text-3xl font-bold text-cyan-400">Login</h2>
          </div>

          {isFaceId ? (
            <div className="flex flex-col items-center">
              <FacilAuth />
              <button
                className="cursor-pointer"
                onClick={() => setIsFaceId(!isFaceId)}
                type="button"
              >
                <p className="text-sm text-cyan-200 mt-4 text-center">
                  Use email and password -{" "}
                  <span className="underline hover:text-cyan-300 cursor-pointer">
                    here
                  </span>
                </p>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center min-w-full">
              <Login />
              <button
                className="cursor-pointer"
                onClick={() => setIsFaceId(!isFaceId)}
                type="button"
              >
                <p className="text-sm text-cyan-200 mt-4 text-center">
                  Use facial recognition -{" "}
                  <span className="underline hover:text-cyan-300 ">here</span>
                </p>
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
