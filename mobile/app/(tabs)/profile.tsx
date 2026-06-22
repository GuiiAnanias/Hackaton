import { useCallback, useState } from "react";
import { ActivityIndicator, Alert, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { buscarPerfil, excluirConta, UserProfile } from "../../api";
import { useAuth } from "../../auth";

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
            .catch((error) => Alert.alert("Erro", error instanceof Error ? error.message : "Não foi possível carregar o perfil."))
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

        Alert.alert("Excluir conta", "Sua conta será desativada e você sairá do app. Deseja continuar?", [
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
                        Alert.alert("Erro", error instanceof Error ? error.message : "Não foi possível excluir a conta.");
                    }
                },
            },
        ]);
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Perfil</Text>
                {loading ? (
                    <ActivityIndicator color="#16a34a" />
                ) : (
                    <>
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

                <TouchableOpacity onPress={handleDeleteAccount}>
                    <Text style={styles.deleteText}>Excluir conta</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ecfdf5",
        padding: 20,
    },
    card: {
        gap: 12,
        padding: 20,
        borderRadius: 16,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 24,
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
        borderRadius: 8,
        backgroundColor: "#16a34a",
        padding: 14,
    },
    editButtonText: {
        color: "#fff",
        fontWeight: "700",
    },
    button: {
        alignItems: "center",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#dc2626",
        padding: 14,
    },
    buttonText: {
        color: "#dc2626",
        fontWeight: "700",
    },
    deleteText: {
        color: "#991b1b",
        fontWeight: "700",
        textAlign: "center",
    },
});
