import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePlayer } from '../context/PlayerContext';
import SongCard from '../components/SongCard';
import api from '../api/axios';
import { colors } from '../theme/colors';

export default function LikedScreen() {
  const { playSong, addToQueue } = usePlayer();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/stats/liked');
        setSongs(res.data.liked_songs || []);
      } catch (_) {}
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={songs}
        keyExtractor={(_, i) => i.toString()}
        contentContainerStyle={{ padding: 16 }}
        ListHeaderComponent={<Text style={styles.header}>❤️ Liked Songs</Text>}
        ListEmptyComponent={
          <View style={styles.center}>
            <Ionicons name="heart-outline" size={64} color={colors.textMuted} />
            <Text style={styles.emptyText}>No liked songs yet</Text>
          </View>
        }
        renderItem={({ item }) => (
          <SongCard song={item} onPlay={playSong} onAddToQueue={addToQueue} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 60 },
  header: { color: colors.text, fontSize: 22, fontWeight: '700', marginBottom: 16 },
  emptyText: { color: colors.textMuted, fontSize: 15, marginTop: 12 },
});
