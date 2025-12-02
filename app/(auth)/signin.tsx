import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Link } from 'expo-router';
import { Eye, EyeOff, LogIn } from 'lucide-react-native';
import { Image } from 'react-native';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { signin, clearError } from '@/store/slices/authSlice';
import { Colors } from '@/constants/colors';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, []);

  const handleSignIn = () => {
    if (!email || !password) return;
    dispatch(signin({ email, password }));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image
            source={require('@/assets/images/Gemini_Generated_Image_9boqtv9boqtv9boq.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Uzay Kaşifi</Text>
          <Text style={styles.subtitle}>Hoş Geldin!</Text>
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
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!loading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Şifre</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Şifrenizi girin"
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

          <Link href="/(auth)/forgot-password" asChild>
            <TouchableOpacity disabled={loading}>
              <Text style={styles.forgotPassword}>Şifremi Unuttum?</Text>
            </TouchableOpacity>
          </Link>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSignIn}
            disabled={loading || !email || !password}
          >
            <LogIn size={20} color="white" />
            <Text style={styles.buttonText}>
              {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Hesabın yok mu? </Text>
          <Link href="/(auth)/signup" asChild>
            <TouchableOpacity disabled={loading}>
              <Text style={styles.link}>Kaydol</Text>
            </TouchableOpacity>
          </Link>
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
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.brightYellow,
  },
  errorContainer: {
    backgroundColor: 'rgba(241, 111, 152, 0.2)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: Colors.warmPink,
  },
  errorText: {
    color: Colors.warmPink,
    fontSize: 14,
    fontWeight: '500',
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
  forgotPassword: {
    fontSize: 14,
    color: Colors.brightYellow,
    fontWeight: '600',
    textAlign: 'right',
    marginBottom: 24,
  },
  button: {
    backgroundColor: Colors.primary,
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
});
