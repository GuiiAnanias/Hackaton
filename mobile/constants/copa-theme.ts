export const CopaTheme = {
    primary: "#0f766e",
    primaryDark: "#10231f",
    primaryLight: "#ccfbf1",
    accent: "#f59e0b",
    accentDark: "#b45309",
    background: "#edf5f2",
    surface: "#ffffff",
    surfaceAlt: "#f8fafc",
    text: "#10231f",
    textMuted: "#64748b",
    textSoft: "#94a3b8",
    textLight: "#ffffff",
    border: "#d8e5df",
    danger: "#dc2626",
    dangerLight: "#fef2f2",
    info: "#2563eb",
    shadow: {
        shadowColor: "#0f172a",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.08,
        shadowRadius: 22,
        elevation: 4,
    },
    status: {
        AGENDADA: "#2563eb",
        EM_ANDAMENTO: "#ea580c",
        ENCERRADA: "#64748b",
    },
    criteria: {
        PLACAR_EXATO: "#15803d",
        VENCEDOR: "#2563eb",
        VENCEDOR_EMPATE: "#2563eb",
        ERRO: "#dc2626",
        ERRO_TOTAL: "#dc2626",
        PENDENTE: "#94a3b8",
    },
} as const;

export const CRITERIA_LABELS: Record<string, string> = {
    PLACAR_EXATO: "Placar exato",
    VENCEDOR: "Vencedor/empate",
    VENCEDOR_EMPATE: "Vencedor/empate",
    ERRO: "Errou",
    ERRO_TOTAL: "Errou",
    PENDENTE: "Aguardando resultado",
};

export const STATUS_LABELS: Record<string, string> = {
    AGENDADA: "Agendada",
    EM_ANDAMENTO: "Em andamento",
    ENCERRADA: "Encerrada",
};
