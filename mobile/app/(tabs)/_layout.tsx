import { Redirect, Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../../auth";

export default function TabLayout() {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <ActivityIndicator color="#16a34a" />
            </View>
        );
    }

    if (!isAuthenticated) {
        return <Redirect href="/login" />;
    }

    return (
        <Tabs screenOptions={{
                headerShown: false, tabBarActiveTintColor: "#16a34a", tabBarInactiveTintColor: "#9ca3af",
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