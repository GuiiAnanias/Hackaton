import { useMemo, useState } from "react";
import { View, FlatList, StyleSheet, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { matches, MATCH_DATES, MATCH_PHASES, MATCH_STATUSES } from "../../mocks/matches";
import { filterMatches } from "../../utils/match-utils";
import { MatchCard } from "../../components/MatchCard";
import { FilterChip } from "../../components/FilterChip";
import { ScreenHeader } from "../../components/ScreenHeader";
import { CopaTheme, STATUS_LABELS } from "../../constants/copa-theme";

export default function MatchesScreen() {
    const [selectedPhase, setSelectedPhase] = useState<(typeof MATCH_PHASES)[number]>("TODAS");
    const [selectedStatus, setSelectedStatus] = useState<(typeof MATCH_STATUSES)[number]>("TODOS");
    const [selectedDate, setSelectedDate] = useState("");

    const filteredMatches = useMemo(
        () =>
            filterMatches(matches, {
                phase: selectedPhase,
                status: selectedStatus,
                date: selectedDate || undefined,
            }),
        [selectedPhase, selectedStatus, selectedDate]
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <ScreenHeader
                    title="Partidas"
                    subtitle="Filtre por data, fase e status para encontrar jogos específicos."
                />

                <Text style={styles.filterLabel}>Fase</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterRowContent}>
                    {MATCH_PHASES.map((phase) => (
                        <FilterChip
                            key={phase}
                            label={phase}
                            selected={selectedPhase === phase}
                            onPress={() => setSelectedPhase(phase)}
                        />
                    ))}
                </ScrollView>

                <Text style={styles.filterLabel}>Status</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterRowContent}>
                    {MATCH_STATUSES.map((status) => (
                        <FilterChip
                            key={status}
                            label={status === "TODOS" ? "Todos" : STATUS_LABELS[status]}
                            selected={selectedStatus === status}
                            onPress={() => setSelectedStatus(status)}
                        />
                    ))}
                </ScrollView>

                <Text style={styles.filterLabel}>Data</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterRowContent}>
                    {MATCH_DATES.map((dateOption) => (
                        <FilterChip
                            key={dateOption.value || "all"}
                            label={dateOption.label}
                            selected={selectedDate === dateOption.value}
                            onPress={() => setSelectedDate(dateOption.value)}
                        />
                    ))}
                </ScrollView>

                <Text style={styles.resultCount}>
                    {filteredMatches.length} partida(s) encontrada(s)
                </Text>

                <FlatList
                    data={filteredMatches}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.empty}>
                            <Text style={styles.emptyText}>
                                Nenhuma partida encontrada com os filtros selecionados.
                            </Text>
                        </View>
                    }
                    renderItem={({ item }) => <MatchCard match={item} />}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: CopaTheme.background,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    filterLabel: {
        fontSize: 13,
        fontWeight: "700",
        color: CopaTheme.primaryDark,
        marginBottom: 8,
        marginTop: 4,
    },
    filterRowContent: {
        flexDirection: "row",
        alignItems: "center",
        paddingRight: 12,
        marginBottom: 8,
    },
    resultCount: {
        fontSize: 13,
        color: CopaTheme.textMuted,
        fontWeight: "600",
        marginBottom: 12,
        marginTop: 4,
    },
    empty: {
        backgroundColor: CopaTheme.surface,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: CopaTheme.border,
    },
    emptyText: {
        textAlign: "center",
        color: CopaTheme.textMuted,
    },
});
