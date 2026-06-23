import { useEffect, useState } from "react";
import { ActivityIndicator, View, Text, SectionList, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { listarPartidas, Partida } from "../../api";
import { TeamFlag } from "../../components/TeamFlag";
import { CopaTheme, STATUS_LABELS } from "../../constants/copa-theme";

export default function MatchesScreen() {
    const [matches, setMatches] = useState<Partida[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState("TODAS");
    const [phaseFilter, setPhaseFilter] = useState("TODAS");
    const [dateFilter, setDateFilter] = useState("");
    const [calendarVisible, setCalendarVisible] = useState(false);
    const [calendarMonth, setCalendarMonth] = useState(() => startOfMonth(new Date()));

    useEffect(() => {
        listarPartidas()
            .then(setMatches)
            .catch((err) => setError(err instanceof Error ? err.message : "Erro ao carregar partidas"))
            .finally(() => setLoading(false));
    }, []);

    const phases = Array.from(new Set(matches.map((match) => match.fase))).filter(Boolean);
    const filteredMatches = matches.filter((match) => {
        const matchDate = toDateKey(new Date(match.dataHora));
        const statusOk = statusFilter === "TODAS" || match.status === statusFilter;
        const phaseOk = phaseFilter === "TODAS" || match.fase === phaseFilter;
        const dateOk = !dateFilter || matchDate === dateFilter;

        return statusOk && phaseOk && dateOk;
    });
    const matchSections = groupMatchesByPhaseAndDate(filteredMatches);

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flex: 1, padding: 20 }}>
                <View style={styles.headerCard}>
                    <Text style={styles.title}>Partidas</Text>
                    <Text style={styles.subtitle}>Filtre os jogos por data, status e fase.</Text>
                </View>
                {loading && <ActivityIndicator color="green" />}
                {error && <Text style={styles.error}>{error}</Text>}

                <TouchableOpacity onPress={() => setCalendarVisible(true)} style={styles.input}>
                    <Text style={dateFilter ? styles.dateValue : styles.datePlaceholder}>
                        {dateFilter ? formatDateLabel(dateFilter) : "Selecionar data"}
                    </Text>
                </TouchableOpacity>

                {dateFilter ? (
                    <TouchableOpacity onPress={() => setDateFilter("")} style={styles.clearDateButton}>
                        <Text style={styles.clearDateText}>Limpar data</Text>
                    </TouchableOpacity>
                ) : null}

                <View style={styles.filterRow}>
                    {["TODAS", "AGENDADA", "ENCERRADA"].map((status) => (
                        <TouchableOpacity
                            key={status}
                            onPress={() => setStatusFilter(status)}
                            style={[styles.filterChip, statusFilter === status && styles.filterChipActive]}
                        >
                            <Text style={[styles.filterText, statusFilter === status && styles.filterTextActive]}>{status}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.filterRow}>
                    {["TODAS", ...phases].map((phase) => (
                        <TouchableOpacity
                            key={phase}
                            onPress={() => setPhaseFilter(phase)}
                            style={[styles.filterChip, phaseFilter === phase && styles.filterChipActive]}
                        >
                            <Text style={[styles.filterText, phaseFilter === phase && styles.filterTextActive]}>{phase}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <SectionList
                    sections={matchSections}
                    keyExtractor={(item) => item.id.toString()}
                    ListEmptyComponent={!loading ? <Text style={styles.empty}>Nenhuma partida cadastrada.</Text> : null}
                    renderSectionHeader={({ section }) => (
                        <Text style={styles.sectionHeaderText}>{section.title}</Text>
                    )}
                    renderItem={({ item }) => {
                        const statusColor = CopaTheme.status[item.status as keyof typeof CopaTheme.status] ?? CopaTheme.textMuted;

                        return (
                            <TouchableOpacity
                                activeOpacity={0.88}
                                onPress={() => router.push({ pathname: "/match/[id]", params: { id: String(item.id) } })}
                                style={styles.card}
                            >
                                <View style={styles.cardHeader}>
                                    <View style={styles.teamsRow}>
                                        <TeamFlag flag={item.bandeiraMandante} code={item.codigoFifaMandante} name={item.mandante} size="sm" />
                                        <Text style={styles.matchTitle}>{item.mandante} x {item.visitante}</Text>
                                        <TeamFlag flag={item.bandeiraVisitante} code={item.codigoFifaVisitante} name={item.visitante} size="sm" />
                                    </View>
                                    <View style={[styles.statusBadge, { backgroundColor: `${statusColor}18` }]}>
                                        <Text style={[styles.statusText, { color: statusColor }]}>
                                            {STATUS_LABELS[item.status] ?? item.status}
                                        </Text>
                                    </View>
                                </View>

                                <Text style={styles.meta}>
                                    {item.dataHoraFormatada ?? new Date(item.dataHora).toLocaleString("pt-BR")}
                                </Text>
                                <Text style={styles.meta}>Fase: {item.fase}</Text>
                                <Text style={styles.meta}>Estádio: {item.estadio}</Text>

                                <View style={styles.detailButton}>
                                    <Text style={styles.detailButtonText}>Ver detalhes</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                />
            </View>

            <CalendarModal
                visible={calendarVisible}
                month={calendarMonth}
                selectedDate={dateFilter}
                onClose={() => setCalendarVisible(false)}
                onChangeMonth={setCalendarMonth}
                onSelectDate={(date) => {
                    setDateFilter(date);
                    setCalendarVisible(false);
                }}
            />
        </SafeAreaView>
    );
}

function CalendarModal({
    visible,
    month,
    selectedDate,
    onClose,
    onChangeMonth,
    onSelectDate,
}: {
    visible: boolean;
    month: Date;
    selectedDate: string;
    onClose: () => void;
    onChangeMonth: (date: Date) => void;
    onSelectDate: (date: string) => void;
}) {
    const days = getCalendarDays(month);

    return (
        <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <View style={styles.calendarCard}>
                    <View style={styles.calendarHeader}>
                        <TouchableOpacity onPress={() => onChangeMonth(addMonths(month, -1))} style={styles.monthButton}>
                            <Text style={styles.monthButtonText}>‹</Text>
                        </TouchableOpacity>
                        <Text style={styles.calendarTitle}>
                            {month.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
                        </Text>
                        <TouchableOpacity onPress={() => onChangeMonth(addMonths(month, 1))} style={styles.monthButton}>
                            <Text style={styles.monthButtonText}>›</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.weekRow}>
                        {["D", "S", "T", "Q", "Q", "S", "S"].map((day, index) => (
                            <Text key={`${day}-${index}`} style={styles.weekDay}>{day}</Text>
                        ))}
                    </View>

                    <View style={styles.daysGrid}>
                        {days.map((day) => {
                            const key = toDateKey(day);
                            const inMonth = day.getMonth() === month.getMonth();
                            const selected = selectedDate === key;

                            return (
                                <TouchableOpacity
                                    key={key}
                                    onPress={() => onSelectDate(key)}
                                    style={[
                                        styles.dayButton,
                                        !inMonth && styles.dayOutside,
                                        selected && styles.daySelected,
                                    ]}>
                                    <Text style={[
                                        styles.dayText,
                                        !inMonth && styles.dayTextOutside,
                                        selected && styles.dayTextSelected,
                                    ]}>
                                        {day.getDate()}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <TouchableOpacity onPress={onClose} style={styles.closeCalendarButton}>
                        <Text style={styles.closeCalendarText}>Fechar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

function startOfMonth(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, amount: number) {
    return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function getCalendarDays(month: Date) {
    const first = startOfMonth(month);
    const start = new Date(first);
    start.setDate(first.getDate() - first.getDay());

    return Array.from({ length: 42 }, (_, index) => {
        const day = new Date(start);
        day.setDate(start.getDate() + index);
        return day;
    });
}

function toDateKey(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function formatDateLabel(dateKey: string) {
    const [year, month, day] = dateKey.split("-").map(Number);
    return new Date(year, month - 1, day).toLocaleDateString("pt-BR");
}

function groupMatchesByPhaseAndDate(matches: Partida[]) {
    const sections = new Map<string, { title: string; data: Partida[] }>();
    const sortedMatches = [...matches].sort((a, b) => {
        const phaseCompare = (a.fase ?? "").localeCompare(b.fase ?? "", "pt-BR");
        if (phaseCompare !== 0) {
            return phaseCompare;
        }

        return new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime();
    });

    sortedMatches.forEach((match) => {
        const dateKey = toDateKey(new Date(match.dataHora));
        const title = `${match.fase} • ${formatDateLabel(dateKey)}`;
        const section = sections.get(title) ?? { title, data: [] };
        section.data.push(match);
        sections.set(title, section);
    });

    return Array.from(sections.values());
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: CopaTheme.background,
    },
    title: {
        color: CopaTheme.primaryDark,
        fontSize: 28,
        fontWeight: "900",
    },
    subtitle: {
        color: CopaTheme.textMuted,
        marginTop: 4,
    },
    headerCard: {
        borderRadius: 22,
        backgroundColor: CopaTheme.surface,
        borderWidth: 1,
        borderColor: CopaTheme.border,
        marginBottom: 14,
        padding: 18,
        ...CopaTheme.shadow,
    },
    input: {
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 14,
        backgroundColor: CopaTheme.surface,
        marginBottom: 12,
        padding: 14,
        ...CopaTheme.shadow,
    },
    dateValue: {
        color: CopaTheme.primaryDark,
        fontWeight: "800",
    },
    datePlaceholder: {
        color: CopaTheme.textMuted,
    },
    clearDateButton: {
        alignSelf: "flex-start",
        marginBottom: 12,
    },
    clearDateText: {
        color: CopaTheme.info,
        fontWeight: "800",
    },
    filterRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginBottom: 10,
    },
    filterChip: {
        borderWidth: 1,
        borderColor: CopaTheme.primary,
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    filterChipActive: {
        backgroundColor: CopaTheme.primary,
    },
    filterText: {
        color: CopaTheme.primary,
        fontSize: 12,
        fontWeight: "700",
    },
    filterTextActive: {
        color: "#fff",
    },
    card: {
        padding: 16,
        backgroundColor: CopaTheme.surface,
        marginBottom: 10,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: CopaTheme.border,
        ...CopaTheme.shadow,
    },
    sectionHeaderText: {
        alignSelf: "flex-start",
        overflow: "hidden",
        borderRadius: 999,
        backgroundColor: CopaTheme.primaryLight,
        color: CopaTheme.primaryDark,
        fontSize: 12,
        fontWeight: "900",
        marginBottom: 8,
        marginTop: 6,
        paddingHorizontal: 11,
        paddingVertical: 6,
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 10,
        marginBottom: 8,
    },
    matchTitle: {
        flex: 1,
        color: CopaTheme.primaryDark,
        fontSize: 16,
        fontWeight: "900",
        marginBottom: 4,
    },
    teamsRow: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    statusBadge: {
        borderRadius: 999,
        paddingHorizontal: 9,
        paddingVertical: 5,
    },
    statusText: {
        fontSize: 11,
        fontWeight: "900",
    },
    meta: {
        color: CopaTheme.textMuted,
        marginTop: 2,
    },
    detailButton: {
        alignSelf: "flex-start",
        borderRadius: 999,
        backgroundColor: CopaTheme.primaryLight,
        marginTop: 12,
        paddingHorizontal: 12,
        paddingVertical: 7,
    },
    detailButtonText: {
        color: CopaTheme.primaryDark,
        fontSize: 12,
        fontWeight: "900",
    },
    error: {
        color: "#dc2626",
        marginBottom: 12,
    },
    empty: {
        color: CopaTheme.textMuted,
        textAlign: "center",
        paddingVertical: 18,
    },
    modalOverlay: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(15, 23, 42, 0.45)",
        padding: 20,
    },
    calendarCard: {
        width: "100%",
        maxWidth: 360,
        borderRadius: 24,
        backgroundColor: CopaTheme.surface,
        borderWidth: 1,
        borderColor: CopaTheme.border,
        padding: 18,
        ...CopaTheme.shadow,
    },
    calendarHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 14,
    },
    calendarTitle: {
        color: CopaTheme.primaryDark,
        fontSize: 18,
        fontWeight: "900",
        textTransform: "capitalize",
    },
    monthButton: {
        alignItems: "center",
        justifyContent: "center",
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: CopaTheme.primaryLight,
    },
    monthButtonText: {
        color: CopaTheme.primaryDark,
        fontSize: 24,
        fontWeight: "900",
        lineHeight: 28,
    },
    weekRow: {
        flexDirection: "row",
        marginBottom: 8,
    },
    weekDay: {
        width: `${100 / 7}%`,
        color: CopaTheme.textMuted,
        fontSize: 12,
        fontWeight: "900",
        textAlign: "center",
    },
    daysGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    dayButton: {
        alignItems: "center",
        justifyContent: "center",
        width: `${100 / 7}%`,
        aspectRatio: 1,
        borderRadius: 12,
    },
    dayOutside: {
        opacity: 0.35,
    },
    daySelected: {
        backgroundColor: CopaTheme.primary,
    },
    dayText: {
        color: CopaTheme.primaryDark,
        fontWeight: "800",
    },
    dayTextOutside: {
        color: CopaTheme.textMuted,
    },
    dayTextSelected: {
        color: CopaTheme.textLight,
    },
    closeCalendarButton: {
        alignItems: "center",
        borderRadius: 14,
        borderWidth: 1,
        borderColor: CopaTheme.border,
        marginTop: 16,
        padding: 12,
    },
    closeCalendarText: {
        color: CopaTheme.primary,
        fontWeight: "900",
    },
});
