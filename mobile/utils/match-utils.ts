import type { Match, MatchPhase, MatchStatus } from "../types";

export function isMatchLocked(match: Match): boolean {
    if (match.status === "EM_ANDAMENTO" || match.status === "ENCERRADA") {
        return true;
    }
    return new Date(match.dateISO).getTime() <= Date.now();
}

export function filterMatches(
    matches: Match[],
    filters: {
        date?: string;
        phase?: MatchPhase | "TODAS";
        status?: MatchStatus | "TODOS";
    }
): Match[] {
    return matches.filter((match) => {
        if (filters.phase && filters.phase !== "TODAS" && match.phase !== filters.phase) {
            return false;
        }
        if (filters.status && filters.status !== "TODOS" && match.status !== filters.status) {
            return false;
        }
        if (filters.date) {
            const matchDate = match.dateISO.slice(0, 10);
            if (matchDate !== filters.date) {
                return false;
            }
        }
        return true;
    });
}

export function getUpcomingMatches(matches: Match[], limit = 3): Match[] {
    return matches
        .filter((match) => match.status === "AGENDADA" && !isMatchLocked(match))
        .sort((a, b) => new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime())
        .slice(0, limit);
}

export function getMatchById(matches: Match[], id: number): Match | undefined {
    return matches.find((match) => match.id === id);
}

export function formatMatchLabel(match: Match): string {
    return `${match.teamA} x ${match.teamB}`;
}
