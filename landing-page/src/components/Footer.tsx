import { Link } from 'react-router-dom';
import { Colors } from '../constants/colors';

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.section}>
          <h3 style={styles.title}>Küçük Kaşif</h3>
          <p style={styles.description}>
            Çocuklar için eğlenceli ve eğitici oyunlarla dolu bir uzay macerası
          </p>
        </div>
        <div style={styles.section}>
          <h4 style={styles.heading}>Linkler</h4>
          <div style={styles.linkList}>
            <Link to="/" style={styles.link}>Ana Sayfa</Link>
            <Link to="/download" style={styles.link}>İndir</Link>
          </div>
        </div>
        <div style={styles.section}>
          <h4 style={styles.heading}>Yasal</h4>
          <div style={styles.linkList}>
            <Link to="/privacy" style={styles.link}>Gizlilik Politikası</Link>
            <Link to="/terms" style={styles.link}>Kullanım Şartları</Link>
          </div>
        </div>
      </div>
      <div style={styles.bottom}>
        <p style={styles.copyright}>© 2026 Küçük Kaşif. Tüm hakları saklıdır.</p>
      </div>
    </footer>
  );
}

const styles: Record<string, React.CSSProperties> = {
  footer: {
    backgroundColor: Colors.darkPurple,
    color: Colors.pureWhite,
    padding: '3rem 0 1rem',
    marginTop: 'auto',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: Colors.brightYellow,
    margin: 0,
  },
  heading: {
    fontSize: '1.1rem',
    fontWeight: '600',
    margin: 0,
  },
  description: {
    fontSize: '0.95rem',
    lineHeight: '1.6',
    margin: 0,
    opacity: 0.9,
  },
  linkList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  link: {
    color: Colors.pureWhite,
    textDecoration: 'none',
    fontSize: '0.95rem',
    opacity: 0.8,
    transition: 'opacity 0.3s',
  },
  bottom: {
    maxWidth: '1200px',
    margin: '2rem auto 0',
    padding: '1.5rem 2rem 0',
    borderTop: `1px solid rgba(255,255,255,0.1)`,
    textAlign: 'center',
  },
  copyright: {
    fontSize: '0.9rem',
    opacity: 0.7,
    margin: 0,
  },
};
