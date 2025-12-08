import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Image,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Play } from 'lucide-react-native';
import { useAppSelector } from '@/hooks/useAppSelector';
import { Game } from '@/types/game';
import { getGameEmoji, getCategoryColor } from '@/utils/gameIcons';

import Constants from 'expo-constants';

const SUPABASE_URL =
  (Constants.expoConfig?.extra as any)?.supabaseUrl ||
  process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY =
  (Constants.expoConfig?.extra as any)?.supabaseAnonKey ||
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export default function GameDetailScreen() {
  const { id } = useLocalSearchParams();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, session } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    fetchGame();
  }, [id]);

  const fetchGame = async () => {
    setLoading(true);
    setError(null);

    try {
      let url = `${SUPABASE_URL}/functions/v1/games-list`;

      if (user?.id) {
        url += `?user_id=${user.id}`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
      });

      const data: any = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch game');
      }

      const foundGame = (data.games as Game[] | undefined)?.find((g: Game) => g.id === id);

      if (!foundGame) {
        throw new Error('Game not found');
      }

      setGame(foundGame);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch game');
    } finally {
      setLoading(false);
    }
  };

  const handleStartGame = () => {
    if (!game) return;
    router.push(`/game/play/${game.id}` as any);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4299E1" />
      </View>
    );
  }

  if (error || !game) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error || 'Game not found'}</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Geri Dön</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
          <ArrowLeft size={24} color="#2D3748" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {game.image_url ? (
          <Image source={{ uri: game.image_url }} style={styles.heroImage} />
        ) : (
          <View style={[styles.heroImage, styles.placeholderHero, { backgroundColor: getCategoryColor(game.category) }]}>
            <Text style={styles.placeholderText}>{getGameEmoji((game.game_data as any)?.type || '', game.category)}</Text>
          </View>
        )}

        <View style={styles.content}>
          <Text style={styles.title}>{game.title}</Text>

          <View style={styles.metaRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{game.category}</Text>
            </View>
            <View style={[styles.badge, styles.difficultyBadge]}>
              <Text style={styles.badgeText}>{game.difficulty}</Text>
            </View>
            <View style={[styles.badge, styles.ageBadge]}>
              <Text style={styles.badgeText}>
                {game.min_age}-{game.max_age} yaş
              </Text>
            </View>
          </View>

          <View style={styles.pointsContainer}>
            <Text style={styles.pointsLabel}>Kazanılacak Puan:</Text>
            <Text style={styles.pointsValue}>{game.points}</Text>
          </View>

          <Text style={styles.sectionTitle}>Açıklama</Text>
          <Text style={styles.description}>{game.description}</Text>

          {game.user_progress && (
            <View style={styles.progressContainer}>
              <Text style={styles.sectionTitle}>İlerleme</Text>
              <View style={styles.progressRow}>
                <View style={styles.progressItem}>
                  <Text style={styles.progressLabel}>Skor</Text>
                  <Text style={styles.progressValue}>{game.user_progress.score}</Text>
                </View>
                <View style={styles.progressItem}>
                  <Text style={styles.progressLabel}>Durum</Text>
                  <Text style={styles.progressValue}>
                    {game.user_progress.completed ? '✓ Tamamlandı' : 'Devam Ediyor'}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStartGame}
        >
          <Play size={20} color="white" fill="white" />
          <Text style={styles.startButtonText}>Oyunu Başlat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  backIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  heroImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#E2E8F0',
  },
  placeholderHero: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4299E1',
  },
  placeholderText: {
    fontSize: 80,
    fontWeight: '700',
    color: 'white',
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#EDF2F7',
    marginRight: 8,
  },
  difficultyBadge: {
    backgroundColor: '#FED7E2',
  },
  ageBadge: {
    backgroundColor: '#C6F6D5',
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#F0FFF4',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#48BB78',
  },
  pointsLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginRight: 8,
  },
  pointsValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#48BB78',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#718096',
    marginBottom: 24,
  },
  progressContainer: {
    padding: 16,
    backgroundColor: '#EBF8FF',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4299E1',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  progressItem: {
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 4,
  },
  progressValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3748',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  startButton: {
    backgroundColor: '#48BB78',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  startButtonDisabled: {
    opacity: 0.6,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  errorText: {
    fontSize: 16,
    color: '#E53E3E',
    textAlign: 'center',
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: '#4299E1',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
