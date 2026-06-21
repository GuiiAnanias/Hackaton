import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import type { Guess, Match } from "../types";
import { CopaTheme, CRITERIA_LABELS } from "../constants/copa-theme";
import { formatMatchLabel, isMatchLocked } from "../utils/match-utils";

interface GuessCardProps {
    guess: Guess;
    match?: Match;
    onPress?: () => void;
}

export function GuessCard({ guess, match, onPress }: GuessCardProps) {
    const locked = match ? isMatchLocked(match) : false;
    const matchLabel = match ? formatMatchLabel(match) : `Partida #${guess.matchId}`;

    return (
        <TouchableOpacity
            activeOpacity={0.85}
            onPress={onPress}
            disabled={!onPress}
            style={styles.card}>
            <View style={styles.headerRow}>
                <Text style={styles.matchLabel}>{matchLabel}</Text>
                <View style={styles.pointsBadge}>
                    <FontAwesome name="trophy" size={12} color={CopaTheme.accentDark} />
                    <Text style={styles.pointsText}>{guess.points} pts</Text>
                </View>
            </View>

            <Text style={styles.guessLine}>
                Seu palpite:{" "}
                <Text style={styles.guessScore}>
                    {guess.goalsA} x {guess.goalsB}
                </Text>
            </Text>

            <View
                style={[
                    styles.criteriaBadge,
                    { backgroundColor: `${CopaTheme.criteria[guess.criteria]}18` },
                ]}>
                <Text
                    style={[
                        styles.criteriaText,
                        { color: CopaTheme.criteria[guess.criteria] },
                    ]}>
                    {CRITERIA_LABELS[guess.criteria]}
                </Text>
            </View>

            {match ? (
                <Text style={styles.metaText}>
                    {locked
                        ? "Partida iniciada — palpite bloqueado para edição"
                        : "Toque para editar seu palpite"}
                </Text>
            ) : null}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        padding: 16,
        backgroundColor: CopaTheme.surface,
        marginBottom: 12,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: CopaTheme.border,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    matchLabel: {
        flex: 1,
        fontSize: 16,
        fontWeight: "800",
        color: CopaTheme.primaryDark,
        paddingRight: 8,
    },
    pointsBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: "#fef3c7",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
    },
    pointsText: {
        fontSize: 13,
        fontWeight: "800",
        color: CopaTheme.accentDark,
    },
    guessLine: {
        fontSize: 14,
        color: CopaTheme.textMuted,
        marginBottom: 10,
    },
    guessScore: {
        fontWeight: "800",
        color: CopaTheme.primaryDark,
    },
    criteriaBadge: {
        alignSelf: "flex-start",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
        marginBottom: 8,
    },
    criteriaText: {
        fontSize: 12,
        fontWeight: "700",
    },
    metaText: {
        fontSize: 12,
        color: CopaTheme.textMuted,
    },
});
