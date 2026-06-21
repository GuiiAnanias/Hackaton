import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AuthSession, User } from "../types";

const USERS_KEY = "@copa:users";
const SESSION_KEY = "@copa:session";

interface AuthContextValue {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (data: { name: string; email: string }) => Promise<void>;
    deleteAccount: () => Promise<void>;
    recoverPassword: (email: string) => Promise<string>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function readUsers(): Promise<User[]> {
    const raw = await AsyncStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as User[]) : [];
}

async function writeUsers(users: User[]): Promise<void> {
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function bootstrap() {
            try {
                const sessionRaw = await AsyncStorage.getItem(SESSION_KEY);
                if (!sessionRaw) {
                    return;
                }
                const session = JSON.parse(sessionRaw) as AuthSession;
                const users = await readUsers();
                const currentUser = users.find((item) => item.id === session.userId);
                if (currentUser) {
                    setUser(currentUser);
                }
            } finally {
                setIsLoading(false);
            }
        }
        bootstrap();
    }, []);

    const persistSession = useCallback(async (currentUser: User) => {
        const session: AuthSession = {
            userId: currentUser.id,
            token: `mock-jwt-${currentUser.id}`,
        };
        await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
        setUser(currentUser);
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        const normalizedEmail = email.trim().toLowerCase();
        const users = await readUsers();
        const found = users.find(
            (item) => item.email === normalizedEmail && item.password === password
        );
        if (!found) {
            throw new Error("E-mail ou senha inválidos.");
        }
        await persistSession(found);
    }, [persistSession]);

    const register = useCallback(async (name: string, email: string, password: string) => {
        const normalizedEmail = email.trim().toLowerCase();
        const users = await readUsers();
        if (users.some((item) => item.email === normalizedEmail)) {
            throw new Error("Este e-mail já está cadastrado.");
        }
        const newUser: User = {
            id: Date.now().toString(),
            name: name.trim(),
            email: normalizedEmail,
            password,
        };
        await writeUsers([...users, newUser]);
        await persistSession(newUser);
    }, [persistSession]);

    const logout = useCallback(async () => {
        await AsyncStorage.removeItem(SESSION_KEY);
        setUser(null);
    }, []);

    const updateProfile = useCallback(async (data: { name: string; email: string }) => {
        if (!user) {
            throw new Error("Usuário não autenticado.");
        }
        const normalizedEmail = data.email.trim().toLowerCase();
        const users = await readUsers();
        const emailTaken = users.some(
            (item) => item.email === normalizedEmail && item.id !== user.id
        );
        if (emailTaken) {
            throw new Error("Este e-mail já está em uso.");
        }
        const updatedUser: User = {
            ...user,
            name: data.name.trim(),
            email: normalizedEmail,
        };
        const nextUsers = users.map((item) => (item.id === user.id ? updatedUser : item));
        await writeUsers(nextUsers);
        await persistSession(updatedUser);
    }, [persistSession, user]);

    const deleteAccount = useCallback(async () => {
        if (!user) {
            return;
        }
        const users = await readUsers();
        const nextUsers = users.filter((item) => item.id !== user.id);
        await writeUsers(nextUsers);
        await AsyncStorage.removeItem(SESSION_KEY);
        setUser(null);
    }, [user]);

    const recoverPassword = useCallback(async (email: string) => {
        const normalizedEmail = email.trim().toLowerCase();
        const users = await readUsers();
        const found = users.find((item) => item.email === normalizedEmail);
        if (!found) {
            throw new Error("Nenhuma conta encontrada com este e-mail.");
        }
        return `Enviamos um link de recuperação para ${normalizedEmail}. Verifique sua caixa de entrada.`;
    }, []);

    const value = useMemo(
        () => ({
            user,
            isLoading,
            login,
            register,
            logout,
            updateProfile,
            deleteAccount,
            recoverPassword,
        }),
        [user, isLoading, login, register, logout, updateProfile, deleteAccount, recoverPassword]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth deve ser usado dentro de AuthProvider.");
    }
    return context;
}
