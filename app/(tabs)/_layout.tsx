import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { Home, BookOpen, User, Trophy, ShoppingBag } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.pureWhite,
        tabBarInactiveTintColor: 'rgba(255,255,255,0.6)',
        tabBarStyle: {
          borderTopColor: 'rgba(255,255,255,0.1)',
          backgroundColor: 'transparent',
          height: 90,
          paddingBottom: 10,
          paddingTop: 10,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          overflow: 'hidden',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
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
          paddingVertical: 8,
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
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
            <View style={{
              backgroundColor: focused ? 'rgba(255,255,255,0.2)' : 'transparent',
              padding: 8,
              borderRadius: 16,
              width: 48,
              height: 48,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Home size={24} color={color} strokeWidth={focused ? 3 : 2} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="games"
        options={{
          title: 'Oyunlar',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              backgroundColor: focused ? 'rgba(255,255,255,0.2)' : 'transparent',
              padding: 8,
              borderRadius: 16,
              width: 48,
              height: 48,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <BookOpen size={24} color={color} strokeWidth={focused ? 3 : 2} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: 'Liderler',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              backgroundColor: focused ? 'rgba(255,255,255,0.2)' : 'transparent',
              padding: 8,
              borderRadius: 16,
              width: 48,
              height: 48,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Trophy size={24} color={color} strokeWidth={focused ? 3 : 2} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: 'Mağaza',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              backgroundColor: focused ? 'rgba(255,255,255,0.2)' : 'transparent',
              padding: 8,
              borderRadius: 16,
              width: 48,
              height: 48,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <ShoppingBag size={24} color={color} strokeWidth={focused ? 3 : 2} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              backgroundColor: focused ? 'rgba(255,255,255,0.2)' : 'transparent',
              padding: 8,
              borderRadius: 16,
              width: 48,
              height: 48,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <User size={24} color={color} strokeWidth={focused ? 3 : 2} />
            </View>
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

