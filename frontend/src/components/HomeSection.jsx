import { useEffect, useRef, useState } from "react";

// Import semua komponen section
import TentangSection from "./TentangSection";
import CaraKerjaSection from "./CaraKerjaSection";
import KategoriSection from "./KategoriSection";

function HomeSection({ setPage }) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const stats = [
    { num: "6", label: "Kategori Utama", icon: "📚" },
    { num: "20+", label: "Sub-klasifikasi", icon: "📑" },
    { num: "IndoBERT", label: "Model Dasar", icon: "🤖" },
  ];

  const features = [
    {
      title: "Cepat & Akurat",
      desc: "Hasil klasifikasi tersedia dalam hitungan detik dengan tingkat keyakinan yang terukur.",
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      ),
    },
    {
      title: "Klasifikasi Berjenjang",
      desc: "Menentukan kategori utama sekaligus sub-klasifikasi secara bersamaan dalam satu proses.",
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5h18M3 12h18M3 16.5h12" />
      ),
    },
    {
      title: "Estimasi Hukuman",
      desc: "Memberikan estimasi pasal, jenis, dan lama hukuman berdasarkan pola putusan serupa.",
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m-7-7l7 7 7-7M5 6l7-3 7 3" />
      ),
    },
  ];

  return (
    <div ref={sectionRef}>
      {/* HERO */}
      <div className="relative overflow-hidden bg-gradient-to-b from-navy-950 via-navy-900 to-navy-900">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -left-20 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gold-500/10 blur-3xl animate-pulse" />
          <div className="absolute top-16 -right-24 w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-navy-500/30 blur-3xl animate-pulse delay-1000" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent" />
        </div>

        <div className={`relative max-w-3xl mx-auto text-center px-5 sm:px-6 pt-20 sm:pt-28 pb-16 sm:pb-20 transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}>
          <div className="w-16 h-16 rounded-full border-2 border-gold-500 bg-navy-900 flex items-center justify-center mx-auto mb-6 hover:scale-110 transition-transform duration-500 shadow-lg shadow-gold-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#d4b355" strokeWidth="1.4" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 3v5c0 4.5-3 8.25-7 9.75C8 19.25 5 15.5 5 11V6l7-3z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 12l1.8 1.8L14.8 10" />
            </svg>
          </div>

          <span className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-gold-400 bg-gold-500/10 border border-gold-500/30 px-4 py-1.5 rounded-full mb-6 animate-pulse">
            Naskah Akademik · Riset NLP
          </span>

          <h1 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl text-white leading-[1.15] mb-5">
            Klasifikasi otomatis putusan{" "}
            <span className="text-gold-400 relative">
              pidana khusus
              <svg className="absolute -bottom-1 left-0 w-full" height="4" viewBox="0 0 100 4">
                <path d="M0 2 Q25 0 50 2 Q75 4 100 2" stroke="#d4b355" strokeWidth="2" fill="none" />
              </svg>
            </span>{" "}
            dengan IndoBERT
          </h1>

          <p className="text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-9">
            Sistem ini membaca dokumen putusan pengadilan berbahasa Indonesia,
            lalu secara otomatis menentukan klasifikasi tindak pidana,
            sub-klasifikasinya, pasal yang dilanggar, serta jenis dan lama
            hukuman.
          </p>

          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={() => setPage("predict")}
              className="group inline-flex items-center gap-2 px-6 sm:px-7 py-3.5 rounded-xl font-semibold text-sm bg-gold-500 text-navy-950 hover:bg-gold-400 hover:-translate-y-0.5 transition-all duration-300 shadow-lg shadow-gold-500/30 hover:shadow-gold-500/50"
            >
              Coba Prediksi Sekarang
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* STAT RAIL */}
      <div className={`max-w-4xl mx-auto px-5 sm:px-6 -mt-8 sm:-mt-10 relative z-10 mb-16 sm:mb-20 transition-all duration-1000 delay-300 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((s, idx) => (
            <div
              key={s.label}
              className="bg-white border border-slate-200 rounded-2xl text-center py-7 px-4 shadow-lg shadow-navy-950/5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
              style={{ animationDelay: `${idx * 150}ms` }}
            >
              <span className="text-2xl block">{s.icon}</span>
              <span className="block font-serif font-bold text-2xl sm:text-3xl text-navy-900 mt-1">
                {s.num}
              </span>
              <span className="text-xs text-slate-500 mt-1 block">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURE HIGHLIGHTS */}
      <div className={`max-w-5xl mx-auto px-5 sm:px-6 pb-20 transition-all duration-1000 delay-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}>
        <div className="text-center max-w-lg mx-auto mb-10">
          <span className="text-[11px] font-mono uppercase tracking-widest text-gold-600">
            Keunggulan
          </span>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-navy-900 mt-2">
            Kenapa memakai LexBERT?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {features.map((f, idx) => (
            <div
              key={f.title}
              className="bg-white border border-slate-200 rounded-2xl p-6 hover:-translate-y-1 hover:shadow-xl hover:shadow-navy-950/10 transition-all duration-300 group"
              style={{ animationDelay: `${idx * 150}ms` }}
            >
              <div className="w-11 h-11 rounded-xl bg-navy-900 text-gold-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:shadow-lg group-hover:shadow-gold-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor" className="w-5 h-5">
                  {f.icon}
                </svg>
              </div>
              <h3 className="font-semibold text-navy-900 mb-2">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* TENTANG SECTION */}
      <TentangSection />

      {/* CARA KERJA SECTION */}
      <CaraKerjaSection setPage={setPage} />

      {/* KATEGORI SECTION */}
      <KategoriSection />

      {/* CTA BOTTOM */}
      <div className="max-w-5xl mx-auto px-5 sm:px-6 pb-20">
        <div className="bg-gradient-to-br from-navy-900 to-navy-950 rounded-3xl text-center px-6 sm:px-10 py-10 sm:py-12 border border-navy-700 hover:shadow-2xl hover:shadow-gold-500/10 transition-all duration-500">
          <h2 className="font-serif font-bold text-xl sm:text-2xl text-white mb-2">
            Coba prosesnya secara langsung
          </h2>
          <p className="text-slate-300 text-sm mb-6">
            Unggah berkas PDF putusan Anda dan lihat keempat tahap ini bekerja.
          </p>
          <button
            onClick={() => setPage("predict")}
            className="px-6 sm:px-7 py-3.5 rounded-xl font-semibold text-sm bg-gold-500 text-navy-950 hover:bg-gold-400 hover:-translate-y-0.5 transition-all duration-300 shadow-lg shadow-gold-500/30 hover:shadow-gold-500/50 inline-flex items-center gap-2 group"
          >
            Buka Halaman Prediksi
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomeSection;