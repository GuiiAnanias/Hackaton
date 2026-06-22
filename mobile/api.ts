import { Platform } from "react-native";

const defaultBaseUrl = Platform.OS === "android" ? "http://10.0.2.2:8080" : "http://localhost:8080";

export const API_BASE_URL = defaultBaseUrl;

export type UserSession = {
    token: string;
    tipo: string;
    id: number;
    nome: string;
    perfil: string;
};

export type UserProfile = {
    id: number;
    nome: string;
    email: string;
    perfil: string;
    pontuacaoTotal: number;
    placaresExatos: number;
};

export type Partida = {
    id: number;
    mandante: string;
    visitante: string;
    dataHoraFormatada?: string;
    dataHora: string;
    fase: string;
    estadio: string;
    grupo: string;
    golsMandante: number | null;
    golsVisitante: number | null;
    status: string;
};

export type Palpite = {
    id: number;
    partidaId: number;
    mandante: string;
    visitante: string;
    dataHora: string;
    golsMandante: number;
    golsVisitante: number;
    pontos: number | null;
    statusPartida: string;
    criterio: "PLACAR_EXATO" | "VENCEDOR" | "ERRO" | null;
};

export type RankingUsuario = {
    posicao: number;
    usuarioId: number;
    nome: string;
    pontuacaoTotal: number;
    placaresExatos: number;
    criadoEm: string;
    destaque: boolean;
};

export type RankingResponse = {
    usuarios: RankingUsuario[];
    usuarioLogado: RankingUsuario | null;
    paginaAtual: number;
    tamanhoPagina: number;
    totalPaginas: number;
    totalUsuarios: number;
};

type ApiOptions = {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    token?: string;
    body?: unknown;
};

async function apiRequest<T>(path: string, options: ApiOptions = {}): Promise<T> {
    let response: Response;

    try {
        response = await fetch(`${API_BASE_URL}${path}`, {
            method: options.method ?? "GET",
            headers: {
                "Content-Type": "application/json",
                ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
            },
            body: options.body ? JSON.stringify(options.body) : undefined,
        });
    } catch {
        throw new Error(`Não foi possível conectar ao backend em ${API_BASE_URL}`);
    }

    const text = await response.text();
    const data = text ? parseJson(text) : null;

    if (!response.ok) {
        throw new Error(data?.erro ?? data?.detail ?? data?.message ?? data?.error ?? "Erro ao conectar com a API");
    }

    return data as T;
}

function parseJson(text: string) {
    try {
        return JSON.parse(text);
    } catch {
        return { message: text };
    }
}

export function login(email: string, senha: string) {
    return apiRequest<UserSession>("/api/auth/login", {
        method: "POST",
        body: { email, senha },
    });
}

export function cadastrar(nome: string, email: string, senha: string) {
    return apiRequest<UserSession>("/api/auth/cadastro", {
        method: "POST",
        body: { nome, email, senha },
    });
}

export function recuperarSenha(email: string, novaSenha: string) {
    return apiRequest<{ mensagem: string }>("/api/auth/recuperar-senha", {
        method: "POST",
        body: { email, novaSenha },
    });
}

export function buscarPerfil(token: string) {
    return apiRequest<UserProfile>("/api/usuarios/me", { token });
}

export function atualizarPerfil(token: string, nome: string, email: string) {
    return apiRequest<UserProfile>("/api/usuarios/me", {
        method: "PATCH",
        token,
        body: { nome, email },
    });
}

export function alterarSenha(token: string, senhaAtual: string, novaSenha: string) {
    return apiRequest<{ mensagem: string }>("/api/usuarios/me/senha", {
        method: "PATCH",
        token,
        body: { senhaAtual, novaSenha },
    });
}

export function excluirConta(token: string) {
    return apiRequest<{ mensagem: string }>("/api/usuarios/me", {
        method: "DELETE",
        token,
    });
}

export function listarPartidas() {
    return apiRequest<Partida[]>("/api/partidas");
}

export function buscarPartida(id: number) {
    return apiRequest<Partida>(`/api/partidas/${id}`);
}

export function listarMeusPalpites(token: string) {
    return apiRequest<Palpite[]>("/api/palpites/me", { token });
}

export function buscarPalpite(token: string, id: number) {
    return apiRequest<Palpite>(`/api/palpites/${id}`, { token });
}

export function salvarPalpite(token: string, partidaId: number, golsMandante: number, golsVisitante: number) {
    return apiRequest<Palpite>("/api/palpites", {
        method: "POST",
        token,
        body: { partidaId, golsMandante, golsVisitante },
    });
}

export function atualizarPalpite(token: string, id: number, golsMandante: number, golsVisitante: number) {
    return apiRequest<Palpite>(`/api/palpites/${id}`, {
        method: "PUT",
        token,
        body: { golsMandante, golsVisitante },
    });
}

export function listarRanking(token?: string, page = 0, size = 50) {
    return apiRequest<RankingResponse>(`/api/ranking?page=${page}&size=${size}`, { token });
}
