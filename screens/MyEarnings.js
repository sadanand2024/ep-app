import React, { useState, useContext, useEffect } from "react";
import {
    View,
    StyleSheet,
    ScrollView,
    RefreshControl,
    TouchableOpacity,
    Dimensions,
    Alert,
    ActivityIndicator
} from "react-native";
import { Text, useTheme, Card, DataTable, Button, Menu, Divider } from "react-native-paper";
import {
    Calendar,
    Download,
    ChevronDown,
    TrendingUp,
    DollarSign,
    TrendingDown,
    Wallet,
    CreditCard,
    PiggyBank,
    Home,
    GraduationCap
} from "lucide-react-native";
import { DrawerContext } from "../context/DrawerContext";
import { getCommonStyles } from "../constants/commonStyles";
import Factory from "../utils/Factory";
import PageHeader from "../components/PageHeader";
import { monthsObj, financialYears, monthstoInt, getDefaultMonth, putCommas } from "../utils/constants";

const { width } = Dimensions.get('window');

export default function MyEarningsScreen({ navigation }) {
    const { colors } = useTheme();
    const styles = getStyles(colors);
    const commonStyles = getCommonStyles(colors);
    const { isDarkMode } = useContext(DrawerContext);
    // State management
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState('salary');
    const [financialYear, setFinancialYear] = useState('2025-2026');
    const [selectedMonth, setSelectedMonth] = useState(getDefaultMonth());
    const [yearMenuVisible, setYearMenuVisible] = useState(false);
    const [monthMenuVisible, setMonthMenuVisible] = useState(false);
    const [salaryData, setSalaryData] = useState({
        earnings: [
            { component_name: 'Basic Salary', month_data: '₹0', ytd: '₹6,15,323', icon: DollarSign, color: '#4CAF50' },
            { component_name: 'Hra (House Rent Allowance)', month_data: '₹0', ytd: '₹3,07,661', icon: Home, color: '#2196F3' },
            { component_name: 'Children Education Allowance', month_data: '₹0', ytd: '₹52,742', icon: GraduationCap, color: '#FF9800' },
            { component_name: 'Gross (Total Earnings)', month_data: '₹0', ytd: '₹12,24,316', icon: TrendingUp, color: '#4CAF50' }
        ],
        deductions: [
            { component_name: 'Epf (Employee Provident Fund)', month_data: '₹0', ytd: '₹7,200', icon: PiggyBank, color: '#9C27B0' },
            { component_name: 'Pt (Professional Tax)', month_data: '₹0', ytd: '₹800', icon: CreditCard, color: '#F44336' },
            { component_name: 'Tds (Tax Deducted at Source)', month_data: '₹0', ytd: '₹2,64,322', icon: TrendingDown, color: '#FF5722' },
            { component_name: 'Total Deductions', month_data: '₹0', ytd: '₹2,73,377', icon: TrendingDown, color: '#F44336' }
        ],
        net_salary: { component_name: 'Net Salary', month_data: '₹0', ytd: '₹9,50,939', icon: Wallet, color: '#4CAF50' }
    });
    const [pfData, setPfData] = useState({
        employee_pf: { month_data: 0, ytd: 0 },
        employer_pf: { month_data: 0, ytd: 0 },
        total_pf: { month_data: 0, ytd: 0 }
    });
    const [pfLoading, setPfLoading] = useState(false);

    const months = Object.values(monthsObj);

    // Helper function to check if data is empty
    const isDataEmpty = (data) => {
        if (!data) return true;
        
        // For salary data
        if (data.earnings && data.deductions) {
            const hasEarnings = data.earnings && data.earnings.length > 0;
            const hasDeductions = data.deductions && data.deductions.length > 0;
            const hasGrossIncome = data.gross_income && (data.gross_income.month_data > 0 || data.gross_income.ytd > 0);
            const hasNetSalary = data.net_salary && (data.net_salary.month_data > 0 || data.net_salary.ytd > 0);
            
            return !hasEarnings && !hasDeductions && !hasGrossIncome && !hasNetSalary;
        }
        
        // For PF data
        if (data.employee_pf || data.employer_pf || data.total_pf) {
            const hasEmployeePF = data.employee_pf && (data.employee_pf.month_data > 0 || data.employee_pf.ytd > 0);
            const hasEmployerPF = data.employer_pf && (data.employer_pf.month_data > 0 || data.employer_pf.ytd > 0);
            const hasTotalPF = data.total_pf && (data.total_pf.month_data > 0 || data.total_pf.ytd > 0);
            
            return !hasEmployeePF && !hasEmployerPF && !hasTotalPF;
        }
        
        return true;
    };

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            // Refresh salary data
            let salaryUrl = `/payroll/employee-ytd-details/?month=${monthstoInt[selectedMonth]}&financial_year=${financialYear}`;
            const salaryResponse = await Factory('get', salaryUrl, {}, {});
            if (salaryResponse.status_cd === 1) {
                setSalaryData(salaryResponse.data);
            }

            // Refresh PF data
            let pfUrl = `/payroll/pf-breakdown/?month=${monthstoInt[selectedMonth]}&financial_year=${financialYear}`;
            const pfResponse = await Factory('get', pfUrl, {}, {});
            if (pfResponse.status_cd === 1) {
                setPfData(pfResponse.data);
            }
        } catch (error) {
            console.error('Error refreshing data:', error);
        }
        setRefreshing(false);
    };

    const renderHeader = () => (
        <View style={styles.header}>
            <View style={styles.filters}>
                <Menu
                    visible={yearMenuVisible}
                    onDismiss={() => setYearMenuVisible(false)}
                    anchor={
                        <TouchableOpacity
                            style={styles.filterButton}
                            onPress={() => setYearMenuVisible(true)}
                        >
                            <Text variant="bodyMedium" style={styles.filterText}>
                                {financialYear}
                            </Text>
                            <ChevronDown size={12} color={colors.onSurface} />
                        </TouchableOpacity>
                    }
                    contentStyle={styles.menuContent}
                >
                    {financialYears.map((year) => (
                        <Menu.Item
                            key={year}
                            onPress={() => {
                                setFinancialYear(year);
                                setYearMenuVisible(false);
                            }}
                            title={year}
                            titleStyle={styles.menuItemText}
                            style={styles.menuItem}
                        />
                    ))}
                </Menu>

                <Menu
                    visible={monthMenuVisible}
                    onDismiss={() => setMonthMenuVisible(false)}
                    anchor={
                        <TouchableOpacity
                            style={styles.filterButton}
                            onPress={() => setMonthMenuVisible(true)}
                        >
                            <Text variant="bodyMedium" style={styles.filterText}>
                                {selectedMonth}
                            </Text>
                            <ChevronDown size={12} color={colors.onSurface} />
                        </TouchableOpacity>
                    }
                    contentStyle={styles.menuContent}
                >
                    {months.map((month) => (
                        <Menu.Item
                            key={month}
                            onPress={() => {
                                setSelectedMonth(month);
                                setMonthMenuVisible(false);
                            }}
                            title={month}
                            titleStyle={styles.menuItemText}
                            style={styles.menuItem}
                        />
                    ))}
                </Menu>
            </View>
        </View>
    );

    const renderTabs = () => (
        <View style={styles.tabContainer}>
            <TouchableOpacity
                style={[styles.tab, activeTab === 'salary' && styles.activeTab]}
                onPress={() => setActiveTab('salary')}
            >
                <DollarSign size={18} color={activeTab === 'salary' ? colors.primary : colors.onSurfaceVariant} />
                <Text style={[styles.tabText, activeTab === 'salary' && styles.activeTabText]}>
                    Salary Breakdown
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.tab, activeTab === 'pf' && styles.activeTab]}
                onPress={() => setActiveTab('pf')}
            >
                <PiggyBank size={18} color={activeTab === 'pf' ? colors.primary : colors.onSurfaceVariant} />
                <Text style={[styles.tabText, activeTab === 'pf' && styles.activeTabText]}>
                    PF Breakdown
                </Text>
            </TouchableOpacity>
        </View>
    );

    const renderSalaryTable = () => (
        <Card style={styles.tableCard}>
            <Card.Content style={styles.tableContent}>
                {isDataEmpty(salaryData) ? (
                    <View style={styles.emptyContainer}>
                        <DollarSign size={48} color={colors.onSurfaceVariant} />
                        <Text variant="titleLarge" style={styles.emptyTitle}>
                            No Salary Data Found
                        </Text>
                        <Text variant="bodyMedium" style={styles.emptySubtitle}>
                            No salary information available for {selectedMonth} {financialYear}
                        </Text>
                    </View>
                ) : (
                    <>
                        <View style={styles.tableHeader}>
                            <Text variant="titleLarge" style={styles.tableTitle}>Salary Breakdown</Text>
                            <Text variant="bodyMedium" style={styles.tableSubtitle}>
                                {selectedMonth} {financialYear}
                            </Text>
                        </View>

                        <DataTable>
                            <DataTable.Header style={styles.tableHeaderRow}>
                                <DataTable.Title style={styles.itemColumn}>
                                    <Text variant="titleMedium" style={styles.headerText}>Item</Text>
                                </DataTable.Title>
                                <DataTable.Title numeric style={styles.monthColumn}>
                                    <Text variant="titleMedium" style={styles.headerText}>
                                        Salary
                                    </Text>
                                </DataTable.Title>
                                <DataTable.Title numeric style={styles.ytdColumn}>
                                    <Text variant="titleMedium" style={styles.headerText}>YTD</Text>
                                </DataTable.Title>
                            </DataTable.Header>

                            {/* Earnings Section */}
                            <DataTable.Row style={styles.categoryRow}>
                                <DataTable.Cell style={styles.itemColumn}>
                                    <View style={styles.categoryContainer}>
                                        <TrendingUp size={16} color={colors.primary} />
                                        <Text variant="titleMedium" style={styles.categoryText}>Earnings</Text>
                                    </View>
                                </DataTable.Cell>
                                <DataTable.Cell numeric style={styles.monthColumn}></DataTable.Cell>
                                <DataTable.Cell numeric style={styles.ytdColumn}></DataTable.Cell>
                            </DataTable.Row>

                            {salaryData.earnings.map((row, index) => (
                                <DataTable.Row key={`earnings-${index}`} style={styles.dataRow}>
                                    <DataTable.Cell style={styles.itemColumn}>
                                        <View style={styles.itemContainer}>
                                            <Text variant="bodyMedium" style={styles.itemText}>{row.component_name}</Text>
                                        </View>
                                    </DataTable.Cell>
                                    <DataTable.Cell numeric style={styles.monthColumn}>
                                        <Text variant="bodyMedium" style={styles.amountText}>₹{putCommas(row.month_data)}</Text>
                                    </DataTable.Cell>
                                    <DataTable.Cell numeric style={styles.ytdColumn}>
                                        <Text variant="bodyMedium" style={styles.amountText}>₹{putCommas(row.ytd)}</Text>
                                    </DataTable.Cell>
                                </DataTable.Row>
                            ))}
                            <DataTable.Row key={`earnings-gross`} style={styles.dataRow}>
                                <DataTable.Cell style={styles.itemColumn}>
                                    <View style={styles.itemContainer}>
                                        <Text variant="bodyMedium" style={styles.itemText}>Gross</Text>
                                    </View>
                                </DataTable.Cell>
                                <DataTable.Cell numeric style={styles.monthColumn}>
                                    <Text variant="bodyMedium" style={styles.amountText}>₹{putCommas(salaryData?.gross_income?.month_data)}</Text>
                                </DataTable.Cell>
                                <DataTable.Cell numeric style={styles.ytdColumn}>
                                    <Text variant="bodyMedium" style={styles.amountText}>₹{putCommas(salaryData?.gross_income?.ytd)}</Text>
                                </DataTable.Cell>
                            </DataTable.Row>

                            <Divider style={styles.divider} />

                            {/* Deductions Section */}
                            <DataTable.Row style={styles.categoryRow}>
                                <DataTable.Cell style={styles.itemColumn}>
                                    <View style={styles.categoryContainer}>
                                        <TrendingDown size={16} color={colors.error} />
                                        <Text variant="titleMedium" style={[styles.categoryText, { color: colors.error }]}>Deductions</Text>
                                    </View>
                                </DataTable.Cell>
                                <DataTable.Cell numeric style={styles.monthColumn}></DataTable.Cell>
                                <DataTable.Cell numeric style={styles.ytdColumn}></DataTable.Cell>
                            </DataTable.Row>

                            {salaryData.deductions.map((row, index) => (
                                <DataTable.Row key={`deductions-${index}`} style={styles.dataRow}>
                                    <DataTable.Cell style={styles.itemColumn}>
                                        <View style={styles.itemContainer}>
                                            <Text variant="bodyMedium" style={styles.itemText}>{row?.component_name}</Text>
                                        </View>
                                    </DataTable.Cell>
                                    <DataTable.Cell numeric style={styles.monthColumn}>
                                        <Text variant="bodyMedium" style={styles.amountText}>₹{putCommas(row?.month_data)}</Text>
                                    </DataTable.Cell>
                                    <DataTable.Cell numeric style={styles.ytdColumn}>
                                        <Text variant="bodyMedium" style={styles.amountText}>₹{putCommas(row?.ytd)}</Text>
                                    </DataTable.Cell>
                                </DataTable.Row>
                            ))}

                            <DataTable.Row key={`total-deductions`} style={styles.dataRow}>
                                <DataTable.Cell style={styles.itemColumn}>
                                    <View style={styles.itemContainer}>
                                        <Text variant="bodyMedium" style={styles.itemText}>Total Deductions</Text>
                                    </View>
                                </DataTable.Cell>
                                <DataTable.Cell numeric style={styles.monthColumn}>
                                    <Text variant="bodyMedium" style={styles.amountText}>₹{putCommas(salaryData?.deduction_total?.month_data)}</Text>
                                </DataTable.Cell>
                                <DataTable.Cell numeric style={styles.ytdColumn}>
                                    <Text variant="bodyMedium" style={styles.amountText}>₹{putCommas(salaryData?.deduction_total?.ytd)}</Text>
                                </DataTable.Cell>
                            </DataTable.Row>
                            <Divider style={styles.divider} />

                            {/* Net Salary */}
                            <DataTable.Row style={styles.netSalaryRow}>
                                <DataTable.Cell style={styles.itemColumn}>
                                    <View style={styles.itemContainer}>
                                        <Wallet size={16} color={colors.primary} />
                                        <Text variant="titleMedium" style={styles.netSalaryText}>Net Salary</Text>
                                    </View>
                                </DataTable.Cell>
                                <DataTable.Cell numeric style={styles.monthColumn}>
                                    <Text variant="titleMedium" style={styles.netSalaryAmount}>₹{putCommas(salaryData?.net_salary?.month_data)}</Text>
                                </DataTable.Cell>
                                <DataTable.Cell numeric style={styles.ytdColumn}>
                                    <Text variant="titleMedium" style={styles.netSalaryAmount}>₹{putCommas(salaryData?.net_salary?.ytd)}</Text>
                                </DataTable.Cell>
                            </DataTable.Row>
                        </DataTable>
                    </>
                )}
            </Card.Content>
        </Card>
    );

    const renderPFBreakdown = () => (
        <Card style={styles.tableCard}>
            <Card.Content>
                {pfLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={colors.primary} />
                        <Text variant="bodyMedium" style={styles.loadingText}>Loading PF data...</Text>
                    </View>
                ) : isDataEmpty(pfData) ? (
                    <View style={styles.emptyContainer}>
                        <PiggyBank size={48} color={colors.onSurfaceVariant} />
                        <Text variant="titleLarge" style={styles.emptyTitle}>
                            No PF Data Found
                        </Text>
                        <Text variant="bodyMedium" style={styles.emptySubtitle}>
                            No provident fund information available for {selectedMonth} {financialYear}
                        </Text>
                    </View>
                ) : (
                    <DataTable>
                        <DataTable.Header style={styles.tableHeader}>
                            <DataTable.Title style={styles.itemColumn}>
                                <Text variant="titleMedium" style={styles.headerText}>Item</Text>
                            </DataTable.Title>
                            <DataTable.Title numeric style={styles.monthColumn}>
                                <Text variant="titleMedium" style={styles.headerText}>{months[selectedMonth]} {financialYear}</Text>
                            </DataTable.Title>
                            <DataTable.Title numeric style={styles.ytdColumn}>
                                <Text variant="titleMedium" style={styles.headerText}>YTD</Text>
                            </DataTable.Title>
                        </DataTable.Header>

                        <DataTable.Row style={styles.tableRow}>
                            <DataTable.Cell style={styles.itemColumn}>
                                <Text variant="bodyMedium" style={styles.itemText}>Employee EPF Contribution</Text>
                            </DataTable.Cell>
                            <DataTable.Cell numeric style={styles.monthColumn}>
                                <Text variant="bodyMedium" style={styles.amountText}>₹{putCommas(pfData?.employee_pf?.month_data)}</Text>
                            </DataTable.Cell>
                            <DataTable.Cell numeric style={styles.ytdColumn}>
                                <Text variant="bodyMedium" style={styles.amountText}>₹{putCommas(pfData?.employee_pf?.ytd)}</Text>
                            </DataTable.Cell>
                        </DataTable.Row>

                        <DataTable.Row style={styles.tableRow}>
                            <DataTable.Cell style={styles.itemColumn}>
                                <Text variant="bodyMedium" style={styles.itemText}>Employer EPF Contribution</Text>
                            </DataTable.Cell>
                            <DataTable.Cell numeric style={styles.monthColumn}>
                                <Text variant="bodyMedium" style={styles.amountText}>₹{putCommas(pfData?.employer_pf?.month_data)}</Text>
                            </DataTable.Cell>
                            <DataTable.Cell numeric style={styles.ytdColumn}>
                                <Text variant="bodyMedium" style={styles.amountText}>₹{putCommas(pfData?.employer_pf?.ytd)}</Text>
                            </DataTable.Cell>
                        </DataTable.Row>

                        <DataTable.Row style={[styles.tableRow, styles.totalRow]}>
                            <DataTable.Cell style={styles.itemColumn}>
                                <Text variant="titleMedium" style={styles.totalText}>Total EPF</Text>
                            </DataTable.Cell>
                            <DataTable.Cell numeric style={styles.monthColumn}>
                                <Text variant="titleMedium" style={styles.totalAmountText}>₹{putCommas(pfData?.total_pf?.month_data)}</Text>
                            </DataTable.Cell>
                            <DataTable.Cell numeric style={styles.ytdColumn}>
                                <Text variant="titleMedium" style={styles.totalAmountText}>₹{putCommas(pfData?.total_pf?.ytd)}</Text>
                            </DataTable.Cell>
                        </DataTable.Row>
                    </DataTable>
                )}
            </Card.Content>
        </Card>
    );

    useEffect(() => {
        const getSalaryBreakdown = async () => {
            let url = `/payroll/employee-ytd-details/?month=${monthstoInt[selectedMonth]}&financial_year=${financialYear}`
            const response = await Factory('get', url, {}, {});
            if (response.status_cd === 1) {
                setSalaryData(response.data)
            } else {
                Alert.alert('Denied', response.data.error);
            }
        }

        const getPFBreakdown = async () => {
            setPfLoading(true);
            try {
                let url = `/payroll/pf-breakdown/?month=${monthstoInt[selectedMonth]}&financial_year=${financialYear}`
                const response = await Factory('get', url, {}, {});
                if (response.status_cd === 1) {
                    setPfData(response.data)
                } else {
                    Alert.alert('Denied', response.data.error);
                }
            } catch (error) {
                console.error('Error fetching PF data:', error);
                Alert.alert('Error', 'Failed to fetch PF data');
            } finally {
                setPfLoading(false);
            }
        }

        if (selectedMonth && financialYear) {
            getSalaryBreakdown();
            getPFBreakdown();
        }
    }, [selectedMonth, financialYear]);

    return (
        <>
            <PageHeader />
            <ScrollView
                style={commonStyles.content}
                contentContainerStyle={commonStyles.contentContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                showsVerticalScrollIndicator={false}
            >
                {renderHeader()}
                {renderTabs()}
                {activeTab === 'salary' ? renderSalaryTable() : renderPFBreakdown()}
            </ScrollView>
        </>
    );
}

