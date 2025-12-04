import { Colors } from '../constants/colors';

export default function Privacy() {
  return (
    <div style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.container}>
          <h1 style={styles.title}>Gizlilik Politikası</h1>
          <p style={styles.subtitle}>Son güncelleme: 2 Aralık 2024</p>
        </div>
      </section>

      <section style={styles.content}>
        <div style={styles.container}>
          <div style={styles.contentBox}>
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>1. Giriş</h2>
              <p style={styles.text}>
                Küçük Kaşif olarak, çocukların gizliliğini en üst düzeyde korumayı taahhüt ediyoruz.
                Bu gizlilik politikası, uygulamamızı kullanırken hangi bilgileri topladığımızı,
                nasıl kullandığımızı ve koruduğumuzu açıklamaktadır.
              </p>
            </section>

            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>2. Topladığımız Bilgiler</h2>
              <h3 style={styles.subsectionTitle}>2.1 Hesap Bilgileri</h3>
              <p style={styles.text}>
                Uygulama kullanımı için aşağıdaki bilgileri topluyoruz:
              </p>
              <ul style={styles.list}>
                <li style={styles.listItem}>E-posta adresi (ebeveyn/veli için)</li>
                <li style={styles.listItem}>Çocuğun adı ve soyadı</li>
                <li style={styles.listItem}>Yaş grubu bilgisi</li>
              </ul>

              <h3 style={styles.subsectionTitle}>2.2 Kullanım Verileri</h3>
              <ul style={styles.list}>
                <li style={styles.listItem}>Oyun ilerleme verileri ve puanlar</li>
                <li style={styles.listItem}>Oynanan oyunlar ve süreler</li>
                <li style={styles.listItem}>Başarılar ve seviye ilerlemeleri</li>
              </ul>

              <h3 style={styles.subsectionTitle}>2.3 Toplamadığımız Bilgiler</h3>
              <p style={styles.text}>
                Aşağıdaki bilgileri kesinlikle toplamıyoruz:
              </p>
              <ul style={styles.list}>
                <li style={styles.listItem}>Konum bilgileri</li>
                <li style={styles.listItem}>Fotoğraf veya kamera erişimi</li>
                <li style={styles.listItem}>Kişi listesi</li>
                <li style={styles.listItem}>Telefon numarası</li>
                <li style={styles.listItem}>Hassas kişisel bilgiler</li>
              </ul>
            </section>

            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>3. Bilgilerin Kullanımı</h2>
              <p style={styles.text}>
                Topladığımız bilgileri yalnızca aşağıdaki amaçlarla kullanıyoruz:
              </p>
              <ul style={styles.list}>
                <li style={styles.listItem}>Oyun deneyimini kişiselleştirmek</li>
                <li style={styles.listItem}>İlerlemeyi kaydetmek ve takip etmek</li>
                <li style={styles.listItem}>Yaş grubuna uygun içerik sunmak</li>
                <li style={styles.listItem}>Teknik destek sağlamak</li>
                <li style={styles.listItem}>Uygulama performansını iyileştirmek</li>
              </ul>
            </section>

            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>4. Veri Güvenliği</h2>
              <p style={styles.text}>
                Bilgilerinizi korumak için endüstri standardı güvenlik önlemleri kullanıyoruz:
              </p>
              <ul style={styles.list}>
                <li style={styles.listItem}>Tüm veriler şifrelenmiş bağlantılar üzerinden iletilir</li>
                <li style={styles.listItem}>Şifreler güvenli şekilde hashlenir ve saklanır</li>
                <li style={styles.listItem}>Düzenli güvenlik güncellemeleri yapılır</li>
                <li style={styles.listItem}>Veritabanı erişimi sınırlıdır ve denetlenir</li>
              </ul>
            </section>

            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>5. Üçüncü Taraflarla Paylaşım</h2>
              <p style={styles.text}>
                Çocukların bilgilerini üçüncü taraflarla <strong>kesinlikle paylaşmıyoruz</strong>.
                Verileriniz hiçbir şekilde satılmaz, kiralanmaz veya reklam amaçlı kullanılmaz.
              </p>
            </section>

            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>6. Çocukların Gizliliği</h2>
              <p style={styles.text}>
                Uygulamamız 13 yaş altı çocuklar için tasarlanmıştır ve COPPA (Children's Online
                Privacy Protection Act) gerekliliklerine uygundur:
              </p>
              <ul style={styles.list}>
                <li style={styles.listItem}>Ebeveyn/veli onayı gereklidir</li>
                <li style={styles.listItem}>Minimum veri toplama prensibi uygulanır</li>
                <li style={styles.listItem}>Reklam ve üçüncü taraf takibi yoktur</li>
                <li style={styles.listItem}>Güvenli ve çocuk dostu içerik sunulur</li>
              </ul>
            </section>

            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>7. Veri Saklama ve Silme</h2>
              <p style={styles.text}>
                Hesabınızı istediğiniz zaman silebilirsiniz. Hesap silme işlemi sonrasında:
              </p>
              <ul style={styles.list}>
                <li style={styles.listItem}>Tüm kişisel bilgiler kalıcı olarak silinir</li>
                <li style={styles.listItem}>Oyun ilerleme verileri kaldırılır</li>
                <li style={styles.listItem}>İşlem geri alınamaz</li>
              </ul>
            </section>

            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>8. Haklarınız</h2>
              <p style={styles.text}>
                Kullanıcılarımızın aşağıdaki hakları vardır:
              </p>
              <ul style={styles.list}>
                <li style={styles.listItem}>Bilgilerinize erişim hakkı</li>
                <li style={styles.listItem}>Bilgilerinizi düzeltme hakkı</li>
                <li style={styles.listItem}>Hesabınızı silme hakkı</li>
                <li style={styles.listItem}>Veri taşınabilirliği hakkı</li>
              </ul>
            </section>

            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>9. Politika Değişiklikleri</h2>
              <p style={styles.text}>
                Bu gizlilik politikasını zaman zaman güncelleyebiliriz. Önemli değişiklikler
                olduğunda kullanıcılarımızı e-posta yoluyla bilgilendireceğiz.
              </p>
            </section>

            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>10. İletişim</h2>
              <p style={styles.text}>
                Gizlilik politikamız hakkında sorularınız veya endişeleriniz varsa,
                bizimle iletişime geçmekten çekinmeyin:
              </p>
              <p style={styles.text}>
                <strong>E-posta:</strong> privacy@uzaykaşifi.com
              </p>
            </section>
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
    maxWidth: '900px',
    margin: '0 auto',
    padding: '0 2rem',
  },
  title: {
    fontSize: '3rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
  },
  subtitle: {
    fontSize: '1.1rem',
    opacity: 0.9,
  },
  content: {
    padding: '4rem 0',
  },
  contentBox: {
    backgroundColor: Colors.pureWhite,
    padding: '3rem',
    borderRadius: '20px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  section: {
    marginBottom: '3rem',
  },
  sectionTitle: {
    fontSize: '1.75rem',
    fontWeight: 'bold',
    color: Colors.spacePurple,
    marginBottom: '1rem',
  },
  subsectionTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: Colors.darkPurple,
    marginTop: '1.5rem',
    marginBottom: '0.75rem',
  },
  text: {
    fontSize: '1.05rem',
    lineHeight: '1.8',
    color: '#333',
    marginBottom: '1rem',
  },
  list: {
    paddingLeft: '1.5rem',
    marginTop: '0.5rem',
    marginBottom: '1rem',
  },
  listItem: {
    fontSize: '1.05rem',
    lineHeight: '1.8',
    color: '#333',
    marginBottom: '0.5rem',
  },
};
