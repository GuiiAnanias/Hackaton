import { Image, StyleSheet, Text, View } from "react-native";
import { API_BASE_URL } from "../api";
import { CopaTheme } from "../constants/copa-theme";

type TeamFlagProps = {
    flag?: string | null;
    code?: string | null;
    name?: string | null;
    size?: "sm" | "md" | "lg";
};

const FLAG_BY_CODE: Record<string, string> = {
    ARG: "🇦🇷",
    ALG: "🇩🇿",
    AUT: "🇦🇹",
    AUS: "🇦🇺",
    BEL: "🇧🇪",
    BIH: "🇧🇦",
    BRA: "🇧🇷",
    CAN: "🇨🇦",
    CIV: "🇨🇮",
    CHI: "🇨🇱",
    COL: "🇨🇴",
    COD: "🇨🇩",
    CPV: "🇨🇻",
    CRC: "🇨🇷",
    CRO: "🇭🇷",
    CUW: "🇨🇼",
    CZE: "🇨🇿",
    DEN: "🇩🇰",
    ECU: "🇪🇨",
    EGY: "🇪🇬",
    ENG: "🏴",
    ESP: "🇪🇸",
    EUA: "🇺🇸",
    FRA: "🇫🇷",
    GER: "🇩🇪",
    ALE: "🇩🇪",
    GHA: "🇬🇭",
    HAI: "🇭🇹",
    IRN: "🇮🇷",
    IRQ: "🇮🇶",
    ITA: "🇮🇹",
    JOR: "🇯🇴",
    JAP: "🇯🇵",
    JPN: "🇯🇵",
    KOR: "🇰🇷",
    KSA: "🇸🇦",
    MAR: "🇲🇦",
    MEX: "🇲🇽",
    NED: "🇳🇱",
    NOR: "🇳🇴",
    NZL: "🇳🇿",
    HOL: "🇳🇱",
    PAN: "🇵🇦",
    PAR: "🇵🇾",
    POR: "🇵🇹",
    QAT: "🇶🇦",
    RSA: "🇿🇦",
    SCO: "🏴",
    SEN: "🇸🇳",
    SUI: "🇨🇭",
    SWE: "🇸🇪",
    TUN: "🇹🇳",
    TUR: "🇹🇷",
    URU: "🇺🇾",
    USA: "🇺🇸",
    UZB: "🇺🇿",
};

