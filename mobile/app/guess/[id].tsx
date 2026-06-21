import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GuessScreen() {
    const { id } = useLocalSearchParams();

    const [teamA, setTeamA] = useState("");
    const [teamB, setTeamB] = useState("");

    const saveGuess = () => {
        Alert.alert(
            "Sucesso",
            `Palpite salvo para partida ${id}`
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
                    onPress={saveGuess}
                    style={{
                        backgroundColor: "green",
                        padding: 15,
                        borderRadius: 8,
                    }}>
                    <Text
                        style={{
                            color: "#fff",
                            textAlign: "center",
                        }}> Salvar </Text>
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