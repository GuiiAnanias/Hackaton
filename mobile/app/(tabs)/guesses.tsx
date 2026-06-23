import { useCallback, useState } from "react";
import { ActivityIndicator, View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { listarMeusPalpites, Palpite } from "../../api";
import { useAuth } from "../../auth";
import { CopaTheme, CRITERIA_LABELS } from "../../constants/copa-theme";

export default function MyGuessesScreen() {
    const { user } = useAuth();
    const [guesses, setGuesses] = useState<Palpite[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useFocusEffect(useCallback(() => {
        if (!user) {
            return;
        }

        setLoading(true);
        setError(null);
        listarMeusPalpites(user.token)
            .then(setGuesses)
            .catch((err) => setError(err instanceof Error ? err.message : "Erro ao carregar palpites"))
            .finally(() => setLoading(false));
    }, [user]));

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flex: 1, padding: 20 }}>
                <View style={styles.headerCard}>
                    <Text style={styles.title}>Meus Palpites</Text>
                    <Text style={styles.subtitle}>Acompanhe seus palpites e pontos por partida.</Text>
                </View>

                {loading && <ActivityIndicator color="green" />}
                {error && <Text style={styles.error}>{error}</Text>}

                <FlatList
                    data={guesses}
                    keyExtractor={(item) => item.id.toString()}
                    ListEmptyComponent={!loading ? <Text>Você ainda não registrou palpites.</Text> : null}
                    renderItem={({ item }) => {
                        const bloqueado = isPalpiteBloqueado(item);

                        return (
                        <TouchableOpacity
                            disabled={bloqueado}
                            onPress={() =>
                                router.push({ pathname: "/edit-guess/[id]", params: { id: String(item.id) } })
                            }>
                            <View style={[styles.card, bloqueado && styles.lockedCard]}>
                                <View style={styles.cardHeader}>
                                    <Text style={styles.matchTitle}>{item.mandante} x {item.visitante}</Text>
                                    <View style={styles.pointsBadge}>
                                        <Text style={styles.points}>{item.pontos ?? 0}</Text>
                                        <Text style={styles.pointsLabel}>pts</Text>
                                    </View>
                                </View>
                                <Text style={styles.guessText}>Palpite: {item.golsMandante} x {item.golsVisitante}</Text>
                                <Text style={styles.criteria}>
                                    {CRITERIA_LABELS[item.criterio ?? "PENDENTE"] ?? "Aguardando resultado"}
                                </Text>
                                <Text style={bloqueado ? styles.lockedText : styles.editHint}>
                                    {bloqueado ? "Edição bloqueada para esta partida" : "Toque para editar"}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        );
                    }}
                />
            </View>
        </SafeAreaView>
    );
}

function isPalpiteBloqueado(palpite: Palpite) {
    const status = palpite.statusPartida?.toUpperCase();
    if (status && status !== "AGENDADA") {
        return true;
    }

    const dataHora = new Date(palpite.dataHora).getTime();
    return Number.isFinite(dataHora) && dataHora <= Date.now();
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: CopaTheme.background,
    },
    title: {
        color: CopaTheme.primaryDark,
        fontSize: 28,
        fontWeight: "900",
    },
    subtitle: {
        color: CopaTheme.textMuted,
        marginTop: 4,
    },
    headerCard: {
        borderRadius: 22,
        backgroundColor: CopaTheme.surface,
        borderWidth: 1,
        borderColor: CopaTheme.border,
        marginBottom: 16,
        padding: 18,
        ...CopaTheme.shadow,
    },
    card: {
        padding: 16,
        backgroundColor: CopaTheme.surface,
        marginBottom: 12,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: CopaTheme.border,
        ...CopaTheme.shadow,
    },
    lockedCard: {
        opacity: 0.72,
        backgroundColor: "#f8fafc",
    },
    matchTitle: {
        flex: 1,
        color: CopaTheme.primaryDark,
        fontSize: 17,
        fontWeight: "900",
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 12,
    },
    guessText: {
        color: CopaTheme.primaryDark,
        fontWeight: "700",
        marginTop: 10,
    },
    pointsBadge: {
        alignItems: "center",
        minWidth: 56,
        borderRadius: 16,
        backgroundColor: CopaTheme.primaryLight,
        paddingHorizontal: 10,
        paddingVertical: 8,
    },
    points: {
        color: CopaTheme.primary,
        fontSize: 18,
        fontWeight: "900",
    },
    pointsLabel: {
        color: CopaTheme.primaryDark,
        fontSize: 10,
        fontWeight: "800",
    },
    criteria: {
        color: CopaTheme.textMuted,
        fontSize: 12,
        marginTop: 4,
    },
    editHint: {
        color: CopaTheme.info,
        fontSize: 12,
        fontWeight: "700",
        marginTop: 8,
    },
    lockedText: {
        color: CopaTheme.danger,
        fontSize: 12,
        fontWeight: "700",
        marginTop: 8,
    },
    error: {
        color: "#dc2626",
        marginBottom: 12,
    },
});
