import { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_BASE_URL } from "../api";
import { useAuth } from "../auth";
import { CopaTheme } from "../constants/copa-theme";

export default function LoginScreen() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLogin() {
        if (!email.trim() || !senha.trim()) {
            Alert.alert("Atenção", "Informe e-mail e senha.");
            return;
        }

        try {
            setLoading(true);
            await login(email.trim(), senha);
            router.replace("/(tabs)/home");
        } catch (error) {
            Alert.alert("Erro no login", error instanceof Error ? error.message : "Não foi possível fazer login.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Bolão Copa 2026</Text>
                <Text style={styles.subtitle}>Entre para palpitar nas partidas da Copa.</Text>
                <Text style={styles.backend}>Backend: {API_BASE_URL}</Text>

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

                <TouchableOpacity disabled={loading} onPress={handleLogin} style={styles.button}>
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Entrar</Text>}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push("/forgot-password")}>
                    <Text style={styles.link}>Esqueci minha senha</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push("/register")}>
                    <Text style={styles.registerLink}>Criar nova conta</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: CopaTheme.background,
        padding: 20,
    },
    card: {
        gap: 12,
        padding: 22,
        borderRadius: 22,
        backgroundColor: CopaTheme.surface,
        borderWidth: 1,
        borderColor: CopaTheme.border,
    },
    title: {
        fontSize: 28,
        fontWeight: "800",
        textAlign: "center",
        color: CopaTheme.primaryDark,
    },
    subtitle: {
        color: CopaTheme.textMuted,
        fontSize: 14,
        textAlign: "center",
    },
    backend: {
        color: "#9ca3af",
        fontSize: 12,
        marginBottom: 6,
        textAlign: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: CopaTheme.border,
        borderRadius: 10,
        backgroundColor: "#f8fafc",
        padding: 12,
    },
    button: {
        alignItems: "center",
        borderRadius: 10,
        backgroundColor: CopaTheme.primary,
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
    registerLink: {
        color: CopaTheme.primary,
        fontWeight: "800",
        textAlign: "center",
    },
});
