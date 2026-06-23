import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { API_BASE_URL } from "../api";
import { CopaTheme } from "../constants/copa-theme";

type TeamFlagProps = {
    flag?: string | null;
    code?: string | null;
    name?: string | null;
    size?: "sm" | "md" | "lg";
};

const FLAG_CDN_BASE_URL = "https://flagcdn.com/w80";

const FLAG_IMAGE_CODE_BY_CODE: Record<string, string> = {
    ARG: "ar",
    ALG: "dz",
    AUT: "at",
    AUS: "au",
    BEL: "be",
    BIH: "ba",
    BRA: "br",
    CAN: "ca",
    CIV: "ci",
    CHI: "cl",
    COL: "co",
    COD: "cd",
    CPV: "cv",
    CRC: "cr",
    CRO: "hr",
    CUW: "cw",
    CZE: "cz",
    DEN: "dk",
    ECU: "ec",
    EGY: "eg",
    ENG: "gb-eng",
    ING: "gb-eng",
    ESP: "es",
    EUA: "us",
    FRA: "fr",
    GER: "de",
    ALE: "de",
    GHA: "gh",
    HAI: "ht",
    IRN: "ir",
    IRQ: "iq",
    ITA: "it",
    JOR: "jo",
    JAP: "jp",
    JPN: "jp",
    KOR: "kr",
    KSA: "sa",
    MAR: "ma",
    MEX: "mx",
    NED: "nl",
    NOR: "no",
    NZL: "nz",
    HOL: "nl",
    PAN: "pa",
    PAR: "py",
    POR: "pt",
    QAT: "qa",
    RSA: "za",
    SCO: "gb-sct",
    ESC: "gb-sct",
    SEN: "sn",
    SUI: "ch",
    SWE: "se",
    TUN: "tn",
    TUR: "tr",
    URU: "uy",
    USA: "us",
    UZB: "uz",
};

const FLAG_IMAGE_CODE_BY_NAME: Record<string, string> = {
    "AFRICA DO SUL": "za",
    "ÁFRICA DO SUL": "za",
    ALEMANHA: "de",
    ARGENTINA: "ar",
    ARGELIA: "dz",
    ARGÉLIA: "dz",
    AUSTRALIA: "au",
    AUSTRÁLIA: "au",
    AUSTRIA: "at",
    ÁUSTRIA: "at",
    BELGICA: "be",
    BÉLGICA: "be",
    "BOSNIA E HERZEGOVINA": "ba",
    "BÓSNIA E HERZEGOVINA": "ba",
    BRASIL: "br",
    "CABO VERDE": "cv",
    CANADA: "ca",
    CANADÁ: "ca",
    CATAR: "qa",
    COLOMBIA: "co",
    COLÔMBIA: "co",
    "COREIA DO SUL": "kr",
    "COSTA DO MARFIM": "ci",
    CROACIA: "hr",
    CROÁCIA: "hr",
    CURACAO: "cw",
    CURAÇAO: "cw",
    EGITO: "eg",
    EQUADOR: "ec",
    ESCOCIA: "gb-sct",
    ESCÓCIA: "gb-sct",
    ESPANHA: "es",
    FRANCA: "fr",
    FRANÇA: "fr",
    GANA: "gh",
    HAITI: "ht",
    INGLATERRA: "gb-eng",
    IRA: "ir",
    IRÃ: "ir",
    IRAQUE: "iq",
    JAPAO: "jp",
    JAPÃO: "jp",
    JORDANIA: "jo",
    JORDÂNIA: "jo",
    MARROCOS: "ma",
    PORTUGAL: "pt",
    MEXICO: "mx",
    MÉXICO: "mx",
    NORUEGA: "no",
    "NOVA ZELANDIA": "nz",
    "NOVA ZELÂNDIA": "nz",
    PANAMA: "pa",
    PANAMÁ: "pa",
    PARAGUAI: "py",
    "PAISES BAIXOS": "nl",
    "PAÍSES BAIXOS": "nl",
    "RD CONGO": "cd",
    SENEGAL: "sn",
    SUECIA: "se",
    SUÉCIA: "se",
    SUICA: "ch",
    SUÍÇA: "ch",
    TCHEQUIA: "cz",
    TCHÉQUIA: "cz",
    TUNISIA: "tn",
    TUNÍSIA: "tn",
    TURQUIA: "tr",
    URUGUAI: "uy",
    UZBEQUISTAO: "uz",
    UZBEQUISTÃO: "uz",
    "ESTADOS UNIDOS": "us",
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
    ING: "🏴",
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
    ESC: "🏴",
    SEN: "🇸🇳",
    SUI: "🇨🇭",
    SWE: "🇸🇪",
    TUN: "🇹🇳",
    TUR: "🇹🇷",
    URU: "🇺🇾",
    USA: "🇺🇸",
    UZB: "🇺🇿",
};

