import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../utils/theme';
import { useAuth } from '../utils/auth';
import { CITIES, CARGO_TYPE_LABELS, VEHICLE_LABELS } from '../utils/constants';
import DB from '../utils/db';

export default function CreateJobScreen({ navigation }) {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [cargoType, setCargoType] = useState('genel');
  const [weight, setWeight] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [vehiclePref, setVehiclePref] = useState('farketmez');
  const [price, setPrice] = useState('');
  const [desc, setDesc] = useState('');
  const [error, setError] = useState('');
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [citySearch, setCitySearch] = useState('');

  const handleCreate = async () => {
    setError('');
    if (!from || !to || !weight || !price || !date) {
      setError('Lütfen zorunlu alanları doldurun.');
      return;
    }
    if (from === to) {
      setError('Yükleme ve teslimat şehri aynı olamaz.');
      return;
    }
    const job = {
      id: 'j' + Date.now(),
      shipperId: user.id,
      cargoType, weight: parseFloat(weight),
      from, to, date, deliveryDate,
      vehiclePref, price: parseInt(price),
      desc: desc.trim(),
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    await DB.saveJob(job);
    Alert.alert('Başarılı', 'İlan yayınlandı!');
    navigation.goBack();
  };

  const CityPicker = ({ visible, onSelect, onClose }) => {
    if (!visible) return null;
    const filtered = CITIES.filter(c => c.toLowerCase().includes(citySearch.toLowerCase()));
    return (
      <View style={[styles.cityModal, { backgroundColor: colors.bgSecondary }]}>
        <View style={styles.cityModalHeader}>
          <Text style={[styles.cityModalTitle, { color: colors.textPrimary }]}>Şehir Seçin</Text>
          <TouchableOpacity onPress={() => { onClose(); setCitySearch(''); }}>
            <Ionicons name="close" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
        <View style={[styles.searchBar, { backgroundColor: colors.bgInput, borderColor: colors.border }]}>
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <TextInput style={[styles.searchInput, { color: colors.textPrimary }]} placeholder="Ara..." placeholderTextColor={colors.textMuted} value={citySearch} onChangeText={setCitySearch} />
        </View>
        <ScrollView style={styles.cityList}>
          {filtered.map(city => (
            <TouchableOpacity key={city} style={[styles.cityItem, { borderColor: colors.border }]} onPress={() => { onSelect(city); onClose(); setCitySearch(''); }}>
              <Text style={[styles.cityItemText, { color: colors.textPrimary }]}>{city}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const SelectButton = ({ label, value, placeholder, onPress }) => (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      <TouchableOpacity style={[styles.selectBtn, { backgroundColor: colors.bgInput, borderColor: colors.border }]} onPress={onPress}>
        <Text style={{ color: value ? colors.textPrimary : colors.textMuted, fontSize: 15 }}>{value || placeholder}</Text>
        <Ionicons name="chevron-down" size={18} color={colors.textMuted} />
      </TouchableOpacity>
    </View>
  );

  const InputField = ({ label, icon, value, onChangeText, placeholder, keyboardType, multiline }) => (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      <View style={[styles.inputWrapper, { backgroundColor: colors.bgInput, borderColor: colors.border }, multiline && { alignItems: 'flex-start' }]}>
        <Ionicons name={icon} size={18} color={colors.textMuted} style={[styles.inputIcon, multiline && { marginTop: 14 }]} />
        <TextInput
          style={[styles.input, { color: colors.textPrimary }, multiline && { minHeight: 80, textAlignVertical: 'top' }]}
          placeholder={placeholder} placeholderTextColor={colors.textMuted}
          value={value} onChangeText={onChangeText}
          keyboardType={keyboardType} multiline={multiline}
        />
      </View>
    </View>
  );

  const CargoTypeSelector = () => (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>Yük Tipi</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
        {Object.entries(CARGO_TYPE_LABELS).map(([key, label]) => (
          <TouchableOpacity key={key} style={[styles.chip, { borderColor: colors.border, backgroundColor: cargoType === key ? colors.primaryLight : colors.bgInput }]} onPress={() => setCargoType(key)}>
            <Text style={{ color: cargoType === key ? '#fff' : colors.textSecondary, fontSize: 13, fontWeight: '500' }}>{label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const VehicleSelector = () => (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>Araç Tercihi</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
        {Object.entries(VEHICLE_LABELS).map(([key, label]) => (
          <TouchableOpacity key={key} style={[styles.chip, { borderColor: colors.border, backgroundColor: vehiclePref === key ? colors.primaryLight : colors.bgInput }]} onPress={() => setVehiclePref(key)}>
            <Text style={{ color: vehiclePref === key ? '#fff' : colors.textSecondary, fontSize: 13, fontWeight: '500' }}>{label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  if (showFromPicker || showToPicker) {
    return (
      <View style={[styles.container, { backgroundColor: colors.bgPrimary }]}>
        <CityPicker
          visible={true}
          onSelect={showFromPicker ? setFrom : setTo}
          onClose={() => { setShowFromPicker(false); setShowToPicker(false); }}
        />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: colors.bgPrimary }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.header, { backgroundColor: colors.bgSecondary, borderColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Yeni İlan</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
        {error ? <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View> : null}

        <CargoTypeSelector />
        <InputField label="Ağırlık (ton)" icon="scale-outline" value={weight} onChangeText={setWeight} placeholder="Ör: 18" keyboardType="numeric" />

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <SelectButton label="Yükleme Yeri" value={from} placeholder="Şehir seçin" onPress={() => setShowFromPicker(true)} />
          </View>
          <View style={{ flex: 1 }}>
            <SelectButton label="Teslimat Yeri" value={to} placeholder="Şehir seçin" onPress={() => setShowToPicker(true)} />
          </View>
        </View>

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <InputField label="Yükleme Tarihi" icon="calendar-outline" value={date} onChangeText={setDate} placeholder="2026-03-25" />
          </View>
          <View style={{ flex: 1 }}>
            <InputField label="Teslimat Tarihi" icon="calendar-outline" value={deliveryDate} onChangeText={setDeliveryDate} placeholder="2026-03-26" />
          </View>
        </View>

        <VehicleSelector />
        <InputField label="Ücret (₺)" icon="cash-outline" value={price} onChangeText={setPrice} placeholder="Ör: 32000" keyboardType="numeric" />
        <InputField label="Açıklama" icon="document-text-outline" value={desc} onChangeText={setDesc} placeholder="Yük hakkında detaylar..." multiline />

        <TouchableOpacity style={styles.createBtn} onPress={handleCreate}>
          <Text style={styles.createBtnText}>İlanı Yayınla</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 16, borderBottomWidth: 1 },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  form: { padding: 20, paddingBottom: 40, gap: 16 },
  inputGroup: { gap: 6 },
  label: { fontSize: 14, fontWeight: '600' },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, paddingVertical: 13 },
  selectBtn: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13 },
  row: { flexDirection: 'row', gap: 12 },
  chipScroll: { marginTop: 4 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, marginRight: 8 },
  errorBox: { backgroundColor: 'rgba(192,57,43,0.1)', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(192,57,43,0.2)' },
  errorText: { color: '#e74c3c', fontSize: 14 },
  createBtn: { backgroundColor: '#e67e22', paddingVertical: 16, borderRadius: 14, alignItems: 'center', marginTop: 8 },
  createBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  cityModal: { flex: 1, paddingTop: 50 },
  cityModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 16 },
  cityModalTitle: { fontSize: 20, fontWeight: '700' },
  searchBar: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1, marginBottom: 12 },
  searchInput: { flex: 1, fontSize: 15, paddingVertical: 12, marginLeft: 10 },
  cityList: { flex: 1 },
  cityItem: { paddingVertical: 14, paddingHorizontal: 20, borderBottomWidth: 1 },
  cityItemText: { fontSize: 16 },
});
