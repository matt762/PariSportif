import React, { createContext, useContext, useState, ReactNode } from "react";

export type Sport = "football" | "basketball" | "tennis" | "autre";
export type PredictionStatus = "pending" | "won" | "lost";
export type EventCategory = "transfert" | "classement" | "performance" | "autre";
export type EventStatus = "pending" | "validated" | "live" | "closed";

export interface Prediction {
  id: string;
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  sport: Sport;
  choice: string;
  coefficient: number;
  points: number;
  potentialScore: number;
  status: PredictionStatus;
  matchDate: string;
  matchTime: string;
}

export interface EventOption {
  label: string;
  coefficient: number;
  participants: number;
}

export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  createdBy: string;
  isUserCreated: boolean;
  status: EventStatus;
  options: EventOption[];
  deadline: string;
  totalParticipants: number;
  featured: boolean;
  myVote?: string;
  myPoints?: number;
}

export interface User {
  username: string;
  avatar: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  frame: string;
  usernameColor: string;
  totalWins: number;
  bestRank: number;
  currentStreak: number;
  totalPronos: number;
}

export interface WeeklyState {
  pointsTotal: number;
  pointsUsed: number;
  pronosMax: number;
  currentScore: number;
  weekLabel: string;
  predictions: Prediction[];
}

export interface LeaguePlayer {
  rank: number;
  username: string;
  avatar: string;
  score: number;
  pronos: number;
  isCurrentUser: boolean;
  frame?: string;
}

interface GameContextType {
  user: User;
  weekly: WeeklyState;
  leaguePlayers: LeaguePlayer[];
  communityEvents: CommunityEvent[];
  addPrediction: (pred: Omit<Prediction, "id">) => boolean;
  gainXP: (amount: number) => void;
  submitEvent: (event: Omit<CommunityEvent, "id" | "createdBy" | "isUserCreated" | "status" | "totalParticipants" | "featured" | "myVote" | "myPoints">) => void;
  voteOnEvent: (eventId: string, optionLabel: string, points: number) => boolean;
}

const initialLeague: LeaguePlayer[] = [
  { rank: 1, username: "PronoKing99", avatar: "👑", score: 512, pronos: 9, isCurrentUser: false, frame: "gold" },
  { rank: 2, username: "BetMaster_FR", avatar: "🔥", score: 478, pronos: 10, isCurrentUser: false, frame: "fire" },
  { rank: 3, username: "SportsPro42", avatar: "⚡", score: 421, pronos: 8, isCurrentUser: false },
  { rank: 4, username: "NightOwl_Bet", avatar: "🦉", score: 389, pronos: 9, isCurrentUser: false },
  { rank: 5, username: "Footix2024", avatar: "⚽", score: 365, pronos: 7, isCurrentUser: false },
  { rank: 6, username: "ZounaProno", avatar: "🎯", score: 344, pronos: 8, isCurrentUser: false },
  { rank: 7, username: "ThunderStrike47", avatar: "⚡", score: 312, pronos: 6, isCurrentUser: true, frame: "gold" },
  { rank: 8, username: "Mikael_Sport", avatar: "🏆", score: 298, pronos: 7, isCurrentUser: false },
  { rank: 9, username: "ProTipster_FR", avatar: "💡", score: 271, pronos: 6, isCurrentUser: false },
  { rank: 10, username: "SkyBet_Ninja", avatar: "🥷", score: 245, pronos: 5, isCurrentUser: false },
  { rank: 11, username: "Alexis_Prono", avatar: "🎱", score: 231, pronos: 6, isCurrentUser: false },
  { rank: 12, username: "Goal_Hunter", avatar: "🏹", score: 218, pronos: 5, isCurrentUser: false },
  { rank: 13, username: "Paris_Pronoste", avatar: "🗼", score: 203, pronos: 5, isCurrentUser: false },
  { rank: 14, username: "RocketMan_77", avatar: "🚀", score: 189, pronos: 4, isCurrentUser: false },
  { rank: 15, username: "LeGrand_Score", avatar: "🎲", score: 172, pronos: 4, isCurrentUser: false },
];

