import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';

enableScreens();

const API_URL = 'https://brave-success-production.up.railway.app';
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Simple in-memory auth — no AsyncStorage, no SecureStore
let authToken = null;
let authUser = null;

function LoginScreen({ onLogin }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    if (!email || !password) return;
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      authToken = res.data.access_token;
      authUser = res.data.user;
      onLogin(authUser);
    } catch (e) {
      Alert.alert('Error', e.response?.data?.detail || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <View style={styles.center}>
      <Text style={styles.title}>Music Sagar</Text>
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#666" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#666" value={password} onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity style={styles.btn} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Login</Text>}
      </TouchableOpacity>
    </View>
  );
}

function HomeScreen() {
  return <View style={styles.center}><Text style={styles.title}>Home</Text></View>;
}

function SearchScreen() {
  return <View style={styles.center}><Text style={styles.title}>Search</Text></View>;
}

export default function App() {
  const [user, setUser] = React.useState(null);

  if (!user) return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <LoginScreen onLogin={setUser} />
    </SafeAreaProvider>
  );

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <NavigationContainer>
        <Tab.Navigator screenOptions={({ route }) => ({
          tabBarStyle: { backgroundColor: '#1a1a2e' },
          tabBarActiveTintColor: '#7c3aed',
          tabBarInactiveTintColor: '#606070',
          headerStyle: { backgroundColor: '#1a1a2e' },
          headerTintColor: '#fff',
          tabBarIcon: ({ color, size }) => {
            const icons = { Home: 'home', Search: 'search' };
            return <Ionicons name={icons[route.name]} size={size} color={color} />;
          },
        })}>
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Search" component={SearchScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, backgroundColor: '#0f0f1a', justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginBottom: 32 },
  input: { width: '100%', backgroundColor: '#1a1a2e', color: '#fff', borderRadius: 10, padding: 14, marginBottom: 14, borderWidth: 1, borderColor: '#2a2a3e' },
  btn: { width: '100%', backgroundColor: '#7c3aed', borderRadius: 10, padding: 16, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
