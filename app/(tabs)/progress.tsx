import { useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { TrendingUp, Target, Clock, Trophy, Star } from 'lucide-react-native';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { fetchGames } from '@/store/slices/gamesSlice';
import { restoreSession, ensureValidSession } from '@/store/slices/authSlice';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function ProgressScreen() {
  const dispatch = useAppDispatch();
  const { user, initialized } = useAppSelector((state) => state.auth);
  const { games, loading, error } = useAppSelector((state) => state.games);
  const headerAnim = useRef(new Animated.Value(0)).current;
  const float1 = useRef(new Animated.Value(0)).current;
  const float2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    console.log('Progress Screen - User:', user);
    console.log('Progress Screen - User ID:', user?.id);
    if (user?.id) {
      console.log('Fetching games for user:', user.id);
      dispatch(fetchGames({ userId: user.id }));
      dispatch(ensureValidSession());
    }
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) {
      dispatch(restoreSession());
    }
  }, []);

  useEffect(() => {
    if (initialized && user?.id) {
      console.log('Auth initialized, refetching games for user:', user.id);
      dispatch(fetchGames({ userId: user.id }));
      
    }
  }, [initialized, user?.id]);

  useFocusEffect(
    useCallback(() => {
      console.log('Focus effect triggered');
      if (user?.id) {
        console.log('Refetching games for user:', user.id);
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
  const completedGamesFromGames = games.filter((g) => g.user_progress?.completed).length;
  const totalGames = games.length;
  const totalTime = games.reduce((sum, g) => sum + (g.user_progress?.time_spent || 0), 0);
  
  // Auth state'den gelen değerleri kullan - game_progress yoksa bu değerler gösterilsin
  const authCompletedGames = user?.completed_games_count || 0;
  const authTotalScore = user?.total_points || 0;
  const completionRate = totalGames > 0 ? Math.round((authCompletedGames / totalGames) * 100) : 0;

  // Debug için console.log
  console.log('User:', user);
  console.log('Auth Completed Games:', authCompletedGames);
  console.log('Auth Total Score:', authTotalScore);
  console.log('Games with user_progress:', games.filter(g => g.user_progress !== null).length);
  console.log('Total Time from games:', totalTime);
  console.log('Total Games:', totalGames);

  const categoryStats = games.reduce((acc, game) => {
    const category = game.category;
    if (!acc[category]) {
      acc[category] = { total: 0, completed: 0, score: 0 };
    }
    acc[category].total += 1;
    if (game.user_progress?.completed) {
      acc[category].completed += 1;
      acc[category].score += game.user_progress?.score || 0; // Sadece tamamlanan oyunlarda skor ekle
    }
    return acc;
  }, {} as Record<string, { total: number; completed: number; score: number }>);

  const categoryLabels: Record<string, string> = {
    math: 'Matematik',
    language: 'Dil',
    logic: 'Mantık',
    memory: 'Hafıza',
    science: 'Bilim',
  };

  // Oyunlardaki skorların ortalamasını hesapla (auth state değil, gerçek oyun skorları)
  const completedGamesWithScores = games.filter((g) => g.user_progress?.completed && g.user_progress?.score !== undefined);
  const totalGameScores = completedGamesWithScores.reduce((sum, g) => sum + (g.user_progress?.score || 0), 0);
  const averageScore = completedGamesWithScores.length > 0 ? Math.round(totalGameScores / completedGamesWithScores.length) : 0;
  
  // Debug için yeni bilgiler
  console.log('=== HESAPLAMA DETAYLARI ===');
  console.log('Tamamlanan oyunlar (skorlu):', completedGamesWithScores.length);
  console.log('Toplam oyun skorları:', totalGameScores);
  console.log('Ortalama skor:', averageScore);
  console.log('Kategori istatistikleri:', categoryStats);
  
  // Auth state'den gelen değerleri kullan
  const displayCompletedGames = authCompletedGames;
  const displayTotalScore = authTotalScore;
  const hoursPlayed = Math.floor(totalTime / 3600);
  const minutesPlayed = Math.floor((totalTime % 3600) / 60);

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Hata: {error}</Text>
        <Text style={styles.errorSubtext}>Lütfen tekrar deneyin</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
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
          <Text style={styles.titleDark}>İlerleme</Text>
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

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#48BB78' }]}>
            <Trophy size={24} color="white" />
          </View>
          <Text style={styles.statValue}>{displayTotalScore}</Text>
          <Text style={styles.statLabel}>Toplam Puan</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#4299E1' }]}>
            <Target size={24} color="white" />
          </View>
          <Text style={styles.statValue}>{displayCompletedGames}</Text>
          <Text style={styles.statLabel}>Tamamlanan</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#F6AD55' }]}>
            <Star size={24} color="white" />
          </View>
          <Text style={styles.statValue}>{averageScore}</Text>
          <Text style={styles.statLabel}>Ort. Skor</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#ED8936' }]}>
            <Clock size={24} color="white" />
          </View>
          <Text style={styles.statValue}>{hoursPlayed}s {minutesPlayed}d</Text>
          <Text style={styles.statLabel}>Süre</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <TrendingUp size={20} color="#2D3748" />
          <Text style={styles.sectionTitle}>Genel İstatistikler</Text>
        </View>

        <View style={styles.progressCard}>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>Tamamlanan Oyunlar</Text>
            <Text style={styles.progressValue}>{displayCompletedGames} / {totalGames}</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${completionRate}%` }]} />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kategori Performansı</Text>

        {Object.entries(categoryStats).map(([category, stats]) => {
          const categoryCompletion = stats.total > 0
            ? Math.round((stats.completed / stats.total) * 100)
            : 0;

          return (
            <View key={category} style={styles.categoryCard}>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryName}>{categoryLabels[category] || category}</Text>
                <Text style={styles.categoryScore}>{stats.score} skor</Text>
              </View>

              <View style={styles.categoryStats}>
                <Text style={styles.categoryText}>
                  {stats.completed} / {stats.total} tamamlandı
                </Text>
                <Text style={[styles.categoryPercentage, { color: categoryCompletion === 100 ? '#48BB78' : '#4299E1' }]}>
                  %{categoryCompletion}
                </Text>
              </View>

              <View style={styles.categoryProgressBar}>
                <View
                  style={[
                    styles.categoryProgressFill,
                    { width: `${categoryCompletion}%` }
                  ]}
                />
              </View>
            </View>
          );
        })}

        {Object.keys(categoryStats).length === 0 && displayCompletedGames > 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📊</Text>
            <Text style={styles.emptyText}>Toplam {displayCompletedGames} oyun tamamlandı</Text>
            <Text style={styles.emptySubtext}>Kategori bazlı istatistikler için oyun oynamaya devam edin!</Text>
          </View>
        )}

        {Object.keys(categoryStats).length === 0 && displayCompletedGames === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📊</Text>
            <Text style={styles.emptyText}>Henüz oyun oynamadınız</Text>
            <Text style={styles.emptySubtext}>Oyun oynamaya başlayın ve ilerlemenizi takip edin!</Text>
          </View>
        )}
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
    alignItems: 'center',
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  statCard: {
    width: (SCREEN_WIDTH - 56) / 2,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2D3748',
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
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 16,
  },
  progressCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
  },
  progressValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4299E1',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#48BB78',
    borderRadius: 4,
  },
  categoryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3748',
  },
  categoryScore: {
    fontSize: 14,
    fontWeight: '600',
    color: '#48BB78',
  },
  categoryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    color: '#718096',
  },
  categoryPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4299E1',
  },
  categoryProgressBar: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  categoryProgressFill: {
    height: '100%',
    backgroundColor: '#4299E1',
    borderRadius: 3,
  },
  emptyState: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E53E3E',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
  },
});
