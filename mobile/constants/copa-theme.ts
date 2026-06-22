export const CopaTheme = {
    primary: "#15803d",
    primaryDark: "#14532d",
    primaryLight: "#dcfce7",
    accent: "#eab308",
    accentDark: "#ca8a04",
    background: "#f0fdf4",
    surface: "#ffffff",
    text: "#14532d",
    textMuted: "#64748b",
    textLight: "#ffffff",
    border: "#bbf7d0",
    danger: "#dc2626",
    dangerLight: "#fef2f2",
    info: "#2563eb",
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
