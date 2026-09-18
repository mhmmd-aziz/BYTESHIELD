import { useState, useRef } from 'react';
import { UploadCloud, AlertTriangle, FileText as FileBinary, Loader2, Play, ShieldAlert, ShieldCheck as LucideShieldCheck, ArrowRight } from 'lucide-react';
import { useGlobalLoading } from '../components/GlobalLoadingContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const API_URL = 'http://localhost:8000/api/analyze';
const BASE_URL = 'http://localhost:8000';

const MalwareAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setResult(null);
    }
  };

  const { startLoading, updateProgress, stopLoading } = useGlobalLoading();

  const handleUpload = () => {
    if (!file) return;
    
    setIsLoading(true);
    // startLoading(message, showPct, useShape)
    startLoading(`Memindai ${file.name}...`, true, true);
    
    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', API_URL, true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        // We map upload progress to 0-80% of the loading bar
        // The last 20% is reserved for backend inference
        const percentComplete = (event.loaded / event.total) * 80;
        updateProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        // Fake the inference progress
        updateProgress(95);
        setTimeout(() => {
          const data = JSON.parse(xhr.responseText);
          setResult(data);
          stopLoading();
          setIsLoading(false);
        }, 500); // 500ms for dramatic effect
      } else {
        console.error("Error uploading file:", xhr.responseText);
        MySwal.fire({
          icon: 'error',
          title: 'Gagal',
          text: 'Gagal terhubung ke server backend. Pastikan server sedang berjalan.'
        });
        stopLoading();
        setIsLoading(false);
      }
    };

    xhr.onerror = () => {
      console.error("XHR Error");
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Gagal terhubung ke server backend.'
      });
      stopLoading();
      setIsLoading(false);
    };

    xhr.send(formData);
  };

  return (
    <div className="flex flex-col max-w-5xl mx-auto">
      {/* Unified Light Container */}
      <div className="bg-white rounded-[2rem] shadow-xl p-6 md:p-10 border border-gray-200 flex flex-col min-h-[550px] relative overflow-hidden">
        
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none"></div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-5 relative z-10">
          <h2 className="text-xs md:text-sm font-bold flex items-center text-gray-500 font-mono tracking-widest uppercase">
            <FileBinary className="mr-3 text-k3-green h-5 w-5" /> ANALISIS EXECUTABLE STATIS
          </h2>
          <div className="flex items-center gap-2 bg-green-50 border border-green-100 px-3 py-1.5 rounded-full">
            <LucideShieldCheck className="w-4 h-4 text-k3-green" />
            <span className="text-[10px] text-green-700 font-bold uppercase tracking-wider hidden sm:inline">SISTEM SIAP</span>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="flex-grow flex flex-col items-center justify-center relative z-10 w-full mb-8">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full flex flex-col md:flex-row items-center gap-10 bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-200">
                
                {/* Byteplot Preview */}
                <div className="w-56 h-56 md:w-72 md:h-72 flex-shrink-0 bg-white border border-gray-200 rounded-xl overflow-hidden relative shadow-lg">
                   <div className="absolute top-0 left-0 bg-white/90 backdrop-blur-md text-[10px] text-gray-500 px-3 py-2 z-10 w-full font-mono flex justify-between border-b border-gray-200">
                     <span>BYTEPLOT</span>
                     <span>256×256</span>
                   </div>
                   <img src={`${BASE_URL}${result.byteplot}`} alt="Byteplot" className="w-full h-full object-cover mt-8" />
                </div>
                
                {/* Result Text */}
                <div className="flex flex-col items-start w-full">
                  <div className={`text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4 border ${result.prediction === 'MALWARE' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-green-50 text-k3-green border-green-200'}`}>
                    {result.prediction === 'MALWARE' ? 'Ancaman Terdeteksi' : 'File Bersih (Benign)'}
                  </div>
                  
                  <h3 className="text-4xl md:text-6xl font-display text-gray-900 tracking-tight mb-3 flex items-center">
                    {result.prediction} 
                    {result.prediction === 'MALWARE' ? <ShieldAlert className="ml-4 text-red-500 w-12 h-12" /> : <LucideShieldCheck className="ml-4 text-k3-green w-12 h-12" />}
                  </h3>
                  
                  <p className="text-gray-500 font-mono mb-8 text-sm">
                    <span className="text-gray-400">Tingkat Keyakinan (AI Confidence): </span> 
                    <span className="text-gray-900 font-bold">{(result.confidence * 100).toFixed(2)}%</span>
                  </p>

                  <div className="w-full bg-white rounded-xl p-5 border border-gray-200 font-mono text-xs text-gray-600 flex flex-col gap-3 mb-6 shadow-sm">
                    <div className="flex justify-between border-b border-gray-100 pb-3"><span>Nama File:</span><span className="text-gray-800 font-bold truncate ml-4" title={result.filename}>{result.filename}</span></div>
                    <div className="flex justify-between border-b border-gray-100 pb-3"><span>SHA-256:</span><span className="text-gray-800 font-bold truncate ml-4" title={result.sha256}>{result.sha256}</span></div>
                    <div className="flex justify-between border-b border-gray-100 pb-3"><span>Model Deteksi:</span><span className="text-k3-green font-bold">{result.model?.name || 'ResNet18 CNN'}</span></div>
                    <div className="flex justify-between"><span>Database/Dataset:</span><span className="text-k3-green font-bold">{result.model?.dataset || 'MaleX 200K'}</span></div>
                  </div>

                  <button 
                    onClick={() => navigate('/report', { state: { reportData: result } })}
                    className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 transition-all py-4 rounded-xl font-bold uppercase tracking-widest text-xs group shadow-sm"
                  >
                    Buka Laporan Forensik <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-400 flex flex-col items-center justify-center flex-grow py-12">
                <AlertTriangle className="w-16 h-16 mb-4 opacity-20 text-gray-400" />
                <p className="font-mono text-xs md:text-sm text-center uppercase tracking-widest leading-relaxed">Tidak ada executable yang dimuat.<br/>Silakan unggah file untuk memulai analisis.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Upload Control Embedded in Light UI */}
        <div className="mt-auto relative z-10 w-full">
          <div className="bg-white rounded-2xl p-2 md:p-3 border border-gray-200 flex flex-col sm:flex-row items-center gap-3 md:gap-4 shadow-sm">
            <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileSelect} accept=".exe,.dll" />
            
            <button onClick={() => fileInputRef.current.click()} className="w-full sm:flex-1 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl p-4 flex items-center justify-center gap-4 transition-colors group">
              {file ? (
                <>
                  <FileBinary className="w-6 h-6 text-k3-green" />
                  <div className="flex flex-col items-start">
                     <span className="font-bold text-gray-800 text-sm md:text-base truncate max-w-[200px] md:max-w-[300px]">{file.name}</span>
                     <span className="text-[10px] text-gray-500 uppercase tracking-wider">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                </>
              ) : (
                <>
                  <UploadCloud className="w-6 h-6 text-gray-400 group-hover:text-k3-green transition-colors" />
                  <div className="flex flex-col items-start">
                     <span className="font-bold text-gray-700 text-sm md:text-base">Unggah Executable Windows</span>
                     <span className="text-[10px] text-gray-500 uppercase tracking-wider">Hanya format .exe / .dll</span>
                  </div>
                </>
              )}
            </button>

            <button 
              onClick={handleUpload} 
              disabled={!file || isLoading} 
              className="w-full sm:w-auto px-10 py-5 rounded-xl font-bold text-sm uppercase tracking-wider flex items-center justify-center transition-all shadow-lg active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed text-white bg-k3-green hover:bg-green-600 disabled:hover:bg-k3-green"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 mr-2" />}
              {isLoading ? '' : 'MULAI ANALISIS'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] pt-8 pb-20">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-display text-gray-900 tracking-tight uppercase">Sandbox Deep Learning</h1>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto font-medium text-lg">Unggah file executable. Tanpa eksekusi manual. 100% Analisis Statis Aman.</p>
        </div>

        <MalwareAnalyzer />
      </div>
    </div>
  );
};

export default Dashboard;