const getStyles = (colors) =>
    StyleSheet.create({
        header: {
            marginBottom: 20
        },
        headerContent: {
            marginBottom: 16
        },
        title: {
            color: colors.onSurface,
            fontWeight: '600',
            marginBottom: 8
        },
        subtitle: {
            color: colors.onSurfaceVariant,
            lineHeight: 20
        },
        filters: {
            flexDirection: 'row',
            gap: 8,
            alignItems: 'center',
            justifyContent: 'flex-start',
        },
        filterButton: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.surface,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 16,
            gap: 4,
            borderWidth: 1,
            borderColor: colors.outline,
            minWidth: 80,
        },
        filterText: {
            color: colors.onSurface,
            fontWeight: '500',
            fontSize: 12
        },
        summaryContainer: {
            flexDirection: 'row',
            gap: 12,
            marginBottom: 20
        },
        summaryCard: {
            flex: 1,
            borderRadius: 12
        },
        cardContent: {
            padding: 16
        },
        cardHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            marginBottom: 8
        },
        cardTitle: {
            color: colors.onSurface,
            fontWeight: '600'
        },
        cardAmount: {
            color: colors.onSurface,
            fontWeight: '700',
            marginBottom: 4
        },
        cardSubtitle: {
            color: colors.onSurfaceVariant
        },
        tabContainer: {
            flexDirection: 'row',
            backgroundColor: colors.surfaceVariant,
            borderRadius: 8,
            padding: 4,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: colors.outlineLight,
        },
        tab: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 10,
            paddingHorizontal: 12,
            borderRadius: 6,
            gap: 6
        },
        activeTab: {
            backgroundColor: colors.surface
        },
        tabText: {
            color: colors.onSurfaceVariant,
            fontWeight: '500'
        },
        activeTabText: {
            color: colors.primary,
            fontWeight: '600'
        },
        tableCard: {
            marginBottom: 20,
            borderRadius: 12,
            backgroundColor: colors.surface,
            elevation: 3,
            shadowColor: colors.onSurface,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84
        },
        tableContent: {
            padding: 0
        },
        tableHeader: {
            paddingBottom: 8,
            borderBottomWidth: 1,
            borderBottomColor: colors.outlineLight,
        },
        tableTitle: {
            color: colors.onSurface,
            fontWeight: '600',
            marginBottom: 4
        },
        tableSubtitle: {
            color: colors.onSurfaceVariant
        },
        tableHeaderRow: {
            paddingHorizontal: 12
        },
        headerText: {
            color: colors.onSurface,
            fontWeight: '600'
        },
        itemColumn: {
            flex: 2
        },
        monthColumn: {
            flex: 1
        },
        ytdColumn: {
            flex: 1
        },
        categoryRow: {
            paddingHorizontal: 12
        },
        categoryContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8
        },
        categoryText: {
            color: colors.primary,
            fontWeight: '600'
        },
        dataRow: {
            borderBottomWidth: 0.5,
            paddingHorizontal: 12
        },
        itemContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8
        },
        itemText: {
            color: colors.onSurface,
            flex: 1
        },
        amountText: {
            color: colors.onSurface,
            fontWeight: '500'
        },
        divider: {
            marginVertical: 4,
            backgroundColor: colors.outlineLight
        },
        netSalaryRow: {
            paddingHorizontal: 12
        },
        netSalaryText: {
            color: colors.primary,
            fontWeight: '600'
        },
        netSalaryAmount: {
            color: colors.primary,
            fontWeight: '600'
        },
        pfPlaceholder: {
            padding: 32,
            alignItems: 'center'
        },
        placeholderText: {
            marginTop: 12,
            marginBottom: 8,
            fontWeight: '600'
        },
        placeholderSubtext: {
            textAlign: 'center',
            marginBottom: 20
        },
        placeholderButton: {
            borderRadius: 8
        },
        tableRow: {
            paddingHorizontal: 12,
            borderBottomWidth: 0.5,
            borderBottomColor: colors.outlineLight
        },
        totalRow: {
            borderBottomWidth: 0,
            paddingBottom: 0
        },
        totalText: {
            color: colors.onSurface,
            fontWeight: '600'
        },
        totalAmountText: {
            color: colors.primary,
            fontWeight: '600'
        },
        menuContent: {
            backgroundColor: 'white',
            borderRadius: 6,
            padding: 4,
            marginTop: 4,
            minWidth: 100,
        },
        menuItem: {
            paddingVertical: 6,
            paddingHorizontal: 8,
            borderRadius: 4,
        },
        menuItemText: {
            color: colors.onSurface,
            fontWeight: '400',
            fontSize: 12,
        },
        loadingContainer: {
            padding: 20,
            alignItems: 'center',
            gap: 12
        },
        loadingText: {
            color: colors.onSurfaceVariant,
            fontSize: 14
        },
        emptyContainer: {
            padding: 32,
            alignItems: 'center',
            justifyContent: 'center'
        },
        emptyTitle: {
            marginTop: 12,
            marginBottom: 8,
            fontWeight: '600'
        },
        emptySubtitle: {
            textAlign: 'center',
            marginBottom: 20
        }
    });
