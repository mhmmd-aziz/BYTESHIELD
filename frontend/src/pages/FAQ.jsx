import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageCircleQuestion } from 'lucide-react';

const faqs = [
  {
    question: "Apa itu ByteShield?",
    answer: "ByteShield adalah sistem pendeteksi malware berbasis Deep Learning yang menganalisis file executable (.exe) secara statis menggunakan Convolutional Neural Network (CNN)."
  },
  {
    question: "Apakah file yang diunggah akan dieksekusi?",
    answer: "Tidak. ByteShield sepenuhnya menggunakan pendekatan 'Static Analysis'. File yang Anda unggah hanya dibaca struktur binary (byte)-nya, diubah menjadi gambar (byteplot), dan dianalisis polanya tanpa pernah dijalankan di server. Ini 100% aman."
  },
  {
    question: "Dataset apa yang digunakan oleh sistem ini?",
    answer: "Model kami dilatih menggunakan MaleX 200K, yaitu dataset seimbang berisi 200.000 byteplot (100.000 Malware dan 100.000 Benign) dengan resolusi 256x256 piksel."
  },
  {
    question: "Apakah privasi data saya aman?",
    answer: "Ya. File yang diunggah hanya diproses di dalam memori saat inferensi berlangsung dan tidak akan disebarkan atau disimpan secara permanen. Kami tidak mengirimkan file ke layanan third-party seperti VirusTotal."
  },
  {
    question: "Berapa lama proses deteksi berlangsung?",
    answer: "Prosesnya hampir seketika (real-time). Waktu pemrosesan sebagian besar hanya untuk mengubah file menjadi format byteplot dan waktu inferensi model CNN (PyTorch) yang sudah dioptimasi."
  }
];

const FAQItem = ({ faq, isOpen, onToggle }) => {
  return (
    <div className="border-b border-gray-100 last:border-none">
      <button
        onClick={onToggle}
        className="w-full py-6 flex justify-between items-center text-left focus:outline-none group"
      >
        <span className={`text-lg font-semibold transition-colors ${isOpen ? 'text-[#00A651]' : 'text-gray-900 group-hover:text-[#00A651]'}`}>
          {faq.question}
        </span>
        <ChevronDown 
          className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#00A651]' : 'group-hover:text-[#00A651]'}`} 
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-gray-600 leading-relaxed text-lg">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0); // Buka yang pertama secara default

  return (
    <div className="pb-20 pt-40 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-[#E8F5E9] rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-12">
            <MessageCircleQuestion className="w-10 h-10 text-[#00A651] -rotate-12" />
          </div>
          <h1 className="text-5xl md:text-7xl font-display text-gray-900 leading-[0.9] uppercase tracking-tight mb-4">
            Pertanyaan yang Sering Diajukan
          </h1>
          <p className="text-xl text-gray-600">
            Temukan jawaban lengkap mengenai implementasi, privasi, dan kemampuan sistem cerdas kami.
          </p>
        </div>

        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 md:p-12">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              faq={faq}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>

        <div className="mt-16 text-center bg-gradient-to-br from-[#F2FBF5] to-[#E8F5E9] border border-green-100 rounded-[2rem] p-10 flex flex-col items-center justify-center shadow-lg">
          <h3 className="text-5xl md:text-6xl font-display text-gray-900 leading-[0.9] uppercase tracking-tight mb-6">Punya pertanyaan lain?</h3>
          <p className="text-gray-600 mb-8 max-w-lg text-lg">
            Tim developer kami selalu siap membantu menjabarkan setiap aspek teknis dari sistem AI ini di depan para juri!
          </p>
          <a 
            href="https://wa.me/6282273176154" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="bg-[#00A651] hover:bg-[#007A3B] text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm transition-all shadow-[0_10px_30px_rgba(0,122,59,0.3)] hover:-translate-y-1 inline-flex items-center"
          >
            Hubungi Developer
          </a>
        </div>

      </div>
    </div>
  );
};

export default FAQ;
