import React, { useState, useEffect } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Dimensions,
    Animated,
    PermissionsAndroid,
    Platform,
    Linking
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
import axios from 'axios';
import { Download, Eye, ChevronDown, Calendar, FileText, TrendingUp, TrendingDown, FileX, Search } from 'lucide-react-native';
import { getCommonStyles } from '../../constants/commonStyles';
import { useNavigation } from '@react-navigation/native';
import PageHeader from '../../components/PageHeader';
import Factory from '../../utils/Factory';
import { monthstoInt, intToMonths } from '../../utils/constants';
import RNFS from 'react-native-fs';
import { Buffer } from 'buffer';
import { API_URL } from "@env";

const checkStoragePermission = async () => {
    if (Platform.OS === 'android') {
        try {
            const apiLevel = Platform.Version || 0;
            
            if (apiLevel >= 33) {
                const hasImages = await PermissionsAndroid.check(
                    PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
                );
                const hasVideo = await PermissionsAndroid.check(
                    PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO
                );
                const hasAudio = await PermissionsAndroid.check(
                    PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO
                );
                
                if (hasImages && hasVideo && hasAudio) {
                    try {
                        const downloadPath = RNFS.DownloadDirectoryPath;
                        const testFile = `${downloadPath}/test_permission.tmp`;
                        await RNFS.writeFile(testFile, 'test', 'utf8');
                        await RNFS.unlink(testFile);
                        return true;
                    } catch (error) {
                        return false;
                    }
                }
                return false;
            } else if (apiLevel >= 30) {
                const hasWrite = await PermissionsAndroid.check(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
                );
                
                if (hasWrite) {
                    try {
                        const downloadPath = RNFS.DownloadDirectoryPath;
                        const testFile = `${downloadPath}/test_permission.tmp`;
                        await RNFS.writeFile(testFile, 'test', 'utf8');
                        await RNFS.unlink(testFile);
                        return true;
                    } catch (error) {
                        return false;
                    }
                }
                return false;
            } else {
                const granted = await PermissionsAndroid.check(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
                );
                return granted;
            }
        } catch (error) {
            return false;
        }
    }
    return true;
};

const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
        try {
            const apiLevel = Platform.Version || 0;
            
            if (apiLevel >= 33) {
                const permissions = [
                    PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
                    PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
                    PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
                ];
                
                const granted = await PermissionsAndroid.requestMultiple(permissions);
                const allGranted = Object.values(granted).every(
                    permission => permission === PermissionsAndroid.RESULTS.GRANTED
                );
                
                if (allGranted) {
                    try {
                        const downloadPath = RNFS.DownloadDirectoryPath;
                        const testFile = `${downloadPath}/test_permission.tmp`;
                        await RNFS.writeFile(testFile, 'test', 'utf8');
                        await RNFS.unlink(testFile);
                        return true;
                    } catch (error) {
                        Alert.alert(
                            'Storage Access Required',
                            'Please grant "Files and media" permission in your phone settings to download files.',
                            [
                                { text: 'Cancel', style: 'cancel' },
                                { 
                                    text: 'Open Settings', 
                                    onPress: async () => {
                                        try {
                                            await Linking.openSettings();
                                        } catch (error) {
                                            console.error('Error opening settings:', error);
                                        }
                                    }
                                }
                            ]
                        );
                        return false;
                    }
                }
                return false;
            } else if (apiLevel >= 30) {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'Storage Permission',
                        message: 'This app needs access to storage to download payslips.',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    }
                );
                
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    try {
                        const downloadPath = RNFS.DownloadDirectoryPath;
                        const testFile = `${downloadPath}/test_permission.tmp`;
                        await RNFS.writeFile(testFile, 'test', 'utf8');
                        await RNFS.unlink(testFile);
                        return true;
                    } catch (error) {
                        Alert.alert(
                            'Storage Access Required',
                            'Please grant "Files and media" permission in your phone settings.',
                            [
                                { text: 'Cancel', style: 'cancel' },
                                { 
                                    text: 'Open Settings', 
                                    onPress: async () => {
                                        try {
                                            await Linking.openSettings();
                                        } catch (error) {
                                            console.error('Error opening settings:', error);
                                        }
                                    }
                                }
                            ]
                        );
                        return false;
                    }
                }
                return false;
            } else {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'Storage Permission',
                        message: 'This app needs access to storage to download payslips.',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    }
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            }
        } catch (err) {
            return false;
        }
    }
    return true;
};

