import { useState } from "react";
import {
  Star, Trophy, Target, Zap, Gift, Play, Lock,
  CheckCircle, ChevronRight, Shield, Settings, Sparkles,
} from "lucide-react";
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

// ── IDENTITÉS COSMÉTIQUES (aucun nom officiel, aucun logo protégé) ─────────────
interface ClubCosme {
  id: string;
  label: string;        // surnom créatif
  c1: string;           // couleur dominante
  c2: string;           // couleur secondaire
  sport: "foot" | "basket";
  owned: boolean;
  price: string | null;
}

const clubs: ClubCosme[] = [
  // ──── FOOT ────
  { id: "rouges",     label: "Les Rouges",    c1: "#CC0000", c2: "#FFFFFF", sport: "foot",   owned: true,  price: null },
  { id: "zèbres",     label: "Les Zèbres",    c1: "#111111", c2: "#FFFFFF", sport: "foot",   owned: false, price: "2.99€" },
  { id: "catalans",   label: "Los Catalans",  c1: "#004D98", c2: "#A50044", sport: "foot",   owned: false, price: "2.99€" },
  { id: "blancos",    label: "Los Blancos",   c1: "#D4AF00", c2: "#FFFFFF", sport: "foot",   owned: false, price: "2.99€" },
  { id: "bavarois",   label: "Die Roten",     c1: "#DC052D", c2: "#0066B2", sport: "foot",   owned: false, price: "2.99€" },
  { id: "parisiens",  label: "Les Parisiens", c1: "#003090", c2: "#ED2939", sport: "foot",   owned: false, price: "2.99€" },
  { id: "rossoneri",  label: "I Rossoneri",   c1: "#FB090B", c2: "#1A1A1A", sport: "foot",   owned: false, price: "2.99€" },
  { id: "cityzens",   label: "The Cityzens",  c1: "#6CABDD", c2: "#FFFFFF", sport: "foot",   owned: false, price: "2.99€" },
  { id: "gunners",    label: "The Gunners",   c1: "#EF0107", c2: "#063672", sport: "foot",   owned: false, price: "2.99€" },
  // ──── BASKET ────
  { id: "violets",    label: "Purple & Gold", c1: "#552583", c2: "#FDB927", sport: "basket", owned: false, price: "2.99€" },
  { id: "taureaux",   label: "Les Taureaux",  c1: "#CE1141", c2: "#1A1A1A", sport: "basket", owned: false, price: "2.99€" },
  { id: "guerriers",  label: "Dub Nation",    c1: "#1D428A", c2: "#FFC72C", sport: "basket", owned: false, price: "2.99€" },
  { id: "verts",      label: "The Garden",    c1: "#007A33", c2: "#FFFFFF", sport: "basket", owned: false, price: "2.99€" },
  { id: "chaleur",    label: "La Chaleur",    c1: "#98002E", c2: "#F9A01B", sport: "basket", owned: false, price: "2.99€" },
  { id: "nets",       label: "The Bridges",   c1: "#000000", c2: "#FFFFFF", sport: "basket", owned: false, price: "2.99€" },
];

