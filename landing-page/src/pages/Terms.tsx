import { Colors } from '../constants/colors';

export default function Terms() {
  return (
    <div style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.container}>
          <h1 style={styles.title}>Kullanım Şartları</h1>
          <p style={styles.subtitle}>Son güncelleme: 2 Aralık 2024</p>
        </div>
      </section>

      <section style={styles.content}>
        <div style={styles.container}>
          <div style={styles.contentBox}>
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>1. Şartların Kabulü</h2>
              <p style={styles.text}>
                Küçük Kaşif uygulamasını kullanarak, bu kullanım şartlarını kabul etmiş olursunuz.
                Bu şartları kabul etmiyorsanız, lütfen uygulamayı kullanmayınız.
              </p>
            </section>

            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>2. Kullanım Koşulları</h2>
              <h3 style={styles.subsectionTitle}>2.1 Yaş Sınırlaması</h3>
              <p style={styles.text}>
                Uygulama 5-14 yaş arası çocuklar için tasarlanmıştır. 13 yaş altı çocukların
                uygulamayı kullanması için ebeveyn veya veli onayı gereklidir.
              </p>

              <h3 style={styles.subsectionTitle}>2.2 Hesap Sorumluluğu</h3>
              <ul style={styles.list}>
                <li style={styles.listItem}>Hesap bilgilerinizi güvenli tutmaktan siz sorumlusunuz</li>
                <li style={styles.listItem}>Hesap bilgilerinizi başkalarıyla paylaşmayınız</li>
                <li style={styles.listItem}>Şüpheli aktivite fark ederseniz hemen bildirin</li>
                <li style={styles.listItem}>Her hesap yalnızca bir kişi tarafından kullanılmalıdır</li>
              </ul>

              <h3 style={styles.subsectionTitle}>2.3 Kabul Edilebilir Kullanım</h3>
              <p style={styles.text}>
                Uygulamayı kullanırken aşağıdaki kurallara uymalısınız:
              </p>
              <ul style={styles.list}>
                <li style={styles.listItem}>Uygulamayı yalnızca eğitim amaçlı kullanın</li>
                <li style={styles.listItem}>Sistemi manipüle etmeye çalışmayın</li>
                <li style={styles.listItem}>Diğer kullanıcılara zarar vermeyin</li>
                <li style={styles.listItem}>Yasal olmayan aktiviteler için kullanmayın</li>
              </ul>
            </section>

            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>3. Fikri Mülkiyet Hakları</h2>
              <p style={styles.text}>
                Küçük Kaşif uygulamasındaki tüm içerik, tasarım, logo, grafik, oyunlar ve
                yazılımlar telif hakkı ve diğer fikri mülkiyet yasaları ile korunmaktadır.
              </p>
              <ul style={styles.list}>
                <li style={styles.listItem}>İçeriği izinsiz kopyalayamazsınız</li>
                <li style={styles.listItem}>Ticari amaçlarla kullanamazsınız</li>
                <li style={styles.listItem}>Tersine mühendislik yapamazsınız</li>
                <li style={styles.listItem}>Değiştirerek dağıtamazsınız</li>
              </ul>
            </section>

            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>4. Hizmet Sunumu</h2>
              <h3 style={styles.subsectionTitle}>4.1 Hizmet Garantisi</h3>
              <p style={styles.text}>
                Küçük Kaşif uygulaması "olduğu gibi" sunulmaktadır. Kesintisiz veya hatasız
                hizmet garantisi vermiyoruz, ancak en iyi deneyimi sunmak için çalışıyoruz.
              </p>

              <h3 style={styles.subsectionTitle}>4.2 Hizmet Değişiklikleri</h3>
              <p style={styles.text}>
                Aşağıdaki haklarımızı saklı tutarız:
              </p>
              <ul style={styles.list}>
                <li style={styles.listItem}>Uygulamayı güncelleme ve değiştirme</li>
                <li style={styles.listItem}>Yeni özellikler ekleme veya kaldırma</li>
                <li style={styles.listItem}>Geçici veya kalıcı bakım yapma</li>
                <li style={styles.listItem}>Hizmet koşullarını güncelleme</li>
              </ul>
            </section>

            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>5. Ücretlendirme</h2>
              <p style={styles.text}>
                Küçük Kaşif şu anda tamamen ücretsiz bir uygulamadır. Gelecekte ücretli
                özellikler ekleyebiliriz, ancak temel oyun deneyimi her zaman ücretsiz kalacaktır.
              </p>
            </section>

            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>6. Hesap Askıya Alma ve Sonlandırma</h2>
              <p style={styles.text}>
                Aşağıdaki durumlarda hesabınızı askıya alabilir veya sonlandırabiliriz:
              </p>
              <ul style={styles.list}>
                <li style={styles.listItem}>Kullanım şartlarının ihlali</li>
                <li style={styles.listItem}>Yasadışı aktiviteler</li>
                <li style={styles.listItem}>Diğer kullanıcılara zarar verme</li>
                <li style={styles.listItem}>Sistemi manipüle etme girişimleri</li>
              </ul>
              <p style={styles.text}>
                Hesabınızı istediğiniz zaman kendiniz de silebilirsiniz.
              </p>
            </section>

            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>7. Sorumluluk Sınırlaması</h2>
              <p style={styles.text}>
                Yasal olarak izin verilen en geniş ölçüde:
              </p>
              <ul style={styles.list}>
                <li style={styles.listItem}>
                  Uygulamanın kullanımından kaynaklanan dolaylı zararlardan sorumlu değiliz
                </li>
                <li style={styles.listItem}>
                  Veri kaybı veya hizmet kesintilerinden doğan zararlardan sorumlu tutulamayız
                </li>
                <li style={styles.listItem}>
                  Üçüncü taraf hizmetlerinden kaynaklanan sorunlardan sorumlu değiliz
                </li>
              </ul>
            </section>

            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>8. Ebeveyn/Veli Sorumluluğu</h2>
              <p style={styles.text}>
                Ebeveynler ve veliler:
              </p>
              <ul style={styles.list}>
                <li style={styles.listItem}>Çocuklarının uygulama kullanımını denetlemekten sorumludur</li>
                <li style={styles.listItem}>Uygun yaş grubu seçimini yapmalıdır</li>
                <li style={styles.listItem}>Çocuğun ekran süresini yönetmelidir</li>
                <li style={styles.listItem}>Hesap güvenliğini sağlamalıdır</li>
              </ul>
            </section>

            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>9. Gizlilik</h2>
              <p style={styles.text}>
                Gizlilik politikamız bu kullanım şartlarının bir parçasıdır. Lütfen
                <a href="/privacy" style={styles.link}> Gizlilik Politikamızı</a> okuyunuz.
              </p>
            </section>

            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>10. Değişiklikler</h2>
              <p style={styles.text}>
                Bu kullanım şartlarını istediğimiz zaman değiştirme hakkını saklı tutarız.
                Önemli değişiklikler olduğunda kullanıcıları bilgilendireceğiz. Değişikliklerden
                sonra uygulamayı kullanmaya devam etmek, yeni şartları kabul ettiğiniz anlamına gelir.
              </p>
            </section>

            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>11. Uygulanacak Hukuk</h2>
              <p style={styles.text}>
                Bu kullanım şartları Türkiye Cumhuriyeti yasalarına tabidir. Herhangi bir
                anlaşmazlık durumunda Türkiye mahkemeleri yetkilidir.
              </p>
            </section>

            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>12. İletişim</h2>
              <p style={styles.text}>
                Kullanım şartları hakkında sorularınız varsa bizimle iletişime geçin:
              </p>
              <p style={styles.text}>
                <strong>E-posta:</strong> support@uzaykaşifi.com
              </p>
            </section>

            <section style={styles.section}>
              <p style={styles.text}>
                <em>
                  Bu kullanım şartlarını kabul ederek, Küçük Kaşif uygulamasını sorumlu ve
                  güvenli bir şekilde kullanacağınızı taahhüt etmiş olursunuz.
                </em>
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
  link: {
    color: Colors.energyOrange,
    textDecoration: 'none',
    fontWeight: '600',
  },
};
