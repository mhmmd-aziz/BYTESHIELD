import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { BrainCircuit, Fingerprint, ShieldCheck, Cpu, UploadCloud, Search, CheckCircle, Database, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import Stepper, { Step } from '../components/Stepper';

const Guide = () => {
  const heroRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="overflow-hidden bg-white relative font-sans"
    >
      
      {/* Cara Kerja AI Section */}
      <section className="pt-40 pb-24 px-4 bg-white relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <span className="text-[#00A651] font-bold tracking-widest uppercase text-sm">Mesin Deteksi</span>
            <h2 className="text-5xl md:text-7xl font-display text-gray-900 leading-[0.9] uppercase tracking-tight mt-4">Cara Kerja AI Kami</h2>
            <p className="mt-6 text-gray-600 max-w-2xl mx-auto">Kami menggabungkan Deep Learning dan analisis Heuristik kriptografis untuk mendeteksi ancaman sekecil apa pun.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Image Placeholder using Unsplash */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.8 }}
              className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-100 group"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-[#00A651]/20 to-transparent mix-blend-overlay z-10"></div>
              <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Cybersecurity Server Abstract" className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700" />
            </motion.div>

            {/* Steps */}
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              className="space-y-8"
            >
              <motion.div variants={fadeInUp} className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#00A651]/10 text-[#00A651] rounded-xl flex items-center justify-center">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">1. Ekstraksi Byteplot</h3>
                  <p className="text-gray-600 mt-2 text-sm md:text-base">File executable (.exe) diubah menjadi citra visual 2D (Byteplot) yang merepresentasikan struktur binernya tanpa mengeksekusi kode berbahaya.</p>
                </div>
              </motion.div>

              <motion.div variants={fadeInUp} className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#00A651]/10 text-[#00A651] rounded-xl flex items-center justify-center">
                  <Fingerprint className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">2. Analisis Entropy</h3>
                  <p className="text-gray-600 mt-2 text-sm md:text-base">Sistem menghitung nilai Shannon Entropy untuk mendeteksi teknik obfuskasi atau enkripsi yang sering digunakan oleh malware modern (Packed Malware).</p>
                </div>
              </motion.div>

              <motion.div variants={fadeInUp} className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#00A651]/10 text-[#00A651] rounded-xl flex items-center justify-center">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">3. Inferensi CNN (ResNet18)</h3>
                  <p className="text-gray-600 mt-2 text-sm md:text-base">Citra Byteplot dianalisis menggunakan model Pytorch ResNet18 untuk mencari pola spasial mikroskopis yang identik dengan keluarga malware.</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Panduan Penggunaan Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Decor: Green smoke shadow on the left */}
        <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-[#00A651]/15 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 z-0"></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-[#a1c4fd]/20 to-transparent rounded-full blur-[120px] pointer-events-none z-0"></div>

        <div className="max-w-[85rem] mx-auto px-6 sm:px-10 lg:px-12 relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 lg:items-center">
            
            {/* Left side: Typography matching hero section */}
            <motion.div 
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
              className="lg:w-5/12 text-left"
            >
              <h2 className="text-5xl md:text-7xl font-display text-gray-900 leading-[0.9] uppercase tracking-tight mb-8">
                Cara <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A651] to-[#007A3B]">Penggunaan</span>
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Sangat mudah. Anda hanya perlu beberapa klik untuk memastikan perangkat lunak Anda benar-benar aman dari ancaman siber. Ikuti panduan praktis di samping untuk memulai.
              </p>
            </motion.div>

            {/* Right side: Stepper */}
            <motion.div 
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.3 }}
              className="lg:w-7/12 w-full"
            >
            <Stepper
              initialStep={1}
              onFinalStepCompleted={() => console.log("Tutorial selesai")}
              backButtonText="Sebelumnya"
              nextButtonText="Selanjutnya"
            >
              <Step>
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 shadow-sm border border-blue-100">
                    <UploadCloud className="w-10 h-10 text-blue-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">1. Unggah File</h3>
                  <p className="text-gray-600 text-lg">Buka halaman "Pindai", lalu tarik (drag & drop) atau pilih file executable Windows (.exe, .dll) yang ingin Anda periksa keamanannya.</p>
                </div>
              </Step>
              <Step>
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-[#00A651]/10 rounded-full flex items-center justify-center mb-6 shadow-sm border border-[#00A651]/20">
                    <Search className="w-10 h-10 text-[#00A651]" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">2. Tunggu Analisis</h3>
                  <p className="text-gray-600 text-lg">Sistem akan secara otomatis mengirim data ke backend, mengekstrak byteplot, dan menjalankan hybrid engine kami secara instan.</p>
                </div>
              </Step>
              <Step>
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center mb-6 shadow-sm border border-purple-100">
                    <CheckCircle className="w-10 h-10 text-purple-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">3. Lihat Hasil</h3>
                  <p className="text-gray-600 text-lg">Dapatkan laporan lengkap berupa tingkat keyakinan (confidence), visualisasi file, dan vonis akhir keamanan file Anda.</p>
                </div>
              </Step>
            </Stepper>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.4 }}
            className="mt-16 text-center"
          >
            <Link to="/scan" className="inline-flex items-center gap-2 px-8 py-4 bg-[#00A651] text-white rounded-xl font-bold hover:bg-[#007A3B] transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              <ShieldCheck className="w-5 h-5" />
              Mulai Pindai Sekarang
            </Link>
          </motion.div>
        </div>
      </section>

    </motion.div>
  );
};

export default Guide;
