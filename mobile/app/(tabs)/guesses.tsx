import { View, FlatList, StyleSheet, Text } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { matches } from "../../mocks/matches";
import { getMatchById, isMatchLocked } from "../../utils/match-utils";
import { useGuesses } from "../../contexts/GuessesContext";
import { GuessCard } from "../../components/GuessCard";
import { ScreenHeader } from "../../components/ScreenHeader";
import { CopaTheme } from "../../constants/copa-theme";

export default function MyGuessesScreen() {
    const { guesses, isLoading } = useGuesses();
    const totalPoints = guesses.reduce((sum, guess) => sum + guess.points, 0);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <ScreenHeader
                    title="Meus Palpites"
                    subtitle="Acompanhe seus palpites e a pontuação individual de cada partida."
                />

                <View style={styles.summaryCard}>
                    <Text style={styles.summaryValue}>{totalPoints}</Text>
                    <Text style={styles.summaryLabel}>Pontos totais acumulados</Text>
                </View>

                <FlatList
                    data={guesses}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.empty}>
                            <Text style={styles.emptyText}>
                                {isLoading
                                    ? "Carregando palpites..."
                                    : "Você ainda não registrou nenhum palpite."}
                            </Text>
                        </View>
                    }
                    renderItem={({ item }) => {
                        const match = getMatchById(matches, item.matchId);
                        const locked = match ? isMatchLocked(match) : false;

                        return (
                            <GuessCard
                                guess={item}
                                match={match}
                                onPress={
                                    locked
                                        ? undefined
                                        : () => router.push(`/edit-guess/${item.id}`)
                                }
                            />
                        );
                    }}
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
    summaryCard: {
        backgroundColor: CopaTheme.primaryDark,
        borderRadius: 16,
        padding: 18,
        marginBottom: 16,
        alignItems: "center",
    },
    summaryValue: {
        fontSize: 32,
        fontWeight: "800",
        color: CopaTheme.textLight,
    },
    summaryLabel: {
        marginTop: 4,
        color: CopaTheme.primaryLight,
        fontWeight: "600",
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
