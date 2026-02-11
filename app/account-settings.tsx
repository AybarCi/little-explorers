import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Modal, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, LogOut, Trash2, Lock, Eye, EyeOff, X } from 'lucide-react-native';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { signout, deleteAccount } from '@/store/slices/authSlice';
import { resetCurrency, clearCurrencyFromStorage } from '@/store/slices/currencySlice';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import Constants from 'expo-constants';

const SUPABASE_URL =
    (Constants.expoConfig?.extra as any)?.supabaseUrl ||
    process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY =
    (Constants.expoConfig?.extra as any)?.supabaseAnonKey ||
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export default function AccountSettingsScreen() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
    const [deleting, setDeleting] = useState(false);

    // Change password states
    const [passwordModalVisible, setPasswordModalVisible] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');

    const handleLogout = () => {
        Alert.alert(
            'Çıkış Yap',
            'Hesabından çıkış yapmak istediğine emin misin?',
            [
                { text: 'İptal', style: 'cancel' },
                {
                    text: 'Çıkış Yap',
                    style: 'destructive',
                    onPress: async () => {
                        await clearCurrencyFromStorage();
                        dispatch(resetCurrency());
                        dispatch(signout());
                    }
                },
            ]
        );
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            '⚠️ Hesabı Kalıcı Olarak Sil',
            'Bu işlem geri alınamaz! Tüm ilerleme, puan ve verileriniz silinecek.',
            [
                { text: 'İptal', style: 'cancel' },
                {
                    text: 'Hesabı Sil',
                    style: 'destructive',
                    onPress: confirmDeleteAccount,
                },
            ]
        );
    };

    const confirmDeleteAccount = () => {
        Alert.alert(
            'Son Onay',
            'Hesabını silmek istediğinden emin misin? Bu işlem geri alınamaz!',
            [
                { text: 'Vazgeç', style: 'cancel' },
                {
                    text: 'Evet, Sil',
                    style: 'destructive',
                    onPress: executeDeleteAccount,
                },
            ]
        );
    };

    const executeDeleteAccount = async () => {
        setDeleting(true);
        try {
            await dispatch(deleteAccount()).unwrap();
            Alert.alert('Başarılı', 'Hesabın silindi', [
                { text: 'Tamam', onPress: () => router.replace('/signin') }
            ]);
        } catch (error) {
            Alert.alert('Hata', error as string || 'Hesap silinirken bir sorun oluştu');
        } finally {
            setDeleting(false);
        }
    };

    const resetPasswordModal = () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowCurrentPassword(false);
        setShowNewPassword(false);
        setPasswordError('');
        setPasswordModalVisible(false);
    };

    const handleChangePassword = async () => {
        setPasswordError('');

        if (!currentPassword || !newPassword || !confirmPassword) {
            setPasswordError('Tüm alanları doldurun');
            return;
        }

        if (newPassword.length < 6) {
            setPasswordError('Yeni şifre en az 6 karakter olmalıdır');
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError('Yeni şifreler eşleşmiyor');
            return;
        }

        if (currentPassword === newPassword) {
            setPasswordError('Yeni şifre mevcut şifrenizle aynı olamaz');
            return;
        }

        setChangingPassword(true);
        try {
            const response = await fetch(`${SUPABASE_URL}/functions/v1/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
                },
                body: JSON.stringify({
                    user_id: user?.id,
                    email: user?.email,
                    current_password: currentPassword,
                    new_password: newPassword,
                }),
            });

            const data = await response.json() as { success?: boolean; error?: string; message?: string };

            if (!response.ok || !data.success) {
                setPasswordError(data.error || 'Şifre değiştirilemedi');
                return;
            }

            resetPasswordModal();
            Alert.alert('Başarılı ✅', 'Şifreniz başarıyla değiştirildi!');
        } catch (error) {
            setPasswordError('Bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setChangingPassword(false);
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[Colors.spacePurple, Colors.energyOrange]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.headerGradient}
            >
                <View style={styles.headerRow}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <ArrowLeft size={24} color="#FFF" />
                    </TouchableOpacity>
                    <View style={styles.headerCenter}>
                        <Text style={styles.titleDark}>Hesap Ayarları</Text>
                        <Text style={styles.subtitleDark}>Hesabını yönet</Text>
                    </View>
                    <View style={{ width: 40 }} />
                </View>
            </LinearGradient>

            <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
                {/* Change Password Action */}
                <TouchableOpacity style={styles.actionCard} onPress={() => setPasswordModalVisible(true)}>
                    <View style={[styles.actionIcon, { backgroundColor: Colors.spacePurple }]}>
                        <Lock size={24} color="#FFF" />
                    </View>
                    <View style={styles.actionContent}>
                        <Text style={styles.actionTitle}>Şifre Değiştir</Text>
                        <Text style={styles.actionDescription}>Hesap şifreni güncelle</Text>
                    </View>
                </TouchableOpacity>

                {/* Logout Action */}
                <TouchableOpacity style={styles.actionCard} onPress={handleLogout}>
                    <View style={[styles.actionIcon, { backgroundColor: '#4299E1' }]}>
                        <LogOut size={24} color="#FFF" />
                    </View>
                    <View style={styles.actionContent}>
                        <Text style={styles.actionTitle}>Çıkış Yap</Text>
                        <Text style={styles.actionDescription}>Hesabından güvenli çıkış yap</Text>
                    </View>
                </TouchableOpacity>

                {/* Delete Account Action */}
                <TouchableOpacity
                    style={[styles.actionCard, styles.dangerCard]}
                    onPress={handleDeleteAccount}
                    disabled={deleting}
                >
                    <View style={[styles.actionIcon, { backgroundColor: '#E53E3E' }]}>
                        <Trash2 size={24} color="#FFF" />
                    </View>
                    <View style={styles.actionContent}>
                        <Text style={[styles.actionTitle, styles.dangerText]}>Hesabı Sil</Text>
                        <Text style={styles.actionDescription}>
                            Tüm verilerin kalıcı olarak silinir
                        </Text>
                    </View>
                </TouchableOpacity>

                {/* Warning Box */}
                <View style={styles.warningBox}>
                    <Text style={styles.warningTitle}>⚠️ Önemli Bilgi</Text>
                    <Text style={styles.warningText}>
                        Hesabını sildiğinde tüm oyun ilerleme, puan, rozetler ve satın alımlar kalıcı olarak silinir.
                        Bu işlem geri alınamaz!
                    </Text>
                </View>
            </ScrollView>

            {/* Change Password Modal */}
            <Modal
                transparent
                visible={passwordModalVisible}
                animationType="slide"
                onRequestClose={resetPasswordModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {/* Modal Header */}
                        <View style={styles.modalHeader}>
                            <View style={styles.modalIconContainer}>
                                <Lock size={28} color={Colors.spacePurple} />
                            </View>
                            <Text style={styles.modalTitle}>Şifre Değiştir</Text>
                            <TouchableOpacity style={styles.modalCloseButton} onPress={resetPasswordModal}>
                                <X size={20} color="#718096" />
                            </TouchableOpacity>
                        </View>

                        {/* Error Message */}
                        {passwordError ? (
                            <View style={styles.errorBox}>
                                <Text style={styles.errorText}>{passwordError}</Text>
                            </View>
                        ) : null}

                        {/* Current Password */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Mevcut Şifre</Text>
                            <View style={styles.passwordInputContainer}>
                                <TextInput
                                    style={styles.passwordInput}
                                    value={currentPassword}
                                    onChangeText={setCurrentPassword}
                                    secureTextEntry={!showCurrentPassword}
                                    placeholder="Mevcut şifrenizi girin"
                                    placeholderTextColor="#A0AEC0"
                                    editable={!changingPassword}
                                />
                                <TouchableOpacity
                                    style={styles.eyeButton}
                                    onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                                >
                                    {showCurrentPassword ? (
                                        <EyeOff size={18} color="#718096" />
                                    ) : (
                                        <Eye size={18} color="#718096" />
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* New Password */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Yeni Şifre</Text>
                            <View style={styles.passwordInputContainer}>
                                <TextInput
                                    style={styles.passwordInput}
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                    secureTextEntry={!showNewPassword}
                                    placeholder="En az 6 karakter"
                                    placeholderTextColor="#A0AEC0"
                                    editable={!changingPassword}
                                />
                                <TouchableOpacity
                                    style={styles.eyeButton}
                                    onPress={() => setShowNewPassword(!showNewPassword)}
                                >
                                    {showNewPassword ? (
                                        <EyeOff size={18} color="#718096" />
                                    ) : (
                                        <Eye size={18} color="#718096" />
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Confirm Password */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Yeni Şifre (Tekrar)</Text>
                            <TextInput
                                style={styles.input}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={true}
                                placeholder="Yeni şifrenizi tekrar girin"
                                placeholderTextColor="#A0AEC0"
                                editable={!changingPassword}
                            />
                        </View>

                        {/* Buttons */}
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={resetPasswordModal}
                                disabled={changingPassword}
                            >
                                <Text style={styles.cancelButtonText}>İptal</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.saveButton, changingPassword && styles.saveButtonDisabled]}
                                onPress={handleChangePassword}
                                disabled={changingPassword}
                            >
                                {changingPassword ? (
                                    <ActivityIndicator size="small" color="#FFF" />
                                ) : (
                                    <Text style={styles.saveButtonText}>Şifreyi Güncelle</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7FAFC',
    },
    headerGradient: {
        paddingHorizontal: 24,
        paddingTop: 55,
        paddingBottom: 20,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerCenter: {
        alignItems: 'center',
    },
    titleDark: {
        fontSize: 24,
        fontWeight: '800',
        color: '#FFF',
    },
    subtitleDark: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.85)',
        marginTop: 4,
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: 24,
        paddingBottom: 100,
    },
    actionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    dangerCard: {
        borderColor: '#FED7D7',
        backgroundColor: '#FFFAF0',
    },
    actionIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    actionContent: {
        flex: 1,
    },
    actionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2D3748',
        marginBottom: 4,
    },
    dangerText: {
        color: '#E53E3E',
    },
    actionDescription: {
        fontSize: 14,
        color: '#718096',
    },
    warningBox: {
        backgroundColor: '#FFF3CD',
        borderRadius: 12,
        padding: 16,
        marginTop: 24,
        borderWidth: 1,
        borderColor: '#FFE69C',
    },
    warningTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#856404',
        marginBottom: 8,
    },
    warningText: {
        fontSize: 14,
        color: '#856404',
        lineHeight: 20,
    },
    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    modalContent: {
        width: '100%',
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 24,
    },
    modalHeader: {
        alignItems: 'center',
        marginBottom: 20,
        position: 'relative',
    },
    modalIconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(108, 99, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#2D3748',
    },
    modalCloseButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F7FAFC',
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorBox: {
        backgroundColor: '#FFF5F5',
        borderRadius: 10,
        padding: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#FED7D7',
    },
    errorText: {
        fontSize: 13,
        color: '#E53E3E',
        textAlign: 'center',
        fontWeight: '600',
    },
    inputGroup: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4A5568',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F7FAFC',
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 15,
        color: '#2D3748',
    },
    passwordInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F7FAFC',
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        paddingHorizontal: 16,
    },
    passwordInput: {
        flex: 1,
        paddingVertical: 14,
        fontSize: 15,
        color: '#2D3748',
    },
    eyeButton: {
        padding: 4,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: '#EDF2F7',
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#718096',
    },
    saveButton: {
        flex: 1.5,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: Colors.spacePurple,
        alignItems: 'center',
    },
    saveButtonDisabled: {
        opacity: 0.6,
    },
    saveButtonText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFF',
    },
});