export const downloadPayslip = async (employeeId, month, financial_year, month_year) => {
    const year = month_year.split(' ')[1]
    
    try {
        const hasPermission = await requestStoragePermission();
        if (!hasPermission) {
            Alert.alert('Permission Denied', 'Storage permission is required to download payslips.');
            return;
        }

        Alert.alert('Downloading...', 'Please wait while we download your payslip.');

        const response = await axios.get(
            `${API_URL}/payroll/employee-monthly-salary-template?employee_id=${employeeId}&month=${month}&financial_year=${financial_year}&year=${year}`,
            {
                responseType: 'arraybuffer',
                timeout: 30000
            }
        );
        
        if (response.data && response.data.byteLength > 0) {
            const fileName = `Payslip_${month_year.replace(' ', '_')}.pdf`;
            
            let downloadPath, filePath, fileWritten = false;
            
            if (Platform.OS === 'android') {
                const possiblePaths = [
                    RNFS.DownloadDirectoryPath,
                    RNFS.ExternalDirectoryPath + '/Download',
                    RNFS.ExternalDirectoryPath + '/Downloads',
                    RNFS.DocumentDirectoryPath,
                    RNFS.ExternalCachesDirectoryPath
                ];
                
                for (const path of possiblePaths) {
                    try {
                        const dirExists = await RNFS.exists(path);
                        if (!dirExists) {
                            await RNFS.mkdir(path);
                        }
                        
                        const testFile = `${path}/test_write.tmp`;
                        await RNFS.writeFile(testFile, 'test', 'utf8');
                        await RNFS.unlink(testFile);
                        
                        downloadPath = path;
                        filePath = `${path}/${fileName}`;
                        fileWritten = true;
                        break;
                        
                    } catch (error) {
                        continue;
                    }
                }
                
                if (!fileWritten) {
                    throw new Error('Could not find a writable download location');
                }
            } else {
                downloadPath = RNFS.DocumentDirectoryPath;
                filePath = `${downloadPath}/${fileName}`;
            }

            const exists = await RNFS.exists(filePath);
            if (exists) {
                await RNFS.unlink(filePath);
            }

            const base64Data = Buffer.from(response.data).toString('base64');
            await RNFS.writeFile(filePath, base64Data, 'base64');

            const fileExists = await RNFS.exists(filePath);
            if (fileExists) {
                const stats = await RNFS.stat(filePath);
                
                if (Platform.OS === 'android') {
                    try {
                        await RNFS.scanFile(filePath);
                    } catch (scanError) {
                        // Non-critical error
                    }
                }
                
                Alert.alert(
                    'Download Complete!',
                    `Payslip saved successfully!\n\nFile: ${fileName}\nLocation: ${downloadPath}\nSize: ${(stats.size / 1024).toFixed(1)} KB\n\nCheck your file manager in the Downloads folder.`,
                    [
                        { text: 'OK', onPress: () => console.log('Download completed') }
                    ]
                );
            } else {
                throw new Error('File was not written successfully');
            }
        } else {
            Alert.alert('Download Failed', 'Empty PDF received from server. Please try again.');
        }
    } catch (error) {
        console.error('Error downloading payslip:', error);
        
        let errorMessage = 'Failed to download payslip. Please try again.';
        if (error.code === 'ECONNABORTED') {
            errorMessage = 'Download timed out. Please check your internet connection and try again.';
        } else if (error.response) {
            errorMessage = `Server error: ${error.response.status}. Please try again later.`;
        } else if (error.request) {
            errorMessage = 'Network error. Please check your internet connection and try again.';
        } else if (error.message.includes('File was not written')) {
            errorMessage = 'File could not be saved. Please check storage permissions.';
        } else if (error.message.includes('Could not find a writable download location')) {
            errorMessage = 'Could not find a writable download location. Please check storage permissions.';
        }
        
        Alert.alert('Download Failed', errorMessage);
    }
}

