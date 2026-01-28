import { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Diamond, Sparkles, Gift, Star, X, FileText, Shield } from 'lucide-react-native';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { addDiamonds, saveCurrencyToStorage, saveDiamondsToDatabase } from '@/store/slices/currencySlice';
import { saveUserDiamonds } from '@/store/slices/authSlice';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';

// Mock data for diamond packages
const DIAMOND_PACKAGES = [
    {
        id: '100_diamonds',
        diamonds: 100,
        price: '₺49,99',
        title: '100 Elmas',
        icon: 'small' as const,
    },
    {
        id: '500_diamonds',
        diamonds: 500,
        price: '₺149,99',
        title: '500 Elmas',
        icon: 'medium' as const,
        popular: true,
    },
    {
        id: '1000_diamonds',
        diamonds: 1000,
        price: '₺299,99',
        title: '1000 Elmas',
        icon: 'large' as const,
        bestValue: true,
    },
];

const PACKAGE_ICONS = {
    small: { icon: Diamond, color: '#60A5FA', bg: '#DBEAFE' },
    medium: { icon: Star, color: '#F59E0B', bg: '#FEF3C7' },
    large: { icon: Gift, color: '#8B5CF6', bg: '#EDE9FE' },
};

export default function DiamondPurchaseScreen() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { diamonds, energy, lastEnergyUpdate } = useAppSelector((state) => state.currency);
    const user = useAppSelector((state) => state.auth.user);

    const [showTermsModal, setShowTermsModal] = useState(false);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);

    const handlePurchase = async (pkg: typeof DIAMOND_PACKAGES[0]) => {
        // In production, this would trigger real IAP
        Alert.alert(
            'Satın Alma',
            `${pkg.title} (${pkg.price}) satın almak istiyor musunuz?`,
            [
                { text: 'İptal', style: 'cancel' },
                {
                    text: 'Satın Al',
                    onPress: async () => {
                        // Mock purchase success
                        const newDiamonds = diamonds + pkg.diamonds;
                        dispatch(addDiamonds(pkg.diamonds));

                        await saveCurrencyToStorage({
                            energy,
                            diamonds: newDiamonds,
                            lastEnergyUpdate,
                        });

                        if (user?.id) {
                            // Await the database save to ensure persistence
                            try {
                                await dispatch(saveDiamondsToDatabase({ userId: user.id, diamonds: newDiamonds })).unwrap();
                                console.log('Diamonds saved to database successfully:', newDiamonds);
                            } catch (dbError) {
                                console.error('Failed to save diamonds to database:', dbError);
                            }
                            // Persist to SecureStore for app restart
                            await dispatch(saveUserDiamonds(newDiamonds)).unwrap();
                        }

                        Alert.alert('🎉 Satın Alma Başarılı!', `${pkg.diamonds} elmas hesabına eklendi!`);
                    },
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#3B82F6', '#8B5CF6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.headerGradient}
            >
                <View style={styles.headerRow}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <ArrowLeft size={24} color="#FFF" />
                    </TouchableOpacity>
                    <View style={styles.headerCenter}>
                        <Sparkles size={28} color="#FFF" />
                        <Text style={styles.title}>Elmas Satın Al</Text>
                    </View>
                    <View style={{ width: 40 }} />
                </View>

                <View style={styles.balanceContainer}>
                    <Diamond size={24} color="#FFF" fill="#FFF" />
                    <Text style={styles.balanceText}>{diamonds}</Text>
                    <Text style={styles.balanceLabel}>Mevcut Bakiye</Text>
                </View>
            </LinearGradient>

            <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
                <Text style={styles.sectionTitle}>💎 Elmas Paketleri</Text>

                {DIAMOND_PACKAGES.map((pkg) => {
                    const IconConfig = PACKAGE_ICONS[pkg.icon];
                    const IconComponent = IconConfig.icon;

                    return (
                        <TouchableOpacity
                            key={pkg.id}
                            style={[
                                styles.packageCard,
                                pkg.popular && styles.popularCard,
                                pkg.bestValue && styles.bestValueCard,
                            ]}
                            onPress={() => handlePurchase(pkg)}
                        >
                            {pkg.popular && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>Popüler</Text>
                                </View>
                            )}
                            {pkg.bestValue && (
                                <View style={[styles.badge, styles.bestValueBadge]}>
                                    <Text style={styles.badgeText}>En İyi Değer</Text>
                                </View>
                            )}

                            <View style={[styles.iconContainer, { backgroundColor: IconConfig.bg }]}>
                                <IconComponent size={32} color={IconConfig.color} fill={IconConfig.color} />
                            </View>

                            <View style={styles.packageInfo}>
                                <Text style={styles.packageTitle}>{pkg.title}</Text>
                                <View style={styles.diamondRow}>
                                    <Diamond size={16} color="#60A5FA" fill="#60A5FA" />
                                    <Text style={styles.diamondAmount}>+{pkg.diamonds}</Text>
                                </View>
                            </View>

                            <View style={styles.priceContainer}>
                                <Text style={styles.priceText}>{pkg.price}</Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}

                <View style={styles.infoBox}>
                    <Text style={styles.infoTitle}>ℹ️ Bilgi</Text>
                    <Text style={styles.infoText}>
                        • Elmaslar oyun içi satın almalar için kullanılır.{'\n'}
                        • Enerji dolumu ve premium öğeler için kullanabilirsin.{'\n'}
                        • Satın alımlar Apple/Google hesabından tahsil edilir.
                    </Text>
                </View>

                {/* Terms and Privacy Links */}
                <View style={styles.legalContainer}>
                    <TouchableOpacity style={styles.legalButton} onPress={() => setShowTermsModal(true)}>
                        <FileText size={18} color="#718096" />
                        <Text style={styles.legalButtonText}>Kullanım Koşulları</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.legalButton} onPress={() => setShowPrivacyModal(true)}>
                        <Shield size={18} color="#718096" />
                        <Text style={styles.legalButtonText}>Gizlilik Politikası</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Terms Modal */}
            <Modal visible={showTermsModal} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Kullanım Koşulları</Text>
                            <TouchableOpacity onPress={() => setShowTermsModal(false)}>
                                <X size={24} color="#4A5568" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.modalContent}>
                            <Text style={styles.modalText}>
                                <Text style={styles.modalSubtitle}>1. Genel Koşullar{'\n'}</Text>
                                Bu uygulama içi satın almalar, Apple App Store veya Google Play Store üzerinden gerçekleştirilir. Satın aldığınız elmaslar yalnızca bu uygulama içinde kullanılabilir ve gerçek para karşılığı iade edilemez.{'\n\n'}

                                <Text style={styles.modalSubtitle}>2. Ödeme ve Faturalandırma{'\n'}</Text>
                                Tüm ödemeler, Apple veya Google hesabınız üzerinden yapılır. Fiyatlar yerel para biriminizde gösterilir ve vergiler dahil olabilir.{'\n\n'}

                                <Text style={styles.modalSubtitle}>3. İade Politikası{'\n'}</Text>
                                Uygulama içi satın almalar için iade talepleri Apple veya Google'ın politikalarına tabidir. Satın alınan ve kullanılan sanal ürünler iade edilemez.{'\n\n'}

                                <Text style={styles.modalSubtitle}>4. Yaş Sınırlaması{'\n'}</Text>
                                Bu uygulama çocuklar için tasarlanmıştır. Satın almalar ebeveyn veya vasi gözetiminde yapılmalıdır.{'\n\n'}

                                <Text style={styles.modalSubtitle}>5. Değişiklikler{'\n'}</Text>
                                Bu koşullar önceden bildirimde bulunmaksızın değiştirilebilir. Güncel koşulları düzenli olarak kontrol etmenizi öneririz.
                            </Text>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Privacy Modal */}
            <Modal visible={showPrivacyModal} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Gizlilik Politikası</Text>
                            <TouchableOpacity onPress={() => setShowPrivacyModal(false)}>
                                <X size={24} color="#4A5568" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.modalContent}>
                            <Text style={styles.modalText}>
                                <Text style={styles.modalSubtitle}>1. Toplanan Veriler{'\n'}</Text>
                                Satın alma işlemleri sırasında herhangi bir ödeme bilgisi uygulamamız tarafından saklanmaz. Tüm ödeme işlemleri Apple veya Google tarafından güvenli bir şekilde işlenir.{'\n\n'}

                                <Text style={styles.modalSubtitle}>2. Veri Kullanımı{'\n'}</Text>
                                Satın alma geçmişiniz yalnızca elmas bakiyenizi takip etmek için kullanılır. Bu veriler üçüncü taraflarla paylaşılmaz.{'\n\n'}

                                <Text style={styles.modalSubtitle}>3. Çocuk Gizliliği (COPPA){'\n'}</Text>
                                Bu uygulama çocuklara yöneliktir ve COPPA (Children's Online Privacy Protection Act) düzenlemelerine uygun olarak tasarlanmıştır. 13 yaş altı kullanıcılardan kişisel bilgi toplanmaz.{'\n\n'}

                                <Text style={styles.modalSubtitle}>4. Güvenlik{'\n'}</Text>
                                Verileriniz endüstri standardı güvenlik önlemleri ile korunmaktadır.{'\n\n'}

                                <Text style={styles.modalSubtitle}>5. İletişim{'\n'}</Text>
                                Gizlilik politikamız hakkında sorularınız için bizimle iletişime geçebilirsiniz.
                            </Text>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F7FAFC' },
    headerGradient: {
        paddingHorizontal: 24,
        paddingTop: 55,
        paddingBottom: 24,
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
        gap: 4,
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        color: '#FFF',
    },
    balanceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        gap: 8,
    },
    balanceText: {
        fontSize: 32,
        fontWeight: '800',
        color: '#FFF',
    },
    balanceLabel: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        marginLeft: 4,
    },
    content: { flex: 1 },
    contentContainer: { padding: 20, paddingBottom: 40 },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#2D3748',
        marginBottom: 16,
    },
    packageCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    popularCard: {
        borderColor: '#F59E0B',
        borderWidth: 2,
    },
    bestValueCard: {
        borderColor: '#8B5CF6',
        borderWidth: 2,
    },
    badge: {
        position: 'absolute',
        top: -10,
        right: 16,
        backgroundColor: '#F59E0B',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    bestValueBadge: {
        backgroundColor: '#8B5CF6',
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#FFF',
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    packageInfo: {
        flex: 1,
    },
    packageTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2D3748',
    },
    diamondRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 4,
    },
    diamondAmount: {
        fontSize: 14,
        fontWeight: '600',
        color: '#60A5FA',
    },
    priceContainer: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        minWidth: 90,
        alignItems: 'center',
    },
    priceText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFF',
    },
    infoBox: {
        backgroundColor: '#EDF2F7',
        borderRadius: 12,
        padding: 16,
        marginTop: 20,
    },
    infoTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#4A5568',
        marginBottom: 8,
    },
    infoText: {
        fontSize: 13,
        color: '#718096',
        lineHeight: 20,
    },
    legalContainer: {
        marginTop: 24,
        gap: 12,
    },
    legalButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#FFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    legalButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4A5568',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#2D3748',
    },
    modalContent: {
        padding: 20,
    },
    modalText: {
        fontSize: 14,
        color: '#4A5568',
        lineHeight: 22,
    },
    modalSubtitle: {
        fontWeight: '700',
        color: '#2D3748',
    },
});
