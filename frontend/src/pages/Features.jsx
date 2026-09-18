import { motion } from 'framer-motion';
import { Cpu, ShieldAlert, Zap, ShieldCheck, Activity, FileText } from 'lucide-react';

const Features = () => {
  return (
    <div className="font-sans">
      
      {/* Section 1: Hero / Header */}
      <section className="pt-40 pb-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-green-50 to-transparent rounded-full blur-[100px] opacity-60"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-display text-gray-900 leading-[0.9] uppercase tracking-tight mb-6"
            >
              Teknologi di Balik <span className="text-[#00A651]">ByteShield</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-600 leading-relaxed"
            >
              Kami menggunakan arsitektur Deep Learning tercanggih yang dirancang khusus untuk mendeteksi malware secara statis, mencegah ancaman sebelum dieksekusi.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Section 2: Deep Learning (CNN) - Light Green Background */}
      <section className="py-24 bg-[#F2FBF5] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            <motion.div 
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
              className="flex flex-col justify-center"
            >
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-green-100">
                <ShieldAlert className="text-[#00A651] w-8 h-8" />
              </div>
              <h2 className="text-5xl md:text-7xl font-display text-gray-900 leading-[0.9] uppercase tracking-tight mb-6">Klasifikasi Deep Learning (CNN)</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Sistem kami ditenagai oleh model Convolutional Neural Network (CNN) seperti ResNet18 yang telah dilatih secara khusus dengan dataset MaleX 200K. Model ini mampu mengenali pola tersembunyi dari struktur *binary* file executable Windows.
              </p>
              <ul className="space-y-3">
                {['Akurasi deteksi tingkat tinggi pada pola zero-day malware', 'Model berukuran ringan dan sangat cepat', 'Tidak memerlukan eksekusi file berbahaya'].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <ShieldCheck className="w-6 h-6 text-[#00A651] mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.3 }}
              className="bg-white rounded-3xl p-8 shadow-lg border border-green-50 flex items-center justify-center min-h-[400px]"
            >
               {/* Placeholder for architecture diagram if needed, just a styled box for now */}
               <div className="relative w-full h-full min-h-[300px] border-2 border-dashed border-green-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 bg-green-50/30">
                  <Cpu className="w-16 h-16 mb-4 text-[#00A651]/50" />
                   <p className="font-semibold text-center px-4 text-green-800">Arsitektur CNN<br/><span className="text-sm font-normal text-green-600">Optimasi PyTorch untuk Inferensi Cepat</span></p>
               </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Section 3: Static Analysis - Light Blue Background */}
      <section className="py-24 bg-[#F5F9FF] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            <motion.div 
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.3 }}
              className="bg-white rounded-3xl p-8 shadow-lg border border-blue-50 flex items-center justify-center min-h-[400px] order-last md:order-none"
            >
               <div className="relative w-full h-full min-h-[300px] border-2 border-dashed border-blue-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 bg-blue-50/30">
                  <FileText className="w-16 h-16 mb-4 text-blue-500/50" />
                   <p className="font-semibold text-center px-4 text-blue-800">Pembuatan Byteplot<br/><span className="text-sm font-normal text-blue-600">Representasi Visual dari Binary EXE</span></p>
               </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
              className="flex flex-col justify-center"
            >
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-blue-100">
                <Activity className="text-blue-500 w-8 h-8" />
              </div>
              <h2 className="text-5xl md:text-7xl font-display text-gray-900 leading-[0.9] uppercase tracking-tight mb-6">Analisis Biner Statis</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Kami menggunakan pendekatan "Static Analysis" dengan cara membaca file executable (.exe) dalam bentuk binary dan mengubahnya menjadi *Grayscale Byteplot* (256x256 piksel). Dengan metode ini, file Anda tidak akan pernah dijalankan (dieksekusi), sehingga 100% aman dari risiko infeksi.
              </p>
              <ul className="space-y-3">
                {['100% Aman tanpa risiko eksekusi malware', 'Representasi Byteplot 2D untuk Convolutional Network', 'Menganalisis seluruh bagian file executable'].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <Zap className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default Features;
