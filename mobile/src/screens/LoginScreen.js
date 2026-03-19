import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';

export default function LoginScreen() {
  const { login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password || (!isLogin && !username)) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(username, email, password);
      }
    } catch (e) {
      Alert.alert('Error', e.response?.data?.detail || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#0f0f1a', '#1a0a2e', '#0f0f1a']} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.logoArea}>
            <Ionicons name="musical-notes" size={64} color={colors.primary} />
            <Text style={styles.appName}>Music Sagar</Text>
            <Text style={styles.tagline}>Your ocean of music</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>{isLogin ? 'Welcome Back' : 'Create Account'}</Text>

            {!isLogin && (
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor={colors.textMuted}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            )}
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={colors.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <View style={styles.passRow}>
              <TextInput
                style={[styles.input, { flex: 1, marginBottom: 0 }]}
                placeholder="Password"
                placeholderTextColor={colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPass}
              />
              <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
                <Ionicons name={showPass ? 'eye-off' : 'eye'} size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitText}>{isLogin ? 'Login' : 'Sign Up'}</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={styles.switchBtn}>
              <Text style={styles.switchText}>
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <Text style={{ color: colors.primary }}>{isLogin ? 'Sign Up' : 'Login'}</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  logoArea: { alignItems: 'center', marginBottom: 40 },
  appName: { color: colors.text, fontSize: 32, fontWeight: '800', marginTop: 12 },
  tagline: { color: colors.textSecondary, fontSize: 14, marginTop: 4 },
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: { color: colors.text, fontSize: 22, fontWeight: '700', marginBottom: 20 },
  input: {
    backgroundColor: colors.bgElevated,
    borderRadius: 12,
    padding: 14,
    color: colors.text,
    fontSize: 15,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  passRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  eyeBtn: { padding: 14, marginLeft: 8 },
  submitBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 6,
  },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  switchBtn: { alignItems: 'center', marginTop: 16 },
  switchText: { color: colors.textSecondary, fontSize: 14 },
});
