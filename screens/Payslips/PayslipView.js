import React from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Dimensions
} from 'react-native';
import {
    Text,
    Card,
    Button,
    useTheme,
    Divider,
    IconButton
} from 'react-native-paper';
import { Download, ArrowLeft, Calendar, User, Building2, CreditCard, TrendingUp, TrendingDown } from 'lucide-react-native';
import { getCommonStyles } from '../../constants/commonStyles';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function PayslipView() {
    const { colors } = useTheme();
    const styles = getStyles(colors);
    const commonStyles = getCommonStyles(colors);
    const navigation = useNavigation();
    const route = useRoute();

    const { payslip } = route.params;

    const handleDownloadPayslip = () => {
        Alert.alert(
            'Download Payslip',
            `Downloading payslip for ${payslip.month}`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Download', onPress: () => console.log('Downloading...') }
            ]
        );
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatCurrencyInWords = (amount) => {
        // Simplified number to words conversion for display
        if (amount >= 100000) {
            const lakhs = Math.floor(amount / 100000);
            const thousands = Math.floor((amount % 100000) / 1000);
            const hundreds = Math.floor((amount % 1000) / 100);
            const remaining = amount % 100;

            let words = '';
            if (lakhs > 0) words += `${lakhs} Lakh${lakhs > 1 ? 's' : ''} `;
            if (thousands > 0) words += `${thousands} Thousand `;
            if (hundreds > 0) words += `${hundreds} Hundred `;
            if (remaining > 0) words += `${remaining} `;
            words += 'Rupees Only';

            return words.trim();
        }
        return 'Amount in words';
    };

    const earningsData = [
        { label: 'Basic Salary', amount: payslip.grossPay * 0.6 },
        { label: 'HRA', amount: payslip.grossPay * 0.2 },
        { label: 'Special Allowance', amount: payslip.grossPay * 0.15 },
        { label: 'Fixed Allowance', amount: payslip.grossPay * 0.05 }
    ];

    const deductionsData = [
        { label: 'PF Contribution', amount: payslip.deductions * 0.5 },
        { label: 'TDS', amount: payslip.incomeTax },
        { label: 'Professional Tax', amount: payslip.deductions * 0.1 },
        { label: 'NPS Contribution', amount: payslip.deductions * 0.4 }
    ];

    return (
        <View style={commonStyles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <ArrowLeft size={24} color={colors.onSurface} />
                </TouchableOpacity>
                <Text variant="titleMedium" style={styles.headerTitle}>
                    Payslip Details
                </Text>
                <TouchableOpacity
                    style={styles.downloadButton}
                    onPress={handleDownloadPayslip}
                >
                    <Download size={20} color={colors.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* Employee Details Card */}
                <Card style={styles.employeeCard}>
                    <Card.Content style={styles.cardContent}>
                        <View style={styles.employeeHeader}>
                            <User size={24} color={colors.primary} />
                            <Text variant="titleMedium" style={styles.sectionTitle}>
                                Employee Details
                            </Text>
                        </View>

                        <View style={styles.employeeDetails}>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Employee No/ID</Text>
                                <Text style={styles.detailValue}>EMP0089</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Name</Text>
                                <Text style={styles.detailValue}>Anil Kumar</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Bank</Text>
                                <Text style={styles.detailValue}>SBI</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>A/C No</Text>
                                <Text style={styles.detailValue}>436243624389</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Joining Date</Text>
                                <Text style={styles.detailValue}>2025-07-28</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>PF No</Text>
                                <Text style={styles.detailValue}>AWSDE1234567890</Text>
                            </View>
                        </View>
                    </Card.Content>
                </Card>

                {/* Pay Period Card */}
                <Card style={styles.card}>
                    <Card.Content style={styles.cardContent}>
                        <View style={{ ...styles.sectionHeader, marginBottom: 0 }}>
                            <Calendar size={20} color={colors.primary} />
                            <Text variant="titleMedium" style={styles.sectionTitle}>
                                Pay Period: {payslip.payPeriod}
                            </Text>
                        </View>
                    </Card.Content>
                </Card>

                {/* Earnings Card */}
                <Card style={styles.card}>
                    <Card.Content style={styles.cardContent}>
                        <View style={styles.sectionHeader}>
                            <TrendingUp size={20} color={colors.primary} />
                            <Text variant="titleMedium" style={styles.sectionTitle}>
                                Earnings
                            </Text>
                        </View>

                        {earningsData.map((item, index) => (
                            <View key={index} style={styles.financialRow}>
                                <Text style={styles.financialLabel}>{item.label}</Text>
                                <Text style={styles.financialAmount}>
                                    {formatCurrency(item.amount)}
                                </Text>
                            </View>
                        ))}

                        <Divider style={styles.divider} />
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Total (Gross Salary)</Text>
                            <Text style={[styles.totalAmount, { color: colors.primary }]}>
                                {formatCurrency(payslip.grossPay)}
                            </Text>
                        </View>
                    </Card.Content>
                </Card>

                {/* Deductions Card */}
                <Card style={styles.card}>
                    <Card.Content style={styles.cardContent}>
                        <View style={styles.sectionHeader}>
                            <TrendingDown size={20} color={colors.error} />
                            <Text variant="titleMedium" style={styles.sectionTitle}>
                                Deductions
                            </Text>
                        </View>

                        {deductionsData.map((item, index) => (
                            <View key={index} style={styles.financialRow}>
                                <Text style={styles.financialLabel}>{item.label}</Text>
                                <Text style={[styles.financialAmount, { color: colors.error }]}>
                                    {formatCurrency(item.amount)}
                                </Text>
                            </View>
                        ))}

                        <Divider style={styles.divider} />
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Total Deductions</Text>
                            <Text style={[styles.totalAmount, { color: colors.error }]}>
                                {formatCurrency(payslip.deductions + payslip.incomeTax)}
                            </Text>
                        </View>
                    </Card.Content>
                </Card>

                {/* Net Pay Card */}
                <Card style={styles.netPayCard}>
                    <Card.Content style={styles.netPayCardContent}>
                        <View style={styles.netPayHeader}>
                            <CreditCard size={24} color={colors.surface} />
                            <Text variant="titleLarge" style={styles.netPayTitle}>
                                Net Pay for {payslip.month}
                            </Text>
                        </View>

                        <Text variant="titleLarge" style={styles.netPayAmount}>
                            {formatCurrency(payslip.netPay)}
                        </Text>

                        <Text style={styles.netPayWords}>
                            {formatCurrencyInWords(payslip.netPay)}
                        </Text>
                    </Card.Content>
                </Card>

                {/* Download Section */}
                <View style={styles.downloadSection}>
                    <Button
                        mode="contained"
                        icon={Download}
                        onPress={handleDownloadPayslip}
                        style={styles.downloadButtonLarge}
                        labelStyle={styles.downloadButtonLabel}
                    >
                        Download PDF
                    </Button>
                </View>
            </ScrollView>
        </View>
    );
}

const getStyles = (colors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: colors.background,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderColor,
        elevation: 4, // Adds bottom elevation (Android)
        shadowColor: "#000", // Adds shadow for iOS
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 4
    },
    backButton: {
        marginRight: 16
    },
    headerTitle: {
        fontWeight: '600',
        color: colors.onSurface,
        flex: 1,
    },
    downloadButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: colors.primaryContainer,
    },
    employeeCard: {
        margin: 16,
        marginBottom: 12,
        backgroundColor: colors.surface,
        borderRadius: 16,
        elevation: 2,
    },
    card: {
        marginHorizontal: 16,
        marginBottom: 12,
        backgroundColor: colors.surface,
        borderRadius: 12,
        elevation: 2,
    },
    cardContent: {
        padding: 16,
    },
    employeeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 8,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 8,
    },

    sectionTitle: {
        fontWeight: '600',
        color: colors.onSurface,
    },
    employeeDetails: {
        gap: 8,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 4,
    },
    detailLabel: {
        fontSize: 14,
        color: colors.onSurfaceVariant,
        flex: 1,
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.onSurface,
        flex: 1,
        textAlign: 'right',
    },
    payPeriod: {
        fontSize: 16,
        color: colors.onSurface,
        textAlign: 'center',
        fontWeight: '500',
    },

    financialRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 6,
    },
    financialLabel: {
        fontSize: 13,
        color: colors.onSurfaceVariant,
        flex: 1,
    },
    financialAmount: {
        fontSize: 13,
        fontWeight: '500',
        color: colors.onSurface,
    },
    divider: {
        marginVertical: 8,
        backgroundColor: colors.outlineLight,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 4,
    },
    totalLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.onSurface,
    },
    totalAmount: {
        fontSize: 16,
        fontWeight: '700',
    },
    netPayCard: {
        marginHorizontal: 16,
        marginBottom: 12,
        backgroundColor: colors.primary,
        borderRadius: 16,
        elevation: 4,
    },
    netPayCardContent: {
        alignItems: 'center',
        padding: 16,
    },
    netPayHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 8,
    },
    netPayTitle: {
        fontWeight: '600',
        color: colors.surface,
    },
    netPayAmount: {
        fontWeight: '700',
        color: colors.surface,
        textAlign: 'center',
        marginBottom: 8,
    },
    netPayWords: {
        fontSize: 12,
        color: colors.surface,
        textAlign: 'center',
        opacity: 0.9,
        fontStyle: 'italic',
    },
    downloadSection: {
        padding: 16,
        paddingBottom: 20,
        paddingTop: 0,
    },
    downloadButtonLarge: {
        borderRadius: 12,
        paddingVertical: 0,
    },
    downloadButtonLabel: {
        fontSize: 16,
        fontWeight: '600',
    },
});
