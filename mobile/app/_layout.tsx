import { Stack } from "expo-router";
import { AuthProvider } from "../contexts/AuthContext";
import { GuessesProvider } from "../contexts/GuessesContext";

export default function RootLayout() {
    return (
        <AuthProvider>
            <GuessesProvider>
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="index" />
                    <Stack.Screen name="(auth)" />
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="guess/[id]" />
                    <Stack.Screen name="edit-guess/[id]" />
                    <Stack.Screen name="match/[id]" />
                    <Stack.Screen name="edit-profile" />
                </Stack>
            </GuessesProvider>
        </AuthProvider>
    );
}
