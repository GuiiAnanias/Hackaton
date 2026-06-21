import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import type { ComponentProps } from "react";
import { matches } from "../../mocks/matches";
import { getMatchById, isMatchLocked } from "../../utils/match-utils";
import { useGuesses } from "../../contexts/GuessesContext";
import { PrimaryButton } from "../../components/PrimaryButton";
import { CopaTheme, STATUS_LABELS } from "../../constants/copa-theme";

export default function MatchDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const matchId = Number(id);
    const match = getMatchById(matches, matchId);
    const { getGuessByMatch } = useGuesses();
    const existingGuess = getGuessByMatch(matchId);
    const locked = match ? isMatchLocked(match) : true;

    if (!match) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.title}>Partida não encontrada</Text>
                    <PrimaryButton label="Voltar" onPress={() => router.back()} />
                </View>
            </SafeAreaView>
        );
    }

    const handleGuessAction = () => {
        if (locked) {
            Alert.alert("Palpite bloqueado", "Não é possível palpitar após o início da partida.");
            return;
        }
        if (existingGuess) {
            router.push(`/edit-guess/${existingGuess.id}`);
            return;
        }
        router.push(`/guess/${match.id}`);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backText}>Voltar</Text>
                </TouchableOpacity>

                <View style={styles.heroCard}>
                    <Text style={styles.phase}>{match.phase}</Text>
                    <Text style={styles.teams}>
                        {match.teamA} <Text style={styles.vs}>x</Text> {match.teamB}
                    </Text>
                    <View
                        style={[
                            styles.statusBadge,
                            { backgroundColor: `${CopaTheme.status[match.status]}22` },
                        ]}>
                        <Text
                            style={[
                                styles.statusText,
                                { color: CopaTheme.status[match.status] },
                            ]}>
                            {STATUS_LABELS[match.status]}
                        </Text>
                    </View>
                </View>

                <View style={styles.infoCard}>
                    <InfoRow icon="calendar" label="Data e hora" value={match.date} />
                    <InfoRow icon="map-marker" label="Estádio" value={match.stadium} />
                    {match.group ? (
                        <InfoRow icon="users" label="Grupo" value={`Grupo ${match.group}`} />
                    ) : null}
                    {match.status !== "AGENDADA" ? (
                        <InfoRow
                            icon="futbol-o"
                            label="Placar oficial"
                            value={`${match.scoreA ?? 0} x ${match.scoreB ?? 0}`}
                        />
                    ) : null}
                </View>

                {existingGuess ? (
                    <View style={styles.guessCard}>
                        <Text style={styles.guessTitle}>Seu palpite</Text>
                        <Text style={styles.guessScore}>
                            {existingGuess.goalsA} x {existingGuess.goalsB}
                        </Text>
                        <Text style={styles.guessPoints}>
                            Pontuação: {existingGuess.points} pts
                        </Text>
                    </View>
                ) : null}

                <PrimaryButton
                    label={
                        locked
                            ? "Palpite bloqueado"
                            : existingGuess
                              ? "Editar palpite"
                              : "Registrar palpite"
                    }
                    onPress={handleGuessAction}
                    disabled={locked}
                />
            </ScrollView>
        </SafeAreaView>
    );
}

function InfoRow({
    icon,
    label,
    value,
}: {
    icon: ComponentProps<typeof FontAwesome>["name"];
    label: string;
    value: string;
}) {
    return (
        <View style={styles.infoRow}>
            <FontAwesome name={icon} size={16} color={CopaTheme.primary} />
            <View style={styles.infoTextWrap}>
                <Text style={styles.infoLabel}>{label}</Text>
                <Text style={styles.infoValue}>{value}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: CopaTheme.background,
    },
    content: {
        padding: 20,
        paddingBottom: 32,
    },
    backButton: {
        marginBottom: 16,
    },
    backText: {
        color: CopaTheme.info,
        fontWeight: "600",
        fontSize: 16,
    },
    heroCard: {
        backgroundColor: CopaTheme.primaryDark,
        borderRadius: 20,
        padding: 24,
        marginBottom: 16,
    },
    phase: {
        color: CopaTheme.primaryLight,
        fontWeight: "700",
        marginBottom: 8,
    },
    teams: {
        fontSize: 28,
        fontWeight: "800",
        color: CopaTheme.textLight,
        marginBottom: 12,
    },
    vs: {
        color: "#86efac",
    },
    statusBadge: {
        alignSelf: "flex-start",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    statusText: {
        fontWeight: "700",
        fontSize: 12,
    },
    infoCard: {
        backgroundColor: CopaTheme.surface,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: CopaTheme.border,
        marginBottom: 16,
        gap: 14,
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    infoTextWrap: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        color: CopaTheme.textMuted,
        fontWeight: "600",
    },
    infoValue: {
        fontSize: 15,
        color: CopaTheme.primaryDark,
        fontWeight: "700",
        marginTop: 2,
    },
    guessCard: {
        backgroundColor: "#fffbeb",
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: CopaTheme.accent,
        marginBottom: 16,
    },
    guessTitle: {
        fontSize: 13,
        fontWeight: "700",
        color: CopaTheme.accentDark,
        marginBottom: 6,
    },
    guessScore: {
        fontSize: 24,
        fontWeight: "800",
        color: CopaTheme.primaryDark,
    },
    guessPoints: {
        marginTop: 6,
        color: CopaTheme.textMuted,
        fontWeight: "600",
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 16,
    },
});
