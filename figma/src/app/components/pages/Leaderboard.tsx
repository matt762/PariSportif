import { Trophy, Medal, Users, CalendarDays, Crown } from "lucide-react";
import { useGame } from "../../context/GameContext";

const C = {
  text: "#f0e8ff",
  muted: "#7c6fa0",
  purple: "#a855f7",
  pink: "#f472b6",
  orange: "#fb923c",
  green: "#34d399",
  blue: "#60a5fa",
  gold: "#fbbf24",
};

const glass = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(168,85,247,0.12)",
  borderRadius: 20,
  backdropFilter: "blur(16px)",
} as const;

const frameGradients: Record<string, string> = {
  gold: "linear-gradient(135deg, #f59e0b, #fbbf24, #f59e0b)",
  fire: "linear-gradient(135deg, #ef4444, #f97316)",
  silver: "linear-gradient(135deg, #94a3b8, #cbd5e1)",
};

const podiumColors = ["#94a3b8", "#fbbf24", "#cd7f32"];
const podiumH = [70, 100, 54];
const rankLabels = [2, 1, 3];

export default function Leaderboard() {
  const { leaguePlayers, weekly } = useGame();
  const top3 = leaguePlayers.slice(0, 3);
  const rest = leaguePlayers.slice(3);
  const podiumOrder = [top3[1], top3[0], top3[2]];

  return (
    <div style={{ minHeight: "100%" }}>
      {/* Header */}
      <div className="px-5 pt-5 pb-5"
        style={{ background: "linear-gradient(135deg, #78350f 0%, #b45309 55%, #d97706 100%)" }}>
        <div className="flex items-center justify-between mb-2">
          <h1 style={{ color: "white", fontSize: "1.3rem", fontWeight: 800 }}>🏆 Ligue Émeraude</h1>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.12)" }}>
            <Users size={12} color="white" />
            <span style={{ color: "white", fontSize: "0.7rem", fontWeight: 700 }}>{leaguePlayers.length}/250</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 mb-4">
          <CalendarDays size={12} color="rgba(255,255,255,0.5)" />
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.68rem" }}>{weekly.weekLabel}</span>
        </div>
        <div className="flex items-center gap-2.5 rounded-2xl px-4 py-3"
          style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <Trophy size={16} color="#fde68a" />
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.72rem" }}>
            <span style={{ fontWeight: 700 }}>Top 4 gagnants</span> · Maillots, billets &amp; cartes cadeaux jusqu'à 100€ 🎁
          </p>
        </div>
      </div>

      {/* Podium */}
      <div className="px-4 py-5">
        <div className="flex items-end justify-center gap-3">
          {podiumOrder.map((player, i) => {
            if (!player) return null;
            const rank = rankLabels[i];
            const color = podiumColors[i];
            const h = podiumH[i];
            const isFirst = rank === 1;
            return (
              <div key={player.username} className="flex flex-col items-center gap-2"
                style={{ flex: isFirst ? "0 0 110px" : "0 0 88px" }}>
                {/* Avatar */}
                <div className="relative">
                  <div className="rounded-2xl p-0.5"
                    style={{
                      width: isFirst ? 62 : 52, height: isFirst ? 62 : 52,
                      background: player.frame ? (frameGradients[player.frame] || color + "60") : `${color}40`,
                    }}>
                    <div className="w-full h-full rounded-xl flex items-center justify-center"
                      style={{ background: "#160d38", fontSize: isFirst ? "1.9rem" : "1.5rem" }}>
                      {player.avatar}
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: color, fontSize: "0.6rem", color: isFirst ? "#1a1040" : "white", fontWeight: 900 }}>
                    {rank}
                  </div>
                </div>
                <div className="text-center">
                  <p style={{ color: isFirst ? C.gold : C.text, fontSize: "0.7rem", fontWeight: 700, maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {player.username}
                  </p>
                  <p style={{ color, fontWeight: 900, fontSize: "0.85rem" }}>{player.score}</p>
                </div>
                {/* Podium block */}
                <div className="w-full rounded-t-2xl flex items-center justify-center"
                  style={{ height: h, background: `${color}10`, border: `1.5px solid ${color}25`, borderBottom: "none" }}>
                  {isFirst ? <Crown size={20} style={{ color }} /> : rank === 2 ? <Medal size={16} style={{ color }} /> : <Trophy size={14} style={{ color }} />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full ranking */}
      <div className="px-4 pb-4 space-y-2">
        <p style={{ color: C.muted, fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>
          Classement complet
        </p>
        {rest.map((player) => (
          <div key={player.username} className="flex items-center gap-3 rounded-2xl px-3.5 py-3"
            style={{
              ...glass,
              borderColor: player.isCurrentUser ? "rgba(168,85,247,0.35)" : "rgba(168,85,247,0.1)",
              background: player.isCurrentUser
                ? "linear-gradient(135deg, rgba(168,85,247,0.1), rgba(244,114,182,0.05))"
                : "rgba(255,255,255,0.03)",
              boxShadow: player.isCurrentUser ? "0 4px 20px rgba(168,85,247,0.12)" : "none",
            }}>
            {/* Rank */}
            <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
              style={{
                background: player.rank <= 6 ? "rgba(251,191,36,0.1)" : "rgba(255,255,255,0.05)",
                border: player.rank <= 6 ? "1px solid rgba(251,191,36,0.25)" : "none",
              }}>
              <span style={{ color: player.rank <= 6 ? C.gold : C.muted, fontSize: "0.72rem", fontWeight: 700 }}>
                {player.rank}
              </span>
            </div>

            {/* Avatar */}
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 p-0.5 text-lg"
              style={{ background: player.frame ? (frameGradients[player.frame] || "rgba(168,85,247,0.2)") : "rgba(168,85,247,0.1)" }}>
              <div className="w-full h-full rounded-lg flex items-center justify-center" style={{ background: "#160d38" }}>
                {player.avatar}
              </div>
            </div>

            {/* Name */}
            <div className="flex-1 min-w-0">
              <p style={{ color: player.isCurrentUser ? C.purple : C.text, fontSize: "0.82rem", fontWeight: player.isCurrentUser ? 700 : 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {player.username}
                {player.isCurrentUser && (
                  <span className="ml-1.5 px-1.5 py-0.5 rounded-full"
                    style={{ background: "rgba(168,85,247,0.15)", color: C.purple, fontSize: "0.55rem", fontWeight: 700 }}>
                    Toi
                  </span>
                )}
              </p>
              <p style={{ color: C.muted, fontSize: "0.62rem" }}>{player.pronos} pronos</p>
            </div>

            {/* Score */}
            <div className="text-right shrink-0">
              <p style={{ color: player.isCurrentUser ? C.purple : C.text, fontWeight: 800, fontSize: "0.95rem" }}>
                {player.score}
              </p>
              <p style={{ color: C.muted, fontSize: "0.6rem" }}>pts</p>
            </div>
          </div>
        ))}

        <div className="flex items-start gap-2.5 rounded-2xl px-4 py-3 mt-2" style={glass}>
          <Users size={14} style={{ color: C.muted, flexShrink: 0, marginTop: 1 }} />
          <p style={{ color: C.muted, fontSize: "0.67rem", lineHeight: 1.5 }}>
            Ligue de <span style={{ color: C.text, fontWeight: 600 }}>250 joueurs</span> · Classement remis à zéro chaque lundi · Réaffectation toutes les 4 semaines.
          </p>
        </div>
      </div>
    </div>
  );
}
