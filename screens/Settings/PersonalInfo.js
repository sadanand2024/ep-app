import React, { useState, useContext } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    StyleSheet,
    Alert,
    Modal,
    TextInput,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
    ArrowLeft,
    HelpCircle,
    Search,
    Camera,
    User,
    Cake,
    Users,
    Mail,
    Phone,
    Edit3,
    ChevronRight,
    Check
} from 'lucide-react-native';
import { AuthContext } from '../../context/AuthContext';
import { getCommonStyles } from '../../constants/commonStyles';

const PersonalInfo = ({ navigation }) => {
    const { colors } = useTheme();
    const { user } = useContext(AuthContext);
    const commonStyles = getCommonStyles(colors);

    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editingField, setEditingField] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Mock user data - replace with actual user data from context
    const [userData, setUserData] = useState({
        profilePicture: user?.profile_image || 'https://via.placeholder.com/80',
        name: user?.name || 'Anand Garikapati',
        birthday: 'May 27, 1997',
        gender: 'Male',
        emails: ['garikapati.2014@gmail.com', 'anandgarikapati2797@gmail.com'],
        phone: '091920 43376'
    });

    const handleEdit = (field, currentValue) => {
        setEditingField(field);
        setEditValue(currentValue);

        // Handle special input types
        if (field === 'birthday') {
            setShowDatePicker(true);
            return;
        }

        if (field === 'gender') {
            setEditModalVisible(true);
            return;
        }

        setEditModalVisible(true);
    };

    // Email validation function
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Phone validation function
    const isValidPhone = (phone) => {
        const phoneRegex = /^[0-9]{10,15}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    };

    const handleSave = () => {
        if (!editValue.trim()) {
            Alert.alert('Error', 'Field cannot be empty');
            return;
        }

        // Validation based on field type
        if (editingField === 'email' && !isValidEmail(editValue.trim())) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }

        if (editingField === 'phone' && !isValidPhone(editValue.trim())) {
            Alert.alert('Error', 'Please enter a valid phone number (10-15 digits)');
            return;
        }

        setUserData(prev => ({
            ...prev,
            [editingField]: editValue.trim()
        }));
        setEditModalVisible(false);
        setEditingField(null);
        setEditValue('');
    };

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            const formattedDate = selectedDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            setUserData(prev => ({
                ...prev,
                birthday: formattedDate
            }));
        }
    };

    const handleGenderSelect = (gender) => {
        setUserData(prev => ({
            ...prev,
            gender: gender
        }));
        setEditModalVisible(false);
        setEditingField(null);
    };

    const renderInfoItem = (icon, title, value, subtitle = '', isEditable = true) => (
        <TouchableOpacity
            style={[styles.infoItem, { borderBottomColor: colors.outline }]}
            onPress={() => isEditable && handleEdit(title.toLowerCase(), value)}
            disabled={!isEditable}
        >
            <View style={styles.infoLeft}>
                <View style={[styles.iconContainer, { backgroundColor: colors.primaryContainer }]}>
                    {icon}
                </View>
                <View style={styles.infoText}>
                    <Text style={[styles.infoTitle, { color: colors.onSurface }]}>{title}</Text>
                    {subtitle ? (
                        <Text style={[styles.infoSubtitle, { color: colors.onSurfaceVariant }]}>{subtitle}</Text>
                    ) : null}
                    <Text style={[styles.infoValue, { color: colors.onSurface }]}>{value}</Text>
                </View>
            </View>
            {isEditable && (
                <View style={styles.infoRight}>
                    <Edit3 size={16} color={colors.onSurfaceVariant} />
                    <ChevronRight size={16} color={colors.onSurfaceVariant} />
                </View>
            )}
        </TouchableOpacity>
    );

    const renderEmailItem = (email, index) => (
        <TouchableOpacity
            key={index}
            style={[styles.infoItem, { borderBottomColor: colors.outline }]}
            onPress={() => handleEdit('email', email)}
        >
            <View style={styles.infoLeft}>
                <View style={[styles.iconContainer, { backgroundColor: colors.primaryContainer }]}>
                    <Mail size={20} color={colors.primary} />
                </View>
                <View style={styles.infoText}>
                    <Text style={[styles.infoTitle, { color: colors.onSurface }]}>
                        {index === 0 ? 'Email' : 'Additional email'}
                    </Text>
                    <Text style={[styles.infoValue, { color: colors.onSurface }]}>{email}</Text>
                </View>
            </View>
            <View style={styles.infoRight}>
                <Edit3 size={16} color={colors.onSurfaceVariant} />
                <ChevronRight size={16} color={colors.onSurfaceVariant} />
            </View>
        </TouchableOpacity>
    );

    const renderGenderOptions = () => (
        <View style={styles.genderOptions}>
            {['Male', 'Female', 'Others'].map((gender) => (
                <TouchableOpacity
                    key={gender}
                    style={[
                        styles.genderOption,
                        {
                            backgroundColor: userData.gender === gender ? colors.primaryContainer : colors.surfaceVariant,
                            borderColor: colors.outline
                        }
                    ]}
                    onPress={() => handleGenderSelect(gender)}
                >
                    <Text style={[
                        styles.genderOptionText,
                        { color: userData.gender === gender ? colors.primary : colors.onSurface }
                    ]}>
                        {gender}
                    </Text>
                    {userData.gender === gender && (
                        <Check size={16} color={colors.primary} style={styles.checkIcon} />
                    )}
                </TouchableOpacity>
            ))}
        </View>
    );

    return (
        <>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.surface }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerLeft}>
                    <ArrowLeft size={24} color={colors.onSurface} />
                    <Text style={[styles.headerTitle, { color: colors.onSurface }]}>Personal Info</Text>
                </TouchableOpacity>
                <View style={styles.headerRight}>
                    <Image source={{ uri: userData.profilePicture }} style={styles.profilePic} />
                </View>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Main Title */}
                <View style={styles.titleSection}>
                    <Text style={[styles.mainTitle, { color: colors.onSurface }]}>Personal info</Text>
                    <Text style={[styles.subtitle, { color: colors.onSurfaceVariant }]}>
                        Your profile info in Tarafirst
                    </Text>
                    <Text style={[styles.description, { color: colors.onSurfaceVariant }]}>
                        Personal info and options to manage it. You can make some of this info, like your contact details, visible to others so they can reach you easily. You can also see a summary of your profiles.
                    </Text>
                </View>

                {/* Basic Info Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>Basic info</Text>
                    <Text style={[styles.sectionSubtitle, { color: colors.onSurfaceVariant }]}>
                        Some info may be visible to other people using Tarafirst services.
                    </Text>

                    <View style={[styles.card, { backgroundColor: colors.surface }]}>
                        {/* Profile Picture */}
                        <TouchableOpacity
                            style={[styles.infoItem, { borderBottomColor: colors.outline }]}
                            onPress={() => Alert.alert('Profile Picture', 'Change profile picture functionality')}
                        >
                            <View style={styles.infoLeft}>
                                <View style={[styles.iconContainer, { backgroundColor: colors.primaryContainer }]}>
                                    <Camera size={20} color={colors.primary} />
                                </View>
                                <View style={styles.infoText}>
                                    <Text style={[styles.infoTitle, { color: colors.onSurface }]}>Profile picture</Text>
                                    <Text style={[styles.infoSubtitle, { color: colors.onSurfaceVariant }]}>
                                        A profile picture helps personalize your account
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.infoRight}>
                                <Image source={{ uri: userData.profilePicture }} style={styles.smallProfilePic} />
                                <ChevronRight size={16} color={colors.onSurfaceVariant} />
                            </View>
                        </TouchableOpacity>

                        {/* Name */}
                        {renderInfoItem(
                            <User size={20} color={colors.primary} />,
                            'Name',
                            userData.name
                        )}

                        {/* Birthday */}
                        {renderInfoItem(
                            <Cake size={20} color={colors.primary} />,
                            'Birthday',
                            userData.birthday
                        )}

                        {/* Gender */}
                        {renderInfoItem(
                            <Users size={20} color={colors.primary} />,
                            'Gender',
                            userData.gender
                        )}
                    </View>
                </View>

                {/* Contact Info Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>Contact info</Text>

                    <View style={[styles.card, { backgroundColor: colors.surface }]}>
                        {/* Emails */}
                        {userData.emails.map((email, index) => renderEmailItem(email, index))}

                        {/* Phone */}
                        {renderInfoItem(
                            <Phone size={20} color={colors.primary} />,
                            'Phone',
                            userData.phone
                        )}
                    </View>
                </View>
            </ScrollView>

                         {/* Edit Modal */}
             <Modal
                 visible={editModalVisible}
                 animationType="slide"
                 transparent={true}
                 onRequestClose={() => setEditModalVisible(false)}
             >
                 <View style={styles.modalOverlay}>
                     <View style={styles.modalContent}>
                         <View style={styles.modalHeader}>
                             <Text style={[styles.modalTitle, { color: colors.onSurface }]}>
                                 Edit {editingField}
                             </Text>
                             <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                                 <Text style={[styles.cancelButton, { color: colors.primary }]}>Cancel</Text>
                             </TouchableOpacity>
                         </View>

                         {editingField === 'gender' ? (
                             renderGenderOptions()
                         ) : (
                             <KeyboardAvoidingView
                                 behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                                 style={styles.keyboardContainer}
                             >
                                 <TextInput
                                     style={[styles.editInput, {
                                         backgroundColor: colors.surfaceVariant,
                                         color: colors.onSurface,
                                         borderColor: colors.outline
                                     }]}
                                     value={editValue}
                                     onChangeText={setEditValue}
                                     placeholder={`Enter ${editingField}`}
                                     placeholderTextColor={colors.onSurfaceVariant}
                                     autoFocus
                                     keyboardType={editingField === 'phone' ? 'numeric' : 'default'}
                                     maxLength={editingField === 'phone' ? 15 : undefined}
                                 />

                                 <TouchableOpacity
                                     style={[styles.saveButton, { backgroundColor: colors.primary }]}
                                     onPress={handleSave}
                                 >
                                     <Text style={[styles.saveButtonText, { color: colors.onPrimary }]}>Save</Text>
                                 </TouchableOpacity>
                             </KeyboardAvoidingView>
                         )}
                     </View>
                 </View>
             </Modal>

            {/* Date Picker */}
            {showDatePicker && (
                <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                    maximumDate={new Date()}
                />
            )}
        </>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 12,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerIcon: {
        padding: 8,
        marginLeft: 4,
    },
    profilePic: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginLeft: 8,
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
    },
    titleSection: {
        paddingVertical: 24,
    },
    mainTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 12,
    },
    description: {
        fontSize: 14,
        lineHeight: 20,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
    },
    sectionSubtitle: {
        fontSize: 14,
        marginBottom: 16,
        lineHeight: 20,
    },
    link: {
        textDecorationLine: 'underline',
    },
    card: {
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
    },
    infoLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    infoText: {
        flex: 1,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 2,
    },
    infoSubtitle: {
        fontSize: 12,
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 14,
    },
    infoRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    smallProfilePic: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 8,
    },
         modalOverlay: {
         flex: 1,
         backgroundColor: 'rgba(0, 0, 0, 0.5)',
         justifyContent: 'flex-end',
     },
     modalContent: {
         backgroundColor: 'white',
         borderTopLeftRadius: 20,
         borderTopRightRadius: 20,
         padding: 20,
         paddingBottom: 20,
         minHeight: 200,
         width: '100%',
     },
     keyboardContainer: {
         flex: 1,
     },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    cancelButton: {
        fontSize: 16,
        fontWeight: '500',
    },
    editInput: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 20,
    },
    saveButton: {
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    genderOptions: {
        marginBottom: 20,
    },
    genderOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginBottom: 8,
        borderWidth: 1,
    },
    genderOptionText: {
        fontSize: 16,
        fontWeight: '500',
    },
    checkIcon: {
        marginLeft: 8,
    },
});

export default PersonalInfo;

