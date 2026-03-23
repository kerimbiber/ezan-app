import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../utils/theme';
import { useAuth } from '../utils/auth';
import DB from '../utils/db';
import JobCard from '../components/JobCard';

export default function ShipperHomeScreen({ navigation }) {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [stats, setStats] = useState({ active: 0, pending: 0, done: 0 });
  const [jobs, setJobs] = useState([]);

  useFocusEffect(useCallback(() => {
    loadData();
  }, []));

  const loadData = async () => {
    if (!user) return;
    const allJobs = await DB.getJobs();
    const myJobs = allJobs.filter(j => j.shipperId === user.id);
    const offers = await DB.getOffers();

    const active = myJobs.filter(j => j.status === 'active').length;
    const pending = offers.filter(o => o.status === 'pending' && myJobs.some(j => j.id === o.jobId)).length;
    const done = myJobs.filter(j => j.status === 'done').length;

    setStats({ active, pending, done });
    setJobs(myJobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bgPrimary }]}>
      <View style={[styles.header, { backgroundColor: colors.bgSecondary, borderColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.primaryLight }]}>Çağlayan Lojistik</Text>
        <TouchableOpacity style={[styles.iconBtn, { backgroundColor: colors.bgInput }]} onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person-outline" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        <View style={styles.greeting}>
          <Text style={[styles.greetingText, { color: colors.textPrimary }]}>
            Merhaba, {user?.name?.split(' ')[0]} 👋
          </Text>
          <Text style={[styles.greetingMuted, { color: colors.textMuted }]}>Yük ilanlarınızı yönetin</Text>
        </View>

        <View style={styles.statsRow}>
          {[
            { num: stats.active, label: 'AKTİF İLAN' },
            { num: stats.pending, label: 'BEKLEYEN' },
            { num: stats.done, label: 'TAMAMLANAN' }
          ].map((s, i) => (
            <View key={i} style={[styles.statCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
              <Text style={[styles.statNum, { color: colors.primaryLight }]}>{s.num}</Text>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>{s.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Son İlanlarım</Text>
            <TouchableOpacity onPress={() => navigation.navigate('MyJobs')}>
              <Text style={{ color: colors.accent, fontWeight: '600', fontSize: 14 }}>Tümü</Text>
            </TouchableOpacity>
          </View>

          {jobs.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="cube-outline" size={48} color={colors.textMuted} style={{ opacity: 0.4 }} />
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>Henüz ilan oluşturmadınız</Text>
              <TouchableOpacity style={styles.emptyBtn} onPress={() => navigation.navigate('CreateJob')}>
                <Text style={styles.emptyBtnText}>İlk İlanınızı Oluşturun</Text>
              </TouchableOpacity>
            </View>
          ) : (
            jobs.map(job => (
              <JobCard key={job.id} job={job} onPress={() => navigation.navigate('JobDetail', { jobId: job.id })} />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 16, borderBottomWidth: 1 },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  iconBtn: { width: 38, height: 38, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  body: { flex: 1 },
  bodyContent: { padding: 20, paddingBottom: 100 },
  greeting: { marginBottom: 24 },
  greetingText: { fontSize: 22, fontWeight: '700' },
  greetingMuted: { fontSize: 14, marginTop: 2 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 28 },
  statCard: { flex: 1, borderWidth: 1, borderRadius: 14, padding: 16, alignItems: 'center' },
  statNum: { fontSize: 26, fontWeight: '800', lineHeight: 30 },
  statLabel: { fontSize: 10, fontWeight: '500', letterSpacing: 0.5, marginTop: 4 },
  section: {},
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700' },
  empty: { alignItems: 'center', padding: 48 },
  emptyText: { fontSize: 14, marginTop: 12, marginBottom: 20 },
  emptyBtn: { backgroundColor: '#e67e22', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  emptyBtnText: { color: '#fff', fontWeight: '600' },
});
