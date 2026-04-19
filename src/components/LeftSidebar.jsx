import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  User,
  Hash,
  LogOut,
  LogIn,
  ChevronDown,
  PenSquare,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCommunities } from "../hooks/useCommunities";
import LemurLogo from "./LemurLogo";
import { useState } from "react";

export default function LeftSidebar() {
  const { user, logout } = useAuth();
  const { communities, loading } = useCommunities();
  const [commOpen, setCommOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside
      className="fixed bottom-0 left-0 right-0 z-50 flex flex-row items-center justify-around bg-white h-16 px-2 
                 md:sticky md:top-0 md:h-screen md:flex-col md:py-6 md:px-3 md:overflow-y-auto md:w-64"
      style={{
        borderTop: "1px solid var(--color-border)",
        borderRight: "none",
      }}
    >
      {/* Responsive Border Logic */}
      <style>{`
        @media (min-width: 768px) {
          aside { border-top: none !important; border-right: 1px solid var(--color-border) !important; }
        }
      `}</style>

      {/* Logo - Hidden on Mobile */}
      <NavLink
        to="/"
        className="hidden md:flex items-center gap-3 px-3 mb-8 group"
      >
        <span style={{ color: "var(--color-secondary)" }}>
          <LemurLogo size={34} />
        </span>
        <span
          className="text-2xl font-bold tracking-tight"
          style={{
            fontFamily: "'Space Mono', serif",
            color: "var(--color-secondary)",
          }}
        >
          Lemur
        </span>
      </NavLink>

      {/* Nav */}
      <nav className="flex flex-row md:flex-col gap-1 flex-1 w-full justify-around md:justify-start items-center md:items-stretch">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `nav-link ${isActive ? "active" : ""} flex-col md:flex-row gap-1 md:gap-3`
          }
        >
          <Home size={20} strokeWidth={2} className="md:w-[19px] md:h-[19px]" />
          <span className="text-[10px] md:text-base">Home</span>
        </NavLink>

        {/* Communities - Mobile Link */}
        <NavLink
          to="/communities"
          className={({ isActive }) =>
            `md:hidden nav-link ${isActive ? "active" : ""} flex-col gap-1`
          }
        >
          <Hash size={20} strokeWidth={2} />
          <span className="text-[10px]">Explore</span>
        </NavLink>

        {/* Mobile-Only Post Link */}
        {user && (
          <NavLink
            to="/create"
            className="md:hidden flex flex-col items-center gap-1 nav-link"
          >
            <PenSquare size={20} strokeWidth={2} />
            <span className="text-[10px]">Post</span>
          </NavLink>
        )}

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `nav-link ${isActive ? "active" : ""} flex-col md:flex-row gap-1 md:gap-3`
          }
        >
          <User size={20} strokeWidth={2} className="md:w-[19px] md:h-[19px]" />
          <span className="text-[10px] md:text-base">Profile</span>
        </NavLink>

        {/* Communities - Desktop Tree */}
        <div className="hidden md:block mt-3">
          <button
            onClick={() => setCommOpen((v) => !v)}
            className="flex items-center justify-between w-full px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-widest transition-colors"
            style={{ color: "rgba(58,58,60,0.5)" }}
          >
            <span>Communities</span>
            <ChevronDown
              size={14}
              className="transition-transform duration-200"
              style={{
                transform: commOpen ? "rotate(0deg)" : "rotate(-90deg)",
              }}
            />
          </button>

          {commOpen && (
            <div className="flex flex-col gap-0.5 mt-1 pl-1 animate-fadeIn">
              {loading ? (
                <div className="space-y-2 px-3 py-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="skeleton h-4 w-32" />
                  ))}
                </div>
              ) : communities.length === 0 ? (
                <p
                  className="text-xs px-4 py-2"
                  style={{ color: "rgba(58,58,60,0.4)" }}
                >
                  No communities yet
                </p>
              ) : (
                communities.map((c) => (
                  <NavLink
                    key={c.id}
                    to={`/community/${c.id}`}
                    className={({ isActive }) =>
                      `nav-link text-sm py-2 ${isActive ? "active" : ""}`
                    }
                  >
                    <Hash size={15} strokeWidth={2} className="shrink-0" />
                    <span className="truncate">{c.name}</span>
                  </NavLink>
                ))
              )}
            </div>
          )}
        </div>

        {/* Mobile Logout (visible only when logged in) */}
        {user && (
          <button
            onClick={handleLogout}
            className="md:hidden flex flex-col items-center gap-1 nav-link px-2"
          >
            <LogOut size={20} />
            <span className="text-[10px]">Exit</span>
          </button>
        )}
      </nav>

      {/* Create post CTA - Desktop Only */}
      {user && (
        <NavLink
          to="/create"
          className="hidden md:flex btn-primary w-full mb-4 py-3"
        >
          <PenSquare size={16} strokeWidth={2} />
          New Post
        </NavLink>
      )}

      {/* User / Login - Desktop Only */}
      <div
        className="hidden md:block"
        style={{
          borderTop: "1px solid var(--color-border)",
          paddingTop: "1rem",
          marginTop: "0.5rem",
        }}
      >
        {user ? (
          <div className="flex items-center gap-3 px-2 justify-between">
            <div className="avatar w-9 h-9 text-sm shrink-0">
              {user.username[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-semibold truncate"
                style={{ color: "var(--color-secondary)" }}
              >
                {user.username}
              </p>
              <p
                className="text-xs truncate"
                style={{ color: "rgba(58,58,60,0.5)" }}
              >
                @{user.username.toLowerCase()}
              </p>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="pl-9 rounded-lg transition-colors text-red-500"
            >
              <LogOut size={17} />
            </button>
          </div>
        ) : (
          <NavLink to="/login" className="nav-link font-medium">
            <LogIn size={19} />
            <span>Sign in</span>
          </NavLink>
        )}
      </div>
    </aside>
  );
}
