import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield } from 'lucide-react';

const GlobalLoadingContext = createContext();

export const useGlobalLoading = () => useContext(GlobalLoadingContext);

export const GlobalLoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [message, setMessage] = useState('');
  const [showPercentage, setShowPercentage] = useState(true);
  const [useShape, setUseShape] = useState(true);
  const [isRouteTransitioning, setIsRouteTransitioning] = useState(false);

  const startLoading = useCallback((msg = 'Memuat...', showPct = true, withShape = true) => {
    setMessage(msg);
    setProgress(0);
    setShowPercentage(showPct);
    setUseShape(withShape);
    setIsLoading(true);
  }, []);

  const updateProgress = useCallback((val) => {
    setProgress(val);
  }, []);

  const stopLoading = useCallback(() => {
    setProgress(100);
    // Tambahkan delay sedikit agar efek 100% terlihat
    setTimeout(() => {
      setIsLoading(false);
    }, 400);
  }, []);

  return (
    <GlobalLoadingContext.Provider value={{ startLoading, updateProgress, stopLoading, isLoading, isRouteTransitioning, setIsRouteTransitioning }}>
      {children}
      
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center font-display"
          >
            {/* 1. Green Shape Sweeping Right/Left (Hanya tampil jika useShape = true) */}
            {useShape && (
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
                className="absolute inset-0 bg-[#00A651] z-0"
              />
            )}

            {/* 2. Blur Background that fades in after the green sweep */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: useShape ? 0.2 : 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-2xl z-10"
            />

            {/* 3. Content (Logo & Percentage) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4, delay: useShape ? 0.3 : 0.1 }}
              className="relative z-20 flex flex-col items-center justify-center"
            >
              <div className="relative flex flex-col items-center justify-center">
                {/* Logo Kosong (No BG) dari folder public */}
                <img src="/logo kosong no bg.png" alt="ByteShield Logo" className="w-24 h-24 object-contain animate-pulse drop-shadow-[0_0_15px_rgba(0,166,81,0.5)]" />
                
                {/* Percentage Text BELOW the logo */}
                {showPercentage && (
                  <div className="mt-6 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-white tracking-widest font-mono">
                      {Math.round(progress)}
                      <span className="text-xl text-[#00A651] ml-1">%</span>
                    </span>
                  </div>
                )}
              </div>

              <motion.p 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-6 text-[#00A651] tracking-[0.2em] uppercase text-sm font-bold drop-shadow-md"
              >
                {message}
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlobalLoadingContext.Provider>
  );
};
