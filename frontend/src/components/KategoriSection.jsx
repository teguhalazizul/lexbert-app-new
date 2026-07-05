import { useEffect, useRef, useState } from "react";

const KATEGORI = [
  { nama: "Korupsi", sub: ["Suap-menyuap", "Gratifikasi", "Penyalahgunaan Wewenang", "Merugikan Keuangan Negara"] },
  { nama: "Narkotika & Psikotropika", sub: ["Kepemilikan", "Pengedaran", "Produksi", "Prekursor Narkotika"] },
  { nama: "Perlindungan Anak", sub: ["Kekerasan Seksual Anak", "Penelantaran Anak", "Eksploitasi Anak"] },
  { nama: "Pencucian Uang (TPPU)", sub: ["Penempatan Dana", "Pelapisan Dana", "Penggunaan Hasil Kejahatan"] },
  { nama: "Perdagangan Orang (TPPO)", sub: ["Eksploitasi Tenaga Kerja", "Eksploitasi Seksual", "Perdagangan Lintas Negara"] },
  { nama: "Terorisme", sub: ["Pendanaan Terorisme", "Perencanaan Aksi", "Afiliasi Jaringan"] },
];

const SPECS = [
  ["Arsitektur dasar", "IndoBERT-base"],
  ["Jenis tugas", "Multi-level Classification"],
  ["Sumber data", "Direktori Putusan MA"],
  ["Format masukan", "PDF Putusan"],
  ["Keluaran", "Klasifikasi + Metadata Hukum"],
];

function KategoriSection() {
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
    <div ref={ref} className="py-16 sm:py-20">
      <div className={`max-w-5xl mx-auto px-5 sm:px-6 transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}>
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-[11px] font-mono uppercase tracking-widest text-gold-600">
            Taksonomi
          </span>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-navy-900 mt-2 mb-3">
            Kategori & sub-klasifikasi pidana khusus
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Model mengenali enam kategori utama, masing-masing terbagi ke dalam
            beberapa sub-klasifikasi yang lebih spesifik.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
          {KATEGORI.map((k, idx) => (
            <div
              key={k.nama}
              className="bg-white border border-slate-200 border-l-4 border-l-gold-500 rounded-2xl p-6 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
                <h3 className="font-semibold text-navy-900 text-[15px]">
                  {k.nama}
                </h3>
                <span className="font-mono text-[10px] px-2.5 py-1 rounded-full bg-gold-500/10 text-gold-600 border border-gold-500/30 whitespace-nowrap">
                  {k.sub.length} sub-kelas
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {k.sub.map((s) => (
                  <span
                    key={s}
                    className="text-xs text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full hover:bg-gold-50 hover:border-gold-300 transition-colors duration-200"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mb-5">
          <span className="text-[11px] font-mono uppercase tracking-widest text-gold-600">
            Model
          </span>
          <h2 className="font-serif font-bold text-2xl text-navy-900 mt-1">
            Tentang model yang digunakan
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 bg-navy-900 border border-navy-700 rounded-2xl overflow-hidden hover:shadow-2xl transition-shadow duration-500">
          <div className="p-6 sm:p-8 border-b md:border-b-0 md:border-r border-navy-700">
            <h3 className="font-serif font-semibold text-lg text-white mb-3">
              IndoBERT Fine-tuned
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              Model dibangun di atas arsitektur BERT yang telah dilatih pada
              korpus berbahasa Indonesia, kemudian disesuaikan (fine-tuning)
              dengan dataset putusan pengadilan kategori pidana khusus dari
              Direktori Putusan Mahkamah Agung.
            </p>
            <p className="text-sm text-slate-300 leading-relaxed">
              Keluaran model berupa dua tingkat klasifikasi sekaligus — kategori
              utama dan sub-klasifikasi — beserta estimasi pasal dan
              rekomendasi rentang hukuman.
            </p>
          </div>

          <div className="p-6 sm:p-8">
            <ul>
              {SPECS.map(([k, v]) => (
                <li
                  key={k}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 py-2.5 border-b border-dashed border-navy-700 last:border-0 text-sm hover:bg-navy-800/50 px-2 rounded-lg transition-colors duration-200"
                >
                  <span className="text-slate-400">{k}</span>
                  <span className="font-mono text-[13px] font-semibold text-gold-400">
                    {v}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default KategoriSection;