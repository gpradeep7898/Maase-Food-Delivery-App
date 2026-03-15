import React, { useRef, useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, StatusBar,
  TouchableWithoutFeedback, Keyboard, ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';
import { Colors, Typography, Spacing, Radius, Shadows } from '../lib/theme';

const { width } = Dimensions.get('window');

export default function LoginScreen({ navigation }: { navigation: any }) {
  const { sendOTP, verifyOTP, profile } = useAuth();
  const [stage, setStage] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);

  const otpRefs = useRef<(TextInput | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  async function handleSendOTP() {
    const clean = phone.replace(/\D/g, '');
    if (clean.length !== 10) {
      setError('Enter a valid 10-digit Indian mobile number');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await sendOTP(clean);
      setStage('otp');
      setCountdown(30);
    } catch (e: any) {
      setError(e.message ?? 'Failed to send OTP. Try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOTP() {
    const code = otp.join('');
    if (code.length !== 6) {
      setError('Enter the complete 6-digit OTP');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await verifyOTP(phone, code);
      // Navigation handled by AppNavigator watching session
    } catch (e: any) {
      const msg = e.message ?? 'Invalid OTP';
      setError(msg.includes('Token has expired') ? 'OTP expired. Resend and try again.' : msg);
    } finally {
      setLoading(false);
    }
  }

  function handleOtpChange(text: string, index: number) {
    const digit = text.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setError('');
    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
    if (digit === '' && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }

  function handleOtpKeyPress(e: any, index: number) {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.ivory} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Illustration */}
            <View style={styles.illustrationWrap}>
              <View style={styles.illustrationCircle}>
                <Text style={styles.illustrationEmoji}>🍲</Text>
              </View>
            </View>

            {stage === 'phone' ? (
              <>
                <Text style={styles.heading}>Welcome home</Text>
                <Text style={styles.subheading}>
                  Sign in to discover meals from your neighbourhood
                </Text>

                {/* Phone input */}
                <View style={styles.phoneRow}>
                  <View style={styles.prefix}>
                    <Text style={styles.prefixText}>+91</Text>
                  </View>
                  <TextInput
                    style={styles.phoneInput}
                    value={phone}
                    onChangeText={t => { setPhone(t.replace(/\D/g, '')); setError(''); }}
                    placeholder="Enter mobile number"
                    placeholderTextColor={Colors.textMuted}
                    keyboardType="number-pad"
                    maxLength={10}
                    autoFocus
                  />
                </View>

                {!!error && <Text style={styles.errorText}>{error}</Text>}

                <TouchableOpacity
                  onPress={handleSendOTP}
                  disabled={loading}
                  style={[styles.btn, loading && styles.btnDisabled]}
                  activeOpacity={0.85}
                >
                  {loading
                    ? <ActivityIndicator color={Colors.mocha} />
                    : <Text style={styles.btnText}>Get OTP</Text>
                  }
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.heading}>Enter the code</Text>
                <Text style={styles.subheading}>
                  We sent a 6-digit OTP to +91 {phone}
                </Text>

                {/* OTP boxes */}
                <View style={styles.otpRow}>
                  {otp.map((digit, i) => (
                    <TextInput
                      key={i}
                      ref={ref => { otpRefs.current[i] = ref; }}
                      style={[styles.otpBox, digit ? styles.otpBoxFilled : null]}
                      value={digit}
                      onChangeText={t => handleOtpChange(t, i)}
                      onKeyPress={e => handleOtpKeyPress(e, i)}
                      keyboardType="number-pad"
                      maxLength={1}
                      selectTextOnFocus
                      textAlign="center"
                      autoFocus={i === 0}
                    />
                  ))}
                </View>

                {!!error && <Text style={styles.errorText}>{error}</Text>}

                <TouchableOpacity
                  onPress={handleVerifyOTP}
                  disabled={loading}
                  style={[styles.btn, loading && styles.btnDisabled]}
                  activeOpacity={0.85}
                >
                  {loading
                    ? <ActivityIndicator color={Colors.mocha} />
                    : <Text style={styles.btnText}>Verify OTP</Text>
                  }
                </TouchableOpacity>

                {/* Resend */}
                <View style={styles.resendRow}>
                  {countdown > 0 ? (
                    <Text style={styles.resendTimer}>Resend in {countdown}s</Text>
                  ) : (
                    <TouchableOpacity onPress={() => { setOtp(['','','','','','']); handleSendOTP(); }}>
                      <Text style={styles.resendLink}>Resend OTP</Text>
                    </TouchableOpacity>
                  )}
                </View>

                <TouchableOpacity onPress={() => { setStage('phone'); setOtp(['','','','','','']); setError(''); }}>
                  <Text style={styles.changePhone}>← Change number</Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.ivory },
  scroll: { flexGrow: 1, paddingHorizontal: Spacing.xl, paddingTop: Spacing.xl, paddingBottom: Spacing.xxl },
  illustrationWrap: { alignItems: 'center', marginBottom: Spacing.xl },
  illustrationCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: Colors.turmericLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationEmoji: { fontSize: 52 },
  heading: {
    fontFamily: Typography.heading,
    fontSize: 32,
    color: Colors.mocha,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subheading: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    overflow: 'hidden',
    marginBottom: Spacing.md,
    ...(Shadows.card as object),
  },
  prefix: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.ivory,
    borderRightWidth: 1,
    borderRightColor: Colors.border,
  },
  prefixText: { fontFamily: Typography.semiBold, fontSize: 16, color: Colors.textSecondary },
  phoneInput: {
    flex: 1,
    fontFamily: Typography.body,
    fontSize: 16,
    color: Colors.text,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
  },
  btn: {
    backgroundColor: Colors.turmeric,
    borderRadius: Radius.md,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.sm,
    ...(Shadows.button as object),
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { fontFamily: Typography.bold, fontSize: 16, color: Colors.mocha },
  errorText: {
    fontFamily: Typography.body,
    fontSize: 13,
    color: Colors.error,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  otpBox: {
    width: 46,
    height: 56,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    fontFamily: Typography.bold,
    fontSize: 22,
    color: Colors.mocha,
    textAlign: 'center',
  },
  otpBoxFilled: { borderColor: Colors.turmeric, backgroundColor: Colors.turmericLight },
  resendRow: { alignItems: 'center', marginTop: Spacing.lg },
  resendTimer: { fontFamily: Typography.body, fontSize: 13, color: Colors.textMuted },
  resendLink: { fontFamily: Typography.semiBold, fontSize: 13, color: Colors.turmericDeep },
  changePhone: {
    fontFamily: Typography.medium,
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
});
