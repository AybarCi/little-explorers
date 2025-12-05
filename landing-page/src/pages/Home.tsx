import { Link } from 'react-router-dom';
import { Colors } from '../constants/colors';
import { useEffect, useState } from 'react';

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // Check which sections are visible
      const sections = ['hero', 'features', 'games', 'cta'];
      const newVisibleSections = new Set<string>();
      
      sections.forEach(sectionId => {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.8) {
            newVisibleSections.add(sectionId);
          }
        }
      });
      
      setVisibleSections(newVisibleSections);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={styles.page}>
      {/* Hero Section with Parallax */}
      <section id="hero" style={{
        ...styles.hero,
        transform: `translateY(${scrollY * 0.5}px)`
      }}>
        <div style={{
          ...styles.heroContent,
          opacity: visibleSections.has('hero') ? 1 : 0,
          transform: visibleSections.has('hero') ? 'translateY(0)' : 'translateY(50px)',
          transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
          <h1 style={styles.heroTitle}>
            <span style={styles.heroTitleGradient}>Uzayın Derinliklerinde</span>
            <br />
            Keşif Zamanı!
          </h1>
          <p style={styles.heroSubtitle}>
            Çocuklar için özel olarak tasarlanmış eğitici ve eğlenceli oyunlarla
            matematik, hafıza, dikkat ve problem çözme becerilerini geliştirin
          </p>
          <Link to="/download" style={styles.heroButton}>
            <span style={styles.buttonText}>Hemen İndir</span>
            <div style={styles.buttonGlow}></div>
          </Link>
        </div>
        
        {/* Animated background elements */}
        <div style={styles.heroBackground}>
          <div style={{
            ...styles.floatingElement,
            ...styles.floatingElement1,
            transform: `translateY(${scrollY * -0.3}px) rotate(${scrollY * 0.1}deg)`
          }}>🚀</div>
          <div style={{
            ...styles.floatingElement,
            ...styles.floatingElement2,
            transform: `translateY(${scrollY * -0.2}px) rotate(${scrollY * -0.05}deg)`
          }}>⭐</div>
          <div style={{
            ...styles.floatingElement,
            ...styles.floatingElement3,
            transform: `translateY(${scrollY * -0.4}px) rotate(${scrollY * 0.08}deg)`
          }}>�</div>
        </div>
      </section>

      {/* Features Section with Staggered Animation */}
      <section id="features" style={styles.features}>
        <div style={styles.container}>
          <h2 style={{
            ...styles.sectionTitle,
            opacity: visibleSections.has('features') ? 1 : 0,
            transform: visibleSections.has('features') ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
          }}>
            Neden <span style={styles.titleGradient}>Küçük Kaşif?</span>
          </h2>
          <div style={styles.featureGrid}>
            {[
              { icon: '🎮', title: 'Eğlenceli Oyunlar', text: 'Matematik, hafıza, dikkat ve problem çözme oyunları ile eğlenirken öğrenin' },
              { icon: '👶', title: 'Yaşa Uygun İçerik', text: '5-7, 8-10, 11-13 ve 14+ yaş gruplarına özel olarak tasarlanmış zorluk seviyeleri' },
              { icon: '🏆', title: 'İlerleme Takibi', text: 'Çocuğunuzun gelişimini takip edin, başarılarını kutlayın' },
              { icon: '🎨', title: 'Renkli ve Güvenli', text: 'Çocuklar için tasarlanmış renkli arayüz, reklamlar yok, tamamen güvenli' }
            ].map((feature, index) => (
              <div key={index} style={{
                ...styles.featureCard,
                opacity: visibleSections.has('features') ? 1 : 0,
                transform: visibleSections.has('features') ? 'translateY(0)' : 'translateY(50px)',
                transition: `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`
              }}>
                <div style={styles.featureIconWrapper}>
                  <div style={{
                    ...styles.featureIcon,
                    transform: visibleSections.has('features') ? 'scale(1)' : 'scale(0.8)',
                    transition: `transform 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1 + 0.3}s`
                  }}>
                    {feature.icon}
                  </div>
                </div>
                <h3 style={styles.featureTitle}>{feature.title}</h3>
                <p style={styles.featureText}>{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Games Section with Card Animations */}
      <section id="games" style={styles.games}>
        <div style={styles.container}>
          <h2 style={{
            ...styles.sectionTitle,
            opacity: visibleSections.has('games') ? 1 : 0,
            transform: visibleSections.has('games') ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
          }}>
            Oyun <span style={styles.titleGradient}>Kategorileri</span>
          </h2>
          <div style={styles.gamesGrid}>
            {[
              { icon: '🔢', title: 'Matematik Oyunları', text: 'Toplama, çıkarma, çarpma ve bölme işlemlerini eğlenceli oyunlarla öğrenin. Sayı kavramları, problem çözme ve hızlı hesaplama becerilerini geliştirin.' },
              { icon: '🧠', title: 'Hafıza Oyunları', text: 'Kısa süreli ve uzun süreli hafızayı güçlendiren oyunlar. Görsel ve işitsel hafıza egzersizleri ile dikkat süresini artırın.' },
              { icon: '🎯', title: 'Dikkat Oyunları', text: 'Konsantrasyon ve odaklanma becerilerini geliştiren aktiviteler. Görsel algı, ayrıntılara dikkat ve hızlı karar verme yeteneklerini pekiştirin.' },
              { icon: '🧩', title: 'Problem Çözme', text: 'Mantıksal düşünme ve analitik zeka geliştiren bulmacalar. Strateji oluşturma, örüntü tanıma ve yaratıcı çözümler bulma becerilerini güçlendirin.' }
            ].map((game, index) => (
              <div key={index} style={{
                ...styles.gameCard,
                opacity: visibleSections.has('games') ? 1 : 0,
                transform: visibleSections.has('games') ? 'translateY(0)' : 'translateY(50px)',
                transition: `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.15}s`
              }}>
                <div style={styles.gameIconWrapper}>
                  <div style={styles.gameIcon}>{game.icon}</div>
                </div>
                <h3 style={styles.gameTitle}>{game.title}</h3>
                <p style={styles.gameText}>{game.text}</p>
                <div style={styles.gameCardGlow}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" style={styles.cta}>
        <div style={styles.container}>
          <h2 style={{
            ...styles.ctaTitle,
            opacity: visibleSections.has('cta') ? 1 : 0,
            transform: visibleSections.has('cta') ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
          }}>
            Hazır <span style={styles.ctaTitleGradient}>mısınız?</span>
          </h2>
          <p style={{
            ...styles.ctaText,
            opacity: visibleSections.has('cta') ? 1 : 0,
            transform: visibleSections.has('cta') ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s'
          }}>
            Çocuğunuzun eğlenerek öğrenmesi için hemen Küçük Kaşif'i indirin
          </p>
          <Link to="/download" style={{
            ...styles.ctaButton,
            opacity: visibleSections.has('cta') ? 1 : 0,
            transform: visibleSections.has('cta') ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.4s'
          }}>
            <span style={styles.buttonText}>Ücretsiz İndir</span>
            <div style={styles.buttonGlow}></div>
          </Link>
        </div>
      </section>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    overflowX: 'hidden',
  },
  hero: {
    background: `linear-gradient(135deg, ${Colors.spacePurple} 0%, ${Colors.darkPurple} 70%, ${Colors.lightPurple} 100%)`,
    color: Colors.pureWhite,
    padding: '8rem 2rem 6rem',
    textAlign: 'center',
    position: 'relative',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroContent: {
    maxWidth: '900px',
    margin: '0 auto',
    position: 'relative',
    zIndex: 2,
  },
  heroTitle: {
    fontSize: '4rem',
    fontWeight: '800',
    marginBottom: '1.5rem',
    lineHeight: '1.1',
    letterSpacing: '-0.02em',
  },
  heroTitleGradient: {
    background: `linear-gradient(45deg, ${Colors.brightYellow}, ${Colors.energyOrange})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  heroSubtitle: {
    fontSize: '1.5rem',
    lineHeight: '1.6',
    marginBottom: '3rem',
    opacity: 0.9,
    fontWeight: '300',
    maxWidth: '700px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  heroButton: {
    display: 'inline-block',
    backgroundColor: Colors.energyOrange,
    color: Colors.pureWhite,
    padding: '1.25rem 3rem',
    borderRadius: '50px',
    textDecoration: 'none',
    fontSize: '1.2rem',
    fontWeight: '600',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 8px 25px rgba(245, 126, 55, 0.4)',
    border: 'none',
    cursor: 'pointer',
  },
  buttonText: {
    position: 'relative',
    zIndex: 2,
  },
  buttonGlow: {
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)`,
    transition: 'left 0.6s ease',
  },
  heroBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
  },
  floatingElement: {
    position: 'absolute',
    fontSize: '2rem',
    opacity: 0.3,
    filter: 'blur(1px)',
  },
  floatingElement1: {
    top: '20%',
    left: '10%',
  },
  floatingElement2: {
    top: '60%',
    right: '15%',
  },
  floatingElement3: {
    bottom: '30%',
    left: '80%',
  },
  features: {
    padding: '8rem 2rem',
    backgroundColor: Colors.pureWhite,
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  sectionTitle: {
    fontSize: '3.5rem',
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: '4rem',
    letterSpacing: '-0.02em',
    color: Colors.spacePurple,
  },
  titleGradient: {
    background: `linear-gradient(45deg, ${Colors.energyOrange}, ${Colors.warmPink})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2.5rem',
  },
  featureCard: {
    textAlign: 'center',
    padding: '3rem 2rem',
    borderRadius: '24px',
    backgroundColor: '#f8f9fa',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    border: '1px solid rgba(0,0,0,0.05)',
  },
  featureIconWrapper: {
    marginBottom: '1.5rem',
  },
  featureIcon: {
    fontSize: '3.5rem',
    display: 'inline-block',
    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  featureTitle: {
    fontSize: '1.75rem',
    fontWeight: '700',
    marginBottom: '1rem',
    color: Colors.spacePurple,
  },
  featureText: {
    fontSize: '1.1rem',
    lineHeight: '1.7',
    color: '#666',
    fontWeight: '400',
  },
  games: {
    padding: '8rem 2rem',
    backgroundColor: '#fafafa',
  },
  gamesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '2.5rem',
  },
  gameCard: {
    backgroundColor: Colors.pureWhite,
    padding: '2.5rem',
    borderRadius: '24px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    border: '1px solid rgba(0,0,0,0.05)',
  },
  gameIconWrapper: {
    marginBottom: '1.5rem',
  },
  gameIcon: {
    fontSize: '3rem',
    marginBottom: '0.5rem',
  },
  gameTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    marginBottom: '1rem',
    color: Colors.spacePurple,
  },
  gameText: {
    fontSize: '1rem',
    lineHeight: '1.7',
    color: '#666',
  },
  gameCardGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(135deg, transparent, rgba(65, 49, 122, 0.05), transparent)`,
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  cta: {
    background: `linear-gradient(135deg, ${Colors.energyOrange} 0%, ${Colors.warmPink} 100%)`,
    color: Colors.pureWhite,
    padding: '8rem 2rem',
    textAlign: 'center',
  },
  ctaTitle: {
    fontSize: '3.5rem',
    fontWeight: '800',
    marginBottom: '1.5rem',
    letterSpacing: '-0.02em',
  },
  ctaTitleGradient: {
    background: `linear-gradient(45deg, ${Colors.brightYellow}, ${Colors.pureWhite})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  ctaText: {
    fontSize: '1.5rem',
    marginBottom: '3rem',
    opacity: 0.95,
    fontWeight: '300',
    maxWidth: '600px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  ctaButton: {
    display: 'inline-block',
    backgroundColor: Colors.pureWhite,
    color: Colors.energyOrange,
    padding: '1.25rem 3rem',
    borderRadius: '50px',
    textDecoration: 'none',
    fontSize: '1.2rem',
    fontWeight: '600',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
    border: 'none',
    cursor: 'pointer',
  },
};

// Add hover effects via CSS-in-JS
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .heroButton:hover .buttonGlow {
    left: 100%;
  }
  
  .featureCard:hover {
    transform: translateY(-8px) !important;
    box-shadow: 0 12px 40px rgba(0,0,0,0.15) !important;
  }
  
  .featureCard:hover .featureIcon {
    transform: scale(1.1) !important;
  }
  
  .gameCard:hover {
    transform: translateY(-12px) !important;
    box-shadow: 0 16px 50px rgba(0,0,0,0.15) !important;
  }
  
  .gameCard:hover .gameCardGlow {
    opacity: 1 !important;
  }
  
  .heroButton:hover, .ctaButton:hover {
    transform: translateY(-4px) !important;
    box-shadow: 0 12px 35px rgba(245, 126, 55, 0.6) !important;
  }
  
  .ctaButton:hover {
    box-shadow: 0 12px 35px rgba(0,0,0,0.3) !important;
  }
`;
document.head.appendChild(styleSheet);