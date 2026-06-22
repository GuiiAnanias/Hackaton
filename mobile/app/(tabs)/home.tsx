import { useEffect, useState } from "react";
import { ActivityIndicator, View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { listarPartidas, Partida } from "../../api";
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
                            <Text style={styles.matchTitle}>{item.mandante} x {item.visitante}</Text>
                            <Text style={styles.matchDate}>
                                {item.dataHoraFormatada ?? new Date(item.dataHora).toLocaleString("pt-BR")}
                            </Text>
                            <Text style={styles.matchMeta}>{item.fase} • {item.estadio}</Text>

                            <View style={styles.actions}>
                                <TouchableOpacity onPress={() =>
                                        router.push({ pathname: "/match/[id]", params: { id: String(item.id) } })
                                    }>
                                    <Text style={styles.detailsText}>Detalhes</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() =>
                                    router.push({ pathname: "/guess/[id]", params: { id: String(item.id) } })
                                }>
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
        borderRadius: 18,
        backgroundColor: CopaTheme.primary,
        marginBottom: 16,
        padding: 18,
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
        marginBottom: 10,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: CopaTheme.border,
    },
    matchTitle: {
        fontSize: 17,
        fontWeight: "800",
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
        justifyContent: "space-between",
        marginTop: 12,
    },
    detailsText: {
        color: "#2563eb",
        fontWeight: "800",
    },
    guessText: {
        color: CopaTheme.primary,
        fontWeight: "800",
    },
    error: {
        color: "#dc2626",
        marginBottom: 12,
    },
});