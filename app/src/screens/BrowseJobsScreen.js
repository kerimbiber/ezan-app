import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../utils/theme';
import { useAuth } from '../utils/auth';
import { CARGO_TYPE_LABELS } from '../utils/constants';
import DB from '../utils/db';
import JobCard from '../components/JobCard';

export default function BrowseJobsScreen({ navigation }) {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [offeredJobIds, setOfferedJobIds] = useState([]);
  const [search, setSearch] = useState('');

  useFocusEffect(useCallback(() => { loadJobs(); }, []));

  const loadJobs = async () => {
    const allJobs = (await DB.getJobs()).filter(j => j.status === 'active');
    setJobs(allJobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    if (user) {
      const offers = await DB.getOffersByCarrier(user.id);
      setOfferedJobIds(offers.map(o => o.jobId));
    }
  };

  const filtered = search.trim()
    ? jobs.filter(j =>
        j.from.toLowerCase().includes(search.toLowerCase()) ||
        j.to.toLowerCase().includes(search.toLowerCase()) ||
        (CARGO_TYPE_LABELS[j.cargoType] || '').toLowerCase().includes(search.toLowerCase())
      )
    : jobs;

  return (
    <View style={[styles.container, { backgroundColor: colors.bgPrimary }]}>
      <View style={[styles.header, { backgroundColor: colors.bgSecondary, borderColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>İlanları Keşfet</Text>
      </View>

      <View style={styles.body}>
        <View style={[styles.searchBar, { backgroundColor: colors.bgInput, borderColor: colors.border }]}>
          <Ionicons name="search" size={20} color={colors.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: colors.textPrimary }]}
            placeholder="Şehir veya yük tipi ara..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <ScrollView contentContainerStyle={styles.list}>
          {filtered.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="search-outline" size={48} color={colors.textMuted} style={{ opacity: 0.4 }} />
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                {search ? `"${search}" için sonuç bulunamadı` : 'Aktif ilan bulunmuyor'}
              </Text>
            </View>
          ) : (
            filtered.map(job => (
              <JobCard
                key={job.id}
                job={job}
                hasOffer={offeredJobIds.includes(job.id)}
                onPress={() => navigation.navigate('JobDetail', { jobId: job.id })}
              />
            ))
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 50, paddingBottom: 16, borderBottomWidth: 1 },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  body: { flex: 1, padding: 20 },
  searchBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, borderRadius: 14, borderWidth: 1.5, marginBottom: 20 },
  searchInput: { flex: 1, fontSize: 15, paddingVertical: 12, marginLeft: 10 },
  list: { paddingBottom: 100 },
  empty: { alignItems: 'center', padding: 48 },
  emptyText: { fontSize: 14, marginTop: 12 },
});
