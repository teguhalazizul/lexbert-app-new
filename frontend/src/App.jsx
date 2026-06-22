import { useState } from "react";

function App() {

  const [file, setFile] = useState(null);
  const [hasil, setHasil] = useState(null);
  const [loading, setLoading] = useState(false);

  async function analisisPDF() {

    if (!file) {
      alert("Pilih file PDF terlebih dahulu");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {

      const response = await fetch(
        "http://localhost:8000/predict/pdf",
        {
          method: "POST",
          body: formData
        }
      );

      const data = await response.json();

      setHasil(data);

    } catch (err) {

      console.error(err);
      alert("Gagal upload PDF");

    }

    setLoading(false);
  }

  return (
  <div className="container">

  <div className="header">
    <h1>Klasifikasi Tindak Pidana</h1>
    <p>
      Analisis putusan pengadilan menggunakan model IndoBERT
    </p>
  </div>

  <div className="upload-card">

    <input
      type="file"
      accept=".pdf"
      onChange={(e) => setFile(e.target.files[0])}
    />

    {file && (
      <p className="file-name">
        {file.name}
      </p>
    )}

    <button
      onClick={analisisPDF}
      disabled={loading}
    >
      {loading ? "Memproses..." : "Upload dan Analisis"}
    </button>

  </div>

  {hasil && (
    <div className="hasil">

      <h2>Hasil Analisis</h2>

      <div className="info-grid">

        <div className="card">
          <span>Klasifikasi</span>
          <h3>{hasil.klasifikasi}</h3>
        </div>

        <div className="card">
          <span>Tingkat Keyakinan</span>
          <h3>{hasil.confidence}%</h3>
        </div>

        <div className="card">
          <span>Pasal Dilanggar</span>
          <h3>{hasil.pasal_dilanggar}</h3>
        </div>

        <div className="card">
          <span>Jenis Hukuman</span>
          <h3>{hasil.jenis_hukuman}</h3>
        </div>

        <div className="card">
          <span>Lama Hukuman</span>
          <h3>{hasil.lama_hukuman}</h3>
        </div>

      </div>

      <div className="preview-card">
        <h3>Preview Dokumen</h3>

        <textarea
          value={hasil.preview_teks}
          readOnly
          rows={12}
        />
      </div>

    </div>
  )}

</div>
);
}

export default App;