export default function PayslipsScreen() {
    const { colors } = useTheme();
    const styles = getStyles(colors);
    const commonStyles = getCommonStyles(colors);
    const navigation = useNavigation();

    const [selectedYear, setSelectedYear] = useState('2025-2026');
    const [yearMenuVisible, setYearMenuVisible] = useState(false);
    const [payslipsData, setPayslipsData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasStoragePermission, setHasStoragePermission] = useState(true);
    const spinValue = new Animated.Value(0);

    const financialYears = ['2025-2026', '2024-2025', '2023-2024', '2022-2023'];

    // Check storage permission on component mount and when app comes to foreground
    useEffect(() => {
        // Only check permission once on mount, not on every focus
        checkStoragePermissionOnMount();
    }, []);

    const checkStoragePermissionOnMount = async () => {
        const permission = await checkStoragePermission();
        setHasStoragePermission(permission);
    };

    const handleYearSelect = (year) => {
        setSelectedYear(year);
        setYearMenuVisible(false);
    };

    const handleViewPayslip = (payslip) => {
        navigation.navigate('PayslipView', { payslip });
    };

    const handleDownloadPayslip = async (payslip) => {
        try {
            const hasPermission = await requestStoragePermission();
            if (!hasPermission) {
                Alert.alert('Permission Denied', 'Storage permission is required to download payslips.');
                return;
            }

            Alert.alert(
                'Download Payslip',
                `Downloading payslip for ${payslip.month_year}`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Download', onPress: () => downloadPayslip(payslip.employee, payslip.month, payslip.financial_year, payslip.month_year) }
                ]
            );
        } catch (error) {
            console.error('Permission request error:', error);
            Alert.alert('Error', 'Failed to request storage permission.');
        }
    };

    const getFilteredPayslips = () => {
        if (!payslipsData || payslipsData.length === 0) return [];
        return payslipsData.filter(payslip => {
            const payslipYear = payslip.month_year ? payslip.month_year.split(' ')[1] : '';
            return selectedYear.includes(payslipYear);
        });
    };

    const filteredPayslips = getFilteredPayslips();

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

                <View style={styles.payslipsContainer}>
                    {isLoading ? (
                        <LoadingState />
                    ) : filteredPayslips.length === 0 ? (
                        <EmptyState />
                    ) : (
                        filteredPayslips.map((payslip) => (
                            <View key={payslip.id} style={styles.payslipCard}>
                                <View style={styles.cardContent}>
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
                                                style={[
                                                    styles.downloadButton,
                                                    !hasStoragePermission && styles.disabledButton
                                                ]}
                                                labelStyle={styles.buttonLabel}
                                                disabled={!hasStoragePermission}
                                            >
                                                {hasStoragePermission ? 'Download' : 'Permission Required'}
                                            </Button>
                                        </View>
                                    </View>

                                    <Divider style={styles.divider} />

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
                    
                    {!hasStoragePermission && (
                        <View style={styles.permissionSection}>
                            <Text variant="bodyMedium" style={styles.permissionText}>
                                Storage permission is required to download payslips
                            </Text>
                            <Text variant="bodySmall" style={styles.permissionSubText}>
                                Android API {Platform.Version || 'Unknown'} - {Platform.Version >= 33 ? 'Media permissions needed' : Platform.Version >= 30 ? 'Storage permission needed' : 'External storage permission needed'}
                            </Text>
                            <Button
                                mode="contained"
                                onPress={async () => {
                                    const permission = await requestStoragePermission();
                                    if (permission) {
                                        setHasStoragePermission(true);
                                    }
                                }}
                                style={styles.permissionButton}
                            >
                                Grant Permission
                            </Button>
                            <Button
                                mode="outlined"
                                onPress={async () => {
                                    try {
                                        await Linking.openSettings();
                                    } catch (error) {
                                        console.error('Error opening settings:', error);
                                    }
                                }}
                                style={styles.settingsButton}
                            >
                                Open Phone Settings
                            </Button>
                        </View>
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
    disabledButton: {
        opacity: 0.6,
        backgroundColor: colors.outline,
    },
    permissionSection: {
        alignItems: 'center',
        padding: 20,
        marginTop: 20,
        backgroundColor: colors.surfaceVariant,
        borderRadius: 12,
        marginHorizontal: 16,
    },
    permissionText: {
        color: colors.onSurfaceVariant,
        textAlign: 'center',
        marginBottom: 16,
        lineHeight: 20,
    },
    permissionButton: {
        borderRadius: 8,
        paddingHorizontal: 20,
        marginBottom: 8,
    },
    permissionSubText: {
        color: colors.onSurfaceVariant,
        textAlign: 'center',
        marginBottom: 16,
        opacity: 0.8,
        fontSize: 12,
    },
    settingsButton: {
        borderRadius: 8,
        paddingHorizontal: 20,
    },
});
