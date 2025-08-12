import React, { useState, useEffect } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Dimensions,
    Animated
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
    Text,
    Card,
    Button,
    Chip,
    useTheme,
    Divider,
    Menu
} from 'react-native-paper';
import { Download, Eye, ChevronDown, Calendar, FileText, TrendingUp, TrendingDown, FileX, Search } from 'lucide-react-native';
import { getCommonStyles } from '../../constants/commonStyles';
import { useNavigation } from '@react-navigation/native';
import PageHeader from '../../components/PageHeader';
import Factory from '../../utils/Factory';
import { monthstoInt, intToMonths } from '../../utils/constants';

export default function PayslipsScreen() {
    const { colors } = useTheme();
    const styles = getStyles(colors);
    const commonStyles = getCommonStyles(colors);
    const navigation = useNavigation();

    const [selectedYear, setSelectedYear] = useState('2025-2026');
    const [yearMenuVisible, setYearMenuVisible] = useState(false);
    const [payslipsData, setPayslipsData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const spinValue = new Animated.Value(0);

    const financialYears = ['2025-2026', '2024-2025', '2023-2024', '2022-2023'];


    const handleYearSelect = (year) => {
        setSelectedYear(year);
        setYearMenuVisible(false);
    };

    const handleViewPayslip = (payslip) => {
        navigation.navigate('PayslipView', { payslip });
    };

    const handleDownloadPayslip = (payslip) => {
        Alert.alert(
            'Download Payslip',
            `Downloading payslip for ${payslip.month_year}`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Download', onPress: () => console.log('Downloading...') }
            ]
        );
    };

    // Filter payslips based on selected year
    const getFilteredPayslips = () => {
        if (!payslipsData || payslipsData.length === 0) return [];
        return payslipsData.filter(payslip => {
            const payslipYear = payslip.month_year ? payslip.month_year.split(' ')[1] : '';
            return selectedYear.includes(payslipYear);
        });
    };

    const filteredPayslips = getFilteredPayslips();

    // Loading State Component
    const LoadingState = () => (
        <View style={styles.loadingState}>
            <View style={styles.loadingSpinner}>
                <Animated.View
                    style={[
                        styles.spinner,
                        {
                            borderColor: colors.primary,
                            borderTopColor: 'transparent',
                            transform: [{ rotate: spin }]
                        }
                    ]}
                />
            </View>
            <Text variant="bodyMedium" style={styles.loadingText}>
                Loading payslips...
            </Text>
        </View>
    );

    // Empty State Component
    const EmptyState = () => (
        <View style={styles.emptyState}>
            <View style={styles.emptyStateIconContainer}>
                <FileX size={80} color={colors.onSurfaceVariant} style={styles.emptyStateIcon} />
                <Search size={24} color={colors.primary} style={styles.emptyStateSearchIcon} />
            </View>
            <Text variant="headlineSmall" style={styles.emptyStateTitle}>
                No Payslips Found
            </Text>
            <Text variant="bodyMedium" style={styles.emptyStateMessage}>
                No payslips available for the financial year {selectedYear}.
            </Text>
            <Text variant="bodySmall" style={styles.emptyStateSubMessage}>
                Try selecting a different financial year or check back later.
            </Text>
        </View>
    );

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    useEffect(() => {
        const getPayslipData = async () => {
            setIsLoading(true);
            try {
                const res = await Factory('get', `/payroll/employee-payslips-by-financial-year/?financial_year=${selectedYear}`, {});
                if (res.status_cd === 1) {
                    setPayslipsData(res.data)
                } else {
                    console.log(res)
                }
            } catch (error) {
                console.error('Error fetching payslips:', error);
            } finally {
                setIsLoading(false);
            }
        }
        if (selectedYear)
            getPayslipData();
    }, [selectedYear]);

    // Spinner animation effect
    useEffect(() => {
        if (isLoading) {
            const spinAnimation = Animated.loop(
                Animated.timing(spinValue, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                })
            );
            spinAnimation.start();
        }
    }, [isLoading, spinValue]);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (<>
        <PageHeader back={true} />
        <View style={commonStyles.container}>
            <ScrollView style={styles.container} contentContainerStyle={{ ...commonStyles.contentContainer, padding: 0 }} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <View style={styles.yearSelector}>
                        <Menu
                            visible={yearMenuVisible}
                            onDismiss={() => setYearMenuVisible(false)}
                            anchor={
                                <TouchableOpacity
                                    style={styles.yearButton}
                                    onPress={() => setYearMenuVisible(true)}
                                    activeOpacity={0.7}
                                >
                                    <Calendar size={18} color={colors.primary} />
                                    <Text variant="bodyMedium" style={styles.yearText}>
                                        F.Y.:&nbsp;{selectedYear}
                                    </Text>
                                    <ChevronDown size={18} color={colors.primary} />
                                </TouchableOpacity>
                            }
                            contentStyle={styles.menuContent}
                        >
                            {financialYears.map((year) => (
                                <Menu.Item
                                    key={year}
                                    onPress={() => handleYearSelect(year)}
                                    title={year}
                                    titleStyle={[
                                        styles.menuItemText,
                                        { color: year === selectedYear ? colors.primary : colors.onSurface }
                                    ]}
                                />
                            ))}
                        </Menu>
                    </View>
                </View>

                {/* Payslips List */}
                <View style={styles.payslipsContainer}>
                    {isLoading ? (
                        <LoadingState />
                    ) : filteredPayslips.length === 0 ? (
                        <EmptyState />
                    ) : (
                        filteredPayslips.map((payslip) => (
                            <View key={payslip.id} style={styles.payslipCard}>
                                <View style={styles.cardContent}>
                                    {/* Header Row */}
                                    <View style={styles.cardHeader}>
                                        <View style={styles.monthSection}>
                                            <FileText size={24} color={colors.primary} />
                                            <Text variant="titleMedium" style={styles.monthText}>
                                                {payslip.month_year}
                                            </Text>
                                        </View>
                                        <View style={styles.actionButtons}>
                                            <Button
                                                mode="outlined"
                                                icon={Eye}
                                                onPress={() => handleViewPayslip(payslip)}
                                                style={styles.viewButton}
                                                labelStyle={styles.buttonLabel}
                                            >
                                                View
                                            </Button>
                                            <Button
                                                mode="contained"
                                                icon={Download}
                                                onPress={() => handleDownloadPayslip(payslip)}
                                                style={styles.downloadButton}
                                                labelStyle={styles.buttonLabel}
                                            >
                                                Download
                                            </Button>
                                        </View>
                                    </View>

                                    <Divider style={styles.divider} />

                                    {/* Financial Details */}
                                    <View style={styles.financialDetails}>
                                        <View style={styles.financialRow}>
                                            <View style={styles.financialItem}>
                                                <View style={styles.financialContent}>
                                                    <Text variant="bodySmall" style={styles.financialLabel}>
                                                        Gross Pay
                                                    </Text>
                                                    <Text variant="titleMedium" style={styles.grossPayText}>
                                                        {formatCurrency(payslip.gross_salary)}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style={styles.financialItem}>
                                                <View style={styles.financialContent}>
                                                    <Text variant="bodySmall" style={styles.financialLabel}>
                                                        Net Pay
                                                    </Text>
                                                    <Text variant="titleMedium" style={styles.grossPayText}>
                                                        {formatCurrency(payslip.net_salary)}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>

                                        <View style={styles.deductionsRow}>
                                            <View style={styles.deductionItem}>
                                                <View style={styles.deductionContent}>
                                                    <TrendingDown size={16} color={colors.error} />
                                                    <Text variant="bodySmall" style={styles.deductionLabel}>
                                                        Deductions
                                                    </Text>
                                                    <Text variant="bodyMedium" style={styles.deductionAmount}>
                                                        {formatCurrency(payslip.deduction)}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style={styles.deductionItem}>
                                                <View style={styles.deductionContent}>
                                                    <TrendingDown size={16} color={colors.error} />
                                                    <Text variant="bodySmall" style={styles.deductionLabel}>
                                                        Income Tax (TDS)
                                                    </Text>
                                                    <Text variant="bodyMedium" style={styles.deductionAmount}>
                                                        {formatCurrency(payslip.tds)}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>
        </View>
    </>
    );
}

const getStyles = (colors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 16,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
    titleSection: {
        marginBottom: 16,
    },
    title: {
        fontWeight: '700',
        color: colors.onSurface,
        marginBottom: 6,
    },
    subtitle: {
        color: colors.onSurfaceVariant,
        lineHeight: 18,
        fontSize: 13,
    },
    yearSelector: {
        zIndex: 1000,
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
    yearButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.outline,
        gap: 6,
        minWidth: 120,
    },
    yearText: {
        color: colors.text,
        fontWeight: '600',
    },
    menuItemText: {
        fontSize: 16,
    },
    payslipsContainer: {
        paddingHorizontal: 16,
        gap: 12,
    },
    payslipCard: {
        borderRadius: 12,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.outlineLight,
    },
    gradientBackground: {
        flex: 1,
        borderRadius: 12,
    },
    cardContent: {
        padding: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    monthSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    monthText: {
        fontWeight: '600',
        color: colors.onSurface,
        fontSize: 16,
    },

    payPeriodText: {
        color: colors.onSurfaceVariant,
        marginBottom: 12,
        fontSize: 12,
    },
    divider: {
        marginVertical: 4,
        backgroundColor: colors.outlineLight,
    },
    financialDetails: {
        gap: 8,
        marginBottom: 0,
    },
    financialRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 0,
    },
    financialItem: {
        flex: 1,
        alignItems: 'center',
        borderRadius: 8,
        marginHorizontal: 2,
        overflow: 'hidden',
    },
    financialContent: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 8,
        borderRadius: 8,
        width: '100%',
        minWidth: '100%',
    },
    financialLabel: {
        color: colors.onSurfaceVariant,
        marginBottom: 2,
        fontSize: 12,
        fontWeight: '500',
    },
    grossPayText: {
        fontWeight: '700',
        color: colors.primary,
        fontSize: 18,
    },
    netPayText: {
        fontWeight: '700',
        color: colors.primary,
        fontSize: 18,
    },
    deductionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
        width: '100%',
    },
    deductionItem: {
        flex: 1,
        alignItems: 'center',
        borderRadius: 8,
        marginHorizontal: 2,
        overflow: 'hidden',
        minWidth: 0,
    },
    deductionContent: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 8,
        borderRadius: 8,
        width: '100%',
        minWidth: '100%',
    },
    deductionLabel: {
        color: colors.onSurfaceVariant,
        textAlign: 'center',
        marginBottom: 2,
        fontSize: 12,
        fontWeight: '500',
    },
    deductionAmount: {
        fontWeight: '700',
        color: colors.error,
        fontSize: 18,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 6,
        justifyContent: 'flex-end',
    },
    viewButton: {
        borderRadius: 8,
        paddingVertical: 4,
    },
    downloadButton: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
    },
    buttonLabel: {
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'none',
        marginHorizontal: 0,
        marginVertical: 0,
    },
    menuContent: {
        backgroundColor: colors.surface,
        borderRadius: 8,
        marginTop: 2,
        marginLeft: 0,
        elevation: 8,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        minWidth: 120,
        width: 120,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
        paddingHorizontal: 32,
    },
    emptyStateIconContainer: {
        position: 'relative',
        marginBottom: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyStateIcon: {
        opacity: 0.6,
    },
    emptyStateSearchIcon: {
        position: 'absolute',
        bottom: -8,
        right: -8,
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 4,
    },
    emptyStateTitle: {
        fontWeight: '600',
        color: colors.onSurface,
        textAlign: 'center',
        marginBottom: 12,
    },
    emptyStateMessage: {
        color: colors.onSurfaceVariant,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 8,
    },
    emptyStateSubMessage: {
        color: colors.onSurfaceVariant,
        textAlign: 'center',
        opacity: 0.8,
        fontStyle: 'italic',
    },
    loadingState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
        paddingHorizontal: 32,
    },
    loadingSpinner: {
        marginBottom: 16,
    },
    spinner: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 3,
        borderColor: colors.primary,
        borderTopColor: 'transparent',
    },
    loadingText: {
        color: colors.onSurfaceVariant,
        textAlign: 'center',
        fontWeight: '500',
    },
});
