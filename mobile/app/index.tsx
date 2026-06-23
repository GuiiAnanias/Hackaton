import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../auth";
import { CopaTheme } from "../constants/copa-theme";

export default function Index() {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: CopaTheme.background }}>
                <ActivityIndicator color={CopaTheme.primary} />
            </View>
        );
    }

    return <Redirect href={isAuthenticated ? "/(tabs)/home" : "/public"} />;
}
