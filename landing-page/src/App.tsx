import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Download from './pages/Download';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // Add smooth scrolling behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add global styles for better performance
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
          'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
          sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        background-color: #ffffff;
        color: #1a1a1a;
        line-height: 1.6;
      }
      
      html {
        scroll-behavior: smooth;
      }
      
      /* Custom scrollbar */
      ::-webkit-scrollbar {
        width: 8px;
      }
      
      ::-webkit-scrollbar-track {
        background: #f1f1f1;
      }
      
      ::-webkit-scrollbar-thumb {
        background: #41317A;
        border-radius: 4px;
      }
      
      ::-webkit-scrollbar-thumb:hover {
        background: #2A1F54;
      }
      
      /* Selection color */
      ::selection {
        background: rgba(245, 126, 55, 0.3);
      }
      
      /* Focus styles for accessibility */
      button:focus,
      a:focus {
        outline: 2px solid #F57E37;
        outline-offset: 2px;
      }
      
      /* Loading animation for images */
      img {
        transition: opacity 0.3s ease;
      }
      
      img[loading="lazy"] {
        opacity: 0;
      }
      
      img[loading="lazy"].loaded {
        opacity: 1;
      }
      
      /* Performance optimizations */
      .will-animate {
        will-change: transform, opacity;
      }
      
      /* Reduce motion for users who prefer it */
      @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }
    `;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  return (
    <BrowserRouter>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        position: 'relative'
      }}>
        <Navbar />
        <main style={{
          flex: 1,
          paddingTop: '80px' // Account for fixed navbar
        }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/download" element={<Download />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;