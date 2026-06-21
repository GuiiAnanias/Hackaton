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
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useAuth } from "../../contexts/AuthContext";
import { PrimaryButton } from "../../components/PrimaryButton";
import { CopaTheme } from "../../constants/copa-theme";

export default function LoginScreen() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert("Atenção", "Preencha e-mail e senha.");
            return;
        }
        setLoading(true);
        try {
            await login(email, password);
            router.replace("/(tabs)/home");
        } catch (error) {
            Alert.alert("Erro", error instanceof Error ? error.message : "Falha no login.");
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
                    <View style={styles.hero}>
                        <View style={styles.iconCircle}>
                            <FontAwesome name="futbol-o" size={34} color={CopaTheme.textLight} />
                        </View>
                        <Text style={styles.title}>Bolão Copa 2026</Text>
                        <Text style={styles.subtitle}>
                            Entre para palpitar, acompanhar partidas e sua pontuação.
                        </Text>
                    </View>

                    <View style={styles.form}>
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
                            placeholder="Sua senha"
                            secureTextEntry
                            style={styles.input}
                        />

                        <Link href="/(auth)/forgot-password" asChild>
                            <TouchableOpacity style={styles.linkWrap}>
                                <Text style={styles.link}>Esqueci minha senha</Text>
                            </TouchableOpacity>
                        </Link>

                        <PrimaryButton label="Entrar" onPress={handleLogin} loading={loading} />

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Ainda não tem conta?</Text>
                            <Link href="/(auth)/register" asChild>
                                <TouchableOpacity>
                                    <Text style={styles.footerLink}> Cadastre-se</Text>
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
    hero: {
        alignItems: "center",
        marginBottom: 28,
    },
    iconCircle: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: CopaTheme.primary,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: "800",
        color: CopaTheme.primaryDark,
    },
    subtitle: {
        marginTop: 8,
        textAlign: "center",
        color: CopaTheme.textMuted,
        lineHeight: 21,
        paddingHorizontal: 12,
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
    linkWrap: {
        alignSelf: "flex-end",
        marginBottom: 18,
    },
    link: {
        color: CopaTheme.info,
        fontWeight: "600",
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
