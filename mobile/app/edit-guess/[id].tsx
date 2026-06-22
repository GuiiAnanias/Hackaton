import { useEffect, useState } from "react";
import { ActivityIndicator, View, Text, TextInput, TouchableOpacity, Alert, StyleSheet} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { atualizarPalpite, buscarPalpite, Palpite } from "../../api";
import { useAuth } from "../../auth";
import { CopaTheme } from "../../constants/copa-theme";

export default function EditGuessScreen() {
    const { id } = useLocalSearchParams();
    const { user } = useAuth();

    const [teamA, setTeamA] = useState("");
    const [teamB, setTeamB] = useState("");
    const [palpite, setPalpite] = useState<Palpite | null>(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const palpiteId = Number(Array.isArray(id) ? id[0] : id);

    useEffect(() => {
        if (!user) {
            router.replace("/login");
            return;
        }

        setLoading(true);
        buscarPalpite(user.token, palpiteId)
            .then((palpite) => {
                setPalpite(palpite);
                setTeamA(String(palpite.golsMandante));
                setTeamB(String(palpite.golsVisitante));
            })
            .catch((error) => {
                Alert.alert("Erro", error instanceof Error ? error.message : "Não foi possível carregar o palpite.");
                router.back();
            })
            .finally(() => setLoading(false));
    }, [palpiteId, user]);

    const updateGuess = async () => {
        if (!user) {
            router.replace("/login");
            return;
        }

        const golsMandante = Number(teamA);
        const golsVisitante = Number(teamB);

        if (!Number.isInteger(golsMandante) || !Number.isInteger(golsVisitante)
            || golsMandante < 0 || golsVisitante < 0) {
            Alert.alert("Atenção", "Informe placares válidos.");
            return;
        }

        try {
            setSaving(true);
            await atualizarPalpite(user.token, palpiteId, golsMandante, golsVisitante);
            Alert.alert("Atualizado", "Palpite atualizado.");
            router.replace("/(tabs)/guesses");
        } catch (error) {
            Alert.alert("Erro", error instanceof Error ? error.message : "Não foi possível atualizar o palpite.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backText}>Voltar</Text>
                </TouchableOpacity>

                <Text style={styles.title}>Editar Palpite</Text>
                {palpite ? (
                    <>
                        <Text style={styles.matchTitle}>{palpite.mandante} x {palpite.visitante}</Text>
                        <Text style={styles.meta}>Pontuação atual: {palpite.pontos ?? 0} pontos</Text>
                    </>
                ) : null}

                {loading && <ActivityIndicator color={CopaTheme.info} />}

                <TextInput
                    placeholder={`Gols ${palpite?.mandante ?? "mandante"}`}
                    value={teamA}
                    onChangeText={setTeamA}
                    keyboardType="numeric"
                    style={styles.input}
                />
                <TextInput
                    placeholder={`Gols ${palpite?.visitante ?? "visitante"}`}
                    value={teamB}
                    onChangeText={setTeamB}
                    keyboardType="numeric"
                    style={styles.input}
                />
                <TouchableOpacity
                    disabled={saving || loading}
                    onPress={updateGuess}
                    style={styles.button}>
                    {saving ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Atualizar palpite</Text>
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
        padding: 20,
    },
    header: {
        padding: 20,
        backgroundColor: CopaTheme.surface,
        borderWidth: 1,
        borderColor: CopaTheme.border,
        borderRadius: 20,
        gap: 12,
    },
    backButton: {
        alignSelf: "flex-start",
    },
    backText: {
        color: CopaTheme.info,
        fontSize: 16,
        fontWeight: "700",
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
    meta: {
        color: CopaTheme.textMuted,
    },
    input: {
        borderWidth: 1,
        borderColor: CopaTheme.border,
        borderRadius: 12,
        backgroundColor: "#f8fafc",
        padding: 12,
    },
    button: {
        alignItems: "center",
        backgroundColor: CopaTheme.info,
        padding: 15,
        borderRadius: 12,
    },
    buttonText: {
        color: CopaTheme.textLight,
        fontWeight: "800",
    },
});