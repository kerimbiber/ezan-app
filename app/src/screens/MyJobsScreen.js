import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../utils/theme';
import { useAuth } from '../utils/auth';
import DB from '../utils/db';
import JobCard from '../components/JobCard';

const TABS = [
  { key: 'active', label: 'Aktif' },
  { key: 'pending', label: 'Teklifli' },
  { key: 'done', label: 'Tamamlanan' },
];

export default function MyJobsScreen({ navigation }) {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [tab, setTab] = useState('active');
  const [jobs, setJobs] = useState([]);

  useFocusEffect(useCallback(() => { loadJobs(tab); }, [tab]));

  const loadJobs = async (filter) => {
    if (!user) return;
    const allJobs = await DB.getJobs();
    const myJobs = allJobs.filter(j => j.shipperId === user.id);

    if (filter === 'active') {
      setJobs(myJobs.filter(j => j.status === 'active'));
    } else if (filter === 'pending') {
      const offers = await DB.getOffers();
      setJobs(myJobs.filter(j => offers.some(o => o.jobId === j.id && o.status === 'pending')));
    } else {
      setJobs(myJobs.filter(j => j.status === 'done'));
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bgPrimary }]}>
      <View style={[styles.header, { backgroundColor: colors.bgSecondary, borderColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>İlanlarım</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.body}>
        <View style={[styles.tabBar, { backgroundColor: colors.bgInput }]}>
          {TABS.map(t => (
            <TouchableOpacity key={t.key} style={[styles.tab, tab === t.key && { backgroundColor: colors.bgSecondary, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }]} onPress={() => setTab(t.key)}>
              <Text style={[styles.tabText, { color: tab === t.key ? colors.primaryLight : colors.textMuted }]}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView contentContainerStyle={styles.list}>
          {jobs.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="document-text-outline" size={48} color={colors.textMuted} style={{ opacity: 0.4 }} />
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>Bu kategoride ilan bulunmuyor</Text>
            </View>
          ) : (
            jobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(job => (
              <JobCard key={job.id} job={job} onPress={() => navigation.navigate('JobDetail', { jobId: job.id })} />
            ))
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 16, borderBottomWidth: 1 },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  body: { flex: 1, padding: 20 },
  tabBar: { flexDirection: 'row', borderRadius: 12, padding: 4, gap: 4, marginBottom: 20 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  tabText: { fontSize: 14, fontWeight: '600' },
  list: { paddingBottom: 100 },
  empty: { alignItems: 'center', padding: 48 },
  emptyText: { fontSize: 14, marginTop: 12 },
});
