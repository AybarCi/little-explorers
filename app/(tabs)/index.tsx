import { useEffect, useCallback, useRef, useState } from 'react';
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
import { Trophy, Zap, Diamond, Gamepad2, BarChart3, Target, User, CheckCircle } from 'lucide-react-native';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { fetchGames } from '@/store/slices/gamesSlice';
import { initializeCurrency, regenerateEnergy, loadCurrencyFromStorage, saveCurrencyToStorage, CURRENCY_CONSTANTS } from '@/store/slices/currencySlice';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import EnergyModal from '@/components/EnergyModal';
import DiamondModal from '@/components/DiamondModal';

export default function HomeScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { games } = useAppSelector((state) => state.games);
  const { energy, diamonds, isInitialized } = useAppSelector((state) => state.currency);
  const headerAnim = useRef(new Animated.Value(0)).current;
  const float1 = useRef(new Animated.Value(0)).current;
  const float2 = useRef(new Animated.Value(0)).current;
  const gridAnim = useRef(new Animated.Value(0)).current;

  const [showEnergyModal, setShowEnergyModal] = useState(false);
  const [showDiamondModal, setShowDiamondModal] = useState(false);

  // Initialize currency from database (user object) or storage
  useEffect(() => {
    const initCurrency = async () => {
      console.log('initCurrency called, user:', user?.id, 'isInitialized:', isInitialized);
      console.log('User energy:', (user as any)?.energy, 'User diamonds:', (user as any)?.diamonds);

      // If user is logged in and has database values, use them
      if (user) {
        const hasDbEnergy = (user as any).energy !== undefined && (user as any).energy !== null;
        const hasDbDiamonds = (user as any).diamonds !== undefined && (user as any).diamonds !== null;

        console.log('hasDbEnergy:', hasDbEnergy, 'hasDbDiamonds:', hasDbDiamonds);

        // Use database values if available
        if (hasDbEnergy || hasDbDiamonds) {
          const dbEnergy = hasDbEnergy ? (user as any).energy : CURRENCY_CONSTANTS.MAX_ENERGY;
          const dbDiamonds = hasDbDiamonds ? (user as any).diamonds : 0;
          const dbLastEnergyUpdate = (user as any).last_energy_update ?? Date.now();

          console.log('Using DB values - energy:', dbEnergy, 'diamonds:', dbDiamonds);

          dispatch(initializeCurrency({
            energy: dbEnergy,
            diamonds: dbDiamonds,
            lastEnergyUpdate: dbLastEnergyUpdate,
          }));

          // Also update local storage with database values for offline access
          saveCurrencyToStorage({
            energy: dbEnergy,
            diamonds: dbDiamonds,
            lastEnergyUpdate: dbLastEnergyUpdate,
          });
          return;
        }
      }

      // Fallback to AsyncStorage if user data not available
      const saved = await loadCurrencyFromStorage();
      console.log('Loaded from AsyncStorage:', saved);
      if (saved) {
        dispatch(initializeCurrency(saved));
      } else {
        dispatch(initializeCurrency({
          energy: CURRENCY_CONSTANTS.MAX_ENERGY,
          diamonds: 0,
          lastEnergyUpdate: Date.now(),
        }));
      }
    };

    // Always re-initialize when user changes (login/logout)
    if (!isInitialized || user) {
      initCurrency();
    }
  }, [isInitialized, user?.id]);

  // Energy regeneration timer
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(regenerateEnergy());
    }, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

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
  const totalPoints = user?.total_points || 0;  // Toplam puan (oyun tamamlama + görev ödülleri)

  const quickActions = [
    {
      icon: Gamepad2,
      label: 'Oyunlar',
      color: '#4299E1',
      onPress: () => router.push('/(tabs)/games'),
    },
    {
      icon: BarChart3,
      label: 'İlerleme',
      color: '#ED8936',
      onPress: () => router.push('/(tabs)/progress'),
    },
    {
      icon: Target,
      label: 'Görevler',
      color: '#9F7AEA',
      onPress: () => router.push('/(tabs)/challenges'),
    },
    {
      icon: User,
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

      {/* Energy & Diamond Bar */}
      <View style={styles.currencyBar}>
        <TouchableOpacity style={styles.currencyItem} onPress={() => setShowEnergyModal(true)}>
          <View style={styles.currencyIconContainer}>
            <Zap size={24} color="#F6AD55" fill="#F6AD55" />
          </View>
          <Text style={styles.currencyValue}>{energy}/{CURRENCY_CONSTANTS.MAX_ENERGY}</Text>
          {energy < CURRENCY_CONSTANTS.MAX_ENERGY && (
            <View style={styles.addBadge}>
              <Text style={styles.addBadgeText}>+</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.currencyItem} onPress={() => setShowDiamondModal(true)}>
          <View style={[styles.currencyIconContainer, { backgroundColor: '#DBEAFE' }]}>
            <Diamond size={24} color="#60A5FA" fill="#60A5FA" />
          </View>
          <Text style={styles.currencyValue}>{diamonds}</Text>
          <View style={styles.addBadge}>
            <Text style={styles.addBadgeText}>+</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <Trophy size={24} color="#48BB78" />
          </View>
          <Text style={styles.statValue}>{totalPoints}</Text>
          <Text style={styles.statLabel}>Toplam Puan</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <CheckCircle size={24} color="#4299E1" />
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
              style={[styles.actionCard, { backgroundColor: action.color }]}
              onPress={action.onPress}
            >
              <View style={styles.actionIcon}>
                <action.icon size={32} color="white" />
              </View>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
      </View>

      {/* Modals */}
      <EnergyModal
        visible={showEnergyModal}
        onClose={() => setShowEnergyModal(false)}
        onWatchAd={() => {
          setShowEnergyModal(false);
          setShowDiamondModal(true);
        }}
      />
      <DiamondModal
        visible={showDiamondModal}
        onClose={() => setShowDiamondModal(false)}
      />
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
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    alignItems: 'center',
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
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
  currencyBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 16,
    backgroundColor: Colors.pureWhite,
  },
  currencyItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7FAFC',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  currencyIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEFCBF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  currencyValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2D3748',
  },
  addBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#48BB78',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBadgeText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
