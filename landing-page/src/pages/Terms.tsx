import AnimatedSection from '../components/AnimatedSection';
import { Link } from 'react-router-dom';
import './Terms.css';

export default function Terms() {
  return (
    <div className="terms-page">
      {/* Hero */}
      <section className="terms-hero">
        <AnimatedSection>
          <span className="terms-badge">📋 Kullanım Şartları</span>
          <h1>Kullanım Şartları</h1>
          <p>Küçük Kaşif'i kullanmadan önce okuyun</p>
          <span className="update-date">Son güncelleme: 11 Aralık 2025</span>
        </AnimatedSection>
      </section>

      {/* Content */}
      <section className="terms-content">
        <div className="content-container">
          <AnimatedSection>
            <div className="intro-card">
              <h2>✅ Şartların Kabulü</h2>
              <p>
                Küçük Kaşif uygulamasını kullanarak bu şartları kabul etmiş olursunuz.
                Güvenli ve eğlenceli bir deneyim için lütfen kurallarımıza uyun.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={100}>
            <div className="terms-section">
              <h3>👶 Yaş Sınırlaması</h3>
              <p>
                Uygulama 5-14 yaş arası çocuklar için tasarlanmıştır.
                13 yaş altı çocukların kullanımı için ebeveyn onayı gereklidir.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={150}>
            <div className="terms-section">
              <h3>🔐 Hesap Sorumluluğu</h3>
              <ul className="terms-list">
                <li>🔒 Hesap bilgilerinizi güvenli tutun</li>
                <li>🚫 Bilgilerinizi başkalarıyla paylaşmayın</li>
                <li>🚨 Şüpheli aktivite fark ederseniz bildirin</li>
                <li>👤 Her hesap tek kişi tarafından kullanılmalı</li>
              </ul>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <div className="terms-section">
              <h3>✅ Kabul Edilebilir Kullanım</h3>
              <ul className="terms-list">
                <li>📚 Uygulamayı yalnızca eğitim amaçlı kullanın</li>
                <li>🚫 Sistemi manipüle etmeyin</li>
                <li>💙 Diğer kullanıcılara zarar vermeyin</li>
                <li>⚖️ Yasal olmayan aktiviteler için kullanmayın</li>
              </ul>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={250}>
            <div className="terms-section">
              <h3>©️ Fikri Mülkiyet Hakları</h3>
              <p>
                Tüm içerik, tasarım, logo ve oyunlar telif hakkı ile korunmaktadır.
                İzinsiz kopyalama, ticari kullanım veya tersine mühendislik yasaktır.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={300}>
            <div className="terms-section">
              <h3>💰 Ücretlendirme</h3>
              <p>
                Küçük Kaşif tamamen ücretsizdir. Gelecekte ücretli özellikler eklenebilir
                ancak temel oyun deneyimi her zaman ücretsiz kalacaktır.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={350}>
            <div className="terms-section">
              <h3>👨‍👩‍👧‍👦 Ebeveyn Sorumluluğu</h3>
              <ul className="terms-list">
                <li>👀 Çocuğunuzun kullanımını denetleyin</li>
                <li>🎯 Uygun yaş grubu seçimini yapın</li>
                <li>⏰ Ekran süresini yönetin</li>
                <li>🔐 Hesap güvenliğini sağlayın</li>
              </ul>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={400}>
            <div className="terms-section">
              <h3>🔒 Gizlilik</h3>
              <p>
                Gizlilik politikamız bu şartların bir parçasıdır.
                <Link to="/privacy" className="inline-link"> Gizlilik Politikamızı</Link> okuyun.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={450}>
            <div className="terms-section">
              <h3>📜 Uygulanacak Hukuk</h3>
              <p>
                Bu şartlar Türkiye Cumhuriyeti yasalarına tabidir.
                Anlaşmazlıklarda Türkiye mahkemeleri yetkilidir.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={500}>
            <div className="contact-card">
              <h3>📧 İletişim</h3>
              <p>Sorularınız için: <strong>support@kucuk-kasif.com</strong></p>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