// Badge bicolore (legal — aucun logo officiel, juste 2 couleurs + emoji sport)
function ClubBadge({ c1, c2, sport, size = 56 }: { c1: string; c2: string; sport: "foot" | "basket"; size?: number }) {
  return (
    <div className="relative overflow-hidden flex-shrink-0" style={{ width: size, height: size, borderRadius: size * 0.3 }}>
      {/* Moitié gauche */}
      <div className="absolute inset-0" style={{ background: c1 }} />
      {/* Moitié droite diagonal */}
      <div
        className="absolute inset-0"
        style={{
          background: c2,
          clipPath: "polygon(55% 0%, 100% 0%, 100% 100%, 45% 100%)",
        }}
      />
      {/* Emoji sport centré */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span style={{ fontSize: size * 0.36, filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.55))" }}>
          {sport === "foot" ? "⚽" : "🏀"}
        </span>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────────

const weeklyPrizes = [
  { rank: "🥇 1ère", prizes: ["Maillot officiel", "2 places de match", "100€"], color: C.gold, border: "rgba(251,191,36,0.25)" },
  { rank: "🥈 2ème", prizes: ["Maillot officiel", "50€"], color: "#94a3b8", border: "rgba(148,163,184,0.25)" },
  { rank: "🥉 3ème", prizes: ["Équipement sportif", "30€"], color: "#cd7f32", border: "rgba(205,127,50,0.25)" },
  { rank: "🎖️ 4ème", prizes: ["Code VIP × 2", "20€"], color: C.blue, border: "rgba(96,165,250,0.25)" },
];

const badges = [
  { id: "b1", emoji: "🎯", label: "1er prono", unlocked: true },
  { id: "b2", emoji: "🔥", label: "Streak ×3", unlocked: true },
  { id: "b3", emoji: "⚡", label: "All-in", unlocked: true },
  { id: "b4", emoji: "👑", label: "Top 3", unlocked: false },
  { id: "b5", emoji: "💎", label: "Parfait", unlocked: false },
  { id: "b6", emoji: "🦅", label: "Expert", unlocked: false },
  { id: "b7", emoji: "🌟", label: "Communauté", unlocked: false },
  { id: "b8", emoji: "🚀", label: "Niv. 20", unlocked: false },
];

const xpSources = [
  { action: "Pronostic posé", xp: 5, icon: "🎯" },
  { action: "Pronostic gagné", xp: 15, icon: "✅" },
  { action: "Regarder une pub", xp: 10, icon: "📺" },
  { action: "Connexion quotidienne", xp: 5, icon: "📅" },
  { action: "Streak ×5", xp: 25, icon: "🔥" },
  { action: "Événement validé", xp: 30, icon: "💡" },
];

type Tab = "profil" | "boutique";
type ShopTab = "foot" | "basket";

export default function Profile() {
  const { user, gainXP } = useGame();
  const [tab, setTab] = useState<Tab>("profil");
  const [shopTab, setShopTab] = useState<ShopTab>("foot");
  const [activeId, setActiveId] = useState<string>("rouges");
  const [ownedIds, setOwnedIds] = useState<Set<string>>(new Set(["rouges"]));
  const [adsWatched, setAdsWatched] = useState(1);
  const [watchingAd, setWatchingAd] = useState(false);
  const [buying, setBuying] = useState<string | null>(null);

  const xpPct = (user.xp / user.xpToNextLevel) * 100;
  const activeClub = clubs.find((c) => c.id === activeId) ?? clubs[0];

  const handleWatchAd = () => {
    if (adsWatched >= 3 || watchingAd) return;
    setWatchingAd(true);
    setTimeout(() => { gainXP(10); setAdsWatched(a => a + 1); setWatchingAd(false); }, 2000);
  };

  const handleBuy = (id: string) => {
    setBuying(id);
    setTimeout(() => {
      setOwnedIds(prev => new Set([...prev, id]));
      setActiveId(id);
      setBuying(null);
    }, 900);
  };

  const filtered = clubs.filter((c) => c.sport === shopTab);

  return (
    <div style={{ minHeight: "100%" }}>

      {/* ── HERO (fond V8 — vert fixe) ── */}
      <div
        className="relative overflow-hidden px-5 pt-5 pb-6"
        style={{ background: "linear-gradient(135deg, #052e16 0%, #065f46 55%, #047857 100%)" }}
      >
        <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #34d399, transparent)" }} />

        <div className="flex items-center gap-4 relative">
          {/* Avatar = badge cosmétique équipé */}
          <div className="relative shrink-0">
            <div className="rounded-2xl overflow-hidden"
              style={{ width: 72, height: 72, border: "2px solid rgba(255,255,255,0.15)" }}>
              <ClubBadge c1={activeClub.c1} c2={activeClub.c2} sport={activeClub.sport} size={72} />
            </div>
            <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", border: "2px solid #052e16" }}>
              <span style={{ color: "white", fontSize: "0.65rem", fontWeight: 900 }}>{user.level}</span>
            </div>
          </div>

          <div className="flex-1">
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.65rem" }}>
              {activeClub.label}
            </p>
            <p style={{ color: "white", fontSize: "1.15rem", fontWeight: 800, marginTop: 1 }}>{user.username}</p>
            <div className="mt-2.5">
              <div className="flex justify-between mb-1">
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.62rem" }}>Niveau {user.level}</span>
                <span style={{ color: "#fde68a", fontSize: "0.62rem", fontWeight: 700 }}>{user.xp}/{user.xpToNextLevel} XP</span>
              </div>
              <div className="h-1.5 rounded-full" style={{ background: "rgba(0,0,0,0.3)" }}>
                <div className="h-full rounded-full"
                  style={{ width: `${xpPct}%`, background: "linear-gradient(90deg, #fde68a, #fbbf24)" }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="flex gap-2 px-4 py-3 sticky top-0 z-10"
        style={{ background: "rgba(13,9,32,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(168,85,247,0.1)" }}>
        {([
          { key: "profil" as Tab, label: "👤 Profil & Gains", color: C.purple },
          { key: "boutique" as Tab, label: "🛍️ Boutique", color: C.orange },
        ]).map(({ key, label, color }) => (
          <button key={key} onClick={() => setTab(key)}
            className="flex-1 py-2.5 rounded-2xl text-xs font-semibold transition-all"
            style={{
              background: tab === key ? color : "rgba(255,255,255,0.04)",
              color: tab === key ? "white" : C.muted,
              border: `1px solid ${tab === key ? color : "rgba(168,85,247,0.12)"}`,
              boxShadow: tab === key ? `0 6px 20px ${color}30` : "none",
            }}>
            {label}
          </button>
        ))}
      </div>

      <div className="px-4 pt-4 pb-6 space-y-4">

        {/* ── PROFIL & GAINS ── */}
        {tab === "profil" && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Pronos total", value: user.totalPronos, icon: Target, color: C.blue },
                { label: "Victoires", value: user.totalWins, icon: Trophy, color: C.gold },
                { label: "Meilleur rang", value: `#${user.bestRank}`, icon: Star, color: C.purple },
                { label: "Streak actuel", value: `×${user.currentStreak}`, icon: Zap, color: C.green },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="rounded-2xl p-3.5 flex items-center gap-3" style={glass}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}12` }}>
                    <Icon size={18} style={{ color }} />
                  </div>
                  <div>
                    <p style={{ color: C.text, fontWeight: 900, fontSize: "1.2rem", lineHeight: 1 }}>{value}</p>
                    <p style={{ color: C.muted, fontSize: "0.62rem", marginTop: 2 }}>{label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Lots */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Gift size={15} style={{ color: C.gold }} />
                <span style={{ color: C.text, fontWeight: 700, fontSize: "0.9rem" }}>Lots de la semaine</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                  style={{ background: "rgba(251,191,36,0.12)", color: C.gold }}>Top 4</span>
              </div>
              <div className="rounded-2xl p-4 mb-3 flex items-center gap-3"
                style={{ background: "linear-gradient(135deg, rgba(168,85,247,0.08), rgba(96,165,250,0.05))", border: "1px solid rgba(168,85,247,0.25)" }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: "rgba(96,165,250,0.1)" }}>
                  <Trophy size={24} style={{ color: C.blue }} />
                </div>
                <div>
                  <p style={{ color: C.text, fontWeight: 700, fontSize: "0.88rem" }}>
                    Classé <span style={{ color: C.purple, fontSize: "1.1rem" }}>#7</span> cette semaine
                  </p>
                  <p style={{ color: C.muted, fontSize: "0.68rem", marginTop: 2 }}>3 places pour gagner un lot 🎁</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {weeklyPrizes.map(({ rank, prizes, color, border }) => (
                  <div key={rank} className="rounded-2xl p-3" style={{ ...glass, borderColor: border }}>
                    <p style={{ color, fontWeight: 700, fontSize: "0.78rem", marginBottom: 4 }}>{rank}</p>
                    <div className="space-y-0.5">
                      {prizes.map(p => <p key={p} style={{ color: C.muted, fontSize: "0.65rem" }}>· {p}</p>)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* XP */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Zap size={14} style={{ color: C.purple }} />
                <span style={{ color: C.text, fontWeight: 700, fontSize: "0.9rem" }}>Gagner de l'XP</span>
              </div>
              <div className="rounded-2xl p-4 mb-3" style={glass}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p style={{ color: C.text, fontSize: "0.82rem", fontWeight: 600 }}>📺 Vidéos du jour</p>
                    <p style={{ color: C.muted, fontSize: "0.65rem" }}>+10 XP par vidéo</p>
                  </div>
                  <span style={{ color: adsWatched >= 3 ? C.green : C.gold, fontWeight: 700 }}>{adsWatched}/3</span>
                </div>
                <div className="flex gap-1.5 mb-3">
                  {[1, 2, 3].map(n => (
                    <div key={n} className="flex-1 h-1.5 rounded-full"
                      style={{ background: n <= adsWatched ? C.green : "rgba(168,85,247,0.15)" }} />
                  ))}
                </div>
                <button onClick={handleWatchAd} disabled={adsWatched >= 3 || watchingAd}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm"
                  style={{
                    background: adsWatched >= 3 ? "rgba(255,255,255,0.04)" : watchingAd ? "rgba(96,165,250,0.15)" : "linear-gradient(135deg, #1d4ed8, #4c1d95)",
                    color: adsWatched >= 3 ? C.muted : "white",
                    border: adsWatched >= 3 ? "1px solid rgba(168,85,247,0.1)" : "none",
                  }}>
                  {adsWatched >= 3
                    ? <><CheckCircle size={14} style={{ color: C.green }} /> Complété pour aujourd'hui</>
                    : watchingAd ? "⏳ Chargement..."
                    : <><Play size={14} /> Regarder une vidéo</>}
                </button>
              </div>
              <div className="space-y-1.5">
                {xpSources.map(({ action, xp, icon }) => (
                  <div key={action} className="flex items-center justify-between rounded-2xl px-4 py-3" style={glass}>
                    <div className="flex items-center gap-2.5">
                      <span style={{ fontSize: "1rem" }}>{icon}</span>
                      <span style={{ color: C.text, fontSize: "0.8rem" }}>{action}</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold"
                      style={{ background: "rgba(168,85,247,0.12)", color: C.purple }}>+{xp} XP</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Badges */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Star size={14} style={{ color: C.gold }} />
                <span style={{ color: C.text, fontWeight: 700, fontSize: "0.9rem" }}>Mes badges</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {badges.map((badge) => (
                  <div key={badge.id} className="flex flex-col items-center gap-1.5 py-3 px-1 rounded-2xl"
                    style={{ ...glass, opacity: badge.unlocked ? 1 : 0.35, borderColor: badge.unlocked ? "rgba(168,85,247,0.25)" : "rgba(168,85,247,0.08)", background: badge.unlocked ? "rgba(168,85,247,0.07)" : "rgba(255,255,255,0.02)" }}>
                    <div className="relative">
                      <span style={{ fontSize: "1.6rem" }}>{badge.emoji}</span>
                      {!badge.unlocked && <Lock size={9} style={{ color: C.muted, position: "absolute", bottom: 0, right: -2 }} />}
                    </div>
                    <p style={{ color: badge.unlocked ? C.text : C.muted, fontSize: "0.57rem", textAlign: "center", lineHeight: 1.2 }}>
                      {badge.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Settings */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Settings size={14} style={{ color: C.muted }} />
                <span style={{ color: C.text, fontWeight: 700, fontSize: "0.9rem" }}>Paramètres</span>
              </div>
              <div className="space-y-1.5">
                {[
                  { icon: Shield, label: "Confidentialité & RGPD", color: C.blue },
                  { icon: Settings, label: "Mon compte", color: C.muted },
                ].map(({ icon: Icon, label, color }) => (
                  <button key={label} className="w-full flex items-center justify-between rounded-2xl px-4 py-3.5" style={glass}>
                    <div className="flex items-center gap-3">
                      <Icon size={15} style={{ color }} />
                      <span style={{ color: C.text, fontSize: "0.82rem" }}>{label}</span>
                    </div>
                    <ChevronRight size={14} style={{ color: C.muted }} />
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl px-4 py-3" style={glass}>
              <p style={{ color: C.muted, fontSize: "0.62rem", lineHeight: 1.6 }}>
                App gratuite · Aucun pari réel · Conforme ARJEL &amp; CNIL · RGPD · 18+
              </p>
            </div>
          </>
        )}

        {/* ── BOUTIQUE ── */}
        {tab === "boutique" && (
          <>
            {/* Info */}
            <div className="flex items-center gap-2 rounded-2xl px-4 py-3"
              style={{ background: "rgba(251,146,60,0.08)", border: "1px solid rgba(251,146,60,0.2)" }}>
              <Sparkles size={14} style={{ color: C.orange }} />
              <p style={{ color: C.orange, fontSize: "0.72rem", fontWeight: 600 }}>
                Cosmétiques uniquement · Aucun avantage compétitif
              </p>
            </div>

            {/* Sous-onglets Foot / Basket */}
            <div className="flex gap-2">
              {([
                { key: "foot" as ShopTab, label: "⚽ Football" },
                { key: "basket" as ShopTab, label: "🏀 Basket" },
              ]).map(({ key, label }) => (
                <button key={key} onClick={() => setShopTab(key)}
                  className="flex-1 py-2.5 rounded-2xl text-xs font-semibold transition-all"
                  style={{
                    background: shopTab === key ? C.orange : "rgba(255,255,255,0.04)",
                    color: shopTab === key ? "white" : C.muted,
                    border: `1px solid ${shopTab === key ? C.orange : "rgba(168,85,247,0.12)"}`,
                    boxShadow: shopTab === key ? `0 6px 20px rgba(251,146,60,0.25)` : "none",
                  }}>
                  {label}
                </button>
              ))}
            </div>

            {/* Grille 3 colonnes (comme avatars V8) */}
            <div className="grid grid-cols-3 gap-2">
              {filtered.map((club) => {
                const isOwned = ownedIds.has(club.id);
                const isActive = activeId === club.id;
                const isBuying = buying === club.id;

                return (
                  <button
                    key={club.id}
                    onClick={() => isOwned ? setActiveId(club.id) : !isBuying && handleBuy(club.id)}
                    className="rounded-2xl p-3 flex flex-col items-center gap-2 transition-all"
                    style={{
                      ...glass,
                      borderColor: isActive ? C.orange : "rgba(168,85,247,0.12)",
                      background: isActive ? "rgba(251,146,60,0.1)" : "rgba(255,255,255,0.04)",
                      opacity: isOwned ? 1 : 0.6,
                      boxShadow: isActive ? `0 4px 16px rgba(251,146,60,0.2)` : "none",
                    }}
                  >
                    {/* Badge bicolore */}
                    <ClubBadge c1={club.c1} c2={club.c2} sport={club.sport} size={52} />

                    {/* Label */}
                    <p style={{ color: C.text, fontSize: "0.65rem", fontWeight: 600, textAlign: "center", lineHeight: 1.3 }}>
                      {club.label}
                    </p>

                    {/* État */}
                    {isOwned ? (
                      <span style={{ color: isActive ? C.orange : C.green, fontSize: "0.6rem", fontWeight: 700 }}>
                        {isActive ? "✓ Équipé" : "Possédé"}
                      </span>
                    ) : isBuying ? (
                      <span style={{ color: C.gold, fontSize: "0.6rem", fontWeight: 700 }}>⏳</span>
                    ) : (
                      <span style={{ color: C.pink, fontSize: "0.68rem", fontWeight: 700 }}>{club.price}</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Packs */}
            <div className="space-y-2">
              {[
                { name: "Pack Débutant", desc: "3 identités au choix", price: "4.99€", color: C.blue, icon: "🎁" },
                { name: "Pack Champion", desc: "Toutes les identités", price: "9.99€", color: C.gold, icon: "👑" },
              ].map((pack) => (
                <div key={pack.name} className="rounded-2xl p-4 flex items-center justify-between"
                  style={{ ...glass, borderColor: `${pack.color}20` }}>
                  <div className="flex items-center gap-3">
                    <span style={{ fontSize: "2rem" }}>{pack.icon}</span>
                    <div>
                      <p style={{ color: C.text, fontWeight: 700, fontSize: "0.88rem" }}>{pack.name}</p>
                      <p style={{ color: C.muted, fontSize: "0.68rem" }}>{pack.desc}</p>
                    </div>
                  </div>
                  <button className="px-3.5 py-2 rounded-xl font-bold text-sm"
                    style={{ background: `${pack.color}15`, color: pack.color, border: `1px solid ${pack.color}30` }}>
                    {pack.price}
                  </button>
                </div>
              ))}
              <p style={{ color: C.muted, fontSize: "0.62rem", textAlign: "center", marginTop: 4 }}>
                App Store / Play Store · Aucun avantage compétitif
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
