import { Colors } from '../constants/colors';
import { useState, useEffect } from 'react';

export default function Privacy() {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // Check which sections are visible
      const sections = ['hero', 'content', 'section2', 'section3', 'section4', 'section5', 'section6', 'section7', 'section8', 'section9', 'section10'];
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
      <section id="hero" style={{
        ...styles.hero,
        transform: `translateY(${scrollY * 0.3}px)`,
        opacity: visibleSections.has('hero') ? 1 : 0,
        transition: 'opacity 0.8s ease-out, transform 0.8s ease-out'
      }}>
        <div style={styles.container}>
          <h1 style={{
            ...styles.title,
            transform: visibleSections.has('hero') ? 'translateY(0)' : 'translateY(30px)',
            opacity: visibleSections.has('hero') ? 1 : 0,
            transition: 'transform 0.8s ease-out 0.2s, opacity 0.8s ease-out 0.2s'
          }}>Gizlilik Politikası</h1>
          <p style={{
            ...styles.subtitle,
            transform: visibleSections.has('hero') ? 'translateY(0)' : 'translateY(30px)',
            opacity: visibleSections.has('hero') ? 1 : 0,
            transition: 'transform 0.8s ease-out 0.4s, opacity 0.8s ease-out 0.4s'
          }}>Son güncelleme: 2 Aralık 2024</p>
        </div>
      </section>

      <section id="content" style={styles.content}>
        <div style={styles.container}>
          <div style={{
            ...styles.contentBox,
            transform: visibleSections.has('content') ? 'translateY(0)' : 'translateY(40px)',
            opacity: visibleSections.has('content') ? 1 : 0,
            transition: 'transform 0.8s ease-out 0.2s, opacity 0.8s ease-out 0.2s'
          }}>
            <section style={{
              ...styles.section,
              transform: visibleSections.has('content') ? 'translateY(0)' : 'translateY(30px)',
              opacity: visibleSections.has('content') ? 1 : 0,
              transition: 'transform 0.6s ease-out 0.4s, opacity 0.6s ease-out 0.4s'
            }}>
              <h2 style={{
                ...styles.sectionTitle,
                transform: visibleSections.has('content') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('content') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.5s, opacity 0.6s ease-out 0.5s'
              }}>1. Giriş</h2>
              <p style={{
                ...styles.text,
                transform: visibleSections.has('content') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('content') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.6s, opacity 0.6s ease-out 0.6s'
              }}>
                Küçük Kaşif olarak, çocukların gizliliğini en üst düzeyde korumayı taahhüt ediyoruz.
                Bu gizlilik politikası, uygulamamızı kullanırken hangi bilgileri topladığımızı,
                nasıl kullandığımızı ve koruduğumuzu açıklamaktadır.
              </p>
            </section>

            <section id="section2" style={{
              ...styles.section,
              transform: visibleSections.has('section2') ? 'translateY(0)' : 'translateY(30px)',
              opacity: visibleSections.has('section2') ? 1 : 0,
              transition: 'transform 0.6s ease-out 0.2s, opacity 0.6s ease-out 0.2s'
            }}>
              <h2 style={{
                ...styles.sectionTitle,
                transform: visibleSections.has('section2') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('section2') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.3s, opacity 0.6s ease-out 0.3s'
              }}>2. Topladığımız Bilgiler</h2>
              <h3 style={{
                ...styles.subsectionTitle,
                transform: visibleSections.has('section2') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('section2') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.4s, opacity 0.6s ease-out 0.4s'
              }}>2.1 Hesap Bilgileri</h3>
              <p style={{
                ...styles.text,
                transform: visibleSections.has('section2') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('section2') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.5s, opacity 0.6s ease-out 0.5s'
              }}>
                Uygulama kullanımı için aşağıdaki bilgileri topluyoruz:
              </p>
              <ul style={{
                ...styles.list,
                transform: visibleSections.has('section2') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('section2') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.6s, opacity 0.6s ease-out 0.6s'
              }}>
                <li style={styles.listItem}>E-posta adresi (ebeveyn/veli için)</li>
                <li style={styles.listItem}>Çocuğun adı ve soyadı</li>
                <li style={styles.listItem}>Yaş grubu bilgisi</li>
              </ul>

              <h3 style={{
                ...styles.subsectionTitle,
                transform: visibleSections.has('section2') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('section2') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.7s, opacity 0.6s ease-out 0.7s'
              }}>2.2 Kullanım Verileri</h3>
              <ul style={{
                ...styles.list,
                transform: visibleSections.has('section2') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('section2') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.8s, opacity 0.6s ease-out 0.8s'
              }}>
                <li style={styles.listItem}>Oyun ilerleme verileri ve puanlar</li>
                <li style={styles.listItem}>Oynanan oyunlar ve süreler</li>
                <li style={styles.listItem}>Başarılar ve seviye ilerlemeleri</li>
              </ul>

              <h3 style={{
                ...styles.subsectionTitle,
                transform: visibleSections.has('section2') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('section2') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.9s, opacity 0.6s ease-out 0.9s'
              }}>2.3 Toplamadığımız Bilgiler</h3>
              <p style={{
                ...styles.text,
                transform: visibleSections.has('section2') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('section2') ? 1 : 0,
                transition: 'transform 0.6s ease-out 1.0s, opacity 0.6s ease-out 1.0s'
              }}>
                Aşağıdaki bilgileri kesinlikle toplamıyoruz:
              </p>
              <ul style={{
                ...styles.list,
                transform: visibleSections.has('section2') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('section2') ? 1 : 0,
                transition: 'transform 0.6s ease-out 1.1s, opacity 0.6s ease-out 1.1s'
              }}>
                <li style={styles.listItem}>Konum bilgileri</li>
                <li style={styles.listItem}>Fotoğraf veya kamera erişimi</li>
                <li style={styles.listItem}>Kişi listesi</li>
                <li style={styles.listItem}>Telefon numarası</li>
                <li style={styles.listItem}>Hassas kişisel bilgiler</li>
              </ul>
            </section>

            <section id="section3" style={{
              ...styles.section,
              transform: visibleSections.has('section3') ? 'translateY(0)' : 'translateY(30px)',
              opacity: visibleSections.has('section3') ? 1 : 0,
              transition: 'transform 0.6s ease-out 0.2s, opacity 0.6s ease-out 0.2s'
            }}>
              <h2 style={{
                ...styles.sectionTitle,
                transform: visibleSections.has('section3') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('section3') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.3s, opacity 0.6s ease-out 0.3s'
              }}>3. Bilgilerin Kullanımı</h2>
              <p style={{
                ...styles.text,
                transform: visibleSections.has('section3') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('section3') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.4s, opacity 0.6s ease-out 0.4s'
              }}>
                Topladığımız bilgileri yalnızca aşağıdaki amaçlarla kullanıyoruz:
              </p>
              <ul style={{
                ...styles.list,
                transform: visibleSections.has('section3') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('section3') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.5s, opacity 0.6s ease-out 0.5s'
              }}>
                <li style={styles.listItem}>Oyun deneyimini kişiselleştirmek</li>
                <li style={styles.listItem}>İlerlemeyi kaydetmek ve takip etmek</li>
                <li style={styles.listItem}>Yaş grubuna uygun içerik sunmak</li>
                <li style={styles.listItem}>Teknik destek sağlamak</li>
                <li style={styles.listItem}>Uygulama performansını iyileştirmek</li>
              </ul>
            </section>

            <section id="section4" style={{
              ...styles.section,
              transform: visibleSections.has('section4') ? 'translateY(0)' : 'translateY(30px)',
              opacity: visibleSections.has('section4') ? 1 : 0,
              transition: 'transform 0.6s ease-out 0.2s, opacity 0.6s ease-out 0.2s'
            }}>
              <h2 style={{
                ...styles.sectionTitle,
                transform: visibleSections.has('section4') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('section4') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.3s, opacity 0.6s ease-out 0.3s'
              }}>4. Veri Güvenliği</h2>
              <p style={{
                ...styles.text,
                transform: visibleSections.has('section4') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('section4') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.4s, opacity 0.6s ease-out 0.4s'
              }}>
                Bilgilerinizi korumak için endüstri standardı güvenlik önlemleri kullanıyoruz:
              </p>
              <ul style={{
                ...styles.list,
                transform: visibleSections.has('section4') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('section4') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.5s, opacity 0.6s ease-out 0.5s'
              }}>
                <li style={styles.listItem}>Tüm veriler şifrelenmiş bağlantılar üzerinden iletilir</li>
                <li style={styles.listItem}>Şifreler güvenli şekilde hashlenir ve saklanır</li>
                <li style={styles.listItem}>Düzenli güvenlik güncellemeleri yapılır</li>
                <li style={styles.listItem}>Veritabanı erişimi sınırlıdır ve denetlenir</li>
              </ul>
            </section>

            <section id="section5" style={{
              ...styles.section,
              transform: visibleSections.has('section5') ? 'translateY(0)' : 'translateY(30px)',
              opacity: visibleSections.has('section5') ? 1 : 0,
              transition: 'transform 0.6s ease-out 0.2s, opacity 0.6s ease-out 0.2s'
            }}>
              <h2 style={{
                ...styles.sectionTitle,
                transform: visibleSections.has('section5') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('section5') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.3s, opacity 0.6s ease-out 0.3s'
              }}>5. Üçüncü Taraflarla Paylaşım</h2>
              <p style={{
                ...styles.text,
                transform: visibleSections.has('section5') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('section5') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.4s, opacity 0.6s ease-out 0.4s'
              }}>
                Çocukların bilgilerini üçüncü taraflarla <strong>kesinlikle paylaşmıyoruz</strong>.
                Verileriniz hiçbir şekilde satılmaz, kiralanmaz veya reklam amaçlı kullanılmaz.
              </p>
            </section>

            <section id="section6" style={{
              ...styles.section,
              transform: visibleSections.has('section6') ? 'translateY(0)' : 'translateY(30px)',
              opacity: visibleSections.has('section6') ? 1 : 0,
              transition: 'transform 0.6s ease-out 0.2s, opacity 0.6s ease-out 0.2s'
            }}>
              <h2 style={{
                ...styles.sectionTitle,
                transform: visibleSections.has('section6') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('section6') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.3s, opacity 0.6s ease-out 0.3s'
              }}>6. Çocukların Gizliliği</h2>
              <p style={{
                ...styles.text,
                transform: visibleSections.has('section6') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('section6') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.4s, opacity 0.6s ease-out 0.4s'
              }}>
                Uygulamamız 13 yaş altı çocuklar için tasarlanmıştır ve COPPA (Children's Online
                Privacy Protection Act) gerekliliklerine uygundur:
              </p>
              <ul style={{
                ...styles.list,
                transform: visibleSections.has('section6') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('section6') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.5s, opacity 0.6s ease-out 0.5s'
              }}>
                <li style={styles.listItem}>Ebeveyn/veli onayı gereklidir</li>
                <li style={styles.listItem}>Minimum veri toplama prensibi uygulanır</li>
                <li style={styles.listItem}>Reklam ve üçüncü taraf takibi yoktur</li>
                <li style={styles.listItem}>Güvenli ve çocuk dostu içerik sunulur</li>
              </ul>
            </section>

            <section id="section7" style={{
              ...styles.section,
              transform: visibleSections.has('section7') ? 'translateY(0)' : 'translateY(30px)',
              opacity: visibleSections.has('section7') ? 1 : 0,
              transition: 'transform 0.6s ease-out 0.2s, opacity 0.6s ease-out 0.2s'
            }}>
              <h2 style={{
                ...styles.sectionTitle,
                transform: visibleSections.has('section7') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('section7') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.3s, opacity 0.6s ease-out 0.3s'
              }}>7. Veri Saklama ve Silme</h2>
              <p style={{
                ...styles.text,
                transform: visibleSections.has('section7') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('section7') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.4s, opacity 0.6s ease-out 0.4s'
              }}>
                Hesabınızı istediğiniz zaman silebilirsiniz. Hesap silme işlemi sonrasında:
              </p>
              <ul style={{
                ...styles.list,
                transform: visibleSections.has('section7') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('section7') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.5s, opacity 0.6s ease-out 0.5s'
              }}>
                <li style={styles.listItem}>Tüm kişisel bilgiler kalıcı olarak silinir</li>
                <li style={styles.listItem}>Oyun ilerleme verileri kaldırılır</li>
                <li style={styles.listItem}>İşlem geri alınamaz</li>
              </ul>
            </section>

            <section id="section8" style={{
              ...styles.section,
              transform: visibleSections.has('section8') ? 'translateY(0)' : 'translateY(30px)',
              opacity: visibleSections.has('section8') ? 1 : 0,
              transition: 'transform 0.6s ease-out 0.2s, opacity 0.6s ease-out 0.2s'
            }}>
              <h2 style={{
                ...styles.sectionTitle,
                transform: visibleSections.has('section8') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('section8') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.3s, opacity 0.6s ease-out 0.3s'
              }}>8. Haklarınız</h2>
              <p style={{
                ...styles.text,
                transform: visibleSections.has('section8') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('section8') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.4s, opacity 0.6s ease-out 0.4s'
              }}>
                Kullanıcılarımızın aşağıdaki hakları vardır:
              </p>
              <ul style={{
                ...styles.list,
                transform: visibleSections.has('section8') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('section8') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.5s, opacity 0.6s ease-out 0.5s'
              }}>
                <li style={styles.listItem}>Bilgilerinize erişim hakkı</li>
                <li style={styles.listItem}>Bilgilerinizi düzeltme hakkı</li>
                <li style={styles.listItem}>Hesabınızı silme hakkı</li>
                <li style={styles.listItem}>Veri taşınabilirliği hakkı</li>
              </ul>
            </section>

            <section id="section9" style={{
              ...styles.section,
              transform: visibleSections.has('section9') ? 'translateY(0)' : 'translateY(30px)',
              opacity: visibleSections.has('section9') ? 1 : 0,
              transition: 'transform 0.6s ease-out 0.2s, opacity 0.6s ease-out 0.2s'
            }}>
              <h2 style={{
                ...styles.sectionTitle,
                transform: visibleSections.has('section9') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('section9') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.3s, opacity 0.6s ease-out 0.3s'
              }}>9. Politika Değişiklikleri</h2>
              <p style={{
                ...styles.text,
                transform: visibleSections.has('section9') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('section9') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.4s, opacity 0.6s ease-out 0.4s'
              }}>
                Bu gizlilik politikasını zaman zaman güncelleyebiliriz. Önemli değişiklikler
                olduğunda kullanıcılarımızı e-posta yoluyla bilgilendireceğiz.
              </p>
            </section>

            <section id="section10" style={{
              ...styles.section,
              transform: visibleSections.has('section10') ? 'translateY(0)' : 'translateY(30px)',
              opacity: visibleSections.has('section10') ? 1 : 0,
              transition: 'transform 0.6s ease-out 0.2s, opacity 0.6s ease-out 0.2s'
            }}>
              <h2 style={{
                ...styles.sectionTitle,
                transform: visibleSections.has('section10') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('section10') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.3s, opacity 0.6s ease-out 0.3s'
              }}>10. İletişim</h2>
              <p style={{
                ...styles.text,
                transform: visibleSections.has('section10') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('section10') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.4s, opacity 0.6s ease-out 0.4s'
              }}>
                Gizlilik politikamız hakkında sorularınız veya endişeleriniz varsa,
                bizimle iletişime geçmekten çekinmeyin:
              </p>
              <p style={{
                ...styles.text,
                transform: visibleSections.has('section10') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('section10') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.5s, opacity 0.6s ease-out 0.5s'
              }}>
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
    backgroundColor: '#fafbfc',
  },
  hero: {
    background: `linear-gradient(135deg, ${Colors.spacePurple} 0%, ${Colors.darkPurple} 100%)`,
    color: Colors.pureWhite,
    padding: '6rem 2rem 4rem',
    textAlign: 'center',
  },
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '0 2rem',
  },
  title: {
    fontSize: '3.5rem',
    fontWeight: '700',
    marginBottom: '1rem',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    fontSize: '1.25rem',
    opacity: 0.9,
    fontWeight: '400',
  },
  content: {
    padding: '5rem 0',
  },
  contentBox: {
    backgroundColor: Colors.pureWhite,
    padding: '4rem',
    borderRadius: '24px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
    border: '1px solid rgba(0,0,0,0.04)',
  },
  section: {
    marginBottom: '3.5rem',
  },
  sectionTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    color: Colors.spacePurple,
    marginBottom: '1.5rem',
    letterSpacing: '-0.01em',
  },
  subsectionTitle: {
    fontSize: '1.4rem',
    fontWeight: '600',
    color: Colors.darkPurple,
    marginTop: '2rem',
    marginBottom: '1rem',
  },
  text: {
    fontSize: '1.1rem',
    lineHeight: '1.9',
    color: '#2d3748',
    marginBottom: '1.25rem',
  },
  list: {
    paddingLeft: '1.5rem',
    marginTop: '0.75rem',
    marginBottom: '1.25rem',
  },
  listItem: {
    fontSize: '1.1rem',
    lineHeight: '1.9',
    color: '#2d3748',
    marginBottom: '0.75rem',
  },
};
