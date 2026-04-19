import { useState } from "react";
import {
  Sparkles, Plus, Users, Clock, CheckCircle,
  Zap, Trophy, Repeat, Star, ArrowRight,
} from "lucide-react";
import { useGame, EventCategory } from "../../context/GameContext";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "../ui/dialog";
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

type CatCfg = { label: string; icon: React.ReactNode; color: string; bg: string; gradient: string };
const catCfg: Record<EventCategory, CatCfg> = {
  transfert: { label: "Transfert", icon: <Repeat size={13} />, color: C.pink, bg: "rgba(244,114,182,0.1)", gradient: "linear-gradient(135deg, #86198f, #ec4899)" },
  classement: { label: "Classement", icon: <Trophy size={13} />, color: C.gold, bg: "rgba(251,191,36,0.1)", gradient: "linear-gradient(135deg, #92400e, #f59e0b)" },
  performance: { label: "Performance", icon: <Zap size={13} />, color: C.orange, bg: "rgba(251,146,60,0.1)", gradient: "linear-gradient(135deg, #9a3412, #f97316)" },
  autre: { label: "Autre", icon: <Star size={13} />, color: C.purple, bg: "rgba(168,85,247,0.1)", gradient: "linear-gradient(135deg, #4c1d95, #a855f7)" },
};

type TabKey = "live" | "soumissions";

