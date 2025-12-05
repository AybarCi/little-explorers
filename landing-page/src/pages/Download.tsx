import { Colors } from '../constants/colors';
import { useState, useEffect } from 'react';

export default function Download() {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // Check which sections are visible
      const sections = ['hero', 'download', 'steps', 'faq'];
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

  // Add hover effect styles
  useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      .download-card:hover {
        transform: translateY(-8px) !important;
        box-shadow: 0 16px 48px rgba(0,0,0,0.12) !important;
      }
      .download-button:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 8px 24px rgba(245, 126, 55, 0.4) !important;
      }
      .step-card:hover {
        transform: translateY(-4px) !important;
        box-shadow: 0 8px 32px rgba(0,0,0,0.1) !important;
      }
      .faq-item:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 4px 16px rgba(0,0,0,0.08) !important;
      }
    `;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  return (
    <div style={styles.page}>
      <section id="hero" style={{
        ...styles.hero,
        transform: `translateY(${scrollY * 0.5}px)`,
        opacity: visibleSections.has('hero') ? 1 : 0,
        transition: 'opacity 0.8s ease-out, transform 0.8s ease-out'
      }}>
        <div style={styles.container}>
          <h1 style={{
            ...styles.title,
            transform: visibleSections.has('hero') ? 'translateY(0)' : 'translateY(30px)',
            opacity: visibleSections.has('hero') ? 1 : 0,
            transition: 'transform 0.8s ease-out 0.2s, opacity 0.8s ease-out 0.2s'
          }}>Küçük Kaşifi'i İndir</h1>
          <p style={{
            ...styles.subtitle,
            transform: visibleSections.has('hero') ? 'translateY(0)' : 'translateY(30px)',
            opacity: visibleSections.has('hero') ? 1 : 0,
            transition: 'transform 0.8s ease-out 0.4s, opacity 0.8s ease-out 0.4s'
          }}>
            iOS ve Android cihazlarınızda ücretsiz olarak kullanın
          </p>
        </div>
      </section>

      <section id="download" style={styles.content}>
        <div style={styles.container}>
          <div style={styles.downloadGrid}>
            <div className="download-card" style={{
              ...styles.downloadCard,
              transform: visibleSections.has('download') ? 'translateY(0)' : 'translateY(50px)',
              opacity: visibleSections.has('download') ? 1 : 0,
              transition: 'transform 0.8s ease-out 0.2s, opacity 0.8s ease-out 0.2s'
            }}>
              <div style={{
                ...styles.icon,
                transform: visibleSections.has('download') ? 'scale(1)' : 'scale(0.8)',
                opacity: visibleSections.has('download') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.4s, opacity 0.6s ease-out 0.4s'
              }}>📱</div>
              <h3 style={{
                ...styles.cardTitle,
                transform: visibleSections.has('download') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('download') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.5s, opacity 0.6s ease-out 0.5s'
              }}>App Store</h3>
              <p style={{
                ...styles.cardText,
                transform: visibleSections.has('download') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('download') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.6s, opacity 0.6s ease-out 0.6s'
              }}>
                iPhone ve iPad cihazlarınız için App Store'dan indirin
              </p>
              <button className="download-button" style={{
                ...styles.downloadButton,
                transform: visibleSections.has('download') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('download') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.7s, opacity 0.6s ease-out 0.7s'
              }}>
                App Store'dan İndir
              </button>
              <p style={styles.requirements}>iOS 13.0 ve üzeri gerektirir</p>
            </div>

            <div className="download-card" style={{
              ...styles.downloadCard,
              transform: visibleSections.has('download') ? 'translateY(0)' : 'translateY(50px)',
              opacity: visibleSections.has('download') ? 1 : 0,
              transition: 'transform 0.8s ease-out 0.4s, opacity 0.8s ease-out 0.4s'
            }}>
              <div style={{
                ...styles.icon,
                transform: visibleSections.has('download') ? 'scale(1)' : 'scale(0.8)',
                opacity: visibleSections.has('download') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.5s, opacity 0.6s ease-out 0.5s'
              }}>🤖</div>
              <h3 style={{
                ...styles.cardTitle,
                transform: visibleSections.has('download') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('download') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.6s, opacity 0.6s ease-out 0.6s'
              }}>Google Play</h3>
              <p style={{
                ...styles.cardText,
                transform: visibleSections.has('download') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('download') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.7s, opacity 0.6s ease-out 0.7s'
              }}>
                Android cihazlarınız için Google Play'den indirin
              </p>
              <button className="download-button" style={{
                ...styles.downloadButton,
                transform: visibleSections.has('download') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('download') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.8s, opacity 0.6s ease-out 0.8s'
              }}>
                Google Play'den İndir
              </button>
              <p style={styles.requirements}>Android 8.0 ve üzeri gerektirir</p>
            </div>
          </div>

          <div id="steps" style={styles.infoSection}>
            <h2 style={{
              ...styles.infoTitle,
              transform: visibleSections.has('steps') ? 'translateY(0)' : 'translateY(30px)',
              opacity: visibleSections.has('steps') ? 1 : 0,
              transition: 'transform 0.8s ease-out, opacity 0.8s ease-out'
            }}>Kurulum Sonrası</h2>
            <div style={styles.stepGrid}>
              <div className="step-card" style={{
                ...styles.step,
                transform: visibleSections.has('steps') ? 'translateY(0)' : 'translateY(40px)',
                opacity: visibleSections.has('steps') ? 1 : 0,
                transition: 'transform 0.8s ease-out 0.2s, opacity 0.8s ease-out 0.2s'
              }}>
                <div style={{
                  ...styles.stepNumber,
                  transform: visibleSections.has('steps') ? 'scale(1)' : 'scale(0.8)',
                  opacity: visibleSections.has('steps') ? 1 : 0,
                  transition: 'transform 0.6s ease-out 0.4s, opacity 0.6s ease-out 0.4s'
                }}>1</div>
                <h4 style={{
                  ...styles.stepTitle,
                  transform: visibleSections.has('steps') ? 'translateY(0)' : 'translateY(20px)',
                  opacity: visibleSections.has('steps') ? 1 : 0,
                  transition: 'transform 0.6s ease-out 0.5s, opacity 0.6s ease-out 0.5s'
                }}>Hesap Oluşturun</h4>
                <p style={{
                  ...styles.stepText,
                  transform: visibleSections.has('steps') ? 'translateY(0)' : 'translateY(20px)',
                  opacity: visibleSections.has('steps') ? 1 : 0,
                  transition: 'transform 0.6s ease-out 0.6s, opacity 0.6s ease-out 0.6s'
                }}>
                  Uygulamayı açın ve çocuğunuz için bir hesap oluşturun.
                  Yaş grubunu seçerek oyunların zorluğunu belirleyin.
                </p>
              </div>
              <div className="step-card" style={{
                ...styles.step,
                transform: visibleSections.has('steps') ? 'translateY(0)' : 'translateY(40px)',
                opacity: visibleSections.has('steps') ? 1 : 0,
                transition: 'transform 0.8s ease-out 0.4s, opacity 0.8s ease-out 0.4s'
              }}>
                <div style={{
                  ...styles.stepNumber,
                  transform: visibleSections.has('steps') ? 'scale(1)' : 'scale(0.8)',
                  opacity: visibleSections.has('steps') ? 1 : 0,
                  transition: 'transform 0.6s ease-out 0.5s, opacity 0.6s ease-out 0.5s'
                }}>2</div>
                <h4 style={{
                  ...styles.stepTitle,
                  transform: visibleSections.has('steps') ? 'translateY(0)' : 'translateY(20px)',
                  opacity: visibleSections.has('steps') ? 1 : 0,
                  transition: 'transform 0.6s ease-out 0.6s, opacity 0.6s ease-out 0.6s'
                }}>Oyunları Keşfedin</h4>
                <p style={{
                  ...styles.stepText,
                  transform: visibleSections.has('steps') ? 'translateY(0)' : 'translateY(20px)',
                  opacity: visibleSections.has('steps') ? 1 : 0,
                  transition: 'transform 0.6s ease-out 0.7s, opacity 0.6s ease-out 0.7s'
                }}>
                  Matematik, hafıza, dikkat ve problem çözme kategorilerinden
                  uygun oyunları seçin.
                </p>
              </div>
              <div className="step-card" style={{
                ...styles.step,
                transform: visibleSections.has('steps') ? 'translateY(0)' : 'translateY(40px)',
                opacity: visibleSections.has('steps') ? 1 : 0,
                transition: 'transform 0.8s ease-out 0.6s, opacity 0.8s ease-out 0.6s'
              }}>
                <div style={{
                  ...styles.stepNumber,
                  transform: visibleSections.has('steps') ? 'scale(1)' : 'scale(0.8)',
                  opacity: visibleSections.has('steps') ? 1 : 0,
                  transition: 'transform 0.6s ease-out 0.6s, opacity 0.6s ease-out 0.6s'
                }}>3</div>
                <h4 style={{
                  ...styles.stepTitle,
                  transform: visibleSections.has('steps') ? 'translateY(0)' : 'translateY(20px)',
                  opacity: visibleSections.has('steps') ? 1 : 0,
                  transition: 'transform 0.6s ease-out 0.7s, opacity 0.6s ease-out 0.7s'
                }}>Başarıları Takip Edin</h4>
                <p style={{
                  ...styles.stepText,
                  transform: visibleSections.has('steps') ? 'translateY(0)' : 'translateY(20px)',
                  opacity: visibleSections.has('steps') ? 1 : 0,
                  transition: 'transform 0.6s ease-out 0.8s, opacity 0.6s ease-out 0.8s'
                }}>
                  Çocuğunuzun ilerlemesini profil sayfasından takip edin,
                  başarılarını kutlayın.
                </p>
              </div>
            </div>
          </div>

          <div id="faq" style={styles.faqSection}>
            <h2 style={{
              ...styles.faqTitle,
              transform: visibleSections.has('faq') ? 'translateY(0)' : 'translateY(30px)',
              opacity: visibleSections.has('faq') ? 1 : 0,
              transition: 'transform 0.8s ease-out, opacity 0.8s ease-out'
            }}>Sıkça Sorulan Sorular</h2>
            <div style={styles.faqGrid}>
              <div className="faq-item" style={{
                ...styles.faqItem,
                transform: visibleSections.has('faq') ? 'translateY(0)' : 'translateY(40px)',
                opacity: visibleSections.has('faq') ? 1 : 0,
                transition: 'transform 0.8s ease-out 0.2s, opacity 0.8s ease-out 0.2s'
              }}>
                <h4 style={{
                  ...styles.faqQuestion,
                  transform: visibleSections.has('faq') ? 'translateY(0)' : 'translateY(20px)',
                  opacity: visibleSections.has('faq') ? 1 : 0,
                  transition: 'transform 0.6s ease-out 0.3s, opacity 0.6s ease-out 0.3s'
                }}>Uygulama ücretsiz mi?</h4>
                <p style={{
                  ...styles.faqAnswer,
                  transform: visibleSections.has('faq') ? 'translateY(0)' : 'translateY(20px)',
                  opacity: visibleSections.has('faq') ? 1 : 0,
                  transition: 'transform 0.6s ease-out 0.4s, opacity 0.6s ease-out 0.4s'
                }}>
                  Evet, Küçük Kaşif tamamen ücretsizdir. Hiçbir ücret veya
                  gizli maliyet yoktur.
                </p>
              </div>
              <div className="faq-item" style={{
                ...styles.faqItem,
                transform: visibleSections.has('faq') ? 'translateY(0)' : 'translateY(40px)',
                opacity: visibleSections.has('faq') ? 1 : 0,
                transition: 'transform 0.8s ease-out 0.4s, opacity 0.8s ease-out 0.4s'
              }}>
                <h4 style={{
                  ...styles.faqQuestion,
                  transform: visibleSections.has('faq') ? 'translateY(0)' : 'translateY(20px)',
                  opacity: visibleSections.has('faq') ? 1 : 0,
                  transition: 'transform 0.6s ease-out 0.5s, opacity 0.6s ease-out 0.5s'
                }}>İnternet bağlantısı gerekli mi?</h4>
                <p style={{
                  ...styles.faqAnswer,
                  transform: visibleSections.has('faq') ? 'translateY(0)' : 'translateY(20px)',
                  opacity: visibleSections.has('faq') ? 1 : 0,
                  transition: 'transform 0.6s ease-out 0.6s, opacity 0.6s ease-out 0.6s'
                }}>
                  İlk giriş ve veri senkronizasyonu için internet gereklidir.
                  Bazı oyunlar çevrimdışı oynanabilir.
                </p>
              </div>
              <div className="faq-item" style={{
                ...styles.faqItem,
                transform: visibleSections.has('faq') ? 'translateY(0)' : 'translateY(40px)',
                opacity: visibleSections.has('faq') ? 1 : 0,
                transition: 'transform 0.8s ease-out 0.6s, opacity 0.8s ease-out 0.6s'
              }}>
                <h4 style={{
                  ...styles.faqQuestion,
                  transform: visibleSections.has('faq') ? 'translateY(0)' : 'translateY(20px)',
                  opacity: visibleSections.has('faq') ? 1 : 0,
                  transition: 'transform 0.6s ease-out 0.7s, opacity 0.6s ease-out 0.7s'
                }}>Hangi yaş gruplarına uygun?</h4>
                <p style={{
                  ...styles.faqAnswer,
                  transform: visibleSections.has('faq') ? 'translateY(0)' : 'translateY(20px)',
                  opacity: visibleSections.has('faq') ? 1 : 0,
                  transition: 'transform 0.6s ease-out 0.8s, opacity 0.6s ease-out 0.8s'
                }}>
                  5-14 yaş arası çocuklar için tasarlanmıştır. Oyunlar yaş
                  grubuna göre otomatik olarak ayarlanır.
                </p>
              </div>
              <div className="faq-item" style={{
                ...styles.faqItem,
                transform: visibleSections.has('faq') ? 'translateY(0)' : 'translateY(40px)',
                opacity: visibleSections.has('faq') ? 1 : 0,
                transition: 'transform 0.8s ease-out 0.8s, opacity 0.8s ease-out 0.8s'
              }}>
                <h4 style={{
                  ...styles.faqQuestion,
                  transform: visibleSections.has('faq') ? 'translateY(0)' : 'translateY(20px)',
                  opacity: visibleSections.has('faq') ? 1 : 0,
                  transition: 'transform 0.6s ease-out 0.9s, opacity 0.6s ease-out 0.9s'
                }}>Reklam var mı?</h4>
                <p style={{
                  ...styles.faqAnswer,
                  transform: visibleSections.has('faq') ? 'translateY(0)' : 'translateY(20px)',
                  opacity: visibleSections.has('faq') ? 1 : 0,
                  transition: 'transform 0.6s ease-out 1s, opacity 0.6s ease-out 1s'
                }}>
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
    backgroundColor: '#fafafa',
  },
  hero: {
    background: `linear-gradient(135deg, ${Colors.spacePurple} 0%, ${Colors.darkPurple} 100%)`,
    color: Colors.pureWhite,
    padding: '6rem 2rem',
    textAlign: 'center',
    position: 'relative' as const,
    overflow: 'hidden',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem',
  },
  title: {
    fontSize: '3.5rem',
    fontWeight: '700',
    marginBottom: '1.5rem',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    fontSize: '1.375rem',
    opacity: 0.9,
    fontWeight: '400',
  },
  content: {
    padding: '6rem 0',
  },
  downloadGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '3rem',
    marginBottom: '6rem',
  },
  downloadCard: {
    backgroundColor: Colors.pureWhite,
    padding: '3.5rem 2.5rem',
    borderRadius: '24px',
    textAlign: 'center',
    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
    transition: 'transform 0.4s ease-out, box-shadow 0.4s ease-out',
    willChange: 'transform',
  },
  icon: {
    fontSize: '4.5rem',
    marginBottom: '2rem',
    display: 'block',
  },
  cardTitle: {
    fontSize: '2rem',
    fontWeight: '600',
    color: Colors.spacePurple,
    marginBottom: '1.25rem',
    letterSpacing: '-0.01em',
  },
  cardText: {
    fontSize: '1.125rem',
    color: '#666',
    marginBottom: '2.5rem',
    lineHeight: '1.7',
  },
  downloadButton: {
    backgroundColor: Colors.energyOrange,
    color: Colors.pureWhite,
    padding: '1.125rem 2.5rem',
    borderRadius: '50px',
    border: 'none',
    fontSize: '1.0625rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease-out',
    width: '100%',
    maxWidth: '320px',
    boxShadow: '0 4px 16px rgba(245, 126, 55, 0.3)',
    willChange: 'transform',
  },
  requirements: {
    fontSize: '0.9375rem',
    color: '#999',
    marginTop: '1.25rem',
  },
  infoSection: {
    marginBottom: '6rem',
  },
  infoTitle: {
    fontSize: '2.5rem',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: '4rem',
    color: Colors.spacePurple,
    letterSpacing: '-0.02em',
  },
  stepGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2.5rem',
  },
  step: {
    backgroundColor: Colors.pureWhite,
    padding: '2.5rem',
    borderRadius: '20px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
    transition: 'transform 0.3s ease-out',
    willChange: 'transform',
  },
  stepNumber: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: Colors.energyOrange,
    color: Colors.pureWhite,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.75rem',
    fontWeight: '600',
    marginBottom: '1.5rem',
    boxShadow: '0 4px 16px rgba(245, 126, 55, 0.3)',
  },
  stepTitle: {
    fontSize: '1.375rem',
    fontWeight: '600',
    color: Colors.spacePurple,
    marginBottom: '1rem',
    letterSpacing: '-0.01em',
  },
  stepText: {
    fontSize: '1.0625rem',
    color: '#666',
    lineHeight: '1.7',
  },
  faqSection: {
    backgroundColor: Colors.pureWhite,
    padding: '4rem',
    borderRadius: '24px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
  },
  faqTitle: {
    fontSize: '2.5rem',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: '3rem',
    color: Colors.spacePurple,
    letterSpacing: '-0.02em',
  },
  faqGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '2.5rem',
  },
  faqItem: {
    padding: '2rem',
    borderLeft: `4px solid ${Colors.brightYellow}`,
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    transition: 'transform 0.3s ease-out',
    willChange: 'transform',
  },
  faqQuestion: {
    fontSize: '1.1875rem',
    fontWeight: '600',
    color: Colors.spacePurple,
    marginBottom: '1rem',
    letterSpacing: '-0.01em',
  },
  faqAnswer: {
    fontSize: '1.0625rem',
    color: '#666',
    lineHeight: '1.7',
  },
};
