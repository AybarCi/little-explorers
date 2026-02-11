import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Send, KeyRound, ShieldCheck, Eye, EyeOff } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import Constants from 'expo-constants';

const SUPABASE_URL =
  (Constants.expoConfig?.extra as any)?.supabaseUrl ||
  process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY =
  (Constants.expoConfig?.extra as any)?.supabaseAnonKey ||
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

type Step = 'email' | 'otp' | 'newPassword' | 'success';

export default function ForgotPasswordScreen() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // OTP input refs
  const otpRefs = useRef<(TextInput | null)[]>([]);

  // Step 1: Send OTP code
  const handleSendCode = async () => {
    if (!email) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/reset-password-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json() as { success?: boolean; error?: string };

      if (!response.ok) {
        setError(data.error || 'Bir hata oluştu');
        return;
      }

      setStep('otp');
    } catch (err) {
      setError('Bağlantı hatası. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  // OTP input handler
  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) {
      // Handle paste - distribute digits across fields
      const digits = value.replace(/\D/g, '').slice(0, 8);
      const newOtp = [...otpCode];
      for (let i = 0; i < digits.length; i++) {
        if (index + i < 8) {
          newOtp[index + i] = digits[i];
        }
      }
      setOtpCode(newOtp);
      // Focus the next empty field or last field
      const nextIndex = Math.min(index + digits.length, 7);
      otpRefs.current[nextIndex]?.focus();
      return;
    }

    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);

    // Auto-focus next input
    if (value && index < 7) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otpCode[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
      const newOtp = [...otpCode];
      newOtp[index - 1] = '';
      setOtpCode(newOtp);
    }
  };

  // Step 2: Verify OTP and go to password step
  const handleVerifyCode = () => {
    const code = otpCode.join('');
    if (code.length !== 8) {
      setError('Lütfen 8 haneli kodu eksiksiz girin');
      return;
    }
    setError(null);
    setStep('newPassword');
  };

  // Step 3: Set new password
  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setError('Tüm alanları doldurun');
      return;
    }

    if (newPassword.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/reset-password-verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          email,
          otp_code: otpCode.join(''),
          new_password: newPassword,
        }),
      });

      const data = await response.json() as { success?: boolean; error?: string };

      if (!response.ok || !data.success) {
        setError(data.error || 'Şifre sıfırlanamadı');
        return;
      }

      setStep('success');
    } catch (err) {
      setError('Bağlantı hatası. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  // Resend code
  const handleResendCode = async () => {
    setLoading(true);
    setError(null);
    try {
      await fetch(`${SUPABASE_URL}/functions/v1/reset-password-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ email }),
      });
      Alert.alert('Başarılı', 'Yeni kod gönderildi!');
    } catch {
      setError('Kod gönderilemedi');
    } finally {
      setLoading(false);
    }
  };

  // ==================== SUCCESS SCREEN ====================
  if (step === 'success') {
    return (
      <View style={styles.container}>
        <View style={styles.successContainer}>
          <View style={styles.successIconBg}>
            <ShieldCheck size={48} color="#48BB78" />
          </View>
          <Text style={styles.successTitle}>Şifren Güncellendi! 🎉</Text>
          <Text style={styles.successText}>
            Yeni şifrenle giriş yapabilirsin.
          </Text>
          <TouchableOpacity
            style={styles.successButton}
            onPress={() => router.replace('/(auth)/signin')}
          >
            <Text style={styles.successButtonText}>Giriş Yap</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity
          style={styles.backIcon}
          onPress={() => {
            if (step === 'otp') setStep('email');
            else if (step === 'newPassword') setStep('otp');
            else router.back();
          }}
        >
          <ArrowLeft size={24} color="#2D3748" />
        </TouchableOpacity>

        {/* ==================== STEP INDICATOR ==================== */}
        <View style={styles.stepIndicator}>
          <View style={[styles.stepDot, step === 'email' && styles.stepDotActive]} />
          <View style={[styles.stepLine, (step === 'otp' || step === 'newPassword') && styles.stepLineActive]} />
          <View style={[styles.stepDot, step === 'otp' && styles.stepDotActive]} />
          <View style={[styles.stepLine, step === 'newPassword' && styles.stepLineActive]} />
          <View style={[styles.stepDot, step === 'newPassword' && styles.stepDotActive]} />
        </View>

        {/* ==================== STEP 1: EMAIL ==================== */}
        {step === 'email' && (
          <>
            <View style={styles.header}>
              <Text style={styles.logo}>🔐</Text>
              <Text style={styles.title}>Şifremi Unuttum</Text>
              <Text style={styles.subtitle}>
                E-posta adresini gir, sana şifre sıfırlama kodu gönderelim.
              </Text>
            </View>

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>E-posta</Text>
                <TextInput
                  style={styles.input}
                  placeholder="ornek@email.com"
                  placeholderTextColor="#A0AEC0"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  editable={!loading}
                />
              </View>

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleSendCode}
                disabled={loading || !email}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <Send size={20} color="white" />
                    <Text style={styles.buttonText}>Kod Gönder</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                💡 E-posta gelmediyse spam klasörünü kontrol et.
              </Text>
            </View>
          </>
        )}

        {/* ==================== STEP 2: OTP CODE ==================== */}
        {step === 'otp' && (
          <>
            <View style={styles.header}>
              <Text style={styles.logo}>📩</Text>
              <Text style={styles.title}>Kodu Gir</Text>
              <Text style={styles.subtitle}>
                <Text style={styles.emailHighlight}>{email}</Text> adresine gönderdiğimiz 8 haneli kodu gir.
              </Text>
            </View>

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <View style={styles.otpContainer}>
              {otpCode.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => { otpRefs.current[index] = ref; }}
                  style={[styles.otpInput, digit ? styles.otpInputFilled : null]}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  onKeyPress={({ nativeEvent }) => handleOtpKeyPress(nativeEvent.key, index)}
                  keyboardType="number-pad"
                  maxLength={index === 0 ? 8 : 1}
                  editable={!loading}
                  selectTextOnFocus
                />
              ))}
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleVerifyCode}
              disabled={loading || otpCode.join('').length !== 8}
            >
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <KeyRound size={20} color="white" />
                  <Text style={styles.buttonText}>Doğrula</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.resendButton}
              onPress={handleResendCode}
              disabled={loading}
            >
              <Text style={styles.resendText}>Kod gelmedi mi? <Text style={styles.resendLink}>Tekrar Gönder</Text></Text>
            </TouchableOpacity>
          </>
        )}

        {/* ==================== STEP 3: NEW PASSWORD ==================== */}
        {step === 'newPassword' && (
          <>
            <View style={styles.header}>
              <Text style={styles.logo}>🔑</Text>
              <Text style={styles.title}>Yeni Şifre Belirle</Text>
              <Text style={styles.subtitle}>
                Yeni şifreni belirle. En az 6 karakter olmalıdır.
              </Text>
            </View>

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Yeni Şifre</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry={!showPassword}
                    placeholder="En az 6 karakter"
                    placeholderTextColor="#A0AEC0"
                    editable={!loading}
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={18} color="#718096" />
                    ) : (
                      <Eye size={18} color="#718096" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Yeni Şifre (Tekrar)</Text>
                <TextInput
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={true}
                  placeholder="Şifreni tekrar gir"
                  placeholderTextColor="#A0AEC0"
                  editable={!loading}
                />
              </View>

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleResetPassword}
                disabled={loading || !newPassword || !confirmPassword}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <ShieldCheck size={20} color="white" />
                    <Text style={styles.buttonText}>Şifreyi Güncelle</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 60,
  },
  backIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  // Step Indicator
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E2E8F0',
  },
  stepDotActive: {
    backgroundColor: Colors.spacePurple,
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  stepLine: {
    width: 40,
    height: 3,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 4,
  },
  stepLineActive: {
    backgroundColor: Colors.spacePurple,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#718096',
    textAlign: 'center',
    lineHeight: 22,
  },
  emailHighlight: {
    fontWeight: '700',
    color: Colors.spacePurple,
  },
  errorContainer: {
    backgroundColor: '#FFF5F5',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FED7D7',
  },
  errorText: {
    color: '#E53E3E',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  form: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#2D3748',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#2D3748',
  },
  eyeButton: {
    padding: 4,
  },
  button: {
    backgroundColor: Colors.spacePurple,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  infoBox: {
    backgroundColor: '#EBF8FF',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4299E1',
  },
  infoText: {
    fontSize: 14,
    color: '#2C5282',
    lineHeight: 20,
  },
  // OTP Styles
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 28,
  },
  otpInput: {
    width: 40,
    height: 48,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    backgroundColor: 'white',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: '#2D3748',
  },
  otpInputFilled: {
    borderColor: Colors.spacePurple,
    backgroundColor: '#F0EEFF',
  },
  resendButton: {
    alignItems: 'center',
    marginTop: 20,
    padding: 8,
  },
  resendText: {
    fontSize: 14,
    color: '#718096',
  },
  resendLink: {
    color: Colors.spacePurple,
    fontWeight: '700',
  },
  // Success Styles
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  successIconBg: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#F0FFF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 12,
    textAlign: 'center',
  },
  successText: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  successButton: {
    backgroundColor: Colors.spacePurple,
    borderRadius: 12,
    paddingHorizontal: 40,
    paddingVertical: 16,
  },
  successButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
});
