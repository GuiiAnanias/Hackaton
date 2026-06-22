import { Stack } from "expo-router";
import { AuthProvider } from "../auth";

export default function RootLayout() {
    return (
        <AuthProvider>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="login" />
                <Stack.Screen name="register" />
                <Stack.Screen name="forgot-password" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="match/[id]" />
                <Stack.Screen name="guess/[id]" />
                <Stack.Screen name="edit-guess/[id]" />
                <Stack.Screen name="edit-profile" />
            </Stack>
        </AuthProvider>
    );
}