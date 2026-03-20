import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Platform,
} from 'react-native';
import * as Location from 'expo-location';
import { Magnetometer } from 'expo-sensors';
import { calculateQiblaDirection, getDistanceToKaaba } from '../utils/qibla';

const { width } = Dimensions.get('window');
const COMPASS_SIZE = width * 0.75;

export default function QiblaScreen() {
  const [heading, setHeading] = useState(0);
  const [qiblaAngle, setQiblaAngle] = useState(0);
  const [distance, setDistance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let subscription;

    async function setup() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Konum izni gerekli');
          setLoading(false);
          return;
        }

        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        const qibla = calculateQiblaDirection(
          loc.coords.latitude,
          loc.coords.longitude
        );
        setQiblaAngle(qibla);

        const dist = getDistanceToKaaba(
          loc.coords.latitude,
          loc.coords.longitude
        );
        setDistance(dist);

        const available = await Magnetometer.isAvailableAsync();
        if (!available) {
          setError('Pusula sensörü bulunamadı');
          setLoading(false);
          return;
        }

        Magnetometer.setUpdateInterval(100);
        subscription = Magnetometer.addListener((data) => {
          let angle = Math.atan2(data.y, data.x) * (180 / Math.PI);
          if (Platform.OS === 'ios') {
            angle = angle + 90;
          }
          if (angle < 0) angle += 360;
          setHeading(angle);
        });

        setLoading(false);
      } catch (err) {
        setError('Pusula başlatılamadı');
        setLoading(false);
      }
    }

    setup();
    return () => {
      if (subscription) subscription.remove();
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e2b04a" />
        <Text style={styles.loadingText}>Pusula hazırlanıyor...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Kıble yönünü pusula üzerinde göster
  const qiblaRotation = qiblaAngle - heading;
  const compassRotation = -heading;

  // Kıble yönüne ne kadar yakın olduğumuzu hesapla
  let angleDiff = Math.abs(((qiblaRotation % 360) + 360) % 360);
  if (angleDiff > 180) angleDiff = 360 - angleDiff;
  const isAligned = angleDiff < 5;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Kıble Pusulası</Text>
        {distance && (
          <Text style={styles.distance}>Kabe'ye uzaklık: {distance.toLocaleString()} km</Text>
        )}
      </View>

      <View style={styles.compassContainer}>
        {/* Pusula arka planı */}
        <View
          style={[
            styles.compass,
            { transform: [{ rotate: `${compassRotation}deg` }] },
          ]}
        >
          {/* Yön işaretleri */}
          <Text style={[styles.direction, styles.north]}>K</Text>
          <Text style={[styles.direction, styles.south]}>G</Text>
          <Text style={[styles.direction, styles.east]}>D</Text>
          <Text style={[styles.direction, styles.west]}>B</Text>

          {/* Derece çizgileri */}
          {Array.from({ length: 72 }, (_, i) => (
            <View
              key={i}
              style={[
                styles.tick,
                {
                  transform: [
                    { rotate: `${i * 5}deg` },
                    { translateY: -COMPASS_SIZE / 2 + 10 },
                  ],
                },
                i % 6 === 0 && styles.majorTick,
              ]}
            />
          ))}
        </View>

        {/* Kıble oku */}
        <View
          style={[
            styles.qiblaArrowContainer,
            { transform: [{ rotate: `${qiblaRotation}deg` }] },
          ]}
        >
          <View style={styles.qiblaArrow}>
            <View style={[styles.arrowHead, isAligned && styles.arrowAligned]} />
            <View style={[styles.arrowBody, isAligned && styles.arrowBodyAligned]} />
          </View>
          <Text style={[styles.kaaba, isAligned && styles.kaabaAligned]}>
            🕋
          </Text>
        </View>

        {/* Merkez nokta */}
        <View style={[styles.center, isAligned && styles.centerAligned]} />
      </View>

      {/* Durum */}
      <View style={styles.statusContainer}>
        {isAligned ? (
          <Text style={styles.alignedText}>Kıble yönündesiniz!</Text>
        ) : (
          <Text style={styles.degreesText}>
            {Math.round(((qiblaRotation % 360) + 360) % 360)}°
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
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
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  distance: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 8,
  },
  compassContainer: {
    width: COMPASS_SIZE,
    height: COMPASS_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  compass: {
    width: COMPASS_SIZE,
    height: COMPASS_SIZE,
    borderRadius: COMPASS_SIZE / 2,
    borderWidth: 2,
    borderColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  direction: {
    position: 'absolute',
    fontSize: 18,
    fontWeight: '700',
    color: '#888',
  },
  north: {
    top: 20,
    color: '#e2b04a',
  },
  south: {
    bottom: 20,
  },
  east: {
    right: 20,
  },
  west: {
    left: 20,
  },
  tick: {
    position: 'absolute',
    width: 1,
    height: 8,
    backgroundColor: '#444',
  },
  majorTick: {
    width: 2,
    height: 14,
    backgroundColor: '#666',
  },
  qiblaArrowContainer: {
    position: 'absolute',
    width: COMPASS_SIZE,
    height: COMPASS_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qiblaArrow: {
    position: 'absolute',
    alignItems: 'center',
    top: 25,
  },
  arrowHead: {
    width: 0,
    height: 0,
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderBottomWidth: 20,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#e2b04a',
  },
  arrowAligned: {
    borderBottomColor: '#4ade80',
  },
  arrowBody: {
    width: 4,
    height: 40,
    backgroundColor: '#e2b04a',
  },
  arrowBodyAligned: {
    backgroundColor: '#4ade80',
  },
  kaaba: {
    position: 'absolute',
    top: -5,
    fontSize: 28,
  },
  kaabaAligned: {
    fontSize: 36,
  },
  center: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#e2b04a',
    position: 'absolute',
  },
  centerAligned: {
    backgroundColor: '#4ade80',
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  statusContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  alignedText: {
    color: '#4ade80',
    fontSize: 22,
    fontWeight: '700',
  },
  degreesText: {
    color: '#e2b04a',
    fontSize: 28,
    fontWeight: '300',
  },
});
