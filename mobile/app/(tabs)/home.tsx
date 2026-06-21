import { View, FlatList, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { matches } from "../../mocks/matches";
import { getUpcomingMatches } from "../../utils/match-utils";
import { useAuth } from "../../contexts/AuthContext";
import { MatchCard } from "../../components/MatchCard";
import { ScreenHeader } from "../../components/ScreenHeader";
import { CopaTheme } from "../../constants/copa-theme";

export default function HomeScreen() {
    const { user } = useAuth();
    const upcomingMatches = getUpcomingMatches(matches, 5);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <ScreenHeader
                    title={`Olá, ${user?.name?.split(" ")[0] ?? "Torcedor"}!`}
                    subtitle="Confira as próximas partidas e registre seus palpites a tempo."
                />

                <View style={styles.banner}>
                    <Text style={styles.bannerTitle}>Copa do Mundo 2026</Text>
                    <Text style={styles.bannerText}>
                        {upcomingMatches.length} partida(s) disponível(is) para palpite
                    </Text>
                </View>

                <Text style={styles.sectionTitle}>Próximas Partidas</Text>

                <FlatList
                    data={upcomingMatches}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.empty}>
                            <Text style={styles.emptyText}>
                                Nenhuma partida disponível para palpite no momento.
                            </Text>
                        </View>
                    }
                    renderItem={({ item, index }) => (
                        <MatchCard match={item} highlight={index === 0} showGuessAction />
                    )}
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
    banner: {
        backgroundColor: CopaTheme.primaryDark,
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
    },
    bannerTitle: {
        color: CopaTheme.textLight,
        fontSize: 18,
        fontWeight: "800",
    },
    bannerText: {
        color: CopaTheme.primaryLight,
        marginTop: 6,
        fontWeight: "600",
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "800",
        color: CopaTheme.primaryDark,
        marginBottom: 12,
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
