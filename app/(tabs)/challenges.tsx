import { useEffect, useCallback, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { Zap, Target, Award, TrendingUp, CheckCircle, Circle } from 'lucide-react-native';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { fetchGames } from '@/store/slices/gamesSlice';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';

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

export default function ChallengesScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { games } = useAppSelector((state) => state.games);
  const headerAnim = useRef(new Animated.Value(0)).current;
  const float1 = useRef(new Animated.Value(0)).current;
  const float2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchGames({ userId: user.id }));
    }
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      if (user?.id) {
        dispatch(fetchGames({ userId: user.id }));
      }
    }, [user?.id, dispatch])
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
        Animated.timing(float1, {
          toValue: 1,
          duration: 2400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(float1, {
          toValue: 0,
          duration: 2400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(float2, {
          toValue: 1,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(float2, {
          toValue: 0,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Kullanıcının toplam puanını auth state'den al
  const totalScore = user?.total_points || 0;
  const completedGames = games.filter((g) => g.user_progress?.completed).length;
  const gamesPlayed = games.filter((g) => g.user_progress).length;

  const dailyChallenges: Challenge[] = [
    {
      id: 'd1',
      title: '3 Oyun Tamamla',
      description: 'Bugün 3 farklı oyun tamamla',
      type: 'daily',
      target: 3,
      current: Math.min(completedGames, 3),
      reward: 50,
      icon: Target,
      color: '#4299E1',
    },
    {
      id: 'd2',
      title: '100 Puan Kazan',
      description: 'Bugün toplam 100 puan topla',
      type: 'daily',
      target: 100,
      current: Math.min(totalScore, 100),
      reward: 30,
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
      reward: 40,
      icon: TrendingUp,
      color: '#48BB78',
    },
  ];

  const weeklyChallenges: Challenge[] = [
    {
      id: 'w1',
      title: '10 Oyun Tamamla',
      description: 'Bu hafta 10 oyun tamamla',
      type: 'weekly',
      target: 10,
      current: Math.min(completedGames, 10),
      reward: 200,
      icon: Target,
      color: '#ED8936',
    },
    {
      id: 'w2',
      title: '500 Puan Topla',
      description: 'Bu hafta 500 puan kazan',
      type: 'weekly',
      target: 500,
      current: Math.min(totalScore, 500),
      reward: 150,
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
      target: games.length,
      current: completedGames,
      reward: 500,
      icon: Award,
      color: '#E53E3E',
    },
    {
      id: 's2',
      title: 'Oyun Koleksiyoncusu',
      description: '20 farklı oyun oyna',
      type: 'special',
      target: 20,
      current: Math.min(gamesPlayed, 20),
      reward: 300,
      icon: Zap,
      color: '#38B2AC',
    },
  ];

  const renderChallenge = (challenge: Challenge) => {
    const isCompleted = challenge.current >= challenge.target;
    const progress = Math.round((challenge.current / challenge.target) * 100);

    return (
      <TouchableOpacity
        key={challenge.id}
        style={[
          styles.challengeCard,
          isCompleted && styles.challengeCardCompleted,
        ]}
        activeOpacity={0.7}
        onPress={() => router.push('/(tabs)/games')}
      >
        <View style={styles.challengeHeader}>
          <View style={[styles.challengeIcon, { backgroundColor: challenge.color }]}>
            <challenge.icon size={24} color="white" />
          </View>
          <View style={styles.challengeInfo}>
            <Text style={styles.challengeTitle}>{challenge.title}</Text>
            <Text style={styles.challengeDescription}>{challenge.description}</Text>
          </View>
          {isCompleted ? (
            <CheckCircle size={28} color="#48BB78" />
          ) : (
            <Circle size={28} color="#CBD5E0" />
          )}
        </View>

        <View style={styles.challengeProgress}>
          <View style={styles.progressInfo}>
            <Text style={styles.progressText}>
              {challenge.current} / {challenge.target}
            </Text>
            <Text style={styles.rewardText}>+{challenge.reward} puan</Text>
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
      </TouchableOpacity>
    );
  };

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
        </Animated.View>
        <Animated.View
          style={[
            styles.floatShape,
            {
              backgroundColor: Colors.secondary,
              transform: [{ translateY: float1.interpolate({ inputRange: [0, 1], outputRange: [0, 10] }) }],
              left: 24,
              top: 38,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.floatShapeSmall,
            {
              backgroundColor: Colors.highlight,
              transform: [{ translateY: float2.interpolate({ inputRange: [0, 1], outputRange: [0, -8] }) }],
              right: 28,
              bottom: 18,
            },
          ]}
        />
      </LinearGradient>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Zap size={20} color="#F6AD55" />
          <Text style={styles.sectionTitle}>Günlük Görevler</Text>
        </View>
        {dailyChallenges.map(renderChallenge)}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Target size={20} color="#ED8936" />
          <Text style={styles.sectionTitle}>Haftalık Görevler</Text>
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
        <Text style={styles.infoTitle}>Nasıl Çalışır?</Text>
        <Text style={styles.infoText}>
          Görevleri tamamlayarak ekstra puan kazanabilirsin. Her gün yeni günlük görevler gelir, haftalık görevler ise her hafta yenilenir. Özel zorluklar ise her zaman aktiftir!
        </Text>
      </View>
    </ScrollView>
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
    overflow: 'hidden',
  },
  titleDark: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.pureWhite,
    letterSpacing: 0.5,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitleDark: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
  },
  floatShape: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    opacity: 0.85,
  },
  floatShapeSmall: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    opacity: 0.9,
  },
  section: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3748',
  },
  challengeCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  challengeCardCompleted: {
    borderColor: '#48BB78',
    backgroundColor: '#F0FFF4',
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  challengeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  challengeInfo: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 4,
  },
  challengeDescription: {
    fontSize: 14,
    color: '#718096',
  },
  challengeProgress: {
    marginTop: 8,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
  },
  rewardText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#48BB78',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  infoBox: {
    margin: 24,
    backgroundColor: '#EBF8FF',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#BEE3F8',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C5282',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#2C5282',
    lineHeight: 20,
  },
});
