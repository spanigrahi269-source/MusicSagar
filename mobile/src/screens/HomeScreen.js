import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, ActivityIndicator,
  TouchableOpacity, RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';
import SongCard from '../components/SongCard';
import api from '../api/axios';
import { colors } from '../theme/colors';

export default function HomeScreen() {
  const { user } = useAuth();
  const { playSong, addToQueue } = usePlayer();
  const [recommendations, setRecommendations] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [recMessage, setRecMessage] = useState('');

  const fetchData = async () => {
    try {
      const [recRes, trendRes] = await Promise.all([
        api.get('/stats/recommendations'),
        api.get('/stats/trending'),
      ]);
      setRecommendations(recRes.data.recommendations || []);
      setRecMessage(recRes.data.message || '');
      setTrending(trendRes.data.trending || []);
    } catch (_) {}
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => { fetchData(); }, []);

  const onRefresh = () => { setRefreshing(true); fetchData(); };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good day,</Text>
          <Text style={styles.username}>{user?.username} 👋</Text>
        </View>
        <Ionicons name="musical-notes" size={28} color={colors.primary} />
      </View>

      {recommendations.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{recMessage || 'Recommended for You'}</Text>
          {recommendations.slice(0, 10).map((song, i) => (
            <SongCard key={i} song={song} onPlay={playSong} onAddToQueue={addToQueue} />
          ))}
        </View>
      )}

      {trending.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔥 Trending Now</Text>
          {trending.slice(0, 10).map((song, i) => (
            <SongCard key={i} song={song} onPlay={playSong} onAddToQueue={addToQueue} />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 16,
  },
  greeting: { color: colors.textSecondary, fontSize: 14 },
  username: { color: colors.text, fontSize: 22, fontWeight: '700' },
  section: { paddingHorizontal: 16, marginBottom: 24 },
  sectionTitle: { color: colors.text, fontSize: 18, fontWeight: '700', marginBottom: 12 },
});