const initialPredictions: Prediction[] = [
  {
    id: "p1", matchId: "m1",
    homeTeam: "PSG", awayTeam: "Real Madrid",
    sport: "football", choice: "Victoire PSG",
    coefficient: 2.1, points: 50, potentialScore: 105,
    status: "pending", matchDate: "Mer 26 Mar", matchTime: "21:00",
  },
  {
    id: "p2", matchId: "m2",
    homeTeam: "Lakers", awayTeam: "Warriors",
    sport: "basketball", choice: "Lakers +7.5",
    coefficient: 1.8, points: 40, potentialScore: 72,
    status: "pending", matchDate: "Mer 26 Mar", matchTime: "02:30",
  },
  {
    id: "p4", matchId: "m4",
    homeTeam: "Man City", awayTeam: "Arsenal",
    sport: "football", choice: "Nul",
    coefficient: 3.4, points: 20, potentialScore: 68,
    status: "won", matchDate: "Mar 25 Mar", matchTime: "20:45",
  },
  {
    id: "p5", matchId: "m5",
    homeTeam: "Bayern", awayTeam: "Dortmund",
    sport: "football", choice: "Victoire Bayern",
    coefficient: 1.4, points: 45, potentialScore: 63,
    status: "lost", matchDate: "Mar 25 Mar", matchTime: "18:30",
  },
];

