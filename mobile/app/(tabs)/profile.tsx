import { View, Text, StyleSheet, Alert, ScrollView } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useAuth } from "../../contexts/AuthContext";
import { useGuesses } from "../../contexts/GuessesContext";
import { ScreenHeader } from "../../components/ScreenHeader";
import { PrimaryButton } from "../../components/PrimaryButton";
import { CopaTheme } from "../../constants/copa-theme";

export default function ProfileScreen() {
    const { user, logout, deleteAccount } = useAuth();
    const { guesses } = useGuesses();

    const totalPoints = guesses.reduce((sum, guess) => sum + guess.points, 0);

    const handleLogout = async () => {
        await logout();
        router.replace("/(auth)/login");
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            "Excluir conta",
            "Esta ação é permanente. Deseja realmente excluir sua conta?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: async () => {
                        await deleteAccount();
                        router.replace("/(auth)/login");
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <ScreenHeader
                    title="Meu Perfil"
                    subtitle="Gerencie seus dados e acompanhe seu desempenho no bolão."
                />

                <View style={styles.profileCard}>
                    <View style={styles.avatar}>
                        <FontAwesome name="user" size={32} color={CopaTheme.textLight} />
                    </View>
                    <Text style={styles.name}>{user?.name}</Text>
                    <Text style={styles.email}>{user?.email}</Text>
                </View>

                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>{guesses.length}</Text>
                        <Text style={styles.statLabel}>Palpites</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>{totalPoints}</Text>
                        <Text style={styles.statLabel}>Pontos</Text>
                    </View>
                </View>

                <View style={styles.actions}>
                    <PrimaryButton
                        label="Editar perfil"
                        variant="outline"
                        onPress={() => router.push("/edit-profile")}
                    />
                    <PrimaryButton label="Sair da conta" onPress={handleLogout} />
                    <PrimaryButton
                        label="Excluir conta"
                        variant="danger"
                        onPress={handleDeleteAccount}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: CopaTheme.background,
    },
    content: {
        padding: 20,
        paddingBottom: 32,
    },
    profileCard: {
        backgroundColor: CopaTheme.surface,
        borderRadius: 20,
        padding: 24,
        alignItems: "center",
        borderWidth: 1,
        borderColor: CopaTheme.border,
        marginBottom: 16,
    },
    avatar: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: CopaTheme.primary,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
    },
    name: {
        fontSize: 22,
        fontWeight: "800",
        color: CopaTheme.primaryDark,
    },
    email: {
        marginTop: 4,
        color: CopaTheme.textMuted,
    },
    statsRow: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 20,
    },
    statCard: {
        flex: 1,
        backgroundColor: CopaTheme.surface,
        borderRadius: 16,
        padding: 16,
        alignItems: "center",
        borderWidth: 1,
        borderColor: CopaTheme.border,
    },
    statValue: {
        fontSize: 24,
        fontWeight: "800",
        color: CopaTheme.primary,
    },
    statLabel: {
        marginTop: 4,
        color: CopaTheme.textMuted,
        fontWeight: "600",
    },
    actions: {
        gap: 12,
    },
});
