import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    Modal,
    ActivityIndicator,
    Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Diamond, Sparkles, Gift, Star, X, FileText, Shield } from 'lucide-react-native';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { addDiamonds, saveCurrencyToStorage, saveDiamondsToDatabase } from '@/store/slices/currencySlice';
import { saveUserDiamonds } from '@/store/slices/authSlice';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const SUPABASE_URL =
    (Constants.expoConfig?.extra as any)?.supabaseUrl ||
    process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY =
    (Constants.expoConfig?.extra as any)?.supabaseAnonKey ||
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// --- SAFE IAP HOOK IMPORT ---
let useIAP: any = null;
let iapAvailable = false;

try {
    const iapModule = require('react-native-iap');
    if (iapModule && typeof iapModule.useIAP === 'function') {
        useIAP = iapModule.useIAP;
        iapAvailable = true;
        console.log('[DiamondPurchase] react-native-iap useIAP hook loaded successfully.');
    } else {
        console.warn('[DiamondPurchase] react-native-iap loaded but useIAP hook not found.');
    }
} catch (e) {
    console.warn('[DiamondPurchase] react-native-iap could not be required.', e);
    iapAvailable = false;
}
// ------------------------------------

// Product IDs - must match App Store Connect / Google Play Console
const diamondSkus = ['100_diamonds', '500_diamonds', '1000_diamonds'];

// Map product IDs to diamond amounts
const PRODUCT_DIAMOND_MAP: Record<string, number> = {
    '100_diamonds': 100,
    '500_diamonds': 500,
    '1000_diamonds': 1000,
};

const PACKAGE_ICONS = {
    small: { icon: Diamond, color: '#60A5FA', bg: '#DBEAFE' },
    medium: { icon: Star, color: '#F59E0B', bg: '#FEF3C7' },
    large: { icon: Gift, color: '#8B5CF6', bg: '#EDE9FE' },
};

