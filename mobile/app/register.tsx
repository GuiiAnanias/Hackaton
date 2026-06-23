import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../auth";
import { CopaTheme } from "../constants/copa-theme";
import { showAppAlert } from "../utils/app-alert";
import { isValidEmail } from "../utils/validators";

export default function RegisterScreen() {
    const { cadastrar } = useAuth();
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleRegister() {
        if (!nome.trim() || !email.trim() || !senha.trim()) {
            showAppAlert("Atenção", "Preencha nome, e-mail e senha.");
            return;
        }

        const emailValue = email.trim();
        if (!isValidEmail(emailValue)) {
            showAppAlert("Atenção", "Informe um e-mail válido.");
            return;
        }

        try {
            setLoading(true);
            await cadastrar(nome.trim(), emailValue, senha);
            router.replace("/(tabs)/home");
        } catch (error) {
            showAppAlert("Erro no cadastro", error instanceof Error ? error.message : "Não foi possível cadastrar.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.brand}>
                <View style={styles.brandMark}>
                    <Text style={styles.brandMarkText}>+</Text>
                </View>
                <Text style={styles.brandKicker}>Novo participante</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.title}>Criar conta</Text>
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

                <TouchableOpacity onPress={() => router.replace("/login")} style={styles.loginButton}>
                    <Text style={styles.loginButtonText}>Já tenho conta</Text>
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
    loginButton: {
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
    loginButtonText: {
        color: CopaTheme.primaryDark,
        fontSize: 15,
        fontWeight: "900",
        textAlign: "center",
    },
});
