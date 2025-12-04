import { Link } from 'react-router-dom';
import { Colors } from '../constants/colors';

export default function Home() {
  return (
    <div style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            Uzayın Derinliklerinde Keşif Zamanı!
          </h1>
          <p style={styles.heroSubtitle}>
            Çocuklar için özel olarak tasarlanmış eğitici ve eğlenceli oyunlarla
            matematik, hafıza, dikkat ve problem çözme becerilerini geliştirin
          </p>
          <Link to="/download" style={styles.heroButton}>
            Hemen İndir
          </Link>
        </div>
      </section>

      <section style={styles.features}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>Neden Küçük Kaşif?</h2>
          <div style={styles.featureGrid}>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>🎮</div>
              <h3 style={styles.featureTitle}>Eğlenceli Oyunlar</h3>
              <p style={styles.featureText}>
                Matematik, hafıza, dikkat ve problem çözme oyunları ile eğlenirken öğrenin
              </p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>👶</div>
              <h3 style={styles.featureTitle}>Yaşa Uygun İçerik</h3>
              <p style={styles.featureText}>
                5-7, 8-10, 11-13 ve 14+ yaş gruplarına özel olarak tasarlanmış zorluk seviyeleri
              </p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>🏆</div>
              <h3 style={styles.featureTitle}>İlerleme Takibi</h3>
              <p style={styles.featureText}>
                Çocuğunuzun gelişimini takip edin, başarılarını kutlayın
              </p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>🎨</div>
              <h3 style={styles.featureTitle}>Renkli ve Güvenli</h3>
              <p style={styles.featureText}>
                Çocuklar için tasarlanmış renkli arayüz, reklamlar yok, tamamen güvenli
              </p>
            </div>
          </div>
        </div>
      </section>

      <section style={styles.games}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>Oyun Kategorileri</h2>
          <div style={styles.gamesGrid}>
            <div style={styles.gameCard}>
              <div style={styles.gameIcon}>🔢</div>
              <h3 style={styles.gameTitle}>Matematik Oyunları</h3>
              <p style={styles.gameText}>
                Toplama, çıkarma, çarpma ve bölme işlemlerini eğlenceli oyunlarla öğrenin.
                Sayı kavramları, problem çözme ve hızlı hesaplama becerilerini geliştirin.
              </p>
            </div>
            <div style={styles.gameCard}>
              <div style={styles.gameIcon}>🧠</div>
              <h3 style={styles.gameTitle}>Hafıza Oyunları</h3>
              <p style={styles.gameText}>
                Kısa süreli ve uzun süreli hafızayı güçlendiren oyunlar. Görsel ve işitsel
                hafıza egzersizleri ile dikkat süresini artırın.
              </p>
            </div>
            <div style={styles.gameCard}>
              <div style={styles.gameIcon}>🎯</div>
              <h3 style={styles.gameTitle}>Dikkat Oyunları</h3>
              <p style={styles.gameText}>
                Konsantrasyon ve odaklanma becerilerini geliştiren aktiviteler. Görsel algı,
                ayrıntılara dikkat ve hızlı karar verme yeteneklerini pekiştirin.
              </p>
            </div>
            <div style={styles.gameCard}>
              <div style={styles.gameIcon}>🧩</div>
              <h3 style={styles.gameTitle}>Problem Çözme</h3>
              <p style={styles.gameText}>
                Mantıksal düşünme ve analitik zeka geliştiren bulmacalar. Strateji oluşturma,
                örüntü tanıma ve yaratıcı çözümler bulma becerilerini güçlendirin.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section style={styles.cta}>
        <div style={styles.container}>
          <h2 style={styles.ctaTitle}>Hazır mısınız?</h2>
          <p style={styles.ctaText}>
            Çocuğunuzun eğlenerek öğrenmesi için hemen Küçük Kaşif'i indirin
          </p>
          <Link to="/download" style={styles.ctaButton}>
            Ücretsiz İndir
          </Link>
        </div>
      </section>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
  },
  hero: {
    background: `linear-gradient(135deg, ${Colors.spacePurple} 0%, ${Colors.darkPurple} 100%)`,
    color: Colors.pureWhite,
    padding: '6rem 2rem',
    textAlign: 'center',
  },
  heroContent: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  heroTitle: {
    fontSize: '3rem',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    lineHeight: '1.2',
  },
  heroSubtitle: {
    fontSize: '1.25rem',
    lineHeight: '1.6',
    marginBottom: '2rem',
    opacity: 0.95,
  },
  heroButton: {
    display: 'inline-block',
    backgroundColor: Colors.energyOrange,
    color: Colors.pureWhite,
    padding: '1rem 2.5rem',
    borderRadius: '50px',
    textDecoration: 'none',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    transition: 'transform 0.3s, box-shadow 0.3s',
    boxShadow: '0 4px 15px rgba(245, 126, 55, 0.4)',
  },
  features: {
    padding: '5rem 2rem',
    backgroundColor: Colors.pureWhite,
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  sectionTitle: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '3rem',
    color: Colors.spacePurple,
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
  },
  featureCard: {
    textAlign: 'center',
    padding: '2rem',
    borderRadius: '15px',
    backgroundColor: '#f8f9fa',
    transition: 'transform 0.3s',
  },
  featureIcon: {
    fontSize: '4rem',
    marginBottom: '1rem',
  },
  featureTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    color: Colors.spacePurple,
  },
  featureText: {
    fontSize: '1rem',
    lineHeight: '1.6',
    color: '#666',
  },
  games: {
    padding: '5rem 2rem',
    backgroundColor: '#f8f9fa',
  },
  gamesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2rem',
  },
  gameCard: {
    backgroundColor: Colors.pureWhite,
    padding: '2rem',
    borderRadius: '15px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s, box-shadow 0.3s',
  },
  gameIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  gameTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    color: Colors.spacePurple,
  },
  gameText: {
    fontSize: '1rem',
    lineHeight: '1.6',
    color: '#666',
  },
  cta: {
    background: `linear-gradient(135deg, ${Colors.energyOrange} 0%, ${Colors.warmPink} 100%)`,
    color: Colors.pureWhite,
    padding: '5rem 2rem',
    textAlign: 'center',
  },
  ctaTitle: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
  },
  ctaText: {
    fontSize: '1.25rem',
    marginBottom: '2rem',
    opacity: 0.95,
  },
  ctaButton: {
    display: 'inline-block',
    backgroundColor: Colors.pureWhite,
    color: Colors.energyOrange,
    padding: '1rem 2.5rem',
    borderRadius: '50px',
    textDecoration: 'none',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    transition: 'transform 0.3s, box-shadow 0.3s',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
  },
};
