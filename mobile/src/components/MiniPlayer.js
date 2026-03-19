import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePlayer } from '../context/PlayerContext';
import { colors } from '../theme/colors';

export default function MiniPlayer({ onExpand }) {
  const { currentSong, isPlaying, togglePlay, playNext } = usePlayer();
  if (!currentSong) return null;

  const videoId = currentSong.videoId || currentSong.youtube_video_id;
  const thumbnail = currentSong.thumbnail || `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`;

  return (
    <TouchableOpacity style={styles.container} onPress={onExpand} activeOpacity={0.9}>
      <Image source={{ uri: thumbnail }} style={styles.thumb} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{currentSong.title}</Text>
        <Text style={styles.channel} numberOfLines={1}>
          {currentSong.channelTitle || currentSong.channel}
        </Text>
      </View>
      <TouchableOpacity onPress={togglePlay} style={styles.btn}>
        <Ionicons name={isPlaying ? 'pause' : 'play'} size={24} color={colors.text} />
      </TouchableOpacity>
      <TouchableOpacity onPress={playNext} style={styles.btn}>
        <Ionicons name="play-skip-forward" size={22} color={colors.textSecondary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgElevated,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  thumb: { width: 44, height: 44, borderRadius: 6 },
  info: { flex: 1, marginLeft: 10 },
  title: { color: colors.text, fontSize: 13, fontWeight: '600' },
  channel: { color: colors.textSecondary, fontSize: 11 },
  btn: { padding: 8 },
});
