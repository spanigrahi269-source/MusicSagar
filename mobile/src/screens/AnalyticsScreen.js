import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { colors } from '../theme/colors';

function StatCard({ icon, label, value, color }) {
  return (
    <View style={[styles.statCard, { borderColor: color }]}>
      <Ionicons name={icon} size={32} color={color} />
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function AnalyticsScreen() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/stats/analytics');
        setStats(res.data);
      } catch (_) {}
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.username?.[0]?.toUpperCase()}</Text>
        </View>
        <View>
          <Text style={styles.username}>{user?.username}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Your Stats</Text>
      <View style={styles.statsGrid}>
        <StatCard icon="musical-notes" label="Songs Played" value={stats?.total_songs_played ?? 0} color={colors.primary} />
        <StatCard icon="list" label="Playlists" value={stats?.total_playlists ?? 0} color={colors.accent} />
        <StatCard icon="heart" label="Liked Songs" value={stats?.total_likes ?? 0} color={colors.error} />
      </View>

      <View style={styles.logoutCard}>
        <Text style={styles.logoutTitle}>Account</Text>
        <Text style={styles.logoutSubtitle} onPress={logout}>
          Tap here to logout
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    gap: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: '#fff', fontSize: 24, fontWeight: '700' },
  username: { color: colors.text, fontSize: 18, fontWeight: '700' },
  email: { color: colors.textSecondary, fontSize: 13, marginTop: 2 },
  sectionTitle: { color: colors.text, fontSize: 18, fontWeight: '700', marginBottom: 12 },
  statsGrid: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statCard: {
    flex: 1,
    backgroundColor: colors.bgCard,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    gap: 6,
  },
  statValue: { fontSize: 28, fontWeight: '800' },
  statLabel: { color: colors.textSecondary, fontSize: 12, textAlign: 'center' },
  logoutCard: {
    backgroundColor: colors.bgCard,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.error,
  },
  logoutTitle: { color: colors.text, fontSize: 15, fontWeight: '600' },
  logoutSubtitle: { color: colors.error, fontSize: 13, marginTop: 4 },
});
