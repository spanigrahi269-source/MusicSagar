import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { PlayerProvider } from './src/context/PlayerContext';
import AppNavigator from './src/navigation/AppNavigator';
import LoginScreen from './src/screens/LoginScreen';
import { View, ActivityIndicator } from 'react-native';
import { colors } from './src/theme/colors';

function RootApp() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!user) return <LoginScreen />;

  return (
    <PlayerProvider>
      <AppNavigator />
    </PlayerProvider>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor={colors.bg} />
      <AuthProvider>
        <RootApp />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
