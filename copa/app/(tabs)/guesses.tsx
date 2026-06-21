import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const guesses = [
    {
        id: 1,
        match: "Brasil x Argentina",
        guess: "2 x 1",
        points: 10,
    },
    {
        id: 2,
        match: "França x Alemanha",
        guess: "1 x 0",
        points: 5,
    },
];

export default function MyGuessesScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flex: 1, padding: 20 }}>
                <Text
                    style={{
                        fontSize: 24,
                        fontWeight: "bold",
                        marginBottom: 20,
                    }}> Meus Palpites </Text>

                <FlatList
                    data={guesses}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() =>
                                router.push(
                                    `/edit-guess/${item.id}`
                                )
                            }>
                            <View
                                style={{
                                    padding: 16,
                                    backgroundColor: "#fff",
                                    marginBottom: 10,
                                    borderRadius: 12,
                                }}>
                                <Text>{item.match}</Text>
                                <Text>Palpite: {item.guess}</Text>
                                <Text>{item.points} pontos</Text>
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
        backgroundColor: "#f0f0f0",
    }
});