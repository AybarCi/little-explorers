import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LogOut, Mail, Calendar, Trophy, Zap, Diamond } from 'lucide-react-native';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { signout } from '@/store/slices/authSlice';
import { CURRENCY_CONSTANTS } from '@/store/slices/currencySlice';
export default function ProfileScreen() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { games } = useAppSelector((state) => state.games);
  const { energy, diamonds } = useAppSelector((state) => state.currency);

  // Kullanıcı istatistiklerini doğrudan user objesinden al
  const displayStats = {
    total_points: user?.total_points || 0,
    completed_games_count: user?.completed_games_count || 0,
  };

  const handleSignOut = () => {
    dispatch(signout());
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {user?.full_name?.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.userName}>{user?.full_name}</Text>
        <View style={styles.ageGroupBadge}>
          <Text style={styles.ageGroupText}>{user?.age_group} Yaş</Text>
        </View>
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
  avatarContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#4299E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 4,
    borderColor: '#EBF8FF',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: '700',
    color: 'white',
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
  },
  ageGroupText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4299E1',
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
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
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
