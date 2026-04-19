import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import LemurLogo from "../components/LemurLogo";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname ?? "/";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.detail ?? "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: "var(--color-primary)" }}
    >
      <div className="w-full max-w-sm animate-fadeUp">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 mb-8 text-center">
          <span style={{ color: "var(--color-secondary)" }}>
            <LemurLogo size={44} />
          </span>
          <h1
            className="text-2xl md:text-3xl font-bold"
            style={{
              fontFamily: "'Space Mono', serif",
              color: "var(--color-secondary)",
            }}
          >
            Welcome back
          </h1>
          <p className="text-sm" style={{ color: "rgba(58,58,60,0.55)" }}>
            Sign in to your Lemur account
          </p>
        </div>

        {/* Card */}
        <div className="card p-6 md:p-8 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                Username
              </label>
              <input
                className="input-field text-base"
                placeholder="your_username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  className="input-field text-base pr-11"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-xs p-3 rounded-lg bg-red-50 text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !username || !password}
              className="btn-primary w-full py-3.5 text-base shadow-sm mt-2"
            >
              {loading ? (
                "..."
              ) : (
                <>
                  <LogIn size={17} /> Sign In
                </>
              )}
            </button>
          </form>

          <div
            className="pt-4 text-center text-sm border-t border-gray-100"
            style={{ color: "rgba(58,58,60,0.55)" }}
          >
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold underline"
              style={{ color: "var(--color-secondary)" }}
            >
              Create one
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
