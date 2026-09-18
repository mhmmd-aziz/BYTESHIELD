import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ShieldAlert, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const heroRef = useRef(null);

  // Scroll logic khusus untuk hero section
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  // Custom Parallax Scroll Effects for the Logo
  const logoX = useTransform(scrollYProgress, [0, 1], ['-20vw', '120vw']);
  const logoRotate = useTransform(scrollYProgress, [0, 1], [0, 1080]);

  return (
    <div className="overflow-hidden bg-white relative">

      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-32 pb-20 px-4 bg-gradient-to-b from-[#a1c4fd] to-[#c2e9fb] min-h-[90vh] flex flex-col items-center justify-start overflow-hidden">

        {/* High-Tech Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff30_1px,transparent_1px),linear-gradient(to_bottom,#ffffff30_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0"></div>

        {/* Animated Orbs for depth */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/20 rounded-full blur-[100px] pointer-events-none z-0 mix-blend-overlay"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00A651]/20 rounded-full blur-[100px] pointer-events-none z-0"></div>
        {/* Rolling Logo Parallax Effect (Bergulir di alas section) */}
        <motion.img
          src="/logo%20kosong%20no%20bg.png"
          alt="Rolling Logo"
          style={{ x: logoX, rotate: logoRotate }}
          className="absolute bottom-[-20px] left-0 w-[150px] md:w-[250px] h-auto object-contain opacity-40 pointer-events-none z-[5]"
        />

        {/* Giant Text Background */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.1 }}
          className="w-full max-w-[90rem] mx-auto relative z-0 mt-12 md:mt-20 flex justify-center"
        >
          <h1 className="text-[18vw] leading-[0.75] font-display text-white drop-shadow-xl tracking-tighter flex">
            <motion.span
              variants={{
                hidden: { x: -300, opacity: 0 },
                visible: { x: 0, opacity: 1, transition: { duration: 1.2, type: "spring", bounce: 0.3 } }
              }}
              className="inline-block"
            >
              BYTE
            </motion.span>
            <motion.span
              variants={{
                hidden: { x: 300, opacity: 0 },
                visible: { x: 0, opacity: 1, transition: { duration: 1.2, type: "spring", bounce: 0.3 } }
              }}
              className="inline-block"
            >
              SHIELD
            </motion.span>
          </h1>
        </motion.div>

        {/* Hero Image Showcase Overlapping */}
        <motion.div
          initial={{ opacity: 0, y: 150, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 1, delay: 0.2, type: "spring", bounce: 0.5 }}
          className="w-full max-w-5xl mx-auto relative z-10 -mt-[15vw] md:-mt-[20vw]"
        >
          <img src="/hero-person.png" alt="Cybersecurity Expert" className="w-full max-h-[80vh] object-contain mix-blend-multiply pointer-events-none" />

          <div className="absolute -left-2 -bottom-6 md:-left-12 md:-bottom-12 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white max-w-[280px] pointer-events-auto">
            <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">Sejak 2026</span>
            <p className="mt-2 text-gray-800 font-medium text-sm md:text-base">Analisis statis untuk executable Windows menggunakan Deep Learning.</p>
            <div className="flex space-x-2 mt-4">
              <Link to="/scan" className="bg-k3-green text-white p-2 text-xs font-bold uppercase rounded hover:bg-k3-dark transition-colors">Mulai</Link>
              <Link to="/features" className="bg-gray-100 text-gray-600 p-2 text-xs font-bold uppercase rounded hover:bg-gray-200 transition-colors">Pelajari Lebih Lanjut</Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Asymmetric Editorial Section */}
      <section className="py-24 bg-white relative overflow-hidden">

        {/* Wireframe background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] z-0"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8 overflow-hidden">
            <motion.h2
              initial={{ opacity: 0, x: -100, filter: 'blur(10px)' }}
              whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="text-5xl md:text-7xl font-display text-gray-900 leading-[0.9] max-w-2xl uppercase tracking-tight"
            >
              ANALISIS STATIS TINGKAT LANJUT UNTUK EXECUTABLE
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
              className="flex space-x-8 text-sm text-gray-600 max-w-md"
            >
              <p>Sistem AI kami menyediakan analisis statis kelas dunia untuk deteksi malware zero-day.</p>
              <p className="hidden md:block">Kami menggabungkan deep learning modern dengan transformasi byteplot untuk mendeteksi anomali sebelum eksekusi.</p>
            </motion.div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main large image card (Left) */}
            <motion.div
              initial={{ opacity: 0, x: -150, rotateY: -15 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 1, type: "spring", bounce: 0.3 }}
              className="lg:col-span-7 relative h-[500px] md:h-[700px] rounded-[2rem] overflow-hidden group shadow-lg"
            >
              <img src="/hero-image.jpg" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="Main View" />
              <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-wrap gap-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl text-white min-w-[140px]">
                  <div className="text-4xl font-display text-k3-green">99%</div>
                  <div className="text-[10px] uppercase tracking-widest text-gray-300 mt-1">Tingkat Akurasi</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl text-white min-w-[140px]">
                  <div className="text-4xl font-display text-k3-green">24/7</div>
                  <div className="text-[10px] uppercase tracking-widest text-gray-300 mt-1">Pemantauan Aktif</div>
                </div>
                <div className="mt-auto ml-auto hidden sm:block">
                  <Link to="/features" className="w-14 h-14 bg-k3-green rounded-full flex items-center justify-center text-white hover:bg-white hover:text-k3-green transition-all shadow-lg hover:scale-110">
                    <ArrowRight className="w-6 h-6 -rotate-45" />
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Right Side Column */}
            <div className="lg:col-span-5 flex flex-col gap-10">
              {/* Secondary Visual Box */}
              <motion.div
                initial={{ opacity: 0, y: -100, scale: 0.8 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.4 }}
                className="h-64 rounded-[2rem] overflow-hidden bg-k3-light flex flex-col items-center justify-center shadow-inner relative"
              >
                <ShieldAlert className="w-32 h-32 text-k3-green opacity-20 absolute" />
                <span className="relative z-10 font-display text-3xl text-k3-dark">CNN</span>
                <span className="relative z-10 text-sm font-bold text-k3-green uppercase tracking-widest mt-2">Arsitektur</span>
              </motion.div>

              {/* Giant Stats */}
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.8, delay: 0.4, type: "spring", bounce: 0.3 }}
                className="flex items-center gap-6 mt-4"
              >
                <div className="text-[160px] leading-[0.8] font-display text-k3-green tracking-normal">100<span className="text-6xl">%</span></div>
                <div className="text-sm font-bold text-gray-800 uppercase max-w-[100px] leading-snug">
                  Komitmen pada Keamanan
                </div>
              </motion.div>

              {/* List */}
              <motion.ul
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.8, delay: 0.6, type: "spring", bounce: 0.4 }}
                className="space-y-4 text-sm text-gray-600 font-medium mt-4"
              >
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-gray-900 rounded-full"></span>
                  Pembuatan Byteplot 256x256
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-gray-900 rounded-full"></span>
                  Dataset Pra-latih MaleX 200K
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-gray-900 rounded-full"></span>
                  Sandbox Analisis Statis yang Aman
                </li>
              </motion.ul>
            </div>
          </div>
        </div>
      </section>

      {/* Deep Analysis Section */}
      <section className="dark-section-for-nav py-24 bg-gradient-to-br from-[#050505] via-[#0a120e] to-[#001a09] text-white relative overflow-hidden">
        
        {/* Subtle dot matrix pattern for texture */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <motion.div
              initial={{ opacity: 0, x: -150, skewX: -10 }}
              whileInView={{ opacity: 1, x: 0, skewX: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
              className="w-full md:w-1/2"
            >
              <h2 className="text-5xl md:text-7xl font-display leading-[0.9] uppercase tracking-tight mb-6">
                INSPEKSI TINGKAT <br /><span className="text-k3-green">MENDALAM.</span>
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                Setiap executable yang diunggah langsung dikonversi menjadi byteplot grayscale 2D. Convolutional Neural Network berbasis ResNet18 kami memindai pola struktural biner, mengidentifikasi signature berbahaya yang dilewatkan oleh antivirus tradisional.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 font-bold text-sm uppercase tracking-widest">
                  <div className="w-8 h-8 rounded-full border border-k3-green flex items-center justify-center text-k3-green">1</div>
                  Unggah Biner (.EXE)
                </li>
                <li className="flex items-center gap-3 font-bold text-sm uppercase tracking-widest">
                  <div className="w-8 h-8 rounded-full border border-k3-green flex items-center justify-center text-k3-green">2</div>
                  Pembuatan Byteplot
                </li>
                <li className="flex items-center gap-3 font-bold text-sm uppercase tracking-widest">
                  <div className="w-8 h-8 rounded-full border border-k3-green flex items-center justify-center text-k3-green">3</div>
                  Prediksi CNN
                </li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 150, rotate: 5 }}
              whileInView={{ opacity: 1, x: 0, rotate: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.3 }}
              className="w-full md:w-1/2"
            >
              <img src="/cyber-scan.jpg" alt="Byteplot Scanning" className="w-full rounded-[2rem] shadow-2xl border border-white/10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Interactive Dashboard CTA */}
      <section className="py-24 bg-k3-light relative overflow-hidden pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 1, type: "spring", bounce: 0.4 }}
            className="relative w-full mx-auto"
          >
            {/* Product Showcase Mockup (Like Reference Image - Mirrored) */}
            <div className="w-full flex flex-col items-start p-4 md:p-8 mt-4">
              
              {/* Top Row: Full Width Text */}
              <div className="w-full mb-16 z-20 flex flex-col lg:flex-row lg:items-end justify-between gap-10 border-b border-gray-200 pb-12">
                <motion.div 
                  initial={{ opacity: 0, y: -30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  className="lg:w-3/4 text-left"
                >
                  <h2 className="text-5xl md:text-7xl lg:text-[5.5rem] font-display text-gray-900 leading-[0.85] tracking-tight uppercase">
                    SPESIFIKASI <br/>
                    <span className="text-k3-green">TINGKAT LANJUT</span><br/> 
                    YANG DIBANGUN UNTUK MASA DEPAN
                  </h2>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.4 }}
                  className="lg:w-1/4 flex flex-col items-start lg:items-end text-left lg:text-right"
                >
                  <p className="text-gray-600 text-lg mb-6 max-w-sm">
                    Rasakan kekuatan mesin analisis statis real-time kami. Dapatkan skor confidence instan dan laporan ancaman komprehensif.
                  </p>
                  <div className="inline-block bg-gray-900 text-white text-sm font-bold uppercase tracking-widest px-8 py-3 rounded-full shadow-lg">
                    Semua Fitur
                  </div>
                </motion.div>
              </div>

              {/* Bottom Row: UI on Left, Image on Right */}
              <div className="w-full flex flex-col-reverse md:flex-row items-center justify-between relative">
                
                {/* Left Side: Floating Features (Mirrored) */}
                <div className="md:w-1/3 flex flex-col gap-6 w-full mt-12 md:mt-0 z-20">
                  {/* Feature 1 */}
                  <motion.div 
                    initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
                  >
                    <div className="bg-white p-5 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-4">
                      <div className="bg-gray-900 p-3 rounded-xl">
                        <ShieldCheck className="w-6 h-6 text-green-400" />
                      </div>
                      <div className="text-left">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Teknologi Pintar</div>
                        <div className="text-sm font-bold text-gray-800 uppercase">Analisis ResNet18</div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Feature 2 */}
                  <motion.div 
                    initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}
                  >
                    <div className="bg-white p-5 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-4">
                      <div className="bg-gray-100 p-3 rounded-full flex items-center justify-center">
                        <div className="w-6 h-6 border-4 border-gray-300 rounded-full border-t-k3-green animate-spin"></div>
                      </div>
                      <div className="text-left">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Performa</div>
                        <div className="text-sm font-bold text-gray-800 uppercase">Pemindaian 24/7</div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Feature 3 */}
                  <motion.div 
                    initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 }}
                  >
                    <div className="bg-white p-5 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-4">
                      <div className="w-6 h-10 bg-gray-800 rounded-md relative overflow-hidden flex-shrink-0">
                         <div className="absolute bottom-0 left-0 right-0 bg-green-400 h-[80%] animate-pulse"></div>
                      </div>
                      <div className="text-left">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Detail Sistem</div>
                        <div className="text-sm font-bold text-gray-800 uppercase">Sandbox Terisolasi</div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Right Side: Image */}
                <div className="md:w-2/3 flex justify-end items-center relative h-full">
                  <motion.img 
                    initial={{ scale: 0.8, opacity: 0, x: 50 }} whileInView={{ scale: 1, opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.3 }}
                    src="/cyber_core.png" 
                    alt="Cyber Core" 
                    className="w-full max-w-xl object-contain mix-blend-multiply drop-shadow-2xl"
                  />
                </div>

              </div>
            </div>

            {/* CTA Button placed on bottom edge */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-30">
              <Link to="/scan" className="bg-k3-dark text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-gray-900 transition-colors shadow-[0_10px_30px_rgba(0,122,59,0.3)] flex items-center gap-3 group text-sm whitespace-nowrap">
                Mulai Uji Coba Gratis
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
