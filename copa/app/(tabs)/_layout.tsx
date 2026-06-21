import { Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function TabLayout() {
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
            <Tabs.Screen name="guesses"options={{
                    title: "Palpites", tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="trophy" size={size} color={color}/>),
                }}/>
            <Tabs.Screen name="profile" options={{
                    title: "Perfil", tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="user" size={size} color={color}/>),
                }}/>
        </Tabs>
    );
}