export default function Events() {
  const { communityEvents, weekly, submitEvent, voteOnEvent, gainXP, user } = useGame();
  const [tab, setTab] = useState<TabKey>("live");
  const [voteModal, setVoteModal] = useState<{ eventId: string; optionLabel: string } | null>(null);
  const [stake, setStake] = useState(10);
  const [createOpen, setCreateOpen] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "", description: "", category: "transfert" as EventCategory,
    deadline: "", opt1: "Oui", opt1Coeff: "2.0", opt2: "Non", opt2Coeff: "1.8",
  });

  const pointsLeft = weekly.pointsTotal - weekly.pointsUsed;
  const liveEvents = communityEvents.filter((e) => e.status === "live");
  const mySubmissions = communityEvents.filter((e) => e.createdBy === user.username);

  const openVote = (eventId: string, optionLabel: string) => {
    setStake(Math.max(5, Math.min(10, pointsLeft)));
    setVoteModal({ eventId, optionLabel }); setMsg(null);
  };

  const handleVote = () => {
    if (!voteModal) return;
    const ok = voteOnEvent(voteModal.eventId, voteModal.optionLabel, stake);
    if (ok) { gainXP(8); setMsg("🎉 Vote enregistré !"); setTimeout(() => { setVoteModal(null); setMsg(null); }, 1500); }
    else setMsg("❌ Points insuffisants.");
  };

  const handleSubmit = () => {
    if (!form.title.trim() || !form.deadline.trim()) { setMsg("❌ Remplis les champs obligatoires."); return; }
    submitEvent({
      title: form.title.trim(), description: form.description.trim(), category: form.category,
      deadline: form.deadline.trim(),
      options: [
        { label: form.opt1 || "Oui", coefficient: parseFloat(form.opt1Coeff) || 2.0, participants: 0 },
        { label: form.opt2 || "Non", coefficient: parseFloat(form.opt2Coeff) || 1.8, participants: 0 },
      ],
    });
    setMsg("✅ Soumis ! Validation sous 24–48h.");
    setTimeout(() => {
      setCreateOpen(false); setMsg(null);
      setForm({ title: "", description: "", category: "transfert", deadline: "", opt1: "Oui", opt1Coeff: "2.0", opt2: "Non", opt2Coeff: "1.8" });
    }, 2000);
  };

  const voteEvent = communityEvents.find((e) => e.id === voteModal?.eventId);
  const voteOption = voteEvent?.options.find((o) => o.label === voteModal?.optionLabel);
  const potential = voteOption ? Math.round(stake * voteOption.coefficient) : 0;

  return (
    <div style={{ minHeight: "100%" }}>
      {/* Header */}
      <div className="px-5 pt-5 pb-5"
        style={{ background: "linear-gradient(135deg, #4a044e 0%, #86198f 55%, #9d174d 100%)" }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={18} color="white" />
              <h1 style={{ color: "white", fontSize: "1.3rem", fontWeight: 800 }}>Événements</h1>
            </div>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.7rem" }}>
              Pronostics communautaires · {liveEvents.length} en cours
            </p>
          </div>
          <button
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl font-bold text-sm"
            style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)", color: "white" }}>
            <Plus size={15} /> Proposer
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "En cours", value: liveEvents.length, color: "rgba(255,255,255,0.9)" },
            { label: "Mes votes", value: liveEvents.filter(e => e.myVote).length, color: "#fde68a" },
            { label: "Soumissions", value: mySubmissions.length, color: "#d9f99d" },
          ].map(({ label, value, color }) => (
            <div key={label} className="text-center py-2.5 rounded-2xl"
              style={{ background: "rgba(0,0,0,0.2)" }}>
              <p style={{ color, fontWeight: 900, fontSize: "1.2rem", lineHeight: 1 }}>{value}</p>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.6rem", marginTop: 2 }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 pb-4">
        {/* Tabs */}
        <div className="flex gap-2 py-3.5">
          {([
            { key: "live" as TabKey, label: `🔴 En cours (${liveEvents.length})` },
            { key: "soumissions" as TabKey, label: `✍️ Mes soumissions` },
          ]).map(({ key, label }) => (
            <button key={key} onClick={() => setTab(key)}
              className="flex-1 py-2.5 rounded-2xl text-xs font-semibold transition-all"
              style={{
                background: tab === key ? C.pink : "rgba(255,255,255,0.04)",
                color: tab === key ? "white" : C.muted,
                border: `1px solid ${tab === key ? C.pink : "rgba(168,85,247,0.12)"}`,
                boxShadow: tab === key ? `0 6px 20px rgba(244,114,182,0.3)` : "none",
              }}>
              {label}
            </button>
          ))}
        </div>

        {/* ── LIVE EVENTS ── */}
        {tab === "live" && (
          <div className="space-y-3">
            {liveEvents.map((ev) => {
              const cfg = catCfg[ev.category];
              const totalVotes = ev.options.reduce((s, o) => s + o.participants, 0);
              const hasVoted = !!ev.myVote;

              return (
                <div key={ev.id} className="rounded-2xl overflow-hidden"
                  style={{ ...glass, borderColor: hasVoted ? `${cfg.color}35` : "rgba(168,85,247,0.12)" }}>

                  {/* Top bar */}
                  <div className="flex items-center justify-between px-4 py-2.5"
                    style={{ background: cfg.bg, borderBottom: `1px solid ${cfg.color}15` }}>
                    <div className="flex items-center gap-2">
                      <span style={{ color: cfg.color }}>{cfg.icon}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold"
                        style={{ background: `${cfg.color}20`, color: cfg.color }}>
                        {cfg.label}
                      </span>
                      {ev.featured && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                          style={{ background: "rgba(251,191,36,0.15)", color: C.gold }}>
                          ⭐
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={11} style={{ color: C.muted }} />
                      <span style={{ color: C.muted, fontSize: "0.62rem" }}>{ev.totalParticipants.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="px-4 py-3.5">
                    <p style={{ color: C.text, fontWeight: 700, fontSize: "0.95rem", marginBottom: 4, lineHeight: 1.35 }}>
                      {ev.title}
                    </p>
                    {ev.description && (
                      <p style={{ color: C.muted, fontSize: "0.7rem", marginBottom: 12, lineHeight: 1.4 }}>{ev.description}</p>
                    )}

                    {/* Vote buttons */}
                    <div className="flex gap-2 mb-3">
                      {ev.options.map((opt) => {
                        const pct = totalVotes > 0 ? Math.round((opt.participants / totalVotes) * 100) : 0;
                        const isMyVote = ev.myVote === opt.label;
                        return (
                          <button key={opt.label}
                            onClick={() => !hasVoted && openVote(ev.id, opt.label)}
                            disabled={hasVoted}
                            className="flex-1 rounded-2xl overflow-hidden transition-all"
                            style={{
                              border: `1.5px solid ${isMyVote ? cfg.color : "rgba(168,85,247,0.15)"}`,
                              cursor: hasVoted ? "default" : "pointer",
                              boxShadow: isMyVote ? `0 4px 12px ${cfg.color}25` : "none",
                            }}>
                            <div className="px-3 py-2.5 text-center"
                              style={{ background: isMyVote ? `${cfg.color}15` : "rgba(255,255,255,0.03)" }}>
                              <p style={{ color: cfg.color, fontWeight: 900, fontSize: "1.05rem" }}>×{opt.coefficient}</p>
                              <p style={{ color: C.text, fontSize: "0.7rem", fontWeight: 600 }}>
                                {opt.label} {isMyVote && "✓"}
                              </p>
                            </div>
                            {hasVoted && (
                              <div className="px-3 pb-2 pt-1">
                                <div className="h-1.5 rounded-full" style={{ background: "rgba(168,85,247,0.1)" }}>
                                  <div className="h-full rounded-full"
                                    style={{ width: `${pct}%`, background: isMyVote ? cfg.color : "rgba(255,255,255,0.15)" }} />
                                </div>
                                <p style={{ color: C.muted, fontSize: "0.58rem", marginTop: 2 }}>{pct}%</p>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {hasVoted && (
                      <div className="flex items-center gap-2 px-3 py-2 rounded-xl mb-3"
                        style={{ background: `${cfg.color}08`, border: `1px solid ${cfg.color}20` }}>
                        <CheckCircle size={13} style={{ color: cfg.color }} />
                        <p style={{ color: cfg.color, fontSize: "0.7rem", fontWeight: 600 }}>
                          Voté «{ev.myVote}» — gain potentiel{" "}
                          {Math.round((ev.myPoints || 0) * (ev.options.find(o => o.label === ev.myVote)?.coefficient || 1))} pts
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Clock size={10} style={{ color: C.muted }} />
                        <span style={{ color: C.muted, fontSize: "0.62rem" }}>Limite : {ev.deadline}</span>
                      </div>
                      <span style={{ color: C.muted, fontSize: "0.62rem" }}>
                        par <span style={{ color: cfg.color, fontWeight: 600 }}>{ev.createdBy}</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── MES SOUMISSIONS ── */}
        {tab === "soumissions" && (
          <div className="space-y-3">
            {mySubmissions.length === 0 ? (
              <div className="rounded-2xl p-8 flex flex-col items-center gap-4" style={glass}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ background: "rgba(244,114,182,0.12)" }}>
                  <Sparkles size={28} style={{ color: C.pink }} />
                </div>
                <div className="text-center">
                  <p style={{ color: C.text, fontSize: "0.9rem", fontWeight: 700 }}>Propose ton événement</p>
                  <p style={{ color: C.muted, fontSize: "0.72rem", marginTop: 4 }}>
                    Partage tes prédictions avec la communauté
                  </p>
                </div>
                <button onClick={() => setCreateOpen(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm"
                  style={{ background: "linear-gradient(135deg, #86198f, #ec4899)", color: "white" }}>
                  <Plus size={16} /> Créer un événement
                </button>
                <p style={{ color: C.muted, fontSize: "0.65rem" }}>+30 XP à la validation ✨</p>
              </div>
            ) : (
              <>
                {mySubmissions.map((ev) => {
                  const cfg = catCfg[ev.category];
                  const statusColor = ev.status === "live" ? C.green : ev.status === "pending" ? C.gold : "#f87171";
                  const statusLabel = ev.status === "live" ? "✅ En ligne" : ev.status === "pending" ? "⏳ En validation" : "❌ Refusé";
                  return (
                    <div key={ev.id} className="rounded-2xl p-4" style={{ ...glass, borderColor: `${cfg.color}20` }}>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold"
                          style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold"
                          style={{ background: `${statusColor}12`, color: statusColor }}>{statusLabel}</span>
                      </div>
                      <p style={{ color: C.text, fontWeight: 700, fontSize: "0.9rem", marginBottom: 12 }}>{ev.title}</p>
                      <div className="flex gap-2">
                        {ev.options.map((o) => (
                          <div key={o.label} className="flex-1 text-center py-2 rounded-xl"
                            style={{ background: cfg.bg }}>
                            <p style={{ color: cfg.color, fontWeight: 900, fontSize: "0.9rem" }}>×{o.coefficient}</p>
                            <p style={{ color: C.muted, fontSize: "0.6rem" }}>{o.label}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-3 mt-3" style={{ fontSize: "0.63rem", color: C.muted }}>
                        <span><Users size={10} className="inline mr-0.5" />{ev.totalParticipants} participants</span>
                        <span><Clock size={10} className="inline mr-0.5" />{ev.deadline}</span>
                      </div>
                      {ev.status === "pending" && (
                        <p style={{ color: C.muted, fontSize: "0.63rem", marginTop: 8, fontStyle: "italic" }}>
                          IA + modérateur humain · 24–48h
                        </p>
                      )}
                    </div>
                  );
                })}
                <button onClick={() => setCreateOpen(true)}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm"
                  style={{ background: "linear-gradient(135deg, #86198f, #ec4899)", color: "white" }}>
                  <Plus size={16} /> Nouvel événement (+30 XP)
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* ── VOTE MODAL ── */}
      <Dialog open={!!voteModal} onOpenChange={(o) => !o && setVoteModal(null)}>
        <DialogContent className="p-0 overflow-hidden max-w-sm"
          style={{ background: "#150d35", border: "1px solid rgba(168,85,247,0.25)", borderRadius: 24 }}>
          {voteEvent && voteOption && (() => {
            const cfg = catCfg[voteEvent.category];
            return (
              <div>
                <DialogTitle className="sr-only">Voter sur un événement</DialogTitle>
                <DialogDescription className="sr-only">Choisis une option et mise des points sur cet événement communautaire.</DialogDescription>
                <div className="px-5 py-4" style={{ background: cfg.bg, borderBottom: "1px solid rgba(168,85,247,0.1)" }}>
                  <p style={{ color: C.muted, fontSize: "0.68rem", marginBottom: 4 }}>Voter sur</p>
                  <p style={{ color: C.text, fontWeight: 700, fontSize: "0.95rem", lineHeight: 1.35 }}>{voteEvent.title}</p>
                </div>

                <div className="px-5 py-4 space-y-4">
                  {/* Options */}
                  <div>
                    <p style={{ color: C.muted, fontSize: "0.7rem", marginBottom: 8 }}>Ton choix</p>
                    <div className="flex gap-2">
                      {voteEvent.options.map((opt) => {
                        const isSelected = voteModal?.optionLabel === opt.label;
                        return (
                          <button key={opt.label}
                            onClick={() => setVoteModal({ eventId: voteEvent.id, optionLabel: opt.label })}
                            className="flex-1 py-3 rounded-2xl text-center transition-all"
                            style={{
                              background: isSelected ? `${cfg.color}15` : "rgba(255,255,255,0.04)",
                              border: `1.5px solid ${isSelected ? cfg.color : "rgba(168,85,247,0.15)"}`,
                              boxShadow: isSelected ? `0 4px 16px ${cfg.color}25` : "none",
                            }}>
                            <p style={{ color: cfg.color, fontWeight: 900, fontSize: "1rem" }}>×{opt.coefficient}</p>
                            <p style={{ color: C.text, fontSize: "0.7rem", fontWeight: 600 }}>{opt.label}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Stake */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <p style={{ color: C.muted, fontSize: "0.7rem" }}>Points à miser</p>
                      <p style={{ color: C.text, fontWeight: 700 }}>{stake} pts</p>
                    </div>
                    <Slider value={[stake]} onValueChange={([v]) => setStake(v)} min={5} max={Math.max(5, pointsLeft)} step={5} />
                    <div className="flex justify-between mt-1.5">
                      <span style={{ color: C.muted, fontSize: "0.62rem" }}>5 min</span>
                      <span style={{ color: C.muted, fontSize: "0.62rem" }}>{pointsLeft} max</span>
                    </div>
                  </div>

                  {/* Gain */}
                  <div className="rounded-2xl p-4 flex items-center justify-between"
                    style={{ background: `${cfg.color}08`, border: `1px solid ${cfg.color}20` }}>
                    <div>
                      <p style={{ color: C.muted, fontSize: "0.68rem" }}>Gain potentiel si ✅</p>
                      <p style={{ color: C.text, fontWeight: 900, fontSize: "1.8rem", lineHeight: 1 }}>
                        {potential}<span style={{ color: C.muted, fontSize: "0.8rem", fontWeight: 400 }}> pts</span>
                      </p>
                    </div>
                    <div className="px-3 py-2 rounded-xl" style={{ background: `${cfg.color}15` }}>
                      <p style={{ color: cfg.color, fontSize: "1.1rem", fontWeight: 900 }}>×{voteOption.coefficient}</p>
                    </div>
                  </div>

                  {msg && (
                    <p className="text-center text-sm font-semibold"
                      style={{ color: msg.startsWith("🎉") ? C.green : "#f87171" }}>{msg}</p>
                  )}

                  <button onClick={handleVote} disabled={pointsLeft < 5}
                    className="w-full py-3.5 rounded-2xl font-bold text-sm"
                    style={{
                      background: pointsLeft < 5 ? "rgba(255,255,255,0.05)" : cfg.gradient,
                      color: pointsLeft < 5 ? C.muted : "white",
                    }}>
                    {pointsLeft < 5 ? "Points insuffisants" : "Confirmer mon vote"}
                  </button>
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* ── CREATE MODAL ── */}
      <Dialog open={createOpen} onOpenChange={(o) => { if (!o) { setCreateOpen(false); setMsg(null); } }}>
        <DialogContent className="p-0 overflow-hidden max-w-sm"
          style={{ background: "#150d35", border: "1px solid rgba(168,85,247,0.25)", borderRadius: 24, maxHeight: "90vh", overflowY: "auto" }}>
          <div className="px-5 py-4 flex items-center justify-between"
            style={{ background: "rgba(244,114,182,0.08)", borderBottom: "1px solid rgba(168,85,247,0.12)" }}>
            <div>
              <DialogTitle style={{ color: C.text, fontWeight: 800, fontSize: "1rem" }}>Proposer un événement</DialogTitle>
              <DialogDescription style={{ color: C.muted, fontSize: "0.68rem", marginTop: 2 }}>Validation 24–48h</DialogDescription>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold"
              style={{ background: "rgba(168,85,247,0.15)", color: C.purple }}>
              +30 XP
            </span>
          </div>

          <div className="px-5 py-4 space-y-4">
            {/* Category */}
            <div>
              <p style={{ color: C.muted, fontSize: "0.7rem", marginBottom: 8 }}>Catégorie *</p>
              <div className="grid grid-cols-2 gap-2">
                {(Object.entries(catCfg) as [EventCategory, CatCfg][]).map(([key, cfg]) => (
                  <button key={key} onClick={() => setForm((f) => ({ ...f, category: key }))}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-2xl transition-all"
                    style={{
                      background: form.category === key ? cfg.bg : "rgba(255,255,255,0.03)",
                      border: `1.5px solid ${form.category === key ? cfg.color : "rgba(168,85,247,0.12)"}`,
                    }}>
                    <span style={{ color: cfg.color }}>{cfg.icon}</span>
                    <span style={{ color: form.category === key ? cfg.color : C.muted, fontSize: "0.78rem", fontWeight: form.category === key ? 700 : 400 }}>
                      {cfg.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <p style={{ color: C.muted, fontSize: "0.7rem", marginBottom: 6 }}>Titre *</p>
              <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Ex : Mbappé rejoindra Arsenal cet été"
                className="w-full px-4 py-3 rounded-2xl outline-none"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(168,85,247,0.15)", color: C.text, fontSize: "0.85rem" }} />
            </div>

            {/* Description */}
            <div>
              <p style={{ color: C.muted, fontSize: "0.7rem", marginBottom: 6 }}>Description <span style={{ opacity: 0.5 }}>(optionnel)</span></p>
              <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Contexte, sources..." rows={2}
                className="w-full px-4 py-3 rounded-2xl outline-none resize-none"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(168,85,247,0.15)", color: C.text, fontSize: "0.82rem", fontFamily: "inherit" }} />
            </div>

            {/* Deadline */}
            <div>
              <p style={{ color: C.muted, fontSize: "0.7rem", marginBottom: 6 }}>Date limite *</p>
              <input value={form.deadline} onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))}
                placeholder="Ex : 30 Juin 2025"
                className="w-full px-4 py-3 rounded-2xl outline-none"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(168,85,247,0.15)", color: C.text, fontSize: "0.85rem" }} />
            </div>

            {/* Options */}
            <div>
              <p style={{ color: C.muted, fontSize: "0.7rem", marginBottom: 8 }}>Options & cotes</p>
              {[
                { opt: "opt1", coeff: "opt1Coeff", placeholder: "Oui", num: 1 },
                { opt: "opt2", coeff: "opt2Coeff", placeholder: "Non", num: 2 },
              ].map(({ opt, coeff, placeholder, num }) => (
                <div key={opt} className="flex gap-2 mb-2">
                  <input value={form[opt as keyof typeof form]}
                    onChange={(e) => setForm((f) => ({ ...f, [opt]: e.target.value }))}
                    placeholder={`Option ${num}`}
                    className="flex-1 px-3 py-2.5 rounded-xl outline-none"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(168,85,247,0.15)", color: C.text, fontSize: "0.82rem" }} />
                  <input value={form[coeff as keyof typeof form]}
                    onChange={(e) => setForm((f) => ({ ...f, [coeff]: e.target.value }))}
                    placeholder="×2.0" type="number" step="0.1" min="1"
                    className="w-16 px-2 py-2.5 rounded-xl outline-none text-center"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(168,85,247,0.15)", color: C.pink, fontSize: "0.85rem", fontWeight: 700 }} />
                </div>
              ))}
            </div>

            <div className="rounded-2xl px-4 py-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(168,85,247,0.1)" }}>
              <p style={{ color: C.muted, fontSize: "0.62rem", lineHeight: 1.5 }}>
                ℹ️ Ton événement sera vérifié par IA puis par un modérateur avant publication.
              </p>
            </div>

            {msg && (
              <p className="text-center text-sm font-semibold"
                style={{ color: msg.startsWith("✅") ? C.green : "#f87171" }}>{msg}</p>
            )}

            <button onClick={handleSubmit}
              className="w-full py-3.5 rounded-2xl font-bold text-sm"
              style={{ background: "linear-gradient(135deg, #86198f, #ec4899)", color: "white" }}>
              Soumettre l'événement
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}