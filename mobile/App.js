import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet } from 'react-native';

enableScreens();

const Tab = createBottomTabNavigator();

function HomeScreen() {
  return <View style={s.c}><Text style={s.t}>Home</Text></View>;
}
function SearchScreen() {
  return <View style={s.c}><Text style={s.t}>Search</Text></View>;
}

export default function App() {
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
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={route.name === 'Home' ? 'home' : 'search'} size={size} color={color} />
          ),
        })}>
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Search" component={SearchScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const s = StyleSheet.create({
  c: { flex: 1, backgroundColor: '#0f0f1a', justifyContent: 'center', alignItems: 'center' },
  t: { color: '#fff', fontSize: 20 },
});
