import React, { useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { usePlayer } from '../context/PlayerContext';
import SongCard from '../components/SongCard';
import api from '../api/axios';
import { colors } from '../theme/colors';

const LANGUAGES = ['Hindi', 'English', 'Punjabi', 'All'];

const MOOD_LABELS = [
  { max: 20, label: 'Sad', emoji: '😢', color: '#6366f1' },
  { max: 40, label: 'Calm', emoji: '😌', color: '#06b6d4' },
  { max: 60, label: 'Romantic', emoji: '🙂', color: '#ec4899' },
  { max: 80, label: 'Happy', emoji: '😄', color: '#f59e0b' },
  { max: 100, label: 'Energetic', emoji: '🤩', color: '#10b981' },
];

function getMood(value) {
  return MOOD_LABELS.find((m) => value <= m.max) || MOOD_LABELS[4];
}

export default function MoodScreen() {
  const { playSong, addToQueue } = usePlayer();
  const [value, setValue] = useState(50);
  const [language, setLanguage] = useState('Hindi');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const mood = getMood(value);

  const search = async () => {
    setLoading(true);
    try {
      const res = await api.get('/ai/mood-slider', { params: { value, language } });
      setResults(res.data.results || []);
    } catch (_) {}
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={results}
        keyExtractor={(_, i) => i.toString()}
        contentContainerStyle={{ padding: 16 }}
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>🎭 Mood Player</Text>
            <View style={[styles.moodCard, { borderColor: mood.color }]}>
              <Text style={styles.moodEmoji}>{mood.emoji}</Text>
              <Text style={[styles.moodLabel, { color: mood.color }]}>{mood.label}</Text>
              <Text style={styles.moodValue}>{value}</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              step={1}
              value={value}
              onValueChange={setValue}
              minimumTrackTintColor={mood.color}
              maximumTrackTintColor={colors.border}
              thumbTintColor={mood.color}
            />
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabel}>😢 Sad</Text>
              <Text style={styles.sliderLabel}>🤩 Energetic</Text>
            </View>

            <View style={styles.langRow}>
              {LANGUAGES.map((l) => (
                <TouchableOpacity
                  key={l}
                  style={[styles.langChip, language === l && { backgroundColor: mood.color, borderColor: mood.color }]}
                  onPress={() => setLanguage(l)}
                >
                  <Text style={[styles.langText, language === l && { color: '#fff' }]}>{l}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={[styles.searchBtn, { backgroundColor: mood.color }]} onPress={search}>
              <Text style={styles.searchBtnText}>Find Songs for My Mood</Text>
            </TouchableOpacity>

            {results.length > 0 && <Text style={styles.resultsTitle}>Results</Text>}
          </View>
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.center}>
              <Text style={styles.emptyText}>Adjust the slider and tap search</Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <SongCard song={item} onPlay={playSong} onAddToQueue={addToQueue} />
        )}
        ListFooterComponent={loading ? <ActivityIndicator color={colors.primary} style={{ padding: 20 }} /> : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  title: { color: colors.text, fontSize: 22, fontWeight: '700', marginBottom: 16 },
  moodCard: {
    backgroundColor: colors.bgCard,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    marginBottom: 16,
  },
  moodEmoji: { fontSize: 48, marginBottom: 8 },
  moodLabel: { fontSize: 22, fontWeight: '700' },
  moodValue: { color: colors.textSecondary, fontSize: 14, marginTop: 4 },
  slider: { width: '100%', height: 40 },
  sliderLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  sliderLabel: { color: colors.textSecondary, fontSize: 12 },
  langRow: { flexDirection: 'row', gap: 8, marginBottom: 16, flexWrap: 'wrap' },
  langChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
  },
  langText: { color: colors.textSecondary, fontSize: 13 },
  searchBtn: {
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  searchBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  resultsTitle: { color: colors.text, fontSize: 18, fontWeight: '700', marginBottom: 12 },
  center: { alignItems: 'center', paddingTop: 40 },
  emptyText: { color: colors.textMuted, fontSize: 14 },
});
