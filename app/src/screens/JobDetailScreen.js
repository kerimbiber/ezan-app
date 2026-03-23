import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../utils/theme';
import { useAuth } from '../utils/auth';
import { CARGO_TYPE_LABELS, CARGO_TYPE_ICONS, VEHICLE_LABELS, formatPrice, formatDate } from '../utils/constants';
import DB from '../utils/db';

export default function JobDetailScreen({ navigation, route }) {
  const { jobId } = route.params;
  const { colors } = useTheme();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [shipper, setShipper] = useState(null);
  const [existingOffer, setExistingOffer] = useState(null);
  const [offersCount, setOffersCount] = useState(0);

  useFocusEffect(useCallback(() => { loadDetail(); }, []));

  const loadDetail = async () => {
    const j = await DB.getJobById(jobId);
    if (!j) return;
    setJob(j);
    const s = await DB.getUserById(j.shipperId);
    setShipper(s);
    const offers = await DB.getOffersForJob(jobId);
    setOffersCount(offers.length);
    if (user?.role === 'carrier') {
      const myOffers = await DB.getOffersByCarrier(user.id);
      setExistingOffer(myOffers.find(o => o.jobId === jobId) || null);
    }
  };

  const handleApply = async () => {
    if (existingOffer) {
      Alert.alert('Bilgi', 'Bu ilana zaten teklif verdiniz.');
      return;
    }
    const offer = {
      id: 'o' + Date.now(),
      jobId, carrierId: user.id,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    await DB.saveOffer(offer);
    Alert.alert('Başarılı', 'Teklifiniz gönderildi!');
    loadDetail();
  };

  if (!job) return <View style={[styles.container, { backgroundColor: colors.bgPrimary }]} />;

  const isOwner = user && user.id === job.shipperId;
  const isCarrier = user && user.role === 'carrier';

  return (
    <View style={[styles.container, { backgroundColor: colors.bgPrimary }]}>
      <View style={[styles.header, { backgroundColor: colors.bgSecondary, borderColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>İlan Detayı</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.detailHeader}>
          <Text style={styles.cargoIcon}>{CARGO_TYPE_ICONS[job.cargoType] || '📦'}</Text>
          <Text style={[styles.cargoLabel, { color: colors.textPrimary }]}>{CARGO_TYPE_LABELS[job.cargoType] || 'Yük'}</Text>
          <Text style={[styles.weightText, { color: colors.textMuted }]}>{job.weight} ton</Text>
        </View>

        <View style={[styles.routeBox, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          <View style={styles.routeCity}>
            <Text style={[styles.routeLabel, { color: colors.textMuted }]}>YÜKLEME</Text>
            <Text style={[styles.routeName, { color: colors.textPrimary }]}>{job.from}</Text>
          </View>
          <Ionicons name="arrow-forward" size={26} color={colors.accent} />
          <View style={styles.routeCity}>
            <Text style={[styles.routeLabel, { color: colors.textMuted }]}>TESLİMAT</Text>
            <Text style={[styles.routeName, { color: colors.textPrimary }]}>{job.to}</Text>
          </View>
        </View>

        <View style={styles.priceBox}>
          <Text style={styles.priceLabel}>Teklif Edilen Ücret</Text>
          <Text style={styles.priceValue}>{formatPrice(job.price)}</Text>
        </View>

        <View style={styles.infoGrid}>
          {[
            { label: 'Yükleme Tarihi', value: formatDate(job.date) },
            { label: 'Teslimat Tarihi', value: formatDate(job.deliveryDate) },
            { label: 'Araç Tercihi', value: VEHICLE_LABELS[job.vehiclePref] || '-' },
            { label: 'Durum', value: job.status === 'active' ? 'Aktif' : job.status === 'done' ? 'Tamamlandı' : 'Bekliyor' },
          ].map((item, i) => (
            <View key={i} style={[styles.infoItem, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
              <Text style={[styles.infoLabel, { color: colors.textMuted }]}>{item.label}</Text>
              <Text style={[styles.infoValue, { color: colors.textPrimary }]}>{item.value}</Text>
            </View>
          ))}
        </View>

        {job.desc ? (
          <View style={[styles.descBox, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
            <Text style={[styles.descTitle, { color: colors.textSecondary }]}>Açıklama</Text>
            <Text style={[styles.descText, { color: colors.textPrimary }]}>{job.desc}</Text>
          </View>
        ) : null}

        {shipper && (
          <View style={[styles.publisherBox, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
            <View style={styles.publisherAvatar}>
              <Text style={styles.publisherInitial}>{shipper.name.charAt(0)}</Text>
            </View>
            <View>
              <Text style={[styles.publisherName, { color: colors.textPrimary }]}>{shipper.name}</Text>
              <Text style={[styles.publisherCompany, { color: colors.textMuted }]}>{shipper.company || 'Bireysel'}</Text>
            </View>
          </View>
        )}

        {isOwner && (
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('JobOffers', { jobId: job.id })}>
            <Text style={styles.actionBtnText}>Gelen Teklifleri Gör ({offersCount})</Text>
          </TouchableOpacity>
        )}

        {isCarrier && !isOwner && (
          existingOffer ? (
            <View style={[styles.statusBadge, {
              backgroundColor: existingOffer.status === 'accepted' ? `${colors.success}20` :
                existingOffer.status === 'rejected' ? `${colors.danger}20` : `${colors.warning}20`
            }]}>
              <Text style={[styles.statusBadgeText, {
                color: existingOffer.status === 'accepted' ? colors.success :
                  existingOffer.status === 'rejected' ? colors.danger : colors.warning
              }]}>
                {existingOffer.status === 'accepted' ? 'Teklifiniz kabul edildi!' :
                  existingOffer.status === 'rejected' ? 'Teklifiniz reddedildi' : 'Teklifiniz değerlendiriliyor'}
              </Text>
            </View>
          ) : (
            <TouchableOpacity style={styles.actionBtn} onPress={handleApply}>
              <Text style={styles.actionBtnText}>Teklif Ver</Text>
            </TouchableOpacity>
          )
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
  detailHeader: { alignItems: 'center', paddingVertical: 20 },
  cargoIcon: { fontSize: 40 },
  cargoLabel: { fontSize: 22, fontWeight: '700', marginTop: 8 },
  weightText: { fontSize: 14, marginTop: 4 },
  routeBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 20, borderRadius: 16, borderWidth: 1, marginBottom: 16 },
  routeCity: { alignItems: 'center', flex: 1 },
  routeLabel: { fontSize: 10, letterSpacing: 0.5, fontWeight: '500' },
  routeName: { fontSize: 18, fontWeight: '700', marginTop: 4 },
  priceBox: { backgroundColor: '#e67e22', borderRadius: 16, padding: 20, alignItems: 'center', marginBottom: 16 },
  priceLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 13 },
  priceValue: { color: '#fff', fontSize: 30, fontWeight: '800', marginTop: 4 },
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
  infoItem: { width: '47%', borderWidth: 1, borderRadius: 12, padding: 14 },
  infoLabel: { fontSize: 10, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 4 },
  infoValue: { fontSize: 15, fontWeight: '600' },
  descBox: { borderWidth: 1, borderRadius: 12, padding: 16, marginBottom: 16 },
  descTitle: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  descText: { fontSize: 14, lineHeight: 22 },
  publisherBox: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderRadius: 12, padding: 14, marginBottom: 16 },
  publisherAvatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#1a5276', justifyContent: 'center', alignItems: 'center' },
  publisherInitial: { color: '#fff', fontSize: 16, fontWeight: '700' },
  publisherName: { fontSize: 15, fontWeight: '600' },
  publisherCompany: { fontSize: 12 },
  actionBtn: { backgroundColor: '#e67e22', paddingVertical: 16, borderRadius: 14, alignItems: 'center' },
  actionBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  statusBadge: { paddingVertical: 16, borderRadius: 14, alignItems: 'center' },
  statusBadgeText: { fontSize: 15, fontWeight: '600' },
});
