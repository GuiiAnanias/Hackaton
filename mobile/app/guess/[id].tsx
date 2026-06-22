import { useState } from "react";
import { ActivityIndicator, View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { salvarPalpite } from "../../api";
import { useAuth } from "../../auth";

export default function GuessScreen() {
    const { id } = useLocalSearchParams();
    const { user } = useAuth();

    const [teamA, setTeamA] = useState("");
    const [teamB, setTeamB] = useState("");
    const [loading, setLoading] = useState(false);

    const saveGuess = async () => {
        if (!user) {
            router.replace("/login");
            return;
        }

        const partidaId = Number(Array.isArray(id) ? id[0] : id);
        const golsMandante = Number(teamA);
        const golsVisitante = Number(teamB);

        if (!Number.isInteger(golsMandante) || !Number.isInteger(golsVisitante)
            || golsMandante < 0 || golsVisitante < 0) {
            Alert.alert("Atenção", "Informe placares válidos.");
            return;
        }

        try {
            setLoading(true);
            await salvarPalpite(user.token, partidaId, golsMandante, golsVisitante);
            Alert.alert("Sucesso", "Palpite salvo.");
            router.replace("/(tabs)/guesses");
        } catch (error) {
            Alert.alert("Erro", error instanceof Error ? error.message : "Não foi possível salvar o palpite.");
        } finally {
            setLoading(false);
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
                    }}> Registrar Palpite </Text>
                    
                <TextInput
                    placeholder="Gols Time A"
                    keyboardType="numeric"
                    value={teamA}
                    onChangeText={setTeamA}
                    style={{
                        borderWidth: 1,
                        padding: 10,
                        marginBottom: 10,
                    }}
                />
                <TextInput
                    placeholder="Gols Time B"
                    keyboardType="numeric"
                    value={teamB}
                    onChangeText={setTeamB}
                    style={{
                        borderWidth: 1,
                        padding: 10,
                        marginBottom: 20,
                    }}
                />
                <TouchableOpacity
                    disabled={loading}
                    onPress={saveGuess}
                    style={{
                        backgroundColor: "green",
                        padding: 15,
                        borderRadius: 8,
                    }}>
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text
                            style={{
                                color: "#fff",
                                textAlign: "center",
                            }}> Salvar </Text>
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
        padding: 20
    },
    header: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#EAEAEA',
        borderRadius: 20
    },
});