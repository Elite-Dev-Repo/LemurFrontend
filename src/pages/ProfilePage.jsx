import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { User, LogOut } from "lucide-react";

export default function ProfilePage() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="max-w-md mx-auto card p-8 md:p-12 text-center space-y-4 mt-10 px-6">
        <User
          size={40}
          className="mx-auto"
          style={{ color: "rgba(58,58,60,0.3)" }}
        />
        <p
          className="font-bold text-lg"
          style={{
            fontFamily: "'Space Mono', serif",
            color: "var(--color-secondary)",
          }}
        >
          You're not logged in
        </p>
        <Link to="/login" className="btn-primary inline-flex mx-auto">
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-5 animate-fadeUp px-1 md:px-0">
      <h1
        className="text-2xl font-bold"
        style={{
          fontFamily: "'Space Mono', serif",
          color: "var(--color-secondary)",
        }}
      >
        Profile
      </h1>

      <div className="card p-6 md:p-8 text-center space-y-4">
        <div
          className="avatar w-20 h-20 text-2xl mx-auto shadow-sm"
          style={{
            background: "var(--color-secondary)",
            color: "var(--color-primary)",
          }}
        >
          {user.username[0].toUpperCase()}
        </div>
        <div className="space-y-1">
          <h2
            className="text-xl font-bold"
            style={{
              fontFamily: "'Space Mono', serif",
              color: "var(--color-secondary)",
            }}
          >
            {user.username}
          </h2>
          <p className="text-sm" style={{ color: "rgba(58,58,60,0.5)" }}>
            @{user.username.toLowerCase()}
          </p>
        </div>
        <div className="pt-2">
          <button onClick={logout} className="btn-ghost mx-auto text-sm">
            <LogOut size={15} /> Sign out
          </button>
        </div>
      </div>

      <div
        className="card p-6 text-center"
        style={{ color: "rgba(58,58,60,0.4)" }}
      >
        <p className="text-sm italic">
          Activity history and stats coming soon.
        </p>
      </div>
    </div>
  );
}
