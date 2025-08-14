import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Alert,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import {
    Text,
    useTheme,
    Card,
    TextInput,
    Button,
    IconButton,
    Divider
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getCommonStyles } from '../../constants/commonStyles';
import { ArrowLeft, Eye, EyeOff, Lock, Shield, CheckCircle, AlertCircle } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import PageHeader from '../../components/PageHeader';

export default function ChangePasswordScreen() {
    const { colors } = useTheme();
    const styles = getStyles(colors);
    const commonStyles = getCommonStyles(colors);
    const navigation = useNavigation();

    // State management
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Password validation states
    const [passwordStrength, setPasswordStrength] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
    });

    // Validate password strength
    const validatePassword = (password) => {
        setPasswordStrength({
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        });
    };

    // Check if all validations pass
    const isPasswordValid = () => {
        return Object.values(passwordStrength).every(Boolean);
    };

    // Check if form is valid
    const isFormValid = () => {
        return currentPassword.length > 0 &&
            newPassword.length > 0 &&
            confirmPassword.length > 0 &&
            newPassword === confirmPassword &&
            isPasswordValid();
    };

    // Handle password change
    const handlePasswordChange = (password) => {
        setNewPassword(password);
        validatePassword(password);
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!isFormValid()) {
            Alert.alert('Validation Error', 'Please fill all fields correctly and ensure passwords match.');
            return;
        }

        if (currentPassword === newPassword) {
            Alert.alert('Error', 'New password must be different from current password.');
            return;
        }

        setIsLoading(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            Alert.alert(
                'Success!',
                'Your password has been changed successfully.',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            // Reset form
                            setCurrentPassword('');
                            setNewPassword('');
                            setConfirmPassword('');
                            setPasswordStrength({
                                length: false,
                                uppercase: false,
                                lowercase: false,
                                number: false,
                                special: false
                            });
                            // Navigate back
                            navigation.goBack();
                        }
                    }
                ]
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to change password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Password strength indicator
    const getPasswordStrengthColor = () => {
        const validCount = Object.values(passwordStrength).filter(Boolean).length;
        if (validCount <= 2) return colors.error;
        if (validCount <= 3) return colors.warning;
        if (validCount <= 4) return colors.primary;
        return colors.success;
    };

    const getPasswordStrengthText = () => {
        const validCount = Object.values(passwordStrength).filter(Boolean).length;
        if (validCount <= 2) return 'Weak ';
        if (validCount <= 3) return 'Fair';
        if (validCount <= 4) return 'Good';
        return 'Strong';
    };

    return (
        <>
            <PageHeader back={true} />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    style={commonStyles.content}
                    contentContainerStyle={commonStyles.contentContainer}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Enhanced Info Card */}
                    <Card style={styles.infoCard} mode="outlined">
                        <Card.Content style={styles.infoCardContent}>
                            <View style={styles.infoIconContainer}>
                                <Shield size={28} color={colors.primary} />
                            </View>
                            <View style={styles.infoTextContainer}>
                                <Text variant="titleMedium" style={styles.infoTitle}>
                                    Password Security
                                </Text>
                                <Text variant="bodyMedium" style={styles.infoText}>
                                    Create a strong password that's different from your current one.
                                    This helps keep your account secure and protected.
                                </Text>
                            </View>
                        </Card.Content>
                    </Card>

                    {/* Enhanced Password Form */}
                    <Card style={styles.formCard} mode="outlined">
                        <Card.Content style={styles.formCardContent}>
                            <View style={styles.formHeader}>
                                <Lock size={20} color={colors.primary} />
                                <Text variant="titleMedium" style={styles.formTitle}>
                                    Password Details
                                </Text>
                            </View>

                            {/* Current Password */}
                            <View style={styles.inputContainer}>
                                <Text variant="bodyMedium" style={styles.inputLabel}>
                                    Current Password
                                </Text>
                                <TextInput
                                    mode="outlined"
                                    value={currentPassword}
                                    onChangeText={setCurrentPassword}
                                    secureTextEntry={!showCurrentPassword}
                                    placeholder="Enter your current password"
                                    left={<TextInput.Icon icon={Lock} iconColor={colors.primary} />}
                                    right={
                                        <TextInput.Icon
                                            icon={showCurrentPassword ? EyeOff : Eye}
                                            iconColor={colors.onSurfaceVariant}
                                            onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                                        />
                                    }
                                    style={styles.textInput}
                                    outlineStyle={styles.inputOutline}
                                />
                            </View>

                            <Divider style={styles.divider} />

                            {/* New Password */}
                            <View style={styles.inputContainer}>
                                <Text variant="bodyMedium" style={styles.inputLabel}>
                                    New Password
                                </Text>
                                <TextInput
                                    mode="outlined"
                                    value={newPassword}
                                    onChangeText={handlePasswordChange}
                                    secureTextEntry={!showNewPassword}
                                    placeholder="Enter your new password"
                                    left={<TextInput.Icon icon={Lock} iconColor={colors.primary} />}
                                    right={
                                        <TextInput.Icon
                                            icon={showNewPassword ? EyeOff : Eye}
                                            iconColor={colors.onSurfaceVariant}
                                            onPress={() => setShowNewPassword(!showNewPassword)}
                                        />
                                    }
                                    style={styles.textInput}
                                    outlineStyle={styles.inputOutline}
                                />
                            </View>

                            {/* Enhanced Password Strength Indicator */}
                            {newPassword.length > 0 && (
                                <View style={styles.strengthContainer}>
                                    <View style={styles.strengthHeader}>
                                        <Text variant="bodyMedium" style={styles.strengthLabel}>
                                            Password Strength
                                        </Text>
                                        <View style={[styles.strengthBadge]}>
                                            <Text
                                                variant="bodySmall"
                                                style={[styles.strengthText, { color: getPasswordStrengthColor() }]}
                                            >
                                                {getPasswordStrengthText()}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.strengthBarContainer}>
                                        <View style={styles.strengthBar}>
                                            <View
                                                style={[
                                                    styles.strengthProgress,
                                                    {
                                                        width: `${(Object.values(passwordStrength).filter(Boolean).length / 5) * 100}%`,
                                                        backgroundColor: getPasswordStrengthColor()
                                                    }
                                                ]}
                                            />
                                        </View>
                                        <Text variant="bodySmall" style={styles.strengthPercentage}>
                                            {Math.round((Object.values(passwordStrength).filter(Boolean).length / 5) * 100)}%
                                        </Text>
                                    </View>

                                    {/* Enhanced Password Requirements */}
                                    <View style={styles.requirementsContainer}>
                                        <Text variant="bodyMedium" style={styles.requirementsTitle}>
                                            Requirements
                                        </Text>
                                        <View style={styles.requirementsGrid}>
                                            <View style={styles.requirementItem}>
                                                <View style={[
                                                    styles.requirementIcon,
                                                ]}>
                                                    <CheckCircle
                                                        size={16}
                                                        color={passwordStrength.length ? colors.success : colors.textLight}
                                                    />
                                                </View>
                                                <Text variant="bodySmall" style={styles.requirementText}>
                                                    8+ characters
                                                </Text>
                                            </View>
                                            <View style={styles.requirementItem}>
                                                <View style={[
                                                    styles.requirementIcon,
                                                ]}>
                                                    <CheckCircle
                                                        size={16}
                                                        color={passwordStrength.uppercase ? colors.success : colors.textLight}
                                                    />
                                                </View>
                                                <Text variant="bodySmall" style={styles.requirementText}>
                                                    Uppercase
                                                </Text>
                                            </View>
                                            <View style={styles.requirementItem}>
                                                <View style={[
                                                    styles.requirementIcon,
                                                ]}>
                                                    <CheckCircle
                                                        size={16}
                                                        color={passwordStrength.lowercase ? colors.success : colors.textLight}
                                                    />
                                                </View>
                                                <Text variant="bodySmall" style={styles.requirementText}>
                                                    Lowercase
                                                </Text>
                                            </View>
                                            <View style={styles.requirementItem}>
                                                <View style={[
                                                    styles.requirementIcon,
                                                ]}>
                                                    <CheckCircle
                                                        size={16}
                                                        color={passwordStrength.number ? colors.success : colors.textLight}
                                                    />
                                                </View>
                                                <Text variant="bodySmall" style={styles.requirementText}>
                                                    Number
                                                </Text>
                                            </View>
                                            <View style={styles.requirementItem}>
                                                <View style={[
                                                    styles.requirementIcon,
                                                ]}>
                                                    <CheckCircle
                                                        size={16}
                                                        color={passwordStrength.special ? colors.success : colors.textLight}
                                                    />
                                                </View>
                                                <Text variant="bodySmall" style={styles.requirementText}>
                                                    Special char
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )}

                            <Divider style={styles.divider} />

                            {/* Confirm Password */}
                            <View style={styles.inputContainer}>
                                <Text variant="bodyMedium" style={styles.inputLabel}>
                                    Confirm New Password
                                </Text>
                                <TextInput
                                    mode="outlined"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry={!showConfirmPassword}
                                    placeholder="Confirm your new password"
                                    left={<TextInput.Icon icon={Lock} iconColor={colors.primary} />}
                                    right={
                                        <TextInput.Icon
                                            icon={showConfirmPassword ? EyeOff : Eye}
                                            iconColor={colors.onSurfaceVariant}
                                            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                        />
                                    }
                                    style={[
                                        styles.textInput,
                                        confirmPassword.length > 0 && newPassword !== confirmPassword && styles.errorInput
                                    ]}
                                    outlineStyle={[
                                        styles.inputOutline,
                                        confirmPassword.length > 0 && newPassword !== confirmPassword && styles.errorOutline
                                    ]}
                                />
                                {confirmPassword.length > 0 && newPassword !== confirmPassword && (
                                    <View style={styles.errorContainer}>
                                        <AlertCircle size={16} color={colors.error} />
                                        <Text variant="bodySmall" style={styles.errorText}>
                                            Passwords do not match
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </Card.Content>
                    </Card>

                    {/* Enhanced Submit Button */}
                    <Button
                        mode="contained"
                        onPress={handleSubmit}
                        disabled={!isFormValid() || isLoading}
                        loading={isLoading}
                        style={[
                            styles.submitButton,
                            !isFormValid() && styles.disabledButton
                        ]}
                        labelStyle={styles.submitButtonLabel}
                        contentStyle={styles.submitButtonContent}
                    >
                        {isLoading ? 'Changing Password...' : 'Change Password'}
                    </Button>
                </ScrollView>
            </KeyboardAvoidingView>
        </>
    );
}

