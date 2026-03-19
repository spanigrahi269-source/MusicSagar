import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, ActivityIndicator,
  TouchableOpacity, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePlayer } from '../context/PlayerContext';
import SongCard from '../components/SongCard';
import api from '../api/axios';
import { colors } from '../theme/colors';

export default function HistoryScreen() {
  const { playSong, addToQueue } = usePlayer();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/history');
      setHistory(res.data);
    } catch (_) {}
    setLoading(false);
  };

  useEffect(() => { fetchHistory(); }, []);

  const clearHistory = () => {
    Alert.alert('Clear History', 'Remove all listening history?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear', style: 'destructive',
        onPress: async () => {
          try {
            await api.delete('/history');
            setHistory([]);
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
        data={history}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        ListHeaderComponent={
          history.length > 0 ? (
            <TouchableOpacity style={styles.clearBtn} onPress={clearHistory}>
              <Ionicons name="trash-outline" size={18} color={colors.error} />
              <Text style={styles.clearText}>Clear History</Text>
            </TouchableOpacity>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.center}>
            <Ionicons name="time-outline" size={64} color={colors.textMuted} />
            <Text style={styles.emptyText}>No listening history yet</Text>
          </View>
        }
        renderItem={({ item }) => (
          <SongCard song={item.song || item} onPlay={playSong} onAddToQueue={addToQueue} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 60 },
  emptyText: { color: colors.textMuted, fontSize: 15, marginTop: 12 },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 10,
    backgroundColor: colors.bgCard,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  clearText: { color: colors.error, fontSize: 14, fontWeight: '600', marginLeft: 8 },
});
