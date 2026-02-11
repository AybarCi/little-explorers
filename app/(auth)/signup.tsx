import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Modal,
  Linking,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Eye, EyeOff, UserPlus, AlertTriangle, Mail, KeyRound } from 'lucide-react-native';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { signup, clearError } from '@/store/slices/authSlice';
import { Colors } from '@/constants/colors';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';

const SUPABASE_URL =
  (Constants.expoConfig?.extra as any)?.supabaseUrl ||
  process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY =
  (Constants.expoConfig?.extra as any)?.supabaseAnonKey ||
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

const ageGroups = [
  { value: '5-7', label: '5-7 Yaş' },
  { value: '8-10', label: '8-10 Yaş' },
  { value: '11-13', label: '11-13 Yaş' },
  { value: '14+', label: '14+ Yaş' },
];

export default function SignUpScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ageGroup, setAgeGroup] = useState('8-10');
  const [showPassword, setShowPassword] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);

  // OTP states
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '', '', '']);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState('');
  const otpRefs = useRef<(TextInput | null)[]>([]);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error, verificationRequired } = useAppSelector((state) => state.auth);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, []);

  useEffect(() => {
    setErrorVisible(!!error);
  }, [error]);

  const handleSignUp = () => {
    if (!fullName || !email || !password) return;
    dispatch(signup({ email, password, fullName, ageGroup }));
  };

  // OTP handlers
  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) {
      const digits = value.replace(/\D/g, '').slice(0, 8);
      const newOtp = [...otpCode];
      for (let i = 0; i < digits.length; i++) {
        if (index + i < 8) {
          newOtp[index + i] = digits[i];
        }
      }
      setOtpCode(newOtp);
      const nextIndex = Math.min(index + digits.length, 7);
      otpRefs.current[nextIndex]?.focus();
      return;
    }

    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);

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

  const handleVerifyEmail = async () => {
    const code = otpCode.join('');
    if (code.length !== 8) {
      setOtpError('Lütfen 8 haneli kodu eksiksiz girin');
      return;
    }

    setVerifyingOtp(true);
    setOtpError('');

    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          email,
          otp_code: code,
        }),
      });

      const data = await response.json() as {
        success?: boolean;
        error?: string;
        session?: any;
        user?: any;
      };

      if (!response.ok || !data.success) {
        setOtpError(data.error || 'Doğrulama başarısız oldu');
        return;
      }

      // Save session and user to SecureStore
      if (data.session) {
        await SecureStore.setItemAsync('auth_session', JSON.stringify(data.session));
      }
      if (data.user) {
        await SecureStore.setItemAsync('auth_user', JSON.stringify(data.user));
      }

      // Redirect to signin so they can login with their new verified account
      Alert.alert(
        'Hesabın Doğrulandı! 🎉',
        'E-postan başarıyla doğrulandı. Şimdi giriş yapabilirsin.',
        [
          {
            text: 'Giriş Yap',
            onPress: () => router.replace('/(auth)/signin'),
          },
        ]
      );
    } catch (err) {
      setOtpError('Bağlantı hatası. Lütfen tekrar deneyin.');
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleResendCode = async () => {
    // Re-register triggers a new confirmation email
    setOtpError('');
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/auth-signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          email,
          password,
          full_name: fullName,
          age_group: ageGroup,
        }),
      });

      if (response.ok) {
        Alert.alert('Başarılı', 'Yeni doğrulama kodu gönderildi!');
      } else {
        // If user already exists, try resend via auth API
        const resendResponse = await fetch(`${SUPABASE_URL}/auth/v1/resend`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: SUPABASE_ANON_KEY || '',
          },
          body: JSON.stringify({
            type: 'signup',
            email,
          }),
        });
        if (resendResponse.ok) {
          Alert.alert('Başarılı', 'Yeni doğrulama kodu gönderildi!');
        } else {
          setOtpError('Kod gönderilemedi. Lütfen tekrar deneyin.');
        }
      }
    } catch {
      setOtpError('Kod gönderilemedi');
    }
  };

  // ==================== OTP VERIFICATION SCREEN ====================
  if (verificationRequired) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.otpScrollContent}>
          <View style={styles.otpHeader}>
            <View style={styles.otpIconContainer}>
              <Mail size={40} color={Colors.brightYellow} />
            </View>
            <Text style={styles.otpTitle}>E-postanı Doğrula</Text>
            <Text style={styles.otpSubtitle}>
              <Text style={styles.otpEmailHighlight}>{email}</Text> adresine gönderdiğimiz 8 haneli kodu gir.
            </Text>
          </View>

          {otpError ? (
            <View style={styles.otpErrorBox}>
              <Text style={styles.otpErrorText}>{otpError}</Text>
            </View>
          ) : null}

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
                editable={!verifyingOtp}
                selectTextOnFocus
              />
            ))}
          </View>

          <TouchableOpacity
            style={[styles.otpButton, verifyingOtp && styles.otpButtonDisabled]}
            onPress={handleVerifyEmail}
            disabled={verifyingOtp || otpCode.join('').length !== 8}
          >
            {verifyingOtp ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <KeyRound size={20} color="white" />
                <Text style={styles.otpButtonText}>Doğrula</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resendButton}
            onPress={handleResendCode}
            disabled={verifyingOtp}
          >
            <Text style={styles.resendText}>
              Kod gelmedi mi? <Text style={styles.resendLink}>Tekrar Gönder</Text>
            </Text>
          </TouchableOpacity>

          <View style={styles.otpInfoBox}>
            <Text style={styles.otpInfoText}>
              💡 Gelen kutusunda bulamazsan spam klasörünü kontrol etmeyi unutma.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  // ==================== SIGNUP FORM ====================
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Hesap Oluştur</Text>
          <Text style={styles.subtitle}>Hadi başlayalım!</Text>
        </View>

        {error && (
          <Modal
            transparent
            visible={errorVisible}
            animationType="fade"
            onRequestClose={() => {
              setErrorVisible(false);
              dispatch(clearError());
            }}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <AlertTriangle size={28} color={Colors.warmPink} />
                <Text style={styles.modalTitle}>Hata</Text>
                <Text style={styles.modalMessage}>{error}</Text>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => {
                    setErrorVisible(false);
                    dispatch(clearError());
                  }}
                >
                  <Text style={styles.modalButtonText}>Tamam</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Kullanıcı Adı</Text>
            <TextInput
              style={styles.input}
              placeholder="Kullanıcı adınızı girin"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={fullName}
              onChangeText={setFullName}
              editable={!loading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>E-posta</Text>
            <TextInput
              style={styles.input}
              placeholder="ornek@email.com"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!loading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Yaş Grubu</Text>
            <View style={styles.ageGroupContainer}>
              {ageGroups.map((group) => (
                <TouchableOpacity
                  key={group.value}
                  style={[
                    styles.ageGroupButton,
                    ageGroup === group.value && styles.ageGroupButtonActive,
                  ]}
                  onPress={() => setAgeGroup(group.value)}
                  disabled={loading}
                >
                  <Text
                    style={[
                      styles.ageGroupText,
                      ageGroup === group.value && styles.ageGroupTextActive,
                    ]}
                  >
                    {group.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Şifre</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Şifrenizi girin (min 6 karakter)"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!loading}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff size={20} color={Colors.brightYellow} />
                ) : (
                  <Eye size={20} color={Colors.brightYellow} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSignUp}
            disabled={loading || !fullName || !email || !password}
          >
            <UserPlus size={20} color="white" />
            <Text style={styles.buttonText}>
              {loading ? 'Hesap Oluşturuluyor...' : 'Kaydol'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Zaten hesabın var mı? </Text>
          <Link href="/(auth)/signin" asChild>
            <TouchableOpacity disabled={loading}>
              <Text style={styles.link}>Giriş Yap</Text>
            </TouchableOpacity>
          </Link>
        </View>

        <View style={styles.legalLinks}>
          <TouchableOpacity onPress={() => Linking.openURL('https://kucuk-kasif.com/privacy')}>
            <Text style={styles.legalLinkText}>Gizlilik Politikası</Text>
          </TouchableOpacity>
          <Text style={styles.legalSeparator}>•</Text>
          <TouchableOpacity onPress={() => Linking.openURL('https://kucuk-kasif.com/terms')}>
            <Text style={styles.legalLinkText}>Kullanım Şartları</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 160,
    height: 160,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.brightYellow,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  modalMessage: {
    fontSize: 14,
    color: Colors.warmPink,
    textAlign: 'center',
    lineHeight: 20,
  },
  modalButton: {
    marginTop: 8,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
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
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.text,
  },
  ageGroupContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  ageGroupButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  ageGroupButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  ageGroupText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  ageGroupTextActive: {
    color: Colors.text,
  },
  passwordContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
  eyeIcon: {
    padding: 4,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 15,
    color: Colors.text,
  },
  link: {
    fontSize: 15,
    color: Colors.brightYellow,
    fontWeight: '700',
  },
  legalLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    gap: 8,
  },
  legalLinkText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    textDecorationLine: 'underline',
  },
  legalSeparator: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
  },
  // ==================== OTP Verification Styles ====================
  otpScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  otpHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  otpIconContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  otpTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  otpSubtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    lineHeight: 22,
  },
  otpEmailHighlight: {
    fontWeight: '700',
    color: Colors.brightYellow,
  },
  otpErrorBox: {
    backgroundColor: 'rgba(241, 111, 152, 0.2)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.warmPink,
  },
  otpErrorText: {
    fontSize: 13,
    color: Colors.warmPink,
    textAlign: 'center',
    fontWeight: '600',
  },
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
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  otpInputFilled: {
    borderColor: Colors.brightYellow,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
  },
  otpButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  otpButtonDisabled: {
    opacity: 0.6,
  },
  otpButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  resendButton: {
    alignItems: 'center',
    marginTop: 20,
    padding: 8,
  },
  resendText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
  },
  resendLink: {
    color: Colors.brightYellow,
    fontWeight: '700',
  },
  otpInfoBox: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    borderLeftWidth: 4,
    borderLeftColor: Colors.brightYellow,
  },
  otpInfoText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 20,
  },
});
