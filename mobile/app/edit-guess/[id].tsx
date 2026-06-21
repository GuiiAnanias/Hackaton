import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditGuessScreen() {
    const { id } = useLocalSearchParams();

    const [teamA, setTeamA] = useState("2");
    const [teamB, setTeamB] = useState("1");

    const updateGuess = () => {
        Alert.alert(
            "Atualizado",
            `Palpite ${id} atualizado`
        );
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
                    onPress={updateGuess}
                    style={{
                        backgroundColor: "#2563eb",
                        padding: 15,
                        borderRadius: 8,
                    }}>
                    <Text
                        style={{
                            color: "#fff",
                            textAlign: "center",
                        }}> Atualizar </Text>
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