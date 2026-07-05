import { useEffect, useRef, useState } from "react";

const MANFAAT = [
  {
    title: "Bagi Aparat Penegak Hukum",
    desc: "Mempercepat proses pengelompokan dan pengarsipan putusan berdasarkan jenis tindak pidana.",
  },
  {
    title: "Bagi Peneliti & Akademisi",
    desc: "Menyediakan dataset terstruktur untuk kajian pola putusan pidana khusus di Indonesia.",
  },
  {
    title: "Bagi Masyarakat Umum",
    desc: "Memberikan gambaran awal terhadap suatu putusan tanpa perlu membaca dokumen secara penuh.",
  },
];

const METODOLOGI = [
  { label: "Sumber Data", value: "Direktori Putusan Mahkamah Agung RI" },
  { label: "Model Dasar", value: "IndoBERT (indobenchmark/indobert-base)" },
  { label: "Metode", value: "Fine-tuning Multi-level Classification" },
  { label: "Evaluasi", value: "Accuracy, F1-Score, Confusion Matrix" },
];

function TentangSection() {
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
    <div ref={ref} className="bg-gradient-to-b from-white to-slate-50 py-16 sm:py-20">
      <div className={`max-w-4xl mx-auto px-5 sm:px-6 transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}>
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-[11px] font-mono uppercase tracking-widest text-gold-600">
            Tentang Proyek
          </span>
          <h1 className="font-serif font-bold text-3xl sm:text-4xl text-navy-900 mt-2 mb-4">
            Latar Belakang & Tujuan
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            Proyek riset Natural Language Processing untuk mengotomatisasi
            klasifikasi putusan pengadilan kategori pidana khusus.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 mb-8 hover:shadow-xl transition-shadow duration-300">
          <h2 className="font-serif font-semibold text-xl text-navy-900 mb-3">
            Latar Belakang
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed mb-4">
            Jumlah putusan pengadilan yang dipublikasikan melalui Direktori
            Putusan terus bertambah setiap tahun. Proses identifikasi jenis
            tindak pidana secara manual memerlukan waktu yang tidak sedikit,
            terutama untuk kategori pidana khusus yang memiliki karakteristik
            bahasa hukum yang kompleks.
          </p>
          <p className="text-sm text-slate-500 leading-relaxed">
            Model bahasa berbasis IndoBERT dipilih karena telah terbukti efektif
            memahami konteks bahasa Indonesia, termasuk istilah-istilah hukum
            yang jarang muncul dalam korpus umum.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {MANFAAT.map((m, idx) => (
            <div
              key={m.title}
              className="bg-navy-900 rounded-2xl p-6 border border-navy-700 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
              style={{ animationDelay: `${idx * 150}ms` }}
            >
              <h3 className="font-semibold text-gold-400 text-sm mb-2">
                {m.title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 hover:shadow-xl transition-shadow duration-300">
          <h2 className="font-serif font-semibold text-xl text-navy-900 mb-5">
            Ringkasan Metodologi
          </h2>
          <ul>
            {METODOLOGI.map((m) => (
              <li
                key={m.label}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 py-3 border-b border-dashed border-slate-200 last:border-0 text-sm hover:bg-slate-50 px-2 rounded-lg transition-colors duration-200"
              >
                <span className="text-slate-500">{m.label}</span>
                <span className="font-mono text-[13px] font-semibold text-navy-900">
                  {m.value}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default TentangSection;