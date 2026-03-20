import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.text}>Music Sagar</Text>
      <Text style={styles.subtext}>App is running!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  subtext: {
    color: '#a0a0b0',
    fontSize: 16,
    marginTop: 8,
  },
});
