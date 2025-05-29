import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import "../../styles/Login.css";

export default function Login() {
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const { updateUser, updateToken } = useContext(AuthContext);

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const username = formData.get("username");
    const password = formData.get("password");

    try {
      const response = await fetch(
        "http://django-env.eba-gmvprtui.us-east-1.elasticbeanstalk.com/login/login-with-credentials/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      updateUser(data.user_id);
      updateToken(data.access_token);

      window.location.href = "/home";
    } catch (error) {
      console.error("Login error:", error);
      setError("Invalid username or password");
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6 min-w-full relative">
      <div>
        <label htmlFor="username" className="block text-sm mb-1 text-cyan-200">
          username
        </label>
        <input
          type="text"
          id="username"
          name="username"
          required
          className="w-full px-4 py-2 rounded-xl bg-[#0F3D57] text-white border border-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          placeholder="you@example.com"
        />
      </div>

      <div className="relative">
        <label
          htmlFor="password"
          className="block text-sm mb-1 text-cyan-200 required:"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          required
          type={showPassword ? "text" : "password"}
          className="w-full px-4 py-2 rounded-xl bg-[#0F3D57] text-white border border-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          placeholder="••••••••"
        />
        <button
          type="button"
          onClick={toggleShowPassword}
          className="absolute right-3 top-[38px] text-cyan-400 hover:text-cyan-200 transition cursor-pointer"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      <button
        type="submit"
        className="w-full cursor-pointer py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-xl transition duration-300"
      >
        Login
      </button>

      {error && (
        <div className="flex items-center gap-2 text-red-200 bg-red-900/30 border border-red-500 rounded-lg px-4 py-2 -mt-2 fade-in">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}
    </form>
  );
}
