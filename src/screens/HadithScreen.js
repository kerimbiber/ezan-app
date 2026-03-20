import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { getDailyHadith, getRandomHadith } from '../utils/hadith';

export default function HadithScreen() {
  const daily = getDailyHadith();
  const [randomHadith, setRandomHadith] = useState(null);

  const showRandom = () => {
    setRandomHadith(getRandomHadith());
  };

  const displayed = randomHadith || daily;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Günün Hadisi</Text>
        <Text style={styles.subtitle}>Hz. Muhammed (s.a.v.)</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.quoteContainer}>
          <Text style={styles.quoteMark}>"</Text>
          <Text style={styles.hadithText}>{displayed.text}</Text>
        </View>
        <View style={styles.sourceContainer}>
          <View style={styles.divider} />
          <Text style={styles.source}>{displayed.source}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={showRandom}>
        <Text style={styles.buttonText}>Başka Hadis Göster</Text>
      </TouchableOpacity>

      {randomHadith && (
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => setRandomHadith(null)}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>
            Günün Hadisine Dön
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    paddingHorizontal: 24,
  },
  header: {
    paddingTop: 60,
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    color: '#e2b04a',
    fontSize: 14,
    marginTop: 4,
    fontStyle: 'italic',
  },
  card: {
    backgroundColor: '#16213e',
    borderRadius: 20,
    padding: 28,
    borderWidth: 1,
    borderColor: '#e2b04a22',
  },
  quoteContainer: {
    position: 'relative',
  },
  quoteMark: {
    color: '#e2b04a33',
    fontSize: 80,
    fontWeight: '700',
    position: 'absolute',
    top: -40,
    left: -8,
  },
  hadithText: {
    color: '#eee',
    fontSize: 19,
    lineHeight: 30,
    fontStyle: 'italic',
    paddingTop: 10,
  },
  sourceContainer: {
    marginTop: 24,
    alignItems: 'flex-end',
  },
  divider: {
    width: 40,
    height: 2,
    backgroundColor: '#e2b04a44',
    marginBottom: 12,
  },
  source: {
    color: '#e2b04a',
    fontSize: 14,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#e2b04a',
    marginTop: 24,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#1a1a2e',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#e2b04a55',
  },
  secondaryButtonText: {
    color: '#e2b04a',
  },
});
