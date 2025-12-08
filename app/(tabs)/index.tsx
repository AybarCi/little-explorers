import { useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { BookOpen, Trophy, TrendingUp, Zap } from 'lucide-react-native';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { fetchGames } from '@/store/slices/gamesSlice';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';

export default function HomeScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { games } = useAppSelector((state) => state.games);
  const headerAnim = useRef(new Animated.Value(0)).current;
  const float1 = useRef(new Animated.Value(0)).current;
  const float2 = useRef(new Animated.Value(0)).current;
  const gridAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchGames({ userId: user.id }));
    }
  }, [user?.id]);

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
          duration: 2600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(float1, {
          toValue: 0,
          duration: 2600,
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
    Animated.timing(gridAnim, {
      toValue: 1,
      duration: 600,
      delay: 200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (user?.id) {
        dispatch(fetchGames({ userId: user.id }));
      }
    }, [user?.id, dispatch])
  );

  const completedGames = user?.completed_games_count || 0;
  const totalScore = user?.total_points || 0;

  const quickActions = [
    {
      icon: BookOpen,
      label: 'Oyunlar',
      color: '#4299E1',
      onPress: () => router.push('/(tabs)/games'),
    },
    {
      icon: TrendingUp,
      label: 'İlerleme',
      color: '#ED8936',
      onPress: () => router.push('/(tabs)/progress'),
    },
    {
      icon: Zap,
      label: 'Görevler',
      color: '#9F7AEA',
      onPress: () => router.push('/(tabs)/challenges'),
    },
    {
      icon: Trophy,
      label: 'Profil',
      color: '#48BB78',
      onPress: () => router.push('/(tabs)/profile'),
    },
  ];

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
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            transform: [{ translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
            opacity: headerAnim,
          }}
        >
          <View>
            <Text style={styles.greetingDark}>Merhaba,</Text>
            <Text style={styles.userNameDark}>{user?.full_name}!</Text>
          </View>
          <View style={styles.avatarContainerDark}>
            <Text style={styles.avatarTextDark}>
              {user?.full_name?.charAt(0).toUpperCase()}
            </Text>
          </View>
        </Animated.View>
        <Animated.View
          style={[
            styles.floatShape,
            {
              backgroundColor: Colors.secondary,
              transform: [{ translateY: float1.interpolate({ inputRange: [0, 1], outputRange: [0, 10] }) }],
              left: 24,
              top: 40,
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
              bottom: 24,
            },
          ]}
        />
      </LinearGradient>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <Trophy size={24} color="#48BB78" />
          </View>
          <Text style={styles.statValue}>{totalScore}</Text>
          <Text style={styles.statLabel}>Toplam Puan</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <BookOpen size={24} color="#4299E1" />
          </View>
          <Text style={styles.statValue}>{completedGames}</Text>
          <Text style={styles.statLabel}>Tamamlanan</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <Zap size={24} color="#F6AD55" />
          </View>
          <Text style={styles.statValue}>{user?.age_group}</Text>
          <Text style={styles.statLabel}>Yaş Grubu</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hızlı Erişim</Text>
        <Animated.View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 12,
            transform: [{ translateY: gridAnim.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }],
            opacity: gridAnim,
          }}
        >
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.actionCard, { borderLeftColor: action.color }]}
              onPress={action.onPress}
            >
              <View
                style={[styles.actionIcon, { backgroundColor: action.color }]}
              >
                <action.icon size={24} color="white" />
              </View>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Devam Eden Oyunlar</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/games')}>
            <Text style={styles.seeAll}>Tümünü Gör</Text>
          </TouchableOpacity>
        </View>

        {games
          .filter((g) => g.user_progress && !g.user_progress.completed)
          .slice(0, 3)
          .map((game) => (
            <TouchableOpacity
              key={game.id}
              style={styles.gameCard}
              onPress={() => router.push(`/game/${game.id}` as any)}
            >
              <View style={styles.gameIconContainer}>
                <Text style={styles.gameIcon}>{game.title.charAt(0)}</Text>
              </View>
              <View style={styles.gameInfo}>
                <Text style={styles.gameTitle}>{game.title}</Text>
                <Text style={styles.gameCategory}>{game.category}</Text>
              </View>
              <View style={styles.gameScore}>
                <Text style={styles.scoreValue}>
                  {game.user_progress?.score || 0}
                </Text>
                <Text style={styles.scoreLabel}>puan</Text>
              </View>
            </TouchableOpacity>
          ))}

        {games.filter((g) => g.user_progress && !g.user_progress.completed)
          .length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🎮</Text>
              <Text style={styles.emptyText}>Henüz oyun başlatmadınız</Text>
              <TouchableOpacity
                style={styles.startButton}
                onPress={() => router.push('/(tabs)/games')}
              >
                <Text style={styles.startButtonText}>Oyunları Keşfet</Text>
              </TouchableOpacity>
            </View>
          )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.pureWhite,
  },
  headerGradient: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
  },
  greeting: {
    fontSize: 16,
    color: '#718096',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2D3748',
  },
  greetingDark: {
    fontSize: 16,
    color: Colors.pureWhite,
  },
  userNameDark: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.pureWhite,
    letterSpacing: 0.5,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4299E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarContainerDark: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
  },
  avatarTextDark: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.pureWhite,
  },
  floatShape: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    opacity: 0.8,
  },
  floatShapeSmall: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    opacity: 0.9,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: Colors.spacePurple,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  statIcon: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.spacePurple,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#718096',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.spacePurple,
    marginBottom: 16,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4299E1',
  },
  actionCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderLeftWidth: 4,
    shadowColor: Colors.spacePurple,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.spacePurple,
  },
  gameCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: Colors.spacePurple,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  gameIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  gameIcon: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
  },
  gameInfo: {
    flex: 1,
  },
  gameTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.spacePurple,
    marginBottom: 4,
  },
  gameCategory: {
    fontSize: 14,
    color: '#718096',
  },
  gameScore: {
    alignItems: 'flex-end',
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.success,
  },
  scoreLabel: {
    fontSize: 12,
    color: '#718096',
  },
  emptyState: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#718096',
    marginBottom: 16,
  },
  startButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  startButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
