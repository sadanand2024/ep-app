import React, { useState, useContext, useEffect } from "react";
import {
    View,
    StyleSheet,
    ScrollView,
    RefreshControl,
    TouchableOpacity,
    Dimensions
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
import { monthsObj, financialYears } from "../utils/constants";

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
    const [selectedMonth, setSelectedMonth] = useState('August');
    const [yearMenuVisible, setYearMenuVisible] = useState(false);
    const [monthMenuVisible, setMonthMenuVisible] = useState(false);

    // Sample data based on the image
    const salaryData = {
        earnings: [
            { item: 'Basic Salary', august: '₹0', ytd: '₹6,15,323', icon: DollarSign, color: '#4CAF50' },
            { item: 'Hra (House Rent Allowance)', august: '₹0', ytd: '₹3,07,661', icon: Home, color: '#2196F3' },
            { item: 'Children Education Allowance', august: '₹0', ytd: '₹52,742', icon: GraduationCap, color: '#FF9800' },
            { item: 'Gross (Total Earnings)', august: '₹0', ytd: '₹12,24,316', icon: TrendingUp, color: '#4CAF50' }
        ],
        deductions: [
            { item: 'Epf (Employee Provident Fund)', august: '₹0', ytd: '₹7,200', icon: PiggyBank, color: '#9C27B0' },
            { item: 'Pt (Professional Tax)', august: '₹0', ytd: '₹800', icon: CreditCard, color: '#F44336' },
            { item: 'Tds (Tax Deducted at Source)', august: '₹0', ytd: '₹2,64,322', icon: TrendingDown, color: '#FF5722' },
            { item: 'Total Deductions', august: '₹0', ytd: '₹2,73,377', icon: TrendingDown, color: '#F44336' }
        ],
        netSalary: { item: 'Net Salary', august: '₹0', ytd: '₹9,50,939', icon: Wallet, color: '#4CAF50' }
    };

    const months = Object.values(monthsObj);

    const onRefresh = async () => {
        setRefreshing(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
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
                                    <Text variant="bodyMedium" style={styles.itemText}>{row.item}</Text>
                                </View>
                            </DataTable.Cell>
                            <DataTable.Cell numeric style={styles.monthColumn}>
                                <Text variant="bodyMedium" style={styles.amountText}>{row.august}</Text>
                            </DataTable.Cell>
                            <DataTable.Cell numeric style={styles.ytdColumn}>
                                <Text variant="bodyMedium" style={styles.amountText}>{row.ytd}</Text>
                            </DataTable.Cell>
                        </DataTable.Row>
                    ))}

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
                                    <Text variant="bodyMedium" style={styles.itemText}>{row.item}</Text>
                                </View>
                            </DataTable.Cell>
                            <DataTable.Cell numeric style={styles.monthColumn}>
                                <Text variant="bodyMedium" style={styles.amountText}>{row.august}</Text>
                            </DataTable.Cell>
                            <DataTable.Cell numeric style={styles.ytdColumn}>
                                <Text variant="bodyMedium" style={styles.amountText}>{row.ytd}</Text>
                            </DataTable.Cell>
                        </DataTable.Row>
                    ))}

                    <Divider style={styles.divider} />

                    {/* Net Salary */}
                    <DataTable.Row style={styles.netSalaryRow}>
                        <DataTable.Cell style={styles.itemColumn}>
                            <View style={styles.itemContainer}>
                                <Wallet size={16} color={colors.primary} />
                                <Text variant="titleMedium" style={styles.netSalaryText}>{salaryData.netSalary.item}</Text>
                            </View>
                        </DataTable.Cell>
                        <DataTable.Cell numeric style={styles.monthColumn}>
                            <Text variant="titleMedium" style={styles.netSalaryAmount}>{salaryData.netSalary.august}</Text>
                        </DataTable.Cell>
                        <DataTable.Cell numeric style={styles.ytdColumn}>
                            <Text variant="titleMedium" style={styles.netSalaryAmount}>{salaryData.netSalary.ytd}</Text>
                        </DataTable.Cell>
                    </DataTable.Row>
                </DataTable>
            </Card.Content>
        </Card>
    );

    const renderPFBreakdown = () => (
        <Card style={styles.tableCard}>
            <Card.Content style={styles.pfPlaceholder}>
                <PiggyBank size={48} color={colors.onSurfaceVariant} />
                <Text variant="titleLarge" style={styles.placeholderText}>
                    PF Breakdown
                </Text>
                <Text variant="bodyMedium" style={styles.placeholderSubtext}>
                    PF details will be displayed here
                </Text>
                <Button
                    mode="outlined"
                    onPress={() => { }}
                    style={styles.placeholderButton}
                    icon={Download}
                >
                    Download PF Statement
                </Button>
            </Card.Content>
        </Card>
    );

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
            backgroundColor: colors.outline
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
    });
