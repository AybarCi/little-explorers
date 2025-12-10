import { useEffect, useCallback, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Easing,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { Zap, Target, Award, TrendingUp, CheckCircle, Circle, Gift } from 'lucide-react-native';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { fetchGames } from '@/store/slices/gamesSlice';
import { updateUserPoints } from '@/store/slices/authSlice';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import Constants from 'expo-constants';

const SUPABASE_URL = Constants.expoConfig?.extra?.supabaseUrl;
const SUPABASE_ANON_KEY = Constants.expoConfig?.extra?.supabaseAnonKey;

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'special';
  target: number;
  current: number;
  reward: number;
  icon: typeof Zap;
  color: string;
}

interface ChallengeLevels {
  daily_level: number;
  weekly_level: number;
  special_level: number;
  daily_round: number;
  weekly_round: number;
  special_round: number;
}

interface ClaimedChallenges {
  daily: string[];
  weekly: string[];
  special: string[];
}

interface ChallengeDataResponse {
  levels?: ChallengeLevels;
  claims?: ClaimedChallenges;
}

interface ClaimResponse {
  success?: boolean;
  already_claimed?: boolean;
  new_total_points?: number;
  error?: string;
}

// Level multipliers for progressive difficulty
const getLevelMultiplier = (level: number): { target: number; reward: number } => {
  const multipliers: Record<number, { target: number; reward: number }> = {
    1: { target: 1.0, reward: 1.0 },
    2: { target: 1.5, reward: 1.3 },
    3: { target: 2.0, reward: 1.6 },
    4: { target: 2.5, reward: 2.0 },
  };
  return multipliers[Math.min(level, 4)] || { target: 3.0, reward: 2.5 };
};

