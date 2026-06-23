import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import type { Match } from "../types";
import { CopaTheme, STATUS_LABELS } from "../constants/copa-theme";
import { isMatchLocked } from "../utils/match-utils";

interface MatchCardProps {
    match: Match;
    highlight?: boolean;
    showGuessAction?: boolean;
    onPress?: () => void;
}

export function MatchCard({
    match,
    highlight = false,
    showGuessAction = false,
    onPress,
}: MatchCardProps) {
    const locked = isMatchLocked(match);

    return (
        <TouchableOpacity
            activeOpacity={0.85}
            onPress={
                onPress ??
                (() =>
                    router.push({
                        pathname: "/match/[id]",
                        params: { id: String(match.id) },
                    }))
            }
            style={[styles.card, highlight && styles.highlightCard]}>
            {highlight ? (
                <View style={styles.highlightBadge}>
                    <FontAwesome name="star" size={12} color={CopaTheme.accentDark} />
                    <Text style={styles.highlightText}>Próxima partida</Text>
                </View>
            ) : null}

            <View style={styles.headerRow}>
                <Text style={styles.phase}>{match.phase}</Text>
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

            <Text style={styles.teams}>
                {match.teamA} <Text style={styles.vs}>x</Text> {match.teamB}
            </Text>

            {match.status === "ENCERRADA" || match.status === "EM_ANDAMENTO" ? (
                <Text style={styles.score}>
                    Placar: {match.scoreA ?? 0} x {match.scoreB ?? 0}
                </Text>
            ) : null}

            <View style={styles.metaRow}>
                <FontAwesome name="calendar" size={13} color={CopaTheme.textMuted} />
                <Text style={styles.metaText}>{match.date}</Text>
            </View>

            {match.stadium ? (
                <View style={styles.metaRow}>
                    <FontAwesome name="map-marker" size={14} color={CopaTheme.textMuted} />
                    <Text style={styles.metaText}>{match.stadium}</Text>
                </View>
            ) : null}

            {showGuessAction ? (
                <TouchableOpacity
                    disabled={locked}
                    onPress={() => router.push(`/guess/${match.id}`)}
                    style={[styles.guessButton, locked && styles.guessButtonDisabled]}>
                    <Text style={styles.guessButtonText}>
                        {locked ? "Palpite bloqueado" : "Palpitar"}
                    </Text>
                </TouchableOpacity>
            ) : null}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        padding: 16,
        backgroundColor: CopaTheme.surface,
        marginBottom: 12,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: CopaTheme.border,
        ...CopaTheme.shadow,
    },
    highlightCard: {
        borderColor: CopaTheme.accent,
        backgroundColor: "#fffbeb",
    },
    highlightBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        alignSelf: "flex-start",
        backgroundColor: "#fef3c7",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: 10,
    },
    highlightText: {
        fontSize: 12,
        fontWeight: "700",
        color: CopaTheme.accentDark,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    phase: {
        fontSize: 13,
        fontWeight: "700",
        color: CopaTheme.primary,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 11,
        fontWeight: "700",
    },
    teams: {
        fontSize: 20,
        fontWeight: "800",
        color: CopaTheme.primaryDark,
        marginBottom: 8,
    },
    vs: {
        color: CopaTheme.textMuted,
        fontWeight: "600",
    },
    score: {
        fontSize: 15,
        fontWeight: "700",
        color: CopaTheme.info,
        marginBottom: 8,
    },
    metaRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: 4,
    },
    metaText: {
        fontSize: 13,
        color: CopaTheme.textMuted,
    },
    guessButton: {
        marginTop: 14,
        minHeight: 46,
        justifyContent: "center",
        backgroundColor: CopaTheme.primary,
        paddingVertical: 12,
        borderRadius: 14,
        alignItems: "center",
    },
    guessButtonDisabled: {
        backgroundColor: CopaTheme.textMuted,
    },
    guessButtonText: {
        color: CopaTheme.textLight,
        fontWeight: "900",
        fontSize: 14,
    },
});
