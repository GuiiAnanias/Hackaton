import { createContext, PropsWithChildren, useContext, useMemo, useState } from "react";
import { cadastrar as cadastrarRequest, login as loginRequest, UserProfile, UserSession } from "./api";

type AuthContextValue = {
    user: UserSession | null;
    isAuthenticated: boolean;
    login: (email: string, senha: string) => Promise<void>;
    cadastrar: (nome: string, email: string, senha: string) => Promise<void>;
    updateUser: (profile: UserProfile) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
    const [user, setUser] = useState<UserSession | null>(null);

    const value = useMemo<AuthContextValue>(() => ({
        user,
        isAuthenticated: user !== null,
        async login(email, senha) {
            const session = await loginRequest(email, senha);
            setUser(session);
        },
        async cadastrar(nome, email, senha) {
            const session = await cadastrarRequest(nome, email, senha);
            setUser(session);
        },
        updateUser(profile) {
            setUser((current) => current ? ({
                ...current,
                id: profile.id,
                nome: profile.nome,
                perfil: profile.perfil,
            }) : current);
        },
        logout() {
            setUser(null);
        },
    }), [user]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth deve ser usado dentro de AuthProvider");
    }

    return context;
}
