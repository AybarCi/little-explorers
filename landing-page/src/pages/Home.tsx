import { Link } from 'react-router-dom';
import { Colors } from '../constants/colors';
import { useEffect, useState } from 'react';
import logo from '../assets/logo.png';
import { FaGamepad, FaUserGraduate, FaTrophy, FaPalette, FaCalculator, FaBrain, FaBullseye, FaPuzzlePiece, FaRocket, FaStar, FaHeart } from 'react-icons/fa';

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
      {/* Hero Section with Soft Animations */}
      <section id="hero" style={{
          ...styles.hero,
          transform: `translateY(${scrollY * 0.5}px)`,
          background: `linear-gradient(135deg, ${Colors.navyBlue} 0%, ${Colors.deepBlue} 30%, ${Colors.spacePurple} 70%, ${Colors.darkPurple} 100%)`,
          position: 'relative'
        }}>
        <div style={{
          ...styles.heroContent,
          opacity: visibleSections.has('hero') ? 1 : 0,
          transform: visibleSections.has('hero') ? 'translateY(0)' : 'translateY(50px)',
          transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
          <div style={styles.logoContainer}>
            <img src={logo} alt="Küçük Kaşif Logo" style={styles.heroLogo} />
          </div>
          <h1 style={{
            ...styles.heroTitle,
            color: Colors.pureWhite,
            fontWeight: '800',
            textShadow: '2px 2px 8px rgba(0,0,0,0.7)',
            letterSpacing: '-0.5px'
          }}>
            <span style={{
              display: 'block',
              color: Colors.brightYellow,
              marginBottom: '0.5rem',
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
            }}>🌟 Uzayın Derinliklerinde 🌟</span>
            <span style={{
              display: 'block',
              color: Colors.brightYellow,
              fontSize: '1.2em',
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
            }}>🚀 Keşif Zamanı! 🚀</span>
          </h1>
          <p style={{
            ...styles.heroSubtitle,
            opacity: visibleSections.has('hero') ? 1 : 0,
            transform: visibleSections.has('hero') ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s',
            color: Colors.pureWhite,
            textShadow: '1px 1px 4px rgba(0,0,0,0.6)',
            fontWeight: '400'
          }}>
            Çocuklar için özel olarak tasarlanmış eğitici ve eğlenceli oyunlarla
            matematik, hafıza, dikkat ve problem çözme becerilerini geliştirin
          </p>
          <Link to="/download" style={{
            ...styles.heroButton,
            opacity: visibleSections.has('hero') ? 1 : 0,
            transform: visibleSections.has('hero') ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.4s',
            backgroundColor: Colors.brightYellow,
            color: Colors.darkPurple,
            boxShadow: '0 8px 25px rgba(243, 156, 18, 0.5)',
            border: '2px solid rgba(255, 255, 255, 0.2)'
          }}>
            <span style={{...styles.buttonText, color: Colors.darkPurple}}>🎮 Hemen Oyna!</span>
            <div style={styles.buttonGlow}></div>
          </Link>
        </div>
        
        {/* Subtle animated background elements */}
        <div style={styles.heroBackground}>
          <div style={{
            ...styles.floatingElement,
            ...styles.floatingElement1,
            transform: `translateY(${scrollY * -0.3}px) rotate(${scrollY * 0.1}deg)`,
            animation: 'float 8s infinite ease-in-out'
          }}><FaRocket style={{...styles.floatingIcon, color: Colors.brightYellow, opacity: 0.6}} /></div>
          <div style={{
            ...styles.floatingElement,
            ...styles.floatingElement2,
            transform: `translateY(${scrollY * -0.2}px) rotate(${scrollY * -0.05}deg)`,
            animation: 'twinkle 6s infinite ease-in-out'
          }}><FaStar style={{...styles.floatingIcon, color: Colors.brightYellow, opacity: 0.5}} /></div>
          <div style={{
            ...styles.floatingElement,
            ...styles.floatingElement3,
            transform: `translateY(${scrollY * -0.4}px) rotate(${scrollY * 0.08}deg)`,
            animation: 'float 7s infinite ease-in-out'
          }}><FaHeart style={{...styles.floatingIcon, color: Colors.brightYellow, opacity: 0.5}} /></div>
        </div>
      </section>

      {/* Curved Separator */}
      <div style={{
        position: 'relative',
        height: '100px',
        marginTop: '-100px',
        zIndex: 3,
        background: 'transparent'
      }}>
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{
          width: '100%',
          height: '100px',
          transform: 'rotate(180deg)'
        }}>
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
                opacity={0.25} 
                fill={Colors.pureWhite}/>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
                opacity={0.5} 
                fill={Colors.pureWhite}/>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 
                fill={Colors.pureWhite}/>
        </svg>
      </div>

      {/* Features Section with Staggered Animation */}
      <section id="features" style={styles.features}>
        <div style={styles.container}>
          <h2 style={{
            ...styles.sectionTitle,
            opacity: visibleSections.has('features') ? 1 : 0,
            transform: visibleSections.has('features') ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
          }}>
            Neden <span style={{
              ...styles.titleGradient,
              background: `linear-gradient(45deg, ${Colors.brightYellow}, ${Colors.energyOrange}, ${Colors.spacePurple}, ${Colors.skyBlue})`,
              backgroundSize: '200% 200%',
              animation: 'gradientShift 4s ease infinite',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: '800'
            }}>🌈 Küçük Kaşif? 🌈</span>
          </h2>
          <div style={styles.featureGrid}>
            {[
              { icon: <FaGamepad />, title: 'Eğlenceli Oyunlar', text: 'Matematik, hafıza, dikkat ve problem çözme oyunları ile eğlenirken öğrenin' },
              { icon: <FaUserGraduate />, title: 'Yaşa Uygun İçerik', text: '5-7, 8-10, 11-13 ve 14+ yaş gruplarına özel olarak tasarlanmış zorluk seviyeleri' },
              { icon: <FaTrophy />, title: 'İlerleme Takibi', text: 'Çocuğunuzun gelişimini takip edin, başarılarını kutlayın' },
              { icon: <FaPalette />, title: 'Renkli ve Güvenli', text: 'Çocuklar için tasarlanmış renkli arayüz, reklamlar yok, tamamen güvenli' }
            ].map((feature, index) => {
              const darkColors = [Colors.deepBlue, Colors.deepGreen, Colors.deepOrange, Colors.deepRed];
              const cardColor = darkColors[index % darkColors.length];
              
              return (
                <div key={index} style={{
                  ...styles.featureCard,
                  opacity: visibleSections.has('features') ? 1 : 0,
                  transform: visibleSections.has('features') ? 'translateY(0)' : 'translateY(50px)',
                  transition: `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`,
                  background: `linear-gradient(135deg, ${cardColor}30, ${cardColor}15)`,
                  border: `2px solid ${cardColor}60`,
                  boxShadow: `0 12px 35px ${cardColor}25`,
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-50%',
                    left: '-50%',
                    width: '200%',
                    height: '200%',
                    background: `linear-gradient(45deg, transparent, ${cardColor}08, transparent)`,
                    animation: 'spin 12s infinite linear',
                    opacity: 0.2
                  }} />
                  <div style={styles.featureIconWrapper}>
                    <div style={{
                      ...styles.featureIcon,
                      transform: visibleSections.has('features') ? 'scale(1)' : 'scale(0.8)',
                      transition: `transform 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1 + 0.3}s`,
                      color: cardColor,
                      fontSize: '3rem',
                      animation: 'bounce 3s infinite ease-in-out',
                      animationDelay: `${index * 0.5}s`
                    }}>
                      {feature.icon}
                    </div>
                  </div>
                  <h3 style={{
                    ...styles.featureTitle,
                    color: Colors.darkPurple,
                    fontWeight: '700',
                    textShadow: '1px 1px 2px rgba(255,255,255,0.8)'
                  }}>{feature.title}</h3>
                  <p style={styles.featureText}>{feature.text}</p>
                </div>
              );
            })}
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
            Oyun <span style={{
              ...styles.titleGradient,
              background: `linear-gradient(45deg, ${Colors.brightYellow}, ${Colors.energyOrange}, ${Colors.explorerGreen}, ${Colors.skyBlue})`,
              backgroundSize: '200% 200%',
              animation: 'gradientShift 4s ease infinite',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: '800'
            }}>🎮 Kategorileri 🎯</span>
          </h2>
          <div style={styles.gamesGrid}>
            {[
              { icon: <FaCalculator />, title: 'Matematik Oyunları', text: 'Toplama, çıkarma, çarpma ve bölme işlemlerini eğlenceli oyunlarla öğrenin. Sayı kavramları, problem çözme ve hızlı hesaplama becerilerini geliştirin.' },
              { icon: <FaBrain />, title: 'Hafıza Oyunları', text: 'Kısa süreli ve uzun süreli hafızayı güçlendiren oyunlar. Görsel ve işitsel hafıza egzersizleri ile dikkat süresini artırın.' },
              { icon: <FaBullseye />, title: 'Dikkat Oyunları', text: 'Konsantrasyon ve odaklanma becerilerini geliştiren aktiviteler. Görsel algı, ayrıntılara dikkat ve hızlı karar verme yeteneklerini pekiştirin.' },
              { icon: <FaPuzzlePiece />, title: 'Problem Çözme', text: 'Mantıksal düşünme ve analitik zeka geliştiren bulmacalar. Strateji oluşturma, örüntü tanıma ve yaratıcı çözümler bulma becerilerini güçlendirin.' }
            ].map((game, index) => {
              const darkGameColors = [Colors.skyBlue, Colors.explorerGreen, Colors.energyOrange, Colors.warmPink];
              const cardColor = darkGameColors[index % darkGameColors.length];
              
              return (
                <div key={index} style={{
                  ...styles.gameCard,
                  opacity: visibleSections.has('games') ? 1 : 0,
                  transform: visibleSections.has('games') ? 'translateY(0)' : 'translateY(50px)',
                  transition: `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.15}s`,
                  background: `linear-gradient(135deg, ${cardColor}35, ${cardColor}20)`,
                  border: `2px solid ${cardColor}70`,
                  boxShadow: `0 15px 40px ${cardColor}30`,
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `linear-gradient(45deg, ${cardColor}12, transparent, ${cardColor}12)`,
                    animation: 'spin 15s infinite linear',
                    opacity: 0.15
                  }} />
                  <div style={styles.gameIconWrapper}>
                    <div style={{
                      ...styles.gameIcon,
                      color: cardColor,
                      fontSize: '3.5rem',
                      animation: 'bounce 3.5s infinite ease-in-out',
                      animationDelay: `${index * 0.3}s`
                    }}>{game.icon}</div>
                  </div>
                  <h3 style={{
                    ...styles.gameTitle,
                    color: Colors.darkPurple,
                    fontWeight: '700',
                    textShadow: '1px 1px 2px rgba(255,255,255,0.8)'
                  }}>{game.title}</h3>
                  <p style={styles.gameText}>{game.text}</p>
                  <div style={{
                    ...styles.gameCardGlow,
                    background: `linear-gradient(135deg, ${cardColor}20, transparent)`
                  }} />
                </div>
              );
            })}
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
    background: `linear-gradient(135deg, ${Colors.navyBlue} 0%, ${Colors.deepBlue} 30%, ${Colors.spacePurple} 70%, ${Colors.darkPurple} 100%)`,
    color: Colors.pureWhite,
    padding: '4rem 2rem 4rem',
    textAlign: 'center',
    position: 'relative',
    minHeight: '90vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '-20px', // Remove white gap
  },
  heroContent: {
    maxWidth: '900px',
    margin: '0 auto',
    position: 'relative',
    zIndex: 2,
  },
  logoContainer: {
    marginBottom: '2rem',
    textAlign: 'center',
  },
  heroLogo: {
    width: '180px',
    height: '180px',
    objectFit: 'contain',
    filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))',
    transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  heroTitle: {
    fontSize: '3.5rem',
    fontWeight: '700',
    marginBottom: '1.5rem',
    lineHeight: '1.2',
    letterSpacing: '-0.01em',
    color: Colors.pureWhite,
  },
  heroTitleGradient: {
    color: Colors.brightYellow,
    fontWeight: '800',
  },
  heroSubtitle: {
    fontSize: '1.3rem',
    lineHeight: '1.6',
    marginBottom: '3rem',
    opacity: 0.95,
    fontWeight: '400',
    maxWidth: '700px',
    marginLeft: 'auto',
    marginRight: 'auto',
    color: Colors.pureWhite,
  },
  heroButton: {
    display: 'inline-block',
    backgroundColor: Colors.spacePurple,
    color: Colors.pureWhite,
    padding: '1rem 2.5rem',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '1.1rem',
    fontWeight: '600',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 4px 20px rgba(65, 49, 122, 0.3)',
    border: 'none',
    cursor: 'pointer',
    letterSpacing: '0.5px',
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
  floatingIcon: {
    fontSize: '2rem',
    opacity: 0.3,
    filter: 'blur(1px)',
  },
  features: {
    padding: '6rem 2rem',
    backgroundColor: '#f8f9fa',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  sectionTitle: {
    fontSize: '2.5rem',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: '3rem',
    letterSpacing: '-0.01em',
    color: Colors.spacePurple,
  },
  titleGradient: {
    color: Colors.energyOrange,
    fontWeight: '800',
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2.5rem',
  },
  featureCard: {
    textAlign: 'center',
    padding: '2.5rem 1.5rem',
    borderRadius: '12px',
    backgroundColor: Colors.pureWhite,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    border: '1px solid rgba(65, 49, 122, 0.1)',
    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
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
    color: '#444',
    fontWeight: '500',
  },
  games: {
    padding: '6rem 2rem',
    backgroundColor: Colors.pureWhite,
  },
  gamesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '2.5rem',
  },
  gameCard: {
    backgroundColor: '#f8f9fa',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    border: '1px solid rgba(65, 49, 122, 0.1)',
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
    color: '#444',
    fontWeight: '500',
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
    background: `linear-gradient(135deg, ${Colors.charcoal} 0%, ${Colors.navyBlue} 50%, ${Colors.deepBlue} 100%)`,
    color: Colors.pureWhite,
    padding: '6rem 2rem',
    textAlign: 'center',
  },
  ctaTitle: {
    fontSize: '2.5rem',
    fontWeight: '700',
    marginBottom: '1.5rem',
    letterSpacing: '-0.01em',
    color: Colors.pureWhite,
  },
  ctaTitleGradient: {
    color: Colors.brightYellow,
    fontWeight: '800',
  },
  ctaText: {
    fontSize: '1.2rem',
    marginBottom: '2.5rem',
    opacity: 0.95,
    fontWeight: '400',
    maxWidth: '600px',
    marginLeft: 'auto',
    marginRight: 'auto',
    color: Colors.pureWhite,
  },
  ctaButton: {
    display: 'inline-block',
    backgroundColor: Colors.brightYellow,
    color: Colors.darkPurple,
    padding: '1rem 2.5rem',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '1.1rem',
    fontWeight: '700',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 6px 25px rgba(243, 156, 18, 0.4)',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    cursor: 'pointer',
    letterSpacing: '0.5px',
  },
};

