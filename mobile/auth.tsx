import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { cadastrar as cadastrarRequest, login as loginRequest, UserProfile, UserSession } from "./api";

type AuthContextValue = {
    user: UserSession | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, senha: string) => Promise<void>;
    cadastrar: (nome: string, email: string, senha: string) => Promise<void>;
    updateUser: (profile: UserProfile) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const STORAGE_KEY = "@bolao-copa-2026:session";

export function AuthProvider({ children }: PropsWithChildren) {
    const [user, setUser] = useState<UserSession | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        AsyncStorage.getItem(STORAGE_KEY)
            .then((storedSession) => {
                if (storedSession) {
                    setUser(JSON.parse(storedSession) as UserSession);
                }
            })
            .catch(() => AsyncStorage.removeItem(STORAGE_KEY))
            .finally(() => setIsLoading(false));
    }, []);

    const saveSession = useCallback(async (session: UserSession) => {
        setUser(session);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    }, []);

    const value = useMemo<AuthContextValue>(() => ({
        user,
        isLoading,
        isAuthenticated: user !== null,
        async login(email, senha) {
            const session = await loginRequest(email, senha);
            await saveSession(session);
        },
        async cadastrar(nome, email, senha) {
            const session = await cadastrarRequest(nome, email, senha);
            await saveSession(session);
        },
        updateUser(profile) {
            setUser((current) => {
                if (!current) {
                    return current;
                }

                const updated = {
                    ...current,
                    id: profile.id,
                    nome: profile.nome,
                    perfil: profile.perfil,
                };

                AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
                return updated;
            });
        },
        logout() {
            setUser(null);
            AsyncStorage.removeItem(STORAGE_KEY);
        },
    }), [user, isLoading, saveSession]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth deve ser usado dentro de AuthProvider");
    }

    return context;
}
