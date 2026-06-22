import { useEffect, useState } from "react";
import { ActivityIndicator, View, Text, TextInput, TouchableOpacity, Alert, StyleSheet} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { atualizarPalpite, buscarPalpite } from "../../api";
import { useAuth } from "../../auth";

export default function EditGuessScreen() {
    const { id } = useLocalSearchParams();
    const { user } = useAuth();

    const [teamA, setTeamA] = useState("");
    const [teamB, setTeamB] = useState("");
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
                <TouchableOpacity onPress={() => router.back()}
                    style={{
                        marginBottom: 20,
                    }}>
                <Text
                    style={{
                        color: "#2563eb",
                        fontSize: 16,
                        fontWeight: "600",
                    }}> Voltar </Text>
                </TouchableOpacity>

                <Text style={{
                        fontSize: 24,
                        fontWeight: "bold",
                        marginBottom: 20,
                    }}> Editar Palpite </Text>

                {loading && <ActivityIndicator color="#2563eb" />}

                <TextInput
                    value={teamA}
                    onChangeText={setTeamA}
                    keyboardType="numeric"
                    style={{
                        borderWidth: 1,
                        padding: 10,
                        marginBottom: 10,
                    }}
                />
                <TextInput
                    value={teamB}
                    onChangeText={setTeamB}
                    keyboardType="numeric"
                    style={{
                        borderWidth: 1,
                        padding: 10,
                        marginBottom: 20,
                    }}
                />
                <TouchableOpacity
                    disabled={saving || loading}
                    onPress={updateGuess}
                    style={{
                        backgroundColor: "#2563eb",
                        padding: 15,
                        borderRadius: 8,
                    }}>
                    {saving ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text
                            style={{
                                color: "#fff",
                                textAlign: "center",
                            }}> Atualizar </Text>
                    )}
                </TouchableOpacity>
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
    header: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#EAEAEA',
        borderRadius: 20
    },
});