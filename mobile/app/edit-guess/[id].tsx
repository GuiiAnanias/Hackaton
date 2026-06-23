import { useEffect, useState } from "react";
import { ActivityIndicator, View, Text, TextInput, TouchableOpacity, StyleSheet} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { atualizarPalpite, buscarPalpite, Palpite } from "../../api";
import { useAuth } from "../../auth";
import { CopaTheme } from "../../constants/copa-theme";
import { showAppAlert } from "../../utils/app-alert";

export default function EditGuessScreen() {
    const { id } = useLocalSearchParams();
    const { user } = useAuth();

    const [teamA, setTeamA] = useState("");
    const [teamB, setTeamB] = useState("");
    const [palpite, setPalpite] = useState<Palpite | null>(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const palpiteId = Number(Array.isArray(id) ? id[0] : id);
    const bloqueado = palpite ? isPalpiteBloqueado(palpite) : false;

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
                showAppAlert("Erro", error instanceof Error ? error.message : "Não foi possível carregar o palpite.");
                router.back();
            })
            .finally(() => setLoading(false));
    }, [palpiteId, user]);

    const updateGuess = async () => {
        if (!user) {
            router.replace("/login");
            return;
        }

        if (bloqueado) {
            showAppAlert("Palpite bloqueado", "Não é possível editar este palpite.");
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
            setSaving(true);
            await atualizarPalpite(user.token, palpiteId, golsMandante, golsVisitante);
            showAppAlert("Palpite atualizado", "Seu palpite foi atualizado com sucesso.", [
                { text: "Ver meus palpites", onPress: () => router.replace("/(tabs)/guesses") },
            ]);
        } catch (error) {
            showAppAlert("Erro", error instanceof Error ? error.message : "Não foi possível atualizar o palpite.");
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
                {bloqueado ? (
                    <Text style={styles.lockedNotice}>Edição bloqueada para esta partida.</Text>
                ) : null}

                <TextInput
                    placeholder={`Gols ${palpite?.mandante ?? "mandante"}`}
                    value={teamA}
                    onChangeText={setTeamA}
                    editable={!bloqueado && !saving}
                    keyboardType="numeric"
                    style={[styles.input, bloqueado && styles.disabledInput]}
                />
                <TextInput
                    placeholder={`Gols ${palpite?.visitante ?? "visitante"}`}
                    value={teamB}
                    onChangeText={setTeamB}
                    editable={!bloqueado && !saving}
                    keyboardType="numeric"
                    style={[styles.input, bloqueado && styles.disabledInput]}
                />
                <TouchableOpacity
                    disabled={saving || loading || bloqueado}
                    onPress={updateGuess}
                    style={[styles.button, bloqueado && styles.disabledButton]}>
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
        padding: 20,
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
    meta: {
        color: CopaTheme.textMuted,
    },
    lockedNotice: {
        borderRadius: 12,
        backgroundColor: CopaTheme.dangerLight,
        color: CopaTheme.danger,
        fontWeight: "700",
        padding: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: CopaTheme.border,
        borderRadius: 14,
        backgroundColor: CopaTheme.surfaceAlt,
        padding: 14,
    },
    disabledInput: {
        opacity: 0.7,
    },
    button: {
        alignItems: "center",
        backgroundColor: CopaTheme.info,
        padding: 15,
        borderRadius: 14,
    },
    disabledButton: {
        opacity: 0.55,
    },
    buttonText: {
        color: CopaTheme.textLight,
        fontWeight: "800",
    },
});
