import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { alterarSenha, atualizarPerfil, buscarPerfil } from "../api";
import { useAuth } from "../auth";

export default function EditProfileScreen() {
    const { user, updateUser } = useAuth();
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senhaAtual, setSenhaAtual] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!user) {
            router.replace("/login");
            return;
        }

        buscarPerfil(user.token)
            .then((profile) => {
                setNome(profile.nome);
                setEmail(profile.email);
            })
            .catch((error) => Alert.alert("Erro", error instanceof Error ? error.message : "Não foi possível carregar o perfil."))
            .finally(() => setLoading(false));
    }, [user]);

    async function handleSaveProfile() {
        if (!user) {
            return;
        }

        try {
            setSaving(true);
            const profile = await atualizarPerfil(user.token, nome, email);
            updateUser(profile);
            Alert.alert("Perfil atualizado", "Seus dados foram salvos.");
            router.back();
        } catch (error) {
            Alert.alert("Erro", error instanceof Error ? error.message : "Não foi possível atualizar o perfil.");
        } finally {
            setSaving(false);
        }
    }

    async function handleChangePassword() {
        if (!user) {
            return;
        }

        if (!senhaAtual || !novaSenha) {
            Alert.alert("Atenção", "Informe a senha atual e a nova senha.");
            return;
        }

        try {
            setSaving(true);
            await alterarSenha(user.token, senhaAtual, novaSenha);
            setSenhaAtual("");
            setNovaSenha("");
            Alert.alert("Senha alterada", "Sua senha foi atualizada.");
        } catch (error) {
            Alert.alert("Erro", error instanceof Error ? error.message : "Não foi possível alterar a senha.");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <SafeAreaView style={styles.center}>
                <ActivityIndicator color="#16a34a" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Editar Perfil</Text>

                <TextInput placeholder="Nome" value={nome} onChangeText={setNome} style={styles.input} />
                <TextInput
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholder="E-mail"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                />

                <TouchableOpacity disabled={saving} onPress={handleSaveProfile} style={styles.button}>
                    <Text style={styles.buttonText}>{saving ? "Salvando..." : "Salvar Perfil"}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Alterar Senha</Text>
                <TextInput
                    placeholder="Senha atual"
                    secureTextEntry
                    value={senhaAtual}
                    onChangeText={setSenhaAtual}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Nova senha"
                    secureTextEntry
                    value={novaSenha}
                    onChangeText={setNovaSenha}
                    style={styles.input}
                />
                <TouchableOpacity disabled={saving} onPress={handleChangePassword} style={styles.secondaryButton}>
                    <Text style={styles.secondaryButtonText}>Alterar Senha</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 16,
        backgroundColor: "#f0f0f0",
        padding: 20,
    },
    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    card: {
        gap: 12,
        padding: 18,
        borderRadius: 16,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 24,
        fontWeight: "800",
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
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
    secondaryButton: {
        alignItems: "center",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#2563eb",
        padding: 14,
    },
    secondaryButtonText: {
        color: "#2563eb",
        fontWeight: "700",
    },
});
