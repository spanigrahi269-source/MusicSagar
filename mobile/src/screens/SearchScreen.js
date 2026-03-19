import React, { useState, useCallback } from 'react';
import {
  View, Text, TextInput, FlatList, StyleSheet,
  ActivityIndicator, TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePlayer } from '../context/PlayerContext';
import SongCard from '../components/SongCard';
import api from '../api/axios';
import { colors } from '../theme/colors';

const LANGUAGES = ['All', 'Hindi', 'English', 'Punjabi', 'Marathi', 'Tamil', 'Telugu'];

export default function SearchScreen() {
  const { playSong, addToQueue } = usePlayer();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('All');
  const [nextPageToken, setNextPageToken] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const search = async (reset = true) => {
    if (!query.trim()) return;
    if (reset) { setLoading(true); setResults([]); }
    else setLoadingMore(true);

    try {
      const params = { query, language: language.toLowerCase() };
      if (!reset && nextPageToken) params.pageToken = nextPageToken;
      const res = await api.get('/youtube/search', { params });
      const newResults = res.data.results || [];
      setResults(reset ? newResults : (prev) => [...prev, ...newResults]);
      setNextPageToken(res.data.nextPageToken || null);
    } catch (_) {}
    setLoading(false);
    setLoadingMore(false);
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color={colors.textSecondary} style={{ marginRight: 8 }} />
        <TextInput
          style={styles.input}
          placeholder="Search songs, artists..."
          placeholderTextColor={colors.textMuted}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={() => search(true)}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => { setQuery(''); setResults([]); }}>
            <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Language Filter */}
      <FlatList
        horizontal
        data={LANGUAGES}
        keyExtractor={(l) => l}
        showsHorizontalScrollIndicator={false}
        style={styles.langList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.langChip, language === item && styles.langChipActive]}
            onPress={() => { setLanguage(item); }}
          >
            <Text style={[styles.langText, language === item && styles.langTextActive]}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => (
            <SongCard song={item} onPlay={playSong} onAddToQueue={addToQueue} />
          )}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={
            query ? null : (
              <View style={styles.center}>
                <Ionicons name="search" size={64} color={colors.textMuted} />
                <Text style={styles.emptyText}>Search for your favorite music</Text>
              </View>
            )
          }
          onEndReached={() => { if (nextPageToken && !loadingMore) search(false); }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loadingMore ? <ActivityIndicator color={colors.primary} style={{ padding: 16 }} /> : null}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    margin: 16,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: { flex: 1, color: colors.text, fontSize: 15 },
  langList: { paddingLeft: 16, marginBottom: 8, maxHeight: 44 },
  langChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: colors.bgCard,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  langChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  langText: { color: colors.textSecondary, fontSize: 13 },
  langTextActive: { color: '#fff', fontWeight: '600' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 60 },
  emptyText: { color: colors.textMuted, fontSize: 15, marginTop: 12 },
});