// Add hover effects via CSS-in-JS
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-20px); }
    60% { transform: translateY(-10px); }
  }
  
  @keyframes twinkle {
    0%, 100% { opacity: 0.3; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.2); }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-15px); }
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes rainbow {
    0% { color: #FF4757; }
    17% { color: #FFA502; }
    33% { color: #FFD93D; }
    50% { color: #2ED573; }
    67% { color: #00D4FF; }
    83% { color: #8E44AD; }
    100% { color: #FF4757; }
  }
  
  .heroButton:hover .buttonGlow {
    left: 100%;
  }
  
  .heroLogo:hover {
    transform: scale(1.05) !important;
  }
  
  .featureCard:hover {
    transform: translateY(-4px) !important;
    box-shadow: 0 8px 25px rgba(0,0,0,0.1) !important;
    border-color: rgba(65, 49, 122, 0.2) !important;
  }
  
  .featureCard:hover .featureIcon {
    transform: scale(1.05) !important;
  }
  
  .gameCard:hover {
    transform: translateY(-4px) !important;
    box-shadow: 0 8px 25px rgba(0,0,0,0.1) !important;
    border-color: rgba(65, 49, 122, 0.2) !important;
  }
  
  .gameCard:hover .gameCardGlow {
    opacity: 1 !important;
  }
  
  .heroButton:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 8px 25px rgba(65, 49, 122, 0.4) !important;
  }
  
  .ctaButton:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 8px 30px rgba(243, 156, 18, 0.5) !important;
  }
`;
document.head.appendChild(styleSheet);