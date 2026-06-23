import { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { alterarSenha, atualizarPerfil, buscarPerfil } from "../api";
import { useAuth } from "../auth";
import { CopaTheme } from "../constants/copa-theme";
import { showAppAlert } from "../utils/app-alert";
import { isValidEmail } from "../utils/validators";

export default function EditProfileScreen() {
    const { user, updateUser } = useAuth();
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
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
                setAvatarUrl(profile.avatarUrl ?? "");
            })
            .catch((error) => showAppAlert("Erro", error instanceof Error ? error.message : "Não foi possível carregar o perfil."))
            .finally(() => setLoading(false));
    }, [user]);

    async function handleSaveProfile() {
        if (!user) {
            return;
        }

        const nomeValue = nome.trim();
        const emailValue = email.trim();
        if (!nomeValue || !emailValue) {
            showAppAlert("Atenção", "Preencha nome e e-mail.");
            return;
        }

        if (!isValidEmail(emailValue)) {
            showAppAlert("Atenção", "Informe um e-mail válido.");
            return;
        }

        try {
            setSaving(true);
            const profile = await atualizarPerfil(user.token, nomeValue, emailValue, avatarUrl.trim() || null);
            updateUser(profile);
            showAppAlert("Perfil atualizado", "Seus dados foram salvos.", [
                { text: "OK", onPress: () => router.back() },
            ]);
        } catch (error) {
            showAppAlert("Erro", error instanceof Error ? error.message : "Não foi possível atualizar o perfil.");
        } finally {
            setSaving(false);
        }
    }

    async function handleChangePassword() {
        if (!user) {
            return;
        }

        if (!senhaAtual || !novaSenha) {
            showAppAlert("Atenção", "Informe a senha atual e a nova senha.");
            return;
        }

        try {
            setSaving(true);
            await alterarSenha(user.token, senhaAtual, novaSenha);
            setSenhaAtual("");
            setNovaSenha("");
            showAppAlert("Senha alterada", "Sua senha foi atualizada.");
        } catch (error) {
            showAppAlert("Erro", error instanceof Error ? error.message : "Não foi possível alterar a senha.");
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

                <View style={styles.avatarWrapper}>
                    {avatarUrl.trim() ? (
                        <Image source={{ uri: avatarUrl.trim() }} style={styles.avatar} />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <Text style={styles.avatarInitial}>{(nome.trim()[0] ?? "U").toUpperCase()}</Text>
                        </View>
                    )}
                </View>

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
                    autoCapitalize="none"
                    keyboardType="url"
                    placeholder="URL da foto de perfil"
                    value={avatarUrl}
                    onChangeText={setAvatarUrl}
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
        backgroundColor: CopaTheme.background,
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
        borderRadius: 24,
        backgroundColor: CopaTheme.surface,
        borderWidth: 1,
        borderColor: CopaTheme.border,
        ...CopaTheme.shadow,
    },
    title: {
        color: CopaTheme.primaryDark,
        fontSize: 24,
        fontWeight: "900",
    },
    sectionTitle: {
        color: CopaTheme.primaryDark,
        fontSize: 18,
        fontWeight: "900",
    },
    avatarWrapper: {
        alignItems: "center",
    },
    avatar: {
        width: 92,
        height: 92,
        borderRadius: 46,
        backgroundColor: "#e5e7eb",
    },
    avatarPlaceholder: {
        alignItems: "center",
        justifyContent: "center",
        width: 92,
        height: 92,
        borderRadius: 46,
        backgroundColor: "#dcfce7",
    },
    avatarInitial: {
        color: "#166534",
        fontSize: 34,
        fontWeight: "800",
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
        justifyContent: "center",
        minHeight: 50,
        borderRadius: 14,
        backgroundColor: CopaTheme.primary,
        padding: 15,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "700",
    },
    secondaryButton: {
        alignItems: "center",
        justifyContent: "center",
        minHeight: 48,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#2563eb",
        backgroundColor: "#eff6ff",
        padding: 15,
    },
    secondaryButtonText: {
        color: "#2563eb",
        fontWeight: "700",
    },
});
