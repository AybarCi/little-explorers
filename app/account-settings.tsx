import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, LogOut, Trash2 } from 'lucide-react-native';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { signout, deleteAccount } from '@/store/slices/authSlice';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';

export default function AccountSettingsScreen() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [deleting, setDeleting] = useState(false);

    const handleLogout = () => {
        Alert.alert(
            'Çıkış Yap',
            'Hesabından çıkış yapmak istediğine emin misin?',
            [
                { text: 'İptal', style: 'cancel' },
                {
                    text: 'Çıkış Yap',
                    style: 'destructive',
                    onPress: () => dispatch(signout())
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
});