export default function ChallengesScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { games } = useAppSelector((state) => state.games);
  const headerAnim = useRef(new Animated.Value(0)).current;
  const float1 = useRef(new Animated.Value(0)).current;
  const float2 = useRef(new Animated.Value(0)).current;

  const [levels, setLevels] = useState<ChallengeLevels>({
    daily_level: 1, weekly_level: 1, special_level: 1,
    daily_round: 1, weekly_round: 1, special_round: 1,
  });
  const [claimedChallenges, setClaimedChallenges] = useState<ClaimedChallenges>({
    daily: [], weekly: [], special: [],
  });
  const [claiming, setClaiming] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch challenge data
  const fetchChallengeData = useCallback(async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/get-challenge-data?user_id=${user.id}`,
        {
          headers: {
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'apikey': SUPABASE_ANON_KEY || '',
          },
        }
      );
      const data = await response.json() as ChallengeDataResponse;

      if (data.levels) setLevels(data.levels);
      if (data.claims) setClaimedChallenges(data.claims);
    } catch (error) {
      console.error('Error fetching challenge data:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchGames({ userId: user.id }));
      fetchChallengeData();
    }
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      if (user?.id) {
        dispatch(fetchGames({ userId: user.id }));
        fetchChallengeData();
      }
    }, [user?.id, dispatch, fetchChallengeData])
  );

  useEffect(() => {
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 700,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(float1, { toValue: 1, duration: 2400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(float1, { toValue: 0, duration: 2400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(float2, { toValue: 1, duration: 2200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(float2, { toValue: 0, duration: 2200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const totalScore = user?.total_points || 0;
  const completedGames = games.filter((g) => g.user_progress?.completed).length;
  const gamesPlayed = games.filter((g) => g.user_progress).length;

  // Generate challenges with level multipliers
  const dailyMult = getLevelMultiplier(levels.daily_level);
  const weeklyMult = getLevelMultiplier(levels.weekly_level);
  const specialMult = getLevelMultiplier(levels.special_level);

  const dailyChallenges: Challenge[] = [
    {
      id: 'd1',
      title: `${Math.round(3 * dailyMult.target)} Oyun Tamamla`,
      description: 'Bugün oyunları tamamla',
      type: 'daily',
      target: Math.round(3 * dailyMult.target),
      current: Math.min(completedGames, Math.round(3 * dailyMult.target)),
      reward: Math.round(50 * dailyMult.reward),
      icon: Target,
      color: '#4299E1',
    },
    {
      id: 'd2',
      title: `${Math.round(100 * dailyMult.target)} Puan Kazan`,
      description: 'Bugün puan topla',
      type: 'daily',
      target: Math.round(100 * dailyMult.target),
      current: Math.min(totalScore, Math.round(100 * dailyMult.target)),
      reward: Math.round(30 * dailyMult.reward),
      icon: Zap,
      color: '#F6AD55',
    },
    {
      id: 'd3',
      title: 'Matematik Ustası',
      description: 'Bir matematik oyunu tamamla',
      type: 'daily',
      target: 1,
      current: games.filter(g => g.category === 'math' && g.user_progress?.completed).length > 0 ? 1 : 0,
      reward: Math.round(40 * dailyMult.reward),
      icon: TrendingUp,
      color: '#48BB78',
    },
  ];

  const weeklyChallenges: Challenge[] = [
    {
      id: 'w1',
      title: `${Math.round(10 * weeklyMult.target)} Oyun Tamamla`,
      description: 'Bu hafta oyunları tamamla',
      type: 'weekly',
      target: Math.round(10 * weeklyMult.target),
      current: Math.min(completedGames, Math.round(10 * weeklyMult.target)),
      reward: Math.round(200 * weeklyMult.reward),
      icon: Target,
      color: '#ED8936',
    },
    {
      id: 'w2',
      title: `${Math.round(500 * weeklyMult.target)} Puan Topla`,
      description: 'Bu hafta puan kazan',
      type: 'weekly',
      target: Math.round(500 * weeklyMult.target),
      current: Math.min(totalScore, Math.round(500 * weeklyMult.target)),
      reward: Math.round(150 * weeklyMult.reward),
      icon: Award,
      color: '#9F7AEA',
    },
  ];

  const specialChallenges: Challenge[] = [
    {
      id: 's1',
      title: 'Hepsini Tamamla',
      description: 'Tüm oyunları en az bir kez tamamla',
      type: 'special',
      target: games.length || 10,
      current: completedGames,
      reward: Math.round(500 * specialMult.reward),
      icon: Award,
      color: '#E53E3E',
    },
    {
      id: 's2',
      title: 'Oyun Koleksiyoncusu',
      description: `${Math.round(20 * specialMult.target)} farklı oyun oyna`,
      type: 'special',
      target: Math.round(20 * specialMult.target),
      current: Math.min(gamesPlayed, Math.round(20 * specialMult.target)),
      reward: Math.round(300 * specialMult.reward),
      icon: Zap,
      color: '#38B2AC',
    },
  ];

  const handleClaimReward = async (challenge: Challenge) => {
    if (!user?.id || claiming) return;

    setClaiming(challenge.id);
    try {
      const round = challenge.type === 'daily' ? levels.daily_round
        : challenge.type === 'weekly' ? levels.weekly_round
          : levels.special_round;

      const response = await fetch(`${SUPABASE_URL}/functions/v1/claim-challenge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'apikey': SUPABASE_ANON_KEY || '',
        },
        body: JSON.stringify({
          user_id: user.id,
          challenge_id: challenge.id,
          challenge_type: challenge.type,
          reward_points: challenge.reward,
          challenge_round: round,
        }),
      });

      const data = await response.json() as ClaimResponse;

      console.log('Claim response status:', response.status);
      console.log('Claim response data:', data);

      if (data.success) {
        // Update local state
        setClaimedChallenges(prev => ({
          ...prev,
          [challenge.type]: [...prev[challenge.type], challenge.id],
        }));

        // Update user points in Redux
        if (data.new_total_points !== undefined) {
          dispatch(updateUserPoints(data.new_total_points));
        }

        Alert.alert('🎉 Tebrikler!', `+${challenge.reward} puan kazandın!`);
      } else if (data.already_claimed) {
        Alert.alert('Bilgi', 'Bu ödülü zaten aldın!');
      } else {
        console.error('Claim failed:', data);
        Alert.alert('Hata', data.error || 'Ödül alınamadı');
      }
    } catch (error) {
      console.error('Claim error:', error);
      Alert.alert('Hata', 'Bir sorun oluştu');
    } finally {
      setClaiming(null);
    }
  };

  const isChallengeCompleted = (challenge: Challenge) => challenge.current >= challenge.target;
  const isChallengeClaimed = (challenge: Challenge) => claimedChallenges[challenge.type].includes(challenge.id);

  const renderChallenge = (challenge: Challenge) => {
    const isCompleted = isChallengeCompleted(challenge);
    const isClaimed = isChallengeClaimed(challenge);
    const progress = Math.round((challenge.current / challenge.target) * 100);
    const isClaiming = claiming === challenge.id;

    return (
      <View
        key={challenge.id}
        style={[
          styles.challengeCard,
          isCompleted && styles.challengeCardCompleted,
          isClaimed && styles.challengeCardClaimed,
        ]}
      >
        <View style={styles.challengeHeader}>
          <View style={[styles.challengeIcon, { backgroundColor: challenge.color }]}>
            <challenge.icon size={24} color="white" />
          </View>
          <View style={styles.challengeInfo}>
            <Text style={styles.challengeTitle}>{challenge.title}</Text>
            <Text style={styles.challengeDescription}>{challenge.description}</Text>
          </View>
          {isClaimed ? (
            <View style={styles.claimedBadge}>
              <CheckCircle size={24} color="#48BB78" />
              <Text style={styles.claimedText}>Alındı</Text>
            </View>
          ) : isCompleted ? (
            <TouchableOpacity
              style={styles.claimButton}
              onPress={() => handleClaimReward(challenge)}
              disabled={isClaiming}
            >
              {isClaiming ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <>
                  <Gift size={18} color="#FFF" />
                  <Text style={styles.claimButtonText}>Ödül Al</Text>
                </>
              )}
            </TouchableOpacity>
          ) : (
            <Circle size={28} color="#CBD5E0" />
          )}
        </View>

        <View style={styles.challengeProgress}>
          <View style={styles.progressInfo}>
            <Text style={styles.progressText}>
              {challenge.current} / {challenge.target}
            </Text>
            <Text style={[styles.rewardText, isClaimed && styles.rewardTextClaimed]}>
              +{challenge.reward} puan
            </Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                { width: `${Math.min(progress, 100)}%`, backgroundColor: challenge.color },
              ]}
            />
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Görevler yükleniyor...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
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
          <Text style={styles.titleDark}>Meydan Okuma</Text>
          <Text style={styles.subtitleDark}>Görevleri tamamla, ödülleri kazan!</Text>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>Seviye {levels.daily_level}</Text>
          </View>
        </Animated.View>
        <Animated.View style={[styles.floatShape, { backgroundColor: Colors.secondary, transform: [{ translateY: float1.interpolate({ inputRange: [0, 1], outputRange: [0, 10] }) }], left: 24, top: 38 }]} />
        <Animated.View style={[styles.floatShapeSmall, { backgroundColor: Colors.highlight, transform: [{ translateY: float2.interpolate({ inputRange: [0, 1], outputRange: [0, -8] }) }], right: 28, bottom: 18 }]} />
      </LinearGradient>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Zap size={20} color="#F6AD55" />
          <Text style={styles.sectionTitle}>Günlük Görevler</Text>
          <Text style={styles.levelIndicator}>Lv.{levels.daily_level}</Text>
        </View>
        {dailyChallenges.map(renderChallenge)}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Target size={20} color="#ED8936" />
          <Text style={styles.sectionTitle}>Haftalık Görevler</Text>
          <Text style={styles.levelIndicator}>Lv.{levels.weekly_level}</Text>
        </View>
        {weeklyChallenges.map(renderChallenge)}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Award size={20} color="#9F7AEA" />
          <Text style={styles.sectionTitle}>Özel Zorluklar</Text>
        </View>
        {specialChallenges.map(renderChallenge)}
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>🎮 Nasıl Çalışır?</Text>
        <Text style={styles.infoText}>
          Görevleri tamamla, "Ödül Al" butonuna bas ve puanları kazan! Her tur tamamlandığında seviye artar ve görevler zorlaşır ama ödüller de büyür!
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FAFC' },
  loadingContainer: { justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 16, color: '#718096' },
  headerGradient: {
    paddingHorizontal: 24, paddingTop: 60, paddingBottom: 24,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24, overflow: 'hidden',
  },
  titleDark: { fontSize: 28, fontWeight: '800', color: Colors.pureWhite, textAlign: 'center', marginBottom: 4 },
  subtitleDark: { fontSize: 16, color: 'rgba(255,255,255,0.85)', textAlign: 'center' },
  levelBadge: { backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginTop: 12 },
  levelText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
  floatShape: { position: 'absolute', width: 24, height: 24, borderRadius: 12, opacity: 0.85 },
  floatShapeSmall: { position: 'absolute', width: 14, height: 14, borderRadius: 7, opacity: 0.9 },
  section: { paddingHorizontal: 24, marginTop: 24 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 8 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#2D3748', flex: 1 },
  levelIndicator: { fontSize: 12, fontWeight: '700', color: '#9F7AEA', backgroundColor: '#F3E8FF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  challengeCard: { backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 2, borderColor: '#E2E8F0' },
  challengeCardCompleted: { borderColor: '#48BB78', backgroundColor: '#F0FFF4' },
  challengeCardClaimed: { borderColor: '#CBD5E0', backgroundColor: '#F7FAFC', opacity: 0.8 },
  challengeHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  challengeIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  challengeInfo: { flex: 1 },
  challengeTitle: { fontSize: 16, fontWeight: '700', color: '#2D3748', marginBottom: 4 },
  challengeDescription: { fontSize: 14, color: '#718096' },
  claimButton: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#48BB78', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12 },
  claimButtonText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
  claimedBadge: { alignItems: 'center' },
  claimedText: { fontSize: 11, color: '#48BB78', fontWeight: '600', marginTop: 2 },
  challengeProgress: { marginTop: 8 },
  progressInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  progressText: { fontSize: 14, fontWeight: '600', color: '#2D3748' },
  rewardText: { fontSize: 14, fontWeight: '700', color: '#48BB78' },
  rewardTextClaimed: { color: '#A0AEC0', textDecorationLine: 'line-through' },
  progressBarContainer: { height: 8, backgroundColor: '#E2E8F0', borderRadius: 4, overflow: 'hidden' },
  progressBar: { height: '100%', borderRadius: 4 },
  infoBox: { margin: 24, backgroundColor: '#EBF8FF', borderRadius: 12, padding: 20, borderWidth: 1, borderColor: '#BEE3F8' },
  infoTitle: { fontSize: 16, fontWeight: '700', color: '#2C5282', marginBottom: 8 },
  infoText: { fontSize: 14, color: '#2C5282', lineHeight: 20 },
});
