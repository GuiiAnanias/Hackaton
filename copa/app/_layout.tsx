import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="guess/[id]" />
            <Stack.Screen name="edit-guess/[id]" />
        </Stack>
    );
}