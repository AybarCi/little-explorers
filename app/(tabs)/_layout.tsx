import { Tabs } from 'expo-router';
import { Home, BookOpen, User } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.pureWhite,
        tabBarInactiveTintColor: 'rgba(255,255,255,0.75)',
        tabBarStyle: {
          borderTopColor: '#E2E8F0',
          backgroundColor: 'transparent',
          height: 92,
          paddingBottom: 14,
          paddingTop: 12,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          overflow: 'hidden',
        },
        tabBarBackground: () => (
          <LinearGradient
            colors={[Colors.spacePurple, Colors.energyOrange]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1 }}
          />
        ),
        tabBarItemStyle: {
          paddingVertical: 12,
          paddingHorizontal: 16,
          marginHorizontal: 8,
          borderRadius: 22,
          minHeight: 56,
          alignItems: 'center',
        },
        tabBarActiveBackgroundColor: 'rgba(255,255,255,0.22)',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
          marginTop: 4,
          lineHeight: 14,
        },
        tabBarIconStyle: {
          marginBottom: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Ana Sayfa',
          tabBarIcon: ({ color, focused }) => (
            <>
              <Home size={26} color={color} />
            </>
          ),
        }}
      />
      <Tabs.Screen
        name="games"
        options={{
          title: 'Oyunlar',
          tabBarIcon: ({ color, focused }) => (
            <>
              <BookOpen size={26} color={color} />
            </>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, focused }) => (
            <>
              <User size={26} color={color} />
            </>
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="challenges"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
