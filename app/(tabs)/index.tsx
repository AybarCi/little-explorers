import { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { BookOpen, Trophy, TrendingUp, Zap } from 'lucide-react-native';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { fetchGames } from '@/store/slices/gamesSlice';

export default function HomeScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { games } = useAppSelector((state) => state.games);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchGames({ userId: user.id }));
    }
  }, [user?.id]);

  const completedGames = games.filter((g) => g.user_progress?.completed).length;
  const totalScore = games.reduce(
    (sum, g) => sum + (g.user_progress?.score || 0),
    0
  );

  const quickActions = [
    {
      icon: BookOpen,
      label: 'Oyunlar',
      color: '#4299E1',
      onPress: () => router.push('/(tabs)/games'),
    },
    {
      icon: Trophy,
      label: 'Başarılar',
      color: '#48BB78',
      onPress: () => {},
    },
    {
      icon: TrendingUp,
      label: 'İlerleme',
      color: '#ED8936',
      onPress: () => {},
    },
    {
      icon: Zap,
      label: 'Meydan Okuma',
      color: '#9F7AEA',
      onPress: () => {},
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Merhaba,</Text>
          <Text style={styles.userName}>{user?.full_name}!</Text>
        </View>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {user?.full_name?.charAt(0).toUpperCase()}
          </Text>
        </View>
      </View>

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
        <View style={styles.quickActionsGrid}>
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
        </View>
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
    backgroundColor: '#F7FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
    backgroundColor: 'white',
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
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4299E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
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
  },
  statIcon: {
    marginBottom: 8,
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 16,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4299E1',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderLeftWidth: 4,
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
    color: '#2D3748',
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
  },
  gameIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4299E1',
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
    color: '#2D3748',
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
    color: '#48BB78',
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
    backgroundColor: '#4299E1',
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