// Fallback component when IAP is not available
const IAPUnavailableScreen = ({ diamonds, onBack }: { diamonds: number; onBack: () => void }) => (
    <View style={styles.container}>
        <LinearGradient
            colors={['#3B82F6', '#8B5CF6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
        >
            <TouchableOpacity style={styles.backButton} onPress={onBack}>
                <ArrowLeft size={24} color="#FFF" />
            </TouchableOpacity>
            <View style={styles.headerContent}>
                <Sparkles size={32} color="#FFF" />
                <Text style={styles.headerTitle}>Elmas Mağazası</Text>
            </View>
            <View style={styles.balanceContainer}>
                <Diamond size={24} color="#FFF" fill="#FFF" />
                <Text style={styles.balanceText}>{diamonds}</Text>
                <Text style={styles.balanceLabel}>Mevcut Bakiye</Text>
            </View>
        </LinearGradient>

        <View style={{ padding: 20, alignItems: 'center', flex: 1, justifyContent: 'center' }}>
            <View style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: 20, borderRadius: 16, alignItems: 'center' }}>
                <Text style={{ color: '#EF4444', fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
                    ⚠ IAP Modülü Yok
                </Text>
                <Text style={{ color: '#666', textAlign: 'center', fontSize: 14 }}>
                    Expo Go veya native modülü içermeyen bir sürüm kullanıyorsunuz.{'\n'}
                    Satın alma işlemleri production build'de aktif olacak.
                </Text>
            </View>
        </View>
    </View>
);

// Main component that uses the hook
const DiamondPurchaseWithIAP = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { diamonds, energy, lastEnergyUpdate } = useAppSelector((state) => state.currency);
    const user = useAppSelector((state) => state.auth.user);

    const [showTermsModal, setShowTermsModal] = useState(false);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);
    const [isPurchasing, setIsPurchasing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Track processed transactions to prevent duplicates
    const processedTransactions = useRef(new Set<string>());

    // v14 useIAP hook
    const {
        connected,
        products,
        currentPurchase,
        fetchProducts,
        requestPurchase,
        finishTransaction,
    } = useIAP({
        onPurchaseSuccess: async (purchase: any) => {
            console.log('[DiamondPurchase] Purchase Success:', purchase.productId);

            // Prevent duplicate processing
            const txId = purchase.transactionId || purchase.originalTransactionIdentifier || purchase.purchaseToken;
            if (processedTransactions.current.has(txId)) {
                console.log('[DiamondPurchase] Transaction already processed, skipping:', txId);
                return;
            }
            processedTransactions.current.add(txId);

            try {
                await finishTransaction({ purchase, isConsumable: true });
                console.log('[DiamondPurchase] Transaction finished successfully');
            } catch (ackErr) {
                console.warn('[DiamondPurchase] finishTransaction error:', ackErr);
            }

            // Add diamonds to user account
            const diamondAmount = PRODUCT_DIAMOND_MAP[purchase.productId] || 0;
            const newDiamonds = diamonds + diamondAmount;

            dispatch(addDiamonds(diamondAmount));

            await saveCurrencyToStorage({
                energy,
                diamonds: newDiamonds,
                lastEnergyUpdate,
            });

            if (user?.id) {
                try {
                    await dispatch(saveDiamondsToDatabase({ userId: user.id, diamonds: newDiamonds })).unwrap();
                    await dispatch(saveUserDiamonds(newDiamonds)).unwrap();

                    // Log purchase to database
                    const purchaseProduct = products?.find((p: any) => (p.productId || p.id) === purchase.productId);
                    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
                        const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
                        await supabaseClient.from('diamond_purchases').insert({
                            user_id: user.id,
                            product_id: purchase.productId,
                            diamond_amount: diamondAmount,
                            price_amount: purchaseProduct?.price || null,
                            price_currency: purchaseProduct?.currency || null,
                            transaction_id: txId,
                            platform: Platform.OS,
                            status: 'completed',
                        });
                    }
                    console.log('[DiamondPurchase] Purchase logged to database');
                } catch (dbError) {
                    console.error('Failed to save diamonds/purchase to database:', dbError);
                }
            }

            setIsPurchasing(false);
            Alert.alert('🎉 Başarılı!', `${diamondAmount} elmas hesabına eklendi!`);
        },
        onPurchaseError: (error: any) => {
            console.warn('[DiamondPurchase] Purchase Error:', error);
            setIsPurchasing(false);

            // Ignore user cancellation
            if (error.responseCode === '2' || error.code === 'E_USER_CANCELLED') {
                return;
            }

            Alert.alert('Hata', `Satın alma başarısız: ${error.message || 'Bilinmeyen hata'}`);
        },
    });

    // Auto-finish pending transactions on mount
    useEffect(() => {
        const clearPendingPurchases = async () => {
            if (currentPurchase) {
                console.log('[DiamondPurchase] Found pending purchase on mount, finishing:', currentPurchase.productId);
                try {
                    await finishTransaction({ purchase: currentPurchase, isConsumable: true });
                    console.log('[DiamondPurchase] Cleared pending purchase');
                } catch (e) {
                    console.warn('[DiamondPurchase] Error clearing pending purchase:', e);
                }
            }
        };
        clearPendingPurchases();
    }, [currentPurchase, finishTransaction]);

    // Fetch products when connected
    useEffect(() => {
        if (!connected) {
            console.log('[DiamondPurchase] Not connected yet, waiting...');
            return;
        }

        console.log('[DiamondPurchase] Connected! Fetching products...');

        // Fetch consumables (type: 'in-app')
        fetchProducts({ skus: diamondSkus, type: 'in-app' });

        // Loading complete after a short delay
        setTimeout(() => setIsLoading(false), 1000);
    }, [connected, fetchProducts]);

    // Debug: Log when products update
    useEffect(() => {
        console.log('[DiamondPurchase] Products updated:', products?.length);
        if (products?.length > 0) {
            console.log('[DiamondPurchase] Product IDs:', products.map((p: any) => p.productId || p.id).join(', '));
        }
    }, [products]);

    const handleBuy = async (productId: string) => {
        if (isPurchasing) return;

        setIsPurchasing(true);

        try {
            console.log('[DiamondPurchase] Requesting purchase for:', productId);

            requestPurchase({
                request: {
                    apple: { sku: productId },
                    google: { skus: [productId] },
                },
                type: 'in-app',
            });
        } catch (err: any) {
            console.error('[DiamondPurchase] Buy Error:', err);
            setIsPurchasing(false);
            Alert.alert('Hata', err.message || 'Satın alma başlatılamadı');
        }
    };

    const getProductIcon = (productId: string) => {
        if (productId.includes('100')) return 'small';
        if (productId.includes('500')) return 'medium';
        return 'large';
    };

    const isRealProducts = products && products.length > 0;

    if (isLoading) {
        return (
            <View style={styles.container}>
                <LinearGradient
                    colors={['#3B82F6', '#8B5CF6']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.headerGradient}
                >
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <ArrowLeft size={24} color="#FFF" />
                    </TouchableOpacity>
                    <View style={styles.headerContent}>
                        <Sparkles size={32} color="#FFF" />
                        <Text style={styles.headerTitle}>Elmas Mağazası</Text>
                    </View>
                </LinearGradient>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <Text style={{ color: '#666', marginTop: 16 }}>
                        {connected ? 'Ürünler yükleniyor...' : 'Mağazaya bağlanılıyor...'}
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {isPurchasing && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#FFF" />
                    <Text style={{ color: '#FFF', marginTop: 16 }}>İşlem yapılıyor...</Text>
                </View>
            )}

            <LinearGradient
                colors={['#3B82F6', '#8B5CF6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.headerGradient}
            >
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <ArrowLeft size={24} color="#FFF" />
                </TouchableOpacity>

                <View style={styles.headerContent}>
                    <Sparkles size={32} color="#FFF" />
                    <Text style={styles.headerTitle}>Elmas Mağazası</Text>
                    <Text style={styles.headerSubtitle}>Elmas satın al, premium içeriklerin kilidini aç!</Text>
                </View>

                <View style={styles.balanceContainer}>
                    <Diamond size={24} color="#FFF" fill="#FFF" />
                    <Text style={styles.balanceText}>{diamonds}</Text>
                    <Text style={styles.balanceLabel}>Mevcut Bakiye</Text>
                </View>
            </LinearGradient>

            <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
                <Text style={styles.sectionTitle}>💎 Elmas Paketleri</Text>

                {/* <View style={{ backgroundColor: isRealProducts ? '#22C55E' : '#EF4444', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, marginBottom: 16, alignSelf: 'flex-start' }}>
                    <Text style={{ color: '#FFF', fontSize: 12, fontWeight: '600' }}>
                        {isRealProducts ? `✓ App Store Ürünleri (${products.length})` : '⚠ Ürün Bulunamadı'}
                    </Text>
                </View> */}

                {!isRealProducts ? (
                    <View style={{ padding: 20, alignItems: 'center', backgroundColor: '#FEF2F2', borderRadius: 16 }}>
                        <Text style={{ color: '#991B1B', fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>
                            Ürünler Yüklenemedi
                        </Text>
                        <Text style={{ color: '#7F1D1D', textAlign: 'center', fontSize: 13 }}>
                            App Store Connect'te ürünlerin "Ready to Submit" veya "Approved" durumunda olduğundan emin olun.
                        </Text>
                    </View>
                ) : (
                    products.map((product: any) => {
                        const productId = product.productId || product.id;
                        const iconType = getProductIcon(productId);
                        const IconConfig = PACKAGE_ICONS[iconType];
                        const IconComponent = IconConfig.icon;
                        const diamondAmount = PRODUCT_DIAMOND_MAP[productId] || 0;

                        return (
                            <TouchableOpacity
                                key={productId}
                                style={[
                                    styles.packageCard,
                                    productId.includes('500') && styles.popularCard,
                                    productId.includes('1000') && styles.bestValueCard,
                                ]}
                                onPress={() => handleBuy(productId)}
                            >
                                {productId.includes('500') && (
                                    <View style={styles.badge}>
                                        <Text style={styles.badgeText}>Popüler</Text>
                                    </View>
                                )}
                                {productId.includes('1000') && (
                                    <View style={[styles.badge, styles.bestValueBadge]}>
                                        <Text style={styles.badgeText}>En İyi Değer</Text>
                                    </View>
                                )}

                                <View style={[styles.iconContainer, { backgroundColor: IconConfig.bg }]}>
                                    <IconComponent size={32} color={IconConfig.color} fill={IconConfig.color} />
                                </View>

                                <View style={styles.packageInfo}>
                                    <Text style={styles.packageTitle}>{product.title || `${diamondAmount} Elmas`}</Text>
                                    <View style={styles.diamondRow}>
                                        <Diamond size={16} color="#60A5FA" fill="#60A5FA" />
                                        <Text style={styles.diamondAmount}>+{diamondAmount}</Text>
                                    </View>
                                </View>

                                <View style={styles.priceContainer}>
                                    <Text style={styles.priceText}>{product.localizedPrice || product.displayPrice}</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })
                )}

                {/* Legal Links */}
                <View style={styles.legalContainer}>
                    <TouchableOpacity style={styles.legalButton} onPress={() => setShowTermsModal(true)}>
                        <FileText size={16} color="#64748B" />
                        <Text style={styles.legalText}>Kullanım Koşulları</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.legalButton} onPress={() => setShowPrivacyModal(true)}>
                        <Shield size={16} color="#64748B" />
                        <Text style={styles.legalText}>Gizlilik Politikası</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.disclaimer}>
                    Satın almalar Apple/Google hesabınız üzerinden gerçekleştirilir.
                    Elmaslar uygulama içi kullanım içindir ve para karşılığı iade edilemez.
                </Text>
            </ScrollView>

            {/* Terms Modal */}
            <Modal visible={showTermsModal} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Kullanım Koşulları</Text>
                            <TouchableOpacity onPress={() => setShowTermsModal(false)}>
                                <X size={24} color="#1F2937" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.modalBody}>
                            <Text style={styles.modalText}>
                                1. Elmas Satın Alımları{'\n\n'}
                                Elmaslar, uygulama içi satın alma yoluyla elde edilir. Tüm satın almalar Apple App Store veya Google Play Store üzerinden işlenir.{'\n\n'}
                                2. İade Politikası{'\n\n'}
                                Elmas satın alımları geri iade edilemez. Teknik sorunlar için destek ekibimizle iletişime geçebilirsiniz.{'\n\n'}
                                3. Kullanım{'\n\n'}
                                Elmaslar sadece uygulama içi içerik satın almak için kullanılabilir.
                            </Text>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Privacy Modal */}
            <Modal visible={showPrivacyModal} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Gizlilik Politikası</Text>
                            <TouchableOpacity onPress={() => setShowPrivacyModal(false)}>
                                <X size={24} color="#1F2937" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.modalBody}>
                            <Text style={styles.modalText}>
                                Gizlilik Politikası{'\n\n'}
                                Kişisel verilerinizin korunması bizim için önemlidir. Satın alma işlemlerinde yalnızca Apple/Google tarafından sağlanan anonim işlem bilgileri kullanılır.{'\n\n'}
                                Hiçbir ödeme bilgisi (kredi kartı, banka hesabı vb.) tarafımızca saklanmaz.
                            </Text>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

// Wrapper component that checks IAP availability
export default function DiamondPurchaseScreen() {
    const router = useRouter();
    const { diamonds } = useAppSelector((state) => state.currency);

    if (!iapAvailable || !useIAP) {
        return <IAPUnavailableScreen diamonds={diamonds} onBack={() => router.back()} />;
    }

    return <DiamondPurchaseWithIAP />;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    headerGradient: {
        paddingTop: 50,
        paddingBottom: 30,
        paddingHorizontal: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerContent: {
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFF',
        marginTop: 8,
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 4,
    },
    balanceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 16,
        alignSelf: 'center',
        gap: 8,
    },
    balanceText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
    },
    balanceLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 16,
    },
    packageCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    popularCard: {
        borderWidth: 2,
        borderColor: '#F59E0B',
    },
    bestValueCard: {
        borderWidth: 2,
        borderColor: '#8B5CF6',
    },
    badge: {
        position: 'absolute',
        top: -10,
        right: 16,
        backgroundColor: '#F59E0B',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    bestValueBadge: {
        backgroundColor: '#8B5CF6',
    },
    badgeText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    packageInfo: {
        flex: 1,
        marginLeft: 16,
    },
    packageTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    diamondRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        gap: 4,
    },
    diamondAmount: {
        fontSize: 14,
        color: '#60A5FA',
        fontWeight: '600',
    },
    priceContainer: {
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
    },
    priceText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    legalContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 24,
        marginTop: 24,
    },
    legalButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    legalText: {
        color: '#64748B',
        fontSize: 13,
    },
    disclaimer: {
        textAlign: 'center',
        color: '#94A3B8',
        fontSize: 11,
        marginTop: 16,
        lineHeight: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
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
        borderBottomColor: '#E5E7EB',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    modalBody: {
        padding: 20,
    },
    modalText: {
        color: '#4B5563',
        fontSize: 14,
        lineHeight: 22,
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
    },
});
