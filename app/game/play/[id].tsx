import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Trophy } from 'lucide-react-native';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { fetchGames, saveGameProgress, fetchUserProgress } from '@/store/slices/gamesSlice';
import { ensureValidSession, refreshSession, updateUserStats } from '@/store/slices/authSlice';
import { Game } from '@/types/game';
import { AuthSession } from '@/types/auth';
import MathGame from '@/components/games/MathGame';
import MemoryGame from '@/components/games/MemoryGame';
import WordHuntGame from '@/components/games/WordHuntGame';
import LetterSortGame from '@/components/games/LetterSortGame';
import PictureMemoryGame from '@/components/games/PictureMemoryGame';
import LogicPuzzleGame from '@/components/games/LogicPuzzleGame';
import PatternCompleteGame from '@/components/games/PatternCompleteGame';
import ScienceQuizGame from '@/components/games/ScienceQuizGame';
import HangmanGame from '@/components/games/HangmanGame';
import ColorTubeGame from '@/components/games/ColorTubeGame';
import PictureWordGame from '@/components/games/PictureWordGame';

import Constants from 'expo-constants';
const SUPABASE_URL =
  (Constants.expoConfig?.extra as any)?.supabaseUrl ||
  process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY =
  (Constants.expoConfig?.extra as any)?.supabaseAnonKey ||
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

interface GamesListResponse {
  games: Game[];
  error?: string;
}

