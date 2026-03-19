import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePlayer } from '../context/PlayerContext';
import SongCard from '../components/SongCard';
import api from '../api/axios';
import { colors } from '../theme/colors';

export default function OfflineScreen() {
  const { playSong } = usePlayer();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOffline = async () => {
    try {
      const res = await api.get('/offline');
      setSongs(res.data.offline_songs || []);
    } catch (_) {}
    setLoading(false);
  };

  useEffect(() => { fetchOffline(); }, []);

  const removeSong = (videoId) => {
    Alert.alert('Remove', 'Remove from saved songs?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove', style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/offline/${videoId}`);
            fetchOffline();
          } catch (_) {}
        },
      },
    ]);
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={songs}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        ListHeaderComponent={<Text style={styles.header}>📥 Saved Songs</Text>}
        ListEmptyComponent={
          <View style={styles.center}>
            <Ionicons name="download-outline" size={64} color={colors.textMuted} />
            <Text style={styles.emptyText}>No saved songs yet</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <SongCard song={item.song} onPlay={playSong} />
            </View>
            <TouchableOpacity onPress={() => removeSong(item.song.youtube_video_id)} style={styles.removeBtn}>
              <Ionicons name="trash-outline" size={20} color={colors.error} />
            </TouchableOpacity>
          </View>
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
  row: { flexDirection: 'row', alignItems: 'center' },
  removeBtn: { padding: 10 },
});
