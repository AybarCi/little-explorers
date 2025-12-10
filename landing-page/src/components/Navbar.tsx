import { Link, useLocation } from 'react-router-dom';
import { Colors } from '../constants/colors';
import { useState, useEffect } from 'react';
import logo from '../assets/logo.png';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { path: '/', label: 'Ana Sayfa' },
    { path: '/download', label: 'İndir' },
    { path: '/privacy', label: 'Gizlilik' },
    { path: '/terms', label: 'Kullanım Şartları' }
  ];

  return (
    <>
      <nav style={{
        ...styles.nav,
        ...(isScrolled ? styles.navScrolled : {}),
        background: `linear-gradient(45deg, ${Colors.spacePurple}, ${Colors.darkPurple})`,
      }}>
        <div style={styles.container}>
          <Link 
            to="/" 
            style={styles.logo}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <img src={logo} alt="Küçük Kaşif Logo" style={styles.logoImage} />
            <span style={{
              ...styles.logoText,
              color: Colors.pureWhite,
              fontWeight: '900',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}>🌟 Küçük Kaşif 🌟</span>
          </Link>
          
          <div style={styles.desktopLinks}>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  ...styles.link,
                  ...(location.pathname === item.path ? styles.linkActive : {})
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <button
            style={styles.mobileMenuButton}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menüyü aç"
          >
            <div style={{
              ...styles.hamburgerLine,
              transform: isMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none'
            }}></div>
            <div style={{
              ...styles.hamburgerLine,
              opacity: isMenuOpen ? 0 : 1
            }}></div>
            <div style={{
              ...styles.hamburgerLine,
              transform: isMenuOpen ? 'rotate(-45deg) translate(7px, -6px)' : 'none'
            }}></div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div style={{
          ...styles.mobileMenu,
          transform: isMenuOpen ? 'translateY(0)' : 'translateY(-100%)',
          opacity: isMenuOpen ? 1 : 0
        }}>
          <div style={styles.mobileMenuContainer}>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                style={styles.mobileLink}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Backdrop for mobile menu */}
      {isMenuOpen && (
        <div
          style={styles.backdrop}
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  nav: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(65, 49, 122, 0.1)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    padding: '0.5rem 0',
  },
  navScrolled: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
    padding: '1rem 0',
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
    gap: '0.75rem',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  logoImage: {
    width: '55px',
    height: '55px',
    objectFit: 'contain',
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
    transition: 'transform 0.3s ease',
  },
  logoText: {
    color: Colors.pureWhite,
    fontSize: '1.5rem',
    fontWeight: '800',
    letterSpacing: '-0.01em',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
  },
  desktopLinks: {
    display: 'flex',
    gap: '2.5rem',
    alignItems: 'center',
  },
  link: {
    color: Colors.pureWhite,
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: '700',
    position: 'relative',
    padding: '0.5rem 0',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: 0.9,
    textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
  },
  linkActive: {
    opacity: 1,
  },
  linkHover: {
    opacity: 1,
  },
  mobileMenuButton: {
    display: 'none',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.5rem',
    flexDirection: 'column',
    gap: '4px',
  },
  hamburgerLine: {
    width: '25px',
    height: '2px',
    backgroundColor: Colors.spacePurple,
    transition: 'all 0.3s ease',
  },
  mobileMenu: {
    display: 'none',
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderTop: '1px solid rgba(65, 49, 122, 0.1)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  mobileMenuContainer: {
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  mobileLink: {
    color: Colors.spacePurple,
    textDecoration: 'none',
    fontSize: '1.1rem',
    fontWeight: '500',
    padding: '0.75rem 0',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: 0.8,
  },
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 999,
  },
};

// Add responsive styles and hover effects
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-10px); }
    60% { transform: translateY(-5px); }
  }
  
  .link::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: ${Colors.pureWhite};
    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .link:hover::after,
  .linkActive::after {
    width: 100%;
  }
  
  .link:hover,
  .mobileLink:hover {
    opacity: 1 !important;
  }
  
  .logo:hover .logoImage {
    transform: scale(1.1);
  }
  
  @media (max-width: 768px) {
    .desktopLinks {
      display: none !important;
    }
    
    .mobileMenuButton {
      display: flex !important;
    }
    
    .mobileMenu {
      display: block !important;
    }
    
    .nav {
      padding: 0.75rem 0 !important;
    }
    
    .logoText {
      font-size: 1.5rem !important;
    }
    
    .logoImage {
      width: 50px !important;
      height: 50px !important;
    }
    
    .container {
      padding: 0 1.5rem !important;
    }
  }
`;
document.head.appendChild(styleSheet);