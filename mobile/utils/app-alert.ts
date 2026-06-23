export type AppAlertButton = {
    text: string;
    style?: "default" | "cancel" | "destructive";
    onPress?: () => void | Promise<void>;
};

export type AppAlertPayload = {
    title: string;
    message?: string;
    buttons?: AppAlertButton[];
};

type AppAlertListener = (payload: AppAlertPayload) => void;

const listeners = new Set<AppAlertListener>();

export function showAppAlert(title: string, message?: string, buttons?: AppAlertButton[]) {
    listeners.forEach((listener) => listener({ title, message, buttons }));
}

export function subscribeAppAlert(listener: AppAlertListener) {
    listeners.add(listener);

    return () => {
        listeners.delete(listener);
    };
}
