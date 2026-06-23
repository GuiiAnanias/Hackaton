import { useEffect, useMemo, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CopaTheme } from "../constants/copa-theme";
import { AppAlertButton, AppAlertPayload, subscribeAppAlert } from "../utils/app-alert";

export function AppAlertHost() {
    const [payload, setPayload] = useState<AppAlertPayload | null>(null);

    useEffect(() => subscribeAppAlert(setPayload), []);

    const buttons = useMemo<AppAlertButton[]>(
        () => payload?.buttons?.length ? payload.buttons : [{ text: "OK" }],
        [payload],
    );
    const stacked = buttons.length > 2;

    function handlePress(button: AppAlertButton) {
        setPayload(null);
        setTimeout(() => {
            void button.onPress?.();
        }, 0);
    }

    return (
        <Modal
            transparent
            animationType="fade"
            visible={payload !== null}
            onRequestClose={() => setPayload(null)}>
            <View style={styles.overlay}>
                <View style={styles.card}>
                    <View style={styles.iconWrap}>
                        <Text style={styles.iconText}>!</Text>
                    </View>

                    <Text style={styles.title}>{payload?.title}</Text>
                    {payload?.message ? <Text style={styles.message}>{payload.message}</Text> : null}

                    <View style={[styles.actions, stacked && styles.actionsStacked]}>
                        {buttons.map((button, index) => {
                            const isCancel = button.style === "cancel";
                            const isDestructive = button.style === "destructive";

                            return (
                                <TouchableOpacity
                                    key={`${button.text}-${index}`}
                                    activeOpacity={0.85}
                                    onPress={() => handlePress(button)}
                                    style={[
                                        styles.actionButton,
                                        stacked && styles.actionButtonStacked,
                                        isCancel && styles.cancelButton,
                                        isDestructive && styles.destructiveButton,
                                    ]}>
                                    <Text
                                        style={[
                                            styles.actionText,
                                            isCancel && styles.cancelText,
                                            isDestructive && styles.destructiveText,
                                        ]}>
                                        {button.text}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(15, 23, 42, 0.52)",
        padding: 22,
    },
    card: {
        width: "100%",
        maxWidth: 360,
        alignItems: "center",
        borderWidth: 1,
        borderColor: CopaTheme.border,
        borderRadius: 26,
        backgroundColor: CopaTheme.surface,
        padding: 22,
        ...CopaTheme.shadow,
    },
    iconWrap: {
        width: 48,
        height: 48,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 24,
        backgroundColor: CopaTheme.primaryLight,
        marginBottom: 12,
    },
    iconText: {
        color: CopaTheme.primaryDark,
        fontSize: 22,
        fontWeight: "900",
    },
    title: {
        color: CopaTheme.primaryDark,
        fontSize: 20,
        fontWeight: "900",
        textAlign: "center",
    },
    message: {
        color: CopaTheme.textMuted,
        fontSize: 14,
        lineHeight: 20,
        marginTop: 8,
        textAlign: "center",
    },
    actions: {
        flexDirection: "row",
        gap: 10,
        marginTop: 20,
        width: "100%",
    },
    actionsStacked: {
        flexDirection: "column",
    },
    actionButton: {
        flex: 1,
        minHeight: 48,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 15,
        backgroundColor: CopaTheme.primary,
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    actionButtonStacked: {
        width: "100%",
    },
    cancelButton: {
        borderWidth: 1,
        borderColor: CopaTheme.border,
        backgroundColor: CopaTheme.surfaceAlt,
    },
    destructiveButton: {
        backgroundColor: CopaTheme.danger,
    },
    actionText: {
        color: CopaTheme.textLight,
        fontSize: 15,
        fontWeight: "900",
        textAlign: "center",
    },
    cancelText: {
        color: CopaTheme.primaryDark,
    },
    destructiveText: {
        color: CopaTheme.textLight,
    },
});
