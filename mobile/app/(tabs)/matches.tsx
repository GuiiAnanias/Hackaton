import { View, Text, FlatList, StyleSheet } from "react-native";
import { matches } from "../../mocks/matches";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MatchesScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flex: 1, padding: 20 }}>
                <Text style={{
                        fontSize: 24,
                        fontWeight: "bold",
                        marginBottom: 20,
                    }}> Partidas </Text>
                <FlatList
                    data={matches}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={{
                                padding: 16,
                                backgroundColor: "#fff",
                                marginBottom: 10,
                                borderRadius: 12,
                            }} >
                            <Text> {item.teamA} x {item.teamB}</Text>
                            <Text>{item.date}</Text>
                        </View>
                    )}
                />
            </View>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f0f0f0",
    }
});