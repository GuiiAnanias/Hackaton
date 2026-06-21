import { View, Text, StyleSheet, type ViewStyle } from "react-native";
import { CopaTheme } from "../constants/copa-theme";

interface ScreenHeaderProps {
    title: string;
    subtitle?: string;
    style?: ViewStyle;
}

export function ScreenHeader({ title, subtitle, style }: ScreenHeaderProps) {
    return (
        <View style={[styles.container, style]}>
            <Text style={styles.title}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: "800",
        color: CopaTheme.primaryDark,
    },
    subtitle: {
        marginTop: 6,
        fontSize: 14,
        color: CopaTheme.textMuted,
        lineHeight: 20,
    },
});
