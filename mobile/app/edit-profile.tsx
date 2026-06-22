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
import { useAuth } from "../contexts/AuthContext";
import { PrimaryButton } from "../components/PrimaryButton";
import { CopaTheme } from "../constants/copa-theme";

export default function EditProfileScreen() {
    const { user, updateProfile } = useAuth();
    const [name, setName] = useState(user?.name ?? "");
    const [email, setEmail] = useState(user?.email ?? "");
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!name.trim() || !email.trim()) {
            Alert.alert("Atenção", "Preencha nome e e-mail.");
            return;
        }
        setLoading(true);
        try {
            await updateProfile({ name, email });
            Alert.alert("Sucesso", "Perfil atualizado com sucesso.", [
                { text: "OK", onPress: () => router.back() },
            ]);
        } catch (error) {
            Alert.alert("Erro", error instanceof Error ? error.message : "Falha ao atualizar.");
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

                <Text style={styles.title}>Editar perfil</Text>
                <Text style={styles.subtitle}>Atualize seus dados pessoais.</Text>

                <View style={styles.form}>
                    <Text style={styles.label}>Nome completo</Text>
                    <TextInput value={name} onChangeText={setName} style={styles.input} />

                    <Text style={styles.label}>E-mail</Text>
                    <TextInput
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={styles.input}
                    />

                    <PrimaryButton label="Salvar alterações" onPress={handleSave} loading={loading} />
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
        padding: 20,
    },
    backButton: {
        marginBottom: 16,
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
        marginBottom: 20,
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
