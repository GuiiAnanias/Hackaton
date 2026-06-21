import { ActivityIndicator, View, StyleSheet } from "react-native";
import { Redirect } from "expo-router";
import { useAuth } from "../contexts/AuthContext";
import { CopaTheme } from "../constants/copa-theme";

export default function Index() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color={CopaTheme.primary} />
            </View>
        );
    }

    if (!user) {
        return <Redirect href="/(auth)/login" />;
    }

    return <Redirect href="/(tabs)/home" />;
}

const styles = StyleSheet.create({
    loading: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: CopaTheme.background,
    },
});
