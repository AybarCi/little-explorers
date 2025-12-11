import AnimatedSection from '../components/AnimatedSection';
import './Privacy.css';

export default function Privacy() {
  return (
    <div className="privacy-page">
      {/* Hero */}
      <section className="privacy-hero">
        <AnimatedSection>
          <span className="privacy-badge">🔒 Gizlilik</span>
          <h1>Gizlilik Politikası</h1>
          <p>Çocuklarınızın güvenliği bizim önceliğimiz</p>
          <span className="update-date">Son güncelleme: 11 Aralık 2025</span>
        </AnimatedSection>
      </section>

      {/* Content */}
      <section className="privacy-content">
        <div className="content-container">
          <AnimatedSection>
            <div className="intro-card">
              <h2>🛡️ Güvenlik Taahhüdümüz</h2>
              <p>
                Küçük Kaşif olarak, çocukların gizliliğini en üst düzeyde korumayı taahhüt ediyoruz.
                Bu politika, hangi bilgileri topladığımızı ve nasıl koruduğumuzu açıklar.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={100}>
            <div className="policy-section">
              <h3>📊 Topladığımız Bilgiler</h3>
              <div className="policy-grid">
                <div className="policy-item">
                  <h4>Hesap Bilgileri</h4>
                  <ul>
                    <li>E-posta adresi (ebeveyn için)</li>
                    <li>Yaş grubu bilgisi</li>
                  </ul>
                </div>
                <div className="policy-item">
                  <h4>Kullanım Verileri</h4>
                  <ul>
                    <li>Oyun ilerleme verileri</li>
                    <li>Oynanan oyunlar ve süreler</li>
                    <li>Başarılar ve seviyeler</li>
                  </ul>
                </div>
                <div className="policy-item highlight">
                  <h4>❌ Toplamadıklarımız</h4>
                  <ul>
                    <li>Konum bilgileri</li>
                    <li>Fotoğraf/kamera erişimi</li>
                    <li>Kişi listesi</li>
                    <li>Telefon numarası</li>
                  </ul>
                </div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={150}>
            <div className="policy-section">
              <h3>🔧 Bilgilerin Kullanımı</h3>
              <ul className="usage-list">
                <li>✅ Oyun deneyimini kişiselleştirme</li>
                <li>✅ İlerlemeyi kaydetme ve takip etme</li>
                <li>✅ Yaş grubuna uygun içerik sunma</li>
                <li>✅ Teknik destek sağlama</li>
              </ul>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <div className="policy-section">
              <h3>🔒 Veri Güvenliği</h3>
              <p>
                Tüm veriler şifrelenmiş bağlantılar üzerinden iletilir. Şifreler güvenli şekilde
                hashlenir. Düzenli güvenlik güncellemeleri yapılır.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={250}>
            <div className="policy-section">
              <h3>🔗 Üçüncü Taraflarla Paylaşım</h3>
              <p className="highlight-text">
                Çocukların bilgilerini üçüncü taraflarla <strong>kesinlikle paylaşmıyoruz</strong>.
                Verileriniz hiçbir şekilde satılmaz veya reklam amaçlı kullanılmaz.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={300}>
            <div className="policy-section">
              <h3>👶 Çocukların Gizliliği (COPPA)</h3>
              <ul className="usage-list">
                <li>✅ Ebeveyn/veli onayı gereklidir</li>
                <li>✅ Minimum veri toplama prensibi</li>
                <li>✅ Reklam ve üçüncü taraf takibi yok</li>
                <li>✅ Güvenli ve çocuk dostu içerik</li>
              </ul>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={350}>
            <div className="policy-section">
              <h3>✅ Haklarınız</h3>
              <ul className="usage-list">
                <li>📋 Bilgilerinize erişim hakkı</li>
                <li>✏️ Bilgilerinizi düzeltme hakkı</li>
                <li>🗑️ Hesabınızı silme hakkı</li>
                <li>📤 Veri taşınabilirliği hakkı</li>
              </ul>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={400}>
            <div className="contact-card">
              <h3>📧 İletişim</h3>
              <p>Sorularınız için: <strong>privacy@kucuk-kasif.com</strong></p>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
