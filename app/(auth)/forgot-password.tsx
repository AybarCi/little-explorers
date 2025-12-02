import { useState } from 'react';
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
import { useRouter } from 'expo-router';
import { ArrowLeft, Send } from 'lucide-react-native';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSendReset = () => {
    if (!email) return;

    setLoading(true);
    setError(null);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  if (success) {
    return (
      <View style={styles.container}>
        <View style={styles.successContainer}>
          <Text style={styles.successEmoji}>✅</Text>
          <Text style={styles.successTitle}>E-posta Gönderildi!</Text>
          <Text style={styles.successText}>
            Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. Lütfen
            gelen kutunuzu kontrol edin.
          </Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Giriş Ekranına Dön</Text>
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
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#2D3748" />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.logo}>🔐</Text>
          <Text style={styles.title}>Şifremi Unuttum</Text>
          <Text style={styles.subtitle}>
            E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.
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
            onPress={handleSendReset}
            disabled={loading || !email}
          >
            <Send size={20} color="white" />
            <Text style={styles.buttonText}>
              {loading ? 'Gönderiliyor...' : 'Bağlantı Gönder'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            💡 E-posta gelmediyse spam klasörünü kontrol edin.
          </Text>
        </View>
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
    marginBottom: 32,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
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
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    lineHeight: 24,
  },
  errorContainer: {
    backgroundColor: '#FED7D7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#E53E3E',
  },
  errorText: {
    color: '#C53030',
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
  button: {
    backgroundColor: '#805AD5',
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
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  successEmoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 16,
    textAlign: 'center',
  },
  successText: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  backButton: {
    backgroundColor: '#4299E1',
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
});
