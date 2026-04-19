import { useState } from "react";
import { CheckCircle, Clock, XCircle, Target } from "lucide-react";
import { useGame } from "../../context/GameContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Slider } from "../ui/slider";

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

type SportFilter = "tous" | "football" | "basketball" | "tennis";
interface MatchOdd { label: string; coefficient: number; }
interface AvailableMatch {
  id: string; homeTeam: string; awayTeam: string;
  sport: "football" | "basketball" | "tennis" | "autre";
  date: string; time: string; league: string; odds: MatchOdd[];
}

const availableMatches: AvailableMatch[] = [
  { id: "m6", homeTeam: "Barcelona", awayTeam: "Atlético", sport: "football", date: "Sam 29 Mar", time: "20:00", league: "La Liga 🇪🇸", odds: [{ label: "Barcelona", coefficient: 1.6 }, { label: "Nul", coefficient: 3.8 }, { label: "Atlético", coefficient: 2.4 }] },
  { id: "m7", homeTeam: "Marseille", awayTeam: "Lyon", sport: "football", date: "Dim 30 Mar", time: "17:00", league: "Ligue 1 🇫🇷", odds: [{ label: "OM", coefficient: 2.0 }, { label: "Nul", coefficient: 3.3 }, { label: "Lyon", coefficient: 1.9 }] },
  { id: "m8", homeTeam: "Liverpool", awayTeam: "Tottenham", sport: "football", date: "Dim 30 Mar", time: "14:30", league: "Premier League 🏴󠁧󠁢󠁥󠁮󠁧󠁿", odds: [{ label: "Liverpool", coefficient: 1.5 }, { label: "Nul", coefficient: 4.0 }, { label: "Tottenham", coefficient: 3.2 }] },
  { id: "m9", homeTeam: "Juventus", awayTeam: "Inter", sport: "football", date: "Sam 29 Mar", time: "18:00", league: "Serie A 🇮🇹", odds: [{ label: "Juventus", coefficient: 2.3 }, { label: "Nul", coefficient: 3.5 }, { label: "Inter", coefficient: 1.7 }] },
  { id: "m10", homeTeam: "Celtics", awayTeam: "Heat", sport: "basketball", date: "Ven 28 Mar", time: "01:00", league: "NBA 🇺🇸", odds: [{ label: "Celtics", coefficient: 1.5 }, { label: "Heat", coefficient: 2.8 }] },
  { id: "m11", homeTeam: "Nuggets", awayTeam: "Bucks", sport: "basketball", date: "Sam 29 Mar", time: "21:30", league: "NBA 🇺🇸", odds: [{ label: "Nuggets", coefficient: 1.9 }, { label: "Bucks", coefficient: 2.1 }] },
  { id: "m12", homeTeam: "Swiatek", awayTeam: "Gauff", sport: "tennis", date: "Jeu 27 Mar", time: "17:00", league: "WTA Miami 🇺🇸", odds: [{ label: "Swiatek", coefficient: 1.4 }, { label: "Gauff", coefficient: 3.0 }] },
  { id: "m13", homeTeam: "Nadal", awayTeam: "Medvedev", sport: "tennis", date: "Ven 28 Mar", time: "14:00", league: "ATP Monte-Carlo 🇲🇨", odds: [{ label: "Nadal", coefficient: 2.2 }, { label: "Medvedev", coefficient: 1.7 }] },
];

const sportEmoji: Record<string, string> = { football: "⚽", basketball: "🏀", tennis: "🎾", autre: "🏆" };

const filters: { key: SportFilter; label: string; color: string }[] = [
  { key: "tous", label: "Tous", color: C.purple },
  { key: "football", label: "⚽ Foot", color: C.green },
  { key: "basketball", label: "🏀 Basket", color: C.orange },
  { key: "tennis", label: "🎾 Tennis", color: C.blue },
];

const statusConfig = {
  pending: { color: C.blue, icon: Clock },
  won: { color: C.green, icon: CheckCircle },
  lost: { color: "#f87171", icon: XCircle },
};

