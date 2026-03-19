import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function SongCard({ song, onPlay, onAddToQueue, compact = false }) {
  const videoId = song.videoId || song.youtube_video_id;
  const title = song.title;
  const channel = song.channelTitle || song.channel;
  const thumbnail = song.thumbnail;

  return (
    <TouchableOpacity style={[styles.card, compact && styles.compact]} onPress={() => onPlay(song)}>
      <Image
        source={{ uri: thumbnail || `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg` }}
        style={[styles.thumb, compact && styles.thumbCompact]}
      />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        <Text style={styles.channel} numberOfLines={1}>{channel}</Text>
        {song.duration && <Text style={styles.duration}>{song.duration}</Text>}
      </View>
      {onAddToQueue && (
        <TouchableOpacity onPress={() => onAddToQueue(song)} style={styles.queueBtn}>
          <Ionicons name="add-circle-outline" size={22} color={colors.textSecondary} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    borderRadius: 12,
    marginBottom: 10,
    padding: 10,
  },
  compact: { padding: 8, marginBottom: 6 },
  thumb: { width: 64, height: 64, borderRadius: 8 },
  thumbCompact: { width: 48, height: 48 },
  info: { flex: 1, marginLeft: 12 },
  title: { color: colors.text, fontSize: 14, fontWeight: '600', marginBottom: 4 },
  channel: { color: colors.textSecondary, fontSize: 12 },
  duration: { color: colors.textMuted, fontSize: 11, marginTop: 2 },
  queueBtn: { padding: 6 },
});
