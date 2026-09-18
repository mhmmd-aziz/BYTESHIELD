import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { ShieldAlert, ShieldCheck, ArrowLeft, FileText, Database, Activity, Code, HardDrive, Hash, CheckCircle2, AlertTriangle, Fingerprint } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useGlobalLoading } from '../components/GlobalLoadingContext';

const BASE_URL = 'http://localhost:8000';

const InfoRow = ({ label, value, icon: Icon, valueClass = "text-gray-900 font-bold" }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-gray-200 last:border-0 gap-2">
    <div className="flex items-center text-gray-500 text-sm">
      {Icon && <Icon className="w-4 h-4 mr-2 opacity-70" />}
      {label}
    </div>
    <div className={`font-mono text-sm break-all ${valueClass}`}>
      {value}
    </div>
  </div>
);

const ProgressBar = ({ label, percentage, colorClass }) => (
  <div className="mb-4 last:mb-0">
    <div className="flex justify-between text-xs mb-1 font-mono">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-900 font-bold">{(percentage * 100).toFixed(2)}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${percentage * 100}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={`h-2 rounded-full ${colorClass}`}
      />
    </div>
  </div>
);

const Report = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const reportData = location.state?.reportData;
  const { isRouteTransitioning } = useGlobalLoading();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isRouteTransitioning) return null;

  if (!reportData) {
    return <Navigate to="/dashboard" replace />;
  }

  const isMalware = reportData.prediction === 'MALWARE';
  const themeColor = isMalware ? 'red' : 'green';
  const ThemeIcon = isMalware ? ShieldAlert : ShieldCheck;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-600 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6 pt-16 md:pt-10">
        
        {/* Header / Nav */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
        >
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700 transition-all px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest shadow-sm group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Kembali ke Dasbor
          </button>
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full font-mono text-xs text-gray-600 shadow-sm">
            <Fingerprint className="w-4 h-4 text-gray-400" />
            <span>{reportData.sha256.substring(0, 12)}</span>
          </div>
        </motion.div>

        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`relative overflow-hidden rounded-[2rem] border shadow-sm ${isMalware ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'} p-8 md:p-12`}
        >
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold tracking-widest uppercase mb-6 ${isMalware ? 'bg-red-100 text-red-600 border border-red-200' : 'bg-green-100 text-k3-green border border-green-200'}`}>
                {isMalware ? 'Ancaman Terdeteksi' : 'File Bersih'}
              </div>
              <h1 className="text-4xl md:text-6xl font-display text-gray-900 mb-4 break-all leading-tight">
                {reportData.filename}
              </h1>
              <div className="flex flex-wrap items-center gap-6 font-mono text-sm">
                <span className="flex items-center text-gray-500">
                  <HardDrive className="w-4 h-4 mr-2" />
                  {reportData.file_size_mb.toFixed(2)} MB
                </span>
                <span className="flex items-center text-gray-500">
                  <Database className="w-4 h-4 mr-2" />
                  Analisis AI Statis
                </span>
              </div>
            </div>
            <div className="shrink-0 flex flex-col items-center">
              <ThemeIcon className={`w-32 h-32 ${isMalware ? 'text-red-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.2)]' : 'text-[#00A651] drop-shadow-[0_0_30px_rgba(0,166,81,0.2)]'}`} />
              <div className="mt-4 font-display text-3xl text-gray-900">
                {(reportData.confidence * 100).toFixed(2)}%
              </div>
              <div className="text-xs text-gray-500 font-mono tracking-widest uppercase">Tingkat Keyakinan</div>
            </div>
          </div>

          {/* Grid Background Effect */}
          <div className="absolute inset-0 pointer-events-none opacity-20" 
               style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.1) 1px, transparent 0)', backgroundSize: '32px 32px' }} 
          />
        </motion.div>

        {/* Detailed Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Byteplot & AI Breakdown */}
          <div className="lg:col-span-1 space-y-6">
            {/* Byteplot Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-gray-900 font-bold mb-4 flex items-center tracking-wider text-sm"><Code className="w-4 h-4 mr-2 text-blue-500" /> VISUALISASI BYTEPLOT</h3>
              <div className="aspect-square bg-white border border-gray-200 rounded-xl overflow-hidden relative shadow-inner">
                 <img src={`${BASE_URL}${reportData.byteplot}`} alt="Byteplot" className="w-full h-full object-cover grayscale" />
                 <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-md px-2 py-1 rounded text-[10px] font-mono text-gray-600 border border-gray-200">256x256</div>
              </div>
              <p className="text-xs text-gray-500 mt-4 leading-relaxed">
                Visualisasi biner file dalam matriks 2D. Malware seringkali memiliki pola tekstur yang khas akibat proses obfuscation atau struktur statisnya.
              </p>
            </motion.div>

            {/* AI Breakdown Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-gray-900 font-bold mb-6 flex items-center tracking-wider text-sm"><Activity className="w-4 h-4 mr-2 text-purple-500" /> RINCIAN MESIN AI</h3>
              
              <ProgressBar 
                label="Inferensi CNN (ResNet18)" 
                percentage={reportData.cnn_malware_prob} 
                colorClass={reportData.cnn_malware_prob > 0.5 ? 'bg-red-500' : 'bg-[#00A651]'} 
              />
              
              <div className="my-4 border-t border-gray-100"></div>
              
              <ProgressBar 
                label="Heuristik (Entropi/Ukuran)" 
                percentage={reportData.entropy_malware_prob} 
                colorClass={reportData.entropy_malware_prob > 0.5 ? 'bg-red-500' : 'bg-[#00A651]'} 
              />
              
              <div className="mt-6 bg-gray-50 rounded-lg p-3 border border-gray-200 flex items-start gap-3">
                {isMalware ? <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" /> : <CheckCircle2 className="w-5 h-5 text-[#00A651] shrink-0" />}
                <p className="text-xs text-gray-600 leading-relaxed">
                  {isMalware 
                    ? "Mesin hibrida mendeteksi anomali yang kuat. Kombinasi analisis tekstur biner dan tingkat entropi menunjukkan karakteristik perangkat lunak berbahaya."
                    : "File ini bersih. Baik model CNN maupun analisis entropi heuristik tidak mendeteksi adanya tanda-tanda obfuscation atau malicious payload."}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Properties & Hashes */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* File Properties Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-gray-900 font-bold mb-6 flex items-center tracking-wider text-sm"><FileText className="w-4 h-4 mr-2 text-yellow-500" /> PROPERTI FILE</h3>
              <div className="space-y-1">
                <InfoRow label="Nama File" value={reportData.filename} />
                <InfoRow label="Ukuran File" value={`${reportData.file_size_bytes.toLocaleString()} Bytes`} />
                <InfoRow label="Megabyte" value={`${reportData.file_size_mb.toFixed(2)} MB`} />
                <InfoRow 
                  label="Byte Ajaib (Magic Bytes)" 
                  value={reportData.magic_bytes} 
                  valueClass="text-yellow-600 tracking-widest font-bold"
                />
                <InfoRow 
                  label="Entropy Score" 
                  value={`${reportData.entropy.toFixed(4)} / 8.0000`} 
                  valueClass={reportData.entropy > 6.8 ? 'text-red-500 font-bold' : (reportData.entropy > 6.0 ? 'text-yellow-600 font-bold' : 'text-[#00A651] font-bold')}
                />
              </div>
            </motion.div>

            {/* Cryptographic Hashes Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-gray-900 font-bold mb-6 flex items-center tracking-wider text-sm"><Fingerprint className="w-4 h-4 mr-2 text-cyan-600" /> HASH KRIPTOGRAFI (IoC)</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-xs text-gray-500 mb-1 flex items-center"><Hash className="w-3 h-3 mr-1"/> SHA-256</div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 font-mono text-sm text-gray-800 break-all select-all shadow-inner">
                    {reportData.sha256}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1 flex items-center"><Hash className="w-3 h-3 mr-1"/> SHA-1</div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 font-mono text-sm text-gray-800 break-all select-all shadow-inner">
                    {reportData.sha1}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1 flex items-center"><Hash className="w-3 h-3 mr-1"/> MD5</div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 font-mono text-sm text-gray-800 break-all select-all shadow-inner">
                    {reportData.md5}
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-6 italic">
                * Hash adalah sidik jari digital unik yang digunakan sebagai Indicators of Compromise (IoC) untuk melakukan pencarian di berbagai platform intelijen ancaman.
              </p>
            </motion.div>

          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Report;
