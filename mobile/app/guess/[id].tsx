import { useEffect, useState } from "react";
import { ActivityIndicator, View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { buscarPartida, Partida, salvarPalpite } from "../../api";
import { useAuth } from "../../auth";
import { CopaTheme } from "../../constants/copa-theme";
import { showAppAlert } from "../../utils/app-alert";

export default function GuessScreen() {
    const { id } = useLocalSearchParams();
    const { user } = useAuth();

    const [teamA, setTeamA] = useState("");
    const [teamB, setTeamB] = useState("");
    const [match, setMatch] = useState<Partida | null>(null);
    const [loadingMatch, setLoadingMatch] = useState(true);
    const [loading, setLoading] = useState(false);

    const partidaId = Number(Array.isArray(id) ? id[0] : id);

    useEffect(() => {
        buscarPartida(partidaId)
            .then(setMatch)
            .catch((error) => {
                showAppAlert("Erro", error instanceof Error ? error.message : "Não foi possível carregar a partida.");
                router.back();
            })
            .finally(() => setLoadingMatch(false));
    }, [partidaId]);

    const saveGuess = async () => {
        if (!user) {
            router.replace("/login");
            return;
        }

        const golsMandante = Number(teamA);
        const golsVisitante = Number(teamB);

        if (!Number.isInteger(golsMandante) || !Number.isInteger(golsVisitante)
            || golsMandante < 0 || golsVisitante < 0) {
            showAppAlert("Atenção", "Informe placares válidos.");
            return;
        }

        try {
            setLoading(true);
            await salvarPalpite(user.token, partidaId, golsMandante, golsVisitante);
            showAppAlert("Palpite salvo", "Seu palpite foi registrado com sucesso.", [
                { text: "Ver meus palpites", onPress: () => router.replace("/(tabs)/guesses") },
            ]);
        } catch (error) {
            showAppAlert("Erro", error instanceof Error ? error.message : "Não foi possível salvar o palpite.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backText}>Voltar</Text>
                </TouchableOpacity>

                <Text style={styles.title}>Registrar Palpite</Text>
                {loadingMatch ? (
                    <ActivityIndicator color={CopaTheme.primary} />
                ) : (
                    <Text style={styles.matchTitle}>{match?.mandante} x {match?.visitante}</Text>
                )}

                <TextInput
                    placeholder={`Gols ${match?.mandante ?? "mandante"}`}
                    keyboardType="numeric"
                    value={teamA}
                    onChangeText={setTeamA}
                    style={styles.input}
                />
                <TextInput
                    placeholder={`Gols ${match?.visitante ?? "visitante"}`}
                    keyboardType="numeric"
                    value={teamB}
                    onChangeText={setTeamB}
                    style={styles.input}
                />
                <TouchableOpacity
                    disabled={loading || loadingMatch}
                    onPress={saveGuess}
                    style={styles.button}>
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Salvar palpite</Text>
                    )}
                </TouchableOpacity>
            </View>
    </SafeAreaView>        
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: CopaTheme.background,
        padding: 20
    },
    header: {
        padding: 22,
        backgroundColor: CopaTheme.surface,
        borderWidth: 1,
        borderColor: CopaTheme.border,
        borderRadius: 24,
        gap: 12,
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
    title: {
        color: CopaTheme.primaryDark,
        fontSize: 24,
        fontWeight: "900",
    },
    matchTitle: {
        color: CopaTheme.primaryDark,
        fontSize: 18,
        fontWeight: "800",
    },
    input: {
        borderWidth: 1,
        borderColor: CopaTheme.border,
        borderRadius: 14,
        backgroundColor: CopaTheme.surfaceAlt,
        padding: 14,
    },
    button: {
        alignItems: "center",
        backgroundColor: CopaTheme.primary,
        padding: 15,
        borderRadius: 14,
    },
    buttonText: {
        color: CopaTheme.textLight,
        fontWeight: "800",
    },
});
