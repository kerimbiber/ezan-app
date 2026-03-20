import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  ScrollView,
  Alert,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import { cancelAllNotifications } from '../utils/notifications';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const toggleNotifications = async (value) => {
    setNotificationsEnabled(value);
    if (!value) {
      await cancelAllNotifications();
      Alert.alert('Bildirimler', 'Ezan bildirimleri kapatıldı.');
    } else {
      Alert.alert(
        'Bildirimler',
        'Ezan bildirimleri açıldı. Ana sayfayı yenileyin.'
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ayarlar</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bildirimler</Text>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Text style={styles.rowTitle}>Ezan Bildirimleri</Text>
            <Text style={styles.rowSubtitle}>
              Her namaz vakti geldiğinde bildirim al
            </Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
            trackColor={{ false: '#333', true: '#e2b04a55' }}
            thumbColor={notificationsEnabled ? '#e2b04a' : '#666'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hakkında</Text>
        <View style={styles.infoCard}>
          <Text style={styles.appName}>Ezan Vakti</Text>
          <Text style={styles.version}>v1.0.0</Text>
          <Text style={styles.description}>
            Namaz vakitleri, kıble pusulası ve günlük hadis uygulaması.
            Konum bazlı otomatik hesaplama ile doğru vakitler.
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hesaplama</Text>
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            Namaz vakitleri konumunuza göre en uygun hesaplama metodu ile
            otomatik olarak hesaplanır. Türkiye için Diyanet metodu kullanılır.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    color: '#e2b04a',
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },
  row: {
    backgroundColor: '#16213e',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowLeft: {
    flex: 1,
    marginRight: 12,
  },
  rowTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  rowSubtitle: {
    color: '#888',
    fontSize: 13,
    marginTop: 4,
  },
  infoCard: {
    backgroundColor: '#16213e',
    borderRadius: 14,
    padding: 20,
  },
  appName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  version: {
    color: '#e2b04a',
    fontSize: 14,
    marginTop: 4,
  },
  description: {
    color: '#aaa',
    fontSize: 14,
    lineHeight: 22,
    marginTop: 12,
  },
  infoText: {
    color: '#aaa',
    fontSize: 14,
    lineHeight: 22,
  },
});
