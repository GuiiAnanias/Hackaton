export type MatchStatus = "AGENDADA" | "EM_ANDAMENTO" | "ENCERRADA";

export type MatchPhase =
    | "Grupos"
    | "Oitavas de Final"
    | "Quartas de Final"
    | "Semifinal"
    | "Final";

export type ScoreCriteria =
    | "PLACAR_EXATO"
    | "VENCEDOR"
    | "VENCEDOR_EMPATE"
    | "ERRO"
    | "ERRO_TOTAL"
    | "PENDENTE";

export interface Match {
    id: number;
    teamA: string;
    teamB: string;
    date: string;
    dateISO: string;
    phase: MatchPhase;
    status: MatchStatus;
    stadium: string;
    group?: string;
    scoreA?: number;
    scoreB?: number;
}

export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    avatarUrl?: string;
}

export interface Guess {
    id: string;
    userId: string;
    matchId: number;
    goalsA: number;
    goalsB: number;
    points: number;
    criteria: ScoreCriteria;
    createdAt: string;
}

export interface AuthSession {
    userId: string;
    token: string;
}
