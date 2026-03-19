import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { usePlayer } from '../context/PlayerContext';
import SongCard from '../components/SongCard';
import api from '../api/axios';
import { colors } from '../theme/colors';

export default function PlaylistDetailScreen() {
  const route = useRoute();
  const { id, name } = route.params;
  const { playSong, addToQueue } = usePlayer();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/playlists/${id}/songs`);
        setSongs(res.data.songs || []);
      } catch (_) {}
      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={songs}
        keyExtractor={(_, i) => i.toString()}
        contentContainerStyle={{ padding: 16 }}
        ListHeaderComponent={<Text style={styles.header}>{name}</Text>}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>No songs in this playlist</Text>
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
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 40 },
  header: { color: colors.text, fontSize: 22, fontWeight: '700', marginBottom: 16 },
  emptyText: { color: colors.textMuted, fontSize: 15 },
});
