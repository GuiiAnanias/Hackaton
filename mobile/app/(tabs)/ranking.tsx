import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { listarRanking, RankingUsuario } from "../../api";
import { useAuth } from "../../auth";
import { CopaTheme } from "../../constants/copa-theme";

export default function RankingScreen() {
    const { user } = useAuth();
    const [ranking, setRanking] = useState<RankingUsuario[]>([]);
    const [usuarioLogado, setUsuarioLogado] = useState<RankingUsuario | null>(null);
    const [totalUsuarios, setTotalUsuarios] = useState(0);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const carregarRanking = useCallback(async (showRefresh = false) => {
        try {
            if (showRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }
            setError(null);
            const response = await listarRanking(user?.token);
            setRanking(response.usuarios);
            setUsuarioLogado(response.usuarioLogado);
            setTotalUsuarios(response.totalUsuarios);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao carregar ranking");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [user?.token]);

    useFocusEffect(useCallback(() => {
        carregarRanking();
    }, [carregarRanking]));

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.hero}>
                    <Text style={styles.heroBadge}>Classificacao geral</Text>
                    <Text style={styles.heroTitle}>Ranking do Bolao</Text>
                    <Text style={styles.heroText}>
                        {totalUsuarios} usuarios competindo por pontos na Copa 2026.
                    </Text>
                </View>

                {usuarioLogado ? (
                    <View style={styles.myPosition}>
                        <FontAwesome name="user" size={16} color={CopaTheme.primaryDark} />
                        <Text style={styles.myPositionText}>
                            Sua posicao: #{usuarioLogado.posicao} com {usuarioLogado.pontuacaoTotal} pontos
                        </Text>
                    </View>
                ) : null}

                {loading ? <ActivityIndicator color={CopaTheme.primary} /> : null}
                {error ? <Text style={styles.error}>{error}</Text> : null}

                <FlatList
                    data={ranking}
                    keyExtractor={(item) => String(item.usuarioId)}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={() => carregarRanking(true)} />
                    }
                    ListEmptyComponent={!loading ? <Text style={styles.empty}>Nenhum usuario no ranking.</Text> : null}
                    renderItem={({ item }) => <RankingCard item={item} />}
                    contentContainerStyle={styles.listContent}
                />
            </View>
        </SafeAreaView>
    );
}

function RankingCard({ item }: { item: RankingUsuario }) {
    return (
        <View style={[styles.card, item.destaque && styles.highlightCard]}>
            <View style={styles.positionBadge}>
                <Text style={styles.positionText}>#{item.posicao}</Text>
            </View>

            <View style={styles.cardBody}>
                <Text style={styles.name}>{item.nome}</Text>
                <Text style={styles.meta}>{item.placaresExatos} placares exatos</Text>
            </View>

            <View style={styles.pointsBox}>
                <Text style={styles.points}>{item.pontuacaoTotal}</Text>
                <Text style={styles.pointsLabel}>pts</Text>
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
        flex: 1,
        padding: 20,
    },
    hero: {
        borderRadius: 22,
        backgroundColor: CopaTheme.primary,
        marginBottom: 14,
        padding: 20,
    },
    heroBadge: {
        alignSelf: "flex-start",
        borderRadius: 999,
        backgroundColor: "#bbf7d0",
        color: CopaTheme.primaryDark,
        fontSize: 12,
        fontWeight: "800",
        marginBottom: 10,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    heroTitle: {
        color: CopaTheme.textLight,
        fontSize: 28,
        fontWeight: "900",
    },
    heroText: {
        color: CopaTheme.primaryLight,
        marginTop: 6,
    },
    myPosition: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        borderRadius: 14,
        backgroundColor: "#fef3c7",
        marginBottom: 12,
        padding: 12,
    },
    myPositionText: {
        color: CopaTheme.primaryDark,
        fontWeight: "800",
    },
    listContent: {
        paddingBottom: 24,
    },
    card: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: CopaTheme.border,
        borderRadius: 16,
        backgroundColor: CopaTheme.surface,
        marginBottom: 10,
        padding: 14,
    },
    highlightCard: {
        borderColor: CopaTheme.accent,
        backgroundColor: "#fffbeb",
    },
    positionBadge: {
        alignItems: "center",
        justifyContent: "center",
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: CopaTheme.primaryLight,
    },
    positionText: {
        color: CopaTheme.primaryDark,
        fontWeight: "900",
    },
    cardBody: {
        flex: 1,
        marginLeft: 12,
    },
    name: {
        color: CopaTheme.primaryDark,
        fontSize: 16,
        fontWeight: "900",
    },
    meta: {
        color: CopaTheme.textMuted,
        marginTop: 3,
    },
    pointsBox: {
        alignItems: "center",
    },
    points: {
        color: CopaTheme.primary,
        fontSize: 22,
        fontWeight: "900",
    },
    pointsLabel: {
        color: CopaTheme.textMuted,
        fontSize: 11,
        fontWeight: "700",
    },
    error: {
        color: CopaTheme.danger,
        marginBottom: 12,
    },
    empty: {
        color: CopaTheme.textMuted,
        textAlign: "center",
        marginTop: 20,
    },
});
