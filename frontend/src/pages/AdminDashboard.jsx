import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, ShieldCheck, Activity, LogOut, Loader2, Database, LayoutDashboard, FileText, Settings, Download, Calendar, Filter, RefreshCw, ChevronDown } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGlobalLoading } from '../components/GlobalLoadingContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const CustomDropdown = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLabel = options.find(o => o.value === value)?.label || 'PILIH';

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-black/40 text-gray-300 border border-white/20 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-widest focus:outline-none hover:border-white/40 transition-colors shadow-sm"
      >
        <span>{selectedLabel}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 left-0 min-w-[180px] w-full bg-[#112240] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 backdrop-blur-xl"
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${value === opt.value ? 'bg-[#00A651]/20 text-[#00A651]' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}
              >
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AdminDashboard = () => {
  const location = useLocation();
  const path = location.pathname;
  let activeTab = 'dashboard';
  if (path.includes('/reports')) activeTab = 'reports';
  if (path.includes('/settings')) activeTab = 'settings';
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  const { startLoading, stopLoading, isRouteTransitioning } = useGlobalLoading();
  
  // Dashboard State
  const [dashDateRange, setDashDateRange] = useState('1week');
  const [dashCustomStart, setDashCustomStart] = useState('');
  const [dashCustomEnd, setDashCustomEnd] = useState('');
  const [dashCategory, setDashCategory] = useState('all');

  // Reports State
  const [reportsData, setReportsData] = useState([]);
  const [reportLoading, setReportLoading] = useState(false);
  const [dateRange, setDateRange] = useState('1week'); // 1day, 1week, 1month, 1year, custom
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [reportCategory, setReportCategory] = useState('all');

  const navigate = useNavigate();


  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/login');
      return;
    }
  }, [navigate]);

  useEffect(() => {
    fetchStats();
  }, [dashDateRange, dashCustomStart, dashCustomEnd]);

  useEffect(() => {
    if (activeTab === 'reports') {
      fetchReports();
    }
  }, [activeTab, dateRange, customStart, customEnd]);

  const fetchStats = async () => {
    try {
      if (isInitialLoad) {
        startLoading('MENGAKSES DASHBOARD ADMIN...', false, true);
      } else {
        setLoading(true);
      }
      
      let url = 'http://localhost:8000/api/admin/stats';
      let start = '';
      let end = '';
      const today = new Date();
      
      if (dashDateRange !== 'custom' && dashDateRange !== 'all') {
        end = today.toISOString().split('T')[0];
        const startDate = new Date();
        if (dashDateRange === '1day') startDate.setDate(today.getDate() - 1);
        if (dashDateRange === '1week') startDate.setDate(today.getDate() - 7);
        if (dashDateRange === '1month') startDate.setMonth(today.getMonth() - 1);
        if (dashDateRange === '1year') startDate.setFullYear(today.getFullYear() - 1);
        start = startDate.toISOString().split('T')[0];
      } else if (dashDateRange === 'custom') {
        start = dashCustomStart;
        end = dashCustomEnd;
      }

      if (start || end) {
        const params = new URLSearchParams();
        if (start) params.append('start_date', start);
        if (end) params.append('end_date', end);
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      if (isInitialLoad) {
        stopLoading();
        setIsInitialLoad(false);
      }
      setLoading(false);
    }
  };

  const fetchReports = async () => {
    setReportLoading(true);
    try {
      let url = 'http://localhost:8000/api/admin/reports';
      
      let start = '';
      let end = '';
      const today = new Date();
      
      if (dateRange !== 'custom' && dateRange !== 'all') {
        end = today.toISOString().split('T')[0];
        const startDate = new Date();
        if (dateRange === '1day') startDate.setDate(today.getDate() - 1);
        if (dateRange === '1week') startDate.setDate(today.getDate() - 7);
        if (dateRange === '1month') startDate.setMonth(today.getMonth() - 1);
        if (dateRange === '1year') startDate.setFullYear(today.getFullYear() - 1);
        start = startDate.toISOString().split('T')[0];
      } else if (dateRange === 'custom') {
        start = customStart;
        end = customEnd;
      }

      if (start || end) {
        const params = new URLSearchParams();
        if (start) params.append('start_date', start);
        if (end) params.append('end_date', end);
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setReportsData(data);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setReportLoading(false);
    }
  };

  const filteredReports = reportsData.filter(r => {
    if (reportCategory === 'all') return true;
    if (reportCategory === 'malware') return r.prediction === 'MALWARE';
    if (reportCategory === 'benign') return r.prediction === 'BENIGN';
    return true;
  });

  const exportExcel = () => {
    if (filteredReports.length === 0) {
      return MySwal.fire({
        icon: 'warning',
        title: 'Data Kosong',
        text: 'Tidak ada data untuk diekspor pada kategori ini'
      });
    }
    const ws = XLSX.utils.json_to_sheet(filteredReports.map(r => ({
      'ID': r.id,
      'Waktu': new Date(r.timestamp + 'Z').toLocaleString('id-ID'),
      'Nama File': r.filename,
      'Hasil': r.prediction,
      'Keyakinan': `${(r.confidence * 100).toFixed(2)}%`
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Laporan Scan");
    XLSX.writeFile(wb, `Laporan_ByteShield_${new Date().getTime()}.xlsx`);
  };

  const exportPDF = () => {
    if (filteredReports.length === 0) {
      return MySwal.fire({
        icon: 'warning',
        title: 'Data Kosong',
        text: 'Tidak ada data untuk diekspor pada kategori ini'
      });
    }
    const doc = new jsPDF();
    doc.text("Laporan Pemindaian ByteShield", 14, 15);
    
    const tableData = filteredReports.map(r => [
      new Date(r.timestamp + 'Z').toLocaleString('id-ID'),
      r.filename.length > 30 ? r.filename.substring(0,30) + '...' : r.filename,
      r.prediction,
      `${(r.confidence * 100).toFixed(2)}%`
    ]);

    autoTable(doc, {
      startY: 25,
      head: [['Waktu', 'Nama File', 'Hasil', 'Keyakinan']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [0, 166, 81] }
    });
    
    doc.save(`Laporan_ByteShield_${new Date().getTime()}.pdf`);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_username');
    navigate('/login');
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    MySwal.fire({
      icon: 'success',
      title: 'Berhasil',
      text: 'Kata sandi berhasil diperbarui (Simulasi)',
      showConfirmButton: false,
      timer: 1500
    });
  };

  const renderDashboard = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Dashboard Filter UI */}
      <div className="relative z-50 bg-black/30 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <h3 className="font-bold text-white uppercase tracking-widest text-sm drop-shadow-md">Filter Data Dashboard</h3>
            {loading && !isInitialLoad && (
              <RefreshCw className="w-4 h-4 text-[#00A651] animate-spin ml-2" />
            )}
          </div>
          
          <div className="flex flex-wrap gap-2 items-center">
            <CustomDropdown
              value={dashCategory}
              onChange={setDashCategory}
              options={[
                { value: 'all', label: 'Semua Kategori' },
                { value: 'malware', label: 'Malware' },
                { value: 'benign', label: 'Bersih' }
              ]}
            />
            <div className="w-px h-6 bg-white/20 mx-1"></div>
            {['1day', '1week', '1month', '1year', 'custom'].map((range) => (
              <button
                key={range}
                onClick={() => setDashDateRange(range)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                  dashDateRange === range 
                  ? 'bg-white/20 text-white shadow-md border border-white/30' 
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-transparent'
                }`}
              >
                {range === '1day' ? '1 Hari' : range === '1week' ? '1 Minggu' : range === '1month' ? '1 Bulan' : range === '1year' ? '1 Tahun' : 'Kustom'}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {dashDateRange === 'custom' && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex flex-col sm:flex-row items-center gap-4 pt-4 mt-4 border-t border-white/10"
            >
              <div className="flex-1 w-full">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Mulai Tanggal</label>
                <input 
                  type="date" 
                  value={dashCustomStart}
                  onChange={(e) => setDashCustomStart(e.target.value)}
                  className="w-full bg-black/40 border border-white/20 text-white placeholder-gray-500 rounded-xl px-4 py-2 focus:outline-none focus:border-[#00A651] [color-scheme:dark]"
                />
              </div>
              <div className="flex-1 w-full">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Sampai Tanggal</label>
                <input 
                  type="date" 
                  value={dashCustomEnd}
                  onChange={(e) => setDashCustomEnd(e.target.value)}
                  className="w-full bg-black/40 border border-white/20 text-white placeholder-gray-500 rounded-xl px-4 py-2 focus:outline-none focus:border-[#00A651] [color-scheme:dark]"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-black/30 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl flex items-center gap-6">
          <div className="bg-blue-500/20 p-4 rounded-xl text-blue-400 border border-blue-500/30">
            <Activity className="w-8 h-8" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Total Scan</p>
            <h2 className="text-4xl font-display text-white drop-shadow-sm">{stats?.total_scans || 0}</h2>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-black/30 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl flex items-center gap-6">
          <div className="bg-red-500/20 p-4 rounded-xl text-red-400 border border-red-500/30">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Malware Terdeteksi</p>
            <h2 className="text-4xl font-display text-white drop-shadow-sm">{stats?.total_malware || 0}</h2>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-black/30 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl flex items-center gap-6">
          <div className="bg-green-500/20 p-4 rounded-xl text-green-400 border border-green-500/30">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">File Bersih</p>
            <h2 className="text-4xl font-display text-white drop-shadow-sm">{stats?.total_benign || 0}</h2>
          </div>
        </motion.div>
      </div>

      {/* Chart Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-black/30 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl overflow-hidden mb-8 p-6">
          <h3 className="font-bold text-white uppercase tracking-widest text-sm mb-6 flex items-center drop-shadow-md">
            <Activity className="w-4 h-4 mr-2 text-gray-400" /> Tren Pemindaian
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.chart_data || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMalware" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorBenign" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold', color: '#fff' }}
                  labelStyle={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}
                />
                {(dashCategory === 'all' || dashCategory === 'malware') && (
                  <Area type="monotone" dataKey="malware" name="Malware" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorMalware)" />
                )}
                {(dashCategory === 'all' || dashCategory === 'benign') && (
                  <Area type="monotone" dataKey="benign" name="Benign" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorBenign)" />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
      </motion.div>

      {/* Recent Scans Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-black/30 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
          <h3 className="font-bold text-white uppercase tracking-widest text-sm flex items-center drop-shadow-md">
            <Database className="w-4 h-4 mr-2 text-gray-400" /> Riwayat Scan Terbaru
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-white/5 text-xs uppercase font-bold text-gray-400 border-b border-white/10">
              <tr>
                <th className="px-6 py-4">Waktu (WIB)</th>
                <th className="px-6 py-4">Nama File</th>
                <th className="px-6 py-4">Hasil Analisis</th>
                <th className="px-6 py-4 text-right">Keyakinan (AI)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {stats?.recent_scans && stats.recent_scans.length > 0 ? (
                stats.recent_scans.map((scan) => {
                  const date = new Date(scan.timestamp + 'Z');
                  const isMalware = scan.prediction === 'MALWARE';
                  
                  return (
                    <tr key={scan.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs whitespace-nowrap">
                        {date.toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-4 font-bold text-white truncate max-w-xs" title={scan.filename}>
                        {scan.filename}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border ${isMalware ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-green-500/20 text-green-400 border-green-500/30'}`}>
                          {isMalware ? <ShieldAlert className="w-3 h-3 mr-1" /> : <ShieldCheck className="w-3 h-3 mr-1" />}
                          {scan.prediction}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-right font-bold text-white">
                        {(scan.confidence * 100).toFixed(2)}%
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500 font-mono text-xs">
                    Belum ada riwayat pemindaian file.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );

  const renderReports = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="relative z-50 bg-black/30 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <h3 className="font-bold text-white uppercase tracking-widest text-sm drop-shadow-md">Filter Laporan</h3>
          </div>
          
          <div className="flex flex-wrap gap-2 items-center">
            <CustomDropdown
              value={reportCategory}
              onChange={setReportCategory}
              options={[
                { value: 'all', label: 'Semua Kategori' },
                { value: 'malware', label: 'Malware' },
                { value: 'benign', label: 'Bersih' }
              ]}
            />
            <div className="w-px h-6 bg-white/20 mx-1"></div>
            {['all', '1day', '1week', '1month', '1year', 'custom'].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                  dateRange === range 
                  ? 'bg-white/20 text-white shadow-md border border-white/30' 
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-transparent'
                }`}
              >
                {range === 'all' ? 'Semua' : range === '1day' ? '1 Hari' : range === '1week' ? '1 Minggu' : range === '1month' ? '1 Bulan' : range === '1year' ? '1 Tahun' : 'Kustom'}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {dateRange === 'custom' && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-white/10"
            >
              <div className="flex-1 w-full">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Mulai Tanggal</label>
                <input 
                  type="date" 
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  className="w-full bg-black/40 border border-white/20 text-white placeholder-gray-500 rounded-xl px-4 py-2 focus:outline-none focus:border-[#00A651] [color-scheme:dark]"
                />
              </div>
              <div className="flex-1 w-full">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Sampai Tanggal</label>
                <input 
                  type="date" 
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  className="w-full bg-black/40 border border-white/20 text-white placeholder-gray-500 rounded-xl px-4 py-2 focus:outline-none focus:border-[#00A651] [color-scheme:dark]"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-black/30 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/5">
          <h3 className="font-bold text-white uppercase tracking-widest text-sm flex items-center drop-shadow-md">
            <Database className="w-4 h-4 mr-2 text-gray-400" /> Data Riwayat Analisis
            <span className="ml-2 text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">{filteredReports.length} Data</span>
          </h3>
          <div className="flex flex-wrap items-center gap-2">
            <button 
              onClick={exportExcel}
              disabled={reportLoading}
              className="flex items-center gap-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4" /> Excel
            </button>
            <button 
              onClick={exportPDF}
              disabled={reportLoading}
              className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4" /> PDF
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto max-h-[500px]">
          {reportLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#00A651]" />
            </div>
          ) : (
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-black/60 text-xs uppercase font-bold text-gray-400 border-b border-white/10 sticky top-0 backdrop-blur-md z-10">
                <tr>
                  <th className="px-6 py-4">Waktu (WIB)</th>
                  <th className="px-6 py-4">Nama File</th>
                  <th className="px-6 py-4">Hasil Analisis</th>
                  <th className="px-6 py-4 text-right">Keyakinan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredReports.length > 0 ? (
                  filteredReports.map((report) => {
                    const date = new Date(report.timestamp + 'Z');
                    const isMalware = report.prediction === 'MALWARE';
                    
                    return (
                      <motion.tr 
                        key={report.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-white/5 transition-colors"
                      >
                        <td className="px-6 py-4 font-mono text-xs whitespace-nowrap">
                          {date.toLocaleString('id-ID')}
                        </td>
                        <td className="px-6 py-4 font-bold text-white truncate max-w-xs" title={report.filename}>
                          {report.filename}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border ${isMalware ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-green-500/20 text-green-400 border-green-500/30'}`}>
                            {isMalware ? <ShieldAlert className="w-3 h-3 mr-1" /> : <ShieldCheck className="w-3 h-3 mr-1" />}
                            {report.prediction}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono text-right font-bold text-white">
                          {(report.confidence * 100).toFixed(2)}%
                        </td>
                      </motion.tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500 font-mono text-xs">
                      Tidak ada riwayat pemindaian pada rentang waktu ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </motion.div>
  );

  const renderSettings = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl">
      <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} onSubmit={handleUpdatePassword} className="bg-black/30 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl p-6 mb-6">
        <h3 className="font-bold text-white uppercase tracking-widest text-sm mb-6 flex items-center border-b border-white/10 pb-4 drop-shadow-md">
          <Settings className="w-4 h-4 mr-2 text-gray-400" /> Pengaturan Sistem
        </h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Nama Pengguna (Admin)</label>
            <input 
              type="text" 
              value="admin"
              disabled
              className="w-full bg-white/5 border border-white/10 text-gray-500 rounded-xl px-4 py-3 font-mono cursor-not-allowed"
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Ubah Kata Sandi Baru</label>
            <input 
              type="password" 
              placeholder="Masukkan sandi baru..."
              className="w-full bg-black/40 border border-white/20 text-white placeholder-gray-500 rounded-xl px-4 py-3 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Konfirmasi Kata Sandi</label>
            <input 
              type="password" 
              placeholder="Ulangi sandi baru..."
              className="w-full bg-black/40 border border-white/20 text-white placeholder-gray-500 rounded-xl px-4 py-3 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
            />
          </div>
          
          <button type="submit" className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all w-full sm:w-auto shadow-md">
            Simpan Perubahan
          </button>
        </div>
      </motion.form>
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-blue-500/10 border border-blue-500/20 backdrop-blur-md rounded-2xl p-6 flex gap-4">
        <div className="mt-1"><Activity className="w-5 h-5 text-blue-400" /></div>
        <div>
          <h4 className="font-bold text-blue-300 text-sm mb-1 uppercase tracking-widest drop-shadow-sm">Informasi Sistem Mesin AI</h4>
          <p className="text-blue-100/70 text-xs leading-relaxed">
            Sistem analisis saat ini menggunakan model ResNet18 dengan bobot khusus yang dilatih dengan dataset lokal dan digabungkan dengan analisis Entropy hibrida. Ekspor data mencakup tingkat keyakinan (confidence score) akhir sistem.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );

  if (isRouteTransitioning) return null;

  return (
    <div className="min-h-screen font-sans flex relative overflow-hidden bg-[url('/login-bg.jpg')] bg-cover bg-center">
      {/* Heavy Blur Overlay & Glassmorphism Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md z-0"></div>
      
      {/* Sidebar */}
      <div className="w-64 bg-black/30 backdrop-blur-xl border-r border-white/10 fixed h-full z-40 flex-col hidden md:flex text-white shadow-2xl">
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <img src="/logo kosong no bg.png" alt="Logo" className="w-8 h-8 object-contain" />
          <div className="flex flex-col justify-center">
            <span className="font-display font-bold text-xl leading-none uppercase tracking-widest text-white drop-shadow-md">BYTESHIELD</span>
            <span className="text-[10px] mt-1.5 font-bold tracking-[0.2em] uppercase text-gray-400">Analisis Malware</span>
          </div>
        </div>
        <div className="flex-1 py-6 flex flex-col gap-2 px-4">
          <button 
            onClick={() => navigate('/admin')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'dashboard' ? 'bg-white/20 text-white shadow-inner' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </button>
          <button 
            onClick={() => navigate('/admin/reports')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'reports' ? 'bg-white/20 text-white shadow-inner' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}
          >
            <FileText className="w-4 h-4" />
            Laporan
          </button>
          <button 
            onClick={() => navigate('/admin/settings')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'settings' ? 'bg-white/20 text-white shadow-inner' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}
          >
            <Settings className="w-4 h-4" />
            Pengaturan
          </button>
        </div>
        <div className="p-4 border-t border-white/10 flex flex-col gap-4 mt-auto">
          {/* Cyber Vector Illustration */}
          <div className="w-full h-32 rounded-xl overflow-hidden border border-white/10 shadow-inner relative group">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 pointer-events-none"></div>
            <img 
              src="/sidebar_illustration.png" 
              alt="Cyber Core" 
              className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" 
            />
            <div className="absolute bottom-3 left-0 w-full flex justify-center z-20">
              <span className="text-[9px] font-bold tracking-widest uppercase text-green-400 border border-green-500/30 bg-green-500/10 px-2 py-0.5 rounded-full backdrop-blur-sm shadow-md">System Active</span>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="flex items-center justify-center w-full gap-2 bg-white/5 border border-white/10 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 text-gray-400 transition-all px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-widest shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            Keluar
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 p-4 sm:p-8 relative z-10">
        
        {/* Header Admin */}
        <div className="flex flex-col mb-8 gap-1">
          <h1 className="text-3xl font-display text-white uppercase tracking-widest font-bold drop-shadow-md">
            {activeTab === 'dashboard' && 'Dashboard Admin'}
            {activeTab === 'reports' && 'Laporan Analisis'}
            {activeTab === 'settings' && 'Pengaturan Sistem'}
          </h1>
          <p className="text-gray-300 font-mono text-sm drop-shadow">
            {activeTab === 'dashboard' && 'Pemantauan Lalu Lintas Analisis Malware Statis'}
            {activeTab === 'reports' && 'Ekspor dan Filter Riwayat Scan Berdasarkan Waktu'}
            {activeTab === 'settings' && 'Konfigurasi Akun Administrator'}
          </p>
        </div>

        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'reports' && renderReports()}
        {activeTab === 'settings' && renderSettings()}

      </div>
    </div>
  );
};

export default AdminDashboard;
