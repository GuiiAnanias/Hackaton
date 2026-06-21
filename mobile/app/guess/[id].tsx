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
import { CopaTheme } from "../../constants/copa-theme";

export default function GuessScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const matchId = Number(id);
    const match = getMatchById(matches, matchId);
    const { saveGuess, getGuessByMatch } = useGuesses();
    const existingGuess = getGuessByMatch(matchId);
    const locked = match ? isMatchLocked(match) : true;

    const [teamA, setTeamA] = useState("");
    const [teamB, setTeamB] = useState("");
    const [loading, setLoading] = useState(false);

    const matchLabel = useMemo(() => {
        if (!match) {
            return "Partida";
        }
        return `${match.teamA} x ${match.teamB}`;
    }, [match]);

    const handleSave = async () => {
        if (locked) {
            Alert.alert("Palpite bloqueado", "Não é possível palpitar após o início da partida.");
            return;
        }
        if (existingGuess) {
            Alert.alert("Palpite existente", "Você já possui um palpite para esta partida.");
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
            await saveGuess({ matchId, goalsA, goalsB });
            Alert.alert("Sucesso", "Palpite registrado com sucesso!", [
                { text: "OK", onPress: () => router.back() },
            ]);
        } catch (error) {
            Alert.alert("Erro", error instanceof Error ? error.message : "Falha ao salvar palpite.");
        } finally {
            setLoading(false);
        }
    };

    if (!match) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.card}>
                    <Text style={styles.title}>Partida não encontrada</Text>
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

                    <Text style={styles.title}>Registrar Palpite</Text>
                    <Text style={styles.subtitle}>{matchLabel}</Text>
                    <Text style={styles.date}>{match.date}</Text>

                    {locked ? (
                        <View style={styles.lockedBanner}>
                            <Text style={styles.lockedText}>
                                Partida iniciada — palpite bloqueado.
                            </Text>
                        </View>
                    ) : null}

                    <View style={styles.scoreRow}>
                        <View style={styles.inputWrap}>
                            <Text style={styles.inputLabel}>{match.teamA}</Text>
                            <TextInput
                                placeholder="0"
                                keyboardType="numeric"
                                value={teamA}
                                onChangeText={setTeamA}
                                editable={!locked}
                                style={styles.input}
                            />
                        </View>
                        <Text style={styles.vs}>x</Text>
                        <View style={styles.inputWrap}>
                            <Text style={styles.inputLabel}>{match.teamB}</Text>
                            <TextInput
                                placeholder="0"
                                keyboardType="numeric"
                                value={teamB}
                                onChangeText={setTeamB}
                                editable={!locked}
                                style={styles.input}
                            />
                        </View>
                    </View>

                    <PrimaryButton
                        label="Salvar palpite"
                        onPress={handleSave}
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
    },
    date: {
        marginTop: 4,
        marginBottom: 20,
        color: CopaTheme.textMuted,
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
