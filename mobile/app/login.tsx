import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_BASE_URL } from "../api";
import { useAuth } from "../auth";
import { CopaTheme } from "../constants/copa-theme";
import { showAppAlert } from "../utils/app-alert";
import { isValidEmail } from "../utils/validators";

export default function LoginScreen() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLogin() {
        if (!email.trim() || !senha.trim()) {
            showAppAlert("Atenção", "Informe e-mail e senha.");
            return;
        }

        const emailValue = email.trim();
        if (!isValidEmail(emailValue)) {
            showAppAlert("Atenção", "Informe um e-mail válido.");
            return;
        }

        try {
            setLoading(true);
            await login(emailValue, senha);
            router.replace("/(tabs)/home");
        } catch (error) {
            showAppAlert("Erro no login", error instanceof Error ? error.message : "Não foi possível fazer login.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.brand}>
                <View style={styles.brandMark}>
                    <Text style={styles.brandMarkText}>26</Text>
                </View>
                <Text style={styles.brandKicker}>Copa do Mundo</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.title}>Bolão Copa 2026</Text>
                <Text style={styles.subtitle}>Entre para palpitar nas partidas da Copa.</Text>
                <Text style={styles.backend}>Conectado em {API_BASE_URL}</Text>

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

                <TouchableOpacity onPress={() => router.push("/forgot-password")} style={styles.secondaryButton}>
                    <Text style={styles.secondaryButtonText}>Esqueci minha senha</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push("/register")} style={styles.createButton}>
                    <Text style={styles.createButtonText}>Criar nova conta</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.replace("/public")} style={styles.publicButton}>
                    <Text style={styles.publicButtonText}>Ver área pública</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: CopaTheme.primaryDark,
        padding: 22,
    },
    brand: {
        alignItems: "center",
        marginBottom: 18,
    },
    brandMark: {
        alignItems: "center",
        justifyContent: "center",
        width: 66,
        height: 66,
        borderRadius: 22,
        backgroundColor: CopaTheme.accent,
        borderWidth: 4,
        borderColor: "rgba(255, 255, 255, 0.22)",
    },
    brandMarkText: {
        color: CopaTheme.primaryDark,
        fontSize: 24,
        fontWeight: "900",
    },
    brandKicker: {
        color: CopaTheme.primaryLight,
        fontSize: 12,
        fontWeight: "900",
        letterSpacing: 0,
        marginTop: 8,
        textTransform: "uppercase",
    },
    card: {
        gap: 13,
        padding: 22,
        borderRadius: 26,
        backgroundColor: CopaTheme.surface,
        borderWidth: 1,
        borderColor: CopaTheme.border,
        ...CopaTheme.shadow,
    },
    title: {
        fontSize: 30,
        fontWeight: "900",
        textAlign: "center",
        color: CopaTheme.primaryDark,
    },
    subtitle: {
        color: CopaTheme.textMuted,
        fontSize: 14,
        textAlign: "center",
    },
    backend: {
        alignSelf: "center",
        borderRadius: 999,
        backgroundColor: CopaTheme.surfaceAlt,
        color: CopaTheme.textSoft,
        fontSize: 12,
        marginBottom: 6,
        paddingHorizontal: 10,
        paddingVertical: 5,
        textAlign: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: CopaTheme.border,
        borderRadius: 14,
        backgroundColor: CopaTheme.surfaceAlt,
        color: CopaTheme.primaryDark,
        fontSize: 15,
        padding: 14,
    },
    button: {
        alignItems: "center",
        borderRadius: 14,
        backgroundColor: CopaTheme.primary,
        minHeight: 50,
        justifyContent: "center",
        padding: 15,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "900",
    },
    secondaryButton: {
        alignItems: "center",
        justifyContent: "center",
        minHeight: 48,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: CopaTheme.border,
        backgroundColor: CopaTheme.surfaceAlt,
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    secondaryButtonText: {
        color: CopaTheme.info,
        fontSize: 15,
        fontWeight: "900",
        textAlign: "center",
    },
    createButton: {
        alignItems: "center",
        justifyContent: "center",
        minHeight: 48,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: CopaTheme.primary,
        backgroundColor: CopaTheme.primaryLight,
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    createButtonText: {
        color: CopaTheme.primaryDark,
        fontSize: 15,
        fontWeight: "900",
        textAlign: "center",
    },
    publicButton: {
        alignItems: "center",
        justifyContent: "center",
        minHeight: 44,
        paddingHorizontal: 14,
    },
    publicButtonText: {
        color: CopaTheme.textMuted,
        fontSize: 14,
        fontWeight: "800",
        textAlign: "center",
    },
});
