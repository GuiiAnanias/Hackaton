import { useEffect, useState } from "react";
import { ActivityIndicator, View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { listarPartidas, Partida } from "../../api";

export default function MatchesScreen() {
    const [matches, setMatches] = useState<Partida[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState("TODAS");
    const [phaseFilter, setPhaseFilter] = useState("TODAS");
    const [dateFilter, setDateFilter] = useState("");

    useEffect(() => {
        listarPartidas()
            .then(setMatches)
            .catch((err) => setError(err instanceof Error ? err.message : "Erro ao carregar partidas"))
            .finally(() => setLoading(false));
    }, []);

    const phases = Array.from(new Set(matches.map((match) => match.fase))).filter(Boolean);
    const filteredMatches = matches.filter((match) => {
        const matchDate = new Date(match.dataHora).toLocaleDateString("pt-BR");
        const statusOk = statusFilter === "TODAS" || match.status === statusFilter;
        const phaseOk = phaseFilter === "TODAS" || match.fase === phaseFilter;
        const dateOk = !dateFilter || matchDate.includes(dateFilter);

        return statusOk && phaseOk && dateOk;
    });

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flex: 1, padding: 20 }}>
                <Text style={styles.title}>Partidas</Text>
                {loading && <ActivityIndicator color="green" />}
                {error && <Text style={styles.error}>{error}</Text>}

                <TextInput
                    placeholder="Filtrar por data (ex: 16/07)"
                    value={dateFilter}
                    onChangeText={setDateFilter}
                    style={styles.input}
                />

                <View style={styles.filterRow}>
                    {["TODAS", "AGENDADA", "ENCERRADA"].map((status) => (
                        <TouchableOpacity
                            key={status}
                            onPress={() => setStatusFilter(status)}
                            style={[styles.filterChip, statusFilter === status && styles.filterChipActive]}
                        >
                            <Text style={[styles.filterText, statusFilter === status && styles.filterTextActive]}>{status}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.filterRow}>
                    {["TODAS", ...phases].map((phase) => (
                        <TouchableOpacity
                            key={phase}
                            onPress={() => setPhaseFilter(phase)}
                            style={[styles.filterChip, phaseFilter === phase && styles.filterChipActive]}
                        >
                            <Text style={[styles.filterText, phaseFilter === phase && styles.filterTextActive]}>{phase}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <FlatList
                    data={filteredMatches}
                    keyExtractor={(item) => item.id.toString()}
                    ListEmptyComponent={!loading ? <Text>Nenhuma partida cadastrada.</Text> : null}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => router.push({ pathname: "/match/[id]", params: { id: String(item.id) } })}
                            style={styles.card}
                        >
                            <Text> {item.mandante} x {item.visitante}</Text>
                            <Text>{new Date(item.dataHora).toLocaleString("pt-BR")}</Text>
                            <Text>Status: {item.status}</Text>
                            <Text>Fase: {item.fase}</Text>
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
        marginBottom: 14,
    },
    input: {
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 10,
        backgroundColor: "#fff",
        marginBottom: 10,
        padding: 12,
    },
    filterRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginBottom: 10,
    },
    filterChip: {
        borderWidth: 1,
        borderColor: "#16a34a",
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    filterChipActive: {
        backgroundColor: "#16a34a",
    },
    filterText: {
        color: "#15803d",
        fontSize: 12,
        fontWeight: "700",
    },
    filterTextActive: {
        color: "#fff",
    },
    card: {
        padding: 16,
        backgroundColor: "#fff",
        marginBottom: 10,
        borderRadius: 12,
    },
    error: {
        color: "#dc2626",
        marginBottom: 12,
    },
});