const getStyles = (colors) => StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.outlineLight,
        backgroundColor: colors.surface,
    },
    backButton: {
        margin: 0,
    },
    headerContent: {
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 16,
    },
    headerTitle: {
        fontWeight: '700',
        color: colors.onSurface,
        marginBottom: 2,
    },
    headerSubtitle: {
        color: colors.onSurfaceVariant,
        textAlign: 'center',
    },
    infoCard: {
        marginBottom: 20,
        backgroundColor: colors.primaryContainer,
        borderColor: colors.primary,
        borderRadius: 16,
        elevation: 2,
    },
    infoCardContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 16,
        padding: 20,
    },
    infoIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 4,
    },
    infoTextContainer: {
        flex: 1,
    },
    infoTitle: {
        fontWeight: '600',
        color: colors.onSurface,
        marginBottom: 8,
    },
    infoText: {
        color: colors.onSurface,
        lineHeight: 22,
    },
    formCard: {
        marginBottom: 24,
        borderRadius: 16,
        elevation: 2,
    },
    formCardContent: {
        padding: 20,
    },
    formHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
        gap: 12,
    },
    formTitle: {
        fontWeight: '600',
        color: colors.onSurface,
    },
    inputContainer: {
        marginBottom: 0,
    },
    inputLabel: {
        fontWeight: '600',
        color: colors.onSurface,
        marginBottom: 8,
        fontSize: 16,
    },
    textInput: {
        backgroundColor: colors.surface,
        fontSize: 16,
    },
    inputOutline: {
        borderRadius: 12,
        borderWidth: 2,
    },
    errorInput: {
        borderColor: colors.error,
    },
    errorOutline: {
        borderColor: colors.error,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 8,
        paddingHorizontal: 4,
    },
    errorText: {
        color: colors.error,
        fontSize: 13,
        fontWeight: '500',
    },
    divider: {
        marginVertical: 20,
        backgroundColor: colors.outlineLight,
        height: 1,
    },
    strengthContainer: {
        marginTop: 16,
        marginBottom: 20,
        padding: 16,
        backgroundColor: colors.surfaceVariant,
        borderRadius: 12,
    },
    strengthHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    strengthLabel: {
        color: colors.onSurface,
        fontWeight: '600',
    },
    strengthBadge: {
        backgroundColor: getPasswordStrengthColor => getPasswordStrengthColor(),
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    strengthText: {
        fontWeight: '700',
        fontSize: 12,
    },
    strengthBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 20,
    },
    strengthBar: {
        flex: 1,
        height: 8,
        backgroundColor: colors.outlineLight,
        borderRadius: 4,
        overflow: 'hidden',
    },
    strengthProgress: {
        height: '100%',
        borderRadius: 4,
    },
    strengthPercentage: {
        color: colors.onSurfaceVariant,
        fontWeight: '600',
        minWidth: 40,
        textAlign: 'right',
    },
    requirementsContainer: {
        gap: 12,
    },
    requirementsTitle: {
        fontWeight: '600',
        color: colors.onSurface,
        marginBottom: 8,
    },
    requirementsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    requirementItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        minWidth: '45%',
    },
    requirementIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    requirementText: {
        color: colors.onSurface,
        fontSize: 13,
        fontWeight: '500',
    },
    submitButton: {
        borderRadius: 16,
        paddingVertical: 4,
        marginBottom: 24,
        elevation: 4,
    },
    submitButtonContent: {
        paddingVertical: 8,
    },
    submitButtonLabel: {
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    disabledButton: {
        opacity: 0.6,
    },
});
