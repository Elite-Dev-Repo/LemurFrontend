import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import LemurLogo from "../components/LemurLogo";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      await register(form.username.trim(), form.email.trim(), form.password);
      navigate("/", { replace: true });
    } catch (err) {
      const data = err.response?.data;
      const msgs = data
        ? Object.values(data).flat().join(" ")
        : "Registration failed.";
      setError(msgs || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-6"
      style={{ background: "var(--color-primary)" }}
    >
      <div className="w-full max-w-sm animate-fadeUp">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2 mb-6 md:mb-8 text-center">
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
            Join Lemur
          </h1>
          <p className="text-sm" style={{ color: "rgba(58,58,60,0.55)" }}>
            Create your account to get started
          </p>
        </div>

        {/* Card */}
        <div className="card p-6 md:p-8 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                Username
              </label>
              <input
                type="text"
                className="input-field text-base"
                placeholder="cool_lemur"
                value={form.username}
                onChange={set("username")}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                Email
              </label>
              <input
                type="email"
                className="input-field text-base"
                placeholder="you@example.com"
                value={form.email}
                onChange={set("email")}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  className="input-field text-base pr-11"
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={set("password")}
                  required
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

            <div className="space-y-1">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                Confirm Password
              </label>
              <input
                type={showPw ? "text" : "password"}
                className="input-field text-base"
                placeholder="Repeat password"
                value={form.confirm}
                onChange={set("confirm")}
                required
              />
            </div>

            {error && (
              <div className="text-xs p-3 rounded-lg bg-red-50 text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={
                loading ||
                !form.username ||
                !form.email ||
                !form.password ||
                !form.confirm
              }
              className="btn-primary w-full py-3.5 text-base mt-2"
            >
              {loading ? (
                "Creating account…"
              ) : (
                <>
                  <UserPlus size={17} /> Create Account
                </>
              )}
            </button>
          </form>

          <div
            className="pt-4 text-center text-sm border-t border-gray-100"
            style={{ color: "rgba(58,58,60,0.55)" }}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold underline"
              style={{ color: "var(--color-secondary)" }}
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
