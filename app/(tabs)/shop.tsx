import { useEffect, useCallback, useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Animated,
    Easing,
    ActivityIndicator,
    Alert,
    RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Diamond, Check, ShoppingBag, Sparkles, Crown, Award } from 'lucide-react-native';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { updateUserDiamonds } from '@/store/slices/authSlice';
import { initializeCurrency, loadCurrencyFromStorage, CURRENCY_CONSTANTS } from '@/store/slices/currencySlice';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import Constants from 'expo-constants';

const SUPABASE_URL = Constants.expoConfig?.extra?.supabaseUrl;
const SUPABASE_ANON_KEY = Constants.expoConfig?.extra?.supabaseAnonKey;

// Premium avatar images
const AVATAR_IMAGES: Record<string, any> = {
    astronaut: require('@/assets/avatars/astronaut.png'),
    ninja: require('@/assets/avatars/ninja.png'),
    robot: require('@/assets/avatars/robot.png'),
    superhero: require('@/assets/avatars/superhero.png'),
    wizard: require('@/assets/avatars/wizard.png'),
    pirate: require('@/assets/avatars/pirate.png'),
    princess: require('@/assets/avatars/princess.png'),
    knight: require('@/assets/avatars/knight.png'),
    vampire: require('@/assets/avatars/vampire.png'),
    zombie: require('@/assets/avatars/zombie.png'),
    fairy: require('@/assets/avatars/fairy.png'),
    alien: require('@/assets/avatars/alien.png'),
    sailor: require('@/assets/avatars/sailor.png'),
    pilot: require('@/assets/avatars/pilot.png'),
    king: require('@/assets/avatars/king.png'),
    hero_bat_ninja: require('@/assets/avatars/hero_bat_ninja.png'),
    hero_botanic: require('@/assets/avatars/hero_botanic.png'),
    hero_fire: require('@/assets/avatars/hero_fire.png'),
    hero_fire_knife: require('@/assets/avatars/hero_fire_knife.png'),
    hero_ice: require('@/assets/avatars/hero_ice.png'),
    hero_mad_warrior: require('@/assets/avatars/hero_mad_warrior.png'),
    hero_poseidon: require('@/assets/avatars/hero_poseidon.png'),
    hero_space: require('@/assets/avatars/hero_space.png'),
    hero_warlock: require('@/assets/avatars/hero_warlock.png'),
};

interface ShopItem {
    id: string;
    name: string;
    emoji?: string;
    image_key?: string;
    color_primary?: string;
    color_secondary?: string;
    category?: string;
    rarity: string;
    price: number;
    is_default?: boolean;
}

interface ShopApiResponse {
    avatars?: { emoji: ShopItem[]; premium: ShopItem[] };
    frames?: ShopItem[];
    badges?: ShopItem[];
    inventory?: string[];
    userProfile?: {
        current_avatar_id?: string;
        current_frame_id?: string;
        current_badge_id?: string;
        diamonds?: number;
    };
}

type TabType = 'avatars' | 'frames' | 'badges';

const RARITY_COLORS: Record<string, { bg: string; border: string; text: string }> = {
    common: { bg: '#F7FAFC', border: '#CBD5E0', text: '#718096' },
    rare: { bg: '#EBF8FF', border: '#63B3ED', text: '#3182CE' },
    epic: { bg: '#FAF5FF', border: '#B794F4', text: '#805AD5' },
    legendary: { bg: '#FFFAF0', border: '#F6AD55', text: '#DD6B20' },
};

