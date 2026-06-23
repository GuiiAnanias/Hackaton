import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { confirmarRecuperacaoSenha, solicitarRecuperacaoSenha } from "../api";
import { CopaTheme } from "../constants/copa-theme";
import { showAppAlert } from "../utils/app-alert";

export default function ForgotPasswordScreen() {
    const [email, setEmail] = useState("");
    const [token, setToken] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [tokenSolicitado, setTokenSolicitado] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleRequestToken() {
        if (!email.trim()) {
            showAppAlert("Atenção", "Informe o e-mail.");
            return;
        }

        try {
            setLoading(true);
            const response = await solicitarRecuperacaoSenha(email.trim());
            setToken(response.token);
            setTokenSolicitado(true);
            showAppAlert("Token gerado", `Use este token para trocar sua senha: ${response.token}`);
        } catch (error) {
            showAppAlert("Erro", error instanceof Error ? error.message : "Não foi possível gerar o token.");
        } finally {
            setLoading(false);
        }
    }

    async function handleReset() {
        if (!email.trim() || !token.trim() || !novaSenha.trim()) {
            showAppAlert("Atenção", "Informe e-mail, token e nova senha.");
            return;
        }

        try {
            setLoading(true);
            await confirmarRecuperacaoSenha(email.trim(), token.trim(), novaSenha);
            showAppAlert("Senha atualizada", "Agora você já pode entrar com a nova senha.", [
                { text: "Entrar", onPress: () => router.replace("/login") },
            ]);
        } catch (error) {
            showAppAlert("Erro", error instanceof Error ? error.message : "Não foi possível atualizar a senha.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.brand}>
                <View style={styles.brandMark}>
                    <Text style={styles.brandMarkText}>?</Text>
                </View>
                <Text style={styles.brandKicker}>Acesso seguro</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.title}>Recuperar senha</Text>
                <Text style={styles.subtitle}>Informe seu e-mail, gere o token e escolha uma nova senha.</Text>

                <TextInput
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholder="E-mail"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                />
                <TouchableOpacity disabled={loading} onPress={handleRequestToken} style={styles.secondaryButton}>
                    <Text style={styles.secondaryButtonText}>{tokenSolicitado ? "Token gerado" : "Gerar token"}</Text>
                </TouchableOpacity>
                <TextInput
                    autoCapitalize="none"
                    placeholder="Token"
                    value={token}
                    onChangeText={setToken}
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
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Atualizar senha</Text>}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>Voltar</Text>
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
        fontSize: 30,
        fontWeight: "900",
        lineHeight: 34,
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
        color: CopaTheme.primaryDark,
        fontSize: 30,
        fontWeight: "900",
        textAlign: "center",
    },
    subtitle: {
        color: CopaTheme.textMuted,
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
        borderColor: CopaTheme.info,
        backgroundColor: "#eff6ff",
        padding: 15,
    },
    secondaryButtonText: {
        color: CopaTheme.info,
        fontSize: 15,
        fontWeight: "900",
    },
    backButton: {
        alignItems: "center",
        justifyContent: "center",
        minHeight: 46,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: CopaTheme.border,
        backgroundColor: CopaTheme.surfaceAlt,
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    backButtonText: {
        color: CopaTheme.primaryDark,
        fontSize: 15,
        fontWeight: "900",
        textAlign: "center",
    },
});
