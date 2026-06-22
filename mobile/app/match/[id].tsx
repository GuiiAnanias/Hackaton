import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { buscarPartida, Partida } from "../../api";

export default function MatchDetailsScreen() {
    const { id } = useLocalSearchParams();
    const [match, setMatch] = useState<Partida | null>(null);
    const [loading, setLoading] = useState(true);

    const partidaId = Number(Array.isArray(id) ? id[0] : id);

    useEffect(() => {
        buscarPartida(partidaId)
            .then(setMatch)
            .catch((error) => {
                Alert.alert("Erro", error instanceof Error ? error.message : "Não foi possível carregar a partida.");
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

    const canGuess = match.status === "AGENDADA";

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.badge}>{match.status}</Text>
                <Text style={styles.title}>{match.mandante} x {match.visitante}</Text>
                <Text style={styles.info}>Data: {new Date(match.dataHora).toLocaleString("pt-BR")}</Text>
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
        backgroundColor: "#f0f0f0",
        padding: 20,
    },
    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    card: {
        gap: 10,
        padding: 20,
        borderRadius: 18,
        backgroundColor: "#fff",
    },
    badge: {
        alignSelf: "flex-start",
        borderRadius: 999,
        backgroundColor: "#dcfce7",
        color: "#166534",
        fontWeight: "700",
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    title: {
        fontSize: 26,
        fontWeight: "800",
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
        borderRadius: 10,
        backgroundColor: "#16a34a",
        padding: 14,
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
