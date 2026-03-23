import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../utils/theme';
import { useAuth } from '../utils/auth';
import { VEHICLE_LABELS } from '../utils/constants';

export default function ProfileScreen({ navigation }) {
  const { colors, isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  if (!user) return null;

  const isCarrier = user.role === 'carrier';

  const handleLogout = async () => {
    await logout();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bgPrimary }]}>
      <View style={[styles.header, { backgroundColor: colors.bgSecondary, borderColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Profil</Text>
        <TouchableOpacity onPress={toggleTheme}>
          <Ionicons name={isDark ? 'moon' : 'sunny'} size={22} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
          </View>
          <Text style={[styles.name, { color: colors.textPrimary }]}>{user.name}</Text>
          <View style={[styles.badge, { backgroundColor: isCarrier ? '#fff3e020' : '#e8f5e920' }]}>
            <Text style={{ color: isCarrier ? '#e65100' : '#2e7d32', fontSize: 12, fontWeight: '600' }}>
              {isCarrier ? 'Nakliyeci' : 'Yük Sahibi'}
            </Text>
          </View>
        </View>

        <View style={[styles.infoCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          {[
            { label: 'E-posta', value: user.email },
            { label: 'Telefon', value: user.phone || '-' },
            { label: 'Firma', value: user.company || '-' },
            ...(isCarrier ? [
              { label: 'Plaka', value: user.plate || '-' },
              { label: 'Araç Tipi', value: VEHICLE_LABELS[user.vehicle] || '-' },
            ] : []),
          ].map((row, i, arr) => (
            <View key={i} style={[styles.infoRow, { borderBottomColor: colors.border }, i === arr.length - 1 && { borderBottomWidth: 0 }]}>
              <Text style={[styles.infoLabel, { color: colors.textMuted }]}>{row.label}</Text>
              <Text style={[styles.infoValue, { color: colors.textPrimary }]}>{row.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={[styles.themeBtn, { backgroundColor: colors.bgCard, borderColor: colors.border }]} onPress={toggleTheme}>
            <Ionicons name={isDark ? 'sunny' : 'moon'} size={20} color={colors.textSecondary} />
            <Text style={[styles.themeBtnText, { color: colors.textPrimary }]}>
              {isDark ? 'Açık Tema' : 'Koyu Tema'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#fff" />
            <Text style={styles.logoutBtnText}>Çıkış Yap</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 16, borderBottomWidth: 1 },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  body: { padding: 20, paddingBottom: 40 },
  profileCard: { alignItems: 'center', paddingVertical: 24 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#1a5276', justifyContent: 'center', alignItems: 'center', marginBottom: 14 },
  avatarText: { color: '#fff', fontSize: 28, fontWeight: '700' },
  name: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  badge: { paddingHorizontal: 14, paddingVertical: 4, borderRadius: 20 },
  infoCard: { borderWidth: 1, borderRadius: 16, overflow: 'hidden', marginBottom: 20 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 18, borderBottomWidth: 1 },
  infoLabel: { fontSize: 14 },
  infoValue: { fontSize: 14, fontWeight: '600' },
  actions: { gap: 10 },
  themeBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 14, borderWidth: 1 },
  themeBtnText: { fontSize: 15, fontWeight: '600' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#c0392b', paddingVertical: 14, borderRadius: 14 },
  logoutBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});
