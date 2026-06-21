import { useMemo, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { matches } from "../../mocks/matches";
import { getMatchById, isMatchLocked } from "../../utils/match-utils";
import { useGuesses } from "../../contexts/GuessesContext";
import { PrimaryButton } from "../../components/PrimaryButton";
import { CopaTheme, CRITERIA_LABELS } from "../../constants/copa-theme";

export default function EditGuessScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { guesses, updateGuess } = useGuesses();
    const guess = guesses.find((item) => item.id === id);
    const match = guess ? getMatchById(matches, guess.matchId) : undefined;
    const locked = match ? isMatchLocked(match) : true;

    const [teamA, setTeamA] = useState(guess ? String(guess.goalsA) : "");
    const [teamB, setTeamB] = useState(guess ? String(guess.goalsB) : "");
    const [loading, setLoading] = useState(false);

    const matchLabel = useMemo(() => {
        if (!match) {
            return "Partida";
        }
        return `${match.teamA} x ${match.teamB}`;
    }, [match]);

    const handleUpdate = async () => {
        if (!guess) {
            return;
        }
        if (locked) {
            Alert.alert("Palpite bloqueado", "Não é possível editar após o início da partida.");
            return;
        }
        if (teamA.trim() === "" || teamB.trim() === "") {
            Alert.alert("Atenção", "Informe os gols de ambos os times.");
            return;
        }

        const goalsA = Number(teamA);
        const goalsB = Number(teamB);
        if (Number.isNaN(goalsA) || Number.isNaN(goalsB) || goalsA < 0 || goalsB < 0) {
            Alert.alert("Atenção", "Informe placares válidos.");
            return;
        }

        setLoading(true);
        try {
            await updateGuess(guess.id, { matchId: guess.matchId, goalsA, goalsB });
            Alert.alert("Atualizado", "Palpite atualizado com sucesso!", [
                { text: "OK", onPress: () => router.back() },
            ]);
        } catch (error) {
            Alert.alert("Erro", error instanceof Error ? error.message : "Falha ao atualizar.");
        } finally {
            setLoading(false);
        }
    };

    if (!guess) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.card}>
                    <Text style={styles.title}>Palpite não encontrado</Text>
                    <PrimaryButton label="Voltar" onPress={() => router.back()} />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={styles.flex}>
                <View style={styles.card}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Text style={styles.backText}>Voltar</Text>
                    </TouchableOpacity>

                    <Text style={styles.title}>Editar Palpite</Text>
                    <Text style={styles.subtitle}>{matchLabel}</Text>

                    <View style={styles.pointsCard}>
                        <Text style={styles.pointsLabel}>Pontuação atual</Text>
                        <Text style={styles.pointsValue}>{guess.points} pts</Text>
                        <Text style={styles.criteria}>{CRITERIA_LABELS[guess.criteria]}</Text>
                    </View>

                    {locked ? (
                        <View style={styles.lockedBanner}>
                            <Text style={styles.lockedText}>
                                Partida iniciada — edição bloqueada.
                            </Text>
                        </View>
                    ) : null}

                    <View style={styles.scoreRow}>
                        <View style={styles.inputWrap}>
                            <Text style={styles.inputLabel}>{match?.teamA ?? "Time A"}</Text>
                            <TextInput
                                keyboardType="numeric"
                                value={teamA}
                                onChangeText={setTeamA}
                                editable={!locked}
                                style={styles.input}
                            />
                        </View>
                        <Text style={styles.vs}>x</Text>
                        <View style={styles.inputWrap}>
                            <Text style={styles.inputLabel}>{match?.teamB ?? "Time B"}</Text>
                            <TextInput
                                keyboardType="numeric"
                                value={teamB}
                                onChangeText={setTeamB}
                                editable={!locked}
                                style={styles.input}
                            />
                        </View>
                    </View>

                    <PrimaryButton
                        label="Atualizar palpite"
                        onPress={handleUpdate}
                        loading={loading}
                        disabled={locked}
                    />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: CopaTheme.background,
        padding: 20,
    },
    flex: {
        flex: 1,
    },
    card: {
        flex: 1,
        padding: 20,
        backgroundColor: CopaTheme.surface,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: CopaTheme.border,
    },
    backButton: {
        marginBottom: 16,
    },
    backText: {
        color: CopaTheme.info,
        fontWeight: "600",
        fontSize: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "800",
        color: CopaTheme.primaryDark,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: "700",
        color: CopaTheme.primary,
        marginBottom: 16,
    },
    pointsCard: {
        backgroundColor: "#fffbeb",
        borderRadius: 14,
        padding: 14,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: CopaTheme.accent,
    },
    pointsLabel: {
        fontSize: 12,
        fontWeight: "700",
        color: CopaTheme.accentDark,
    },
    pointsValue: {
        fontSize: 28,
        fontWeight: "800",
        color: CopaTheme.primaryDark,
        marginTop: 4,
    },
    criteria: {
        marginTop: 4,
        color: CopaTheme.textMuted,
        fontWeight: "600",
    },
    lockedBanner: {
        backgroundColor: CopaTheme.dangerLight,
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
    },
    lockedText: {
        color: CopaTheme.danger,
        fontWeight: "700",
        textAlign: "center",
    },
    scoreRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 24,
    },
    inputWrap: {
        flex: 1,
    },
    inputLabel: {
        fontSize: 13,
        fontWeight: "700",
        color: CopaTheme.primaryDark,
        marginBottom: 8,
        textAlign: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: CopaTheme.border,
        backgroundColor: "#f8fafc",
        borderRadius: 12,
        paddingVertical: 14,
        textAlign: "center",
        fontSize: 24,
        fontWeight: "800",
    },
    vs: {
        marginHorizontal: 12,
        fontSize: 22,
        fontWeight: "800",
        color: CopaTheme.textMuted,
    },
});
