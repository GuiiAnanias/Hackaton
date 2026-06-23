import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { buscarPartida, Partida } from "../../api";
import { CopaTheme } from "../../constants/copa-theme";
import { TeamFlag } from "../../components/TeamFlag";
import { showAppAlert } from "../../utils/app-alert";

export default function MatchDetailsScreen() {
    const { id } = useLocalSearchParams();
    const [match, setMatch] = useState<Partida | null>(null);
    const [loading, setLoading] = useState(true);

    const partidaId = Number(Array.isArray(id) ? id[0] : id);

    useEffect(() => {
        buscarPartida(partidaId)
            .then(setMatch)
            .catch((error) => {
                showAppAlert("Erro", error instanceof Error ? error.message : "Não foi possível carregar a partida.");
                router.back();
            })
            .finally(() => setLoading(false));
    }, [partidaId]);

    if (loading || !match) {
        return (
            <SafeAreaView style={styles.center}>
                <ActivityIndicator color="#16a34a" />
            </SafeAreaView>
        );
    }

    const canGuess = match.status === "AGENDADA" && new Date(match.dataHora).getTime() > Date.now();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.card}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backText}>Voltar</Text>
                </TouchableOpacity>

                <Text style={styles.badge}>{match.status}</Text>
                <View style={styles.teamsPanel}>
                    <View style={styles.teamBox}>
                        <TeamFlag flag={match.bandeiraMandante} code={match.codigoFifaMandante} name={match.mandante} size="lg" />
                        <Text style={styles.teamName}>{match.mandante}</Text>
                    </View>
                    <Text style={styles.vs}>x</Text>
                    <View style={styles.teamBox}>
                        <TeamFlag flag={match.bandeiraVisitante} code={match.codigoFifaVisitante} name={match.visitante} size="lg" />
                        <Text style={styles.teamName}>{match.visitante}</Text>
                    </View>
                </View>
                <Text style={styles.info}>Data: {match.dataHoraFormatada ?? new Date(match.dataHora).toLocaleString("pt-BR")}</Text>
                <Text style={styles.info}>Fase: {match.fase}</Text>
                <Text style={styles.info}>Grupo: {match.grupo}</Text>
                <Text style={styles.info}>Estádio: {match.estadio}</Text>

                {match.golsMandante !== null && match.golsVisitante !== null && (
                    <Text style={styles.score}>Resultado: {match.golsMandante} x {match.golsVisitante}</Text>
                )}

                {canGuess ? (
                    <TouchableOpacity
                        onPress={() => router.push({ pathname: "/guess/[id]", params: { id: String(match.id) } })}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Registrar Palpite</Text>
                    </TouchableOpacity>
                ) : (
                    <Text style={styles.closed}>Palpites bloqueados para esta partida.</Text>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: CopaTheme.background,
        padding: 20,
    },
    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    card: {
        gap: 12,
        padding: 22,
        borderRadius: 24,
        backgroundColor: CopaTheme.surface,
        borderWidth: 1,
        borderColor: CopaTheme.border,
        ...CopaTheme.shadow,
    },
    backButton: {
        alignSelf: "flex-start",
        minHeight: 42,
        justifyContent: "center",
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#bfdbfe",
        backgroundColor: "#eff6ff",
        paddingHorizontal: 14,
        paddingVertical: 9,
    },
    backText: {
        color: CopaTheme.info,
        fontSize: 14,
        fontWeight: "900",
    },
    badge: {
        alignSelf: "flex-start",
        borderRadius: 999,
        backgroundColor: CopaTheme.primaryLight,
        color: CopaTheme.primaryDark,
        fontWeight: "700",
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    title: {
        color: CopaTheme.primaryDark,
        fontSize: 28,
        fontWeight: "900",
    },
    teamsPanel: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        borderRadius: 20,
        backgroundColor: CopaTheme.surfaceAlt,
        padding: 14,
    },
    teamBox: {
        flex: 1,
        alignItems: "center",
        gap: 8,
    },
    teamName: {
        color: CopaTheme.primaryDark,
        fontSize: 16,
        fontWeight: "900",
        textAlign: "center",
    },
    vs: {
        color: CopaTheme.textMuted,
        fontSize: 18,
        fontWeight: "900",
    },
    info: {
        color: "#374151",
        fontSize: 15,
    },
    score: {
        fontSize: 18,
        fontWeight: "800",
    },
    button: {
        alignItems: "center",
        borderRadius: 14,
        backgroundColor: CopaTheme.primary,
        padding: 15,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "700",
    },
    closed: {
        color: "#dc2626",
        fontWeight: "700",
    },
});
