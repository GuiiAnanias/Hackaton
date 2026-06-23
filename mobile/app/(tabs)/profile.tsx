import { useCallback, useState } from "react";
import { ActivityIndicator, Image, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { buscarPerfil, desativarConta, excluirConta, UserProfile } from "../../api";
import { useAuth } from "../../auth";
import { CopaTheme } from "../../constants/copa-theme";
import { showAppAlert } from "../../utils/app-alert";

export default function ProfileScreen() {
    const { user, logout } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useFocusEffect(useCallback(() => {
        if (!user) {
            return;
        }

        setLoading(true);
        buscarPerfil(user.token)
            .then(setProfile)
            .catch((error) => showAppAlert("Erro", error instanceof Error ? error.message : "Não foi possível carregar o perfil."))
            .finally(() => setLoading(false));
    }, [user]));

    function handleLogout() {
        logout();
        router.replace("/login");
    }

    function handleDeleteAccount() {
        if (!user) {
            return;
        }

        showAppAlert("Excluir conta", "Sua conta e todos os seus palpites serão excluídos de forma definitiva. Deseja continuar?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Excluir",
                style: "destructive",
                onPress: async () => {
                    try {
                        await excluirConta(user.token);
                        logout();
                        router.replace("/login");
                    } catch (error) {
                        showAppAlert("Erro", error instanceof Error ? error.message : "Não foi possível excluir a conta.");
                    }
                },
            },
        ]);
    }

    function handleDeactivateAccount() {
        if (!user) {
            return;
        }

        showAppAlert("Desativar conta", "Sua conta será desativada e você sairá do app. Seus dados ficarão guardados.", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Desativar",
                style: "destructive",
                onPress: async () => {
                    try {
                        await desativarConta(user.token);
                        logout();
                        router.replace("/login");
                    } catch (error) {
                        showAppAlert("Erro", error instanceof Error ? error.message : "Não foi possível desativar a conta.");
                    }
                },
            },
        ]);
    }

    const isAdmin = (profile?.perfil ?? user?.perfil) === "ADMIN";

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Perfil</Text>
                {loading ? (
                    <ActivityIndicator color="#16a34a" />
                ) : (
                    <>
                        {profile?.avatarUrl ? (
                            <Image source={{ uri: profile.avatarUrl }} style={styles.avatar} />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <Text style={styles.avatarInitial}>
                                    {((profile?.nome ?? user?.nome ?? "U").trim()[0] ?? "U").toUpperCase()}
                                </Text>
                            </View>
                        )}
                        <Text style={styles.name}>{profile?.nome ?? user?.nome}</Text>
                        <Text style={styles.info}>E-mail: {profile?.email}</Text>
                        <Text style={styles.info}>Perfil: {profile?.perfil ?? user?.perfil}</Text>

                        <View style={styles.stats}>
                            <View style={styles.statBox}>
                                <Text style={styles.statNumber}>{profile?.pontuacaoTotal ?? 0}</Text>
                                <Text style={styles.statLabel}>pontos</Text>
                            </View>
                            <View style={styles.statBox}>
                                <Text style={styles.statNumber}>{profile?.placaresExatos ?? 0}</Text>
                                <Text style={styles.statLabel}>placares exatos</Text>
                            </View>
                        </View>
                    </>
                )}

                <TouchableOpacity onPress={() => router.push("/edit-profile")} style={styles.editButton}>
                    <Text style={styles.editButtonText}>Editar Perfil</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleLogout} style={styles.button}>
                    <Text style={styles.buttonText}>Sair</Text>
                </TouchableOpacity>

                {isAdmin ? (
                    <Text style={styles.protectedText}>Conta ADMIN protegida contra desativação e exclusão.</Text>
                ) : (
                    <View style={styles.accountActions}>
                        <TouchableOpacity onPress={handleDeactivateAccount} style={styles.deactivateButton}>
                            <Text style={styles.deactivateText}>Desativar conta</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleDeleteAccount} style={styles.deleteButton}>
                            <Text style={styles.deleteText}>Excluir conta</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: CopaTheme.background,
        padding: 20,
    },
    card: {
        gap: 12,
        padding: 22,
        borderRadius: 24,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: CopaTheme.border,
        ...CopaTheme.shadow,
    },
    title: {
        color: CopaTheme.primaryDark,
        fontSize: 24,
        fontWeight: "900",
    },
    avatar: {
        alignSelf: "center",
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#dcfce7",
    },
    avatarPlaceholder: {
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#dcfce7",
    },
    avatarInitial: {
        color: "#166534",
        fontSize: 36,
        fontWeight: "800",
    },
    name: {
        fontSize: 18,
        fontWeight: "700",
    },
    info: {
        color: "#4b5563",
    },
    stats: {
        flexDirection: "row",
        gap: 10,
    },
    statBox: {
        flex: 1,
        borderRadius: 12,
        backgroundColor: "#dcfce7",
        padding: 12,
    },
    statNumber: {
        color: "#166534",
        fontSize: 22,
        fontWeight: "800",
    },
    statLabel: {
        color: "#166534",
        fontSize: 12,
    },
    editButton: {
        alignItems: "center",
        justifyContent: "center",
        minHeight: 50,
        borderRadius: 15,
        backgroundColor: CopaTheme.primary,
        padding: 14,
    },
    editButtonText: {
        color: "#fff",
        fontWeight: "700",
    },
    button: {
        alignItems: "center",
        justifyContent: "center",
        minHeight: 48,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: "#dc2626",
        backgroundColor: CopaTheme.dangerLight,
        padding: 14,
    },
    buttonText: {
        color: "#dc2626",
        fontWeight: "700",
    },
    accountActions: {
        gap: 10,
    },
    deactivateButton: {
        alignItems: "center",
        justifyContent: "center",
        minHeight: 48,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: CopaTheme.accentDark,
        backgroundColor: "#fffbeb",
        padding: 14,
    },
    deactivateText: {
        color: CopaTheme.accentDark,
        fontWeight: "700",
        textAlign: "center",
    },
    deleteButton: {
        alignItems: "center",
        justifyContent: "center",
        minHeight: 48,
        borderRadius: 15,
        backgroundColor: CopaTheme.danger,
        padding: 14,
    },
    deleteText: {
        color: "#fff",
        fontWeight: "700",
        textAlign: "center",
    },
    protectedText: {
        borderRadius: 15,
        backgroundColor: "#eff6ff",
        color: "#2563eb",
        fontWeight: "700",
        lineHeight: 20,
        padding: 12,
        textAlign: "center",
    },
});
