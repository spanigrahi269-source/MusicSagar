import React, { useState, useRef, lazy, Suspense } from 'react';
import {
  View, Text, Image, TouchableOpacity, StyleSheet,
  Modal, Dimensions, StatusBar, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { usePlayer } from '../context/PlayerContext';
import { colors } from '../theme/colors';
import api from '../api/axios';

const { width, height } = Dimensions.get('window');

// Lazy load WebView to prevent native crash on startup
let WebView = null;
try {
  WebView = require('react-native-webview').WebView;
} catch (e) {
  WebView = null;
}

export default function FullPlayer() {
  const { currentSong, isPlaying, togglePlay, playNext, playPrevious, showPlayer, setShowPlayer } = usePlayer();
  const [liked, setLiked] = useState(false);
  const webviewRef = useRef(null);

  if (!currentSong || !showPlayer) return null;

  const videoId = currentSong.videoId || currentSong.youtube_video_id;
  const thumbnail = currentSong.thumbnail || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  const handleLike = async () => {
    try {
      if (liked) {
        await api.delete(`/stats/like/${videoId}`);
      } else {
        await api.post(`/stats/like/${videoId}`);
      }
      setLiked(!liked);
    } catch (_) {}
  };

  // Embed YouTube player in a WebView
  const youtubeHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        * { margin: 0; padding: 0; background: #000; }
        body { background: #000; }
        iframe { width: 100%; height: 100vh; border: none; }
      </style>
    </head>
    <body>
      <iframe
        src="https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&rel=0&modestbranding=1"
        allow="autoplay; encrypted-media"
        allowfullscreen
      ></iframe>
    </body>
    </html>
  `;

  return (
    <Modal visible={showPlayer} animationType="slide" statusBarTranslucent>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <LinearGradient colors={['#0f0f1a', '#1a0a2e', '#0f0f1a']} style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setShowPlayer(false)} style={styles.headerBtn}>
            <Ionicons name="chevron-down" size={28} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Now Playing</Text>
          <View style={{ width: 44 }} />
        </View>

        {/* YouTube Player */}
        <View style={styles.playerContainer}>
          {WebView ? (
            <WebView
              ref={webviewRef}
              source={{ html: youtubeHtml }}
              style={styles.webview}
              allowsInlineMediaPlayback
              mediaPlaybackRequiresUserAction={false}
              javaScriptEnabled
            />
          ) : (
            <View style={[styles.webview, { justifyContent: 'center', alignItems: 'center' }]}>
              <Text style={{ color: '#fff' }}>Player unavailable</Text>
            </View>
          )}
        </View>

        {/* Song Info */}
        <View style={styles.songInfo}>
          <View style={styles.songMeta}>
            <Text style={styles.songTitle} numberOfLines={2}>{currentSong.title}</Text>
            <Text style={styles.songChannel}>{currentSong.channelTitle || currentSong.channel}</Text>
          </View>
          <TouchableOpacity onPress={handleLike} style={styles.likeBtn}>
            <Ionicons
              name={liked ? 'heart' : 'heart-outline'}
              size={28}
              color={liked ? colors.error : colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity onPress={playPrevious} style={styles.controlBtn}>
            <Ionicons name="play-skip-back" size={32} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={togglePlay} style={styles.playBtn}>
            <Ionicons name={isPlaying ? 'pause-circle' : 'play-circle'} size={72} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={playNext} style={styles.controlBtn}>
            <Ionicons name="play-skip-forward" size={32} color={colors.text} />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
  },
  headerBtn: { padding: 8 },
  headerTitle: { color: colors.textSecondary, fontSize: 14, fontWeight: '600', letterSpacing: 1 },
  playerContainer: {
    width: width,
    height: width * 0.5625, // 16:9
    backgroundColor: '#000',
  },
  webview: { flex: 1, backgroundColor: '#000' },
  songInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 8,
  },
  songMeta: { flex: 1 },
  songTitle: { color: colors.text, fontSize: 20, fontWeight: '700', marginBottom: 6 },
  songChannel: { color: colors.textSecondary, fontSize: 14 },
  likeBtn: { padding: 8 },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  controlBtn: { padding: 8, marginHorizontal: 12 },
  playBtn: { padding: 4 },
});
