import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import {
  Text,
  useTheme,
  Card,
  DataTable,
  Button,
  IconButton,
} from 'react-native-paper';
import {
  Download,
  CheckCircle,
  TrendingUp,
  FileText,
  FileDown,
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function TaxTDSScreen() {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const [selectedMonth, setSelectedMonth] = useState(null);

  // Sample data based on the image
  const summaryData = {
    totalTDS: 64800,
    taxRegime: 'New Regime',
  };

  const monthlyData = [
    {
      month: 'April 2024',
      tdsDeducted: 5400,
      grossIncome: 60000,
      netSalary: 52000,
      notes: '',
    },
    {
      month: 'May 2024',
      tdsDeducted: 5400,
      grossIncome: 60000,
      netSalary: 52000,
      notes: '',
    },
    {
      month: 'June 2024',
      tdsDeducted: 7200,
      grossIncome: 60000,
      netSalary: null,
      notes: 'Bonus included',
    },
  ];

  const chartData = [
    { month: 'Apr 2024', value: 5400 },
    { month: 'May 2024', value: 5400 },
    { month: 'Jul 2024', value: 7200 },
    { month: 'Jul 2024', value: 4800 },
  ];

  const maxTDSValue = Math.max(...chartData.map(item => item.value));

  const handleDownloadCSV = () => {
    Alert.alert('Download', 'TDS Summary CSV download started');
  };

  const handleDownloadPDF = () => {
    Alert.alert('Download', 'PDF for Form 12BA download started');
  };

  const formatCurrency = (amount) => {
    return `₹ ${amount.toLocaleString('en-IN')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>
            Tax & TDS Information
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Know how much tax you've paid, why, and what's ahead.
          </Text>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <Card style={styles.summaryCard}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Text variant="titleSmall" style={styles.cardTitle}>
                  Total TDS Deducted (YTD)
                </Text>
                <TrendingUp size={20} color={colors.primary} />
              </View>
              <Text variant="headlineMedium" style={styles.cardAmount}>
                {formatCurrency(summaryData.totalTDS)}
              </Text>
            </Card.Content>
          </Card>

          <Card style={styles.summaryCard}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Text variant="titleSmall" style={styles.cardTitle}>
                  Tax Regime
                </Text>
                <CheckCircle size={20} color={colors.primary} />
              </View>
              <Text variant="headlineSmall" style={styles.cardValue}>
                {summaryData.taxRegime}
              </Text>
            </Card.Content>
          </Card>
        </View>

        {/* Monthly Data Table */}
        <Card style={styles.tableCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.tableTitle}>
              Monthly Breakdown
            </Text>
            <DataTable>
              <DataTable.Header style={styles.tableHeader}>
                <DataTable.Title style={styles.monthColumn}>
                  <Text variant="labelMedium" style={styles.headerText}>Month</Text>
                </DataTable.Title>
                <DataTable.Title numeric style={styles.numericColumn}>
                  <Text variant="labelMedium" style={styles.headerText}>TDS</Text>
                </DataTable.Title>
                <DataTable.Title numeric style={styles.numericColumn}>
                  <Text variant="labelMedium" style={styles.headerText}>Gross</Text>
                </DataTable.Title>
                <DataTable.Title numeric style={styles.numericColumn}>
                  <Text variant="labelMedium" style={styles.headerText}>Net</Text>
                </DataTable.Title>
              </DataTable.Header>

              {monthlyData.map((row, index) => (
                <DataTable.Row key={index} style={styles.tableRow}>
                  <DataTable.Cell style={styles.monthColumn}>
                    <View>
                      <Text variant="bodyMedium" style={styles.monthText}>
                        {row.month}
                      </Text>
                      {row.notes && (
                        <Text variant="labelSmall" style={styles.notesText}>
                          {row.notes}
                        </Text>
                      )}
                    </View>
                  </DataTable.Cell>
                  <DataTable.Cell numeric style={styles.numericColumn}>
                    <Text variant="bodyMedium" style={styles.numericText}>
                      {formatCurrency(row.tdsDeducted)}
                    </Text>
                  </DataTable.Cell>
                  <DataTable.Cell numeric style={styles.numericColumn}>
                    <Text variant="bodyMedium" style={styles.numericText}>
                      {formatCurrency(row.grossIncome)}
                    </Text>
                  </DataTable.Cell>
                  <DataTable.Cell numeric style={styles.numericColumn}>
                    <Text variant="bodyMedium" style={styles.numericText}>
                      {row.netSalary ? formatCurrency(row.netSalary) : '-'}
                    </Text>
                  </DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>
          </Card.Content>
        </Card>

        {/* Bar Chart */}
        <Card style={styles.chartCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.chartTitle}>
              TDS Deducted
            </Text>
            <View style={styles.chartContainer}>
              {chartData.map((item, index) => (
                <View key={index} style={styles.barContainer}>
                  <View style={styles.barWrapper}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: (item.value / maxTDSValue) * 120,
                          backgroundColor: colors.primary,
                        },
                      ]}
                    />
                  </View>
                  <Text variant="labelSmall" style={styles.barLabel}>
                    {item.month}
                  </Text>
                  <Text variant="labelSmall" style={styles.barValue}>
                    {formatCurrency(item.value)}
                  </Text>
                </View>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Download Options */}
        <View style={styles.downloadContainer}>
          <Button
            mode="outlined"
            onPress={handleDownloadCSV}
            style={styles.downloadButton}
            icon={({ size, color }) => <FileDown size={size} color={color} />}
          >
            Download TDS Summary (CSV)
          </Button>
          
          <Button
            mode="outlined"
            onPress={handleDownloadPDF}
            style={styles.downloadButton}
            icon={({ size, color }) => <FileText size={size} color={color} />}
          >
            Download PDF for Form 12BA
          </Button>
        </View>

        {/* Footer Info */}
        <View style={styles.footer}>
          <Text variant="bodySmall" style={styles.footerText}>
            Tax deduction based on your monthly earnings, standard exemptions (₹ 75,000), and your selected regime.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollView: {
      flex: 1,
    },
    header: {
      padding: 20,
      paddingBottom: 16,
    },
    title: {
      color: colors.onSurface,
      fontWeight: '600',
      marginBottom: 8,
    },
    subtitle: {
      color: colors.onSurfaceVariant,
      lineHeight: 20,
    },
    summaryContainer: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      gap: 12,
      marginBottom: 20,
    },
    summaryCard: {
      flex: 1,
      elevation: 2,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    cardContent: {
      padding: 16,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    cardTitle: {
      color: colors.onSurfaceVariant,
      flex: 1,
    },
    cardAmount: {
      color: colors.onSurface,
      fontWeight: '600',
    },
    cardValue: {
      color: colors.onSurface,
      fontWeight: '500',
    },
    tableCard: {
      marginHorizontal: 20,
      marginBottom: 20,
      elevation: 2,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    tableTitle: {
      color: colors.onSurface,
      fontWeight: '600',
      marginBottom: 16,
    },
    tableHeader: {
      backgroundColor: colors.surfaceVariant,
      borderRadius: 8,
      marginBottom: 8,
    },
    headerText: {
      color: colors.onSurface,
      fontWeight: '600',
    },
    tableRow: {
      borderBottomWidth: 1,
      borderBottomColor: colors.outline,
    },
    monthColumn: {
      flex: 2,
    },
    numericColumn: {
      flex: 1,
    },
    monthText: {
      color: colors.onSurface,
      fontWeight: '500',
    },
    notesText: {
      color: colors.primary,
      fontStyle: 'italic',
      marginTop: 2,
    },
    numericText: {
      color: colors.onSurface,
    },
    chartCard: {
      marginHorizontal: 20,
      marginBottom: 20,
      elevation: 2,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    chartTitle: {
      color: colors.onSurface,
      fontWeight: '600',
      marginBottom: 16,
    },
    chartContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'flex-end',
      height: 160,
      paddingHorizontal: 20,
    },
    barContainer: {
      alignItems: 'center',
      flex: 1,
    },
    barWrapper: {
      height: 120,
      justifyContent: 'flex-end',
      marginBottom: 8,
    },
    bar: {
      width: 20,
      borderRadius: 2,
      minHeight: 4,
    },
    barLabel: {
      color: colors.onSurfaceVariant,
      textAlign: 'center',
      marginBottom: 4,
    },
    barValue: {
      color: colors.onSurface,
      fontWeight: '500',
      textAlign: 'center',
    },
    downloadContainer: {
      paddingHorizontal: 20,
      gap: 12,
      marginBottom: 20,
    },
    downloadButton: {
      borderColor: colors.primary,
    },
    footer: {
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    footerText: {
      color: colors.onSurfaceVariant,
      textAlign: 'center',
      lineHeight: 18,
    },
  });
