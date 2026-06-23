import { useEffect, useState } from "react";
import { ActivityIndicator, View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { listarPartidas, Partida } from "../../api";
import { TeamFlag } from "../../components/TeamFlag";
import { CopaTheme } from "../../constants/copa-theme";

export default function HomeScreen() {
    const [matches, setMatches] = useState<Partida[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        listarPartidas()
            .then((partidas) => setMatches(partidas
                .filter((partida) => partida.status === "AGENDADA" && new Date(partida.dataHora).getTime() > Date.now())
                .sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime())
                .slice(0, 5)))
            .catch((err) => setError(err instanceof Error ? err.message : "Erro ao carregar partidas"))
            .finally(() => setLoading(false));
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flex: 1, padding: 20 }}>
                <View style={styles.hero}>
                    <Text style={styles.heroBadge}>Copa 2026</Text>
                    <Text style={styles.heroTitle}>Próximas Partidas</Text>
                    <Text style={styles.heroText}>Escolha um jogo, confira os detalhes e registre seu palpite.</Text>
                </View>

                {loading && <ActivityIndicator color="green" />}
                {error && <Text style={styles.error}>{error}</Text>}

                <FlatList
                    data={matches}
                    keyExtractor={(item) => item.id.toString()}
                    ListEmptyComponent={!loading ? <Text>Nenhuma partida disponível.</Text> : null}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <View style={styles.matchHeader}>
                                <TeamFlag flag={item.bandeiraMandante} code={item.codigoFifaMandante} name={item.mandante} />
                                <View style={styles.matchTitleWrap}>
                                    <Text style={styles.matchTitle}>{item.mandante}</Text>
                                    <Text style={styles.versus}>x</Text>
                                    <Text style={styles.matchTitle}>{item.visitante}</Text>
                                </View>
                                <TeamFlag flag={item.bandeiraVisitante} code={item.codigoFifaVisitante} name={item.visitante} />
                            </View>
                            <Text style={styles.matchDate}>
                                {item.dataHoraFormatada ?? new Date(item.dataHora).toLocaleString("pt-BR")}
                            </Text>
                            <Text style={styles.matchMeta}>{item.fase} • {item.estadio}</Text>

                            <View style={styles.actions}>
                                <TouchableOpacity
                                    activeOpacity={0.85}
                                    style={[styles.actionButton, styles.detailsButton]}
                                    onPress={() =>
                                        router.push({ pathname: "/match/[id]", params: { id: String(item.id) } })
                                    }>
                                    <FontAwesome name="info-circle" size={14} color={CopaTheme.info} />
                                    <Text style={styles.detailsText}>Detalhes</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    activeOpacity={0.85}
                                    style={[styles.actionButton, styles.guessButton]}
                                    onPress={() =>
                                        router.push({ pathname: "/guess/[id]", params: { id: String(item.id) } })
                                    }>
                                    <FontAwesome name="pencil" size={14} color={CopaTheme.textLight} />
                                    <Text style={styles.guessText}>Palpitar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
            </View>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: CopaTheme.background,
    },
    hero: {
        borderRadius: 26,
        backgroundColor: CopaTheme.primary,
        marginBottom: 18,
        padding: 22,
        ...CopaTheme.shadow,
    },
    heroBadge: {
        alignSelf: "flex-start",
        borderRadius: 999,
        backgroundColor: "#ffffff",
        color: CopaTheme.primary,
        fontSize: 12,
        fontWeight: "900",
        marginBottom: 10,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    heroTitle: {
        color: "#fff",
        fontSize: 26,
        fontWeight: "800",
    },
    heroText: {
        color: "#dcfce7",
        marginTop: 4,
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
    matchTitle: {
        fontSize: 17,
        fontWeight: "800",
        color: CopaTheme.primaryDark,
        textAlign: "center",
    },
    matchHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        marginBottom: 8,
    },
    matchTitleWrap: {
        flex: 1,
        alignItems: "center",
    },
    versus: {
        color: CopaTheme.textMuted,
        fontSize: 13,
        fontWeight: "900",
        marginVertical: 2,
    },
    matchDate: {
        color: "#374151",
        marginTop: 4,
    },
    matchMeta: {
        color: "#6b7280",
        marginTop: 2,
    },
    actions: {
        flexDirection: "row",
        gap: 10,
        marginTop: 12,
        borderTopWidth: 1,
        borderTopColor: CopaTheme.border,
        paddingTop: 12,
    },
    actionButton: {
        flex: 1,
        minHeight: 46,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 7,
        borderRadius: 14,
        paddingHorizontal: 12,
        paddingVertical: 11,
    },
    detailsButton: {
        borderWidth: 1,
        borderColor: "#bfdbfe",
        backgroundColor: "#eff6ff",
    },
    guessButton: {
        backgroundColor: CopaTheme.primary,
    },
    detailsText: {
        color: CopaTheme.info,
        fontSize: 14,
        fontWeight: "900",
    },
    guessText: {
        color: CopaTheme.textLight,
        fontSize: 14,
        fontWeight: "900",
    },
    error: {
        color: "#dc2626",
        marginBottom: 12,
    },
});
