import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../utils/theme';
import { CARGO_TYPE_LABELS, VEHICLE_LABELS } from '../utils/constants';
import DB from '../utils/db';

export default function JobOffersScreen({ navigation, route }) {
  const { jobId } = route.params;
  const { colors } = useTheme();
  const [job, setJob] = useState(null);
  const [offers, setOffers] = useState([]);
  const [carriers, setCarriers] = useState({});

  useFocusEffect(useCallback(() => { loadOffers(); }, []));

  const loadOffers = async () => {
    const j = await DB.getJobById(jobId);
    setJob(j);
    const offs = await DB.getOffersForJob(jobId);
    setOffers(offs);
    const users = await DB.getUsers();
    const map = {};
    users.forEach(u => { map[u.id] = u; });
    setCarriers(map);
  };

  const respond = async (offerId, status) => {
    await DB.updateOffer(offerId, { status });
    Alert.alert('Başarılı', status === 'accepted' ? 'Teklif kabul edildi!' : 'Teklif reddedildi.');
    loadOffers();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bgPrimary }]}>
      <View style={[styles.header, { backgroundColor: colors.bgSecondary, borderColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Gelen Teklifler</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        {job && (
          <Text style={[styles.jobInfo, { color: colors.textMuted }]}>
            {CARGO_TYPE_LABELS[job.cargoType]} - {job.from} → {job.to}
          </Text>
        )}

        {offers.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="checkmark-circle-outline" size={48} color={colors.textMuted} style={{ opacity: 0.4 }} />
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>Henüz teklif gelmedi</Text>
          </View>
        ) : (
          offers.map(offer => {
            const carrier = carriers[offer.carrierId];
            if (!carrier) return null;
            return (
              <View key={offer.id} style={[styles.offerCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
                <View style={styles.offerHeader}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{carrier.name.charAt(0)}</Text>
                  </View>
                  <View>
                    <Text style={[styles.carrierName, { color: colors.textPrimary }]}>{carrier.name}</Text>
                    <Text style={[styles.carrierCompany, { color: colors.textMuted }]}>{carrier.company || 'Bireysel'}</Text>
                  </View>
                </View>

                <View style={[styles.offerDetails, { backgroundColor: colors.bgInput }]}>
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Telefon</Text>
                    <Text style={[styles.detailValue, { color: colors.textPrimary }]}>{carrier.phone}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Plaka</Text>
                    <Text style={[styles.detailValue, { color: colors.textPrimary }]}>{carrier.plate || '-'}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Araç</Text>
                    <Text style={[styles.detailValue, { color: colors.textPrimary }]}>{VEHICLE_LABELS[carrier.vehicle] || '-'}</Text>
                  </View>
                </View>

                {offer.status === 'pending' ? (
                  <View style={styles.offerActions}>
                    <TouchableOpacity style={[styles.acceptBtn]} onPress={() => respond(offer.id, 'accepted')}>
                      <Text style={styles.btnText}>Kabul Et</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.rejectBtn]} onPress={() => respond(offer.id, 'rejected')}>
                      <Text style={styles.btnText}>Reddet</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={[styles.statusBox, { backgroundColor: offer.status === 'accepted' ? '#27ae6020' : '#c0392b20' }]}>
                    <Text style={{ color: offer.status === 'accepted' ? '#27ae60' : '#c0392b', fontWeight: '600', textAlign: 'center' }}>
                      {offer.status === 'accepted' ? 'Kabul Edildi' : 'Reddedildi'}
                    </Text>
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 16, borderBottomWidth: 1 },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  body: { padding: 20, paddingBottom: 40 },
  jobInfo: { fontSize: 14, marginBottom: 16 },
  empty: { alignItems: 'center', padding: 48 },
  emptyText: { fontSize: 14, marginTop: 12 },
  offerCard: { borderWidth: 1, borderRadius: 14, padding: 16, marginBottom: 12 },
  offerHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#e67e22', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  carrierName: { fontSize: 15, fontWeight: '600' },
  carrierCompany: { fontSize: 12 },
  offerDetails: { borderRadius: 10, padding: 12, marginBottom: 14, gap: 8 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between' },
  detailLabel: { fontSize: 13 },
  detailValue: { fontSize: 13, fontWeight: '600' },
  offerActions: { flexDirection: 'row', gap: 10 },
  acceptBtn: { flex: 1, backgroundColor: '#27ae60', paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  rejectBtn: { flex: 1, backgroundColor: '#c0392b', paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  statusBox: { paddingVertical: 12, borderRadius: 10 },
});
