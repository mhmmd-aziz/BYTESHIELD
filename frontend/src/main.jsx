import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import LandingPage from './pages/LandingPage.jsx'
import Scan from './pages/Scan.jsx'
import Features from './pages/Features.jsx'
import FAQ from './pages/FAQ.jsx'
import Report from './pages/Report.jsx'
import Login from './pages/Login.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import Guide from './pages/Guide.jsx'
import { GlobalLoadingProvider, useGlobalLoading } from './components/GlobalLoadingContext.jsx'
import { useLocation } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import './index.css'

const RouteChangeListener = () => {
  const location = useLocation();
  const { startLoading, stopLoading, setIsRouteTransitioning } = useGlobalLoading();
  const prevPath = useRef(location.pathname);

  useEffect(() => {
    if (prevPath.current !== location.pathname) {
      prevPath.current = location.pathname;
      setIsRouteTransitioning(true);
      startLoading('MEMUAT HALAMAN...', false, true);
      const timer = setTimeout(() => {
        setIsRouteTransitioning(false);
        stopLoading();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, startLoading, stopLoading, setIsRouteTransitioning]);

  return null;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GlobalLoadingProvider>
      <BrowserRouter>
        <RouteChangeListener />
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<LandingPage />} />
            <Route path="features" element={<Features />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="scan" element={<Scan />} />
            <Route path="guide" element={<Guide />} />
          </Route>
          <Route path="/report" element={<Report />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </GlobalLoadingProvider>
  </React.StrictMode>,
)