export default function PlayGameScreen() {
  const { id } = useLocalSearchParams();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { user, session: currentSession } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [startTime] = useState(Date.now());

  useEffect(() => {
    fetchGame();
  }, [id]);

  const fetchGame = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        setError('Missing Supabase configuration');
        setLoading(false);
        return;
      }
      let url = `${SUPABASE_URL}/functions/v1/games-list`;

      if (user?.id) {
        url += `?user_id=${user.id}`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
      });

      const data = (await response.json()) as GamesListResponse;

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch game');
      }

      const foundGame = data.games?.find((g: Game) => g.id === id);

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

  const isSessionExpired = (session: AuthSession): boolean => {
    if (!session?.expires_at) return true;
    const now = Math.floor(Date.now() / 1000);
    return session.expires_at <= now;
  };

  const handleGameComplete = async (score: number) => {
    if (!game || !user) {
      console.warn('Cannot save progress: Missing game, session, or user');
      Alert.alert('Hata', 'Oturumunuz bulunamadı. Lütfen tekrar giriş yapın.');
      router.replace('/(auth)/signin');
      return;
    }

    let session: AuthSession | null = null;
    try {
      const ensured = await dispatch(ensureValidSession()).unwrap();
      session = ensured as AuthSession;
    } catch (e) {
      Alert.alert('Hata', 'Oturumunuz süresi dolmuş. Lütfen tekrar giriş yapın.');
      router.replace('/(auth)/signin');
      return;
    }

    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    setFinalScore(score);
    setCompleted(true);

    try {
      console.log('SaveGameProgress request payload:', {
        user_id: user.id,
        game_id: game.id,
        score,
        completed: true,
        time_spent: timeSpent,
      });
      console.log('Attempting to save progress with token:', session.access_token?.substring(0, 20) + '...');
      console.log('Session expires at:', session.expires_at, 'Current time:', Math.floor(Date.now() / 1000));

      // 1. Oyun ilerlemesini kaydet (Redux thunk kullan)
      const progressResult = await dispatch(saveGameProgress({
        userId: user.id,
        game_id: game.id,
        score,
        completed: true,
        time_spent: timeSpent,
      })).unwrap();

      console.log('SaveGameProgress response payload:', progressResult);

      // 2. Kullanıcı istatistiklerini güncelle - oyunun tanımlı puanını kullan
      dispatch(updateUserStats({
        points: game.points,
        completedGames: 1
      }));

      // 3. Store'u güncelle - böylece tüm ekranlar güncel kalır
      if (user?.id) {
        dispatch(fetchGames({ userId: user.id }));
        dispatch(fetchUserProgress({ userId: user.id }));
      }

      // 4. Başarılı tamamlama bildirimi (opsiyonel)
      console.log(`Oyun tamamlandı! Skor: ${score}, Kazanılan Puan: ${game.points}, Süre: ${timeSpent}s`);

    } catch (err) {
      console.error('Save progress error:', err);
      // Hata durumunda kullanıcıya bildirim göster
      let errorMessage = 'İlerleme kaydedilemedi. Lütfen tekrar deneyin.';

      if (err instanceof Error) {
        if (err.message.includes('Invalid JWT') || err.message.includes('Unauthorized')) {
          errorMessage = 'Oturumunuz süresi dolmuş. Lütfen tekrar giriş yapın.';
          // Optionally redirect to login after showing the alert
          setTimeout(() => {
            router.replace('/(auth)/signin');
          }, 2000);
        } else {
          errorMessage = err.message;
        }
      }

      Alert.alert('Hata', errorMessage);
    }
  };

  const renderGame = () => {
    if (!game) return null;

    const gameData = game.game_data as any;
    const ageGroup = user?.age_group || '8-10';

    switch (gameData.type) {
      case 'addition':
      case 'subtraction':
      case 'multiplication':
        return (
          <MathGame
            gameType={gameData.type}
            maxNumber={gameData.maxNumber || 20}
            questionCount={gameData.questionCount || 10}
            onComplete={handleGameComplete}
            ageGroup={ageGroup}
          />
        );

      case 'memory_match':
      case 'memory_cards':
        return (
          <MemoryGame
            cardCount={gameData.cardCount || 12}
            onComplete={handleGameComplete}
            ageGroup={ageGroup}
          />
        );

      case 'word_hunt':
        return (
          <WordHuntGame
            wordCount={gameData.wordCount || 10}
            onComplete={handleGameComplete}
            ageGroup={ageGroup}
          />
        );

      case 'letter_sort':
        return (
          <LetterSortGame
            wordCount={gameData.wordCount || 12}
            onComplete={handleGameComplete}
            ageGroup={ageGroup}
          />
        );

      case 'picture_memory':
      case 'image_memory':
        return (
          <PictureMemoryGame
            itemCount={gameData.itemCount || 16}
            onComplete={handleGameComplete}
            ageGroup={ageGroup}
          />
        );

      case 'logic_puzzle':
        return (
          <LogicPuzzleGame
            puzzleCount={gameData.puzzleCount || 8}
            onComplete={handleGameComplete}
            ageGroup={ageGroup}
          />
        );

      case 'pattern_complete':
      case 'pattern':
        return (
          <PatternCompleteGame
            patternCount={gameData.patternCount || 10}
            onComplete={handleGameComplete}
            ageGroup={ageGroup}
          />
        );

      case 'science_quiz':
      case 'experiments':
        return (
          <ScienceQuizGame
            questionCount={gameData.questionCount || 15}
            topics={gameData.topics || ['biology', 'physics', 'chemistry']}
            onComplete={handleGameComplete}
            ageGroup={ageGroup}
          />
        );

      case 'hangman':
        return (
          <HangmanGame
            wordCount={gameData.wordCount || 10}
            onComplete={handleGameComplete}
            ageGroup={ageGroup}
          />
        );

      case 'color_tube':
      case 'color_lab':
        return (
          <ColorTubeGame
            onComplete={handleGameComplete}
          />
        );

      case 'picture-word':
      case 'emoji_word':
        return (
          <PictureWordGame
            onComplete={handleGameComplete}
            ageGroup={ageGroup}
          />
        );

      default:
        return (
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>Bu oyun türü henüz desteklenmiyor</Text>
          </View>
        );
    }
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

  if (completed) {
    return (
      <View style={styles.container}>
        <View style={styles.completedContainer}>
          <Trophy size={80} color="#48BB78" />
          <Text style={styles.completedTitle}>Tebrikler!</Text>
          <Text style={styles.completedSubtitle}>{game.title} oyununu tamamladın</Text>

          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>Skorun</Text>
            <Text style={styles.scoreValue}>{finalScore}</Text>
            <Text style={styles.pointsEarned}>+{game.points} puan kazandın!</Text>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={() => router.push('/(tabs)/games' as any)}
            >
              <Text style={styles.secondaryButtonText}>Oyunlar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={() => router.back()}
            >
              <Text style={styles.primaryButtonText}>Tekrar Oyna</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              'Oyunu Bırak',
              'Oyunu bırakmak istediğinden emin misin? İlerleme kaydedilmeyecek.',
              [
                { text: 'Devam Et', style: 'cancel' },
                { text: 'Bırak', onPress: () => router.back(), style: 'destructive' },
              ]
            );
          }}
          style={styles.backIcon}
        >
          <ArrowLeft size={24} color="#2D3748" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{game.title}</Text>
      </View>

      {renderGame()}
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F7FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3748',
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
  completedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  completedTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2D3748',
    marginTop: 24,
    marginBottom: 8,
  },
  completedSubtitle: {
    fontSize: 18,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 32,
  },
  scoreCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    marginBottom: 32,
  },
  scoreLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#718096',
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 64,
    fontWeight: '700',
    color: '#4299E1',
    marginBottom: 16,
  },
  pointsEarned: {
    fontSize: 20,
    fontWeight: '700',
    color: '#48BB78',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  button: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#48BB78',
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButtonText: {
    color: '#2D3748',
    fontSize: 16,
    fontWeight: '700',
  },
});
