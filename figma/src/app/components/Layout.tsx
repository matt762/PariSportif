import { Outlet, NavLink } from "react-router";
import { Home, Target, Sparkles, Trophy, User } from "lucide-react";
import { useGame } from "../context/GameContext";

const navItems = [
  { to: "/", label: "Accueil", icon: Home, color: "#a855f7" },
  { to: "/pronos", label: "Pronos", icon: Target, color: "#60a5fa" },
  { to: "/evenements", label: "Événements", icon: Sparkles, color: "#f472b6" },
  { to: "/ligue", label: "Ligue", icon: Trophy, color: "#fbbf24" },
  { to: "/profil", label: "Profil", icon: User, color: "#34d399" },
];

export default function Layout() {
  const { weekly, user } = useGame();
  const pointsLeft = weekly.pointsTotal - weekly.pointsUsed;
  const xpPct = Math.round((user.xp / user.xpToNextLevel) * 100);

  return (
    <div
      className="flex flex-col h-screen w-full max-w-md mx-auto relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #0d0920 0%, #110b28 50%, #0f0a22 100%)" }}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-5 py-3 shrink-0 z-10"
        style={{
          background: "rgba(255,255,255,0.03)",
          borderBottom: "1px solid rgba(168,85,247,0.12)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
          >
            <Sparkles size={13} color="white" />
          </div>
          <span style={{ color: "#f0e8ff", fontWeight: 800, fontSize: "0.88rem", letterSpacing: "-0.01em" }}>
            Pronos<span style={{ color: "#a855f7" }}>Live</span>
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)" }}
          >
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#34d399" }} />
            <span style={{ color: "#34d399", fontSize: "0.7rem", fontWeight: 700 }}>{pointsLeft} pts</span>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="w-10 h-1 rounded-full overflow-hidden" style={{ background: "rgba(168,85,247,0.2)" }}>
              <div style={{ width: `${xpPct}%`, height: "100%", background: "linear-gradient(90deg, #7c3aed, #c084fc)", borderRadius: 999 }} />
            </div>
            <span style={{ color: "#c084fc", fontSize: "0.65rem", fontWeight: 700 }}>Niv.{user.level}</span>
          </div>
        </div>
      </div>

      {/* Page content — scrollable, padded at bottom so content clears the floating nav */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden" style={{ paddingBottom: "90px" }}>
        <Outlet />
      </div>

      {/* Floating bottom nav — absolute, floats above the content */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{ zIndex: 50 }}
      >
        {/* Gradient fade so content dissolves cleanly */}
        <div
          className="absolute inset-x-0 bottom-0 pointer-events-none"
          style={{
            height: "110px",
            background: "linear-gradient(to top, rgba(13,9,32,0.95) 0%, rgba(13,9,32,0.5) 60%, transparent 100%)",
          }}
        />

        <nav
          className="relative flex items-center justify-around px-4 py-3 pointer-events-auto"
        >
          {navItems.map(({ to, label, icon: Icon, color }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className="flex-1"
            >
              {({ isActive }) => (
                <div className="flex flex-col items-center gap-0.5">
                  <div
                    className="w-10 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
                    style={{
                      background: isActive ? `${color}20` : "transparent",
                    }}
                  >
                    <Icon
                      size={20}
                      strokeWidth={isActive ? 2.5 : 1.6}
                      style={{
                        color: isActive ? color : "rgba(255,255,255,0.25)",
                        filter: isActive ? `drop-shadow(0 0 8px ${color}90)` : "none",
                        transition: "all 0.2s ease",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: "0.58rem",
                      fontWeight: isActive ? 700 : 400,
                      color: isActive ? color : "rgba(255,255,255,0.25)",
                      letterSpacing: isActive ? "0.01em" : "0",
                      transition: "all 0.2s ease",
                      textShadow: isActive ? `0 0 10px ${color}70` : "none",
                    }}
                  >
                    {label}
                  </span>
                </div>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}