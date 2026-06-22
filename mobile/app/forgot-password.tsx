import { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { recuperarSenha } from "../api";

export default function ForgotPasswordScreen() {
    const [email, setEmail] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleReset() {
        if (!email.trim() || !novaSenha.trim()) {
            Alert.alert("Atenção", "Informe e-mail e nova senha.");
            return;
        }

        try {
            setLoading(true);
            await recuperarSenha(email.trim(), novaSenha);
            Alert.alert("Senha atualizada", "Agora você já pode entrar com a nova senha.");
            router.replace("/login");
        } catch (error) {
            Alert.alert("Erro", error instanceof Error ? error.message : "Não foi possível atualizar a senha.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Recuperar Senha</Text>
                <Text style={styles.subtitle}>Informe seu e-mail e escolha uma nova senha.</Text>

                <TextInput
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholder="E-mail"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Nova senha"
                    secureTextEntry
                    value={novaSenha}
                    onChangeText={setNovaSenha}
                    style={styles.input}
                />

                <TouchableOpacity disabled={loading} onPress={handleReset} style={styles.button}>
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Atualizar Senha</Text>}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.link}>Voltar</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "#eff6ff",
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
        backgroundColor: "#2563eb",
        padding: 14,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "700",
    },
    link: {
        color: "#2563eb",
        fontWeight: "700",
        textAlign: "center",
    },
});
