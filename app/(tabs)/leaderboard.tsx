import { useEffect, useCallback, useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Animated,
    Easing,
    ActivityIndicator,
    RefreshControl,
    Image,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Trophy, Star, Medal, Crown } from 'lucide-react-native';
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

interface LeaderboardEntry {
    rank: number;
    user_id: string;
    name: string;
    value: number;
    age_group: string;
    // Avatar info
    avatar_emoji?: string | null;
    avatar_image_key?: string | null;
    avatar_category?: string | null;
    // Frame info
    frame_color?: string | null;
    frame_color_secondary?: string | null;
    // Badge info
    badge_emoji?: string | null;
}

interface LeaderboardResponse {
    leaderboard?: LeaderboardEntry[];
    type?: string;
    error?: string;
}

type TabType = 'points' | 'score';

export default function LeaderboardScreen() {
    const { user } = useAppSelector((state) => state.auth);
    const headerAnim = useRef(new Animated.Value(0)).current;

    const [activeTab, setActiveTab] = useState<TabType>('points');
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchLeaderboard = useCallback(async (type: TabType, isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);

        try {
            const response = await fetch(
                `${SUPABASE_URL}/functions/v1/get-leaderboard?type=${type}&limit=50`,
                {
                    headers: {
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                        'apikey': SUPABASE_ANON_KEY || '',
                    },
                }
            );
            const data = await response.json() as LeaderboardResponse;

            if (data.leaderboard) {
                setLeaderboard(data.leaderboard);
            }
        } catch (error) {
            console.error('Leaderboard fetch error:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchLeaderboard(activeTab);
    }, [activeTab]);

    useFocusEffect(
        useCallback(() => {
            fetchLeaderboard(activeTab);
        }, [activeTab, fetchLeaderboard])
    );

    useEffect(() => {
        Animated.timing(headerAnim, {
            toValue: 1,
            duration: 700,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
        }).start();
    }, []);

    const handleTabChange = (tab: TabType) => {
        if (tab !== activeTab) {
            setActiveTab(tab);
        }
    };

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1:
                return <Crown size={24} color="#FFD700" fill="#FFD700" />;
            case 2:
                return <Medal size={22} color="#C0C0C0" fill="#C0C0C0" />;
            case 3:
                return <Medal size={22} color="#CD7F32" fill="#CD7F32" />;
            default:
                return <Text style={styles.rankNumber}>{rank}</Text>;
        }
    };

    const getRankBackground = (rank: number) => {
        switch (rank) {
            case 1:
                return '#FFF9E6';
            case 2:
                return '#F5F5F5';
            case 3:
                return '#FDF5EF';
            default:
                return '#FFFFFF';
        }
    };

    const currentUserRank = leaderboard.findIndex(entry => entry.user_id === user?.id) + 1;

    const renderAvatar = (item: LeaderboardEntry) => {
        const frameColor = item.frame_color || Colors.primary;
        const hasFrame = !!item.frame_color;

        const renderBadge = () => {
            if (!item.badge_emoji) return null;
            return (
                <View style={styles.badgeOverlay}>
                    <Text style={styles.badgeOverlayEmoji}>{item.badge_emoji}</Text>
                </View>
            );
        };

        // Premium avatar with image
        if (item.avatar_image_key && AVATAR_IMAGES[item.avatar_image_key]) {
            return (
                <View style={styles.avatarWrapper}>
                    <View style={[styles.avatarContainer, { borderColor: frameColor, borderWidth: hasFrame ? 3 : 0 }]}>
                        <Image
                            source={AVATAR_IMAGES[item.avatar_image_key]}
                            style={styles.avatarImage}
                        />
                    </View>
                    {renderBadge()}
                </View>
            );
        }

        // Emoji avatar
        if (item.avatar_emoji) {
            return (
                <View style={styles.avatarWrapper}>
                    <View style={[styles.avatarContainer, styles.emojiAvatarContainer, { borderColor: frameColor, borderWidth: hasFrame ? 3 : 0 }]}>
                        <Text style={styles.emojiAvatar}>{item.avatar_emoji}</Text>
                    </View>
                    {renderBadge()}
                </View>
            );
        }

        // Default: first letter
        return (
            <View style={styles.avatarWrapper}>
                <View style={[styles.avatarContainer, { borderColor: frameColor, borderWidth: hasFrame ? 3 : 0 }]}>
                    <Text style={styles.avatarText}>
                        {item.name?.charAt(0).toUpperCase() || '?'}
                    </Text>
                </View>
                {renderBadge()}
            </View>
        );
    };

    const renderItem = ({ item }: { item: LeaderboardEntry }) => {
        const isCurrentUser = item.user_id === user?.id;

        return (
            <View
                style={[
                    styles.leaderboardItem,
                    { backgroundColor: getRankBackground(item.rank) },
                    isCurrentUser && styles.currentUserItem,
                ]}
            >
                <View style={styles.rankContainer}>
                    {getRankIcon(item.rank)}
                </View>

                {renderAvatar(item)}

                <View style={styles.userInfo}>
                    <Text style={[styles.userName, isCurrentUser && styles.currentUserName]}>
                        {item.name}
                        {isCurrentUser && ' (Sen)'}
                    </Text>
                    <Text style={styles.ageGroup}>{item.age_group} Yaş</Text>
                </View>

                <View style={styles.valueContainer}>
                    <Text style={styles.valueText}>{item.value.toLocaleString()}</Text>
                    <Text style={styles.valueLabel}>
                        {activeTab === 'points' ? 'puan' : 'skor'}
                    </Text>
                </View>
            </View>
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
                <Animated.View
                    style={{
                        transform: [{ translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }],
                        opacity: headerAnim,
                        alignItems: 'center',
                    }}
                >
                    <Trophy size={36} color="#FFD700" fill="#FFD700" />
                    <Text style={styles.titleDark}>Lider Listesi</Text>
                    <Text style={styles.subtitleDark}>En iyi oyuncular burada!</Text>
                </Animated.View>
            </LinearGradient>

            {/* Tabs */}
            <View style={styles.tabsContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'points' && styles.tabActive]}
                    onPress={() => handleTabChange('points')}
                >
                    <Star size={18} color={activeTab === 'points' ? '#FFF' : '#718096'} />
                    <Text style={[styles.tabText, activeTab === 'points' && styles.tabTextActive]}>
                        Puan Lideri
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tab, activeTab === 'score' && styles.tabActive]}
                    onPress={() => handleTabChange('score')}
                >
                    <Trophy size={18} color={activeTab === 'score' ? '#FFF' : '#718096'} />
                    <Text style={[styles.tabText, activeTab === 'score' && styles.tabTextActive]}>
                        Skor Lideri
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Current User Position */}
            {currentUserRank > 0 && (
                <View style={styles.currentUserPosition}>
                    <Text style={styles.currentUserPositionText}>
                        🎯 Senin Sıran: #{currentUserRank}
                    </Text>
                </View>
            )}

            {/* Leaderboard List */}
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <Text style={styles.loadingText}>Yükleniyor...</Text>
                </View>
            ) : (
                <FlatList
                    data={leaderboard}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.user_id}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => fetchLeaderboard(activeTab, true)}
                            colors={[Colors.primary]}
                        />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Trophy size={48} color="#CBD5E0" />
                            <Text style={styles.emptyText}>Henüz lider yok!</Text>
                            <Text style={styles.emptySubtext}>İlk sen ol! 🚀</Text>
                        </View>
                    }
                />
            )}
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
        paddingTop: 60,
        paddingBottom: 24,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        alignItems: 'center',
    },
    titleDark: {
        fontSize: 28,
        fontWeight: '800',
        color: Colors.pureWhite,
        marginTop: 8,
    },
    subtitleDark: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.85)',
        marginTop: 4,
    },
    tabsContainer: {
        flexDirection: 'row',
        marginHorizontal: 24,
        marginTop: -16,
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 12,
        gap: 6,
    },
    tabActive: {
        backgroundColor: Colors.primary,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#718096',
    },
    tabTextActive: {
        color: '#FFF',
    },
    currentUserPosition: {
        marginHorizontal: 24,
        marginTop: 16,
        backgroundColor: '#EBF8FF',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#BEE3F8',
    },
    currentUserPositionText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2B6CB0',
        textAlign: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#718096',
    },
    listContainer: {
        padding: 24,
        paddingBottom: 100,
    },
    leaderboardItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    currentUserItem: {
        borderColor: Colors.primary,
        borderWidth: 2,
    },
    rankContainer: {
        width: 36,
        alignItems: 'center',
    },
    rankNumber: {
        fontSize: 16,
        fontWeight: '700',
        color: '#718096',
    },
    avatarContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
        overflow: 'hidden',
    },
    avatarText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFF',
    },
    avatarImage: {
        width: 42,
        height: 42,
        borderRadius: 21,
    },
    emojiAvatarContainer: {
        backgroundColor: '#FFF',
    },
    emojiAvatar: {
        fontSize: 24,
    },
    avatarWrapper: {
        position: 'relative',
    },
    badgeOverlay: {
        position: 'absolute',
        bottom: -2,
        right: -4,
        backgroundColor: '#FFF',
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    badgeOverlayEmoji: {
        fontSize: 12,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    badgeEmoji: {
        fontSize: 16,
    },
    userInfo: {
        flex: 1,
        marginLeft: 12,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2D3748',
    },
    currentUserName: {
        color: Colors.primary,
        fontWeight: '700',
    },
    ageGroup: {
        fontSize: 12,
        color: '#718096',
        marginTop: 2,
    },
    valueContainer: {
        alignItems: 'flex-end',
    },
    valueText: {
        fontSize: 18,
        fontWeight: '800',
        color: '#2D3748',
    },
    valueLabel: {
        fontSize: 12,
        color: '#718096',
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#718096',
        marginTop: 16,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#A0AEC0',
        marginTop: 4,
    },
});
