import { ActivityIndicator, View, StyleSheet } from "react-native";
import { Redirect, Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useAuth } from "../../contexts/AuthContext";
import { CopaTheme } from "../../constants/copa-theme";

export default function TabLayout() {
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

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: CopaTheme.primary,
                tabBarInactiveTintColor: CopaTheme.textMuted,
                tabBarStyle: {
                    backgroundColor: CopaTheme.surface,
                    borderTopColor: CopaTheme.border,
                    height: 62,
                    paddingBottom: 8,
                    paddingTop: 6,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: "700",
                },
            }}>
            <Tabs.Screen
                name="home"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="home" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="matches"
                options={{
                    title: "Partidas",
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="soccer-ball-o" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="guesses"
                options={{
                    title: "Palpites",
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="trophy" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Perfil",
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="user" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    loading: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: CopaTheme.background,
    },
});
