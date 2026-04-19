import { Link } from "react-router";
import { Target, Flame, Sparkles, ChevronRight, ArrowUpRight, Users, Zap, Clock } from "lucide-react";
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

const card = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(168,85,247,0.12)",
  borderRadius: 20,
  backdropFilter: "blur(16px)",
} as const;

const categoryColors: Record<string, string> = {
  transfert: "#f472b6", classement: "#fbbf24", performance: "#fb923c", autre: "#a855f7",
};
const categoryEmoji: Record<string, string> = {
  transfert: "🔄", classement: "🏆", performance: "⚡", autre: "🔮",
};
const sportEmoji: Record<string, string> = {
  football: "⚽", basketball: "🏀", tennis: "🎾", autre: "🏆",
};

// Prono vedette mocké
const pronoVedette = {
  homeTeam: "PSG",
  awayTeam: "Real Madrid",
  competition: "Ligue des Champions · 1/4 finale",
  date: "Mer 26 Mar · 21:00",
  sport: "⚽",
  odds: [
    { label: "PSG gagne", coef: 2.10 },
    { label: "Nul", coef: 3.40 },
    { label: "Real gagne", coef: 3.20 },
  ],
};

export default function Home() {
  const { user, weekly, leaguePlayers, communityEvents } = useGame();
  const pointsLeft = weekly.pointsTotal - weekly.pointsUsed;
  const currentUser = leaguePlayers.find((p) => p.isCurrentUser);
  const pending = weekly.predictions.filter((p) => p.status === "pending");
  const won = weekly.predictions.filter((p) => p.status === "won");
  const lost = weekly.predictions.filter((p) => p.status === "lost");
  const featuredEvent = communityEvents.find((e) => e.featured && e.status === "live");
  const winRate = Math.round((user.totalWins / user.totalPronos) * 100);

  return (
    <div className="flex flex-col" style={{ minHeight: "100%" }}>

      {/* ── HERO ── */}
      <div
        className="relative overflow-hidden px-5 pt-6 pb-8"
        style={{ background: "linear-gradient(145deg, #1a0535 0%, #3b0764 45%, #1e1040 100%)" }}
      >
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(168,85,247,0.25) 0%, transparent 70%)" }} />
        <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(244,114,182,0.18) 0%, transparent 70%)" }} />

        {/* Salut + streak */}
        <div className="flex items-center justify-between mb-6 relative">
          <div>
            <p style={{ color: "rgba(240,232,255,0.45)", fontSize: "0.7rem" }}>{weekly.weekLabel}</p>
            <p style={{ color: C.text, fontWeight: 800, fontSize: "1.05rem", marginTop: 2 }}>
              Salut {user.username} 👋
            </p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl"
            style={{ background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.2)" }}>
            <Flame size={14} color="#fbbf24" />
            <span style={{ color: "#fbbf24", fontWeight: 900, fontSize: "0.95rem" }}>{user.currentStreak}</span>
            <span style={{ color: "rgba(251,191,36,0.5)", fontSize: "0.6rem" }}>streak</span>
          </div>
        </div>

        {/* Score + stats pills */}
        <div className="relative">
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.68rem", marginBottom: 4 }}>Score de la semaine</p>
          <div className="flex items-end justify-between">
            <div className="flex items-baseline gap-2">
              <span style={{ color: "white", fontSize: "4rem", fontWeight: 900, lineHeight: 1, letterSpacing: "-0.03em" }}>
                {weekly.currentScore}
              </span>
              <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "1rem" }}>pts</span>
            </div>
            <div className="flex flex-col items-center justify-center rounded-2xl px-4 py-2 mb-1"
              style={{ background: "rgba(0,0,0,0.28)", border: "1px solid rgba(251,191,36,0.2)" }}>
              <span style={{ color: C.gold, fontWeight: 900, fontSize: "1.5rem", lineHeight: 1.1 }}>
                #{currentUser?.rank ?? "—"}
              </span>
              <span style={{ color: "rgba(251,191,36,0.45)", fontSize: "0.55rem" }}>rang</span>
            </div>
          </div>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.68rem", marginTop: 4 }}>
            {pending.length} pronos actifs · {pointsLeft} pts disponibles
          </p>
        </div>

        {/* Pills */}
        <div className="flex items-center gap-2 mt-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{ background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.2)" }}>
            <Zap size={11} color={C.green} />
            <span style={{ color: C.green, fontSize: "0.68rem", fontWeight: 700 }}>{winRate}% réussite</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)" }}>
            <Sparkles size={11} color={C.purple} />
            <span style={{ color: C.purple, fontSize: "0.68rem", fontWeight: 700 }}>Niv. {user.level}</span>
          </div>
        </div>
      </div>

      {/* ── CONTENU ── */}
      <div className="px-4 pt-5 space-y-5">

        {/* ── PRONO VEDETTE ── */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Target size={14} style={{ color: C.blue }} />
            <span style={{ color: C.text, fontWeight: 700, fontSize: "0.88rem" }}>Prono vedette</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold"
              style={{ background: "rgba(96,165,250,0.12)", color: C.blue, marginLeft: 2 }}>
              ⭐ Top cote
            </span>
          </div>
          <Link to="/pronos" className="block">
            <div
              className="rounded-3xl overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(96,165,250,0.1) 0%, rgba(168,85,247,0.07) 100%)",
                border: "1px solid rgba(96,165,250,0.22)",
              }}
            >
              {/* Header match */}
              <div className="px-4 pt-4 pb-3">
                <div className="flex items-center gap-2 mb-3">
                  <span style={{ fontSize: "1.1rem" }}>{pronoVedette.sport}</span>
                  <span style={{ color: C.muted, fontSize: "0.65rem" }}>{pronoVedette.competition}</span>
                  <div className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(96,165,250,0.12)", border: "1px solid rgba(96,165,250,0.2)" }}>
                    <Clock size={9} style={{ color: C.blue }} />
                    <span style={{ color: C.blue, fontSize: "0.6rem", fontWeight: 600 }}>{pronoVedette.date}</span>
                  </div>
                </div>

                {/* Équipes */}
                <div className="flex items-center justify-center gap-3 mb-4">
                  <span style={{ color: C.text, fontWeight: 800, fontSize: "1.1rem" }}>{pronoVedette.homeTeam}</span>
                  <span style={{ color: C.muted, fontWeight: 400, fontSize: "0.75rem" }}>vs</span>
                  <span style={{ color: C.text, fontWeight: 800, fontSize: "1.1rem" }}>{pronoVedette.awayTeam}</span>
                </div>

                {/* Cotes */}
                <div className="flex gap-2">
                  {pronoVedette.odds.map((odd) => (
                    <div key={odd.label}
                      className="flex-1 rounded-2xl px-2 py-2.5 text-center"
                      style={{ background: "rgba(96,165,250,0.08)", border: "1px solid rgba(96,165,250,0.15)" }}>
                      <p style={{ color: C.blue, fontWeight: 900, fontSize: "1.1rem", lineHeight: 1 }}>×{odd.coef.toFixed(2)}</p>
                      <p style={{ color: C.muted, fontSize: "0.58rem", marginTop: 3 }}>{odd.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between px-4 py-2.5"
                style={{ borderTop: "1px solid rgba(96,165,250,0.12)" }}>
                <span style={{ color: C.muted, fontSize: "0.63rem" }}>Placer un pronostic</span>
                <div className="flex items-center gap-1" style={{ color: C.blue, fontSize: "0.68rem", fontWeight: 700 }}>
                  Parier <ArrowUpRight size={12} />
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* ── ÉVÉNEMENT VEDETTE ── */}
        {featuredEvent && (() => {
          const col = categoryColors[featuredEvent.category];
          return (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles size={14} style={{ color: col }} />
                  <span style={{ color: C.text, fontWeight: 700, fontSize: "0.88rem" }}>Événement vedette</span>
                </div>
                <Link to="/evenements" className="flex items-center gap-0.5"
                  style={{ color: col, fontSize: "0.68rem", fontWeight: 600 }}>
                  Tous <ChevronRight size={12} />
                </Link>
              </div>
              <Link to="/evenements" className="block">
                <div className="rounded-3xl overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${col}14 0%, rgba(255,255,255,0.02) 100%)`,
                    border: `1px solid ${col}28`,
                  }}>
                  <div className="px-4 pt-4 pb-3">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold"
                        style={{ background: `${col}18`, color: col }}>
                        {categoryEmoji[featuredEvent.category]} {featuredEvent.category}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs font-bold"
                        style={{ background: "rgba(251,191,36,0.12)", color: C.gold }}>
                        ⭐ Vedette
                      </span>
                      <div className="flex items-center gap-1 ml-auto">
                        <Users size={10} style={{ color: C.muted }} />
                        <span style={{ color: C.muted, fontSize: "0.6rem" }}>
                          {featuredEvent.totalParticipants.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <p style={{ color: C.text, fontWeight: 700, fontSize: "0.95rem", lineHeight: 1.4, marginBottom: 12 }}>
                      {featuredEvent.title}
                    </p>

                    <div className="flex gap-2">
                      {featuredEvent.options.map((opt) => (
                        <div key={opt.label} className="flex-1 rounded-2xl px-3 py-2.5 text-center"
                          style={{ background: `${col}10`, border: `1px solid ${col}18` }}>
                          <p style={{ color: col, fontWeight: 900, fontSize: "1.1rem", lineHeight: 1 }}>×{opt.coefficient}</p>
                          <p style={{ color: C.muted, fontSize: "0.63rem", marginTop: 2 }}>{opt.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between px-4 py-2.5"
                    style={{ borderTop: `1px solid ${col}15` }}>
                    <span style={{ color: C.muted, fontSize: "0.62rem" }}>
                      Par <span style={{ color: col }}>{featuredEvent.createdBy}</span> · {featuredEvent.deadline}
                    </span>
                    <div className="flex items-center gap-1" style={{ color: col, fontSize: "0.68rem", fontWeight: 700 }}>
                      Voter <ArrowUpRight size={12} />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          );
        })()}

        {/* ── MES PRONOS (discret) ── */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <span style={{ color: C.muted, fontSize: "0.78rem", fontWeight: 600 }}>Mes pronos actifs</span>
            <Link to="/pronos" className="flex items-center gap-0.5"
              style={{ color: C.muted, fontSize: "0.65rem" }}>
              Voir tout <ChevronRight size={11} />
            </Link>
          </div>

          {pending.length === 0 ? (
            <Link to="/pronos" className="block">
              <div className="rounded-2xl px-4 py-3 flex items-center gap-3" style={card}>
                <Target size={15} style={{ color: C.muted }} />
                <span style={{ color: C.muted, fontSize: "0.78rem" }}>
                  Aucun prono · {pointsLeft} pts à investir
                </span>
                <span className="ml-auto px-2.5 py-1 rounded-xl text-xs font-bold"
                  style={{ background: "rgba(96,165,250,0.1)", color: C.blue }}>
                  + Poser
                </span>
              </div>
            </Link>
          ) : (
            <div className="space-y-2">
              {pending.slice(0, 3).map((pred) => (
                <div key={pred.id} className="flex items-center gap-3 rounded-2xl px-3 py-2.5" style={card}>
                  <span style={{ fontSize: "1.1rem" }}>{sportEmoji[pred.sport]}</span>
                  <div className="flex-1 min-w-0">
                    <p style={{ color: C.text, fontSize: "0.78rem", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {pred.homeTeam} <span style={{ color: C.muted, fontWeight: 400 }}>vs</span> {pred.awayTeam}
                    </p>
                    <p style={{ color: C.muted, fontSize: "0.6rem", marginTop: 1 }}>{pred.choice}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span style={{ color: C.blue, fontWeight: 700, fontSize: "0.78rem" }}>×{pred.coefficient}</span>
                    <p style={{ color: C.green, fontSize: "0.58rem", fontWeight: 600, marginTop: 1 }}>+{pred.potentialScore} pts</p>
                  </div>
                </div>
              ))}
              {/* Résultats récents en mini */}
              {(won.length > 0 || lost.length > 0) && (
                <div className="flex gap-2 pt-1">
                  {won.length > 0 && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                      style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.15)" }}>
                      <span style={{ color: C.green, fontSize: "0.65rem", fontWeight: 700 }}>✓ {won.length} gagné{won.length > 1 ? "s" : ""}</span>
                    </div>
                  )}
                  {lost.length > 0 && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                      style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.15)" }}>
                      <span style={{ color: "#f87171", fontSize: "0.65rem", fontWeight: 700 }}>✗ {lost.length} perdu{lost.length > 1 ? "s" : ""}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ height: 8 }} />
      </div>
    </div>
  );
}
