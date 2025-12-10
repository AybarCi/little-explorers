import { useEffect, useCallback, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Alert,
    RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { ArrowLeft, Check, Sparkles, Crown, Award } from 'lucide-react-native';
import { useAppSelector } from '@/hooks/useAppSelector';
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

type TabType = 'avatars' | 'frames' | 'badges';

const RARITY_COLORS: Record<string, { bg: string; border: string; text: string }> = {
    common: { bg: '#F7FAFC', border: '#CBD5E0', text: '#718096' },
    rare: { bg: '#EBF8FF', border: '#63B3ED', text: '#3182CE' },
    epic: { bg: '#FAF5FF', border: '#B794F4', text: '#805AD5' },
    legendary: { bg: '#FFFAF0', border: '#F6AD55', text: '#DD6B20' },
};

export default function AvatarSettingsScreen() {
    const router = useRouter();
    const { user } = useAppSelector((state) => state.auth);

    const [activeTab, setActiveTab] = useState<TabType>('avatars');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
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

    const fetchData = useCallback(async (isRefresh = false) => {
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
            const data = await response.json() as {
                avatars?: { emoji: ShopItem[]; premium: ShopItem[] };
                frames?: ShopItem[];
                badges?: ShopItem[];
                inventory?: string[];
                userProfile?: {
                    current_avatar_id?: string;
                    current_frame_id?: string;
                    current_badge_id?: string;
                };
            };

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
            }
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [user?.id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [fetchData])
    );

    const isOwned = (itemType: string, itemId: string, isDefault?: boolean, price?: number) => {
        if (isDefault || price === 0) return true;
        return inventory.includes(`${itemType}_${itemId}`);
    };

    const isEquipped = (itemType: string, itemId: string) => {
        if (itemType === 'avatar') return equipped.avatar_id === itemId;
        if (itemType === 'frame') return equipped.frame_id === itemId;
        if (itemType === 'badge') return equipped.badge_id === itemId;
        return false;
    };

    const handleEquip = async (itemType: string, item: ShopItem) => {
        if (!user?.id || equipping) return;

        // Check if already equipped
        if (isEquipped(itemType, item.id)) {
            // Unequip
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
                        item_id: null, // Unequip
                    }),
                });

                const data = await response.json() as { success?: boolean; error?: string };

                if (data.success) {
                    setEquipped(prev => ({
                        ...prev,
                        [`${itemType}_id`]: undefined,
                    }));
                    Alert.alert('✅', `${itemType === 'avatar' ? 'Avatar' : itemType === 'frame' ? 'Çerçeve' : 'Rozet'} kaldırıldı!`);
                }
            } catch (error) {
                console.error('Unequip error:', error);
            } finally {
                setEquipping(null);
            }
            return;
        }

        // Equip
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
        const owned = isOwned('avatar', item.id, item.is_default, item.price);
        const selected = isEquipped('avatar', item.id);
        const rarityStyle = RARITY_COLORS[item.rarity] || RARITY_COLORS.common;

        if (!owned) return null; // Only show owned items

        return (
            <TouchableOpacity
                key={item.id}
                style={[
                    styles.itemCard,
                    { backgroundColor: rarityStyle.bg, borderColor: selected ? Colors.primary : rarityStyle.border },
                    selected && styles.selectedCard,
                ]}
                onPress={() => handleEquip('avatar', item)}
                disabled={equipping === item.id}
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
                <Text style={[styles.statusText, selected && styles.equippedText]}>
                    {selected ? '✓ Kullanılıyor' : 'Seç'}
                </Text>
            </TouchableOpacity>
        );
    };

    const renderFrameItem = (item: ShopItem) => {
        const owned = isOwned('frame', item.id, false, item.price);
        const selected = isEquipped('frame', item.id);
        const rarityStyle = RARITY_COLORS[item.rarity] || RARITY_COLORS.common;

        if (!owned) return null;

        return (
            <TouchableOpacity
                key={item.id}
                style={[
                    styles.itemCard,
                    { backgroundColor: rarityStyle.bg, borderColor: selected ? Colors.primary : rarityStyle.border },
                    selected && styles.selectedCard,
                ]}
                onPress={() => handleEquip('frame', item)}
                disabled={equipping === item.id}
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
                <Text style={[styles.statusText, selected && styles.equippedText]}>
                    {selected ? '✓ Kullanılıyor' : 'Seç'}
                </Text>
            </TouchableOpacity>
        );
    };

    const renderBadgeItem = (item: ShopItem) => {
        const owned = isOwned('badge', item.id, false, item.price);
        const selected = isEquipped('badge', item.id);
        const rarityStyle = RARITY_COLORS[item.rarity] || RARITY_COLORS.common;

        if (!owned) return null;

        return (
            <TouchableOpacity
                key={item.id}
                style={[
                    styles.itemCard,
                    { backgroundColor: rarityStyle.bg, borderColor: selected ? Colors.primary : rarityStyle.border },
                    selected && styles.selectedCard,
                ]}
                onPress={() => handleEquip('badge', item)}
                disabled={equipping === item.id}
            >
                {selected && (
                    <View style={styles.selectedBadge}>
                        <Check size={12} color="#FFF" />
                    </View>
                )}

                <Text style={styles.badgeEmoji}>{item.emoji}</Text>
                <Text style={[styles.itemName, { color: rarityStyle.text }]}>{item.name}</Text>
                <Text style={[styles.statusText, selected && styles.equippedText]}>
                    {selected ? '✓ Kullanılıyor' : 'Seç'}
                </Text>
            </TouchableOpacity>
        );
    };

    // Count owned items
    const ownedAvatars = [...avatars.emoji, ...avatars.premium].filter(
        item => isOwned('avatar', item.id, item.is_default, item.price)
    );
    const ownedFrames = frames.filter(item => isOwned('frame', item.id, false, item.price));
    const ownedBadges = badges.filter(item => isOwned('badge', item.id, false, item.price));

    if (loading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.loadingText}>Yükleniyor...</Text>
            </View>
        );
    }

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
                        <Text style={styles.titleDark}>Avatar Ayarları</Text>
                        <Text style={styles.subtitleDark}>Görünümünü özelleştir!</Text>
                    </View>
                    <View style={{ width: 40 }} />
                </View>
            </LinearGradient>

            {/* Tabs */}
            <View style={styles.tabsContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'avatars' && styles.tabActive]}
                    onPress={() => setActiveTab('avatars')}
                >
                    <Sparkles size={16} color={activeTab === 'avatars' ? '#FFF' : '#718096'} />
                    <Text style={[styles.tabText, activeTab === 'avatars' && styles.tabTextActive]}>
                        Avatarlar ({ownedAvatars.length})
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'frames' && styles.tabActive]}
                    onPress={() => setActiveTab('frames')}
                >
                    <Crown size={16} color={activeTab === 'frames' ? '#FFF' : '#718096'} />
                    <Text style={[styles.tabText, activeTab === 'frames' && styles.tabTextActive]}>
                        Çerçeveler ({ownedFrames.length})
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'badges' && styles.tabActive]}
                    onPress={() => setActiveTab('badges')}
                >
                    <Award size={16} color={activeTab === 'badges' ? '#FFF' : '#718096'} />
                    <Text style={[styles.tabText, activeTab === 'badges' && styles.tabTextActive]}>
                        Rozetler ({ownedBadges.length})
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={() => fetchData(true)} />
                }
            >
                {activeTab === 'avatars' && (
                    <>
                        {ownedAvatars.length === 0 ? (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyEmoji}>😢</Text>
                                <Text style={styles.emptyText}>Henüz avatarın yok!</Text>
                                <TouchableOpacity
                                    style={styles.shopButton}
                                    onPress={() => router.push('/(tabs)/shop')}
                                >
                                    <Text style={styles.shopButtonText}>Mağazaya Git</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={styles.itemsGrid}>
                                {avatars.emoji.map(item => renderAvatarItem(item, false))}
                                {avatars.premium.map(item => renderAvatarItem(item, true))}
                            </View>
                        )}
                    </>
                )}

                {activeTab === 'frames' && (
                    <>
                        {ownedFrames.length === 0 ? (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyEmoji}>🖼️</Text>
                                <Text style={styles.emptyText}>Henüz çerçeven yok!</Text>
                                <TouchableOpacity
                                    style={styles.shopButton}
                                    onPress={() => router.push('/(tabs)/shop')}
                                >
                                    <Text style={styles.shopButtonText}>Mağazaya Git</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={styles.itemsGrid}>
                                {frames.map(renderFrameItem)}
                            </View>
                        )}
                    </>
                )}

                {activeTab === 'badges' && (
                    <>
                        {ownedBadges.length === 0 ? (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyEmoji}>🏅</Text>
                                <Text style={styles.emptyText}>Henüz rozetin yok!</Text>
                                <TouchableOpacity
                                    style={styles.shopButton}
                                    onPress={() => router.push('/(tabs)/shop')}
                                >
                                    <Text style={styles.shopButtonText}>Mağazaya Git</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={styles.itemsGrid}>
                                {badges.map(renderBadgeItem)}
                            </View>
                        )}
                    </>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F7FAFC' },
    loadingContainer: { justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 12, fontSize: 16, color: '#718096' },
    headerGradient: {
        paddingHorizontal: 24, paddingTop: 55, paddingBottom: 20,
        borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
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
    titleDark: { fontSize: 24, fontWeight: '800', color: '#FFF' },
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
    tabText: { fontSize: 11, fontWeight: '600', color: '#718096' },
    tabTextActive: { color: '#FFF' },
    content: { flex: 1 },
    contentContainer: { padding: 16, paddingBottom: 100 },
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
    itemName: { fontSize: 11, fontWeight: '600', textAlign: 'center', marginBottom: 4 },
    statusText: { fontSize: 10, color: '#718096' },
    equippedText: { color: Colors.primary, fontWeight: '700' },
    emptyState: {
        backgroundColor: 'white', borderRadius: 16, padding: 40,
        alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0',
    },
    emptyEmoji: { fontSize: 48, marginBottom: 16 },
    emptyText: { fontSize: 16, color: '#718096', marginBottom: 16 },
    shopButton: {
        backgroundColor: Colors.primary, paddingHorizontal: 24, paddingVertical: 12,
        borderRadius: 12,
    },
    shopButtonText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
});
