import { Colors } from '../constants/colors';
import { useState, useEffect } from 'react';

export default function Terms() {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // Check which sections are visible
      const sections = ['hero', 'content', 'section2', 'section3', 'section4', 'section5', 'section6', 'section7', 'section8', 'section9', 'section10', 'section11', 'section12', 'section-final'];
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
          }}>Kullanım Şartları</h1>
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
              }}>1. Şartların Kabulü</h2>
              <p style={{
                ...styles.text,
                transform: visibleSections.has('content') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('content') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.6s, opacity 0.6s ease-out 0.6s'
              }}>
                Küçük Kaşif uygulamasını kullanarak, bu kullanım şartlarını kabul etmiş olursunuz.
                Bu şartları kabul etmiyorsanız, lütfen uygulamayı kullanmayınız.
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
              }}>2. Kullanım Koşulları</h2>
              <h3 style={{
                ...styles.subsectionTitle,
                transform: visibleSections.has('section2') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('section2') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.4s, opacity 0.6s ease-out 0.4s'
              }}>2.1 Yaş Sınırlaması</h3>
              <p style={{
                ...styles.text,
                transform: visibleSections.has('section2') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('section2') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.5s, opacity 0.6s ease-out 0.5s'
              }}>
                Uygulama 5-14 yaş arası çocuklar için tasarlanmıştır. 13 yaş altı çocukların
                uygulamayı kullanması için ebeveyn veya veli onayı gereklidir.
              </p>

              <h3 style={{
                ...styles.subsectionTitle,
                transform: visibleSections.has('section2') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('section2') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.6s, opacity 0.6s ease-out 0.6s'
              }}>2.2 Hesap Sorumluluğu</h3>
              <ul style={{
                ...styles.list,
                transform: visibleSections.has('section2') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('section2') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.7s, opacity 0.6s ease-out 0.7s'
              }}>
                <li style={styles.listItem}>Hesap bilgilerinizi güvenli tutmaktan siz sorumlusunuz</li>
                <li style={styles.listItem}>Hesap bilgilerinizi başkalarıyla paylaşmayınız</li>
                <li style={styles.listItem}>Şüpheli aktivite fark ederseniz hemen bildirin</li>
                <li style={styles.listItem}>Her hesap yalnızca bir kişi tarafından kullanılmalıdır</li>
              </ul>

              <h3 style={{
                ...styles.subsectionTitle,
                transform: visibleSections.has('section2') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('section2') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.8s, opacity 0.6s ease-out 0.8s'
              }}>2.3 Kabul Edilebilir Kullanım</h3>
              <p style={{
                ...styles.text,
                transform: visibleSections.has('section2') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('section2') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.9s, opacity 0.6s ease-out 0.9s'
              }}>
                Uygulamayı kullanırken aşağıdaki kurallara uymalısınız:
              </p>
              <ul style={{
                ...styles.list,
                transform: visibleSections.has('section2') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('section2') ? 1 : 0,
                transition: 'transform 0.6s ease-out 1.0s, opacity 0.6s ease-out 1.0s'
              }}>
                <li style={styles.listItem}>Uygulamayı yalnızca eğitim amaçlı kullanın</li>
                <li style={styles.listItem}>Sistemi manipüle etmeye çalışmayın</li>
                <li style={styles.listItem}>Diğer kullanıcılara zarar vermeyin</li>
                <li style={styles.listItem}>Yasal olmayan aktiviteler için kullanmayın</li>
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
              }}>3. Fikri Mülkiyet Hakları</h2>
              <p style={{
                ...styles.text,
                transform: visibleSections.has('section3') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('section3') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.4s, opacity 0.6s ease-out 0.4s'
              }}>
                Küçük Kaşif uygulamasındaki tüm içerik, tasarım, logo, grafik, oyunlar ve
                yazılımlar telif hakkı ve diğer fikri mülkiyet yasaları ile korunmaktadır.
              </p>
              <ul style={{
                ...styles.list,
                transform: visibleSections.has('section3') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('section3') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.5s, opacity 0.6s ease-out 0.5s'
              }}>
                <li style={styles.listItem}>İçeriği izinsiz kopyalayamazsınız</li>
                <li style={styles.listItem}>Ticari amaçlarla kullanamazsınız</li>
                <li style={styles.listItem}>Tersine mühendislik yapamazsınız</li>
                <li style={styles.listItem}>Değiştirerek dağıtamazsınız</li>
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
              }}>4. Hizmet Sunumu</h2>
              <h3 style={{
                ...styles.subsectionTitle,
                transform: visibleSections.has('section4') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('section4') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.4s, opacity 0.6s ease-out 0.4s'
              }}>4.1 Hizmet Garantisi</h3>
              <p style={{
                ...styles.text,
                transform: visibleSections.has('section4') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('section4') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.5s, opacity 0.6s ease-out 0.5s'
              }}>
                Küçük Kaşif uygulaması "olduğu gibi" sunulmaktadır. Kesintisiz veya hatasız
                hizmet garantisi vermiyoruz, ancak en iyi deneyimi sunmak için çalışıyoruz.
              </p>

              <h3 style={{
                ...styles.subsectionTitle,
                transform: visibleSections.has('section4') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('section4') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.6s, opacity 0.6s ease-out 0.6s'
              }}>4.2 Hizmet Değişiklikleri</h3>
              <p style={{
                ...styles.text,
                transform: visibleSections.has('section4') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('section4') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.7s, opacity 0.6s ease-out 0.7s'
              }}>
                Aşağıdaki haklarımızı saklı tutarız:
              </p>
              <ul style={{
                ...styles.list,
                transform: visibleSections.has('section4') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('section4') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.8s, opacity 0.6s ease-out 0.8s'
              }}>
                <li style={{
                  ...styles.listItem,
                  transform: visibleSections.has('section4') ? 'translateY(0)' : 'translateY(20px)',
                  opacity: visibleSections.has('section4') ? 1 : 0,
                  transition: 'transform 0.6s ease-out 0.9s, opacity 0.6s ease-out 0.9s'
                }}>Uygulamayı güncelleme ve değiştirme</li>
                <li style={{
                  ...styles.listItem,
                  transform: visibleSections.has('section4') ? 'translateY(0)' : 'translateY(20px)',
                  opacity: visibleSections.has('section4') ? 1 : 0,
                  transition: 'transform 0.6s ease-out 1.0s, opacity 0.6s ease-out 1.0s'
                }}>Yeni özellikler ekleme veya kaldırma</li>
                <li style={{
                  ...styles.listItem,
                  transform: visibleSections.has('section4') ? 'translateY(0)' : 'translateY(20px)',
                  opacity: visibleSections.has('section4') ? 1 : 0,
                  transition: 'transform 0.6s ease-out 1.1s, opacity 0.6s ease-out 1.1s'
                }}>Geçici veya kalıcı bakım yapma</li>
                <li style={{
                  ...styles.listItem,
                  transform: visibleSections.has('section4') ? 'translateY(0)' : 'translateY(20px)',
                  opacity: visibleSections.has('section4') ? 1 : 0,
                  transition: 'transform 0.6s ease-out 1.2s, opacity 0.6s ease-out 1.2s'
                }}>Hizmet koşullarını güncelleme</li>
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
              }}>5. Ücretlendirme</h2>
              <p style={{
                ...styles.text,
                transform: visibleSections.has('section5') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('section5') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.4s, opacity 0.6s ease-out 0.4s'
              }}>
                Küçük Kaşif şu anda tamamen ücretsiz bir uygulamadır. Gelecekte ücretli
                özellikler ekleyebiliriz, ancak temel oyun deneyimi her zaman ücretsiz kalacaktır.
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
              }}>6. Hesap Askıya Alma ve Sonlandırma</h2>
              <p style={{
                ...styles.text,
                transform: visibleSections.has('section6') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('section6') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.4s, opacity 0.6s ease-out 0.4s'
              }}>
                Aşağıdaki durumlarda hesabınızı askıya alabilir veya sonlandırabiliriz:
              </p>
              <ul style={{
                ...styles.list,
                transform: visibleSections.has('section6') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('section6') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.5s, opacity 0.6s ease-out 0.5s'
              }}>
                <li style={{
                  ...styles.listItem,
                  transform: visibleSections.has('section6') ? 'translateY(0)' : 'translateY(20px)',
                  opacity: visibleSections.has('section6') ? 1 : 0,
                  transition: 'transform 0.6s ease-out 0.6s, opacity 0.6s ease-out 0.6s'
                }}>Kullanım şartlarının ihlali</li>
                <li style={{
                  ...styles.listItem,
                  transform: visibleSections.has('section6') ? 'translateY(0)' : 'translateY(20px)',
                  opacity: visibleSections.has('section6') ? 1 : 0,
                  transition: 'transform 0.6s ease-out 0.7s, opacity 0.6s ease-out 0.7s'
                }}>Yasadışı aktiviteler</li>
                <li style={{
                  ...styles.listItem,
                  transform: visibleSections.has('section6') ? 'translateY(0)' : 'translateY(20px)',
                  opacity: visibleSections.has('section6') ? 1 : 0,
                  transition: 'transform 0.6s ease-out 0.8s, opacity 0.6s ease-out 0.8s'
                }}>Diğer kullanıcılara zarar verme</li>
                <li style={{
                  ...styles.listItem,
                  transform: visibleSections.has('section6') ? 'translateY(0)' : 'translateY(20px)',
                  opacity: visibleSections.has('section6') ? 1 : 0,
                  transition: 'transform 0.6s ease-out 0.9s, opacity 0.6s ease-out 0.9s'
                }}>Sistemi manipüle etme girişimleri</li>
              </ul>
              <p style={{
                ...styles.text,
                transform: visibleSections.has('section6') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('section6') ? 1 : 0,
                transition: 'transform 0.6s ease-out 1.0s, opacity 0.6s ease-out 1.0s'
              }}>
                Hesabınızı istediğiniz zaman kendiniz de silebilirsiniz.
              </p>
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
              }}>7. Sorumluluk Sınırlaması</h2>
              <p style={{
                ...styles.text,
                transform: visibleSections.has('section7') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('section7') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.4s, opacity 0.6s ease-out 0.4s'
              }}>
                Yasal olarak izin verilen en geniş ölçüde:
              </p>
              <ul style={{
                ...styles.list,
                transform: visibleSections.has('section7') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('section7') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.5s, opacity 0.6s ease-out 0.5s'
              }}>
                <li style={{
                  ...styles.listItem,
                  transform: visibleSections.has('section7') ? 'translateY(0)' : 'translateY(20px)',
                  opacity: visibleSections.has('section7') ? 1 : 0,
                  transition: 'transform 0.6s ease-out 0.6s, opacity 0.6s ease-out 0.6s'
                }}>
                  Uygulamanın kullanımından kaynaklanan dolaylı zararlardan sorumlu değiliz
                </li>
                <li style={{
                  ...styles.listItem,
                  transform: visibleSections.has('section7') ? 'translateY(0)' : 'translateY(20px)',
                  opacity: visibleSections.has('section7') ? 1 : 0,
                  transition: 'transform 0.6s ease-out 0.7s, opacity 0.6s ease-out 0.7s'
                }}>
                  Veri kaybı veya hizmet kesintilerinden doğan zararlardan sorumlu tutulamayız
                </li>
                <li style={{
                  ...styles.listItem,
                  transform: visibleSections.has('section7') ? 'translateY(0)' : 'translateY(20px)',
                  opacity: visibleSections.has('section7') ? 1 : 0,
                  transition: 'transform 0.6s ease-out 0.8s, opacity 0.6s ease-out 0.8s'
                }}>
                  Üçüncü taraf hizmetlerinden kaynaklanan sorunlardan sorumlu değiliz
                </li>
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
              }}>8. Ebeveyn/Veli Sorumluluğu</h2>
              <p style={{
                ...styles.text,
                transform: visibleSections.has('section8') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('section8') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.4s, opacity 0.6s ease-out 0.4s'
              }}>
                Ebeveynler ve veliler:
              </p>
              <ul style={{
                ...styles.list,
                transform: visibleSections.has('section8') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('section8') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.5s, opacity 0.6s ease-out 0.5s'
              }}>
                <li style={{
                  ...styles.listItem,
                  transform: visibleSections.has('section8') ? 'translateY(0)' : 'translateY(20px)',
                  opacity: visibleSections.has('section8') ? 1 : 0,
                  transition: 'transform 0.6s ease-out 0.6s, opacity 0.6s ease-out 0.6s'
                }}>Çocuklarının uygulama kullanımını denetlemekten sorumludur</li>
                <li style={{
                  ...styles.listItem,
                  transform: visibleSections.has('section8') ? 'translateY(0)' : 'translateY(20px)',
                  opacity: visibleSections.has('section8') ? 1 : 0,
                  transition: 'transform 0.6s ease-out 0.7s, opacity 0.6s ease-out 0.7s'
                }}>Uygun yaş grubu seçimini yapmalıdır</li>
                <li style={{
                  ...styles.listItem,
                  transform: visibleSections.has('section8') ? 'translateY(0)' : 'translateY(20px)',
                  opacity: visibleSections.has('section8') ? 1 : 0,
                  transition: 'transform 0.6s ease-out 0.8s, opacity 0.6s ease-out 0.8s'
                }}>Çocuğun ekran süresini yönetmelidir</li>
                <li style={{
                  ...styles.listItem,
                  transform: visibleSections.has('section8') ? 'translateY(0)' : 'translateY(20px)',
                  opacity: visibleSections.has('section8') ? 1 : 0,
                  transition: 'transform 0.6s ease-out 0.9s, opacity 0.6s ease-out 0.9s'
                }}>Hesap güvenliğini sağlamalıdır</li>
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
              }}>9. Gizlilik</h2>
              <p style={{
                ...styles.text,
                transform: visibleSections.has('section9') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('section9') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.4s, opacity 0.6s ease-out 0.4s'
              }}>
                Gizlilik politikamız bu kullanım şartlarının bir parçasıdır. Lütfen
                <a href="/privacy" style={styles.link}> Gizlilik Politikamızı</a> okuyunuz.
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
              }}>10. Değişiklikler</h2>
              <p style={{
                ...styles.text,
                transform: visibleSections.has('section10') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('section10') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.4s, opacity 0.6s ease-out 0.4s'
              }}>
                Bu kullanım şartlarını istediğimiz zaman değiştirme hakkını saklı tutarız.
                Önemli değişiklikler olduğunda kullanıcıları bilgilendireceğiz. Değişikliklerden
                sonra uygulamayı kullanmaya devam etmek, yeni şartları kabul ettiğiniz anlamına gelir.
              </p>
            </section>

            <section id="section11" style={{
              ...styles.section,
              transform: visibleSections.has('section11') ? 'translateY(0)' : 'translateY(30px)',
              opacity: visibleSections.has('section11') ? 1 : 0,
              transition: 'transform 0.6s ease-out 0.2s, opacity 0.6s ease-out 0.2s'
            }}>
              <h2 style={{
                ...styles.sectionTitle,
                transform: visibleSections.has('section11') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('section11') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.3s, opacity 0.6s ease-out 0.3s'
              }}>11. Uygulanacak Hukuk</h2>
              <p style={{
                ...styles.text,
                transform: visibleSections.has('section11') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('section11') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.4s, opacity 0.6s ease-out 0.4s'
              }}>
                Bu kullanım şartları Türkiye Cumhuriyeti yasalarına tabidir. Herhangi bir
                anlaşmazlık durumunda Türkiye mahkemeleri yetkilidir.
              </p>
            </section>

            <section id="section12" style={{
              ...styles.section,
              transform: visibleSections.has('section12') ? 'translateY(0)' : 'translateY(30px)',
              opacity: visibleSections.has('section12') ? 1 : 0,
              transition: 'transform 0.6s ease-out 0.2s, opacity 0.6s ease-out 0.2s'
            }}>
              <h2 style={{
                ...styles.sectionTitle,
                transform: visibleSections.has('section12') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('section12') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.3s, opacity 0.6s ease-out 0.3s'
              }}>12. İletişim</h2>
              <p style={{
                ...styles.text,
                transform: visibleSections.has('section12') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('section12') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.4s, opacity 0.6s ease-out 0.4s'
              }}>
                Kullanım şartları hakkında sorularınız varsa bizimle iletişime geçin:
              </p>
              <p style={{
                ...styles.text,
                transform: visibleSections.has('section12') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('section12') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.5s, opacity 0.6s ease-out 0.5s'
              }}>
                <strong>E-posta:</strong> support@uzaykaşifi.com
              </p>
            </section>

            <section id="section-final" style={{
              ...styles.section,
              transform: visibleSections.has('section-final') ? 'translateY(0)' : 'translateY(30px)',
              opacity: visibleSections.has('section-final') ? 1 : 0,
              transition: 'transform 0.6s ease-out 0.2s, opacity 0.6s ease-out 0.2s'
            }}>
              <p style={{
                ...styles.text,
                transform: visibleSections.has('section-final') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('section-final') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.3s, opacity 0.6s ease-out 0.3s'
              }}>
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
