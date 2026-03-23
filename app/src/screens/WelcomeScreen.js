import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../utils/theme';

export default function WelcomeScreen({ navigation }) {
  const { isDark, toggleTheme, colors } = useTheme();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#1a5276', '#2980b9', '#1a5276']} style={styles.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <TouchableOpacity style={styles.themeBtn} onPress={toggleTheme}>
          <Ionicons name={isDark ? 'moon' : 'sunny'} size={20} color="#fff" />
        </TouchableOpacity>

        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Ionicons name="bus" size={60} color="#fff" />
            <Text style={styles.title}>Çağlayan</Text>
            <Text style={styles.subtitle}>Lojistik</Text>
            <Text style={styles.tagline}>Yükünüz güvende, yolunuz açık</Text>
          </View>

          <View style={styles.buttons}>
            <TouchableOpacity
              style={styles.btnPrimary}
              onPress={() => navigation.navigate('Login', { role: 'shipper' })}
            >
              <Ionicons name="cube-outline" size={20} color="#fff" />
              <Text style={styles.btnText}>Yük Sahibi Girişi</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnSecondary}
              onPress={() => navigation.navigate('Login', { role: 'carrier' })}
            >
              <Ionicons name="car-outline" size={20} color="#fff" />
              <Text style={styles.btnText}>Nakliyeci Girişi</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  themeBtn: {
    position: 'absolute', top: 50, right: 20,
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center', alignItems: 'center',
  },
  content: { alignItems: 'center', paddingHorizontal: 32, width: '100%' },
  logoContainer: { alignItems: 'center', marginBottom: 48 },
  title: { fontSize: 32, fontWeight: '700', color: '#fff', marginTop: 16 },
  subtitle: { fontSize: 32, fontWeight: '300', color: 'rgba(255,255,255,0.85)' },
  tagline: { fontSize: 15, color: 'rgba(255,255,255,0.7)', fontStyle: 'italic', marginTop: 8 },
  buttons: { width: '100%', maxWidth: 300, gap: 14 },
  btnPrimary: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#e67e22', paddingVertical: 14, borderRadius: 14,
  },
  btnSecondary: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: 'rgba(255,255,255,0.15)', paddingVertical: 14, borderRadius: 14,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)',
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
