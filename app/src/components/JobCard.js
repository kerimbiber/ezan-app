import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../utils/theme';
import { CARGO_TYPE_LABELS, CARGO_TYPE_ICONS, formatPrice, formatDate } from '../utils/constants';

export default function JobCard({ job, onPress, hasOffer, showOfferCount }) {
  const { colors } = useTheme();
  const icon = CARGO_TYPE_ICONS[job.cargoType] || '📦';
  const label = CARGO_TYPE_LABELS[job.cargoType] || 'Yük';

  const statusColor = job.status === 'active' ? colors.success : job.status === 'pending' ? colors.warning : colors.primaryLight;
  const statusText = job.status === 'active' ? 'Aktif' : job.status === 'pending' ? 'Bekliyor' : 'Tamamlandı';

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.typeRow}>
          <View style={[styles.iconBox, { backgroundColor: `${colors.primaryLight}20` }]}>
            <Text style={styles.iconEmoji}>{icon}</Text>
          </View>
          <View>
            <Text style={[styles.typeLabel, { color: colors.textPrimary }]}>{label}</Text>
            <Text style={[styles.weight, { color: colors.textMuted }]}>{job.weight} ton</Text>
          </View>
        </View>
        <Text style={styles.price}>{formatPrice(job.price)}</Text>
      </View>

      <View style={[styles.route, { borderColor: colors.border }]}>
        <View style={styles.city}>
          <Text style={[styles.cityLabel, { color: colors.textMuted }]}>YÜKLEME</Text>
          <Text style={[styles.cityName, { color: colors.textPrimary }]}>{job.from}</Text>
        </View>
        <Ionicons name="arrow-forward" size={22} color={colors.accent} />
        <View style={styles.city}>
          <Text style={[styles.cityLabel, { color: colors.textMuted }]}>TESLİMAT</Text>
          <Text style={[styles.cityName, { color: colors.textPrimary }]}>{job.to}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={14} color={colors.textMuted} />
          <Text style={[styles.dateText, { color: colors.textMuted }]}>{formatDate(job.date)}</Text>
        </View>
        {hasOffer ? (
          <View style={[styles.badge, { backgroundColor: `${colors.warning}20` }]}>
            <Text style={[styles.badgeText, { color: colors.warning }]}>Teklif Verildi</Text>
          </View>
        ) : showOfferCount ? (
          <View style={[styles.badge, { backgroundColor: `${colors.warning}20` }]}>
            <Text style={[styles.badgeText, { color: colors.warning }]}>{showOfferCount} Teklif</Text>
          </View>
        ) : (
          <View style={[styles.badge, { backgroundColor: `${statusColor}20` }]}>
            <Text style={[styles.badgeText, { color: statusColor }]}>{statusText}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  typeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconBox: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  iconEmoji: { fontSize: 18 },
  typeLabel: { fontSize: 15, fontWeight: '600' },
  weight: { fontSize: 12 },
  price: { fontSize: 16, fontWeight: '700', color: '#e67e22' },
  route: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, borderTopWidth: 1, borderBottomWidth: 1, marginBottom: 10 },
  city: { flex: 1, alignItems: 'center' },
  cityLabel: { fontSize: 10, letterSpacing: 0.5, fontWeight: '500' },
  cityName: { fontSize: 14, fontWeight: '600', marginTop: 2 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dateText: { fontSize: 12 },
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
  badgeText: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
});