const DRAWN_FLAG_BY_CODE: Record<string, "england" | "scotland"> = {
    ENG: "england",
    ING: "england",
    SCO: "scotland",
    ESC: "scotland",
};

const DRAWN_FLAG_BY_NAME: Record<string, "england" | "scotland"> = {
    INGLATERRA: "england",
    ESCOCIA: "scotland",
    ESCÓCIA: "scotland",
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
    const imageUri = resolveImageUri(flag, code, name);
    const [imageFailed, setImageFailed] = useState(false);
    const drawnFlag = resolveDrawnFlag(code, name);
    const label = resolveFlagLabel(flag, code, name);

    useEffect(() => {
        setImageFailed(false);
    }, [imageUri]);

    return (
        <View style={[styles.flag, styles[size]]}>
            {imageUri && !imageFailed ? (
                <Image
                    source={{ uri: imageUri }}
                    style={styles.image}
                    resizeMode="cover"
                    onError={() => setImageFailed(true)}
                />
            ) : drawnFlag ? (
                <DrawnFlag type={drawnFlag} />
            ) : (
                <Text style={[styles.text, size === "lg" && styles.textLarge]}>{label}</Text>
            )}
        </View>
    );
}

function DrawnFlag({ type }: { type: "england" | "scotland" }) {
    if (type === "england") {
        return (
            <View style={styles.drawnFlag}>
                <View style={styles.englandBase} />
                <View style={styles.englandHorizontal} />
                <View style={styles.englandVertical} />
            </View>
        );
    }

    return (
        <View style={styles.drawnFlag}>
            <View style={styles.scotlandBase} />
            <View style={[styles.scotlandDiagonal, styles.scotlandDiagonalOne]} />
            <View style={[styles.scotlandDiagonal, styles.scotlandDiagonalTwo]} />
        </View>
    );
}

function resolveImageUri(flag?: string | null, code?: string | null, name?: string | null) {
    const value = flag?.trim();

    if (value && (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("data:image"))) {
        return value;
    }

    if (value && value.startsWith("/")) {
        return `${API_BASE_URL}${value}`;
    }

    const flagImageCode = resolveFlagImageCode(code, name);
    if (flagImageCode) {
        return `${FLAG_CDN_BASE_URL}/${flagImageCode}.png`;
    }

    return null;
}

function resolveFlagImageCode(code?: string | null, name?: string | null) {
    const normalizedCode = normalizeKey(code);
    const normalizedName = normalizeKey(name);

    return FLAG_IMAGE_CODE_BY_CODE[normalizedCode] ?? FLAG_IMAGE_CODE_BY_NAME[normalizedName] ?? null;
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

function resolveDrawnFlag(code?: string | null, name?: string | null) {
    const normalizedCode = normalizeKey(code);
    const normalizedName = normalizeKey(name);

    return DRAWN_FLAG_BY_CODE[normalizedCode] ?? DRAWN_FLAG_BY_NAME[normalizedName] ?? null;
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
    drawnFlag: {
        width: "100%",
        height: "100%",
        overflow: "hidden",
    },
    englandBase: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "#ffffff",
    },
    englandHorizontal: {
        position: "absolute",
        top: "42%",
        width: "100%",
        height: "16%",
        backgroundColor: "#cf142b",
    },
    englandVertical: {
        position: "absolute",
        left: "42%",
        width: "16%",
        height: "100%",
        backgroundColor: "#cf142b",
    },
    scotlandBase: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "#005eb8",
    },
    scotlandDiagonal: {
        position: "absolute",
        left: "-20%",
        top: "42%",
        width: "140%",
        height: "16%",
        backgroundColor: "#ffffff",
    },
    scotlandDiagonalOne: {
        transform: [{ rotate: "35deg" }],
    },
    scotlandDiagonalTwo: {
        transform: [{ rotate: "-35deg" }],
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
