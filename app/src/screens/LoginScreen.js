import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../utils/theme';
import { useAuth } from '../utils/auth';

export default function LoginScreen({ navigation, route }) {
  const role = route.params?.role || 'shipper';
  const { colors } = useTheme();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const isShipper = role === 'shipper';

  const handleLogin = async () => {
    setError('');
    try {
      await login(email.trim(), password, role);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: colors.bgPrimary }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={[styles.backBtn, { backgroundColor: colors.bgInput }]} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={[styles.logo, { color: colors.primaryLight }]}>ÇAĞLAYAN LOJİSTİK</Text>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            {isShipper ? 'Yük Sahibi Girişi' : 'Nakliyeci Girişi'}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            {isShipper ? 'Yük ilanlarınızı yönetin' : 'Yük ilanlarını inceleyin ve teklif verin'}
          </Text>
        </View>

        {error ? <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View> : null}

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>E-posta</Text>
            <View style={[styles.inputWrapper, { backgroundColor: colors.bgInput, borderColor: colors.border }]}>
              <Ionicons name="mail-outline" size={18} color={colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.textPrimary }]}
                placeholder="ornek@email.com"
                placeholderTextColor={colors.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Şifre</Text>
            <View style={[styles.inputWrapper, { backgroundColor: colors.bgInput, borderColor: colors.border }]}>
              <Ionicons name="lock-closed-outline" size={18} color={colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.textPrimary }]}
                placeholder="Şifreniz"
                placeholderTextColor={colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
          </View>

          <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
            <Text style={styles.loginBtnText}>Giriş Yap</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textMuted }]}>Hesabınız yok mu? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register', { role })}>
            <Text style={styles.footerLink}>Kayıt Olun</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.demoBox}>
          <Text style={[styles.demoTitle, { color: colors.textMuted }]}>Demo Hesap:</Text>
          <Text style={[styles.demoText, { color: colors.textSecondary }]}>
            {isShipper ? 'ahmet@demo.com' : 'mehmet@demo.com'} / 123456
          </Text>
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
  logo: { fontSize: 13, fontWeight: '700', letterSpacing: 2, marginBottom: 16 },
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
  loginBtn: { backgroundColor: '#e67e22', paddingVertical: 14, borderRadius: 14, alignItems: 'center', marginTop: 8 },
  loginBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { fontSize: 14 },
  footerLink: { color: '#e67e22', fontSize: 14, fontWeight: '600' },
  demoBox: { marginTop: 32, alignItems: 'center', padding: 16, borderRadius: 12, backgroundColor: 'rgba(41,128,185,0.08)' },
  demoTitle: { fontSize: 12, fontWeight: '600', marginBottom: 4 },
  demoText: { fontSize: 14, fontWeight: '500' },
});
