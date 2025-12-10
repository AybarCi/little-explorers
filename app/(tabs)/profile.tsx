import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { LogOut, Mail, Calendar, Trophy, Zap, Diamond, Settings } from 'lucide-react-native';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { signout } from '@/store/slices/authSlice';
import { CURRENCY_CONSTANTS } from '@/store/slices/currencySlice';
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
};

interface UserAppearance {
  avatar_emoji?: string | null;
  avatar_image_key?: string | null;
  frame_color?: string | null;
  badge_emoji?: string | null;
}

export default function ProfileScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { energy, diamonds } = useAppSelector((state) => state.currency);
  const [appearance, setAppearance] = useState<UserAppearance>({});

  // Fetch user appearance data
  const fetchAppearance = useCallback(async () => {
    if (!user?.id) return;

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
      const data = await response.json();

      if (data.userProfile) {
        // Get avatar details
        if (data.avatars && data.userProfile.current_avatar_id) {
          const allAvatars = [...(data.avatars.emoji || []), ...(data.avatars.premium || [])];
          const currentAvatar = allAvatars.find((a: any) => a.id === data.userProfile.current_avatar_id);
          if (currentAvatar) {
            setAppearance(prev => ({
              ...prev,
              avatar_emoji: currentAvatar.emoji,
              avatar_image_key: currentAvatar.image_key,
            }));
          }
        }

        // Get frame details
        if (data.frames && data.userProfile.current_frame_id) {
          const currentFrame = data.frames.find((f: any) => f.id === data.userProfile.current_frame_id);
          if (currentFrame) {
            setAppearance(prev => ({ ...prev, frame_color: currentFrame.color_primary }));
          }
        }

        // Get badge details
        if (data.badges && data.userProfile.current_badge_id) {
          const currentBadge = data.badges.find((b: any) => b.id === data.userProfile.current_badge_id);
          if (currentBadge) {
            setAppearance(prev => ({ ...prev, badge_emoji: currentBadge.emoji }));
          }
        }
      }
    } catch (error) {
      console.error('Fetch appearance error:', error);
    }
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      fetchAppearance();
    }, [fetchAppearance])
  );

  const displayStats = {
    total_points: user?.total_points || 0,
    completed_games_count: user?.completed_games_count || 0,
  };

  const handleSignOut = () => {
    dispatch(signout());
  };

  const renderAvatar = () => {
    const frameColor = appearance.frame_color || '#4299E1';
    const hasFrame = !!appearance.frame_color;

    // Premium avatar with image
    if (appearance.avatar_image_key && AVATAR_IMAGES[appearance.avatar_image_key]) {
      return (
        <View style={[styles.avatarContainer, { borderColor: frameColor, borderWidth: hasFrame ? 4 : 4 }]}>
          <Image
            source={AVATAR_IMAGES[appearance.avatar_image_key]}
            style={styles.avatarImage}
          />
        </View>
      );
    }

    // Emoji avatar
    if (appearance.avatar_emoji) {
      return (
        <View style={[styles.avatarContainer, styles.emojiAvatarContainer, { borderColor: frameColor, borderWidth: hasFrame ? 4 : 4 }]}>
          <Text style={styles.emojiAvatar}>{appearance.avatar_emoji}</Text>
        </View>
      );
    }

    // Default: first letter
    return (
      <View style={[styles.avatarContainer, { borderColor: '#EBF8FF' }]}>
        <Text style={styles.avatarText}>
          {user?.full_name?.charAt(0).toUpperCase()}
        </Text>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
      <View style={styles.header}>
        <View style={styles.avatarWrapper}>
          {renderAvatar()}
          {appearance.badge_emoji && (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeEmoji}>{appearance.badge_emoji}</Text>
            </View>
          )}
        </View>
        <Text style={styles.userName}>{user?.full_name}</Text>
        <View style={styles.ageGroupBadge}>
          <Text style={styles.ageGroupText}>{user?.age_group} Yaş</Text>
        </View>

        {/* Avatar Settings Button */}
        <TouchableOpacity
          style={styles.avatarSettingsButton}
          onPress={() => router.push('/avatar-settings')}
        >
          <Settings size={18} color="#FFF" />
          <Text style={styles.avatarSettingsText}>Avatar Ayarları</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Mail size={20} color="#4299E1" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>E-posta</Text>
              <Text style={styles.infoValue}>{user?.email}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Calendar size={20} color="#48BB78" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Kayıt Tarihi</Text>
              <Text style={styles.infoValue}>
                {user?.created_at
                  ? new Date(user.created_at).toLocaleDateString('tr-TR')
                  : '-'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>İstatistikler</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Zap size={28} color="#F6AD55" fill="#F6AD55" />
            </View>
            <Text style={styles.statValue}>{energy}/{CURRENCY_CONSTANTS.MAX_ENERGY}</Text>
            <Text style={styles.statLabel}>Enerji</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Diamond size={28} color="#60A5FA" fill="#60A5FA" />
            </View>
            <Text style={styles.statValue}>{diamonds}</Text>
            <Text style={styles.statLabel}>Elmas</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Trophy size={28} color="#48BB78" />
            </View>
            <Text style={styles.statValue}>{displayStats.total_points}</Text>
            <Text style={styles.statLabel}>Puan</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
          <LogOut size={20} color="white" />
          <Text style={styles.logoutButtonText}>Çıkış Yap</Text>
        </TouchableOpacity>
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
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 32,
    paddingHorizontal: 24,
    backgroundColor: 'white',
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#4299E1',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#EBF8FF',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  emojiAvatarContainer: {
    backgroundColor: '#FFF',
  },
  emojiAvatar: {
    fontSize: 48,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: '700',
    color: 'white',
  },
  badgeContainer: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  badgeEmoji: {
    fontSize: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 8,
  },
  ageGroupBadge: {
    backgroundColor: '#EBF8FF',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  ageGroupText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4299E1',
  },
  avatarSettingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  avatarSettingsText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F7FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 12,
  },
  statsGrid: {
    flexDirection: 'row',
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
  statIconContainer: {
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
  logoutButton: {
    backgroundColor: '#E53E3E',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 40,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
});
