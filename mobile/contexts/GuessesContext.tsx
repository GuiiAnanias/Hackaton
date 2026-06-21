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
import type { Guess, ScoreCriteria } from "../types";
import { useAuth } from "./AuthContext";

const GUESSES_KEY = "@copa:guesses";

interface SaveGuessInput {
    matchId: number;
    goalsA: number;
    goalsB: number;
}

interface GuessesContextValue {
    guesses: Guess[];
    isLoading: boolean;
    getGuessByMatch: (matchId: number) => Guess | undefined;
    saveGuess: (input: SaveGuessInput) => Promise<void>;
    updateGuess: (guessId: string, input: SaveGuessInput) => Promise<void>;
}

const GuessesContext = createContext<GuessesContextValue | null>(null);

async function readAllGuesses(): Promise<Guess[]> {
    const raw = await AsyncStorage.getItem(GUESSES_KEY);
    return raw ? (JSON.parse(raw) as Guess[]) : [];
}

async function writeAllGuesses(guesses: Guess[]): Promise<void> {
    await AsyncStorage.setItem(GUESSES_KEY, JSON.stringify(guesses));
}

export function GuessesProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [guesses, setGuesses] = useState<Guess[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadGuesses() {
            setIsLoading(true);
            try {
                const allGuesses = await readAllGuesses();
                if (!user) {
                    setGuesses([]);
                    return;
                }
                setGuesses(allGuesses.filter((guess) => guess.userId === user.id));
            } finally {
                setIsLoading(false);
            }
        }
        loadGuesses();
    }, [user]);

    const persistUserGuesses = useCallback(
        async (nextUserGuesses: Guess[]) => {
            if (!user) {
                return;
            }
            const allGuesses = await readAllGuesses();
            const otherGuesses = allGuesses.filter((guess) => guess.userId !== user.id);
            await writeAllGuesses([...otherGuesses, ...nextUserGuesses]);
            setGuesses(nextUserGuesses);
        },
        [user]
    );

    const getGuessByMatch = useCallback(
        (matchId: number) => guesses.find((guess) => guess.matchId === matchId),
        [guesses]
    );

    const saveGuess = useCallback(
        async (input: SaveGuessInput) => {
            if (!user) {
                throw new Error("Faça login para registrar palpites.");
            }
            if (getGuessByMatch(input.matchId)) {
                throw new Error("Você já possui um palpite para esta partida.");
            }
            const newGuess: Guess = {
                id: Date.now().toString(),
                userId: user.id,
                matchId: input.matchId,
                goalsA: input.goalsA,
                goalsB: input.goalsB,
                points: 0,
                criteria: "PENDENTE" as ScoreCriteria,
                createdAt: new Date().toISOString(),
            };
            await persistUserGuesses([newGuess, ...guesses]);
        },
        [user, getGuessByMatch, guesses, persistUserGuesses]
    );

    const updateGuess = useCallback(
        async (guessId: string, input: SaveGuessInput) => {
            const currentGuess = guesses.find((guess) => guess.id === guessId);
            if (!currentGuess) {
                throw new Error("Palpite não encontrado.");
            }
            const updatedGuess: Guess = {
                ...currentGuess,
                goalsA: input.goalsA,
                goalsB: input.goalsB,
            };
            const nextGuesses = guesses.map((guess) =>
                guess.id === guessId ? updatedGuess : guess
            );
            await persistUserGuesses(nextGuesses);
        },
        [guesses, persistUserGuesses]
    );

    const value = useMemo(
        () => ({
            guesses,
            isLoading,
            getGuessByMatch,
            saveGuess,
            updateGuess,
        }),
        [guesses, isLoading, getGuessByMatch, saveGuess, updateGuess]
    );

    return <GuessesContext.Provider value={value}>{children}</GuessesContext.Provider>;
}

export function useGuesses() {
    const context = useContext(GuessesContext);
    if (!context) {
        throw new Error("useGuesses deve ser usado dentro de GuessesProvider.");
    }
    return context;
}
