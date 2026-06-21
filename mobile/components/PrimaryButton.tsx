import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native";
import { CopaTheme } from "../constants/copa-theme";

interface PrimaryButtonProps {
    label: string;
    onPress: () => void;
    variant?: "primary" | "danger" | "outline";
    loading?: boolean;
    disabled?: boolean;
}

export function PrimaryButton({
    label,
    onPress,
    variant = "primary",
    loading = false,
    disabled = false,
}: PrimaryButtonProps) {
    const isDisabled = disabled || loading;

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={isDisabled}
            style={[
                styles.button,
                variant === "primary" && styles.primary,
                variant === "danger" && styles.danger,
                variant === "outline" && styles.outline,
                isDisabled && styles.disabled,
            ]}>
            {loading ? (
                <ActivityIndicator color={variant === "outline" ? CopaTheme.primary : "#fff"} />
            ) : (
                <Text
                    style={[
                        styles.label,
                        variant === "outline" && styles.outlineLabel,
                    ]}>
                    {label}
                </Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    primary: {
        backgroundColor: CopaTheme.primary,
    },
    danger: {
        backgroundColor: CopaTheme.danger,
    },
    outline: {
        backgroundColor: "transparent",
        borderWidth: 1.5,
        borderColor: CopaTheme.primary,
    },
    disabled: {
        opacity: 0.6,
    },
    label: {
        color: CopaTheme.textLight,
        fontSize: 16,
        fontWeight: "700",
    },
    outlineLabel: {
        color: CopaTheme.primary,
    },
});