export default function ShopScreen() {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
    const headerAnim = useRef(new Animated.Value(0)).current;

    const [activeTab, setActiveTab] = useState<TabType>('avatars');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [purchasing, setPurchasing] = useState<string | null>(null);
    const [equipping, setEquipping] = useState<string | null>(null);

    const [avatars, setAvatars] = useState<{ emoji: ShopItem[]; premium: ShopItem[] }>({ emoji: [], premium: [] });
    const [frames, setFrames] = useState<ShopItem[]>([]);
    const [badges, setBadges] = useState<ShopItem[]>([]);
    const [inventory, setInventory] = useState<string[]>([]);
    const [equipped, setEquipped] = useState<{
        avatar_id?: string;
        frame_id?: string;
        badge_id?: string;
    }>({});
    const [diamondBalance, setDiamondBalance] = useState<number>(user?.diamonds || 0);

    const fetchShopData = useCallback(async (isRefresh = false) => {
        if (!user?.id) return;
        if (isRefresh) setRefreshing(true);
        else setLoading(true);

        try {
            const response = await fetch(
                `${SUPABASE_URL}/functions/v1/get-shop-items?user_id=${user.id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                        'apikey': SUPABASE_ANON_KEY || '',
                    },
                }
            );
            const data = await response.json() as ShopApiResponse;
            console.log('Shop API Response:', JSON.stringify(data, null, 2));

            if (data.avatars) setAvatars(data.avatars);
            if (data.frames) setFrames(data.frames);
            if (data.badges) setBadges(data.badges);
            if (data.inventory) setInventory(data.inventory);
            if (data.userProfile) {
                setEquipped({
                    avatar_id: data.userProfile.current_avatar_id,
                    frame_id: data.userProfile.current_frame_id,
                    badge_id: data.userProfile.current_badge_id,
                });
                // Update diamond balance from API
                if (data.userProfile.diamonds !== undefined) {
                    const dbDiamonds = data.userProfile.diamonds;
                    setDiamondBalance(dbDiamonds);
                    dispatch(updateUserDiamonds(dbDiamonds));
                    // Also sync with currencySlice so homepage shows correct diamonds
                    const savedCurrency = await loadCurrencyFromStorage();
                    dispatch(initializeCurrency({
                        energy: savedCurrency?.energy ?? CURRENCY_CONSTANTS.MAX_ENERGY,
                        diamonds: dbDiamonds,
                        lastEnergyUpdate: savedCurrency?.lastEnergyUpdate ?? Date.now(),
                    }));
                }
            }
        } catch (error) {
            console.error('Shop fetch error:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [user?.id]);

    useEffect(() => {
        fetchShopData();
    }, [fetchShopData]);

    useFocusEffect(
        useCallback(() => {
            fetchShopData();
        }, [fetchShopData])
    );

    useEffect(() => {
        Animated.timing(headerAnim, {
            toValue: 1,
            duration: 700,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
        }).start();
    }, []);

    const isOwned = (itemType: string, itemId: string) => {
        return inventory.includes(`${itemType}_${itemId}`);
    };

    const isEquipped = (itemType: string, itemId: string) => {
        if (itemType === 'avatar') return equipped.avatar_id === itemId;
        if (itemType === 'frame') return equipped.frame_id === itemId;
        if (itemType === 'badge') return equipped.badge_id === itemId;
        return false;
    };

    const handlePurchase = async (itemType: string, item: ShopItem) => {
        if (!user?.id || purchasing) return;

        if ((user.diamonds || 0) < item.price) {
            Alert.alert('Yetersiz Elmas', `Bu ürün için ${item.price} 💎 gerekli!`);
            return;
        }

        Alert.alert(
            'Satın Al',
            `"${item.name}" ürününü ${item.price} 💎 karşılığında satın almak istiyor musun?`,
            [
                { text: 'İptal', style: 'cancel' },
                {
                    text: 'Satın Al',
                    onPress: async () => {
                        setPurchasing(item.id);
                        try {
                            const response = await fetch(`${SUPABASE_URL}/functions/v1/purchase-item`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                                    'apikey': SUPABASE_ANON_KEY || '',
                                },
                                body: JSON.stringify({
                                    user_id: user.id,
                                    item_type: itemType,
                                    item_id: item.id,
                                }),
                            });

                            const data = await response.json() as { success?: boolean; new_diamond_balance?: number; error?: string };

                            if (data.success) {
                                setInventory(prev => [...prev, `${itemType}_${item.id}`]);
                                const newBalance = data.new_diamond_balance ?? 0;
                                setDiamondBalance(newBalance);
                                dispatch(updateUserDiamonds(newBalance));
                                Alert.alert('🎉 Tebrikler!', `"${item.name}" artık senin!`);
                            } else {
                                Alert.alert('Hata', data.error || 'Satın alma başarısız');
                            }
                        } catch (error) {
                            console.error('Purchase error:', error);
                            Alert.alert('Hata', 'Bir sorun oluştu');
                        } finally {
                            setPurchasing(null);
                        }
                    },
                },
            ]
        );
    };

    const handleEquip = async (itemType: string, item: ShopItem) => {
        if (!user?.id || equipping) return;

        setEquipping(item.id);
        try {
            const response = await fetch(`${SUPABASE_URL}/functions/v1/equip-item`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'apikey': SUPABASE_ANON_KEY || '',
                },
                body: JSON.stringify({
                    user_id: user.id,
                    item_type: itemType,
                    item_id: item.id,
                }),
            });

            const data = await response.json() as { success?: boolean; error?: string };

            if (data.success) {
                setEquipped(prev => ({
                    ...prev,
                    [`${itemType}_id`]: item.id,
                }));
                Alert.alert('✅ Hazır!', `"${item.name}" kullanılıyor!`);
            } else {
                Alert.alert('Hata', data.error || 'Kullanılamadı');
            }
        } catch (error) {
            console.error('Equip error:', error);
        } finally {
            setEquipping(null);
        }
    };

    const renderAvatarItem = (item: ShopItem, isPremium: boolean) => {
        const owned = item.is_default || item.price === 0 || isOwned('avatar', item.id);
        const selected = isEquipped('avatar', item.id);
        const rarityStyle = RARITY_COLORS[item.rarity] || RARITY_COLORS.common;

        return (
            <TouchableOpacity
                key={item.id}
                style={[
                    styles.itemCard,
                    { backgroundColor: rarityStyle.bg, borderColor: selected ? Colors.primary : rarityStyle.border },
                    selected && styles.selectedCard,
                ]}
                onPress={() => owned ? handleEquip('avatar', item) : handlePurchase('avatar', item)}
                disabled={purchasing === item.id || equipping === item.id}
            >
                {selected && (
                    <View style={styles.selectedBadge}>
                        <Check size={12} color="#FFF" />
                    </View>
                )}

                <View style={styles.avatarPreview}>
                    {isPremium && item.image_key ? (
                        <Image source={AVATAR_IMAGES[item.image_key]} style={styles.premiumAvatar} />
                    ) : (
                        <Text style={styles.emojiAvatar}>{item.emoji}</Text>
                    )}
                </View>

                <Text style={[styles.itemName, { color: rarityStyle.text }]}>{item.name}</Text>
                <Text style={[styles.rarityLabel, { color: rarityStyle.text }]}>
                    {item.rarity === 'legendary' ? '⭐ Efsanevi' :
                        item.rarity === 'epic' ? '💜 Epik' :
                            item.rarity === 'rare' ? '💙 Nadir' : '⚪ Normal'}
                </Text>

                {owned ? (
                    <View style={[styles.ownedBadge, selected && styles.equippedBadge]}>
                        <Text style={styles.ownedText}>{selected ? 'Kullanılıyor' : 'Sahipsin'}</Text>
                    </View>
                ) : (
                    <TouchableOpacity
                        style={styles.buyButton}
                        onPress={() => handlePurchase('avatar', item)}
                        disabled={purchasing === item.id}
                    >
                        {purchasing === item.id ? (
                            <ActivityIndicator size="small" color="#FFF" />
                        ) : (
                            <>
                                <Diamond size={14} color="#FFF" />
                                <Text style={styles.buyButtonText}>{item.price}</Text>
                            </>
                        )}
                    </TouchableOpacity>
                )}
            </TouchableOpacity>
        );
    };

    const renderFrameItem = (item: ShopItem) => {
        const owned = isOwned('frame', item.id);
        const selected = isEquipped('frame', item.id);
        const rarityStyle = RARITY_COLORS[item.rarity] || RARITY_COLORS.common;

        return (
            <TouchableOpacity
                key={item.id}
                style={[
                    styles.itemCard,
                    { backgroundColor: rarityStyle.bg, borderColor: selected ? Colors.primary : rarityStyle.border },
                    selected && styles.selectedCard,
                ]}
                onPress={() => owned ? handleEquip('frame', item) : handlePurchase('frame', item)}
                disabled={purchasing === item.id || equipping === item.id}
            >
                {selected && (
                    <View style={styles.selectedBadge}>
                        <Check size={12} color="#FFF" />
                    </View>
                )}

                <View style={[styles.framePreview, { borderColor: item.color_primary }]}>
                    <Text style={styles.framePreviewText}>A</Text>
                </View>

                <Text style={[styles.itemName, { color: rarityStyle.text }]}>{item.name}</Text>

                {owned ? (
                    <View style={[styles.ownedBadge, selected && styles.equippedBadge]}>
                        <Text style={styles.ownedText}>{selected ? 'Kullanılıyor' : 'Sahipsin'}</Text>
                    </View>
                ) : (
                    <TouchableOpacity style={styles.buyButton} onPress={() => handlePurchase('frame', item)}>
                        <Diamond size={14} color="#FFF" />
                        <Text style={styles.buyButtonText}>{item.price}</Text>
                    </TouchableOpacity>
                )}
            </TouchableOpacity>
        );
    };

    const renderBadgeItem = (item: ShopItem) => {
        const owned = isOwned('badge', item.id);
        const selected = isEquipped('badge', item.id);
        const rarityStyle = RARITY_COLORS[item.rarity] || RARITY_COLORS.common;

        return (
            <TouchableOpacity
                key={item.id}
                style={[
                    styles.itemCard,
                    { backgroundColor: rarityStyle.bg, borderColor: selected ? Colors.primary : rarityStyle.border },
                    selected && styles.selectedCard,
                ]}
                onPress={() => owned ? handleEquip('badge', item) : handlePurchase('badge', item)}
                disabled={purchasing === item.id || equipping === item.id}
            >
                {selected && (
                    <View style={styles.selectedBadge}>
                        <Check size={12} color="#FFF" />
                    </View>
                )}

                <Text style={styles.badgeEmoji}>{item.emoji}</Text>
                <Text style={[styles.itemName, { color: rarityStyle.text }]}>{item.name}</Text>

                {owned ? (
                    <View style={[styles.ownedBadge, selected && styles.equippedBadge]}>
                        <Text style={styles.ownedText}>{selected ? 'Kullanılıyor' : 'Sahipsin'}</Text>
                    </View>
                ) : (
                    <TouchableOpacity style={styles.buyButton} onPress={() => handlePurchase('badge', item)}>
                        <Diamond size={14} color="#FFF" />
                        <Text style={styles.buyButtonText}>{item.price}</Text>
                    </TouchableOpacity>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[Colors.spacePurple, Colors.energyOrange]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.headerGradient}
            >
                <Animated.View style={{ opacity: headerAnim, alignItems: 'center' }}>
                    <View style={styles.diamondBalance}>
                        <Diamond size={20} color="#00D4FF" fill="#00D4FF" />
                        <Text style={styles.diamondText}>{diamondBalance}</Text>
                    </View>
                    <ShoppingBag size={32} color="#FFF" />
                    <Text style={styles.titleDark}>Mağaza</Text>
                    <Text style={styles.subtitleDark}>Avatar, çerçeve ve rozet al!</Text>
                </Animated.View>
            </LinearGradient>

            {/* Tabs */}
            <View style={styles.tabsContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'avatars' && styles.tabActive]}
                    onPress={() => setActiveTab('avatars')}
                >
                    <Sparkles size={16} color={activeTab === 'avatars' ? '#FFF' : '#718096'} />
                    <Text style={[styles.tabText, activeTab === 'avatars' && styles.tabTextActive]}>Avatarlar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'frames' && styles.tabActive]}
                    onPress={() => setActiveTab('frames')}
                >
                    <Crown size={16} color={activeTab === 'frames' ? '#FFF' : '#718096'} />
                    <Text style={[styles.tabText, activeTab === 'frames' && styles.tabTextActive]}>Çerçeveler</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'badges' && styles.tabActive]}
                    onPress={() => setActiveTab('badges')}
                >
                    <Award size={16} color={activeTab === 'badges' ? '#FFF' : '#718096'} />
                    <Text style={[styles.tabText, activeTab === 'badges' && styles.tabTextActive]}>Rozetler</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={() => fetchShopData(true)} />
                }
            >
                {loading ? (
                    <View style={styles.listLoadingContainer}>
                        <ActivityIndicator size="large" color={Colors.primary} />
                        <Text style={styles.loadingText}>Öğeler yükleniyor...</Text>
                    </View>
                ) : (
                    <>
                        {activeTab === 'avatars' && (
                            <>
                                <Text style={styles.sectionTitle}>✨ Premium Avatarlar</Text>
                                <View style={styles.itemsGrid}>
                                    {avatars.premium.map(item => renderAvatarItem(item, true))}
                                </View>

                                <Text style={styles.sectionTitle}>😊 Emoji Avatarlar</Text>
                                <View style={styles.itemsGrid}>
                                    {avatars.emoji.map(item => renderAvatarItem(item, false))}
                                </View>
                            </>
                        )}

                        {activeTab === 'frames' && (
                            <>
                                <Text style={styles.sectionTitle}>🖼️ Çerçeveler</Text>
                                <View style={styles.itemsGrid}>
                                    {frames.map(renderFrameItem)}
                                </View>
                            </>
                        )}

                        {activeTab === 'badges' && (
                            <>
                                <Text style={styles.sectionTitle}>🏅 Rozetler</Text>
                                <View style={styles.itemsGrid}>
                                    {badges.map(renderBadgeItem)}
                                </View>
                            </>
                        )}
                    </>
                )}
            </ScrollView>
        </View >
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F7FAFC' },
    loadingContainer: { justifyContent: 'center', alignItems: 'center' },
    listLoadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 100,
    },
    loadingText: { marginTop: 12, fontSize: 16, color: '#718096' },
    headerGradient: {
        paddingHorizontal: 24, paddingTop: 55, paddingBottom: 20,
        borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
    },
    diamondBalance: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        backgroundColor: 'rgba(0,0,0,0.2)', paddingHorizontal: 16, paddingVertical: 8,
        borderRadius: 20, marginBottom: 12,
    },
    diamondText: { color: '#FFF', fontSize: 18, fontWeight: '700' },
    titleDark: { fontSize: 26, fontWeight: '800', color: '#FFF', marginTop: 8 },
    subtitleDark: { fontSize: 14, color: 'rgba(255,255,255,0.85)', marginTop: 4 },
    tabsContainer: {
        flexDirection: 'row', marginHorizontal: 16, marginTop: -14,
        backgroundColor: '#FFF', borderRadius: 14, padding: 4,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1, shadowRadius: 8, elevation: 4,
    },
    tab: {
        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        paddingVertical: 10, borderRadius: 10, gap: 4,
    },
    tabActive: { backgroundColor: Colors.primary },
    tabText: { fontSize: 12, fontWeight: '600', color: '#718096' },
    tabTextActive: { color: '#FFF' },
    content: { flex: 1 },
    contentContainer: { padding: 16, paddingBottom: 100 },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: '#2D3748', marginTop: 16, marginBottom: 12 },
    itemsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    itemCard: {
        width: '30%', padding: 12, borderRadius: 16, borderWidth: 2,
        alignItems: 'center', position: 'relative',
    },
    selectedCard: { borderWidth: 3 },
    selectedBadge: {
        position: 'absolute', top: -6, right: -6,
        backgroundColor: Colors.primary, width: 22, height: 22,
        borderRadius: 11, alignItems: 'center', justifyContent: 'center',
    },
    avatarPreview: {
        width: 56, height: 56, borderRadius: 28,
        backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center',
        marginBottom: 8, overflow: 'hidden',
    },
    emojiAvatar: { fontSize: 32 },
    premiumAvatar: { width: 56, height: 56, borderRadius: 28 },
    framePreview: {
        width: 48, height: 48, borderRadius: 24, borderWidth: 4,
        alignItems: 'center', justifyContent: 'center', marginBottom: 8,
        backgroundColor: '#FFF',
    },
    framePreviewText: { fontSize: 20, fontWeight: '700', color: '#718096' },
    badgeEmoji: { fontSize: 36, marginBottom: 8 },
    itemName: { fontSize: 12, fontWeight: '600', textAlign: 'center', marginBottom: 4 },
    rarityLabel: { fontSize: 10, marginBottom: 8 },
    ownedBadge: {
        backgroundColor: '#E2E8F0', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8,
    },
    equippedBadge: { backgroundColor: '#C6F6D5' },
    ownedText: { fontSize: 10, fontWeight: '600', color: '#4A5568' },
    buyButton: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        backgroundColor: '#805AD5', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8,
    },
    buyButtonText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
});
