import { Colors } from '../constants/colors';
import { useState, useEffect } from 'react';
import { FaFileContract, FaRocket, FaStar } from 'react-icons/fa';

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
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
      <div style={styles.page}>
        {/* Animated Hero Section */}
        <section id="hero" style={{
          ...styles.hero,
          transform: `translateY(${scrollY * 0.3}px)`,
          opacity: visibleSections.has('hero') ? 1 : 0,
          transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Floating Background Elements */}
          <div style={{
            position: 'absolute',
            top: '20%',
            left: '10%',
            fontSize: '3rem',
            color: 'rgba(255,255,255,0.2)',
            animation: 'float 6s ease-in-out infinite',
            animationDelay: '0s'
          }}><FaFileContract /></div>
          <div style={{
            position: 'absolute',
            top: '60%',
            right: '15%',
            fontSize: '2.5rem',
            color: 'rgba(255,255,255,0.15)',
            animation: 'float 8s ease-in-out infinite',
            animationDelay: '2s'
          }}><FaRocket /></div>
          <div style={{
            position: 'absolute',
            top: '30%',
            right: '25%',
            fontSize: '2rem',
            color: 'rgba(255,255,255,0.1)',
            animation: 'float 7s ease-in-out infinite',
            animationDelay: '4s'
          }}><FaStar /></div>
          <div style={{
            position: 'absolute',
            bottom: '20%',
            left: '20%',
            fontSize: '2.2rem',
            color: 'rgba(255,255,255,0.12)',
            animation: 'float 9s ease-in-out infinite',
            animationDelay: '1s'
          }}><FaStar /></div>

          <div style={styles.container}>
            <div style={{
              ...styles.heroIcon,
              transform: visibleSections.has('hero') ? 'scale(1) rotate(0deg)' : 'scale(0) rotate(-180deg)',
              opacity: visibleSections.has('hero') ? 1 : 0,
              transition: 'transform 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.1s, opacity 0.8s ease-out 0.1s'
            }}>
              <FaFileContract />
            </div>
            <h1 style={{
              ...styles.title,
              transform: visibleSections.has('hero') ? 'translateY(0)' : 'translateY(30px)',
              opacity: visibleSections.has('hero') ? 1 : 0,
              transition: 'transform 0.8s ease-out 0.2s, opacity 0.8s ease-out 0.2s',
              color: Colors.brightYellow,
              textShadow: '2px 2px 8px rgba(0,0,0,0.5)'
            }}>📋 Kullanım Şartları</h1>
            <p style={{
              ...styles.subtitle,
              transform: visibleSections.has('hero') ? 'translateY(0)' : 'translateY(30px)',
              opacity: visibleSections.has('hero') ? 1 : 0,
              transition: 'transform 0.8s ease-out 0.4s, opacity 0.8s ease-out 0.4s',
              color: Colors.pureWhite,
              fontSize: '1.3rem',
              fontWeight: '500'
            }}>🚀 Uzay yolculuğumuza hoş geldiniz!</p>
            <p style={{
              transform: visibleSections.has('hero') ? 'translateY(0)' : 'translateY(30px)',
              opacity: visibleSections.has('hero') ? 1 : 0,
              transition: 'transform 0.8s ease-out 0.6s, opacity 0.8s ease-out 0.6s',
              color: 'rgba(255,255,255,0.9)',
              fontSize: '1rem',
              marginTop: '1rem'
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
            {/* Colorful Introduction Section */}
            <div style={{
              ...styles.introCard,
              transform: visibleSections.has('content') ? 'translateY(0)' : 'translateY(40px)',
              opacity: visibleSections.has('content') ? 1 : 0,
              transition: 'transform 0.8s ease-out 0.3s, opacity 0.8s ease-out 0.3s',
              background: `linear-gradient(135deg, ${Colors.energyOrange} 0%, ${Colors.spacePurple} 50%, ${Colors.deepBlue} 100%)`,
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Floating Icons */}
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '20px',
                fontSize: '2rem',
                color: 'rgba(255,255,255,0.3)',
                animation: 'float 6s ease-in-out infinite'
              }}><FaRocket /></div>
              <div style={{
                position: 'absolute',
                bottom: '15px',
                left: '20px',
                fontSize: '1.8rem',
                color: 'rgba(255,255,255,0.2)',
                animation: 'float 8s ease-in-out infinite',
                animationDelay: '2s'
              }}><FaStar /></div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '1.5rem'
              }}>
                <div style={{
                  fontSize: '3rem',
                  color: Colors.brightYellow,
                  marginRight: '1rem',
                  animation: 'bounce 2s infinite'
                }}>📋</div>
                <h2 style={{
                  ...styles.sectionTitle,
                  color: Colors.brightYellow,
                  margin: 0,
                  textShadow: '1px 1px 3px rgba(0,0,0,0.3)'
                }}>
                <span style={{marginRight: '1rem', fontSize: '2.5rem'}}>✅</span>
                1. Şartların Kabulü
              </h2>
              </div>
              <p style={{
                ...styles.text,
                color: Colors.pureWhite,
                fontSize: '1.1rem',
                lineHeight: '1.7',
                textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
              }}>
                <strong style={{color: Colors.brightYellow}}>Küçük Kaşif uygulamasını kullanarak</strong>, bu kullanım şartlarını kabul etmiş olursunuz.
                Bu şartları kabul etmiyorsanız, lütfen uygulamayı kullanmayınız.
                <br /><br />
                <span style={{fontSize: '1rem', opacity: 0.9}}>🌟 Güvenli ve eğlenceli bir uzay yolculuğu için lütfen kurallarımıza uyun!</span>
              </p>
            </div>

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
              }}>
                <span style={{marginRight: '1rem', fontSize: '2.5rem'}}>📋</span>
                2. Kullanım Koşulları
              </h2>
              <h3 style={{
                ...styles.subsectionTitle,
                transform: visibleSections.has('section2') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('section2') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.4s, opacity 0.6s ease-out 0.4s'
              }}>
                <span style={{marginRight: '0.5rem'}}>👶</span>
                2.1 Yaş Sınırlaması
              </h3>
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
              }}>
                <span style={{marginRight: '0.5rem'}}>🔐</span>
                2.2 Hesap Sorumluluğu
              </h3>
              <ul style={{
                ...styles.list,
                transform: visibleSections.has('section2') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('section2') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.7s, opacity 0.6s ease-out 0.7s'
              }}>
                <li style={styles.listItem}>🔒 Hesap bilgilerinizi güvenli tutmaktan siz sorumlusunuz</li>
                <li style={styles.listItem}>🚫 Hesap bilgilerinizi başkalarıyla paylaşmayınız</li>
                <li style={styles.listItem}>🚨 Şüpheli aktivite fark ederseniz hemen bildirin</li>
                <li style={styles.listItem}>👤 Her hesap yalnızca bir kişi tarafından kullanılmalıdır</li>
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
              }}>
                <span style={{marginRight: '1rem', fontSize: '2.5rem'}}>©️</span>
                3. Fikri Mülkiyet Hakları
              </h2>
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
              }}>
                <span style={{marginRight: '1rem', fontSize: '2.5rem'}}>🛠️</span>
                4. Hizmet Sunumu
              </h2>
              <h3 style={{
                ...styles.subsectionTitle,
                transform: visibleSections.has('section4') ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleSections.has('section4') ? 1 : 0,
                transition: 'transform 0.6s ease-out 0.4s, opacity 0.6s ease-out 0.4s'
              }}>
                <span style={{marginRight: '0.5rem'}}>🛡️</span>
                4.1 Hizmet Garantisi
              </h3>
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
              }}>
                <span style={{marginRight: '0.5rem'}}>🔧</span>
                4.2 Hizmet Değişiklikleri
              </h3>
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
                }}>⏸️ Hesabı askıya alma veya sonlandırma</li>
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
              }}>
                <span style={{marginRight: '1rem', fontSize: '2.5rem'}}>💰</span>
                5. Ücretlendirme
              </h2>
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
              }}>
                <span style={{marginRight: '1rem', fontSize: '2.5rem'}}>🚫</span>
                6. Hesap Askıya Alma ve Sonlandırma
              </h2>
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
                }}>📋 Kullanım şartlarının ihlali</li>
                <li style={{
                  ...styles.listItem,
                  transform: visibleSections.has('section6') ? 'translateY(0)' : 'translateY(20px)',
                  opacity: visibleSections.has('section6') ? 1 : 0,
                  transition: 'transform 0.6s ease-out 0.7s, opacity 0.6s ease-out 0.7s'
                }}>⚠️ Yasadışı aktiviteler</li>
                <li style={{
                  ...styles.listItem,
                  transform: visibleSections.has('section6') ? 'translateY(0)' : 'translateY(20px)',
                  opacity: visibleSections.has('section6') ? 1 : 0,
                  transition: 'transform 0.6s ease-out 0.8s, opacity 0.6s ease-out 0.8s'
                }}>💥 Diğer kullanıcılara zarar verme</li>
                <li style={{
                  ...styles.listItem,
                  transform: visibleSections.has('section6') ? 'translateY(0)' : 'translateY(20px)',
                  opacity: visibleSections.has('section6') ? 1 : 0,
                  transition: 'transform 0.6s ease-out 0.9s, opacity 0.6s ease-out 0.9s'
                }}>🎮 Sistemi manipüle etme girişimleri</li>
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
              }}>
                <span style={{marginRight: '1rem', fontSize: '2.5rem'}}>⚖️</span>
                7. Sorumluluk Sınırlaması
              </h2>
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
                  🛡️ Uygulamanın kullanımından kaynaklanan dolaylı zararlardan sorumlu değiliz
                </li>
                <li style={{
                  ...styles.listItem,
                  transform: visibleSections.has('section7') ? 'translateY(0)' : 'translateY(20px)',
                  opacity: visibleSections.has('section7') ? 1 : 0,
                  transition: 'transform 0.6s ease-out 0.7s, opacity 0.6s ease-out 0.7s'
                }}>
                  💾 Veri kaybı veya hizmet kesintilerinden doğan zararlardan sorumlu tutulamayız
                </li>
                <li style={{
                  ...styles.listItem,
                  transform: visibleSections.has('section7') ? 'translateY(0)' : 'translateY(20px)',
                  opacity: visibleSections.has('section7') ? 1 : 0,
                  transition: 'transform 0.6s ease-out 0.8s, opacity 0.6s ease-out 0.8s'
                }}>
                  🔗 Üçüncü taraf hizmetlerinden kaynaklanan sorunlardan sorumlu değiliz
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
              }}>
                <span style={{marginRight: '1rem', fontSize: '2.5rem'}}>👨‍👩‍👧‍👦</span>
                8. Ebeveyn/Veli Sorumluluğu
              </h2>
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
                }}>👀 Çocuklarının uygulama kullanımını denetlemekten sorumludur</li>
                <li style={{
                  ...styles.listItem,
                  transform: visibleSections.has('section8') ? 'translateY(0)' : 'translateY(20px)',
                  opacity: visibleSections.has('section8') ? 1 : 0,
                  transition: 'transform 0.6s ease-out 0.7s, opacity 0.6s ease-out 0.7s'
                }}>🎯 Uygun yaş grubu seçimini yapmalıdır</li>
                <li style={{
                  ...styles.listItem,
                  transform: visibleSections.has('section8') ? 'translateY(0)' : 'translateY(20px)',
                  opacity: visibleSections.has('section8') ? 1 : 0,
                  transition: 'transform 0.6s ease-out 0.8s, opacity 0.6s ease-out 0.8s'
                }}>⏰ Çocuğun ekran süresini yönetmelidir</li>
                <li style={{
                  ...styles.listItem,
                  transform: visibleSections.has('section8') ? 'translateY(0)' : 'translateY(20px)',
                  opacity: visibleSections.has('section8') ? 1 : 0,
                  transition: 'transform 0.6s ease-out 0.9s, opacity 0.6s ease-out 0.9s'
                }}>🔐 Hesap güvenliğini sağlamalıdır</li>
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
              }}>
                <span style={{marginRight: '1rem', fontSize: '2.5rem'}}>🔒</span>
                9. Gizlilik
              </h2>
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
              }}>
                <span style={{marginRight: '1rem', fontSize: '2.5rem'}}>🔄</span>
                10. Değişiklikler
              </h2>
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
              }}>
                <span style={{marginRight: '1rem', fontSize: '2.5rem'}}>📜</span>
                11. Uygulanacak Hukuk
              </h2>
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
              }}>
                <span style={{marginRight: '1rem', fontSize: '2.5rem'}}>📧</span>
                12. İletişim
              </h2>
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
  </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: `linear-gradient(135deg, ${Colors.softBlue} 0%, ${Colors.lightPurple} 50%, ${Colors.softPink} 100%)`,
    position: 'relative',
  },
  hero: {
    background: `linear-gradient(135deg, ${Colors.spacePurple} 0%, ${Colors.deepBlue} 40%, ${Colors.navyBlue} 70%, ${Colors.darkPurple} 100%)`,
    color: Colors.pureWhite,
    padding: '6rem 2rem 6rem',
    textAlign: 'center',
    position: 'relative',
  },
  heroIcon: {
    fontSize: '5rem',
    color: Colors.brightYellow,
    marginBottom: '2rem',
    textShadow: '0 0 20px rgba(243, 156, 18, 0.5)',
  },
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '0 2rem',
  },
  title: {
    fontSize: '4rem',
    fontWeight: '800',
    marginBottom: '1.5rem',
    letterSpacing: '-0.02em',
    background: `linear-gradient(45deg, ${Colors.brightYellow}, #FFD700)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
  },
  subtitle: {
    fontSize: '1.4rem',
    opacity: 0.95,
    fontWeight: '500',
    color: Colors.pureWhite,
    textShadow: '1px 1px 3px rgba(0,0,0,0.4)',
  },
  introCard: {
    padding: '3rem',
    borderRadius: '25px',
    marginBottom: '3rem',
    boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
    border: '3px solid rgba(255,255,255,0.2)',
    backdropFilter: 'blur(10px)',
  },
  content: {
    padding: '5rem 0',
    position: 'relative',
  },
  contentBox: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: '4rem',
    borderRadius: '30px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
    border: '2px solid rgba(255,255,255,0.3)',
    backdropFilter: 'blur(20px)',
    position: 'relative',
    overflow: 'hidden',
  },
  section: {
    marginBottom: '4rem',
    padding: '2.5rem',
    borderRadius: '20px',
    backgroundColor: 'rgba(255,255,255,0.8)',
    border: '2px solid rgba(0,0,0,0.05)',
    boxShadow: '0 8px 25px rgba(0,0,0,0.05)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  sectionTitle: {
    fontSize: '2.2rem',
    fontWeight: '800',
    marginBottom: '2rem',
    letterSpacing: '-0.01em',
    background: `linear-gradient(45deg, ${Colors.spacePurple}, ${Colors.deepBlue})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
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
  link: {
    color: Colors.energyOrange,
    textDecoration: 'none',
    fontWeight: '600',
  },
};
