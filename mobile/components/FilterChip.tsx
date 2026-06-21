import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { CopaTheme } from "../constants/copa-theme";

interface FilterChipProps {
    label: string;
    selected: boolean;
    onPress: () => void;
}

export function FilterChip({ label, selected, onPress }: FilterChipProps) {
    return (
        <TouchableOpacity
            activeOpacity={0.75}
            onPress={onPress}
            style={[styles.chip, selected ? styles.chipSelected : styles.chipDefault]}>
            <Text
                numberOfLines={1}
                style={[styles.label, selected ? styles.labelSelected : styles.labelDefault]}>
                {label}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        marginRight: 8,
        marginBottom: 8,
        flexShrink: 0,
        alignSelf: "flex-start",
        minHeight: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    chipDefault: {
        backgroundColor: CopaTheme.primaryLight,
        borderWidth: 1.5,
        borderColor: CopaTheme.primary,
    },
    chipSelected: {
        backgroundColor: CopaTheme.primary,
        borderWidth: 1.5,
        borderColor: CopaTheme.primaryDark,
    },
    label: {
        fontSize: 13,
        fontWeight: "700",
        textAlign: "center",
    },
    labelDefault: {
        color: CopaTheme.primaryDark,
    },
    labelSelected: {
        color: CopaTheme.textLight,
    },
});
