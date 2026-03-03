import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { Colors, Typography, Radius, Spacing } from '../constants/theme';
import { PrimaryButton, SecondaryButton } from '../components/ui';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const otpRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (step !== 'otp') return;
    const interval = setInterval(() => setTimer(t => t > 0 ? t - 1 : 0), 1000);
    return () => clearInterval(interval);
  }, [step]);

  const handleSendOtp = async () => {
    setLoading(true);
    // TODO: Call Supabase auth.signInWithOtp({ phone: `+91${phone}` })
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
      setTimer(30);
    }, 1000);
  };

  const handleOtpChange = (val: string, idx: number) => {
    const next = [...otp];
    next[idx] = val.replace(/\D/, '').slice(-1);
    setOtp(next);
    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
    if (!val && idx > 0) otpRefs.current[idx - 1]?.focus();
  };

  const handleVerify = async () => {
    setLoading(true);
    // TODO: Call Supabase auth.verifyOtp({ phone, token: otp.join(''), type: 'sms' })
    setTimeout(() => {
      setLoading(false);
      navigation.replace('Location');
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.logoRow}>
            <View style={styles.logoBox}>
              <Text style={styles.logoEmoji}>🍱</Text>
            </View>
          </View>

          <Text style={styles.title}>
            {step === 'phone' ? 'Welcome to\nMaase' : 'Enter OTP'}
          </Text>
          <Text style={styles.subtitle}>
            {step === 'phone'
              ? 'Home-cooked meals from nearby moms, delivered fresh.'
              : `We sent a 6-digit code to +91 ${phone}`}
          </Text>

          {step === 'phone' ? (
            <>
              <View style={styles.phoneRow}>
                <View style={styles.countryCode}>
                  <Text style={styles.countryText}>🇮🇳 +91</Text>
                </View>
                <TextInput
                  style={styles.phoneInput}
                  value={phone}
                  onChangeText={v => setPhone(v.replace(/\D/, '').slice(0, 10))}
                  placeholder="Enter mobile number"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="number-pad"
                  maxLength={10}
                  returnKeyType="done"
                />
              </View>
              <PrimaryButton
                label={loading ? 'Sending OTP...' : 'Get OTP'}
                onPress={handleSendOtp}
                disabled={phone.length < 10}
                loading={loading}
                style={styles.btn}
              />
            </>
          ) : (
            <>
              <View style={styles.otpRow}>
                {otp.map((digit, i) => (
                  <TextInput
                    key={i}
                    ref={ref => { otpRefs.current[i] = ref; }}
                    style={[styles.otpBox, digit ? styles.otpBoxFilled : null]}
                    value={digit}
                    onChangeText={v => handleOtpChange(v, i)}
                    keyboardType="number-pad"
                    maxLength={1}
                    selectTextOnFocus
                  />
                ))}
              </View>

              <Text style={styles.resendText}>
                {timer > 0
                  ? `Resend OTP in ${timer}s`
                  : (
                    <Text
                      style={styles.resendLink}
                      onPress={() => { setTimer(30); /* TODO: resend OTP */ }}
                    >
                      Resend OTP
                    </Text>
                  )
                }
              </Text>

              <PrimaryButton
                label={loading ? 'Verifying...' : 'Verify & Continue'}
                onPress={handleVerify}
                disabled={otp.some(d => !d)}
                loading={loading}
                style={styles.btn}
              />
              <TouchableOpacity onPress={() => setStep('phone')} style={styles.backBtn}>
                <Text style={styles.backText}>← Change number</Text>
              </TouchableOpacity>
            </>
          )}

          <Text style={styles.terms}>
            By continuing you agree to our Terms of Service & Privacy Policy
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.ivory },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, padding: Spacing.lg, paddingTop: Spacing.xl },
  logoRow: { marginBottom: Spacing.lg },
  logoBox: {
    width: 56, height: 56, backgroundColor: Colors.turmeric,
    borderRadius: 16, alignItems: 'center', justifyContent: 'center',
  },
  logoEmoji: { fontSize: 28 },
  title: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: Typography.h1, color: Colors.text,
    lineHeight: 40, marginBottom: Spacing.sm,
  },
  subtitle: {
    fontFamily: 'Poppins_400Regular', fontSize: Typography.bodySmall,
    color: Colors.textSecondary, lineHeight: 22, marginBottom: Spacing.xl,
  },
  phoneRow: {
    flexDirection: 'row', borderWidth: 1.5, borderColor: Colors.border,
    borderRadius: Radius.md, overflow: 'hidden', backgroundColor: Colors.surface,
    marginBottom: Spacing.md,
  },
  countryCode: {
    paddingHorizontal: Spacing.md, borderRightWidth: 1.5,
    borderRightColor: Colors.border, justifyContent: 'center',
    height: 52,
  },
  countryText: {
    fontFamily: 'Poppins_600SemiBold', fontSize: Typography.body, color: Colors.text,
  },
  phoneInput: {
    flex: 1, height: 52, paddingHorizontal: Spacing.md,
    fontFamily: 'Poppins_400Regular', fontSize: Typography.body, color: Colors.text,
  },
  btn: { marginBottom: Spacing.md },
  otpRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  otpBox: {
    width: 46, height: 56, borderWidth: 2, borderColor: Colors.border,
    borderRadius: Radius.md, textAlign: 'center',
    fontFamily: 'Poppins_700Bold', fontSize: 22, color: Colors.text,
    backgroundColor: Colors.surface,
  },
  otpBoxFilled: {
    borderColor: Colors.turmeric, backgroundColor: Colors.turmericLight,
  },
  resendText: {
    fontFamily: 'Poppins_400Regular', fontSize: Typography.bodySmall,
    color: Colors.textMuted, textAlign: 'center', marginBottom: Spacing.md,
  },
  resendLink: {
    fontFamily: 'Poppins_700Bold', color: Colors.turmeric,
  },
  backBtn: { alignItems: 'center', marginTop: Spacing.sm },
  backText: {
    fontFamily: 'Poppins_400Regular', fontSize: Typography.bodySmall, color: Colors.textSecondary,
  },
  terms: {
    fontFamily: 'Poppins_400Regular', fontSize: 11, color: Colors.textMuted,
    textAlign: 'center', marginTop: 'auto', paddingTop: Spacing.xl, lineHeight: 18,
  },
});

export default LoginScreen;