const initialEvents: CommunityEvent[] = [
  {
    id: "e1",
    title: "Kylian Mbappé rejoint Arsenal cet été",
    description: "Après sa première saison au Real Madrid, Mbappé pourrait-il rejoindre les Gunners ?",
    category: "transfert",
    createdBy: "PronoKing99",
    isUserCreated: true,
    status: "live",
    options: [
      { label: "Oui, il signe", coefficient: 3.5, participants: 1240 },
      { label: "Non, il reste", coefficient: 1.3, participants: 3120 },
    ],
    deadline: "30 Juin 2025",
    totalParticipants: 4360,
    featured: true,
  },
  {
    id: "e2",
    title: "PSG remporte la Ligue des Champions 24/25",
    description: "Le Paris Saint-Germain peut-il décrocher enfin sa première LDC ?",
    category: "classement",
    createdBy: "BetMaster_FR",
    isUserCreated: true,
    status: "live",
    options: [
      { label: "PSG champion", coefficient: 4.0, participants: 2180 },
      { label: "Un autre club", coefficient: 1.2, participants: 5430 },
    ],
    deadline: "31 Mai 2025",
    totalParticipants: 7610,
    featured: true,
  },
  {
    id: "e3",
    title: "Erling Haaland dépasse 50 buts en PL",
    description: "La machine norvégienne peut-elle battre tous les records cette saison ?",
    category: "performance",
    createdBy: "Footix2024",
    isUserCreated: true,
    status: "live",
    options: [
      { label: "Oui, record battu", coefficient: 2.8, participants: 890 },
      { label: "Non, en dessous", coefficient: 1.5, participants: 1650 },
    ],
    deadline: "25 Mai 2025",
    totalParticipants: 2540,
    featured: false,
  },
  {
    id: "e4",
    title: "Vinicius Jr remporte le Ballon d'Or 2025",
    description: "Après avoir été privé de son titre, Vini Jr va-t-il enfin décrocher la récompense suprême ?",
    category: "performance",
    createdBy: "SportsPro42",
    isUserCreated: true,
    status: "live",
    options: [
      { label: "Oui, il le mérite", coefficient: 2.2, participants: 3100 },
      { label: "Non, un autre", coefficient: 1.8, participants: 2900 },
    ],
    deadline: "Oct 2025",
    totalParticipants: 6000,
    featured: false,
  },
  {
    id: "e5",
    title: "Cristiano Ronaldo prend sa retraite avant 2026",
    description: "Le quintuple Ballon d'Or va-t-il raccrocher les crampons cette année ?",
    category: "autre",
    createdBy: "NightOwl_Bet",
    isUserCreated: true,
    status: "live",
    options: [
      { label: "Il arrête", coefficient: 3.0, participants: 980 },
      { label: "Il continue", coefficient: 1.4, participants: 2100 },
    ],
    deadline: "31 Déc 2025",
    totalParticipants: 3080,
    featured: false,
  },
  {
    id: "e6",
    title: "Marcus Rashford rejoint un club de Ligue 1",
    description: "L'Anglais en difficulté à ManU pourrait-il tenter l'aventure française ?",
    category: "transfert",
    createdBy: "ThunderStrike47",
    isUserCreated: true,
    status: "pending",
    options: [
      { label: "Oui, cap sur la L1", coefficient: 4.5, participants: 0 },
      { label: "Non, reste en PL", coefficient: 1.2, participants: 0 },
    ],
    deadline: "31 Août 2025",
    totalParticipants: 0,
    featured: false,
  },
];

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>({
    username: "ThunderStrike47",
    avatar: "⚡",
    level: 12,
    xp: 840,
    xpToNextLevel: 1000,
    frame: "gold",
    usernameColor: "#7c3aed",
    totalWins: 127,
    bestRank: 3,
    currentStreak: 4,
    totalPronos: 312,
  });

  const [weekly, setWeekly] = useState<WeeklyState>({
    pointsTotal: 250,
    pointsUsed: 155,
    pronosMax: 10,
    currentScore: 312,
    weekLabel: "Semaine du 24 au 30 mars",
    predictions: initialPredictions,
  });

  const [leaguePlayers, setLeaguePlayers] = useState<LeaguePlayer[]>(initialLeague);
  const [communityEvents, setCommunityEvents] = useState<CommunityEvent[]>(initialEvents);

  const addPrediction = (pred: Omit<Prediction, "id">): boolean => {
    if (weekly.pointsUsed + pred.points > weekly.pointsTotal) return false;
    if (weekly.predictions.filter(p => p.status === "pending").length >= weekly.pronosMax) return false;

    const newPred: Prediction = { ...pred, id: `p${Date.now()}` };
    setWeekly(prev => ({
      ...prev,
      pointsUsed: prev.pointsUsed + pred.points,
      currentScore: prev.currentScore + pred.potentialScore,
      predictions: [...prev.predictions, newPred],
    }));
    setLeaguePlayers(prev =>
      prev.map(p => p.isCurrentUser
        ? { ...p, score: p.score + pred.potentialScore, pronos: p.pronos + 1 }
        : p
      ).sort((a, b) => b.score - a.score).map((p, i) => ({ ...p, rank: i + 1 }))
    );
    return true;
  };

  const voteOnEvent = (eventId: string, optionLabel: string, points: number): boolean => {
    if (weekly.pointsUsed + points > weekly.pointsTotal) return false;
    const event = communityEvents.find(e => e.id === eventId);
    if (!event || event.myVote) return false;

    setWeekly(prev => ({ ...prev, pointsUsed: prev.pointsUsed + points }));
    setCommunityEvents(prev =>
      prev.map(e =>
        e.id === eventId
          ? {
              ...e,
              myVote: optionLabel,
              myPoints: points,
              totalParticipants: e.totalParticipants + 1,
              options: e.options.map(o =>
                o.label === optionLabel ? { ...o, participants: o.participants + 1 } : o
              ),
            }
          : e
      )
    );
    return true;
  };

  const submitEvent = (event: Omit<CommunityEvent, "id" | "createdBy" | "isUserCreated" | "status" | "totalParticipants" | "featured" | "myVote" | "myPoints">) => {
    const newEvent: CommunityEvent = {
      ...event,
      id: `ue${Date.now()}`,
      createdBy: user.username,
      isUserCreated: true,
      status: "pending",
      totalParticipants: 0,
      featured: false,
    };
    setCommunityEvents(prev => [newEvent, ...prev]);
    gainXP(30);
  };

  const gainXP = (amount: number) => {
    setUser(prev => {
      const newXp = prev.xp + amount;
      if (newXp >= prev.xpToNextLevel) {
        return { ...prev, xp: newXp - prev.xpToNextLevel, level: prev.level + 1, xpToNextLevel: prev.xpToNextLevel + 200 };
      }
      return { ...prev, xp: newXp };
    });
  };

  return (
    <GameContext.Provider value={{ user, weekly, leaguePlayers, communityEvents, addPrediction, gainXP, submitEvent, voteOnEvent }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}
