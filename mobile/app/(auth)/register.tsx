import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ScrollView,
} from "react-native";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../contexts/AuthContext";
import { PrimaryButton } from "../../components/PrimaryButton";
import { CopaTheme } from "../../constants/copa-theme";

export default function RegisterScreen() {
    const { register } = useAuth();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!name.trim() || !email.trim() || !password.trim()) {
            Alert.alert("Atenção", "Preencha todos os campos.");
            return;
        }
        if (password.length < 6) {
            Alert.alert("Atenção", "A senha deve ter pelo menos 6 caracteres.");
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert("Atenção", "As senhas não coincidem.");
            return;
        }

        setLoading(true);
        try {
            await register(name, email, password);
            router.replace("/(tabs)/home");
        } catch (error) {
            Alert.alert("Erro", error instanceof Error ? error.message : "Falha no cadastro.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={styles.flex}>
                <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                    <Text style={styles.title}>Criar conta</Text>
                    <Text style={styles.subtitle}>
                        Cadastre-se para participar do bolão da Copa do Mundo 2026.
                    </Text>

                    <View style={styles.form}>
                        <Text style={styles.label}>Nome completo</Text>
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            placeholder="Seu nome"
                            style={styles.input}
                        />

                        <Text style={styles.label}>E-mail</Text>
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            placeholder="seu@email.com"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            style={styles.input}
                        />

                        <Text style={styles.label}>Senha</Text>
                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Mínimo 6 caracteres"
                            secureTextEntry
                            style={styles.input}
                        />

                        <Text style={styles.label}>Confirmar senha</Text>
                        <TextInput
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            placeholder="Repita a senha"
                            secureTextEntry
                            style={styles.input}
                        />

                        <PrimaryButton label="Cadastrar" onPress={handleRegister} loading={loading} />

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Já possui conta?</Text>
                            <Link href="/(auth)/login" asChild>
                                <TouchableOpacity>
                                    <Text style={styles.footerLink}> Entrar</Text>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: CopaTheme.background,
    },
    flex: {
        flex: 1,
    },
    content: {
        flexGrow: 1,
        padding: 24,
        justifyContent: "center",
    },
    title: {
        fontSize: 28,
        fontWeight: "800",
        color: CopaTheme.primaryDark,
        marginBottom: 8,
    },
    subtitle: {
        color: CopaTheme.textMuted,
        marginBottom: 24,
        lineHeight: 21,
    },
    form: {
        backgroundColor: CopaTheme.surface,
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: CopaTheme.border,
    },
    label: {
        fontSize: 14,
        fontWeight: "700",
        color: CopaTheme.primaryDark,
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: CopaTheme.border,
        backgroundColor: "#f8fafc",
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        marginBottom: 16,
        fontSize: 15,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 18,
    },
    footerText: {
        color: CopaTheme.textMuted,
    },
    footerLink: {
        color: CopaTheme.primary,
        fontWeight: "700",
    },
});
