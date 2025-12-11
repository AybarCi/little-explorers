import { Link } from 'react-router-dom';
import AnimatedSection from '../components/AnimatedSection';
import './Download.css';

export default function Download() {
  return (
    <div className="download-page">
      {/* Hero Section */}
      <section className="download-hero">
        <AnimatedSection>
          <div className="download-hero-content">
            <span className="download-badge">📱 Ücretsiz İndir</span>
            <h1 className="download-title">
              Küçük Kaşif'i
              <br />
              <span className="gradient-text">Hemen İndirin!</span>
            </h1>
            <p className="download-subtitle">
              iPhone, iPad ve Android cihazlarınızda eğlenceli ve
              eğitici oyunlarla çocuğunuzun gelişimini destekleyin.
            </p>
          </div>
        </AnimatedSection>
      </section>

      {/* Download Cards */}
      <section className="download-cards-section">
        <div className="download-cards">
          <AnimatedSection delay={100}>
            <div className="download-card">
              <div className="store-icon apple-icon">
                <svg viewBox="0 0 384 512" width="48" height="48" fill="currentColor">
                  <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                </svg>
              </div>
              <h3>App Store</h3>
              <p>iPhone ve iPad için</p>
              <a href="https://apps.apple.com" className="download-btn ios">
                <span>App Store'dan İndir</span>
              </a>
              <span className="requirement">iOS 13.0+</span>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <div className="download-card">
              <div className="store-icon play-icon">
                <svg viewBox="0 0 512 512" width="48" height="48" fill="currentColor">
                  <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
                </svg>
              </div>
              <h3>Google Play</h3>
              <p>Android cihazlar için</p>
              <a href="https://play.google.com" className="download-btn android">
                <span>Google Play'den İndir</span>
              </a>
              <span className="requirement">Android 8.0+</span>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Steps Section */}
      <section className="steps-section">
        <AnimatedSection>
          <h2 className="section-title">Nasıl Başlarsınız?</h2>
        </AnimatedSection>

        <div className="steps-grid">
          <AnimatedSection delay={100}>
            <div className="step-card">
              <div className="step-number">1</div>
              <h4>Uygulamayı İndirin</h4>
              <p>App Store veya Google Play'den ücretsiz indirin</p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <div className="step-card">
              <div className="step-number">2</div>
              <h4>Hesap Oluşturun</h4>
              <p>Çocuğunuz için yaş grubuna uygun profil oluşturun</p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={300}>
            <div className="step-card">
              <div className="step-number">3</div>
              <h4>Oynamaya Başlayın</h4>
              <p>Eğlenceli oyunlarla öğrenme macerasına başlayın</p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <AnimatedSection>
          <h2 className="section-title">Sıkça Sorulan Sorular</h2>
        </AnimatedSection>

        <div className="faq-grid">
          <AnimatedSection delay={100}>
            <div className="faq-item">
              <h4>Uygulama ücretsiz mi?</h4>
              <p>Evet, Küçük Kaşif tamamen ücretsizdir. Hiçbir gizli ücret yoktur.</p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={150}>
            <div className="faq-item">
              <h4>Hangi yaş grupları için uygun?</h4>
              <p>5-14 yaş arası çocuklar için tasarlanmıştır.</p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <div className="faq-item">
              <h4>İnternet gerekli mi?</h4>
              <p>İlk giriş için gereklidir, bazı oyunlar çevrimdışı çalışır.</p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={250}>
            <div className="faq-item">
              <h4>Reklam var mı?</h4>
              <p>Zorunlu reklam yoktur. İsteğe bağlı olarak elmas kazanmak için reklam izlenebilir.</p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="download-cta">
        <AnimatedSection>
          <h2>Hazır mısınız?</h2>
          <p>Çocuğunuzun eğlenerek öğrenmesi için hemen indirin!</p>
          <Link to="/" className="cta-button">
            🏠 Ana Sayfaya Dön
          </Link>
        </AnimatedSection>
      </section>
    </div>
  );
}
