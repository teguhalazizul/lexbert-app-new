import { useState, useRef } from "react";

function ProgressRing({ percent }) {
  const r = 42;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative w-24 h-24 shrink-0 group">
      <svg viewBox="0 0 100 100" className="w-24 h-24 -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#e2e8f0" strokeWidth="8" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="#c9a227"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-serif font-bold text-2xl text-navy-900">{percent}%</span>
        <span className="font-mono text-[9px] text-gold-600 tracking-wide">YAKIN</span>
      </div>
    </div>
  );
}

function PrediksiSection() {
  const [file, setFile] = useState(null);
  const [hasil, setHasil] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);

  function pickFile(f) {
    if (f && f.type === "application/pdf") {
      setFile(f);
      setHasil(null);
    } else if (f) {
      alert("Hanya file PDF yang didukung");
    }
  }

  async function analisisPDF() {
    if (!file) {
      alert("Pilih file PDF terlebih dahulu");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
       const response = await fetch("/api/predict/pdf", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setHasil(data);
    } catch (err) {
      console.error(err);
      alert("Gagal upload PDF. Pastikan server backend sedang berjalan.");
    }
    setLoading(false);
  }

  const fields = [
    { label: "Sub Klasifikasi", key: "sub_klasifikasi", accent: true },
    { label: "Pasal Dilanggar", key: "pasal_dilanggar" },
    { label: "Jenis Hukuman", key: "jenis_hukuman" },
    { label: "Lama Hukuman", key: "lama_hukuman" },
  ];

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-6 py-14 sm:py-20">
      <div className="text-center mb-10">
        <span className="text-[11px] font-mono uppercase tracking-widest text-gold-600">
          Halaman Prediksi
        </span>
        <h1 className="font-serif font-bold text-3xl text-navy-900 mt-2 mb-2">
          Analisis Dokumen Putusan
        </h1>
        <p className="text-slate-500 text-sm">
          Unggah berkas PDF putusan untuk mendapatkan klasifikasi otomatis.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl shadow-navy-950/10 mb-8 hover:shadow-2xl transition-shadow duration-500">
        <label
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            pickFile(e.dataTransfer.files[0]);
          }}
          className={`relative block w-full text-center border-2 border-dashed rounded-2xl transition-all duration-300 cursor-pointer px-5 py-10 ${
            dragging
              ? "border-gold-500 bg-gold-50 scale-[1.02] shadow-lg shadow-gold-500/20"
              : "border-slate-300 bg-slate-50 hover:bg-navy-50/50 hover:border-gold-400"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={(e) => pickFile(e.target.files[0])}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          <div className={`transition-all duration-300 ${dragging ? "scale-110" : ""}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.4} stroke="#0a1834" className="w-9 h-9 mx-auto mb-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l-3 3m3-3l3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
            </svg>
            <span className="block font-semibold text-navy-900 text-sm">
              {file ? "Ganti file PDF" : "Klik atau seret berkas PDF ke sini"}
            </span>
            <span className="block text-xs text-slate-500 mt-1">
              Format didukung: .pdf
            </span>
          </div>
        </label>

        {file && (
          <div className="mt-4 flex items-center gap-3 text-sm font-semibold text-navy-900 bg-navy-50 px-4 py-2.5 rounded-xl break-all animate-fadeIn">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor" className="w-4 h-4 shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6 12l-3-3m0 0l-3 3m3-3v6" />
            </svg>
            {file.name}
            <button
              onClick={() => { setFile(null); setHasil(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
              className="ml-auto text-slate-400 hover:text-red-500 transition-colors duration-200"
            >
              ✕
            </button>
          </div>
        )}

        <button
          onClick={analisisPDF}
          disabled={loading || !file}
          className={`w-full mt-5 py-3.5 rounded-xl font-semibold text-sm text-navy-950 transition-all duration-300 ${
            loading || !file
              ? "bg-slate-300 text-slate-500 cursor-not-allowed"
              : "bg-gold-500 hover:bg-gold-400 hover:-translate-y-0.5 shadow-lg shadow-gold-500/30 hover:shadow-gold-500/50"
          }`}
        >
          {loading ? (
            <span className="inline-flex items-center gap-2 justify-center">
              <span className="w-3.5 h-3.5 border-2 border-navy-900/30 border-t-navy-900 rounded-full animate-spin" />
              Memproses dokumen...
            </span>
          ) : (
            "Upload dan Analisis"
          )}
        </button>
      </div>

      {hasil ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl shadow-navy-950/10 animate-fadeInUp">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h2 className="font-serif font-bold text-xl text-navy-900">
              Hasil Analisis
            </h2>
            {file && (
              <span className="font-mono text-xs text-slate-400 break-all">{file.name}</span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-center gap-6 bg-gradient-to-br from-navy-50 to-gold-50/30 border border-slate-200 rounded-2xl p-6 mb-6 text-center sm:text-left">
            <ProgressRing percent={hasil.confidence} />
            <div>
              <span className="block text-sm text-slate-500 mb-1">
                Klasifikasi Utama
              </span>
              <h3 className="font-serif font-semibold text-xl text-navy-900">
                {hasil.klasifikasi}
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map((f) => (
              <div
                key={f.key}
                className={`border border-slate-200 rounded-2xl p-5 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 ${
                  f.accent ? "bg-gradient-to-br from-gold-500/5 to-gold-500/10 border-gold-500/20" : "bg-slate-50"
                }`}
              >
                <span className="block text-[11px] font-mono uppercase tracking-wide text-slate-400 mb-2">
                  {f.label}
                </span>
                <h3 className="font-semibold text-navy-900 text-base leading-snug">
                  {hasil[f.key]}
                </h3>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-slate-50 border border-slate-200 rounded-2xl p-5">
            <h3 className="font-semibold text-navy-900 text-sm mb-3">
              Preview Dokumen
            </h3>
            <textarea
              value={hasil.preview_teks}
              readOnly
              rows={12}
              className="w-full bg-white rounded-xl p-4 text-sm text-slate-600 leading-relaxed outline-none ring-1 ring-slate-200 resize-none focus:ring-2 focus:ring-gold-400 transition-all duration-300"
            />
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl p-10 sm:p-14 text-center text-slate-400 hover:shadow-xl transition-shadow duration-500">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="#94a3b8" className="w-12 h-12 mx-auto mb-4 animate-bounce">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25-2.25m-2.25 2.25V6.75" />
          </svg>
          <p className="text-sm">Hasil analisis akan muncul di sini setelah dokumen diproses.</p>
        </div>
      )}
    </div>
  );
}

export default PrediksiSection;