function coeffColor(c: number) {
  if (c >= 3.5) return C.pink;
  if (c >= 2.5) return C.orange;
  if (c >= 1.8) return C.blue;
  return C.green;
}

export default function Predictions() {
  const { weekly, addPrediction, gainXP } = useGame();
  const [filter, setFilter] = useState<SportFilter>("tous");
  const [selectedMatch, setSelectedMatch] = useState<AvailableMatch | null>(null);
  const [selectedOdd, setSelectedOdd] = useState<MatchOdd | null>(null);
  const [stake, setStake] = useState(10);
  const [confirmMsg, setConfirmMsg] = useState<string | null>(null);

  const pointsLeft = weekly.pointsTotal - weekly.pointsUsed;
  const predictedMatchIds = new Set(weekly.predictions.map((p) => p.matchId));
  const filtered = availableMatches.filter((m) => filter === "tous" || m.sport === filter);
  const pendingCount = weekly.predictions.filter(p => p.status === "pending").length;

  const openModal = (match: AvailableMatch, odd: MatchOdd) => {
    setSelectedMatch(match); setSelectedOdd(odd);
    setStake(Math.max(5, Math.min(15, pointsLeft)));
    setConfirmMsg(null);
  };

  const handleConfirm = () => {
    if (!selectedMatch || !selectedOdd) return;
    const ok = addPrediction({
      matchId: selectedMatch.id, homeTeam: selectedMatch.homeTeam, awayTeam: selectedMatch.awayTeam,
      sport: selectedMatch.sport, choice: selectedOdd.label, coefficient: selectedOdd.coefficient,
      points: stake, potentialScore: Math.round(stake * selectedOdd.coefficient),
      status: "pending", matchDate: selectedMatch.date, matchTime: selectedMatch.time,
    });
    if (ok) {
      gainXP(5); setConfirmMsg("✅ Pronostic posé !");
      setTimeout(() => { setSelectedMatch(null); setSelectedOdd(null); setConfirmMsg(null); }, 1400);
    } else {
      setConfirmMsg("❌ Points insuffisants ou limite atteinte.");
    }
  };

  const potential = selectedOdd ? Math.round(stake * selectedOdd.coefficient) : 0;

  return (
    <div style={{ minHeight: "100%" }}>
      {/* Header */}
      <div className="px-5 pt-5 pb-4"
        style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #3730a3 60%, #4c1d95 100%)" }}>
        <h1 style={{ color: "white", fontSize: "1.3rem", fontWeight: 800, marginBottom: 6 }}>Pronostics</h1>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{ background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.2)" }}>
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: C.green }} />
            <span style={{ color: C.green, fontSize: "0.7rem", fontWeight: 700 }}>{pointsLeft} pts disponibles</span>
          </div>
          <div className="px-3 py-1.5 rounded-full"
            style={{ background: "rgba(255,255,255,0.1)" }}>
            <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.7rem" }}>
              {pendingCount}/{weekly.pronosMax} pronos
            </span>
          </div>
        </div>
      </div>

      {/* Sport Filter */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto"
        style={{ background: "rgba(0,0,0,0.2)", borderBottom: "1px solid rgba(168,85,247,0.1)" }}>
        {filters.map(({ key, label, color }) => (
          <button key={key} onClick={() => setFilter(key)}
            className="shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all"
            style={{
              background: filter === key ? color : "rgba(255,255,255,0.05)",
              color: filter === key ? "white" : C.muted,
              border: `1px solid ${filter === key ? color : "rgba(168,85,247,0.12)"}`,
              boxShadow: filter === key ? `0 4px 12px ${color}30` : "none",
            }}>
            {label}
          </button>
        ))}
      </div>

      <div className="px-4 py-4 space-y-3">
        {/* Matches */}
        {filtered.map((match) => {
          const done = predictedMatchIds.has(match.id);
          return (
            <div key={match.id} className="rounded-2xl overflow-hidden"
              style={{ ...glass, opacity: done ? 0.65 : 1, borderColor: done ? "rgba(52,211,153,0.2)" : "rgba(168,85,247,0.12)" }}>
              {/* Match meta */}
              <div className="flex items-center justify-between px-4 py-2.5"
                style={{ borderBottom: "1px solid rgba(168,85,247,0.08)", background: "rgba(255,255,255,0.02)" }}>
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: "1rem" }}>{sportEmoji[match.sport]}</span>
                  <span style={{ color: C.muted, fontSize: "0.65rem" }}>{match.league}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ color: C.muted, fontSize: "0.65rem" }}>{match.date} · {match.time}</span>
                  {done && (
                    <span className="px-1.5 py-0.5 rounded-full"
                      style={{ background: "rgba(52,211,153,0.12)", color: C.green, fontSize: "0.58rem", fontWeight: 700 }}>
                      ✓
                    </span>
                  )}
                </div>
              </div>

              <div className="px-4 pt-3 pb-4">
                {/* Teams */}
                <p style={{ color: C.text, fontSize: "1rem", fontWeight: 700, marginBottom: 12 }}>
                  {match.homeTeam}
                  <span style={{ color: C.muted, fontWeight: 400, margin: "0 6px" }}>vs</span>
                  {match.awayTeam}
                </p>

                {/* Odds */}
                <div className="flex gap-2">
                  {match.odds.map((odd) => {
                    const cc = coeffColor(odd.coefficient);
                    return (
                      <button key={odd.label}
                        onClick={() => !done && openModal(match, odd)}
                        disabled={done}
                        className="flex-1 py-3 rounded-2xl transition-all flex flex-col items-center gap-0.5"
                        style={{
                          background: `${cc}10`,
                          border: `1.5px solid ${cc}25`,
                          cursor: done ? "default" : "pointer",
                        }}>
                        <span style={{ color: cc, fontSize: "1rem", fontWeight: 900 }}>×{odd.coefficient}</span>
                        <span style={{ color: C.muted, fontSize: "0.6rem" }}>{odd.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}

        {/* My predictions */}
        {weekly.predictions.length > 0 && (
          <div>
            <p style={{ color: C.muted, fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10, marginTop: 8 }}>
              Mes pronos cette semaine
            </p>
            <div className="space-y-2 pb-4">
              {weekly.predictions.map((pred) => {
                const cfg = statusConfig[pred.status];
                const Icon = cfg.icon;
                return (
                  <div key={pred.id} className="flex items-center gap-3 rounded-2xl px-3.5 py-3"
                    style={{ ...glass, borderColor: pred.status !== "pending" ? `${cfg.color}30` : "rgba(168,85,247,0.12)" }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: `${cfg.color}12` }}>
                      <Icon size={15} style={{ color: cfg.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p style={{ color: C.text, fontSize: "0.8rem", fontWeight: 600 }}>
                        {pred.homeTeam} vs {pred.awayTeam}
                      </p>
                      <p style={{ color: C.muted, fontSize: "0.65rem" }}>
                        {pred.choice} · {pred.matchDate}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p style={{ color: cfg.color, fontWeight: 700, fontSize: "0.88rem" }}>
                        {pred.status === "won" ? `+${pred.potentialScore}` : pred.status === "lost" ? `-${pred.points}` : `${pred.points}→${pred.potentialScore}`}
                      </p>
                      <p style={{ color: C.muted, fontSize: "0.6rem" }}>×{pred.coefficient}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <Dialog open={!!selectedMatch} onOpenChange={(o) => !o && setSelectedMatch(null)}>
        <DialogContent className="p-0 overflow-hidden max-w-sm"
          style={{ background: "#150d35", border: "1px solid rgba(168,85,247,0.25)", borderRadius: 24 }}>
          {selectedMatch && selectedOdd && (
            <>
              <DialogHeader className="px-5 pt-5 pb-0">
                <DialogTitle style={{ color: C.text }}>Placer un pronostic</DialogTitle>
                <DialogDescription className="sr-only">Choisis une cote et investis des points sur ce match.</DialogDescription>
              </DialogHeader>
              <div className="px-5 pt-4 pb-5 space-y-4">
                {/* Match */}
                <div className="rounded-2xl px-4 py-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(168,85,247,0.12)" }}>
                  <p style={{ color: C.muted, fontSize: "0.65rem", marginBottom: 2 }}>
                    {selectedMatch.league} · {selectedMatch.date} {selectedMatch.time}
                  </p>
                  <p style={{ color: C.text, fontWeight: 700, fontSize: "0.95rem" }}>
                    {selectedMatch.homeTeam} vs {selectedMatch.awayTeam}
                  </p>
                </div>

                {/* Odds */}
                <div>
                  <p style={{ color: C.muted, fontSize: "0.7rem", marginBottom: 8 }}>Ton pronostic</p>
                  <div className="flex gap-2">
                    {selectedMatch.odds.map((odd) => {
                      const cc = coeffColor(odd.coefficient);
                      const isSelected = selectedOdd.label === odd.label;
                      return (
                        <button key={odd.label} onClick={() => setSelectedOdd(odd)}
                          className="flex-1 py-3 rounded-2xl text-center transition-all"
                          style={{
                            background: isSelected ? `${cc}15` : "rgba(255,255,255,0.04)",
                            border: `1.5px solid ${isSelected ? cc : "rgba(168,85,247,0.15)"}`,
                            boxShadow: isSelected ? `0 4px 16px ${cc}25` : "none",
                          }}>
                          <p style={{ color: cc, fontWeight: 900, fontSize: "1rem" }}>×{odd.coefficient}</p>
                          <p style={{ color: C.muted, fontSize: "0.62rem" }}>{odd.label}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Stake */}
                <div>
                  <div className="flex justify-between mb-2">
                    <p style={{ color: C.muted, fontSize: "0.7rem" }}>Points investis</p>
                    <p style={{ color: C.text, fontWeight: 700 }}>{stake} pts</p>
                  </div>
                  <Slider value={[stake]} onValueChange={([v]) => setStake(v)} min={5} max={Math.max(5, pointsLeft)} step={5} />
                  <div className="flex justify-between mt-1.5">
                    <span style={{ color: C.muted, fontSize: "0.62rem" }}>5 min</span>
                    <span style={{ color: C.muted, fontSize: "0.62rem" }}>{pointsLeft} max</span>
                  </div>
                </div>

                {/* Gain potentiel */}
                <div className="rounded-2xl p-4 flex items-center justify-between"
                  style={{ background: `${coeffColor(selectedOdd.coefficient)}08`, border: `1px solid ${coeffColor(selectedOdd.coefficient)}20` }}>
                  <div>
                    <p style={{ color: C.muted, fontSize: "0.68rem" }}>Gain potentiel si ✅</p>
                    <p style={{ color: C.text, fontWeight: 900, fontSize: "1.8rem", lineHeight: 1 }}>
                      {potential}
                      <span style={{ color: C.muted, fontSize: "0.8rem", fontWeight: 400 }}> pts</span>
                    </p>
                  </div>
                  <div className="px-3 py-2 rounded-xl"
                    style={{ background: `${coeffColor(selectedOdd.coefficient)}15` }}>
                    <p style={{ color: coeffColor(selectedOdd.coefficient), fontSize: "1.1rem", fontWeight: 900 }}>
                      ×{selectedOdd.coefficient}
                    </p>
                  </div>
                </div>

                {confirmMsg && (
                  <p className="text-center text-sm font-semibold"
                    style={{ color: confirmMsg.startsWith("✅") ? C.green : "#f87171" }}>
                    {confirmMsg}
                  </p>
                )}

                <button onClick={handleConfirm} disabled={pointsLeft < 5}
                  className="w-full py-3.5 rounded-2xl font-bold text-sm"
                  style={{
                    background: pointsLeft < 5 ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #1d4ed8, #4c1d95)",
                    color: pointsLeft < 5 ? C.muted : "white",
                  }}>
                  {pointsLeft < 5 ? "Points insuffisants" : `Confirmer — ${stake} pts sur ${selectedOdd.label}`}
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}