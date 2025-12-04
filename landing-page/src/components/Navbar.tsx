import { Link } from 'react-router-dom';
import { Colors } from '../constants/colors';

export default function Navbar() {
  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>
          <span style={styles.logoText}>Küçük Kaşif</span>
        </Link>
        <div style={styles.links}>
          <Link to="/" style={styles.link}>Ana Sayfa</Link>
          <Link to="/download" style={styles.link}>İndir</Link>
          <Link to="/privacy" style={styles.link}>Gizlilik</Link>
          <Link to="/terms" style={styles.link}>Kullanım Şartları</Link>
        </div>
      </div>
    </nav>
  );
}

const styles: Record<string, React.CSSProperties> = {
  nav: {
    backgroundColor: Colors.spacePurple,
    padding: '1rem 0',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  logoText: {
    color: Colors.pureWhite,
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  links: {
    display: 'flex',
    gap: '2rem',
    alignItems: 'center',
  },
  link: {
    color: Colors.pureWhite,
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: '500',
    transition: 'color 0.3s',
  },
};
