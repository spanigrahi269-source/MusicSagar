import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import PlaylistsScreen from '../screens/PlaylistsScreen';
import PlaylistDetailScreen from '../screens/PlaylistDetailScreen';
import HistoryScreen from '../screens/HistoryScreen';
import TrendingScreen from '../screens/TrendingScreen';
import LikedScreen from '../screens/LikedScreen';
import OfflineScreen from '../screens/OfflineScreen';
import MoodScreen from '../screens/MoodScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import MiniPlayer from '../components/MiniPlayer';
import FullPlayer from '../components/FullPlayer';
import { usePlayer } from '../context/PlayerContext';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: colors.bgCard, borderBottomColor: colors.border, borderBottomWidth: 1 },
  headerTintColor: colors.text,
  headerTitleStyle: { fontWeight: '700' },
};

function PlaylistStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="PlaylistsList" component={PlaylistsScreen} options={{ title: 'Playlists' }} />
      <Stack.Screen name="PlaylistDetail" component={PlaylistDetailScreen} options={({ route }) => ({ title: route.params?.name || 'Playlist' })} />
    </Stack.Navigator>
  );
}

function TabNavigator() {
  const { currentSong, setShowPlayer } = usePlayer();

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          ...screenOptions,
          tabBarStyle: {
            backgroundColor: colors.bgCard,
            borderTopColor: colors.border,
            borderTopWidth: 1,
            paddingBottom: 4,
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarIcon: ({ color, size }) => {
            const icons = {
              Home: 'home',
              Search: 'search',
              Playlists: 'musical-notes',
              History: 'time',
              More: 'ellipsis-horizontal',
            };
            return <Ionicons name={icons[route.name] || 'apps'} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen name="Playlists" component={PlaylistStack} options={{ headerShown: false }} />
        <Tab.Screen name="History" component={HistoryScreen} />
        <Tab.Screen name="More" component={MoreStack} options={{ headerShown: false }} />
      </Tab.Navigator>
      {currentSong && <MiniPlayer onExpand={() => setShowPlayer(true)} />}
    </View>
  );
}

const MoreTab = createStackNavigator();
function MoreStack() {
  return (
    <MoreTab.Navigator screenOptions={screenOptions}>
      <MoreTab.Screen name="MoreMenu" component={MoreMenuScreen} options={{ title: 'More' }} />
      <MoreTab.Screen name="Trending" component={TrendingScreen} options={{ title: 'Trending' }} />
      <MoreTab.Screen name="Liked" component={LikedScreen} options={{ title: 'Liked Songs' }} />
      <MoreTab.Screen name="Offline" component={OfflineScreen} options={{ title: 'Saved Songs' }} />
      <MoreTab.Screen name="Mood" component={MoodScreen} options={{ title: 'Mood Player' }} />
      <MoreTab.Screen name="Analytics" component={AnalyticsScreen} options={{ title: 'Profile & Stats' }} />
    </MoreTab.Navigator>
  );
}

import { TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function MoreMenuScreen() {
  const navigation = useNavigation();
  const items = [
    { name: 'Trending', icon: 'flame', label: 'Trending Songs' },
    { name: 'Liked', icon: 'heart', label: 'Liked Songs' },
    { name: 'Offline', icon: 'download', label: 'Saved Songs' },
    { name: 'Mood', icon: 'happy', label: 'Mood Player' },
    { name: 'Analytics', icon: 'person-circle', label: 'Profile & Stats' },
  ];

  return (
    <View style={moreStyles.container}>
      {items.map((item) => (
        <TouchableOpacity
          key={item.name}
          style={moreStyles.item}
          onPress={() => navigation.navigate(item.name)}
        >
          <View style={moreStyles.iconWrap}>
            <Ionicons name={item.icon} size={24} color={colors.primary} />
          </View>
          <Text style={moreStyles.label}>{item.label}</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const moreStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: 16 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    gap: 14,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.bgElevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: { flex: 1, color: colors.text, fontSize: 15, fontWeight: '600' },
});

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <TabNavigator />
      <FullPlayer />
    </NavigationContainer>
  );
}
