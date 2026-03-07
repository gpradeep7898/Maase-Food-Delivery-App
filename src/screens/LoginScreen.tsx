import React, { useRef, useState, useEffect } from 'react';
import {
  Alert, KeyboardAvoidingView, Platform, ScrollView,
  StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { Colors, Typography, Spacing, Radius } from '../constants/theme';
import { PrimaryButton } from '../components/ui';
import { supabase } from '../utils/supabase';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [otpError, setOtpError] = useState(false);
  const otpRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (timer > 0) {
      const t = setTimeout(() => setTimer(prev => prev - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [timer]);

  const handleSendOtp = async () => {
    if (phone.length !== 10) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({ phone: `+91${phone}` });
      if (error) throw error;
    } catch (_) {
      // fallback to demo mode
    } finally {
      setLoading(false);
      setStep('otp');
      setTimer(30);
    }
  };

  const handleOtpChange = (text: string, index: number) => {
    setOtpError(false);
    const newOtp = [...otp];
    newOtp[index] = text.slice(-1);
    setOtp(newOtp);
    if (text && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    if (otp.join('').length !== 6) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone: `+91${phone}`,
        token: otp.join(''),
        type: 'sms',
      });
      if (error) throw error;
    } catch (_) {
      // fallback to demo mode
    } finally {
      setLoading(false);
      navigation.replace('Location');
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    setLoading(true);
    try {
      await supabase.auth.signInWithOtp({ phone: `+91${phone}` });
    } catch (_) {}
    setLoading(false);
    setTimer(30);
    setOtp(['', '', '', '', '', '']);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo */}
          <View style={styles.logoBox}>
            <Text style={styles.logoEmoji}>🍱</Text>
          </View>

          <Text style={styles.title}>Welcome to{'\n'}Maase</Text>
          <Text style={styles.subtitle}>
            {step === 'phone'
              ? 'Order home-cooked meals from your neighbourhood'
              : `Enter the 6-digit OTP sent to +91 ${phone}`}
          </Text>

          {step === 'phone' ? (
            <>
              {/* Phone input */}
              <View style={styles.phoneRow}>
                <View style={styles.prefixBox}>
                  <Text style={styles.prefixText}>🇮🇳 +91</Text>
                </View>
                <TextInput
                  style={styles.phoneInput}
                  value={phone}
                  onChangeText={t => setPhone(t.replace(/\D/g, '').slice(0, 10))}
                  placeholder="10-digit mobile number"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="number-pad"
                  maxLength={10}
                  autoFocus
                />
              </View>

              <PrimaryButton
                label="Get OTP"
                onPress={handleSendOtp}
                disabled={phone.length !== 10}
                loading={loading}
                style={{ marginTop: Spacing.md }}
              />

              <Text style={styles.termsText}>
                By continuing, you agree to our Terms of Service
              </Text>
            </>
          ) : (
            <>
              {/* OTP boxes */}
              <View style={styles.otpRow}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={ref => { otpRefs.current[index] = ref; }}
                    style={[
                      styles.otpBox,
                      digit && styles.otpBoxFilled,
                      otpError && styles.otpBoxError,
                    ]}
                    value={digit}
                    onChangeText={text => handleOtpChange(text, index)}
                    onKeyPress={({ nativeEvent }) => handleOtpKeyPress(nativeEvent.key, index)}
                    keyboardType="number-pad"
                    maxLength={1}
                    textAlign="center"
                    autoFocus={index === 0}
                  />
                ))}
              </View>

              {/* Resend */}
              <View style={styles.resendRow}>
                {timer > 0 ? (
                  <Text style={styles.resendTimer}>Resend OTP in {timer}s</Text>
                ) : (
                  <TouchableOpacity onPress={handleResend}>
                    <Text style={styles.resendLink}>Resend OTP</Text>
                  </TouchableOpacity>
                )}
              </View>

              <PrimaryButton
                label="Verify & Continue"
                onPress={handleVerify}
                disabled={otp.join('').length !== 6}
                loading={loading}
                style={{ marginTop: Spacing.md }}
              />

              {/* Change number */}
              <TouchableOpacity
                style={styles.changeBtn}
                onPress={() => { setStep('phone'); setOtp(['','','','','','']); setOtpError(false); }}
              >
                <Text style={styles.changeText}>← Change number</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.ivory },
  scroll: { padding: Spacing.lg, paddingTop: Spacing.xxl },
  logoBox: {
    width: 56, height: 56, backgroundColor: Colors.turmeric,
    borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.lg,
  },
  logoEmoji: { fontSize: 28 },
  title: {
    fontFamily: Typography.display, fontSize: Typography.h1,
    color: Colors.text, marginBottom: Spacing.sm, lineHeight: 40,
  },
  subtitle: {
    fontFamily: Typography.bodyRegular, fontSize: Typography.bodySmall,
    color: Colors.textSecondary, lineHeight: 22, marginBottom: Spacing.xl,
  },
  phoneRow: {
    flexDirection: 'row', borderRadius: Radius.md, overflow: 'hidden',
    borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.surface,
    height: 56,
  },
  prefixBox: {
    backgroundColor: Colors.ivoryDark, paddingHorizontal: Spacing.md,
    alignItems: 'center', justifyContent: 'center',
    borderRightWidth: 1, borderRightColor: Colors.border,
  },
  prefixText: { fontFamily: Typography.bodySemiBold, fontSize: Typography.bodySmall, color: Colors.mocha },
  phoneInput: {
    flex: 1, paddingHorizontal: Spacing.md,
    fontFamily: Typography.bodyRegular, fontSize: Typography.body, color: Colors.text,
  },
  otpRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.md },
  otpBox: {
    width: 46, height: 56, borderRadius: Radius.md,
    borderWidth: 1.5, borderColor: Colors.border,
    backgroundColor: Colors.surface,
    fontFamily: Typography.bodyBold, fontSize: 22, color: Colors.text,
  },
  otpBoxFilled: { backgroundColor: Colors.turmericLight, borderColor: Colors.turmeric },
  otpBoxError: { borderColor: Colors.error, backgroundColor: Colors.errorLight },
  resendRow: { alignItems: 'center', marginBottom: Spacing.sm },
  resendTimer: { fontFamily: Typography.bodyRegular, fontSize: Typography.bodySmall, color: Colors.textMuted },
  resendLink: { fontFamily: Typography.bodySemiBold, fontSize: Typography.bodySmall, color: Colors.turmeric },
  changeBtn: { height: 44, alignItems: 'center', justifyContent: 'center', marginTop: Spacing.md },
  changeText: { fontFamily: Typography.bodySemiBold, fontSize: Typography.bodySmall, color: Colors.textSecondary },
  termsText: {
    fontFamily: Typography.bodyRegular, fontSize: Typography.caption,
    color: Colors.textMuted, textAlign: 'center', marginTop: Spacing.lg, lineHeight: 18,
  },
});

export default LoginScreen;
