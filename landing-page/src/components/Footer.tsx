import { Link } from 'react-router-dom';
import { Colors } from '../constants/colors';
import { useState, useEffect } from 'react';

export default function Footer() {
  const [currentYear, setCurrentYear] = useState(2026);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const socialLinks = [
    { icon: '📧', label: 'E-posta', href: 'mailto:info@kucukkasif.com' },
    { icon: '🌐', label: 'Web Sitesi', href: 'https://kucukkasif.com' },
  ];

  const quickLinks = [
    { path: '/', label: 'Ana Sayfa' },
    { path: '/download', label: 'İndir' },
    { path: '/privacy', label: 'Gizlilik Politikası' },
    { path: '/terms', label: 'Kullanım Şartları' }
  ];

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* Brand Section */}
        <div style={styles.brandSection}>
          <div style={styles.brandHeader}>
            <div style={styles.brandIcon}>🚀</div>
            <h3 style={styles.brandTitle}>Küçük Kaşif</h3>
          </div>
          <p style={styles.brandDescription}>
            Çocuklar için eğlenceli ve eğitici oyunlarla dolu bir uzay macerası. 
            Güvenli, reklamsız ve eğitici içeriklerle çocuklarınızın gelişimini destekliyoruz.
          </p>
          <div style={styles.socialLinks}>
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                style={styles.socialLink}
                aria-label={link.label}
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div style={styles.linksSection}>
          <h4 style={styles.sectionTitle}>Hızlı Erişim</h4>
          <div style={styles.linksList}>
            {quickLinks.map((link, index) => (
              <Link
                key={link.path}
                to={link.path}
                style={styles.link}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div style={styles.contactSection}>
          <h4 style={styles.sectionTitle}>İletişim</h4>
          <div style={styles.contactInfo}>
            <div style={styles.contactItem}>
              <span style={styles.contactIcon}>📧</span>
              <span style={styles.contactText}>info@kucukkasif.com</span>
            </div>
            <div style={styles.contactItem}>
              <span style={styles.contactIcon}>🌐</span>
              <span style={styles.contactText}>www.kucukkasif.com</span>
            </div>
            <div style={styles.contactItem}>
              <span style={styles.contactIcon}>📱</span>
              <span style={styles.contactText}>Mobil Uygulama</span>
            </div>
          </div>
        </div>

        {/* App Download */}
        <div style={styles.downloadSection}>
          <h4 style={styles.sectionTitle}>Hemen İndir</h4>
          <p style={styles.downloadText}>
            Uygulamamızı ücretsiz indirin ve çocuğunuzun eğitim yolculuğuna başlayın.
          </p>
          <Link to="/download" style={styles.downloadButton}>
            <span>Ücretsiz İndir</span>
            <div style={styles.downloadButtonGlow}></div>
          </Link>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={styles.bottomBar}>
        <div style={styles.bottomContainer}>
          <p style={styles.copyright}>
            © {currentYear} Küçük Kaşif. Tüm hakları saklıdır.
          </p>
          <div style={styles.bottomLinks}>
            <Link to="/privacy" style={styles.bottomLink}>Gizlilik</Link>
            <span style={styles.separator}>•</span>
            <Link to="/terms" style={styles.bottomLink}>Şartlar</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

const styles: Record<string, React.CSSProperties> = {
  footer: {
    backgroundColor: Colors.darkPurple,
    color: Colors.pureWhite,
    padding: '5rem 0 0',
    marginTop: 'auto',
    position: 'relative',
    overflow: 'hidden',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem 3rem',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '3rem',
    position: 'relative',
    zIndex: 2,
  },
  brandSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  brandHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  brandIcon: {
    fontSize: '2.5rem',
    transition: 'transform 0.3s ease',
  },
  brandTitle: {
    fontSize: '1.75rem',
    fontWeight: '700',
    margin: 0,
    letterSpacing: '-0.02em',
  },
  brandDescription: {
    fontSize: '1rem',
    lineHeight: '1.7',
    margin: 0,
    opacity: 0.9,
  },
  socialLinks: {
    display: 'flex',
    gap: '1rem',
  },
  socialLink: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: Colors.pureWhite,
    textDecoration: 'none',
    fontSize: '1.2rem',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  linksSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    margin: 0,
    color: Colors.brightYellow,
  },
  linksList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  link: {
    color: Colors.pureWhite,
    textDecoration: 'none',
    fontSize: '1rem',
    opacity: 0.8,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    paddingLeft: '1rem',
  },
  contactSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  contactInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  contactIcon: {
    fontSize: '1.2rem',
    opacity: 0.8,
  },
  contactText: {
    fontSize: '1rem',
    opacity: 0.9,
  },
  downloadSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  downloadText: {
    fontSize: '1rem',
    lineHeight: '1.6',
    opacity: 0.9,
    margin: 0,
  },
  downloadButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.energyOrange,
    color: Colors.pureWhite,
    padding: '1rem 2rem',
    borderRadius: '50px',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: '600',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 4px 15px rgba(245, 126, 55, 0.4)',
    border: 'none',
    cursor: 'pointer',
    alignSelf: 'flex-start',
  },
  downloadButtonGlow: {
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)`,
    transition: 'left 0.6s ease',
  },
  bottomBar: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: '1.5rem 0',
    borderTop: '1px solid rgba(255,255,255,0.1)',
  },
  bottomContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  copyright: {
    fontSize: '0.9rem',
    opacity: 0.7,
    margin: 0,
  },
  bottomLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  bottomLink: {
    color: Colors.pureWhite,
    textDecoration: 'none',
    fontSize: '0.9rem',
    opacity: 0.7,
    transition: 'opacity 0.3s ease',
  },
  separator: {
    opacity: 0.5,
    fontSize: '0.8rem',
  },
};

// Add hover effects and animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .socialLink:hover {
    background-color: ${Colors.energyOrange} !important;
    transform: translateY(-2px) !important;
    box-shadow: 0 4px 12px rgba(245, 126, 55, 0.3) !important;
  }
  
  .link:hover {
    opacity: 1 !important;
    padding-left: 1.25rem !important;
  }
  
  .link::before {
    content: '→';
    position: absolute;
    left: 0;
    opacity: 0;
    transition: all 0.3s ease;
  }
  
  .link:hover::before {
    opacity: 1;
    left: -0.25rem;
  }
  
  .brandIcon:hover {
    transform: rotate(15deg) scale(1.1) !important;
  }
  
  .downloadButton:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 6px 20px rgba(245, 126, 55, 0.5) !important;
  }
  
  .downloadButton:hover .downloadButtonGlow {
    left: 100% !important;
  }
  
  .bottomLink:hover {
    opacity: 1 !important;
  }
  
  @media (max-width: 768px) {
    .container {
      grid-template-columns: 1fr !important;
      gap: 2rem !important;
      padding: 0 1.5rem 2rem !important;
    }
    
    .bottomContainer {
      flex-direction: column !important;
      text-align: center !important;
      padding: 0 1.5rem !important;
    }
    
    .downloadButton {
      align-self: stretch !important;
    }
  }
`;
document.head.appendChild(styleSheet);