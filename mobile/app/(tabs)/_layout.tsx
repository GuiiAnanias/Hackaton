import { Redirect, Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../../auth";
import { CopaTheme } from "../../constants/copa-theme";

export default function TabLayout() {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: CopaTheme.background }}>
                <ActivityIndicator color={CopaTheme.primary} />
            </View>
        );
    }

    if (!isAuthenticated) {
        return <Redirect href="/login" />;
    }

    return (
        <Tabs screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: CopaTheme.primary,
                tabBarInactiveTintColor: CopaTheme.textSoft,
                tabBarLabelStyle: { fontSize: 11, fontWeight: "800" },
                tabBarItemStyle: {
                    borderRadius: 16,
                    marginHorizontal: 3,
                },
                tabBarStyle: {
                    height: 70,
                    paddingTop: 8,
                    paddingBottom: 12,
                    backgroundColor: CopaTheme.surface,
                    borderTopWidth: 1,
                    borderTopColor: CopaTheme.border,
                    borderTopLeftRadius: 24,
                    borderTopRightRadius: 24,
                    shadowColor: "#0f172a",
                    shadowOffset: { width: 0, height: -8 },
                    shadowOpacity: 0.08,
                    shadowRadius: 18,
                    elevation: 12,
                },
            }}>
            <Tabs.Screen name="home" options={{
                title: "Home", tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="home" size={size} color={color}/>),
                }}/>
            <Tabs.Screen name="matches" options={{
                title: "Partidas", tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="soccer-ball-o" size={size} color={color}/>),
                }}/>
            <Tabs.Screen name="guesses" options={{
                    title: "Palpites", tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="trophy" size={size} color={color}/>),
                }}/>
            <Tabs.Screen name="ranking" options={{
                    title: "Ranking", tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="list-ol" size={size} color={color}/>),
                }}/>
            <Tabs.Screen name="profile" options={{
                    title: "Perfil", tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="user" size={size} color={color}/>),
                }}/>
        </Tabs>
    );
}
