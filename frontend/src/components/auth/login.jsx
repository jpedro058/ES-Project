export default function Login() {
  return (
    <form className="space-y-6 min-w-full">
      <div>
        <label htmlFor="email" className="block text-sm mb-1 text-cyan-200">
          Email
        </label>
        <input
          type="email"
          id="email"
          required
          className="w-full px-4 py-2 rounded-xl bg-[#0F3D57] text-white border border-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm mb-1 text-cyan-200 required:"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          required
          className="w-full px-4 py-2 rounded-xl bg-[#0F3D57] text-white border border-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        className="w-full cursor-pointer py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-xl transition duration-300"
      >
        Entrar
      </button>
    </form>
  );
}
