import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { usePlayer } from '../context/PlayerContext';
import SongCard from '../components/SongCard';
import api from '../api/axios';
import { colors } from '../theme/colors';

export default function TrendingScreen() {
  const { playSong, addToQueue } = usePlayer();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTrending = async () => {
    try {
      const res = await api.get('/stats/trending');
      setSongs(res.data.trending || []);
    } catch (_) {}
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => { fetchTrending(); }, []);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={songs}
        keyExtractor={(_, i) => i.toString()}
        contentContainerStyle={{ padding: 16 }}
        ListHeaderComponent={<Text style={styles.header}>🔥 Trending Songs</Text>}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>No trending songs yet</Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <View style={styles.row}>
            <Text style={styles.rank}>#{index + 1}</Text>
            <View style={{ flex: 1 }}>
              <SongCard song={item} onPlay={playSong} onAddToQueue={addToQueue} />
            </View>
          </View>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchTrending(); }} tintColor={colors.primary} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 60 },
  header: { color: colors.text, fontSize: 22, fontWeight: '700', marginBottom: 16 },
  emptyText: { color: colors.textMuted, fontSize: 15 },
  row: { flexDirection: 'row', alignItems: 'center' },
  rank: { color: colors.textMuted, fontSize: 16, fontWeight: '700', width: 32, textAlign: 'center' },
});
