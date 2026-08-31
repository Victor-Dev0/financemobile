import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

export default function ErrorBanner({ message }: { message: string }) {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.text}>{message}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fee',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  text: {
    color: '#c00',
    textAlign: 'center',
  },
});
