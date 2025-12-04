import { Colors } from '../constants/colors';

export default function Download() {
  return (
    <div style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.container}>
          <h1 style={styles.title}>Küçük Kaşifi'i İndir</h1>
          <p style={styles.subtitle}>
            iOS ve Android cihazlarınızda ücretsiz olarak kullanın
          </p>
        </div>
      </section>

      <section style={styles.content}>
        <div style={styles.container}>
          <div style={styles.downloadGrid}>
            <div style={styles.downloadCard}>
              <div style={styles.icon}>📱</div>
              <h3 style={styles.cardTitle}>App Store</h3>
              <p style={styles.cardText}>
                iPhone ve iPad cihazlarınız için App Store'dan indirin
              </p>
              <button style={styles.downloadButton}>
                App Store'dan İndir
              </button>
              <p style={styles.requirements}>iOS 13.0 ve üzeri gerektirir</p>
            </div>

            <div style={styles.downloadCard}>
              <div style={styles.icon}>🤖</div>
              <h3 style={styles.cardTitle}>Google Play</h3>
              <p style={styles.cardText}>
                Android cihazlarınız için Google Play'den indirin
              </p>
              <button style={styles.downloadButton}>
                Google Play'den İndir
              </button>
              <p style={styles.requirements}>Android 8.0 ve üzeri gerektirir</p>
            </div>
          </div>

          <div style={styles.infoSection}>
            <h2 style={styles.infoTitle}>Kurulum Sonrası</h2>
            <div style={styles.stepGrid}>
              <div style={styles.step}>
                <div style={styles.stepNumber}>1</div>
                <h4 style={styles.stepTitle}>Hesap Oluşturun</h4>
                <p style={styles.stepText}>
                  Uygulamayı açın ve çocuğunuz için bir hesap oluşturun.
                  Yaş grubunu seçerek oyunların zorluğunu belirleyin.
                </p>
              </div>
              <div style={styles.step}>
                <div style={styles.stepNumber}>2</div>
                <h4 style={styles.stepTitle}>Oyunları Keşfedin</h4>
                <p style={styles.stepText}>
                  Matematik, hafıza, dikkat ve problem çözme kategorilerinden
                  uygun oyunları seçin.
                </p>
              </div>
              <div style={styles.step}>
                <div style={styles.stepNumber}>3</div>
                <h4 style={styles.stepTitle}>Başarıları Takip Edin</h4>
                <p style={styles.stepText}>
                  Çocuğunuzun ilerlemesini profil sayfasından takip edin,
                  başarılarını kutlayın.
                </p>
              </div>
            </div>
          </div>

          <div style={styles.faqSection}>
            <h2 style={styles.faqTitle}>Sıkça Sorulan Sorular</h2>
            <div style={styles.faqGrid}>
              <div style={styles.faqItem}>
                <h4 style={styles.faqQuestion}>Uygulama ücretsiz mi?</h4>
                <p style={styles.faqAnswer}>
                  Evet, Küçük Kaşif tamamen ücretsizdir. Hiçbir ücret veya
                  gizli maliyet yoktur.
                </p>
              </div>
              <div style={styles.faqItem}>
                <h4 style={styles.faqQuestion}>İnternet bağlantısı gerekli mi?</h4>
                <p style={styles.faqAnswer}>
                  İlk giriş ve veri senkronizasyonu için internet gereklidir.
                  Bazı oyunlar çevrimdışı oynanabilir.
                </p>
              </div>
              <div style={styles.faqItem}>
                <h4 style={styles.faqQuestion}>Hangi yaş gruplarına uygun?</h4>
                <p style={styles.faqAnswer}>
                  5-14 yaş arası çocuklar için tasarlanmıştır. Oyunlar yaş
                  grubuna göre otomatik olarak ayarlanır.
                </p>
              </div>
              <div style={styles.faqItem}>
                <h4 style={styles.faqQuestion}>Reklam var mı?</h4>
                <p style={styles.faqAnswer}>
                  Hayır, uygulama tamamen reklamsızdır. Çocuğunuz güvenli
                  bir ortamda oynayabilir.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
  },
  hero: {
    background: `linear-gradient(135deg, ${Colors.spacePurple} 0%, ${Colors.darkPurple} 100%)`,
    color: Colors.pureWhite,
    padding: '4rem 2rem',
    textAlign: 'center',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem',
  },
  title: {
    fontSize: '3rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
  },
  subtitle: {
    fontSize: '1.25rem',
    opacity: 0.95,
  },
  content: {
    padding: '4rem 0',
  },
  downloadGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    marginBottom: '4rem',
  },
  downloadCard: {
    backgroundColor: Colors.pureWhite,
    padding: '3rem 2rem',
    borderRadius: '20px',
    textAlign: 'center',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  icon: {
    fontSize: '4rem',
    marginBottom: '1.5rem',
  },
  cardTitle: {
    fontSize: '1.75rem',
    fontWeight: 'bold',
    color: Colors.spacePurple,
    marginBottom: '1rem',
  },
  cardText: {
    fontSize: '1rem',
    color: '#666',
    marginBottom: '2rem',
    lineHeight: '1.6',
  },
  downloadButton: {
    backgroundColor: Colors.energyOrange,
    color: Colors.pureWhite,
    padding: '1rem 2rem',
    borderRadius: '50px',
    border: 'none',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'transform 0.3s',
    width: '100%',
    maxWidth: '300px',
  },
  requirements: {
    fontSize: '0.875rem',
    color: '#999',
    marginTop: '1rem',
  },
  infoSection: {
    marginBottom: '4rem',
  },
  infoTitle: {
    fontSize: '2rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '3rem',
    color: Colors.spacePurple,
  },
  stepGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2rem',
  },
  step: {
    backgroundColor: Colors.pureWhite,
    padding: '2rem',
    borderRadius: '15px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  stepNumber: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: Colors.energyOrange,
    color: Colors.pureWhite,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
  },
  stepTitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: Colors.spacePurple,
    marginBottom: '0.75rem',
  },
  stepText: {
    fontSize: '1rem',
    color: '#666',
    lineHeight: '1.6',
  },
  faqSection: {
    backgroundColor: Colors.pureWhite,
    padding: '3rem',
    borderRadius: '20px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  faqTitle: {
    fontSize: '2rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '2rem',
    color: Colors.spacePurple,
  },
  faqGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2rem',
  },
  faqItem: {
    padding: '1.5rem',
    borderLeft: `4px solid ${Colors.brightYellow}`,
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
  },
  faqQuestion: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: Colors.spacePurple,
    marginBottom: '0.75rem',
  },
  faqAnswer: {
    fontSize: '1rem',
    color: '#666',
    lineHeight: '1.6',
  },
};
