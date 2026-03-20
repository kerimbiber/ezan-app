import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  RefreshControl,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import {
  getPrayerTimes,
  formatTime,
  getTimeRemaining,
  PRAYER_NAMES,
} from '../utils/prayerTimes';
import { scheduleAllPrayerNotifications, requestNotificationPermission } from '../utils/notifications';

const PRAYER_LIST = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];

export default function PrayerTimesScreen() {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [location, setLocation] = useState(null);
  const [cityName, setCityName] = useState('Konum alınıyor...');
  const [remaining, setRemaining] = useState('');
  const [nextPrayer, setNextPrayer] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPrayerTimes = useCallback(async () => {
    try {
      setError(null);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Konum izni gerekli');
        setLoading(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setLocation(loc.coords);

      // Şehir adını al
      try {
        const [address] = await Location.reverseGeocodeAsync({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
        if (address) {
          setCityName(address.city || address.subregion || address.region || 'Bilinmeyen');
        }
      } catch {
        setCityName('Konum alındı');
      }

      const times = getPrayerTimes(loc.coords.latitude, loc.coords.longitude);
      setPrayerTimes(times);

      // Bildirimleri ayarla
      const granted = await requestNotificationPermission();
      if (granted) {
        await scheduleAllPrayerNotifications(times);
      }
    } catch (err) {
      setError('Namaz vakitleri yüklenemedi');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPrayerTimes();
  }, [loadPrayerTimes]);

  // Kalan süreyi güncelle
  useEffect(() => {
    if (!prayerTimes) return;

    const updateRemaining = () => {
      const next = prayerTimes.nextPrayer;
      if (next && next !== 'none') {
        setNextPrayer(next);
        const nextTime = prayerTimes.timeForPrayer(next);
        const rem = getTimeRemaining(nextTime);
        setRemaining(rem || '');
      } else {
        setNextPrayer(null);
        setRemaining('');
      }
    };

    updateRemaining();
    const interval = setInterval(updateRemaining, 1000);
    return () => clearInterval(interval);
  }, [prayerTimes]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPrayerTimes();
    setRefreshing(false);
  };

  const getCurrentPrayer = () => {
    if (!prayerTimes) return null;
    return prayerTimes.currentPrayer;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
        <ActivityIndicator size="large" color="#e2b04a" />
        <Text style={styles.loadingText}>Konum alınıyor...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const currentPrayer = getCurrentPrayer();
  const now = new Date();
  const dateStr = now.toLocaleDateString('tr-TR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#e2b04a" />
      }
    >
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.cityName}>{cityName}</Text>
        <Text style={styles.date}>{dateStr}</Text>
      </View>

      {/* Sonraki vakit */}
      {nextPrayer && nextPrayer !== 'none' && (
        <View style={styles.nextPrayerCard}>
          <Text style={styles.nextPrayerLabel}>Sonraki Vakit</Text>
          <Text style={styles.nextPrayerName}>
            {PRAYER_NAMES[nextPrayer] || nextPrayer}
          </Text>
          <Text style={styles.nextPrayerTime}>
            {prayerTimes ? formatTime(prayerTimes.timeForPrayer(nextPrayer)) : ''}
          </Text>
          {remaining ? (
            <Text style={styles.remaining}>{remaining} kaldı</Text>
          ) : null}
        </View>
      )}

      {/* Vakit listesi */}
      <View style={styles.timesContainer}>
        {PRAYER_LIST.map((prayer) => {
          const isActive = currentPrayer === prayer;
          const isNext = nextPrayer === prayer;
          return (
            <View
              key={prayer}
              style={[
                styles.timeRow,
                isActive && styles.activeRow,
                isNext && styles.nextRow,
              ]}
            >
              <View style={styles.timeLeft}>
                <View
                  style={[
                    styles.dot,
                    isActive && styles.activeDot,
                    isNext && styles.nextDot,
                  ]}
                />
                <Text
                  style={[
                    styles.prayerName,
                    isActive && styles.activeText,
                    isNext && styles.nextText,
                  ]}
                >
                  {PRAYER_NAMES[prayer]}
                </Text>
              </View>
              <Text
                style={[
                  styles.prayerTime,
                  isActive && styles.activeText,
                  isNext && styles.nextText,
                ]}
              >
                {prayerTimes ? formatTime(prayerTimes[prayer]) : '--:--'}
              </Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ccc',
    marginTop: 16,
    fontSize: 16,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 16,
    alignItems: 'center',
  },
  cityName: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
  },
  date: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 4,
  },
  nextPrayerCard: {
    backgroundColor: '#16213e',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2b04a33',
  },
  nextPrayerLabel: {
    color: '#e2b04a',
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  nextPrayerName: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '700',
    marginTop: 8,
  },
  nextPrayerTime: {
    color: '#e2b04a',
    fontSize: 40,
    fontWeight: '300',
    marginTop: 4,
  },
  remaining: {
    color: '#aaa',
    fontSize: 16,
    marginTop: 8,
  },
  timesContainer: {
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 40,
    backgroundColor: '#16213e',
    borderRadius: 20,
    overflow: 'hidden',
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a2e',
  },
  activeRow: {
    backgroundColor: '#1a3a5c',
  },
  nextRow: {
    backgroundColor: '#2a1a3e',
  },
  timeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#555',
    marginRight: 12,
  },
  activeDot: {
    backgroundColor: '#4ade80',
  },
  nextDot: {
    backgroundColor: '#e2b04a',
  },
  prayerName: {
    color: '#ccc',
    fontSize: 17,
    fontWeight: '500',
  },
  prayerTime: {
    color: '#ccc',
    fontSize: 17,
    fontWeight: '400',
  },
  activeText: {
    color: '#4ade80',
    fontWeight: '600',
  },
  nextText: {
    color: '#e2b04a',
    fontWeight: '600',
  },
});
