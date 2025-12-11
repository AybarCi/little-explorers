import { Link } from 'react-router-dom';
import AnimatedSection from '../components/AnimatedSection';
import FeatureCard from '../components/FeatureCard';
import ScreenshotCarousel from '../components/ScreenshotCarousel';
import './Home.css';

// Import app screenshots
import screenshot1 from '../assets/IMG_3411.PNG';
import screenshot2 from '../assets/IMG_3412.PNG';
import screenshot3 from '../assets/IMG_3413.PNG';
import screenshot4 from '../assets/IMG_3414.PNG';
import screenshot5 from '../assets/IMG_3420.PNG';
import screenshot6 from '../assets/IMG_3421.PNG';
import screenshot7 from '../assets/IMG_3423.PNG';
import screenshot8 from '../assets/IMG_3424.PNG';

export default function Home() {
  const screenshots = [
    { url: screenshot1, alt: 'Küçük Kaşif - Anasayfa' },
    { url: screenshot2, alt: 'Küçük Kaşif - Oyunlar' },
    { url: screenshot3, alt: 'Küçük Kaşif - Profil' },
    { url: screenshot4, alt: 'Küçük Kaşif - İlerleme' },
    { url: screenshot5, alt: 'Küçük Kaşif - Mağaza' },
    { url: screenshot6, alt: 'Küçük Kaşif - Görevler' },
    { url: screenshot7, alt: 'Küçük Kaşif - Matematik Oyunu' },
    { url: screenshot8, alt: 'Küçük Kaşif - Hafıza Oyunu' },
  ];

  // Debug: Log screenshot URLs to console
  console.log('Screenshots loaded:', screenshots.map(s => ({ url: s.url, alt: s.alt })));


  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <AnimatedSection>
            <div className="hero-badge">🌟 Eğlenerek Öğrenin</div>
            <h1 className="hero-title">
              Küçük Kaşif ile
              <br />
              <span className="gradient-text">Keşfet, Öğren, Eğlen!</span>
            </h1>
            <p className="hero-description">
              5-14 yaş arası çocuklar için özel tasarlanmış eğitici oyunlarla
              matematik, hafıza, dikkat ve problem çözme becerilerini geliştirin.
            </p>
            <div className="hero-buttons">
              <Link to="/download" className="btn-primary">
                <span>📱 Hemen İndir</span>
              </Link>
              <a href="#features" className="btn-secondary">
                <span>✨ Özellikleri Keşfet</span>
              </a>
            </div>
          </AnimatedSection>
        </div>

        <div className="hero-visual">
          <AnimatedSection delay={200}>
            <ScreenshotCarousel screenshots={screenshots} />
          </AnimatedSection>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <AnimatedSection>
          <div className="section-header">
            <h2 className="section-title">Neden Küçük Kaşif?</h2>
            <p className="section-subtitle">
              Çocuğunuzun gelişimi için özel olarak tasarlanmış özellikler
            </p>
          </div>
        </AnimatedSection>

        <div className="features-grid">
          <AnimatedSection delay={100}>
            <FeatureCard
              icon="🎮"
              title="Eğlenceli Oyunlar"
              description="Matematik, hafıza, dikkat ve problem çözme oyunları ile eğlenirken öğrenin"
            />
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <FeatureCard
              icon="👶"
              title="Yaşa Uygun İçerik"
              description="5-7, 8-10, 11-13 ve 14+ yaş gruplarına özel zorluk seviyeleri"
            />
          </AnimatedSection>

          <AnimatedSection delay={300}>
            <FeatureCard
              icon="🏆"
              title="İlerleme Takibi"
              description="Çocuğunuzun gelişimini takip edin, başarılarını kutlayın"
            />
          </AnimatedSection>

          <AnimatedSection delay={400}>
            <FeatureCard
              icon="🛡️"
              title="Güvenli Ortam"
              description="Çocuklar için güvenli, zorunlu reklam içermeyen eğitici platform"
            />
          </AnimatedSection>
        </div>
      </section>

      {/* Game Categories */}
      <section className="categories-section">
        <AnimatedSection>
          <div className="section-header">
            <h2 className="section-title">Oyun Kategorileri</h2>
            <p className="section-subtitle">
              Her yaş grubuna uygun, eğlenceli ve öğretici oyunlar
            </p>
          </div>
        </AnimatedSection>

        <div className="categories-grid">
          <AnimatedSection delay={100}>
            <div className="category-card">
              <div className="category-icon">🔢</div>
              <h3 className="category-title">Matematik</h3>
              <p className="category-description">
                Toplama, çıkarma, çarpma ve bölme işlemlerini eğlenceli oyunlarla öğrenin
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={150}>
            <div className="category-card">
              <div className="category-icon">🧠</div>
              <h3 className="category-title">Hafıza</h3>
              <p className="category-description">
                Görsel ve işitsel hafıza egzersizleri ile dikkat süresini artırın
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <div className="category-card">
              <div className="category-icon">🎯</div>
              <h3 className="category-title">Dikkat</h3>
              <p className="category-description">
                Konsantrasyon ve odaklanma becerilerini geliştiren aktiviteler
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={250}>
            <div className="category-card">
              <div className="category-icon">🧩</div>
              <h3 className="category-title">Problem Çözme</h3>
              <p className="category-description">
                Mantıksal düşünme ve analitik zeka geliştiren bulmacalar
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={300}>
            <div className="category-card">
              <div className="category-icon">📚</div>
              <h3 className="category-title">Kelime</h3>
              <p className="category-description">
                Kelime hazinesini genişleten eğlenceli dil oyunları
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={350}>
            <div className="category-card">
              <div className="category-icon">🎮</div>
              <h3 className="category-title">Eğlence</h3>
              <p className="category-description">
                Bubble Shooter, Ludo ve daha fazla klasik oyun
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <AnimatedSection>
          <div className="cta-content">
            <h2 className="cta-title">Hazır mısınız?</h2>
            <p className="cta-description">
              Çocuğunuzun eğlenerek öğrenmesi için hemen Küçük Kaşif'i indirin
            </p>
            <Link to="/download" className="cta-button">
              <span>🚀 Ücretsiz İndir</span>
            </Link>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
}