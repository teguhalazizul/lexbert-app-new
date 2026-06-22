"""
Backend FastAPI untuk Klasifikasi Tindak Pidana
================================================
Fungsi:
1. Load model IndoBERT yang sudah di fine-tuning
2. Terima input teks putusan (dari textbox atau hasil extract PDF)
3. Prediksi klasifikasi (pidana umum / pidana khusus)
4. Ekstraksi pasal, jenis hukuman, lama hukuman dari teks
5. Kembalikan hasil dalam format JSON ke frontend
"""

import re
import pickle
import string

import torch
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import PyPDF2
from nltk.corpus import stopwords
import nltk

nltk.download('stopwords', quiet=True)

# ============================================================
# Inisialisasi FastAPI
# ============================================================
app = FastAPI(title="API Klasifikasi Tindak Pidana")

# Izinkan frontend (React) mengakses backend ini
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # nanti ganti dengan URL frontend kamu saat deploy
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================
# Load Model, Tokenizer, dan Label Encoder (sekali saat server start)
# ============================================================
MODEL_PATH = "./model"
MAX_LEN = 512

print("Memuat model IndoBERT...")
tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_PATH)
model.eval()

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
model.to(DEVICE)

with open("label_encoder.pkl", "rb") as f:
    le = pickle.load(f)

print(f"Model berhasil dimuat. Device: {DEVICE}")
print(f"Label classes: {le.classes_}")

# ============================================================
# Stopwords Bahasa Indonesia (sama seperti saat training)
# ============================================================
stop_words_id = set(stopwords.words("indonesian"))
custom_stopwords = {
    "menimbang", "bahwa", "tersebut", "telah", "adalah",
    "dalam", "dari", "oleh", "pada", "untuk", "ini", "itu"
}
stop_words_id.update(custom_stopwords)


# ============================================================
# Fungsi Preprocessing (sama seperti saat training)
# ============================================================
def clean_text(text: str) -> str:
    text = "".join([c for c in text if c not in string.punctuation])
    text = text.lower()
    text = re.sub(r"[^a-z\s]", " ", text)
    text = " ".join(text.split())
    text = " ".join([w for w in text.split() if w not in stop_words_id])
    return text


# ============================================================
# Fungsi Ekstraksi Pasal
# ============================================================
def extract_pasal(text: str) -> str:
    pasal = re.findall(r"pasal\s+\d+(?:\s+ayat\s+\d+)?", text.lower())
    return ", ".join(sorted(set(pasal))) if pasal else "Tidak ditemukan"


# ============================================================
# Fungsi Ekstraksi Jenis Hukuman
# ============================================================
def extract_jenis_hukuman(text: str) -> str:
    text = text.lower()
    if "seumur hidup" in text:
        return "Pidana Seumur Hidup"
    elif "mati" in text:
        return "Pidana Mati"
    elif "penjara" in text:
        return "Pidana Penjara"
    elif "denda" in text:
        return "Pidana Denda"
    return "Tidak diketahui"


# ============================================================
# Fungsi Ekstraksi Lama Hukuman (dari kalimat teks, bukan atribut)
# ============================================================
def extract_lama_hukuman(text: str) -> str:
    text = text.lower()

    # Pola: "selama 5 (lima) tahun"
    match_tahun = re.search(r"selama\s+(\d+)\s*\(?[a-z\s]*\)?\s*tahun", text)
    match_bulan = re.search(r"selama\s+(\d+)\s*\(?[a-z\s]*\)?\s*bulan", text)

    if match_tahun:
        tahun = match_tahun.group(1)
        return f"{tahun} Tahun"
    elif match_bulan:
        bulan = match_bulan.group(1)
        return f"{bulan} Bulan"
    return "Tidak ditemukan"


# ============================================================
# Fungsi Ekstraksi Teks dari PDF
# ============================================================
def extract_text_from_pdf(file) -> str:
    try:
        reader = PyPDF2.PdfReader(file)
        text = ""
        for page in reader.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted + " "
        return text
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Gagal membaca PDF: {e}")


# ============================================================
# Fungsi Prediksi Utama (dipakai baik untuk textbox maupun PDF)
# ============================================================
def predict_klasifikasi(teks_asli: str) -> dict:
    if not teks_asli or len(teks_asli.strip()) < 20:
        raise HTTPException(
            status_code=400,
            detail="Teks terlalu pendek atau kosong. Pastikan dokumen putusan lengkap."
        )

    # 1. Preprocessing untuk model
    teks_bersih = clean_text(teks_asli)
    teks_bersih = " ".join(teks_bersih.split()[:MAX_LEN])

    # 2. Tokenisasi
    encoding = tokenizer(
        teks_bersih,
        truncation=True,
        padding="max_length",
        max_length=MAX_LEN,
        return_tensors="pt"
    )
    input_ids = encoding["input_ids"].to(DEVICE)
    attention_mask = encoding["attention_mask"].to(DEVICE)

    # 3. Prediksi
    with torch.no_grad():
        outputs = model(input_ids=input_ids, attention_mask=attention_mask)
        logits = outputs.logits
        probs = torch.softmax(logits, dim=-1).cpu().numpy()[0]
        pred_idx = int(probs.argmax())

    klasifikasi = le.inverse_transform([pred_idx])[0]
    confidence = float(probs[pred_idx])

    # 4. Ekstraksi info tambahan dari teks asli (bukan teks_bersih)
    pasal = extract_pasal(teks_asli)
    jenis_hukuman = extract_jenis_hukuman(teks_asli)
    lama_hukuman = extract_lama_hukuman(teks_asli)

    return {
        "klasifikasi": klasifikasi,
        "confidence": round(confidence * 100, 2),
        "pasal_dilanggar": pasal,
        "jenis_hukuman": jenis_hukuman,
        "lama_hukuman": lama_hukuman,
    }


# ============================================================
# Schema Input untuk Endpoint Textbox
# ============================================================
class TeksInput(BaseModel):
    teks: str


# ============================================================
# ENDPOINT 1: Prediksi dari Teks (Copy-Paste / Textbox)
# ============================================================
@app.post("/predict/text")
def predict_dari_teks(data: TeksInput):
    hasil = predict_klasifikasi(data.teks)
    return hasil


# ============================================================
# ENDPOINT 2: Prediksi dari Upload PDF
# ============================================================
@app.post("/predict/pdf")
async def predict_dari_pdf(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="File harus berformat PDF")

    teks_asli = extract_text_from_pdf(file.file)
    hasil = predict_klasifikasi(teks_asli)
    hasil["preview_teks"] = teks_asli[:300] + "..."  # untuk ditampilkan di frontend
    return hasil


# ============================================================
# ENDPOINT 3: Cek Status Server
# ============================================================
@app.get("/")
def root():
    return {"status": "API Klasifikasi Tindak Pidana aktif", "device": DEVICE}