const FLAG_BY_NAME: Record<string, string> = {
    "AFRICA DO SUL": "🇿🇦",
    "ÁFRICA DO SUL": "🇿🇦",
    ALEMANHA: "🇩🇪",
    ARGENTINA: "🇦🇷",
    ARGELIA: "🇩🇿",
    ARGÉLIA: "🇩🇿",
    AUSTRALIA: "🇦🇺",
    AUSTRÁLIA: "🇦🇺",
    AUSTRIA: "🇦🇹",
    ÁUSTRIA: "🇦🇹",
    BELGICA: "🇧🇪",
    BÉLGICA: "🇧🇪",
    "BOSNIA E HERZEGOVINA": "🇧🇦",
    "BÓSNIA E HERZEGOVINA": "🇧🇦",
    BRASIL: "🇧🇷",
    "CABO VERDE": "🇨🇻",
    CANADA: "🇨🇦",
    CANADÁ: "🇨🇦",
    CATAR: "🇶🇦",
    COLOMBIA: "🇨🇴",
    COLÔMBIA: "🇨🇴",
    "COREIA DO SUL": "🇰🇷",
    "COSTA DO MARFIM": "🇨🇮",
    CROACIA: "🇭🇷",
    CROÁCIA: "🇭🇷",
    CURACAO: "🇨🇼",
    CURAÇAO: "🇨🇼",
    EGITO: "🇪🇬",
    EQUADOR: "🇪🇨",
    ESCOCIA: "🏴",
    ESCÓCIA: "🏴",
    ESPANHA: "🇪🇸",
    FRANCA: "🇫🇷",
    FRANÇA: "🇫🇷",
    GANA: "🇬🇭",
    HAITI: "🇭🇹",
    INGLATERRA: "🏴",
    IRA: "🇮🇷",
    IRÃ: "🇮🇷",
    IRAQUE: "🇮🇶",
    JAPAO: "🇯🇵",
    JAPÃO: "🇯🇵",
    JORDANIA: "🇯🇴",
    JORDÂNIA: "🇯🇴",
    MARROCOS: "🇲🇦",
    PORTUGAL: "🇵🇹",
    MEXICO: "🇲🇽",
    MÉXICO: "🇲🇽",
    NORUEGA: "🇳🇴",
    "NOVA ZELANDIA": "🇳🇿",
    "NOVA ZELÂNDIA": "🇳🇿",
    PANAMA: "🇵🇦",
    PANAMÁ: "🇵🇦",
    PARAGUAI: "🇵🇾",
    "PAISES BAIXOS": "🇳🇱",
    "PAÍSES BAIXOS": "🇳🇱",
    "RD CONGO": "🇨🇩",
    SENEGAL: "🇸🇳",
    SUECIA: "🇸🇪",
    SUÉCIA: "🇸🇪",
    SUICA: "🇨🇭",
    SUÍÇA: "🇨🇭",
    TCHEQUIA: "🇨🇿",
    TCHÉQUIA: "🇨🇿",
    TUNISIA: "🇹🇳",
    TUNÍSIA: "🇹🇳",
    TURQUIA: "🇹🇷",
    URUGUAI: "🇺🇾",
    UZBEQUISTAO: "🇺🇿",
    UZBEQUISTÃO: "🇺🇿",
    "ESTADOS UNIDOS": "🇺🇸",
};

export function TeamFlag({ flag, code, name, size = "md" }: TeamFlagProps) {
    const imageUri = resolveImageUri(flag);
    const label = resolveFlagLabel(flag, code, name);

    return (
        <View style={[styles.flag, styles[size]]}>
            {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
            ) : (
                <Text style={[styles.text, size === "lg" && styles.textLarge]}>{label}</Text>
            )}
        </View>
    );
}

function resolveImageUri(flag?: string | null) {
    const value = flag?.trim();
    if (!value) {
        return null;
    }

    if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("data:image")) {
        return value;
    }

    if (value.startsWith("/")) {
        return `${API_BASE_URL}${value}`;
    }

    return null;
}

function resolveFlagLabel(flag?: string | null, code?: string | null, name?: string | null) {
    const value = flag?.trim();
    const normalizedCode = normalizeKey(code);
    const normalizedName = normalizeKey(name);

    if (normalizedCode && FLAG_BY_CODE[normalizedCode]) {
        return FLAG_BY_CODE[normalizedCode];
    }

    if (normalizedName && FLAG_BY_NAME[normalizedName]) {
        return FLAG_BY_NAME[normalizedName];
    }

    if (value && !/[./\\]/.test(value) && value.length <= 6) {
        return value;
    }

    return normalizedCode?.slice(0, 3) || normalizedName?.slice(0, 2) || "?";
}

function normalizeKey(value?: string | null) {
    return value?.trim().toUpperCase() || "";
}

const styles = StyleSheet.create({
    flag: {
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        borderWidth: 1,
        borderColor: CopaTheme.border,
        backgroundColor: CopaTheme.surface,
    },
    sm: {
        width: 34,
        height: 34,
        borderRadius: 12,
    },
    md: {
        width: 42,
        height: 42,
        borderRadius: 14,
    },
    lg: {
        width: 58,
        height: 58,
        borderRadius: 18,
    },
    image: {
        width: "100%",
        height: "100%",
    },
    text: {
        color: CopaTheme.primaryDark,
        fontSize: 20,
        fontWeight: "900",
    },
    textLarge: {
        fontSize: 28,
    },
});
