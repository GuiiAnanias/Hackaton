import { useCallback, useState } from "react";
import { ActivityIndicator, View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { listarMeusPalpites, Palpite } from "../../api";
import { useAuth } from "../../auth";

export default function MyGuessesScreen() {
    const { user } = useAuth();
    const [guesses, setGuesses] = useState<Palpite[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useFocusEffect(useCallback(() => {
        if (!user) {
            return;
        }

        setLoading(true);
        setError(null);
        listarMeusPalpites(user.token)
            .then(setGuesses)
            .catch((err) => setError(err instanceof Error ? err.message : "Erro ao carregar palpites"))
            .finally(() => setLoading(false));
    }, [user]));

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flex: 1, padding: 20 }}>
                <Text style={styles.title}>Meus Palpites</Text>

                {loading && <ActivityIndicator color="green" />}
                {error && <Text style={styles.error}>{error}</Text>}

                <FlatList
                    data={guesses}
                    keyExtractor={(item) => item.id.toString()}
                    ListEmptyComponent={!loading ? <Text>Você ainda não registrou palpites.</Text> : null}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() =>
                                router.push({ pathname: "/edit-guess/[id]", params: { id: String(item.id) } })
                            }>
                            <View style={styles.card}>
                                <Text style={styles.matchTitle}>{item.mandante} x {item.visitante}</Text>
                                <Text style={styles.guessText}>Palpite: {item.golsMandante} x {item.golsVisitante}</Text>
                                <Text style={styles.points}>{item.pontos ?? 0} pontos</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </View>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f0fdf4",
    },
    title: {
        fontSize: 24,
        fontWeight: "800",
        marginBottom: 20,
    },
    card: {
        padding: 16,
        backgroundColor: "#fff",
        marginBottom: 10,
        borderRadius: 14,
    },
    matchTitle: {
        fontSize: 17,
        fontWeight: "800",
    },
    guessText: {
        color: "#374151",
        marginTop: 6,
    },
    points: {
        color: "#16a34a",
        fontWeight: "800",
        marginTop: 6,
    },
    error: {
        color: "#dc2626",
        marginBottom: 12,
    },
});