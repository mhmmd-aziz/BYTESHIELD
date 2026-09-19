import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck, LogIn, Home, Layers, HelpCircle, ScanLine, BookOpen } from 'lucide-react';
import { useGlobalLoading } from './components/GlobalLoadingContext';
import ClickSpark from './components/ClickSpark';
import RubberSegment from './components/RubberSegment';

function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [navTheme, setNavTheme] = useState('light');
  const location = useLocation();
  const navigate = useNavigate();
  const { isRouteTransitioning } = useGlobalLoading();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      const darkSections = document.querySelectorAll('.dark-section-for-nav');
      let isOverDark = false;
      const navCenterY = 50; // Posisi vertikal tengah navbar
      
      darkSections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= navCenterY && rect.bottom >= navCenterY) {
          isOverDark = true;
        }
      });
      setNavTheme(isOverDark ? 'dark' : 'light');
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { startLoading, stopLoading, updateProgress } = useGlobalLoading();
  const [prevLocation, setPrevLocation] = useState(location.pathname);

  // Trigger loading on route transition
  useEffect(() => {
    if (location.pathname !== prevLocation) {
      setPrevLocation(location.pathname);
      window.scrollTo(0, 0); // Reset scroll position to top
      startLoading('Membuka halaman...', false, true); // showPct = false, useShape = true
      
      // We don't really need to update progress if it's hidden, but keeping the short delay
      setTimeout(() => {
        stopLoading();
      }, 400); // 400ms fake loading for route transition
    }
  }, [location.pathname, prevLocation, startLoading, stopLoading, updateProgress]);

  // Wrapper handles the sticky/absolute positioning and outer padding to make it float
  const wrapperClass = isScrolled 
    ? 'fixed top-4 w-full z-50 px-4 sm:px-6 transition-all duration-500'
    : 'absolute top-6 w-full z-50 px-4 sm:px-6 transition-all duration-500';

  const isHomePage = location.pathname === '/';

  // The actual navbar is a highly transparent white frosted glass pill (bokeh effect)
  const navClass = navTheme === 'dark'
    ? 'max-w-[85rem] mx-auto bg-black/40 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-white/10 rounded-[1.5rem] transition-all duration-500'
    : isHomePage
      ? 'max-w-[85rem] mx-auto bg-white/30 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.05)] border border-white/40 rounded-[1.5rem] transition-all duration-500'
      : 'max-w-[85rem] mx-auto bg-white/60 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-gray-200/80 rounded-[1.5rem] transition-all duration-500';

  const navItems = [
    { label: 'Home', value: '/', icon: <Home className="w-4 h-4" /> },
    { label: 'Features', value: '/features', icon: <Layers className="w-4 h-4" /> },
    { label: 'FAQ', value: '/faq', icon: <HelpCircle className="w-4 h-4" /> },
    { label: 'Panduan', value: '/guide', icon: <BookOpen className="w-4 h-4" /> },
    { label: 'Pindai', value: '/scan', icon: <ScanLine className="w-4 h-4" /> },
  ];

  const handleNavChange = (val) => {
    navigate(val);
  };

  return (
    <ClickSpark sparkColor="#00A651" sparkSize={12} sparkRadius={20} sparkCount={10}>
      <div className="min-h-screen flex flex-col font-sans bg-k3-light/30">
        
        <div className={wrapperClass}>
          <nav className={navClass}>
            <div className="px-6 lg:px-8">
              <div className="flex justify-between h-[4.5rem] items-center">
                
                {/* Left side: Logos and Brand */}
                <div className="flex items-center">
                  <div className="flex items-center">
                    <img src="/logo kosong no bg.png" alt="ByteShield Logo" className="h-8 w-8 object-contain" />
                  </div>
                  <div className={`h-8 border-l mx-6 transition-colors duration-500 ${navTheme === 'dark' ? 'border-white/20' : 'border-slate-300/50'}`}></div> {/* Vertical Separator */}
                  <div className="flex flex-col justify-center">
                    <Link to="/" className={`text-2xl font-bold leading-none font-display uppercase tracking-[0.15em] transition-colors duration-500 ${navTheme === 'dark' ? 'text-white' : 'text-[#007A3B]'}`}>
                      BYTESHIELD
                    </Link>
                    <span className={`text-[10px] mt-1.5 font-bold tracking-[0.2em] uppercase transition-colors duration-500 ${navTheme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
                      Analisis Malware
                    </span>
                  </div>
                </div>

                {/* Right side: Navigation & Login */}
                <div className="flex items-center space-x-4">
                  <div className="hidden lg:block mr-2">
                    <RubberSegment
                      className={`backdrop-blur-md border transition-colors duration-500 shadow-sm ${navTheme === 'dark' ? 'border-white/20' : 'border-slate-300/50'}`}
                      items={navItems}
                      value={location.pathname}
                      onChange={handleNavChange}
                      trackColor={navTheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}
                      thumbColor="#00A651"
                      textColor={navTheme === 'dark' ? '#ffffff' : '#0f172a'}
                      activeTextColor="#ffffff"
                      size="md"
                      radius={999}
                      inset={4}
                      equalSlots={false}
                    />
                  </div>
                  
                  <Link to="/login" className="flex items-center space-x-2 bg-[#00A651] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#007A3B] transition-colors shadow-md hover:shadow-lg hover:-translate-y-0.5">
                    <LogIn className="h-4 w-4" />
                    <span>Masuk</span>
                  </Link>
                </div>
                
              </div>
            </div>
          </nav>
        </div>

        <main className={`flex-grow ${!['/', '/guide', '/features', '/faq'].includes(location.pathname) ? 'pt-32' : ''}`}>
          {!isRouteTransitioning && <Outlet />}
        </main>

        <footer className="bg-white border-t border-gray-200 mt-auto">
          <div className="max-w-[90rem] mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <ShieldCheck className="h-5 w-5 text-gray-400" />
              <span className="font-semibold text-gray-700 font-display tracking-widest uppercase">ByteShield</span>
            </div>
            <div>© 2026 ByteShield Systems. Hak cipta dilindungi.</div>
          </div>
        </footer>
      </div>
    </ClickSpark>
  );
}

export default App;
