import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { listarPartidas, listarRanking, Partida, RankingUsuario } from "../api";
import { useAuth } from "../auth";
import { TeamFlag } from "../components/TeamFlag";
import { CopaTheme } from "../constants/copa-theme";

export default function PublicScreen() {
    const { isAuthenticated } = useAuth();
    const [matches, setMatches] = useState<Partida[]>([]);
    const [ranking, setRanking] = useState<RankingUsuario[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        Promise.all([listarPartidas(), listarRanking(undefined, 0, 50)])
            .then(([partidas, rankingResponse]) => {
                setMatches(partidas);
                setRanking(rankingResponse.usuarios);
            })
            .catch((err) => setError(err instanceof Error ? err.message : "Não foi possível carregar a área pública."))
            .finally(() => setLoading(false));
    }, []);

    const upcomingMatches = useMemo(() => matches
        .filter((match) => match.status === "AGENDADA" && new Date(match.dataHora).getTime() > Date.now())
        .sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime())
        .slice(0, 4), [matches]);

    const publicRanking = ranking.slice(0, 10);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.hero}>
                    <Text style={styles.heroBadge}>Área pública</Text>
                    <Text style={styles.heroTitle}>Bolão Copa 2026</Text>
                    <Text style={styles.heroText}>Veja ranking e partidas sem criar conta. Para palpitar, entre no app.</Text>

                    <View style={styles.heroActions}>
                        <TouchableOpacity
                            onPress={() => router.push(isAuthenticated ? "/(tabs)/home" : "/login")}
                            style={styles.primaryButton}>
                            <Text style={styles.primaryButtonText}>{isAuthenticated ? "Ir para o app" : "Entrar para palpitar"}</Text>
                        </TouchableOpacity>
                        {!isAuthenticated ? (
                            <TouchableOpacity onPress={() => router.push("/register")} style={styles.secondaryButton}>
                                <Text style={styles.secondaryButtonText}>Criar conta</Text>
                            </TouchableOpacity>
                        ) : null}
                    </View>
                </View>

                {loading ? <ActivityIndicator color={CopaTheme.primary} /> : null}
                {error ? <Text style={styles.error}>{error}</Text> : null}

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Próximas partidas</Text>
                        <TouchableOpacity onPress={() => router.push(isAuthenticated ? "/(tabs)/matches" : "/login")}>
                            <Text style={styles.sectionLink}>{isAuthenticated ? "Ver todas" : "Entrar"}</Text>
                        </TouchableOpacity>
                    </View>

                    {upcomingMatches.length === 0 && !loading ? (
                        <Text style={styles.empty}>Nenhuma partida futura cadastrada.</Text>
                    ) : null}

                    {upcomingMatches.map((match) => (
                        <TouchableOpacity
                            key={match.id}
                            activeOpacity={0.88}
                            onPress={() => router.push({ pathname: "/match/[id]", params: { id: String(match.id) } })}
                            style={styles.matchCard}>
                            <View style={styles.matchFlags}>
                                <TeamFlag flag={match.bandeiraMandante} code={match.codigoFifaMandante} name={match.mandante} />
                                <Text style={styles.vs}>x</Text>
                                <TeamFlag flag={match.bandeiraVisitante} code={match.codigoFifaVisitante} name={match.visitante} />
                            </View>
                            <View style={styles.matchBody}>
                                <Text style={styles.matchTitle}>{match.mandante} x {match.visitante}</Text>
                                <Text style={styles.matchMeta}>{match.dataHoraFormatada ?? new Date(match.dataHora).toLocaleString("pt-BR")}</Text>
                                <Text style={styles.matchMeta}>{match.fase} • {match.estadio}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Top ranking</Text>
                        <TouchableOpacity onPress={() => router.push(isAuthenticated ? "/(tabs)/ranking" : "/login")}>
                            <Text style={styles.sectionLink}>{isAuthenticated ? "Completo" : "Entrar para destacar posição"}</Text>
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={publicRanking}
                        keyExtractor={(item) => String(item.usuarioId)}
                        scrollEnabled={false}
                        ListEmptyComponent={!loading ? <Text style={styles.empty}>Ranking ainda sem usuários.</Text> : null}
                        renderItem={({ item }) => (
                            <View style={styles.rankCard}>
                                <Text style={styles.rankPosition}>#{item.posicao}</Text>
                                <View style={styles.rankBody}>
                                    <Text style={styles.rankName}>{item.nome}</Text>
                                    <Text style={styles.rankMeta}>{item.placaresExatos} placares exatos</Text>
                                </View>
                                <Text style={styles.rankPoints}>{item.pontuacaoTotal} pts</Text>
                            </View>
                        )}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: CopaTheme.background,
    },
    content: {
        padding: 20,
        paddingBottom: 34,
    },
    hero: {
        borderRadius: 28,
        backgroundColor: CopaTheme.primaryDark,
        marginBottom: 18,
        padding: 22,
        ...CopaTheme.shadow,
    },
    heroBadge: {
        alignSelf: "flex-start",
        borderRadius: 999,
        backgroundColor: CopaTheme.accent,
        color: CopaTheme.primaryDark,
        fontSize: 12,
        fontWeight: "900",
        marginBottom: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    heroTitle: {
        color: CopaTheme.textLight,
        fontSize: 31,
        fontWeight: "900",
    },
    heroText: {
        color: CopaTheme.primaryLight,
        fontSize: 15,
        lineHeight: 22,
        marginTop: 8,
    },
    heroActions: {
        flexDirection: "row",
        gap: 10,
        marginTop: 18,
    },
    primaryButton: {
        flex: 1,
        minHeight: 50,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 15,
        backgroundColor: CopaTheme.accent,
        paddingHorizontal: 12,
    },
    primaryButtonText: {
        color: CopaTheme.primaryDark,
        fontSize: 15,
        fontWeight: "900",
        textAlign: "center",
    },
    secondaryButton: {
        minHeight: 50,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.35)",
        borderRadius: 15,
        paddingHorizontal: 16,
    },
    secondaryButtonText: {
        color: CopaTheme.textLight,
        fontSize: 15,
        fontWeight: "900",
    },
    section: {
        borderWidth: 1,
        borderColor: CopaTheme.border,
        borderRadius: 22,
        backgroundColor: CopaTheme.surface,
        marginBottom: 16,
        padding: 16,
        ...CopaTheme.shadow,
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        marginBottom: 12,
    },
    sectionTitle: {
        color: CopaTheme.primaryDark,
        fontSize: 20,
        fontWeight: "900",
    },
    sectionLink: {
        color: CopaTheme.info,
        fontSize: 13,
        fontWeight: "900",
    },
    matchCard: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        borderWidth: 1,
        borderColor: CopaTheme.border,
        borderRadius: 18,
        backgroundColor: CopaTheme.surfaceAlt,
        marginBottom: 10,
        padding: 12,
    },
    matchFlags: {
        alignItems: "center",
        gap: 4,
    },
    vs: {
        color: CopaTheme.textMuted,
        fontSize: 12,
        fontWeight: "900",
    },
    matchBody: {
        flex: 1,
    },
    matchTitle: {
        color: CopaTheme.primaryDark,
        fontSize: 16,
        fontWeight: "900",
    },
    matchMeta: {
        color: CopaTheme.textMuted,
        fontSize: 12,
        marginTop: 3,
    },
    rankCard: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: CopaTheme.border,
        borderRadius: 16,
        backgroundColor: CopaTheme.surfaceAlt,
        marginBottom: 10,
        padding: 12,
    },
    rankPosition: {
        width: 48,
        color: CopaTheme.primary,
        fontSize: 16,
        fontWeight: "900",
    },
    rankBody: {
        flex: 1,
    },
    rankName: {
        color: CopaTheme.primaryDark,
        fontWeight: "900",
    },
    rankMeta: {
        color: CopaTheme.textMuted,
        fontSize: 12,
        marginTop: 2,
    },
    rankPoints: {
        color: CopaTheme.primary,
        fontSize: 16,
        fontWeight: "900",
    },
    empty: {
        color: CopaTheme.textMuted,
        textAlign: "center",
        paddingVertical: 14,
    },
    error: {
        color: CopaTheme.danger,
        fontWeight: "700",
        marginBottom: 12,
        textAlign: "center",
    },
});
