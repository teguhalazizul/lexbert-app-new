import { useEffect, useRef, useState } from "react";

const STEPS = [
  {
    no: "01",
    title: "Unggah Dokumen Putusan",
    desc: "Pengguna mengunggah berkas putusan pengadilan dalam format PDF melalui halaman prediksi.",
  },
  {
    no: "02",
    title: "Ekstraksi & Pra-pemrosesan Teks",
    desc: "Teks diekstrak dari PDF, dibersihkan dari noise, lalu dinormalisasi ke format siap analisis.",
  },
  {
    no: "03",
    title: "Inferensi Model IndoBERT",
    desc: "Teks diproses oleh model IndoBERT yang telah di-fine-tune pada korpus putusan pidana khusus.",
  },
  {
    no: "04",
    title: "Penyusunan Hasil Analisis",
    desc: "Sistem menyusun klasifikasi, sub-klasifikasi, tingkat keyakinan, pasal, dan jenis/lama hukuman.",
  },
];

function CaraKerjaSection({ setPage }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="bg-gradient-to-b from-slate-50 via-white to-slate-50 py-16 sm:py-20">
      <div className={`max-w-5xl mx-auto px-5 sm:px-6 transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}>
        <div className="text-center max-w-xl mx-auto mb-12 sm:mb-14">
          <span className="text-[11px] font-mono uppercase tracking-widest text-gold-600">
            Alur Kerja
          </span>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-navy-900 mt-2 mb-3">
            Dari berkas PDF menjadi hasil analisis
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Empat tahap yang dilalui setiap dokumen sejak diunggah hingga hasil
            klasifikasi ditampilkan.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STEPS.map((s, idx) => (
            <div
              key={s.no}
              className="bg-white border border-slate-200 border-t-4 border-t-gold-500 rounded-2xl p-6 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group"
              style={{ animationDelay: `${idx * 150}ms` }}
            >
              <div className="w-10 h-10 rounded-full bg-navy-900 text-gold-400 flex items-center justify-center font-mono text-sm font-semibold mb-4 group-hover:scale-110 transition-transform duration-300">
                {s.no}
              </div>
              <h3 className="text-navy-900 font-semibold mb-2 text-[15px]">
                {s.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CaraKerjaSection;