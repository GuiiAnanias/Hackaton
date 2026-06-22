import { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../auth";

export default function RegisterScreen() {
    const { cadastrar } = useAuth();
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleRegister() {
        if (!nome.trim() || !email.trim() || !senha.trim()) {
            Alert.alert("Atenção", "Preencha nome, e-mail e senha.");
            return;
        }

        try {
            setLoading(true);
            await cadastrar(nome.trim(), email.trim(), senha);
            router.replace("/(tabs)/home");
        } catch (error) {
            Alert.alert("Erro no cadastro", error instanceof Error ? error.message : "Não foi possível cadastrar.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Criar Conta</Text>
                <Text style={styles.subtitle}>Entre no bolão e acompanhe seus palpites.</Text>

                <TextInput placeholder="Nome" value={nome} onChangeText={setNome} style={styles.input} />
                <TextInput
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholder="E-mail"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Senha"
                    secureTextEntry
                    value={senha}
                    onChangeText={setSenha}
                    style={styles.input}
                />

                <TouchableOpacity disabled={loading} onPress={handleRegister} style={styles.button}>
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Cadastrar</Text>}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.replace("/login")}>
                    <Text style={styles.link}>Já tenho conta</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "#ecfdf5",
        padding: 20,
    },
    card: {
        gap: 12,
        padding: 20,
        borderRadius: 18,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 26,
        fontWeight: "800",
        textAlign: "center",
    },
    subtitle: {
        color: "#6b7280",
        textAlign: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 10,
        padding: 12,
    },
    button: {
        alignItems: "center",
        borderRadius: 10,
        backgroundColor: "#16a34a",
        padding: 14,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "700",
    },
    link: {
        color: "#15803d",
        fontWeight: "700",
        textAlign: "center",
    },
});
