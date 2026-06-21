import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../contexts/AuthContext";
import { PrimaryButton } from "../../components/PrimaryButton";
import { CopaTheme } from "../../constants/copa-theme";

export default function ForgotPasswordScreen() {
    const { recoverPassword } = useAuth();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRecover = async () => {
        if (!email.trim()) {
            Alert.alert("Atenção", "Informe seu e-mail.");
            return;
        }
        setLoading(true);
        try {
            const message = await recoverPassword(email);
            Alert.alert("Recuperação enviada", message, [
                { text: "OK", onPress: () => router.back() },
            ]);
        } catch (error) {
            Alert.alert("Erro", error instanceof Error ? error.message : "Falha na recuperação.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={styles.content}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backText}>Voltar</Text>
                </TouchableOpacity>

                <Text style={styles.title}>Recuperar senha</Text>
                <Text style={styles.subtitle}>
                    Informe o e-mail cadastrado. Enviaremos instruções para redefinir sua senha.
                </Text>

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
                    <PrimaryButton label="Enviar link" onPress={handleRecover} loading={loading} />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: CopaTheme.background,
    },
    content: {
        flex: 1,
        padding: 24,
    },
    backButton: {
        marginBottom: 20,
    },
    backText: {
        color: CopaTheme.info,
        fontWeight: "600",
        fontSize: 16,
    },
    title: {
        fontSize: 26,
        fontWeight: "800",
        color: CopaTheme.primaryDark,
        marginBottom: 8,
    },
    subtitle: {
        color: CopaTheme.textMuted,
        lineHeight: 21,
        marginBottom: 24,
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
});
