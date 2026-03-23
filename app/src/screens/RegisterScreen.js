import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '../utils/theme';
import { useAuth } from '../utils/auth';

export default function RegisterScreen({ navigation, route }) {
  const role = route.params?.role || 'shipper';
  const { colors } = useTheme();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [password, setPassword] = useState('');
  const [plate, setPlate] = useState('');
  const [vehicle, setVehicle] = useState('tir');
  const [error, setError] = useState('');

  const isCarrier = role === 'carrier';

  const handleRegister = async () => {
    setError('');
    if (!name || !email || !password) {
      setError('Lütfen zorunlu alanları doldurun.');
      return;
    }
    try {
      const data = { name, email: email.trim(), phone, company, password, role };
      if (isCarrier) {
        data.plate = plate;
        data.vehicle = vehicle;
      }
      await register(data);
    } catch (e) {
      setError(e.message);
    }
  };

  const InputField = ({ icon, label, value, onChangeText, placeholder, ...props }) => (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      <View style={[styles.inputWrapper, { backgroundColor: colors.bgInput, borderColor: colors.border }]}>
        <Ionicons name={icon} size={18} color={colors.textMuted} style={styles.inputIcon} />
        <TextInput
          style={[styles.input, { color: colors.textPrimary }]}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          value={value}
          onChangeText={onChangeText}
          {...props}
        />
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: colors.bgPrimary }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={[styles.backBtn, { backgroundColor: colors.bgInput }]} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Kayıt Ol</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            {isCarrier ? 'Nakliyeci hesabı oluşturun' : 'Yük Sahibi hesabı oluşturun'}
          </Text>
        </View>

        {error ? <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View> : null}

        <View style={styles.form}>
          <InputField icon="person-outline" label="Ad Soyad" value={name} onChangeText={setName} placeholder="Ad Soyad" />
          <InputField icon="mail-outline" label="E-posta" value={email} onChangeText={setEmail} placeholder="ornek@email.com" keyboardType="email-address" autoCapitalize="none" />
          <InputField icon="call-outline" label="Telefon" value={phone} onChangeText={setPhone} placeholder="0532 111 22 33" keyboardType="phone-pad" />
          <InputField icon="business-outline" label="Firma Adı" value={company} onChangeText={setCompany} placeholder="Firma adı" />
          <InputField icon="lock-closed-outline" label="Şifre" value={password} onChangeText={setPassword} placeholder="En az 6 karakter" secureTextEntry />

          {isCarrier && (
            <>
              <InputField icon="car-outline" label="Plaka" value={plate} onChangeText={setPlate} placeholder="34 ABC 123" />
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Araç Tipi</Text>
                <View style={[styles.pickerWrapper, { backgroundColor: colors.bgInput, borderColor: colors.border }]}>
                  <Picker selectedValue={vehicle} onValueChange={setVehicle} style={{ color: colors.textPrimary }}>
                    <Picker.Item label="TIR (Uzun Yol)" value="tir" />
                    <Picker.Item label="Kamyon" value="kamyon" />
                    <Picker.Item label="Kamyonet" value="kamyonet" />
                    <Picker.Item label="Frigorifik" value="frigorifik" />
                    <Picker.Item label="Tanker" value="tanker" />
                    <Picker.Item label="Lowbed" value="lowbed" />
                  </Picker>
                </View>
              </View>
            </>
          )}

          <TouchableOpacity style={styles.registerBtn} onPress={handleRegister}>
            <Text style={styles.registerBtnText}>Kayıt Ol</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textMuted }]}>Zaten hesabınız var mı? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login', { role })}>
            <Text style={styles.footerLink}>Giriş Yapın</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 24, paddingTop: 50 },
  backBtn: { width: 42, height: 42, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  header: { alignItems: 'center', marginBottom: 32 },
  title: { fontSize: 26, fontWeight: '700', marginBottom: 4 },
  subtitle: { fontSize: 14 },
  errorBox: { backgroundColor: 'rgba(192,57,43,0.1)', padding: 12, borderRadius: 10, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(192,57,43,0.2)' },
  errorText: { color: '#e74c3c', fontSize: 14 },
  form: { gap: 16 },
  inputGroup: { gap: 6 },
  label: { fontSize: 14, fontWeight: '600' },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, paddingVertical: 13 },
  pickerWrapper: { borderWidth: 1.5, borderRadius: 12, overflow: 'hidden' },
  registerBtn: { backgroundColor: '#e67e22', paddingVertical: 14, borderRadius: 14, alignItems: 'center', marginTop: 8 },
  registerBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24, paddingBottom: 32 },
  footerText: { fontSize: 14 },
  footerLink: { color: '#e67e22', fontSize: 14, fontWeight: '600' },
});
